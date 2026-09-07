export type VehicleType = "auto" | "moto";

export interface Vehicle {
  id: string;
  user_id: string;
  type: VehicleType;
  make: string;
  model: string;
  engine_code: string | null;
  year: number | null;
  plate: string | null;
  vin: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleSection {
  id: string;
  vehicle_id: string;
  section_key: string;
  label: string;
  data: Record<string, string>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SectionImage {
  id: string;
  section_id: string;
  storage_path: string | null;
  external_url: string | null;
  source: "upload" | "web";
  caption: string | null;
  created_at: string;
}

export type SectionKey =
  | "motore"
  | "carrozzeria"
  | "assetto"
  | "impianto_frenante"
  | "trasmissione"
  | "elettronica"
  | "generale";

export interface ResourceLink {
  categoria: "forum" | "manuale_pdf" | "video" | "schema_tecnico" | "pezzo_ricambio" | "altro";
  sezione?: SectionKey;
  titolo: string;
  url: string;
  descrizione: string;
}

/** Specifiche tecniche trovate online, raggruppate per sezione (es. motore -> {cilindrata: "1998 cc"}). */
export type SectionSpecs = Partial<Record<SectionKey, Record<string, string>>>;

/** Forma salvata in search_results.results. */
export interface SearchPayload {
  risorse: ResourceLink[];
  specifiche: SectionSpecs;
}

export interface EngineVariant {
  /** Es. "118d 2.0 143cv" oppure "1.6 MultiJet 120cv" */
  label: string;
  yearFrom: number;
  yearTo: number | null;
}

export interface DocumentRow {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  extracted_text: string | null;
  processed: boolean;
  processing_error: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export const DEFAULT_SECTIONS: Array<{ key: string; label: string }> = [
  { key: "motore", label: "Motore" },
  { key: "carrozzeria", label: "Carrozzeria" },
  { key: "assetto", label: "Assetto e sospensioni" },
  { key: "impianto_frenante", label: "Impianto frenante" },
  { key: "trasmissione", label: "Trasmissione" },
  { key: "elettronica", label: "Elettronica e impianto elettrico" },
];
