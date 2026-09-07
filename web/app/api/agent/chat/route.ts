import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";

export const maxDuration = 60;

// Budget di caratteri per il contesto documentale iniettato nel prompt (MVP senza embeddings/vector DB)
const MAX_CONTEXT_CHARS = 250_000;
const HISTORY_LIMIT = 20;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { vehicleId, message } = (await request.json()) as { vehicleId?: string; message?: string };

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Il messaggio non può essere vuoto." }, { status: 400 });
  }

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
        "Rispondi sempre in italiano, in modo chiaro e pratico.\n\n" +
        `DOCUMENTI DISPONIBILI:${context}`
      : "Sei l'assistente di My Vehicle. L'utente non ha ancora caricato documenti per questo veicolo: " +
        "rispondi con la tua conoscenza generale su auto e moto, in italiano, e suggerisci di caricare il " +
        "libretto d'uso e manutenzione per risposte più precise.";

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

    const textBlock = response.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
    const reply = textBlock?.text || "Non sono riuscito a generare una risposta.";

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      vehicle_id: vehicleId || null,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply, documentsUsed: (docs || []).map((d) => d.file_name) });
  } catch (err) {
    console.error("Errore chat IA:", err);
    return NextResponse.json({ error: "Errore durante la generazione della risposta. Riprova più tardi." }, { status: 500 });
  }
}
