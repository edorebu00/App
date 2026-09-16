import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { getOpenAIClient, hasOpenAIFallback, OPENAI_MODEL } from "@/lib/openai";
import { LOCALE_LANGUAGE_NAME, resolveLocale } from "@/i18n/locales";

export const maxDuration = 90;

// Budget di caratteri per il contesto documentale iniettato nel prompt (MVP senza embeddings/vector DB)
const MAX_CONTEXT_CHARS = 250_000;
const HISTORY_LIMIT = 20;

type ChatHistoryItem = { role: "user" | "assistant"; content: string };

// Fallback su OpenAI se Anthropic non risponde (timeout, errore 5xx, rate limit), cosi'
// l'utente non vede un errore. Scatta solo se OPENAI_API_KEY e' configurata.
async function chatWithOpenAI(systemPrompt: string, history: ChatHistoryItem[], message: string) {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: 2048,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
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

  const { vehicleId, message, locale } = (await request.json()) as {
    vehicleId?: string;
    message?: string;
    locale?: string;
  };

  if (!message || !message.trim()) {
    return NextResponse.json({ error: tErr("emptyMessage") }, { status: 400 });
  }

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
      vehicle_id: vehicleId || null,
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

    let reply: string;
    try {
      const anthropic = getAnthropicClient();
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
          { role: "user" as const, content: message },
        ],
      });

      const textBlock = response.content.find((b) => b.type === "text") as
        | { type: "text"; text: string }
        | undefined;
      reply = textBlock?.text || "Non sono riuscito a generare una risposta.";
    } catch (primaryErr) {
      if (!hasOpenAIFallback()) throw primaryErr;
      console.error("Anthropic non disponibile per la chat, uso il fallback OpenAI:", primaryErr);
      reply = await chatWithOpenAI(systemPrompt, history as ChatHistoryItem[], message);
    }

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      vehicle_id: vehicleId || null,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply, documentsUsed: (docs || []).map((d) => d.file_name) });
  } catch (err) {
    console.error("Errore chat IA:", err);
    return NextResponse.json({ error: tErr("chatError") }, { status: 500 });
  }
}
