import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VehicleDetailTabs from "@/components/VehicleDetailTabs";
import type { ResourceLink, SectionImage, Vehicle, VehicleSection } from "@/lib/types";

export default async function VehicleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ autosearch?: string }>;
}) {
  const { id } = await params;
  const { autosearch } = await searchParams;
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

  const { data: lastSearch } = await supabase
    .from("search_results")
    .select("query, results, created_at")
    .eq("vehicle_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const v = vehicle as Vehicle;
  const defaultQuery = [v.make, v.model, v.engine_code].filter(Boolean).join(" ");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-400">
            {v.type === "moto" ? "Moto" : "Auto"}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-graphite-50">
            {v.make} {v.model} {v.year ? `(${v.year})` : ""}
          </h1>
          <p className="text-sm text-graphite-400">
            {v.engine_code && <>Motorizzazione: {v.engine_code} · </>}
            {v.plate && <>Targa: {v.plate}</>}
          </p>
        </div>
        <Link href={`/veicoli/${v.id}/documenti`} className="btn-primary">
          📤 I miei documenti e chat
        </Link>
      </div>

      <VehicleDetailTabs
        vehicleId={v.id}
        sections={(sections || []) as VehicleSection[]}
        imagesBySection={imagesBySection}
        defaultQuery={defaultQuery}
        initialResults={(lastSearch?.results as ResourceLink[]) || []}
        initialSummary=""
        autoSearch={autosearch === "1"}
      />
    </div>
  );
}
