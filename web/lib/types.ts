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

export interface ResourceLink {
  categoria: "forum" | "manuale_pdf" | "video" | "schema_tecnico" | "altro";
  titolo: string;
  url: string;
  descrizione: string;
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
