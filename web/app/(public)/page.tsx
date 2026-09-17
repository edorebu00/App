import Link from "next/link";
import { getTranslations } from "next-intl/server";
import CircuitCarousel from "@/components/CircuitCarousel";
import ProductPreview from "@/components/ProductPreview";

export default async function HomePage() {
  const t = await getTranslations("home");

  const DISCIPLINES = [
    { icon: "🏎️", key: "f1" },
    { icon: "🏁", key: "endurance" },
    { icon: "🌲", key: "rally" },
    { icon: "🏍️", key: "motogp" },
  ] as const;

  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
        <div className="animate-drift pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="eyebrow justify-center">{t("eyebrow")}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-graphite-900 sm:text-6xl">
            {t("titleLine1")}<br />{t("titleLine2")} <span className="text-brand-600">{t("titleAccent")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-graphite-500">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/registrati" className="btn-primary px-6 py-3 text-base">
              {t("ctaStart")}
            </Link>
            <Link href="/circuiti" className="btn-secondary px-6 py-3 text-base">
              {t("ctaCircuits")}
            </Link>
          </div>
        </div>

        <ProductPreview />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="eyebrow">{t("disciplinesEyebrow")}</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-graphite-900">
          {t("disciplinesTitle")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISCIPLINES.map((d) => (
            <div key={d.key} className="card group transition duration-300 ease-out hover:-translate-y-1 hover:border-brand-400/50">
              <p className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-2xl grayscale-[0.25]">{d.icon}</p>
              <h3 className="mt-3 font-display text-base font-semibold text-graphite-900">{t(`disciplines.${d.key}.title`)}</h3>
              <p className="mt-1 text-sm text-graphite-500">{t(`disciplines.${d.key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <CircuitCarousel />
      </section>

      <section className="relative overflow-hidden px-4 py-16 text-center">
        <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/12 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-graphite-900">
            {t("ctaBottomTitle")}
          </h2>
          <p className="mt-2 text-sm text-graphite-500">
            {t("ctaBottomText")}
          </p>
          <Link href="/registrati" className="btn-primary mt-6 inline-flex px-6 py-3 text-base">
            {t("ctaBottomButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
