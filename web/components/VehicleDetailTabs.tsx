"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import SectionEditor from "./SectionEditor";
import ResourceCategoryView from "./ResourceCategoryView";
import type { ResourceLink, SectionImage, SectionKey, SectionSpecs, VehicleSection } from "@/lib/types";

type ResourceTabId = "documenti" | "forum" | "video";

export default function VehicleDetailTabs({
  vehicleId,
  sections,
  imagesBySection,
  defaultQuery,
  initialResults,
  initialSpecs,
  autoSearch,
}: {
  vehicleId: string;
  sections: VehicleSection[];
  imagesBySection: Record<string, SectionImage[]>;
  defaultQuery: string;
  initialResults: ResourceLink[];
  initialSpecs: SectionSpecs;
  autoSearch: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("vehicleTabs");
  const tSections = useTranslations("sections");
  const tRes = useTranslations("resourceCategory");
  const locale = useLocale();

  const RESOURCE_TABS: Array<{ id: ResourceTabId; label: string; categorie: ResourceLink["categoria"][] }> = [
    { id: "documenti", label: tRes("tabDocuments"), categorie: ["manuale_pdf", "schema_tecnico", "pezzo_ricambio", "catalogo_ricambi", "piano_manutenzione"] },
    { id: "forum", label: tRes("tabForum"), categorie: ["forum"] },
    { id: "video", label: tRes("tabVideo"), categorie: ["video"] },
  ];

  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "documenti");
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<ResourceLink[]>(initialResults);
  const [specs, setSpecs] = useState<SectionSpecs>(initialSpecs);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(initialResults.length > 0);
  const [showSearchBox, setShowSearchBox] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, vehicleId, locale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("errorGeneric"));
      } else {
        setResults(data.risorse || []);
        setSpecs(data.specifiche || {});
        setSummary(data.summary || "");
        setHasSearchedOnce(true);
      }
    } catch {
      setError(t("errorContact"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoSearch && !hasSearchedOnce) {
      runSearch(defaultQuery);
      router.replace(`/veicoli/${vehicleId}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearch]);

  const activeSection = sections.find((s) => s.id === activeId);
  const activeResourceTab = RESOURCE_TABS.find((t) => t.id === activeId);
  const autodocLink = results.find((r) => r.categoria === "catalogo_ricambi");
  const maintenanceLink = results.find((r) => r.categoria === "piano_manutenzione");

  function sectionLabel(s: VehicleSection) {
    const key = s.section_key as SectionKey;
    return tSections.has(key) ? tSections(key) : s.label;
  }

  return (
    <div>
      {(autodocLink || maintenanceLink) && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {autodocLink && (
            <a href={autodocLink.url} target="_blank" rel="noopener noreferrer" className="card-gold-link group">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xl">
                🛒
              </span>
              <span className="min-w-0">
                <span className="block font-display font-semibold text-graphite-900">{t("autodocTitle")}</span>
                <span className="block truncate text-xs text-graphite-500">{autodocLink.titolo}</span>
              </span>
              <span className="ml-auto shrink-0 text-gold-600 opacity-0 transition group-hover:opacity-100">
                ↗
              </span>
            </a>
          )}
          {maintenanceLink && (
            <a href={maintenanceLink.url} target="_blank" rel="noopener noreferrer" className="card-gold-link group">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-xl">
                🛠️
              </span>
              <span className="min-w-0">
                <span className="block font-display font-semibold text-graphite-900">
                  {t("maintenanceTitle")}
                </span>
                <span className="block truncate text-xs text-graphite-500">{maintenanceLink.titolo}</span>
              </span>
              <span className="ml-auto shrink-0 text-gold-600 opacity-0 transition group-hover:opacity-100">
                ↗
              </span>
            </a>
          )}
        </div>
      )}

      {/* Barra di stato/aggiornamento ricerca: sempre visibile, in qualunque tab */}
      <div className="card mb-4">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-graphite-600">
            <span className="spinner text-brand-600" aria-hidden />
            {t("searchingLong")}
          </p>
        ) : !hasSearchedOnce ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-graphite-500">{t("noInfoYet")}</p>
            <button onClick={() => runSearch(query)} className="btn-primary whitespace-nowrap">
              {t("searchOnline")}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-graphite-500">
                {summary ? summary : t("foundInfoDefault")}
              </p>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setShowSearchBox((s) => !s)} className="btn-secondary text-xs">
                  {showSearchBox ? t("closeSearch") : t("searchMore")}
                </button>
                <button onClick={() => runSearch(query)} className="btn-primary text-xs whitespace-nowrap">
                  {t("update")}
                </button>
              </div>
            </div>
            {showSearchBox && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch(query);
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  className="input"
                  placeholder={t("searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  {t("search")}
                </button>
              </form>
            )}
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5 rounded-xl border border-graphite-200 bg-graphite-50 p-1.5">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
              activeId === s.id
                ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                : "text-graphite-600 hover:bg-white hover:text-graphite-900"
            }`}
          >
            {sectionLabel(s)}
          </button>
        ))}
        <span className="mx-1 my-auto h-5 w-px bg-graphite-200" />
        {RESOURCE_TABS.map((rt) => (
          <button
            key={rt.id}
            onClick={() => setActiveId(rt.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
              activeId === rt.id
                ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                : "text-graphite-600 hover:bg-white hover:text-graphite-900"
            }`}
          >
            {rt.label}
          </button>
        ))}
      </div>

      {activeSection && (
        <SectionEditor
          section={activeSection}
          images={imagesBySection[activeSection.id] || []}
          specs={specs[activeSection.section_key as SectionKey]}
          resources={results.filter(
            (r) =>
              r.sezione === activeSection.section_key &&
              ["manuale_pdf", "schema_tecnico", "pezzo_ricambio"].includes(r.categoria)
          )}
          searchPending={loading}
        />
      )}

      {activeResourceTab && (
        <ResourceCategoryView
          category={activeResourceTab.id}
          loading={loading}
          items={results.filter((r) => activeResourceTab.categorie.includes(r.categoria))}
        />
      )}
    </div>
  );
}
