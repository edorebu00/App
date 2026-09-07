import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import type { EngineVariant, VehicleType } from "@/lib/types";

export const maxDuration = 90;

function extractVariants(text: string): EngineVariant[] | null {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\[[\s\S]*\])/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((v) => v && typeof v.label === "string" && typeof v.yearFrom === "number")
      .map((v) => ({
        label: v.label,
        yearFrom: v.yearFrom,
        yearTo: typeof v.yearTo === "number" ? v.yearTo : null,
      }));
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

  const { type, make, model } = (await request.json()) as {
    type?: VehicleType;
    make?: string;
    model?: string;
  };

  if (!type || !make || !model) {
    return NextResponse.json({ error: "Parametri mancanti." }, { status: 400 });
  }

  // 1) Cache: se un altro utente le ha gia' cercate, sono gia' pronte all'istante.
  const { data: cached } = await supabase
    .from("engine_variants_cache")
    .select("variants")
    .eq("vehicle_type", type)
    .eq("make", make)
    .eq("model", model)
    .maybeSingle();

  if (cached) {
    return NextResponse.json({ variants: cached.variants as EngineVariant[], fromCache: true });
  }

  // 2) Nessuna cache: chiedi all'agente IA di cercarle sul web ora.
  try {
    const anthropic = getAnthropicClient();

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      system:
        "Sei un esperto di veicoli. Ti viene chiesto marca e modello di un veicolo (" +
        (type === "moto" ? "moto" : "auto") +
        "). Usa la ricerca web per trovare le motorizzazioni realmente esistite per questo modello " +
        "(es. cilindrata, alimentazione, potenza in CV) con il relativo periodo di produzione (anno di inizio " +
        "e, se conclusa, anno di fine — altrimenti null se ancora in produzione o recente). Includi le " +
        "generazioni principali del modello se ce ne sono state più di una. Fai al massimo 3 ricerche mirate, " +
        "poi rispondi SOLO con un blocco ```json``` contenente un array (max 20 elementi) con questa forma " +
        'esatta, senza altro testo: [{"label": "1.6 MultiJet 120cv", "yearFrom": 2015, "yearTo": 2020}]. ' +
        "Usa solo dati che trovi plausibili dalla ricerca; se il modello è troppo raro o non lo trovi, " +
        "restituisci un array vuoto [].",
      messages: [{ role: "user", content: `Marca: ${make}\nModello: ${model}` }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 } as any],
    });

    const textBlocks = message.content.filter((b) => b.type === "text") as Array<{ type: "text"; text: string }>;
    const fullText = textBlocks.map((b) => b.text).join("\n");
    const variants = extractVariants(fullText);

    if (variants === null) {
      console.error(`Motorizzazioni: JSON non estraibile (stop_reason=${message.stop_reason}).`);
      return NextResponse.json({ error: "Ricerca motorizzazioni non riuscita." }, { status: 502 });
    }

    if (variants.length > 0) {
      await supabase.from("engine_variants_cache").insert({
        vehicle_type: type,
        make,
        model,
        variants,
      });
    }

    return NextResponse.json({ variants, fromCache: false });
  } catch (err) {
    console.error("Errore ricerca motorizzazioni:", err);
    return NextResponse.json({ error: "Errore durante la ricerca delle motorizzazioni." }, { status: 500 });
  }
}
