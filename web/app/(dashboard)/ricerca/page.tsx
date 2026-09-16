import GlobalSearch from "@/components/GlobalSearch";

export default function RicercaPage() {
  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-xl border border-graphite-800 bg-graphite-800/40 px-6 py-8 text-center">
        <div className="hero-spotlight" />
        <div className="relative z-10">
          <p className="eyebrow-gold justify-center">Agente IA</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">Ricerca risorse online</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-graphite-400">
            Cerca forum, manuali PDF, video e pezzi di ricambio su qualsiasi veicolo o argomento, non
            necessariamente legato a uno dei tuoi veicoli salvati.
          </p>
          <div className="flag-stripe mx-auto mt-4 w-16 rounded-full" />
        </div>
      </div>
      <GlobalSearch />
    </div>
  );
}
