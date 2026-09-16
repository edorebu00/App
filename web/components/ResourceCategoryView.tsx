"use client";

import { useTranslations } from "next-intl";
import type { ResourceLink } from "@/lib/types";

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
  const t = useTranslations("resourceCategory");
  const tSearch = useTranslations("search");

  const emptyCopy: Record<string, string> = {
    documenti: t("emptyDocuments"),
    forum: t("emptyForum"),
    video: t("emptyVideo"),
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-graphite-500">
        <span className="spinner text-brand-600" aria-hidden />
        {tSearch("searchingResources")}
      </p>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-graphite-400">{emptyCopy[category]}</p>;
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
              className="font-medium text-brand-600 hover:underline"
            >
              {item.titolo}
            </a>
            <p className="mt-1 text-sm text-graphite-500">{item.descrizione}</p>
          </span>
        </li>
      ))}
    </ul>
  );
}
