import { Router } from "express";
import type { AuthedRequest } from "../middleware/auth";
import { requireAuth } from "../middleware/auth";
import { anthropic, CLAUDE_MODEL } from "../lib/anthropic";
import { supabaseAdmin } from "../lib/supabase";

export const chatRouter = Router();

// Budget di caratteri per il contesto documentale iniettato nel prompt (MVP senza embeddings/vector DB)
const MAX_CONTEXT_CHARS = 250_000;
const HISTORY_LIMIT = 20;

chatRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const { vehicleId, message } = req.body as { vehicleId?: string; message?: string };

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Il messaggio non può essere vuoto." });
  }

  try {
    let docQuery = supabaseAdmin
      .from("documents")
      .select("file_name, extracted_text")
      .eq("user_id", req.userId)
      .eq("processed", true);

    if (vehicleId) {
      docQuery = docQuery.eq("vehicle_id", vehicleId);
    }

    const { data: docs } = await docQuery;

    let context = "";
    for (const doc of docs || []) {
      const chunk = `\n\n--- Documento: ${doc.file_name} ---\n${doc.extracted_text || ""}`;
      if (context.length + chunk.length > MAX_CONTEXT_CHARS) break;
      context += chunk;
    }

    let historyQuery = supabaseAdmin
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    if (vehicleId) {
      historyQuery = historyQuery.eq("vehicle_id", vehicleId);
    }

    const { data: historyRows } = await historyQuery;
    const history = (historyRows || []).reverse();

    await supabaseAdmin.from("chat_messages").insert({
      user_id: req.userId,
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

    await supabaseAdmin.from("chat_messages").insert({
      user_id: req.userId,
      vehicle_id: vehicleId || null,
      role: "assistant",
      content: reply,
    });

    res.json({ reply, documentsUsed: (docs || []).map((d) => d.file_name) });
  } catch (err) {
    console.error("Errore chat IA:", err);
    res.status(500).json({ error: "Errore durante la generazione della risposta. Riprova più tardi." });
  }
});
