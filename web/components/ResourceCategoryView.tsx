"use client";

import type { ResourceLink } from "@/lib/types";

const EMPTY_COPY: Record<string, string> = {
  documenti: "Nessun documento trovato online per questo veicolo.",
  forum: "Nessun forum trovato online per questo veicolo.",
  video: "Nessun video trovato online per questo veicolo.",
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
    return <p className="text-sm text-graphite-400">L&apos;agente IA sta cercando risorse online…</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-graphite-500">{EMPTY_COPY[category]}</p>;
  }

  return (
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
          <p className="mt-1 text-sm text-graphite-400">{item.descrizione}</p>
        </li>
      ))}
    </ul>
  );
}
