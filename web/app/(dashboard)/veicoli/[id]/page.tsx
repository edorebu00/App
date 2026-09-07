import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VehicleTabs from "@/components/VehicleTabs";
import type { SectionImage, Vehicle, VehicleSection } from "@/lib/types";

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!vehicle) notFound();

  const { data: sections } = await supabase
    .from("vehicle_sections")
    .select("*")
    .eq("vehicle_id", id)
    .order("created_at", { ascending: true });

  const sectionIds = (sections || []).map((s) => s.id);
  const { data: images } = sectionIds.length
    ? await supabase.from("section_images").select("*").in("section_id", sectionIds)
    : { data: [] as SectionImage[] };

  const imagesBySection: Record<string, SectionImage[]> = {};
  for (const img of (images || []) as SectionImage[]) {
    imagesBySection[img.section_id] = imagesBySection[img.section_id] || [];
    imagesBySection[img.section_id].push(img);
  }

  const v = vehicle as Vehicle;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {v.type === "moto" ? "Moto" : "Auto"}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-slate-800">
            {v.make} {v.model} {v.year ? `(${v.year})` : ""}
          </h1>
          <p className="text-sm text-slate-500">
            {v.engine_code && <>Codice motore: {v.engine_code} · </>}
            {v.plate && <>Targa: {v.plate}</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/veicoli/${v.id}/ricerca`} className="btn-secondary">
            🔍 Ricerca
          </Link>
          <Link href={`/veicoli/${v.id}/documenti`} className="btn-primary">
            📄 Documenti e chat
          </Link>
        </div>
      </div>

      <VehicleTabs sections={(sections || []) as VehicleSection[]} imagesBySection={imagesBySection} />
    </div>
  );
}
