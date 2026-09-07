import GlobalSearch from "@/components/GlobalSearch";

export default function RicercaPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-graphite-50">Ricerca risorse online</h1>
      <p className="mb-6 text-sm text-graphite-400">
        Cerca forum, manuali PDF, video e pezzi di ricambio su qualsiasi veicolo o argomento, non
        necessariamente legato a uno dei tuoi veicoli salvati.
      </p>
      <GlobalSearch />
    </div>
  );
}
