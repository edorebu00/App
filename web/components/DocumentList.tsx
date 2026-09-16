"use client";

import { createClient } from "@/lib/supabase/client";
import type { DocumentRow } from "@/lib/types";

export default function DocumentList({ documents }: { documents: DocumentRow[] }) {
  const supabase = createClient();

  async function handleDownload(doc: DocumentRow) {
    const { data, error } = await supabase.storage
      .from("vehicle-files")
      .createSignedUrl(doc.storage_path, 60);

    if (!error && data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  }

  if (documents.length === 0) {
    return <p className="text-sm text-graphite-400">Nessun file caricato per questo veicolo.</p>;
  }

  return (
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
                  "✓ Pronto per la chat IA"
                ) : doc.processing_error ? (
                  `Non elaborato: ${doc.processing_error}`
                ) : (
                  <>
                    <span className="spinner" aria-hidden />
                    Elaborazione in corso…
                  </>
                )}
              </p>
            </div>
          </div>
          <button onClick={() => handleDownload(doc)} className="btn-secondary shrink-0 text-sm">
            ⬇️ Scarica
          </button>
        </li>
      ))}
    </ul>
  );
}
