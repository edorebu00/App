import GlobalSearch from "@/components/GlobalSearch";

export default function RicercaPage() {
  return (
    <div>
      <div className="hero-panel mb-8 px-6 py-8 text-center">
        <div className="relative z-10">
          <p className="eyebrow justify-center">Agente IA</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">Ricerca risorse online</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-graphite-500">
            Cerca forum, manuali PDF, video e pezzi di ricambio su qualsiasi veicolo o argomento, non
            necessariamente legato a uno dei tuoi veicoli salvati.
          </p>
        </div>
      </div>
      <GlobalSearch />
    </div>
  );
}
