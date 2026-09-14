import Link from "next/link";
import CircuitCarousel from "@/components/CircuitCarousel";

const DISCIPLINES = [
  {
    icon: "🏎️",
    title: "Formula 1",
    text: "Il vertice tecnologico delle monoposto a ruote scoperte: aerodinamica, potenza e strategia in gara su circuiti permanenti e cittadini.",
  },
  {
    icon: "🏁",
    title: "Endurance",
    text: "Gare di durata come la 24 Ore di Le Mans, dove affidabilità e gestione della squadra contano quanto il giro veloce.",
  },
  {
    icon: "🌲",
    title: "Rally",
    text: "Velocità pura su strade chiuse, sterrato e neve: il pilota lotta contro il cronometro più che contro gli avversari in pista.",
  },
  {
    icon: "🏍️",
    title: "MotoGP",
    text: "Le moto prototipo più veloci al mondo, dove pochi millimetri di piega separano la vittoria dalla caduta.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-24 pt-16 text-center sm:pb-28 sm:pt-24">
        <div className="hero-spotlight" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-500/10 bg-brand-600/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="eyebrow-gold justify-center">Benvenuto</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Il motorsport.<br />Il tuo garage.<br /><span className="text-brand-500">Un solo posto.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-graphite-300">
            Scopri la storia dei circuiti più leggendari del mondo e gestisci la tua collezione di auto e moto
            come in una vetrina.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/registrati" className="btn-primary px-6 py-3 text-base">
              🏁 Inizia ora
            </Link>
            <Link href="/circuiti" className="btn-secondary px-6 py-3 text-base">
              Esplora i circuiti
            </Link>
          </div>
          <div className="mx-auto mt-10 flex w-fit items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-graphite-500">
            <span className="h-px w-10 bg-graphite-600" />
            Passione · precisione · memoria
            <span className="h-px w-10 bg-graphite-600" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="eyebrow-gold">Il mondo delle corse</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
          Discipline, in breve
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISCIPLINES.map((d) => (
            <div key={d.title} className="card group relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-graphite-500">
              <div className="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-brand-600/10 blur-xl transition group-hover:bg-brand-600/20" />
              <p className="relative text-3xl">{d.icon}</p>
              <h3 className="mt-2 font-display text-base font-semibold text-graphite-50">{d.title}</h3>
              <p className="mt-1 text-sm text-graphite-400">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <CircuitCarousel />
      </section>

      <section className="relative overflow-hidden px-4 py-16 text-center">
        <div className="hero-spotlight" />
        <div className="relative z-10 mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Pronto a mettere in ordine il tuo garage?
          </h2>
          <p className="mt-2 text-sm text-graphite-400">
            Aggiungi le tue auto e moto, trova documenti e manuali, e tieni tutto sotto controllo.
          </p>
          <Link href="/registrati" className="btn-primary mt-6 inline-flex px-6 py-3 text-base">
            Crea il tuo garage
          </Link>
        </div>
      </section>
    </div>
  );
}
