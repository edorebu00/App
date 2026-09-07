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
    return <p className="text-sm text-graphite-500">Nessun file caricato per questo veicolo.</p>;
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li key={doc.id} className="card flex items-center justify-between">
          <div>
            <p className="font-medium text-graphite-200">{doc.file_name}</p>
            <p className="text-xs text-graphite-500">
              {doc.processed
                ? "Pronto per la chat IA"
                : doc.processing_error
                  ? `Non elaborato: ${doc.processing_error}`
                  : "Elaborazione in corso…"}
            </p>
          </div>
          <button onClick={() => handleDownload(doc)} className="btn-secondary text-sm">
            ⬇️ Scarica
          </button>
        </li>
      ))}
    </ul>
  );
}
