"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_EXTENSIONS, MAX_UPLOAD_BYTES, hasAllowedExtension, sanitizeFileName } from "@/lib/files";

export default function FileUploader({ vehicleId }: { vehicleId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("fileUploader");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // L'attributo `accept` e' solo un suggerimento del browser: il controllo vero va fatto qui,
    // altrimenti finiscono nello storage file che poi l'estrazione testo non sa comunque leggere.
    if (!hasAllowedExtension(file.name, DOCUMENT_EXTENSIONS)) {
      setError(t("unsupportedFileType"));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(t("fileTooLarge"));
      e.target.value = "";
      return;
    }

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("sessionExpired"));
      setUploading(false);
      return;
    }

    const path = `${user.id}/${vehicleId}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage.from("vehicle-files").upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: doc, error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        vehicle_id: vehicleId,
        file_name: file.name,
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select()
      .single();

    if (insertError || !doc) {
      setError(insertError?.message || t("saveError"));
      setUploading(false);
      return;
    }

    // Elaborazione asincrona: estrazione testo per la chat IA (non blocca l'upload se fallisce).
    // L'esito va comunque registrato sulla riga appena creata: se la route non parte (rete,
    // sessione, limite di frequenza) nessuno scrive `processing_error` e la voce resterebbe
    // per sempre sulla rotellina "in elaborazione", senza errore ne' modo di riprovare.
    fetch("/api/agent/process-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: doc.id }),
    })
      .then((res) => res.ok)
      .catch(() => false)
      .then(async (started) => {
        if (started) return;

        await supabase.from("documents").update({ processing_error: t("processingNotStarted") }).eq("id", doc.id);
        router.refresh();
      });

    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  return (
    <div>
      <label className="btn-primary inline-flex cursor-pointer">
        {uploading ? t("uploading") : t("uploadButton")}
        <input
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          className="hidden"
          onChange={handleUpload}
        />
      </label>
      <p className="mt-1 text-xs text-graphite-400">{t("supportedFormats")}</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
