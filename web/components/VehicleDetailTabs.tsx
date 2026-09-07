"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionEditor from "./SectionEditor";
import ResourceCategoryView from "./ResourceCategoryView";
import type { ResourceLink, SectionImage, SectionKey, SectionSpecs, VehicleSection } from "@/lib/types";

type ResourceTabId = "documenti" | "forum" | "video";
const RESOURCE_TABS: Array<{ id: ResourceTabId; label: string; categorie: ResourceLink["categoria"][] }> = [
  { id: "documenti", label: "📄 Documenti", categorie: ["manuale_pdf", "schema_tecnico", "pezzo_ricambio"] },
  { id: "forum", label: "💬 Forum", categorie: ["forum"] },
  { id: "video", label: "🎥 Video", categorie: ["video"] },
];

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
        body: JSON.stringify({ query: q, vehicleId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante la ricerca.");
      } else {
        setResults(data.risorse || []);
        setSpecs(data.specifiche || {});
        setSummary(data.summary || "");
        setHasSearchedOnce(true);
      }
    } catch {
      setError("Impossibile contattare il servizio di ricerca. Riprova più tardi.");
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

  return (
    <div>
      {/* Barra di stato/aggiornamento ricerca: sempre visibile, in qualunque tab */}
      <div className="card mb-4">
        {loading ? (
          <p className="text-sm text-graphite-300">
            🔎 L&apos;agente IA sta cercando informazioni online… di solito serve mezzo minuto circa.
          </p>
        ) : !hasSearchedOnce ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-graphite-400">Nessuna informazione trovata ancora per questo veicolo.</p>
            <button onClick={() => runSearch(query)} className="btn-primary whitespace-nowrap">
              🔍 Cerca informazioni online
            </button>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-graphite-400">
                {summary ? summary : "Informazioni trovate online per questo veicolo."}
              </p>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setShowSearchBox((s) => !s)} className="btn-secondary text-xs">
                  {showSearchBox ? "Chiudi" : "Cerca altro"}
                </button>
                <button onClick={() => runSearch(query)} className="btn-primary text-xs whitespace-nowrap">
                  🔄 Aggiorna
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
                  placeholder="Modello, motorizzazione, o cosa cercare…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Cerca
                </button>
              </form>
            )}
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-graphite-700 pb-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              activeId === s.id ? "bg-brand-600 text-white" : "text-graphite-300 hover:bg-graphite-700"
            }`}
          >
            {s.label}
          </button>
        ))}
        <span className="mx-1 my-auto h-5 w-px bg-graphite-700" />
        {RESOURCE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              activeId === t.id ? "bg-brand-600 text-white" : "text-graphite-300 hover:bg-graphite-700"
            }`}
          >
            {t.label}
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
