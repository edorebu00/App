import type { VehicleType } from "./types";

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
