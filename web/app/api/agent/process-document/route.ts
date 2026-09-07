import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// Limite di caratteri di testo estratto passato poi al modello (evita prompt enormi)
const MAX_EXTRACTED_CHARS = 400_000;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { documentId } = (await request.json()) as { documentId?: string };

  if (!documentId) {
    return NextResponse.json({ error: "documentId mancante." }, { status: 400 });
  }

  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .maybeSingle();

  if (fetchError || !doc) {
    return NextResponse.json({ error: "Documento non trovato." }, { status: 404 });
  }

  try {
    const { data: fileData, error: downloadError } = await supabase.storage
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

    await supabase
      .from("documents")
      .update({ extracted_text: extractedText, processed: true, processing_error: null })
      .eq("id", documentId);

    return NextResponse.json({ ok: true, characters: extractedText.length });
  } catch (err: any) {
    console.error("Errore elaborazione documento:", err);
    await supabase
      .from("documents")
      .update({ processed: false, processing_error: err.message || "Errore sconosciuto" })
      .eq("id", documentId);
    return NextResponse.json({ error: err.message || "Errore durante l'elaborazione del documento." }, { status: 500 });
  }
}
