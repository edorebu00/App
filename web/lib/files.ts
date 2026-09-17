/** Estensioni e tipi MIME accettati per i documenti da cui estrarre testo per la chat IA. */
export const DOCUMENT_EXTENSIONS = [".pdf", ".txt"] as const;
export const DOCUMENT_MIME_TYPES = ["application/pdf", "text/plain"] as const;

/** Estensioni accettate per gli schemi/esplosi allegati a una sezione. */
export const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf"] as const;

/** 20 MB: sopra questa soglia l'upload è quasi sempre un errore e costa banda/storage inutili. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export function hasAllowedExtension(fileName: string, extensions: readonly string[]) {
  const lower = fileName.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}

/**
 * Il nome del file finisce dentro la chiave dell'oggetto su Supabase Storage. Lasciarlo grezzo
 * significa infilare nella chiave separatori di path, caratteri di controllo e unicode arbitrario:
 * meglio ridurlo a un set di caratteri sicuro (il nome originale resta comunque in `file_name`).
 */
export function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-120);

  return cleaned || "file";
}
