import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { getOpenAIClient, hasOpenAIFallback, OPENAI_MODEL } from "@/lib/openai";
import { LOCALE_LANGUAGE_NAME, resolveLocale } from "@/i18n/locales";
import { checkRateLimit } from "@/lib/rateLimit";
import { clampText, isUuid } from "@/lib/validation";

export const maxDuration = 90;

// Budget di caratteri per il contesto documentale iniettato nel prompt (MVP senza embeddings/vector DB)
const MAX_CONTEXT_CHARS = 250_000;
const HISTORY_LIMIT = 20;
/** Tetto sul messaggio dell'utente: senza, un singolo invio puo' gonfiare il prompt a piacere. */
const MAX_MESSAGE_CHARS = 4000;
/** Massimo 30 messaggi ogni 5 minuti per utente (le chiamate al modello sono a consumo). */
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 5 * 60 * 1000;

type ChatHistoryItem = { role: "user" | "assistant"; content: string };

/**
 * L'API Messages di Anthropic pretende messaggi non vuoti, che iniziano con "user" e con i ruoli
 * alternati. La cronologia salvata non lo garantisce: se una chiamata al modello fallisce dopo che
 * il messaggio dell'utente e' gia' stato scritto a DB, resta un "user" spaiato e da quel momento
 * ogni richiesta successiva verrebbe rifiutata con 400 — la chat di quel veicolo resterebbe rotta
 * per sempre. Qui normalizziamo: scartiamo i vuoti e i messaggi prima del primo "user", e uniamo i
 * ruoli consecutivi invece di perderne il contenuto.
 */
function toAlternatingMessages(items: ChatHistoryItem[]): ChatHistoryItem[] {
  const out: ChatHistoryItem[] = [];

  for (const item of items) {
    const content = (item.content || "").trim();
    if (!content) continue;
    if (out.length === 0 && item.role !== "user") continue;

    const last = out[out.length - 1];
    if (last && last.role === item.role) {
      last.content = `${last.content}\n\n${content}`;
    } else {
      out.push({ role: item.role, content });
    }
  }

  return out;
}

// Fallback su OpenAI se Anthropic non risponde (timeout, errore 5xx, rate limit), cosi'
// l'utente non vede un errore. Scatta solo se OPENAI_API_KEY e' configurata.
async function chatWithOpenAI(systemPrompt: string, messages: ChatHistoryItem[]) {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: 2048,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  return completion.choices[0]?.message?.content || "Non sono riuscito a generare una risposta.";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const tErr = await getTranslations("apiErrors");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: tErr("notAuthenticated") }, { status: 401 });
  }

  const limit = checkRateLimit(`chat:${user.id}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: tErr("rateLimited") },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: { vehicleId?: unknown; message?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: tErr("invalidRequest") }, { status: 400 });
  }

  const message = clampText(body.message, MAX_MESSAGE_CHARS);
  if (!message) {
    return NextResponse.json({ error: tErr("emptyMessage") }, { status: 400 });
  }

  const vehicleId = isUuid(body.vehicleId) ? body.vehicleId : null;
  const locale = typeof body.locale === "string" ? body.locale : undefined;

  const language = LOCALE_LANGUAGE_NAME[resolveLocale(locale)];

  try {
    let docQuery = supabase.from("documents").select("file_name, extracted_text").eq("processed", true);
    if (vehicleId) docQuery = docQuery.eq("vehicle_id", vehicleId);
    const { data: docs } = await docQuery;

    let context = "";
    for (const doc of docs || []) {
      const chunk = `\n\n--- Documento: ${doc.file_name} ---\n${doc.extracted_text || ""}`;
      if (context.length + chunk.length > MAX_CONTEXT_CHARS) break;
      context += chunk;
    }

    let historyQuery = supabase
      .from("chat_messages")
      .select("role, content")
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);
    if (vehicleId) historyQuery = historyQuery.eq("vehicle_id", vehicleId);
    const { data: historyRows } = await historyQuery;
    const history = (historyRows || []).reverse();

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      role: "user",
      content: message,
    });

    const systemPrompt = context
      ? "Sei l'assistente di My Vehicle: rispondi alle domande dell'utente sul proprio veicolo basandoti " +
        "principalmente sui documenti caricati (libretti, manuali di manutenzione, ecc.) riportati sotto. " +
        "Se l'informazione richiesta non è presente nei documenti, dillo chiaramente e poi puoi rispondere " +
        "con la tua conoscenza generale, specificando che non proviene dai documenti caricati. " +
        `Rispondi SEMPRE in ${language}, in modo chiaro e pratico, indipendentemente dalla lingua dei documenti.\n\n` +
        `DOCUMENTI DISPONIBILI:${context}`
      : "Sei l'assistente di My Vehicle. L'utente non ha ancora caricato documenti per questo veicolo: " +
        `rispondi con la tua conoscenza generale su auto e moto, SEMPRE in ${language}, e suggerisci di caricare il ` +
        "libretto d'uso e manutenzione per risposte più precise.";

    const messages = toAlternatingMessages([
      ...(history as ChatHistoryItem[]),
      { role: "user", content: message },
    ]);

    let reply: string;
    try {
      const anthropic = getAnthropicClient();
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      });

      const textBlock = response.content.find((b) => b.type === "text") as
        | { type: "text"; text: string }
        | undefined;
      reply = textBlock?.text || "Non sono riuscito a generare una risposta.";
    } catch (primaryErr) {
      if (!hasOpenAIFallback()) throw primaryErr;
      console.error("Anthropic non disponibile per la chat, uso il fallback OpenAI:", primaryErr);
      reply = await chatWithOpenAI(systemPrompt, messages);
    }

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply, documentsUsed: (docs || []).map((d) => d.file_name) });
  } catch (err) {
    console.error("Errore chat IA:", err);
    return NextResponse.json({ error: tErr("chatError") }, { status: 500 });
  }
}
