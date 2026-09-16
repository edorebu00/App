"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SECTIONS, type VehicleType } from "@/lib/types";
import { getEngineVariants, getMakes, getModels } from "@/lib/vehicleData";
import VehicleAddedOverlay from "@/components/VehicleAddedOverlay";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;

export default function NewVehiclePage() {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("vehicleNew");

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
        <p className="mt-1 text-sm text-graphite-500">
          {t("subtitle")}
        </p>
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
              <label className="label" htmlFor="make">{t("makeLabel")}</label>
              <input
                id="make"
                required
                className="input"
                value={make}
                onChange={(e) => handleMakeChange(e.target.value)}
                list="vehicle-makes"
                placeholder={t("makePlaceholder")}
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
              <label className="label" htmlFor="model">{t("modelLabel")}</label>
              <input
                id="model"
                required
                className="input"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                list="vehicle-models"
                placeholder={make ? t("modelPlaceholderWithMake") : t("modelPlaceholderNoMake")}
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
                <p className="mt-1 text-xs text-gold-600">
                  {t("makeNotInCatalogue")}
                </p>
              )}
            </div>
          </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="engineCode">{t("engineLabel")}</label>
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
                  {model ? t("modelNotInCatalogue") : t("enterMakeModelFirst")}
                </p>
              </>
            )}
          </div>
          <div>
            <label className="label" htmlFor="year">{t("yearLabel")}</label>
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
                  {selectedVariant ? t("yearSelectPlaceholder") : t("yearSelectDisabled")}
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
          <label className="label" htmlFor="plate">{t("plateLabel")}</label>
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
