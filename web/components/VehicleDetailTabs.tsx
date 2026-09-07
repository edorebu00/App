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
        />
      )}

      {activeResourceTab && (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(query);
            }}
            className="card mb-4 flex gap-2"
          >
            <input
              className="input"
              placeholder="Modello o codice motore…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? "Ricerca…" : hasSearchedOnce ? "Aggiorna" : "Cerca"}
            </button>
          </form>

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          {!loading && !hasSearchedOnce && !error && (
            <p className="mb-3 text-sm text-graphite-500">
              Nessuna ricerca effettuata ancora. Clicca &quot;Cerca&quot; per trovare risorse online su questo veicolo.
            </p>
          )}
          {!loading && summary && (
            <p className="mb-4 whitespace-pre-wrap text-sm text-graphite-300">{summary}</p>
          )}

          <ResourceCategoryView
            category={activeResourceTab.id}
            loading={loading}
            items={results.filter((r) => activeResourceTab.categorie.includes(r.categoria))}
          />
        </div>
      )}
    </div>
  );
}
