import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SearchPanel from "@/components/SearchPanel";
import type { Vehicle } from "@/lib/types";

export default async function VehicleSearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vehicle } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();

  if (!vehicle) notFound();

  const v = vehicle as Vehicle;
  const defaultQuery = v.engine_code || `${v.make} ${v.model}`;

  return (
    <div>
      <Link href={`/veicoli/${v.id}`} className="mb-4 inline-block text-sm text-slate-500 hover:underline">
        ← Torna a {v.make} {v.model}
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Ricerca risorse online</h1>
      <p className="mb-6 text-sm text-slate-500">
        Inserisci il modello o il codice motore: l&apos;agente IA cercherà forum, manuali PDF, video e schemi
        tecnici pertinenti.
      </p>
      <SearchPanel vehicleId={v.id} defaultQuery={defaultQuery} />
    </div>
  );
}
