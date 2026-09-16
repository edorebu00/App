"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import ResourceCategoryView from "./ResourceCategoryView";
import type { ResourceLink } from "@/lib/types";

export default function GlobalSearch() {
  const t = useTranslations("search");
  const tRes = useTranslations("resourceCategory");
  const locale = useLocale();

  const TABS: Array<{ id: "documenti" | "forum" | "video"; label: string; categorie: ResourceLink["categoria"][] }> = [
    { id: "documenti", label: tRes("tabDocuments"), categorie: ["manuale_pdf", "schema_tecnico", "pezzo_ricambio", "catalogo_ricambi", "piano_manutenzione"] },
    { id: "forum", label: tRes("tabForum"), categorie: ["forum"] },
    { id: "video", label: tRes("tabVideo"), categorie: ["video"] },
  ];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResourceLink[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, locale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("errorGeneric"));
      } else {
        setResults(data.risorse || []);
        setSummary(data.summary || "");
        setSearched(true);
      }
    } catch {
      setError(t("errorContact"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="glass-panel flex gap-2 p-4">
        <input
          className="input"
          placeholder={t("placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" aria-hidden />
              {t("searching")}
            </span>
          ) : (
            t("searchButton")
          )}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {!loading && summary && <p className="mt-4 whitespace-pre-wrap text-sm text-graphite-600">{summary}</p>}

      {(searched || loading) &&
        TABS.map((tab) => (
          <div key={tab.id} className="mt-6">
            <h3 className="eyebrow mb-2">{tab.label}</h3>
            <ResourceCategoryView
              category={tab.id}
              loading={loading}
              items={results.filter((r) => tab.categorie.includes(r.categoria))}
            />
          </div>
        ))}
    </div>
  );
}
