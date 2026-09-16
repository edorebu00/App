"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SECTIONS, type VehicleType } from "@/lib/types";
import { getEngineVariants, getMakes, getModels } from "@/lib/vehicleData";
import VehicleAddedOverlay from "@/components/VehicleAddedOverlay";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;

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
  const [justAdded, setJustAdded] = useState<{ id: string; type: VehicleType; label: string } | null>(null);

  const makes = useMemo(() => getMakes(type), [type]);
  const models = useMemo(() => (make ? getModels(type, make) : []), [type, make]);
  const variants = useMemo(
    () => (make && model ? getEngineVariants(type, make, model) : null),
    [type, make, model]
  );
  const selectedVariant = variants?.find((v) => v.label === engineCode) || null;
  const yearOptions = useMemo(() => {
    if (!selectedVariant) return [];
    const to = selectedVariant.yearTo ?? CURRENT_YEAR;
    const from = Math.min(selectedVariant.yearFrom, MIN_YEAR);
    const years: number[] = [];
    for (let y = to; y >= from; y--) years.push(y);
    return years;
  }, [selectedVariant]);

  function handleTypeChange(t: VehicleType) {
    setType(t);
    setMake("");
    setModel("");
    setEngineCode("");
    setYear("");
  }

  function handleMakeChange(m: string) {
    setMake(m);
    setModel("");
    setEngineCode("");
    setYear("");
  }

  function handleModelChange(m: string) {
    setModel(m);
    setEngineCode("");
    setYear("");
  }

  function handleVariantChange(label: string) {
    setEngineCode(label);
    setYear("");
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

    // Il redirect (con avvio automatico della ricerca) parte solo dopo l'animazione
    // di conferma, gestita da VehicleAddedOverlay -> onDone.
    setJustAdded({ id: vehicle.id, type, label: `${make} ${model}` });
  }

  return (
    <div className="relative mx-auto max-w-lg">
      <div className="hero-glow" />

      <div className="relative z-10 mb-6 text-center">
        <p className="eyebrow-gold justify-center">Nuovo arrivo</p>
        <h1 className="mt-2 text-3xl font-bold text-white">🏁 Aggiungi veicolo</h1>
        <p className="mt-1 text-sm text-graphite-400">
          Cerca nel catalogo oppure inserisci liberamente marca e modello: al resto pensa l&apos;agente IA.
        </p>
        <div className="flag-stripe mx-auto mt-4 w-24 rounded-full" />
      </div>

      <form onSubmit={handleSubmit} className="card relative z-10 animate-rise-in space-y-4">
        <div>
          <label className="label">Tipologia</label>
          <div className="flex gap-3">
            {(["auto", "moto"] as VehicleType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold capitalize transition-all duration-200 ${
                  type === t
                    ? "scale-[1.02] border-brand-600 bg-brand-50 text-brand-400 shadow-md shadow-brand-900/40"
                    : "border-graphite-600 text-graphite-300 hover:bg-graphite-700"
                }`}
              >
                <span className="mr-1.5">{t === "moto" ? "🏍️" : "🚗"}</span>
                {t}
              </button>
            ))}
          </div>
        </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="make">Marca</label>
              <input
                id="make"
                required
                className="input"
                value={make}
                onChange={(e) => handleMakeChange(e.target.value)}
                list="vehicle-makes"
                placeholder="Cerca o scrivi la marca…"
                autoComplete="organization"
              />
              <datalist id="vehicle-makes">
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </datalist>
            </div>
            <div>
              <label className="label" htmlFor="model">Modello</label>
              <input
                id="model"
                required
                className="input"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                list="vehicle-models"
                placeholder={make ? "Cerca o scrivi il modello…" : "Inserisci prima la marca"}
                disabled={!make}
                autoComplete="off"
              />
              <datalist id="vehicle-models">
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </datalist>
              {make && models.length === 0 && (
                <p className="mt-1 text-xs text-gold-500">
                  Marca non ancora nel catalogo: puoi inserire il modello manualmente.
                </p>
              )}
            </div>
          </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="engineCode">Motorizzazione</label>
            {variants ? (
              <select
                id="engineCode"
                required
                className="input"
                value={engineCode}
                onChange={(e) => handleVariantChange(e.target.value)}
              >
                <option value="" disabled>
                  Seleziona motorizzazione…
                </option>
                {variants.map((v) => (
                  <option key={v.label} value={v.label}>
                    {v.label}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  id="engineCode"
                  className="input"
                  placeholder="es. 1.6 MultiJet, K20A…"
                  value={engineCode}
                  onChange={(e) => setEngineCode(e.target.value)}
                  disabled={!model}
                />
                <p className="mt-1 text-xs text-graphite-500">
                  {model
                    ? "Modello o motorizzazione non nel catalogo: inseriscila manualmente."
                    : "Inserisci prima marca e modello."}
                </p>
              </>
            )}
          </div>
          <div>
            <label className="label" htmlFor="year">Anno</label>
            {variants ? (
              <select
                id="year"
                required
                className="input"
                value={year}
                disabled={!selectedVariant}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="" disabled>
                  {selectedVariant ? "Seleziona anno…" : "Scegli prima la motorizzazione"}
                </option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="year"
                type="number"
                className="input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            )}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="plate">Targa (opzionale)</label>
          <input id="plate" className="input" value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? "Salvataggio…" : "🏁 Salva veicolo"}
        </button>
      </form>

      {justAdded && (
        <VehicleAddedOverlay
          type={justAdded.type}
          label={justAdded.label}
          onDone={() => router.push(`/veicoli/${justAdded.id}?autosearch=1`)}
        />
      )}
    </div>
  );
}
