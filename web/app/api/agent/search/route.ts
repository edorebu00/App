import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import type { SearchPayload } from "@/lib/types";

export const maxDuration = 60;

function extractPayload(text: string): SearchPayload {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (!match) return { risorse: [], specifiche: {} };
  try {
    const parsed = JSON.parse(match[1]);
    return {
      risorse: Array.isArray(parsed.risorse) ? parsed.risorse : [],
      specifiche: typeof parsed.specifiche === "object" && parsed.specifiche ? parsed.specifiche : {},
    };
  } catch {
    return { risorse: [], specifiche: {} };
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { query, vehicleId } = (await request.json()) as { query?: string; vehicleId?: string };

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: "Specifica un modello o un codice motore da cercare." }, { status: 400 });
  }

  let vehicleContext = "";
  if (vehicleId) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("type, make, model, engine_code, year")
      .eq("id", vehicleId)
      .maybeSingle();

    if (vehicle) {
      vehicleContext = `Veicolo di riferimento: ${vehicle.type === "moto" ? "moto" : "auto"} ${vehicle.make} ${vehicle.model}${
        vehicle.year ? ` (${vehicle.year})` : ""
      }${vehicle.engine_code ? `, motorizzazione ${vehicle.engine_code}` : ""}.`;
    }
  }

  try {
    const anthropic = getAnthropicClient();

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 6000,
      system:
        "Sei un assistente esperto di veicoli (auto e moto) che aiuta gli utenti a trovare risorse utili online. " +
        "Usa lo strumento di ricerca web per trovare risultati REALI e pertinenti nelle seguenti categorie: " +
        "forum dedicati al modello/motore, manuali o PDF di manutenzione/uso, video YouTube utili (tutorial, riparazioni, revisioni), " +
        "schemi tecnici o viste esplose dei componenti, e negozi/cataloghi con pezzi di ricambio pertinenti. " +
        "Per ciascun risultato indica anche a quale sezione del veicolo si riferisce principalmente, scegliendo tra: " +
        "motore, carrozzeria, assetto, impianto_frenante, trasmissione, elettronica, generale (usa 'generale' se il " +
        "risultato copre il veicolo nel suo complesso, es. un forum generico o il manuale d'uso completo).\n\n" +
        "Inoltre, SOLO se riesci a determinarle con ragionevole certezza dai risultati di ricerca (non inventare mai " +
        "valori), compila un piccolo riepilogo di specifiche tecniche per sezione: per 'motore' es. cilindrata, potenza, " +
        "coppia, alimentazione; per 'carrozzeria' es. numero porte, lunghezza, bagagliaio; per 'assetto' es. tipo " +
        "sospensioni anteriori/posteriori; per 'impianto_frenante' es. tipo freni anteriori/posteriori; per " +
        "'trasmissione' es. tipo cambio, trazione. Se non trovi dati affidabili per una sezione, ometti quella chiave " +
        "(non lasciare valori vuoti o inventati).\n\n" +
        "Rispondi in italiano con un breve riepilogo testuale, poi termina SEMPRE con un blocco ```json``` contenente " +
        "UN SOLO oggetto con questa forma esatta:\n" +
        '{"risorse": [{"categoria": "forum|manuale_pdf|video|schema_tecnico|pezzo_ricambio|altro", ' +
        '"sezione": "motore|carrozzeria|assetto|impianto_frenante|trasmissione|elettronica|generale", ' +
        '"titolo": "...", "url": "...", "descrizione": "..."}], ' +
        '"specifiche": {"motore": {"Cilindrata": "1998 cc"}, "carrozzeria": {}, ...}}\n' +
        "Massimo 15 elementi in \"risorse\", solo URL realmente trovati tramite la ricerca (mai inventati).",
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
    const payload = extractPayload(fullText);

    await supabase.from("search_results").insert({
      user_id: user.id,
      vehicle_id: vehicleId || null,
      query,
      results: payload,
    });

    return NextResponse.json({
      query,
      risorse: payload.risorse,
      specifiche: payload.specifiche,
      summary: fullText.replace(/```json[\s\S]*?```/, "").trim(),
    });
  } catch (err) {
    console.error("Errore ricerca IA:", err);
    return NextResponse.json({ error: "Errore durante la ricerca. Riprova più tardi." }, { status: 500 });
  }
}
