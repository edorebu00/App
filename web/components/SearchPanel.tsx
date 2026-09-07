"use client";

import { useState } from "react";
import type { ResourceLink } from "@/lib/types";

const CATEGORY_LABELS: Record<ResourceLink["categoria"], string> = {
  forum: "💬 Forum",
  manuale_pdf: "📄 Manuali e PDF",
  video: "▶️ Video",
  schema_tecnico: "🔧 Schemi tecnici / esplosi",
  altro: "🔗 Altro",
};

export default function SearchPanel({ vehicleId, defaultQuery }: { vehicleId: string; defaultQuery: string }) {
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResourceLink[]>([]);
  const [summary, setSummary] = useState<string>("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, vehicleId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante la ricerca.");
      } else {
        setResults(data.results || []);
        setSummary(data.summary || "");
      }
    } catch {
      setError("Impossibile contattare il servizio di ricerca. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  const grouped = results.reduce<Record<string, ResourceLink[]>>((acc, r) => {
    acc[r.categoria] = acc[r.categoria] || [];
    acc[r.categoria].push(r);
    return acc;
  }, {});

  return (
    <div>
      <form onSubmit={handleSearch} className="card flex gap-2">
        <input
          className="input"
          placeholder="Modello o codice motore (es. CAHA, K20A, 500 Abarth 1.4 T-Jet…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? "Ricerca…" : "Cerca"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading && <p className="mt-4 text-sm text-slate-500">L&apos;agente IA sta cercando risorse online…</p>}

      {!loading && summary && <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">{summary}</p>}

      {Object.entries(grouped).map(([categoria, items]) => (
        <div key={categoria} className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            {CATEGORY_LABELS[categoria as ResourceLink["categoria"]] || categoria}
          </h3>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="card">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-600 hover:underline"
                >
                  {item.titolo}
                </a>
                <p className="mt-1 text-sm text-slate-500">{item.descrizione}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
