import type { EngineVariant, VehicleType } from "./types";

/**
 * Dataset curato di marche/modelli per popolare i menu a tendina del form "Aggiungi veicolo".
 * Non è un catalogo ufficiale/esaustivo di ogni allestimento storico: copre le marche e i modelli
 * più comuni sul mercato italiano. La motorizzazione resta un campo libero perché il numero di
 * varianti motore per singolo modello è troppo elevato per un elenco statico affidabile.
 */
export const VEHICLE_DATA: Record<VehicleType, Record<string, string[]>> = {
  auto: {
    Abarth: ["500", "500C", "595", "595C", "695", "124 Spider", "Punto Evo"],
    "Alfa Romeo": ["Giulia", "Giulietta", "Stelvio", "Tonale", "MiTo", "159", "147", "Brera", "GT"],
    Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT"],
    BMW: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 7", "X1", "X2", "X3", "X4", "X5", "X6", "Z4", "i3", "i4"],
    Citroën: ["C1", "C3", "C3 Aircross", "C4", "C4 Picasso", "C5 Aircross", "Berlingo", "DS3", "DS4"],
    Cupra: ["Formentor", "Leon", "Born", "Ateca"],
    Dacia: ["Sandero", "Duster", "Jogger", "Spring"],
    "DS Automobiles": ["DS 3", "DS 4", "DS 7", "DS 9"],
    Fiat: ["Panda", "500", "500X", "500L", "Tipo", "Punto", "Bravo", "Ducato", "Doblo", "Qubo", "Sedici"],
    Ford: ["Fiesta", "Focus", "Puma", "Kuga", "EcoSport", "Mondeo", "C-Max", "Ka", "Transit"],
    Honda: ["Civic", "Jazz", "CR-V", "HR-V", "Accord"],
    Hyundai: ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "Ioniq"],
    Jaguar: ["XE", "XF", "F-Pace", "E-Pace", "I-Pace"],
    Jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Avenger", "Wrangler"],
    Kia: ["Picanto", "Rio", "Ceed", "Sportage", "Niro", "Stonic", "Sorento"],
    Lamborghini: ["Huracán", "Aventador", "Urus"],
    Lancia: ["Ypsilon", "Delta", "Musa", "Thesis"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport"],
    Maserati: ["Ghibli", "Quattroporte", "Levante", "Grecale", "GranTurismo"],
    Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "MX-5"],
    "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "CLA", "GLA", "GLB", "GLC", "GLE", "Sprinter", "Vito"],
    Mini: ["Cooper", "Countryman", "Clubman", "Cabrio"],
    Mitsubishi: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
    Nissan: ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Leaf"],
    Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland"],
    Peugeot: ["108", "208", "308", "2008", "3008", "5008", "Partner"],
    Porsche: ["911", "718 Cayman", "718 Boxster", "Panamera", "Macan", "Cayenne", "Taycan"],
    Renault: ["Clio", "Captur", "Megane", "Kadjar", "Scenic", "Twingo", "Austral"],
    Seat: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    Škoda: ["Fabia", "Octavia", "Kamiq", "Karoq", "Kodiaq", "Superb"],
    Smart: ["Fortwo", "Forfour"],
    Subaru: ["Impreza", "Forester", "XV", "Outback"],
    Suzuki: ["Swift", "Vitara", "S-Cross", "Ignis", "Jimny"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    Toyota: ["Aygo", "Yaris", "Corolla", "C-HR", "RAV4", "Auris", "Prius", "Hilux"],
    Volkswagen: ["Polo", "Golf", "Passat", "Tiguan", "T-Roc", "T-Cross", "Touareg", "Up!", "ID.3", "ID.4"],
    Volvo: ["V40", "V60", "V90", "XC40", "XC60", "XC90"],
  },
  moto: {
    Aprilia: ["RS 660", "Tuono 660", "RSV4", "Tuareg 660", "SR GT", "Shiver 900"],
    "Benelli": ["TRK 502", "Leoncino 500", "752 S", "TNT 125"],
    BMW: ["S 1000 RR", "R 1250 GS", "F 850 GS", "R nineT", "G 310 R", "F 900 R"],
    Ducati: ["Panigale V4", "Panigale V2", "Monster", "Multistrada", "Scrambler", "Diavel", "Streetfighter V4"],
    "Harley-Davidson": ["Sportster", "Fat Boy", "Street Bob", "Road King", "Pan America"],
    Honda: ["CBR600RR", "CBR1000RR-R", "CB650R", "Africa Twin", "CB500F", "Hornet", "SH 125/150"],
    Husqvarna: ["Svartpilen 401", "Vitpilen 401", "Norden 901"],
    Kawasaki: ["Ninja 400", "Ninja 650", "Ninja ZX-10R", "Z650", "Z900", "Versys 650"],
    KTM: ["Duke 125", "Duke 390", "Duke 790", "Duke 890", "1290 Super Duke", "Adventure 390", "Adventure 1290"],
    "Moto Guzzi": ["V7", "V9", "V85 TT", "California"],
    "MV Agusta": ["Brutale", "F3", "Turismo Veloce", "Dragster"],
    Piaggio: ["Beverly", "MP3", "Liberty"],
    "Royal Enfield": ["Classic 350", "Meteor 350", "Himalayan", "Interceptor 650", "Continental GT 650"],
    Suzuki: ["GSX-R600", "GSX-R750", "GSX-R1000", "SV650", "V-Strom 650", "Hayabusa"],
    Triumph: ["Street Triple", "Speed Triple", "Tiger 900", "Bonneville T120", "Trident 660"],
    Vespa: ["Primavera", "GTS", "Sprint", "Elettrica"],
    Yamaha: ["MT-07", "MT-09", "MT-10", "YZF-R1", "YZF-R6", "YZF-R125", "Tracer 9", "Tenere 700", "NMAX"],
  },
};

export function getMakes(type: VehicleType): string[] {
  return Object.keys(VEHICLE_DATA[type]).sort((a, b) => a.localeCompare(b));
}

export function getModels(type: VehicleType, make: string): string[] {
  return VEHICLE_DATA[type][make] || [];
}

/**
 * Motorizzazioni con relativo periodo di produzione, curate solo per un sottoinsieme dei
 * modelli più diffusi (i dati di ogni variante motore per ogni modello esistito sono troppi
 * per un elenco statico affidabile). Per i modelli non presenti qui, il form ricade su un
 * campo libero per motorizzazione e anno.
 */
const ENGINE_DATA: Record<VehicleType, Record<string, Record<string, EngineVariant[]>>> = {
  auto: {
    Fiat: {
      Panda: [
        { label: "1.0 Hybrid 70cv", yearFrom: 2020, yearTo: null },
        { label: "1.2 8v 69cv", yearFrom: 2012, yearTo: 2020 },
        { label: "0.9 TwinAir 85cv", yearFrom: 2012, yearTo: 2019 },
      ],
      "500": [
        { label: "1.0 Hybrid 70cv", yearFrom: 2020, yearTo: null },
        { label: "1.2 8v 69cv", yearFrom: 2007, yearTo: 2020 },
        { label: "0.9 TwinAir 85cv", yearFrom: 2010, yearTo: 2019 },
        { label: "1.3 MultiJet 95cv", yearFrom: 2007, yearTo: 2016 },
      ],
    },
    "Alfa Romeo": {
      Giulia: [
        { label: "2.0 Turbo 200cv", yearFrom: 2016, yearTo: null },
        { label: "2.2 Diesel 160cv", yearFrom: 2016, yearTo: null },
        { label: "2.2 Diesel 190cv", yearFrom: 2016, yearTo: null },
        { label: "2.9 V6 Bi-Turbo Quadrifoglio 510cv", yearFrom: 2016, yearTo: null },
      ],
    },
    BMW: {
      "Serie 1": [
        { label: "116d 1.5 116cv", yearFrom: 2015, yearTo: null },
        { label: "118d 2.0 150cv", yearFrom: 2011, yearTo: null },
        { label: "120d 2.0 190cv", yearFrom: 2011, yearTo: null },
        { label: "125d 2.0 224cv", yearFrom: 2013, yearTo: null },
        { label: "116i 1.5 109cv", yearFrom: 2019, yearTo: null },
        { label: "118i 1.5 140cv", yearFrom: 2019, yearTo: null },
        { label: "M135i / M140i 3.0 340cv", yearFrom: 2017, yearTo: null },
      ],
      "Serie 3": [
        { label: "318d 2.0 150cv", yearFrom: 2012, yearTo: null },
        { label: "320d 2.0 190cv", yearFrom: 2012, yearTo: null },
        { label: "330d 3.0 265cv", yearFrom: 2012, yearTo: null },
        { label: "320i 2.0 184cv", yearFrom: 2012, yearTo: null },
        { label: "M340i 3.0 374cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Volkswagen: {
      Golf: [
        { label: "1.0 TSI 110cv", yearFrom: 2016, yearTo: null },
        { label: "1.5 TSI 130cv", yearFrom: 2017, yearTo: null },
        { label: "1.6 TDI 105cv", yearFrom: 2012, yearTo: 2019 },
        { label: "2.0 TDI 150cv", yearFrom: 2012, yearTo: null },
        { label: "2.0 TSI GTI 245cv", yearFrom: 2013, yearTo: null },
      ],
    },
    Audi: {
      A3: [
        { label: "1.0 TFSI 116cv", yearFrom: 2016, yearTo: null },
        { label: "1.5 TFSI 150cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2012, yearTo: null },
        { label: "2.0 TFSI S3 310cv", yearFrom: 2013, yearTo: null },
      ],
    },
    "Mercedes-Benz": {
      "Classe A": [
        { label: "A180 1.3 136cv", yearFrom: 2018, yearTo: null },
        { label: "A200d 2.0 150cv", yearFrom: 2018, yearTo: null },
        { label: "A250 2.0 224cv", yearFrom: 2018, yearTo: null },
        { label: "A35 AMG 306cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Ford: {
      Fiesta: [
        { label: "1.1 Ti-VCT 85cv", yearFrom: 2017, yearTo: null },
        { label: "1.0 EcoBoost 100cv", yearFrom: 2017, yearTo: null },
        { label: "1.0 EcoBoost 125cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 TDCi 85cv", yearFrom: 2017, yearTo: 2021 },
        { label: "1.5 EcoBoost ST 200cv", yearFrom: 2018, yearTo: null },
      ],
    },
    Renault: {
      Clio: [
        { label: "1.0 SCe 65cv", yearFrom: 2019, yearTo: null },
        { label: "1.0 TCe 100cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 dCi/Blue dCi 85cv", yearFrom: 2019, yearTo: null },
        { label: "1.6 E-Tech Hybrid 140cv", yearFrom: 2020, yearTo: null },
      ],
    },
    Peugeot: {
      "208": [
        { label: "1.2 PureTech 75cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 PureTech 100cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 PureTech 130cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 BlueHDi 100cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica e-208 136cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Toyota: {
      Yaris: [
        { label: "1.0 72cv", yearFrom: 2020, yearTo: null },
        { label: "1.5 Hybrid 116cv", yearFrom: 2020, yearTo: null },
        { label: "1.5 Hybrid 130cv GR Sport", yearFrom: 2022, yearTo: null },
        { label: "GR Yaris 1.6 Turbo 261cv", yearFrom: 2020, yearTo: 2022 },
        { label: "GR Yaris 1.6 Turbo 280cv", yearFrom: 2022, yearTo: null },
      ],
      Corolla: [
        { label: "1.2 Turbo 116cv", yearFrom: 2019, yearTo: null },
        { label: "1.8 Hybrid 122cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 Hybrid 196cv", yearFrom: 2019, yearTo: null },
      ],
    },
  },
  moto: {
    Yamaha: {
      "MT-07": [{ label: "689cc 75cv", yearFrom: 2014, yearTo: null }],
      "MT-09": [
        { label: "890cc 119cv", yearFrom: 2021, yearTo: null },
        { label: "847cc 115cv", yearFrom: 2013, yearTo: 2020 },
      ],
    },
    Ducati: {
      "Panigale V4": [
        { label: "1103cc 214cv", yearFrom: 2018, yearTo: null },
        { label: "V4 S 1103cc 214cv", yearFrom: 2018, yearTo: null },
        { label: "V4 R 998cc 218cv", yearFrom: 2019, yearTo: null },
      ],
      Monster: [
        { label: "937cc 111cv", yearFrom: 2021, yearTo: null },
        { label: "821cc 112cv", yearFrom: 2014, yearTo: 2020 },
      ],
    },
    Honda: {
      "Africa Twin": [
        { label: "CRF1000L 998cc 95cv", yearFrom: 2016, yearTo: 2019 },
        { label: "CRF1100L 1084cc 102cv", yearFrom: 2020, yearTo: null },
      ],
    },
    BMW: {
      "R 1250 GS": [{ label: "1254cc 136cv", yearFrom: 2019, yearTo: null }],
    },
    KTM: {
      "Duke 390": [{ label: "373cc 44cv", yearFrom: 2013, yearTo: null }],
    },
  },
};

export function getEngineVariants(type: VehicleType, make: string, model: string): EngineVariant[] | null {
  return ENGINE_DATA[type]?.[make]?.[model] || null;
}
