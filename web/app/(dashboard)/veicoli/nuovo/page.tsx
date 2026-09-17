"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SECTIONS, type VehicleType } from "@/lib/types";
import { getEngineVariants, getMakes, getModels } from "@/lib/vehicleData";
import VehicleAddedOverlay from "@/components/VehicleAddedOverlay";

const CURRENT_YEAR = new Date().getFullYear();
/** Anno più vecchio proposto quando non c'è una motorizzazione a delimitare il periodo. */
const OLDEST_YEAR = 1950;

/**
 * Valore riservato della voce "Altro": il catalogo è ampio ma non esaustivo, e bloccare la
 * scelta alle sole voci in elenco escluderebbe veicoli d'epoca, d'importazione o appena usciti.
 * Chi sceglie questa voce ottiene un campo libero; tutti gli altri non scrivono nulla.
 */
const OTHER = "__altro__";

export default function NewVehiclePage() {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("vehicleNew");

  const [type, setType] = useState<VehicleType>("auto");
  const [makeChoice, setMakeChoice] = useState("");
  const [customMake, setCustomMake] = useState("");
  const [modelChoice, setModelChoice] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [engineCode, setEngineCode] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState<{ id: string; type: VehicleType; label: string } | null>(null);

  const isCustomMake = makeChoice === OTHER;
  // Con una marca fuori catalogo non esiste un elenco di modelli, quindi il modello è per forza
  // scritto a mano: va letto da customModel anche se il menu dei modelli non è mai stato toccato.
  const isCustomModel = isCustomMake || modelChoice === OTHER;
  const make = (isCustomMake ? customMake : makeChoice).trim();
  const model = (isCustomModel ? customModel : modelChoice).trim();

  const makes = useMemo(() => getMakes(type), [type]);
  // I modelli si elencano solo per una marca del catalogo: per una marca scritta a mano non
  // c'è nulla da proporre, e il campo passa direttamente a testo libero.
  const models = useMemo(
    () => (makeChoice && !isCustomMake ? getModels(type, makeChoice) : []),
    [type, makeChoice, isCustomMake]
  );
  const variants = useMemo(
    () => (make && model && !isCustomMake && !isCustomModel ? getEngineVariants(type, make, model) : null),
    [type, make, model, isCustomMake, isCustomModel]
  );
  const selectedVariant = variants?.find((v) => v.label === engineCode) || null;

  const yearOptions = useMemo(() => {
    // Con una motorizzazione scelta gli anni sono quelli in cui è stata prodotta; senza, si
    // propone un intervallo ampio, che deve comprendere anche i veicoli d'epoca.
    const to = selectedVariant?.yearTo ?? CURRENT_YEAR;
    const from = selectedVariant?.yearFrom ?? OLDEST_YEAR;
    const years: number[] = [];
    for (let y = to; y >= Math.min(from, to); y--) years.push(y);
    return years;
  }, [selectedVariant]);

  function handleTypeChange(next: VehicleType) {
    setType(next);
    setMakeChoice("");
    setCustomMake("");
    setModelChoice("");
    setCustomModel("");
    setEngineCode("");
    setYear("");
  }

  function handleMakeChange(next: string) {
    setMakeChoice(next);
    setCustomMake("");
    setModelChoice("");
    setCustomModel("");
    setEngineCode("");
    setYear("");
  }

  function handleModelChange(next: string) {
    setModelChoice(next);
    setCustomModel("");
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
      setError(t("sessionExpired"));
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
      setError(insertError?.message || t("genericError"));
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
      <div className="mb-6 text-center">
        <p className="eyebrow justify-center">{t("eyebrow")}</p>
        <h1 className="mt-2 text-3xl font-bold text-graphite-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-graphite-500">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="card animate-rise-in space-y-4">
        <div>
          <label className="label">{t("typeLabel")}</label>
          <div className="flex gap-3">
            {(["auto", "moto"] as VehicleType[]).map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => handleTypeChange(tp)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold capitalize transition-all duration-200 ${
                  type === tp
                    ? "scale-[1.02] border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                    : "border-graphite-300 text-graphite-600 hover:bg-graphite-50"
                }`}
              >
                <span className="mr-1.5">{tp === "moto" ? "🏍️" : "🚗"}</span>
                {tp === "moto" ? t("moto") : t("auto")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="make">
              {t("makeLabel")}
            </label>
            <select
              id="make"
              required
              className="input"
              value={makeChoice}
              onChange={(e) => handleMakeChange(e.target.value)}
            >
              <option value="" disabled>
                {t("makeSelectPlaceholder")}
              </option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              <option value={OTHER}>{t("otherOption")}</option>
            </select>
            {isCustomMake && (
              <input
                className="input mt-2"
                required
                value={customMake}
                onChange={(e) => setCustomMake(e.target.value)}
                placeholder={t("customMakePlaceholder")}
                autoComplete="organization"
                aria-label={t("customMakePlaceholder")}
              />
            )}
          </div>

          <div>
            <label className="label" htmlFor="model">
              {t("modelLabel")}
            </label>
            {isCustomMake ? (
              // Marca fuori catalogo: non esiste un elenco di modelli da proporre.
              <input
                id="model"
                className="input"
                required
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder={t("customModelPlaceholder")}
                autoComplete="off"
              />
            ) : (
              <>
                <select
                  id="model"
                  required
                  className="input"
                  value={modelChoice}
                  disabled={!makeChoice}
                  onChange={(e) => handleModelChange(e.target.value)}
                >
                  <option value="" disabled>
                    {makeChoice ? t("modelSelectPlaceholder") : t("modelSelectDisabled")}
                  </option>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  {makeChoice && <option value={OTHER}>{t("otherOption")}</option>}
                </select>
                {isCustomModel && (
                  <input
                    className="input mt-2"
                    required
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder={t("customModelPlaceholder")}
                    autoComplete="off"
                    aria-label={t("customModelPlaceholder")}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="engineCode">
              {t("engineLabel")}
            </label>
            {variants ? (
              <select
                id="engineCode"
                required
                className="input"
                value={engineCode}
                onChange={(e) => handleVariantChange(e.target.value)}
              >
                <option value="" disabled>
                  {t("engineSelectPlaceholder")}
                </option>
                {variants.map((v) => (
                  <option key={v.label} value={v.label}>
                    {v.label}
                  </option>
                ))}
              </select>
            ) : (
              // Senza motorizzazioni in catalogo non c'è un elenco da proporre, e inventarlo
              // significherebbe mettere in bocca all'utente dati sbagliati. Resta un campo
              // libero, facoltativo: se lo lascia vuoto ci pensa la ricerca IA.
              <>
                <input
                  id="engineCode"
                  className="input"
                  placeholder={t("enginePlaceholderFree")}
                  value={engineCode}
                  onChange={(e) => setEngineCode(e.target.value)}
                  disabled={!model}
                />
                <p className="mt-1 text-xs text-graphite-500">
                  {model ? t("engineOptionalHint") : t("enterMakeModelFirst")}
                </p>
              </>
            )}
          </div>

          <div>
            <label className="label" htmlFor="year">
              {t("yearLabel")}
            </label>
            <select
              id="year"
              required
              className="input"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" disabled>
                {t("yearSelectPlaceholder")}
              </option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="plate">
            {t("plateLabel")}
          </label>
          <input id="plate" className="input" value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? t("submitLoading") : t("submit")}
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
