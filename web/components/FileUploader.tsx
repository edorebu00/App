"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FileUploader({ vehicleId }: { vehicleId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sessione scaduta, effettua di nuovo l'accesso.");
      setUploading(false);
      return;
    }

    const path = `${user.id}/${vehicleId}/${Date.now()}-${file.name}`;

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
      setError(insertError?.message || "Errore durante il salvataggio del documento.");
      setUploading(false);
      return;
    }

    // Elaborazione asincrona: estrazione testo per la chat IA (non blocca l'upload se fallisce).
    fetch("/api/agent/process-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: doc.id }),
    }).catch(() => {});

    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  return (
    <div>
      <label className="btn-primary inline-flex cursor-pointer">
        {uploading ? "Caricamento…" : "📤 Carica file"}
        <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleUpload} />
      </label>
      <p className="mt-1 text-xs text-slate-400">Formati supportati per la lettura IA: PDF, TXT.</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
