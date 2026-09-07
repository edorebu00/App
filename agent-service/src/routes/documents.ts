import { Router } from "express";
import type { AuthedRequest } from "../middleware/auth";
import { requireAuth } from "../middleware/auth";
import { supabaseAdmin } from "../lib/supabase";

export const documentsRouter = Router();

// Limite di caratteri di testo estratto passato poi al modello (evita prompt enormi)
const MAX_EXTRACTED_CHARS = 400_000;

documentsRouter.post("/:id/process", requireAuth, async (req: AuthedRequest, res) => {
  const documentId = req.params.id;

  const { data: doc, error: fetchError } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", req.userId)
    .maybeSingle();

  if (fetchError || !doc) {
    return res.status(404).json({ error: "Documento non trovato." });
  }

  try {
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from("vehicle-files")
      .download(doc.storage_path);

    if (downloadError || !fileData) {
      throw new Error(downloadError?.message || "Download del file fallito.");
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    let extractedText = "";

    if (doc.mime_type === "application/pdf" || doc.file_name.toLowerCase().endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text;
    } else if (doc.mime_type?.startsWith("text/") || doc.file_name.toLowerCase().endsWith(".txt")) {
      extractedText = buffer.toString("utf-8");
    } else {
      throw new Error(
        "Formato file non supportato per l'estrazione automatica (sono supportati PDF e file di testo)."
      );
    }

    extractedText = extractedText.slice(0, MAX_EXTRACTED_CHARS);

    await supabaseAdmin
      .from("documents")
      .update({ extracted_text: extractedText, processed: true, processing_error: null })
      .eq("id", documentId);

    res.json({ ok: true, characters: extractedText.length });
  } catch (err: any) {
    console.error("Errore elaborazione documento:", err);
    await supabaseAdmin
      .from("documents")
      .update({ processed: false, processing_error: err.message || "Errore sconosciuto" })
      .eq("id", documentId);
    res.status(500).json({ error: err.message || "Errore durante l'elaborazione del documento." });
  }
});
