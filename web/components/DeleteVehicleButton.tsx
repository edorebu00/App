"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteVehicleButton({ vehicleId, label }: { vehicleId: string; label: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Eliminare definitivamente "${label}"? Verranno rimossi anche i documenti caricati, le immagini e la cronologia chat. L'operazione non è reversibile.`
    );
    if (!confirmed) return;

    setDeleting(true);

    // Rimuove i file dallo storage prima di eliminare il veicolo (le righe DB sono in cascata,
    // ma gli oggetti nei bucket di storage vanno ripuliti esplicitamente).
    const { data: documents } = await supabase
      .from("documents")
      .select("storage_path")
      .eq("vehicle_id", vehicleId);

    const filePaths = (documents || []).map((d) => d.storage_path).filter(Boolean);
    if (filePaths.length) {
      await supabase.storage.from("vehicle-files").remove(filePaths);
    }

    const { data: sections } = await supabase.from("vehicle_sections").select("id").eq("vehicle_id", vehicleId);
    const sectionIds = (sections || []).map((s) => s.id);

    if (sectionIds.length) {
      const { data: images } = await supabase
        .from("section_images")
        .select("storage_path")
        .in("section_id", sectionIds);

      const imagePaths = (images || []).map((i) => i.storage_path).filter(Boolean) as string[];
      if (imagePaths.length) {
        await supabase.storage.from("vehicle-images").remove(imagePaths);
      }
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);

    if (error) {
      window.alert(`Errore durante l'eliminazione: ${error.message}`);
      setDeleting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="btn-secondary border-red-900 text-red-400 hover:bg-red-950"
    >
      {deleting ? "Eliminazione…" : "🗑️ Elimina veicolo"}
    </button>
  );
}
