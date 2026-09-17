import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import VehicleDetailTabs from "@/components/VehicleDetailTabs";
import DeleteVehicleButton from "@/components/DeleteVehicleButton";
import type { ResourceLink, SectionImage, SectionSpecs, Vehicle, VehicleSection } from "@/lib/types";

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
  const t = await getTranslations("vehicleDetail");

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
    .select("results, created_at")
    .eq("vehicle_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Compatibile sia con il vecchio formato (un array di risorse) sia con quello nuovo
  // (oggetto { risorse, specifiche }), per non rompere ricerche fatte prima di questo aggiornamento.
  const rawResults = lastSearch?.results;
  const initialResults: ResourceLink[] = Array.isArray(rawResults) ? rawResults : rawResults?.risorse || [];
  const initialSpecs: SectionSpecs = Array.isArray(rawResults) ? {} : rawResults?.specifiche || {};

  const v = vehicle as Vehicle;
  const defaultQuery = [v.make, v.model, v.engine_code].filter(Boolean).join(" ");

  return (
    <div>
      <div className="hero-panel mb-8 px-6 py-8">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{v.type === "moto" ? t("moto") : t("auto")}</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">
              {v.make} {v.model} {v.year ? `(${v.year})` : ""}
            </h1>
            <p className="mt-1 text-sm text-graphite-500">
              {v.engine_code && <>{t("engineLabel")}: {v.engine_code} · </>}
              {v.plate && <>{t("plateLabel")}: {v.plate}</>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/veicoli/${v.id}/documenti`} className="btn-primary">
              {t("documentsAndChat")}
            </Link>
            <DeleteVehicleButton vehicleId={v.id} label={`${v.make} ${v.model}`} />
          </div>
        </div>
      </div>

      <VehicleDetailTabs
        vehicleId={v.id}
        make={v.make}
        model={v.model}
        sections={(sections || []) as VehicleSection[]}
        imagesBySection={imagesBySection}
        defaultQuery={defaultQuery}
        initialResults={initialResults}
        initialSpecs={initialSpecs}
        initialBollo={v.bollo_stimato}
        autoSearch={autosearch === "1"}
      />
    </div>
  );
}
