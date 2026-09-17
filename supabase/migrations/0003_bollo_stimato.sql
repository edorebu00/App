-- Stima del bollo auto/moto, calcolata dall'agente IA insieme alle altre specifiche
-- tecniche quando cerca informazioni sul veicolo (vedi app/api/agent/search).
-- Testo libero (es. "circa 150-180 €/anno, Euro 5, 14 CV fiscali") perche' l'importo reale
-- dipende da regione/fascia e non e' calcolabile in modo certo dai soli dati del veicolo.

alter table public.vehicles add column bollo_stimato text;
