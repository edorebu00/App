"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { DocumentRow } from "@/lib/types";

export default function DocumentList({ documents }: { documents: DocumentRow[] }) {
  const supabase = createClient();
  const t = useTranslations("documentList");
  const [downloadError, setDownloadError] = useState(false);

  async function handleDownload(doc: DocumentRow) {
    setDownloadError(false);
    const { data, error } = await supabase.storage
      .from("vehicle-files")
      .createSignedUrl(doc.storage_path, 60);

    if (error || !data?.signedUrl) {
      setDownloadError(true);
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  if (documents.length === 0) {
    return <p className="text-sm text-graphite-400">{t("noFiles")}</p>;
  }

  return (
    <div>
      {downloadError && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {t("downloadError")}
        </p>
      )}
      <ul className="space-y-2">
      {documents.map((doc) => (
        <li key={doc.id} className="card flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 text-xl" aria-hidden>
              📄
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-graphite-800">{doc.file_name}</p>
              <p
                className={`text-xs ${
                  doc.processed
                    ? "text-green-600"
                    : doc.processing_error
                      ? "text-red-600"
                      : "flex items-center gap-1.5 text-graphite-500"
                }`}
              >
                {doc.processed ? (
                  t("ready")
                ) : doc.processing_error ? (
                  t("notProcessed", { error: doc.processing_error })
                ) : (
                  <>
                    <span className="spinner" aria-hidden />
                    {t("processing")}
                  </>
                )}
              </p>
            </div>
          </div>
          <button onClick={() => handleDownload(doc)} className="btn-secondary shrink-0 text-sm">
            {t("download")}
          </button>
        </li>
      ))}
      </ul>
    </div>
  );
}
