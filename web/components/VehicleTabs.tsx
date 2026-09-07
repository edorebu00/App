"use client";

import { useState } from "react";
import SectionEditor from "./SectionEditor";
import type { SectionImage, VehicleSection } from "@/lib/types";

export default function VehicleTabs({
  sections,
  imagesBySection,
}: {
  sections: VehicleSection[];
  imagesBySection: Record<string, SectionImage[]>;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const active = sections.find((s) => s.id === activeId) || sections[0];

  if (!active) return null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              active.id === s.id ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SectionEditor section={active} images={imagesBySection[active.id] || []} />
    </div>
  );
}
