import { Router } from "express";
import type { AuthedRequest } from "../middleware/auth";
import { requireAuth } from "../middleware/auth";
import { anthropic, CLAUDE_MODEL } from "../lib/anthropic";
import { supabaseAdmin } from "../lib/supabase";

export const searchRouter = Router();

interface ResourceLink {
  categoria: "forum" | "manuale_pdf" | "video" | "schema_tecnico" | "altro";
  titolo: string;
  url: string;
  descrizione: string;
}

function extractJson(text: string): ResourceLink[] {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

searchRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const { query, vehicleId } = req.body as { query?: string; vehicleId?: string };

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: "Specifica un modello o un codice motore da cercare." });
  }

  let vehicleContext = "";
  if (vehicleId) {
    const { data: vehicle } = await supabaseAdmin
      .from("vehicles")
      .select("type, make, model, engine_code, year")
      .eq("id", vehicleId)
      .eq("user_id", req.userId)
      .maybeSingle();

    if (vehicle) {
      vehicleContext = `Veicolo di riferimento: ${vehicle.type === "moto" ? "moto" : "auto"} ${vehicle.make} ${vehicle.model}${
        vehicle.year ? ` (${vehicle.year})` : ""
      }${vehicle.engine_code ? `, codice motore ${vehicle.engine_code}` : ""}.`;
    }
  }

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system:
        "Sei un assistente esperto di veicoli (auto e moto) che aiuta gli utenti a trovare risorse utili online. " +
        "Usa lo strumento di ricerca web per trovare risultati REALI e pertinenti nelle seguenti categorie: " +
        "forum dedicati al modello/motore, manuali o PDF di manutenzione/uso, video YouTube utili (tutorial, riparazioni, revisioni), " +
        "e schemi tecnici o viste esplose dei componenti (motore, carrozzeria, assetto, impianto frenante). " +
        "Rispondi in italiano. Alla fine della risposta, includi SEMPRE un blocco ```json``` con un array di oggetti " +
        '{"categoria": "forum|manuale_pdf|video|schema_tecnico|altro", "titolo": "...", "url": "...", "descrizione": "..."} ' +
        "con al massimo 12 risultati, solo URL realmente trovati tramite la ricerca (mai inventati).",
      messages: [
        {
          role: "user",
          content: `${vehicleContext}\nRicerca: ${query}`.trim(),
        },
      ],
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 6,
        } as any,
      ],
    });

    const textBlocks = message.content.filter((b) => b.type === "text") as Array<{ type: "text"; text: string }>;
    const fullText = textBlocks.map((b) => b.text).join("\n");
    const results = extractJson(fullText);

    await supabaseAdmin.from("search_results").insert({
      user_id: req.userId,
      vehicle_id: vehicleId || null,
      query,
      results,
    });

    res.json({ query, results, summary: fullText.replace(/```json[\s\S]*?```/, "").trim() });
  } catch (err) {
    console.error("Errore ricerca IA:", err);
    res.status(500).json({ error: "Errore durante la ricerca. Riprova più tardi." });
  }
});
