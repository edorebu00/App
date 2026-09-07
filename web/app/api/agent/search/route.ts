import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import type { SearchPayload } from "@/lib/types";

// La ricerca fa alcune chiamate allo strumento web_search piu' la generazione delle
// specifiche per sezione: teniamo un margine oltre alla durata attesa (~20-40s), il piano
// Hobby di Vercel supporta funzioni fino a 300s.
export const maxDuration = 120;

// Ritorna null se il blocco JSON non c'e' o non e' valido, cosi' chi chiama puo' distinguere
// "l'IA ha risposto ma non ha trovato nulla" (array vuoti, ok) da "la risposta e' incompleta/rotta"
// (es. troncata per max_tokens), che va segnalata come errore invece di sembrare un risultato vuoto.
function extractPayload(text: string): SearchPayload | null {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    return {
      risorse: Array.isArray(parsed.risorse) ? parsed.risorse : [],
      specifiche: typeof parsed.specifiche === "object" && parsed.specifiche ? parsed.specifiche : {},
    };
  } catch {
    return null;
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
      max_tokens: 5500,
      system:
        "Sei l'assistente tecnico di My Vehicle. Quando un utente aggiunge un veicolo, il tuo compito è " +
        "riempire SUBITO le sue schede (Motore, Carrozzeria, Assetto, Impianto frenante, Trasmissione, " +
        "Elettronica) con informazioni utili, cosi' l'utente trova già tutto pronto senza dover compilare nulla " +
        "a mano. Usa lo strumento di ricerca web per trovare forum dedicati, manuali/PDF di manutenzione, video " +
        "YouTube (tutorial/riparazioni/revisioni), schemi tecnici/viste esplose, e negozi/cataloghi di pezzi di " +
        "ricambio pertinenti al modello e alla motorizzazione indicati. L'utente è in attesa: sii efficiente, fai " +
        "al massimo 3-4 ricerche mirate (non ripetere ricerche simili) e vai dritto al risultato senza divagare.\n\n" +
        "REGOLA IMPORTANTE su \"sezione\": per OGNI risultato scegli la sezione più specifica possibile tra " +
        "motore, carrozzeria, assetto, impianto_frenante, trasmissione, elettronica. Usa 'generale' SOLO come " +
        "ultima risorsa se davvero non è riconducibile a nessuna di queste (es. un forum generale sul marchio). " +
        "Distribuisci i risultati: non mettere tutto in una sola sezione, cerca di coprire più sezioni possibili " +
        "(motore e impianto_frenante hanno quasi sempre pezzi di ricambio e documentazione dedicati).\n\n" +
        "REGOLA IMPORTANTE su \"specifiche\": è OBBLIGATORIO valorizzare 'motore' e, quando pertinente, anche " +
        "'carrozzeria', 'assetto', 'impianto_frenante', 'trasmissione' con 3-6 voci ciascuna, usando la ricerca " +
        "web E la tua conoscenza generale del modello/motorizzazione indicati. Se non trovi un dato preciso al " +
        "100%, fornisci comunque il valore tipico/più diffuso per quella motorizzazione (es. potenza dichiarata " +
        "dal costruttore, tipo di sospensioni di serie per quel modello) invece di lasciare la sezione vuota: " +
        "è preferibile un'informazione indicativa utile piuttosto che nessuna informazione. Non inventare però " +
        "numeri specifici e mai visti per un veicolo generico: se il modello è troppo raro o sconosciuto per " +
        "avere dati plausibili, in quel caso ometti solo quella singola voce.\n\n" +
        "Rispondi in italiano con un riepilogo testuale di massimo 2-3 frasi, poi termina SEMPRE con un blocco ```json``` " +
        "contenente UN SOLO oggetto con questa forma esatta:\n" +
        '{"risorse": [{"categoria": "forum|manuale_pdf|video|schema_tecnico|pezzo_ricambio|altro", ' +
        '"sezione": "motore|carrozzeria|assetto|impianto_frenante|trasmissione|elettronica|generale", ' +
        '"titolo": "...", "url": "...", "descrizione": "..."}], ' +
        '"specifiche": {"motore": {"Cilindrata": "1998 cc", "Potenza": "150 CV"}, "carrozzeria": {...}, ' +
        '"assetto": {...}, "impianto_frenante": {...}, "trasmissione": {...}}}\n' +
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
          max_uses: 4,
        } as any,
      ],
    });

    const textBlocks = message.content.filter((b) => b.type === "text") as Array<{ type: "text"; text: string }>;
    const fullText = textBlocks.map((b) => b.text).join("\n");
    const payload = extractPayload(fullText);

    if (!payload) {
      console.error(
        `Ricerca IA: JSON non estraibile dalla risposta (stop_reason=${message.stop_reason}). ` +
          `Testo (primi 500 caratteri): ${fullText.slice(0, 500)}`
      );
      return NextResponse.json(
        {
          error:
            message.stop_reason === "max_tokens"
              ? "La ricerca ha prodotto troppi risultati ed è stata interrotta. Riprova con una ricerca più specifica."
              : "La ricerca non ha prodotto un risultato utilizzabile. Riprova.",
        },
        { status: 502 }
      );
    }

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
