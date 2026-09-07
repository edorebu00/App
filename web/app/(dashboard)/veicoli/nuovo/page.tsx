"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SECTIONS, type VehicleType } from "@/lib/types";
import { getMakes, getModels } from "@/lib/vehicleData";

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

  const makes = useMemo(() => getMakes(type), [type]);
  const models = useMemo(() => (make ? getModels(type, make) : []), [type, make]);

  function handleTypeChange(t: VehicleType) {
    setType(t);
    setMake("");
    setModel("");
  }

  function handleMakeChange(m: string) {
    setMake(m);
    setModel("");
  }

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
    // Al primo arrivo sulla scheda veicolo, l'app avvia in automatico la ricerca di
    // risorse online (documenti, forum, video) per marca/modello/motorizzazione.
    router.push(`/veicoli/${vehicle.id}?autosearch=1`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-graphite-50">Aggiungi veicolo</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Tipologia</label>
          <div className="flex gap-3">
            {(["auto", "moto"] as VehicleType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium capitalize ${
                  type === t
                    ? "border-brand-600 bg-brand-50 text-brand-400"
                    : "border-graphite-600 text-graphite-300 hover:bg-graphite-700"
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
            <select
              id="make"
              required
              className="input"
              value={make}
              onChange={(e) => handleMakeChange(e.target.value)}
            >
              <option value="" disabled>
                Seleziona marca…
              </option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="model">Modello</label>
            <select
              id="model"
              required
              className="input"
              value={model}
              disabled={!make}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="" disabled>
                {make ? "Seleziona modello…" : "Scegli prima la marca"}
              </option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="engineCode">Motorizzazione</label>
            <input
              id="engineCode"
              className="input"
              placeholder="es. 1.6 MultiJet, K20A…"
              value={engineCode}
              onChange={(e) => setEngineCode(e.target.value)}
            />
            <p className="mt-1 text-xs text-graphite-500">Cilindrata/alimentazione o codice motore, se lo conosci.</p>
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

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Salvataggio…" : "Salva veicolo"}
        </button>
      </form>
    </div>
  );
}
