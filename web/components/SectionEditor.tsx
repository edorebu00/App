"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_EXTENSIONS, MAX_UPLOAD_BYTES, hasAllowedExtension, sanitizeFileName } from "@/lib/files";
import { safeExternalUrl } from "@/lib/safeUrl";
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
    // Dopo il `trim()` "peso" e "peso " diventano la stessa chiave e `Object.fromEntries` terrebbe
    // solo l'ultima: meglio fermarsi e chiedere di rinominare che perdere una voce in silenzio.
    const names = fields.map(([k]) => k.trim()).filter((k) => k !== "");
    if (new Set(names).size !== names.length) {
      setSaved(false);
      setSaveError(t("duplicateFieldName"));
      return;
    }

    setSaving(true);
    setSaved(false);
    setSaveError(null);

    // Il nome va ripulito anche in salvataggio, non solo nel filtro: senza `trim()` " peso " e
    // "peso" diventano due voci distinte ma identiche a schermo. Il valore resta com'e', perche'
    // gli spazi al suo interno possono essere voluti.
    const data = Object.fromEntries(
      fields.filter(([k]) => k.trim() !== "").map(([k, v]) => [k.trim(), v])
    );

    const { error } = await supabase
      .from("vehicle_sections")
      .update({ data, notes, updated_at: new Date().toISOString() })
      .eq("id", section.id);

    setSaving(false);
    if (error) {
      setSaveError(t("saveError"));
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!hasAllowedExtension(file.name, IMAGE_EXTENSIONS) || file.size > MAX_UPLOAD_BYTES) {
      setUploadError(t("imageUploadError"));
      e.target.value = "";
      return;
    }

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploadError(t("imageUploadError"));
      setUploading(false);
      e.target.value = "";
      return;
    }

    const path = `${user.id}/${section.vehicle_id}/${section.id}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage.from("vehicle-images").upload(path, file);

    if (uploadError) {
      setUploadError(t("imageUploadError"));
    } else {
      const { data: row, error: insertError } = await supabase
        .from("section_images")
        .insert({ section_id: section.id, storage_path: path, source: "upload", caption: file.name })
        .select()
        .single();

      if (insertError || !row) {
        // L'inserimento puo' restituire errore anche dopo aver creato la riga (per esempio se la
        // risposta si perde per un problema di rete): in quel caso il file serve ancora, quindi lo
        // teniamo e mostriamo la voce come nel percorso riuscito. Solo se la riga davvero non c'e'
        // il file va tolto, altrimenti ogni nuovo tentativo ne lascia un altro senza che nessuno
        // lo veda. Se nemmeno la verifica riesce ci comportiamo come prima, togliendo il file.
        const { data: existing, error: lookupError } = await supabase
          .from("section_images")
          .select()
          .eq("section_id", section.id)
          .eq("storage_path", path)
          .maybeSingle();

        if (!lookupError && existing) {
          setImages((prev) => [...prev, existing as SectionImage]);
        } else {
          await supabase.storage.from("vehicle-images").remove([path]);
          setUploadError(t("imageUploadError"));
        }
      } else {
        setImages((prev) => [...prev, row as SectionImage]);
      }
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
                {resources.map((r, i) => {
                  const href = safeExternalUrl(r.url);
                  if (!href) return null;

                  return (
                    <li key={i} className="flex items-baseline gap-1.5">
                      <span aria-hidden>
                        {r.categoria === "pezzo_ricambio" ? "🔧" : r.categoria === "schema_tecnico" ? "🗺️" : "📄"}
                      </span>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline"
                      >
                        {r.titolo}
                      </a>
                    </li>
                  );
                })}
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

          {saveError && <p className="mt-2 text-sm text-red-600">{saveError}</p>}

          <div className="mt-6 border-t border-graphite-200 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">{t("uploadedSchemesLabel")}</label>
              <label className="btn-secondary cursor-pointer text-xs">
                {uploading ? t("uploading") : t("uploadImage")}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.gif,.pdf"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {uploadError && <p className="mb-2 text-sm text-red-600">{uploadError}</p>}

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
