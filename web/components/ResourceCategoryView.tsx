"use client";

import type { ResourceLink } from "@/lib/types";

const EMPTY_COPY: Record<string, string> = {
  documenti: "Nessun documento trovato online per questo veicolo.",
  forum: "Nessun forum trovato online per questo veicolo.",
  video: "Nessun video trovato online per questo veicolo.",
};

const CATEGORY_ICON: Record<ResourceLink["categoria"], string> = {
  forum: "💬",
  manuale_pdf: "📕",
  video: "🎬",
  schema_tecnico: "🗺️",
  pezzo_ricambio: "🔧",
  catalogo_ricambi: "🛒",
  piano_manutenzione: "🛠️",
  altro: "🔗",
};

export default function ResourceCategoryView({
  category,
  items,
  loading,
}: {
  category: "documenti" | "forum" | "video";
  items: ResourceLink[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-graphite-400">
        <span className="spinner text-gold-500" aria-hidden />
        L&apos;agente IA sta cercando risorse online…
      </p>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-graphite-500">{EMPTY_COPY[category]}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="card flex items-start gap-3">
          <span className="mt-0.5 text-xl" aria-hidden>
            {CATEGORY_ICON[item.categoria] || "🔗"}
          </span>
          <span className="min-w-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold-500 hover:underline"
            >
              {item.titolo}
            </a>
            <p className="mt-1 text-sm text-graphite-400">{item.descrizione}</p>
          </span>
        </li>
      ))}
    </ul>
  );
}
