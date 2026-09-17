import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { DOCUMENT_EXTENSIONS, DOCUMENT_MIME_TYPES, MAX_UPLOAD_BYTES, hasAllowedExtension } from "@/lib/files";
import { isUuid } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 90;

// Limite di caratteri di testo estratto passato poi al modello (evita prompt enormi)
const MAX_EXTRACTED_CHARS = 400_000;
/** L'estrazione e' un'operazione pesante (download + parsing PDF): massimo 20 ogni 5 minuti. */
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60 * 1000;
/** Il messaggio d'errore finisce in `processing_error`, visibile nella lista documenti. */
const MAX_ERROR_CHARS = 200;

export async function POST(request: Request) {
  const supabase = await createClient();
  const tErr = await getTranslations("apiErrors");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: tErr("notAuthenticated") }, { status: 401 });
  }

  const limit = checkRateLimit(`process-document:${user.id}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: tErr("rateLimited") },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: { documentId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: tErr("invalidRequest") }, { status: 400 });
  }

  if (!isUuid(body.documentId)) {
    return NextResponse.json({ error: tErr("documentNotFound") }, { status: 400 });
  }
  const documentId = body.documentId;

  // La RLS limita gia' la select ai documenti dell'utente: un id altrui non restituisce righe.
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("id, file_name, storage_path, mime_type, size_bytes")
    .eq("id", documentId)
    .maybeSingle();

  if (fetchError || !doc) {
    return NextResponse.json({ error: tErr("documentNotFound") }, { status: 404 });
  }

  const isPdf = doc.mime_type === "application/pdf" || doc.file_name.toLowerCase().endsWith(".pdf");
  const isText = doc.mime_type?.startsWith("text/") || doc.file_name.toLowerCase().endsWith(".txt");

  // Il tipo viene gia' filtrato lato browser, ma la riga `documents` e' scrivibile direttamente
  // dal client: ricontrolliamo qui prima di scaricare e dare in pasto il file al parser.
  if (!isPdf && !isText) {
    return await failDocument(supabase, documentId, tErr("unsupportedFileType"), 415);
  }
  if (
    !hasAllowedExtension(doc.file_name, DOCUMENT_EXTENSIONS) &&
    !DOCUMENT_MIME_TYPES.includes(doc.mime_type as (typeof DOCUMENT_MIME_TYPES)[number])
  ) {
    return await failDocument(supabase, documentId, tErr("unsupportedFileType"), 415);
  }
  if (typeof doc.size_bytes === "number" && doc.size_bytes > MAX_UPLOAD_BYTES) {
    return await failDocument(supabase, documentId, tErr("fileTooLarge"), 413);
  }

  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("vehicle-files")
      .download(doc.storage_path);

    if (downloadError || !fileData) {
      throw new Error(downloadError?.message || "Download del file fallito.");
    }

    if (fileData.size > MAX_UPLOAD_BYTES) {
      return await failDocument(supabase, documentId, tErr("fileTooLarge"), 413);
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    let extractedText = "";

    if (isPdf) {
      const pdfParse = (await import("pdf-parse")).default;
      const parsed = await pdfParse(buffer);
      extractedText = parsed.text;
    } else {
      extractedText = buffer.toString("utf-8");
    }

    extractedText = extractedText.slice(0, MAX_EXTRACTED_CHARS);

    await supabase
      .from("documents")
      .update({ extracted_text: extractedText, processed: true, processing_error: null })
      .eq("id", documentId);

    return NextResponse.json({ ok: true, characters: extractedText.length });
  } catch (err) {
    // Il dettaglio resta nei log del server: al client (e a `processing_error`, che finisce a
    // schermo) va solo un messaggio generico, per non esporre percorsi interni o stack trace.
    console.error("Errore elaborazione documento:", err);
    return await failDocument(supabase, documentId, tErr("documentProcessingError"), 500);
  }
}

/** Marca il documento come non elaborato con un messaggio utente e risponde con lo stesso testo. */
async function failDocument(
  supabase: Awaited<ReturnType<typeof createClient>>,
  documentId: string,
  message: string,
  status: number
) {
  await supabase
    .from("documents")
    .update({ processed: false, processing_error: message.slice(0, MAX_ERROR_CHARS) })
    .eq("id", documentId);

  return NextResponse.json({ error: message }, { status });
}
