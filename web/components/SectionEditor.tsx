"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { ResourceLink, SectionImage, SectionKey, VehicleSection } from "@/lib/types";

interface Props {
  section: VehicleSection;
  images: SectionImage[];
  /** Specifiche trovate online dall'agente IA per questa sezione (sola lettura). */
  specs?: Record<string, string>;
  /** Documenti/pezzi di ricambio trovati online e pertinenti a questa sezione. */
  resources?: ResourceLink[];
  /** true mentre è in corso una ricerca/aggiornamento (mostra uno stato di attesa). */
  searchPending?: boolean;
}

export default function SectionEditor({ section, images: initialImages, specs, resources, searchPending }: Props) {
  const supabase = createClient();
  const t = useTranslations("sectionEditor");
  const tSections = useTranslations("sections");
  const hasOwnData = Object.keys(section.data || {}).length > 0 || !!section.notes || initialImages.length > 0;

  const sectionKey = section.section_key as SectionKey;
  const label = tSections.has(sectionKey) ? tSections(sectionKey) : section.label;

  const [fields, setFields] = useState<Array<[string, string]>>(
    Object.entries(section.data || {}).length ? Object.entries(section.data) : [["", ""]]
  );
  const [notes, setNotes] = useState(section.notes || "");
  const [images, setImages] = useState(initialImages);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showOwnData, setShowOwnData] = useState(hasOwnData);

  function updateField(index: number, key: string, value: string) {
    setFields((prev) => prev.map((f, i) => (i === index ? [key, value] : f)));
  }

  function addField() {
    setFields((prev) => [...prev, ["", ""]]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const data = Object.fromEntries(fields.filter(([k]) => k.trim() !== ""));

    const { error } = await supabase
      .from("vehicle_sections")
      .update({ data, notes, updated_at: new Date().toISOString() })
      .eq("id", section.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploading(false);
      return;
    }

    const path = `${user.id}/${section.vehicle_id}/${section.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(path, file);

    if (!uploadError) {
      const { data: row } = await supabase
        .from("section_images")
        .insert({ section_id: section.id, storage_path: path, source: "upload", caption: file.name })
        .select()
        .single();

      if (row) setImages((prev) => [...prev, row as SectionImage]);
    }

    setUploading(false);
    e.target.value = "";
  }

  const hasWebData = (specs && Object.keys(specs).length > 0) || (resources && resources.length > 0);

  return (
    <div className="card">
      <h2 className="mb-4 font-display text-lg font-semibold text-graphite-900">{label}</h2>

      <div className="glass-panel mb-5 p-4">
        <p className="eyebrow mb-3">{t("foundOnlineEyebrow")}</p>

        {hasWebData ? (
          <>
            {specs && Object.keys(specs).length > 0 && (
              <dl className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Object.entries(specs).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-graphite-200 bg-graphite-50 px-3 py-2">
                    <dt className="text-[11px] uppercase tracking-wide text-graphite-400">{k}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-graphite-900">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {resources && resources.length > 0 && (
              <ul className="space-y-1.5 text-sm">
                {resources.map((r, i) => (
                  <li key={i} className="flex items-baseline gap-1.5">
                    <span aria-hidden>
                      {r.categoria === "pezzo_ricambio" ? "🔧" : r.categoria === "schema_tecnico" ? "🗺️" : "📄"}
                    </span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline"
                    >
                      {r.titolo}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : searchPending ? (
          <p className="flex items-center gap-2 text-sm text-graphite-500">
            <span className="spinner text-brand-600" aria-hidden />
            {t("searchPending")}
          </p>
        ) : (
          <p className="text-sm text-graphite-400">
            {t("noWebDataYet")}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowOwnData((s) => !s)}
        className="text-sm font-medium text-graphite-500 hover:text-graphite-800"
      >
        {showOwnData ? t("hideAdd") : t("showAdd")} {t("customDataLabel")} <span className="text-graphite-400">{t("optional")}</span>
      </button>

      {showOwnData && (
        <div className="mt-4">
          <div className="space-y-2">
            {fields.map(([key, value], index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder={t("characteristicPlaceholder")}
                  value={key}
                  onChange={(e) => updateField(index, e.target.value, value)}
                />
                <input
                  className="input flex-1"
                  placeholder={t("valuePlaceholder")}
                  value={value}
                  onChange={(e) => updateField(index, key, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="btn-secondary px-3"
                  aria-label={t("removeAria")}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addField} className="text-sm font-medium text-brand-600 hover:underline">
              {t("addCharacteristic")}
            </button>
          </div>

          <div className="mt-4">
            <label className="label">{t("notesLabel")}</label>
            <textarea
              className="input min-h-[80px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? t("saving") : t("save")}
            </button>
            {saved && <span className="text-sm text-green-600">{t("saved")}</span>}
          </div>

          <div className="mt-6 border-t border-graphite-200 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">{t("uploadedSchemesLabel")}</label>
              <label className="btn-secondary cursor-pointer text-xs">
                {uploading ? t("uploading") : t("uploadImage")}
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {images.length === 0 ? (
              <p className="text-sm text-graphite-400">
                {t("noSchemes")}
              </p>
            ) : (
              <ul className="space-y-1 text-sm">
                {images.map((img) => (
                  <li key={img.id} className="flex items-center justify-between rounded-lg bg-graphite-50 px-3 py-2">
                    <span className="truncate text-graphite-700">{img.caption || t("imageFallback")}</span>
                    <span className="text-xs text-graphite-400">
                      {img.source === "upload" ? t("uploadedTag") : t("webTag")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
