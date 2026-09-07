"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SECTIONS, type VehicleType } from "@/lib/types";

export default function NewVehiclePage() {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<VehicleType>("auto");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineCode, setEngineCode] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sessione scaduta, effettua di nuovo l'accesso.");
      setLoading(false);
      return;
    }

    const { data: vehicle, error: insertError } = await supabase
      .from("vehicles")
      .insert({
        user_id: user.id,
        type,
        make,
        model,
        engine_code: engineCode || null,
        year: year ? Number(year) : null,
        plate: plate || null,
      })
      .select()
      .single();

    if (insertError || !vehicle) {
      setError(insertError?.message || "Errore durante la creazione del veicolo.");
      setLoading(false);
      return;
    }

    const { error: sectionsError } = await supabase.from("vehicle_sections").insert(
      DEFAULT_SECTIONS.map((s) => ({
        vehicle_id: vehicle.id,
        section_key: s.key,
        label: s.label,
        data: {},
      }))
    );

    if (sectionsError) {
      console.error(sectionsError);
    }

    setLoading(false);
    router.push(`/veicoli/${vehicle.id}`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Aggiungi veicolo</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Tipologia</label>
          <div className="flex gap-3">
            {(["auto", "moto"] as VehicleType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium capitalize ${
                  type === t
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="make">Marca</label>
            <input id="make" required className="input" value={make} onChange={(e) => setMake(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="model">Modello</label>
            <input id="model" required className="input" value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="engineCode">Codice motore</label>
            <input
              id="engineCode"
              className="input"
              placeholder="es. CAHA, K20A…"
              value={engineCode}
              onChange={(e) => setEngineCode(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="year">Anno</label>
            <input
              id="year"
              type="number"
              className="input"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="plate">Targa (opzionale)</label>
          <input id="plate" className="input" value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Salvataggio…" : "Salva veicolo"}
        </button>
      </form>
    </div>
  );
}
