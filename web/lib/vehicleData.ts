import type { EngineVariant, VehicleType } from "./types";

/**
 * Dataset curato di marche/modelli per popolare i menu a tendina del form "Aggiungi veicolo".
 * Non è un catalogo ufficiale/esaustivo di ogni allestimento storico: copre le marche e i modelli
 * più comuni sul mercato italiano.
 */
export const VEHICLE_DATA: Record<VehicleType, Record<string, string[]>> = {
  auto: {
    Abarth: ["500", "500C", "595", "595C", "695", "124 Spider", "Punto Evo"],
    "Alfa Romeo": ["Giulia", "Giulietta", "Stelvio", "Tonale", "Junior", "MiTo", "159", "147", "Brera", "GT"],
    Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "Q8 e-tron", "e-tron GT", "TT"],
    BMW: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX"],
    BYD: ["Atto 3", "Seal", "Dolphin", "Seal U"],
    Chevrolet: ["Aveo", "Spark", "Captiva"],
    Citroën: ["C1", "C3", "C3 Aircross", "C4", "C4 Picasso", "C5 Aircross", "C5 X", "Berlingo", "Jumpy", "DS3", "DS4"],
    Cupra: ["Formentor", "Leon", "Born", "Ateca"],
    Dacia: ["Sandero", "Duster", "Jogger", "Spring"],
    "DS Automobiles": ["DS 3", "DS 4", "DS 7", "DS 9"],
    Fiat: ["Panda", "500", "600", "500X", "500L", "Tipo", "Punto", "Bravo", "Croma", "Multipla", "Ducato", "Doblo", "Qubo", "Sedici"],
    Ford: ["Fiesta", "Focus", "Puma", "Kuga", "EcoSport", "Mondeo", "C-Max", "Ka", "Ranger", "Galaxy", "Transit"],
    GWM: ["Ora Funky Cat"],
    Honda: ["Civic", "Jazz", "CR-V", "HR-V", "ZR-V", "Accord", "e"],
    Hyundai: ["i10", "i20", "i30", "i40", "Bayon", "Kona", "Tucson", "Santa Fe", "Staria", "Ioniq"],
    Isuzu: ["D-Max"],
    Jaguar: ["XE", "XF", "F-Pace", "E-Pace", "I-Pace"],
    Jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Avenger", "Wrangler", "Gladiator"],
    Kia: ["Picanto", "Rio", "Ceed", "Xceed", "Sportage", "Niro", "Stonic", "Sorento", "EV6", "EV9"],
    Lamborghini: ["Huracán", "Aventador", "Urus"],
    Lancia: ["Ypsilon", "Delta", "Musa", "Thesis"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport"],
    Lexus: ["UX", "NX", "RX"],
    Maserati: ["Ghibli", "Quattroporte", "Levante", "Grecale", "GranTurismo"],
    Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30"],
    "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "Classe V", "CLA", "GLA", "GLB", "GLC", "GLE", "EQA", "EQB", "EQC", "EQE", "EQS", "Sprinter", "Vito"],
    MG: ["ZS", "HS", "MG4", "MG3"],
    Mini: ["Cooper", "Countryman", "Clubman", "Cabrio"],
    Mitsubishi: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
    Nissan: ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Ariya", "Navara", "Leaf"],
    Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Zafira", "Combo"],
    Peugeot: ["108", "208", "308", "408", "508", "2008", "3008", "5008", "Partner", "Rifter"],
    Porsche: ["911", "718 Cayman", "718 Boxster", "Panamera", "Macan", "Cayenne", "Taycan"],
    Renault: ["Clio", "Captur", "Megane", "Kadjar", "Scenic", "Espace", "Trafic", "Twingo", "Zoe", "Austral"],
    Seat: ["Mii", "Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    Škoda: ["Fabia", "Scala", "Octavia", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Superb"],
    Smart: ["Fortwo", "Forfour"],
    SsangYong: ["Tivoli", "Korando", "Rexton"],
    Subaru: ["Impreza", "Forester", "XV", "Outback"],
    Suzuki: ["Swift", "Vitara", "S-Cross", "Ignis", "Jimny"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    Toyota: ["Aygo", "Yaris", "Corolla", "C-HR", "RAV4", "Highlander", "Camry", "Auris", "Prius", "Hilux", "Land Cruiser"],
    Volkswagen: ["Polo", "Golf", "Passat", "Arteon", "Tiguan", "T-Roc", "T-Cross", "Touareg", "Caddy", "Multivan", "Up!", "ID.3", "ID.4"],
    Volvo: ["V40", "V60", "V90", "XC40", "XC60", "XC90", "EX30", "EC40"],
  },
  moto: {
    Aprilia: ["RS 660", "Tuono 660", "RSV4", "Tuareg 660", "SR GT", "Shiver 900"],
    Benelli: ["TRK 502", "Leoncino 500", "752 S", "TNT 125"],
    Beta: ["RR 350", "Xtrainer"],
    BMW: ["S 1000 RR", "R 1250 GS", "F 850 GS", "R nineT", "G 310 R", "F 900 R"],
    CFMoto: ["300NK", "450MT", "700CL-X"],
    Ducati: ["Panigale V4", "Panigale V2", "Monster", "Multistrada", "Scrambler", "Diavel", "Streetfighter V4"],
    Fantic: ["Caballero"],
    "Harley-Davidson": ["Sportster", "Fat Boy", "Street Bob", "Road King", "Pan America"],
    Honda: ["CBR600RR", "CBR1000RR-R", "CB650R", "Africa Twin", "CB500F", "Hornet", "SH 125/150"],
    Husqvarna: ["Svartpilen 401", "Vitpilen 401", "Norden 901"],
    Kawasaki: ["Ninja 400", "Ninja 650", "Ninja ZX-10R", "Z650", "Z900", "Versys 650"],
    KTM: ["Duke 125", "Duke 390", "Duke 790", "Duke 890", "1290 Super Duke", "Adventure 390", "Adventure 1290"],
    Kymco: ["People", "Agility"],
    Malaguti: ["Centro", "Madison"],
    "Moto Guzzi": ["V7", "V9", "V85 TT", "California"],
    "MV Agusta": ["Brutale", "F3", "Turismo Veloce", "Dragster"],
    "Peugeot Motocycles": ["Django", "Speedfight"],
    Piaggio: ["Beverly", "MP3", "Liberty"],
    "Royal Enfield": ["Classic 350", "Meteor 350", "Himalayan", "Interceptor 650", "Continental GT 650"],
    Suzuki: ["GSX-R600", "GSX-R750", "GSX-R1000", "SV650", "V-Strom 650", "Hayabusa"],
    SWM: ["Superdual", "Silver Vase"],
    Triumph: ["Street Triple", "Speed Triple", "Tiger 900", "Bonneville T120", "Trident 660"],
    Vespa: ["Primavera", "GTS", "Sprint", "Elettrica"],
    Yamaha: ["MT-07", "MT-09", "MT-10", "YZF-R1", "YZF-R6", "YZF-R125", "Tracer 9", "Tenere 700", "NMAX"],
    "Zero Motorcycles": ["SR/F", "DSR"],
  },
};

export function getMakes(type: VehicleType): string[] {
  return Object.keys(VEHICLE_DATA[type]).sort((a, b) => a.localeCompare(b));
}

export function getModels(type: VehicleType, make: string): string[] {
  return VEHICLE_DATA[type][make] || [];
}

/**
 * Motorizzazioni con relativo periodo di produzione, scritte a mano (conoscenza generale,
 * nessuna ricerca IA a runtime). Non è un catalogo ufficiale esaustivo di ogni allestimento/
 * mercato: copre le varianti più diffuse per ciascun modello. Se un modello dovesse mancare
 * o un dato risultare sbagliato, il form ricade su un campo libero — segnalalo pure, è
 * un file di testo facile da correggere.
 */
const ENGINE_DATA: Record<VehicleType, Record<string, Record<string, EngineVariant[]>>> = {
  auto: {
    BYD: {
      "Atto 3": [{ label: "Elettrica 204cv", yearFrom: 2022, yearTo: null }],
      Seal: [
        { label: "Elettrica RWD 313cv", yearFrom: 2023, yearTo: null },
        { label: "Elettrica AWD 530cv", yearFrom: 2023, yearTo: null },
      ],
      Dolphin: [
        { label: "Elettrica 95cv", yearFrom: 2023, yearTo: null },
        { label: "Elettrica 204cv", yearFrom: 2023, yearTo: null },
      ],
      "Seal U": [{ label: "Elettrica 218cv", yearFrom: 2024, yearTo: null }],
    },
    Chevrolet: {
      Aveo: [{ label: "1.2 16v 86cv", yearFrom: 2011, yearTo: 2015 }],
      Spark: [{ label: "1.0 16v 68cv", yearFrom: 2010, yearTo: 2015 }],
      Captiva: [{ label: "2.2 VCDi 184cv", yearFrom: 2011, yearTo: 2015 }],
    },
    GWM: {
      "Ora Funky Cat": [{ label: "Elettrica 171cv", yearFrom: 2023, yearTo: null }],
    },
    Isuzu: {
      "D-Max": [
        { label: "1.9 D 164cv", yearFrom: 2020, yearTo: null },
        { label: "1.9 D 150cv", yearFrom: 2017, yearTo: 2020 },
      ],
    },
    Lexus: {
      UX: [{ label: "250h Hybrid 184cv", yearFrom: 2018, yearTo: null }],
      NX: [
        { label: "350h Hybrid 242cv", yearFrom: 2021, yearTo: null },
        { label: "450h+ Plug-in Hybrid 309cv", yearFrom: 2021, yearTo: null },
      ],
      RX: [{ label: "450h Hybrid 313cv", yearFrom: 2022, yearTo: null }],
    },
    MG: {
      ZS: [
        { label: "1.5 VTi 106cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica ZS EV 177cv", yearFrom: 2019, yearTo: null },
      ],
      HS: [
        { label: "1.5 T-GDI 162cv", yearFrom: 2020, yearTo: null },
        { label: "Plug-in Hybrid 258cv", yearFrom: 2021, yearTo: null },
      ],
      MG4: [
        { label: "Elettrica Standard 170cv", yearFrom: 2022, yearTo: null },
        { label: "Elettrica Extended 245cv", yearFrom: 2022, yearTo: null },
      ],
      MG3: [{ label: "1.5 Hybrid+ 194cv", yearFrom: 2023, yearTo: null }],
    },
    SsangYong: {
      Tivoli: [
        { label: "1.5 T-GDI 163cv", yearFrom: 2019, yearTo: null },
        { label: "1.6 e-XDi 136cv", yearFrom: 2015, yearTo: 2019 },
      ],
      Korando: [
        { label: "1.5 T-GDI 163cv", yearFrom: 2019, yearTo: null },
        { label: "1.6 e-XDi 136cv", yearFrom: 2019, yearTo: null },
      ],
      Rexton: [{ label: "2.2 e-XDi 202cv", yearFrom: 2017, yearTo: null }],
    },
    Abarth: {
      "500": [
        { label: "1.4 T-Jet 135cv", yearFrom: 2008, yearTo: 2016 },
        { label: "1.4 T-Jet 145cv", yearFrom: 2016, yearTo: 2019 },
      ],
      "500C": [{ label: "1.4 T-Jet 135cv", yearFrom: 2010, yearTo: 2019 }],
      "595": [
        { label: "1.4 T-Jet 145cv", yearFrom: 2016, yearTo: null },
        { label: "1.4 T-Jet 165cv Competizione", yearFrom: 2016, yearTo: null },
        { label: "1.4 T-Jet 180cv Scorpioneoro", yearFrom: 2018, yearTo: null },
      ],
      "595C": [
        { label: "1.4 T-Jet 145cv", yearFrom: 2016, yearTo: null },
        { label: "1.4 T-Jet 165cv Competizione", yearFrom: 2016, yearTo: null },
      ],
      "695": [
        { label: "1.4 T-Jet 180cv", yearFrom: 2018, yearTo: null },
        { label: "1.4 T-Jet 200cv Esseesse", yearFrom: 2021, yearTo: null },
      ],
      "124 Spider": [{ label: "1.4 MultiAir Turbo 170cv", yearFrom: 2016, yearTo: 2019 }],
      "Punto Evo": [
        { label: "1.4 T-Jet 155cv", yearFrom: 2010, yearTo: 2012 },
        { label: "1.4 T-Jet 165cv", yearFrom: 2010, yearTo: 2012 },
      ],
    },
    "Alfa Romeo": {
      Giulia: [
        { label: "2.0 Turbo 200cv", yearFrom: 2016, yearTo: null },
        { label: "2.2 Diesel 160cv", yearFrom: 2016, yearTo: null },
        { label: "2.2 Diesel 190cv", yearFrom: 2016, yearTo: null },
        { label: "2.9 V6 Bi-Turbo Quadrifoglio 510cv", yearFrom: 2016, yearTo: null },
      ],
      Junior: [
        { label: "1.2 Hybrid 136cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica 156cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica Veloce 280cv", yearFrom: 2024, yearTo: null },
      ],
      Giulietta: [
        { label: "1.4 MultiAir 120cv", yearFrom: 2010, yearTo: 2020 },
        { label: "1.6 JTDm 120cv", yearFrom: 2010, yearTo: 2020 },
        { label: "2.0 JTDm 150cv", yearFrom: 2010, yearTo: 2020 },
        { label: "1.75 TBi QV 240cv", yearFrom: 2010, yearTo: 2020 },
      ],
      Stelvio: [
        { label: "2.0 Turbo 200cv", yearFrom: 2017, yearTo: null },
        { label: "2.2 Diesel 190cv", yearFrom: 2017, yearTo: null },
        { label: "2.9 V6 Bi-Turbo Quadrifoglio 510cv", yearFrom: 2018, yearTo: null },
      ],
      Tonale: [
        { label: "1.5 Hybrid 130cv", yearFrom: 2022, yearTo: null },
        { label: "1.3 Plug-in Hybrid 280cv", yearFrom: 2022, yearTo: null },
      ],
      MiTo: [
        { label: "0.9 TwinAir 105cv", yearFrom: 2014, yearTo: 2018 },
        { label: "1.4 MultiAir 135cv", yearFrom: 2008, yearTo: 2018 },
        { label: "1.3 JTDm 95cv", yearFrom: 2008, yearTo: 2018 },
      ],
      "159": [
        { label: "1.9 JTDm 150cv", yearFrom: 2005, yearTo: 2011 },
        { label: "2.4 JTDm 200cv", yearFrom: 2005, yearTo: 2011 },
        { label: "3.2 V6 260cv", yearFrom: 2005, yearTo: 2011 },
      ],
      "147": [
        { label: "1.6 Twin Spark 105cv", yearFrom: 2000, yearTo: 2010 },
        { label: "1.9 JTD 115cv", yearFrom: 2000, yearTo: 2010 },
        { label: "GTA 3.2 V6 250cv", yearFrom: 2002, yearTo: 2005 },
      ],
      Brera: [
        { label: "2.2 JTS 185cv", yearFrom: 2005, yearTo: 2010 },
        { label: "3.2 V6 260cv", yearFrom: 2005, yearTo: 2010 },
      ],
      GT: [
        { label: "1.9 JTD 150cv", yearFrom: 2003, yearTo: 2010 },
        { label: "3.2 V6 240cv", yearFrom: 2004, yearTo: 2010 },
      ],
    },
    Audi: {
      A1: [
        { label: "1.0 TFSI 95cv", yearFrom: 2018, yearTo: null },
        { label: "1.4 TFSI 150cv S line", yearFrom: 2018, yearTo: null },
        { label: "2.0 TFSI S1 231cv", yearFrom: 2019, yearTo: null },
      ],
      A3: [
        { label: "1.0 TFSI 116cv", yearFrom: 2016, yearTo: null },
        { label: "1.5 TFSI 150cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2012, yearTo: null },
        { label: "2.0 TFSI S3 310cv", yearFrom: 2013, yearTo: null },
      ],
      A4: [
        { label: "2.0 TDI 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 TFSI 190cv", yearFrom: 2015, yearTo: null },
        { label: "3.0 TDI 286cv", yearFrom: 2015, yearTo: null },
      ],
      A5: [
        { label: "2.0 TDI 190cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TFSI 252cv", yearFrom: 2016, yearTo: null },
      ],
      A6: [
        { label: "2.0 TDI 204cv", yearFrom: 2018, yearTo: null },
        { label: "3.0 TDI 286cv", yearFrom: 2018, yearTo: null },
        { label: "3.0 TFSI 340cv", yearFrom: 2018, yearTo: null },
      ],
      A7: [
        { label: "3.0 TDI 286cv", yearFrom: 2017, yearTo: null },
        { label: "3.0 TFSI 340cv", yearFrom: 2017, yearTo: null },
      ],
      A8: [
        { label: "3.0 TDI 286cv", yearFrom: 2017, yearTo: null },
        { label: "3.0 TFSI 340cv", yearFrom: 2017, yearTo: null },
      ],
      Q2: [
        { label: "1.0 TFSI 116cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2016, yearTo: null },
      ],
      Q3: [
        { label: "2.0 TDI 150cv", yearFrom: 2018, yearTo: null },
        { label: "2.0 TFSI 190cv", yearFrom: 2018, yearTo: null },
        { label: "RS Q3 2.5 TFSI 400cv", yearFrom: 2019, yearTo: null },
      ],
      "Q4 e-tron": [
        { label: "Elettrica 40 204cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica 50 quattro 299cv", yearFrom: 2021, yearTo: null },
      ],
      Q5: [
        { label: "2.0 TDI 190cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TFSI 252cv", yearFrom: 2016, yearTo: null },
        { label: "SQ5 3.0 TDI 341cv", yearFrom: 2016, yearTo: null },
      ],
      Q7: [
        { label: "3.0 TDI 286cv", yearFrom: 2015, yearTo: null },
        { label: "3.0 TFSI 340cv", yearFrom: 2015, yearTo: null },
      ],
      Q8: [
        { label: "3.0 TDI 286cv", yearFrom: 2018, yearTo: null },
        { label: "SQ8 4.0 TDI 435cv", yearFrom: 2019, yearTo: null },
      ],
      TT: [
        { label: "2.0 TFSI 230cv", yearFrom: 2014, yearTo: 2023 },
        { label: "2.0 TDI 184cv", yearFrom: 2014, yearTo: 2023 },
        { label: "TTS 2.0 TFSI 310cv", yearFrom: 2014, yearTo: 2023 },
      ],
      "e-tron GT": [
        { label: "Elettrica 476cv", yearFrom: 2021, yearTo: null },
        { label: "RS e-tron GT 646cv", yearFrom: 2021, yearTo: null },
      ],
      "Q8 e-tron": [
        { label: "Elettrica 50 340cv", yearFrom: 2023, yearTo: null },
        { label: "Elettrica 55 408cv", yearFrom: 2023, yearTo: null },
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
      "Serie 2": [
        { label: "218d 2.0 150cv", yearFrom: 2014, yearTo: null },
        { label: "220i 2.0 184cv", yearFrom: 2014, yearTo: null },
        { label: "M240i 3.0 374cv", yearFrom: 2017, yearTo: null },
      ],
      "Serie 3": [
        { label: "318d 2.0 150cv", yearFrom: 2012, yearTo: null },
        { label: "320d 2.0 190cv", yearFrom: 2012, yearTo: null },
        { label: "330d 3.0 265cv", yearFrom: 2012, yearTo: null },
        { label: "320i 2.0 184cv", yearFrom: 2012, yearTo: null },
        { label: "M340i 3.0 374cv", yearFrom: 2019, yearTo: null },
      ],
      "Serie 4": [
        { label: "420d 2.0 190cv", yearFrom: 2013, yearTo: null },
        { label: "430i 2.0 258cv", yearFrom: 2013, yearTo: null },
        { label: "M440i 3.0 374cv", yearFrom: 2020, yearTo: null },
      ],
      "Serie 5": [
        { label: "520d 2.0 190cv", yearFrom: 2017, yearTo: null },
        { label: "530d 3.0 286cv", yearFrom: 2017, yearTo: null },
        { label: "M550i 4.4 530cv", yearFrom: 2017, yearTo: null },
      ],
      "Serie 7": [
        { label: "730d 3.0 286cv", yearFrom: 2015, yearTo: null },
        { label: "750i 4.4 530cv", yearFrom: 2015, yearTo: null },
      ],
      X1: [
        { label: "18d 2.0 150cv", yearFrom: 2015, yearTo: null },
        { label: "20i 2.0 192cv", yearFrom: 2015, yearTo: null },
      ],
      X2: [
        { label: "18d 2.0 150cv", yearFrom: 2018, yearTo: null },
        { label: "M35i 2.0 306cv", yearFrom: 2019, yearTo: null },
      ],
      X3: [
        { label: "20d 2.0 190cv", yearFrom: 2017, yearTo: null },
        { label: "30i 2.0 252cv", yearFrom: 2017, yearTo: null },
        { label: "X3 M 3.0 480cv", yearFrom: 2019, yearTo: null },
      ],
      X4: [
        { label: "20d 2.0 190cv", yearFrom: 2018, yearTo: null },
        { label: "M40i 3.0 360cv", yearFrom: 2018, yearTo: null },
      ],
      X5: [
        { label: "30d 3.0 286cv", yearFrom: 2018, yearTo: null },
        { label: "X5 M 4.4 600cv", yearFrom: 2019, yearTo: null },
      ],
      X6: [
        { label: "30d 3.0 286cv", yearFrom: 2019, yearTo: null },
        { label: "X6 M 4.4 600cv", yearFrom: 2019, yearTo: null },
      ],
      Z4: [
        { label: "20i 2.0 197cv", yearFrom: 2018, yearTo: null },
        { label: "M40i 3.0 340cv", yearFrom: 2018, yearTo: null },
      ],
      i3: [
        { label: "Elettrica 170cv", yearFrom: 2013, yearTo: 2022 },
        { label: "i3 REX (range extender) 170cv", yearFrom: 2013, yearTo: 2022 },
      ],
      i4: [
        { label: "eDrive40 340cv", yearFrom: 2021, yearTo: null },
        { label: "M50 544cv", yearFrom: 2021, yearTo: null },
      ],
      X7: [
        { label: "30d 3.0 286cv", yearFrom: 2019, yearTo: null },
        { label: "M60i 4.4 530cv", yearFrom: 2022, yearTo: null },
      ],
      iX: [
        { label: "xDrive40 326cv", yearFrom: 2021, yearTo: null },
        { label: "xDrive50 523cv", yearFrom: 2021, yearTo: null },
      ],
    },
    Citroën: {
      C1: [
        { label: "1.0 VTi 68cv", yearFrom: 2014, yearTo: 2021 },
        { label: "1.2 PureTech 82cv", yearFrom: 2014, yearTo: 2021 },
      ],
      C3: [
        { label: "1.2 PureTech 83cv", yearFrom: 2016, yearTo: null },
        { label: "1.2 PureTech 110cv", yearFrom: 2016, yearTo: null },
        { label: "1.5 BlueHDi 100cv", yearFrom: 2016, yearTo: null },
      ],
      "C3 Aircross": [
        { label: "1.2 PureTech 110cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 BlueHDi 100cv", yearFrom: 2017, yearTo: null },
      ],
      C4: [
        { label: "1.2 PureTech 130cv", yearFrom: 2020, yearTo: null },
        { label: "1.5 BlueHDi 130cv", yearFrom: 2020, yearTo: null },
        { label: "Elettrica ë-C4 136cv", yearFrom: 2020, yearTo: null },
      ],
      "C4 Picasso": [
        { label: "1.6 BlueHDi 120cv", yearFrom: 2013, yearTo: 2018 },
        { label: "1.2 PureTech 130cv", yearFrom: 2013, yearTo: 2018 },
      ],
      "C5 Aircross": [
        { label: "1.2 PureTech 130cv", yearFrom: 2018, yearTo: null },
        { label: "1.5 BlueHDi 130cv", yearFrom: 2018, yearTo: null },
        { label: "Hybrid Plug-in 225cv", yearFrom: 2020, yearTo: null },
      ],
      "C5 X": [{ label: "1.6 Hybrid 225cv", yearFrom: 2022, yearTo: null }],
      Jumpy: [{ label: "2.0 BlueHDi 120cv", yearFrom: 2016, yearTo: null }],
      Berlingo: [
        { label: "1.5 BlueHDi 100cv", yearFrom: 2018, yearTo: null },
        { label: "1.2 PureTech 110cv", yearFrom: 2018, yearTo: null },
      ],
      DS3: [
        { label: "1.2 PureTech 110cv", yearFrom: 2010, yearTo: 2019 },
        { label: "1.6 THP 155cv", yearFrom: 2010, yearTo: 2015 },
      ],
      DS4: [
        { label: "1.6 THP 165cv", yearFrom: 2011, yearTo: 2018 },
        { label: "2.0 HDi 160cv", yearFrom: 2011, yearTo: 2018 },
      ],
    },
    Cupra: {
      Formentor: [
        { label: "1.5 TSI 150cv", yearFrom: 2020, yearTo: null },
        { label: "2.0 TSI 190cv", yearFrom: 2020, yearTo: null },
        { label: "2.0 TSI VZ5 390cv", yearFrom: 2021, yearTo: null },
      ],
      Leon: [
        { label: "1.5 TSI 150cv", yearFrom: 2020, yearTo: null },
        { label: "2.0 TSI 300cv", yearFrom: 2020, yearTo: null },
      ],
      Born: [
        { label: "Elettrica 150cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica 231cv", yearFrom: 2021, yearTo: null },
      ],
      Ateca: [
        { label: "2.0 TSI 300cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 TDI 190cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Dacia: {
      Sandero: [
        { label: "1.0 SCe 65cv", yearFrom: 2020, yearTo: null },
        { label: "1.0 TCe 90cv", yearFrom: 2020, yearTo: null },
        { label: "1.0 Bi-Fuel GPL 100cv", yearFrom: 2021, yearTo: null },
      ],
      Duster: [
        { label: "1.0 TCe 90cv", yearFrom: 2018, yearTo: null },
        { label: "1.3 TCe 150cv", yearFrom: 2018, yearTo: null },
        { label: "1.5 dCi 115cv", yearFrom: 2018, yearTo: 2022 },
      ],
      Jogger: [
        { label: "1.0 TCe 110cv", yearFrom: 2022, yearTo: null },
        { label: "1.6 Hybrid 140cv", yearFrom: 2022, yearTo: null },
      ],
      Spring: [
        { label: "Elettrica 45cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica 65cv", yearFrom: 2021, yearTo: null },
      ],
    },
    "DS Automobiles": {
      "DS 3": [
        { label: "1.2 PureTech 130cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica E-Tense 156cv", yearFrom: 2019, yearTo: null },
      ],
      "DS 4": [
        { label: "1.2 PureTech 130cv", yearFrom: 2021, yearTo: null },
        { label: "1.5 BlueHDi 130cv", yearFrom: 2021, yearTo: null },
      ],
      "DS 7": [
        { label: "1.6 PureTech 180cv", yearFrom: 2017, yearTo: null },
        { label: "Hybrid E-Tense 4x4 300cv", yearFrom: 2019, yearTo: null },
      ],
      "DS 9": [
        { label: "1.6 PureTech 250cv", yearFrom: 2021, yearTo: null },
        { label: "Hybrid E-Tense 360cv", yearFrom: 2021, yearTo: null },
      ],
    },
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
      "600": [
        { label: "Elettrica 154cv", yearFrom: 2023, yearTo: null },
        { label: "1.2 Hybrid 100cv", yearFrom: 2024, yearTo: null },
      ],
      "500X": [
        { label: "1.0 T3 120cv", yearFrom: 2018, yearTo: null },
        { label: "1.3 FireFly 150cv", yearFrom: 2018, yearTo: null },
        { label: "1.6 MultiJet 130cv", yearFrom: 2015, yearTo: 2020 },
      ],
      "500L": [
        { label: "1.4 95cv", yearFrom: 2012, yearTo: 2020 },
        { label: "1.3 MultiJet 95cv", yearFrom: 2012, yearTo: 2020 },
      ],
      Tipo: [
        { label: "1.0 T3 100cv", yearFrom: 2020, yearTo: null },
        { label: "1.3 MultiJet 95cv", yearFrom: 2016, yearTo: null },
        { label: "1.6 MultiJet 130cv", yearFrom: 2016, yearTo: null },
      ],
      Punto: [
        { label: "1.2 8v 69cv", yearFrom: 2012, yearTo: 2018 },
        { label: "1.3 MultiJet 75cv", yearFrom: 2012, yearTo: 2018 },
        { label: "1.4 T-Jet 120cv", yearFrom: 2012, yearTo: 2015 },
      ],
      Bravo: [
        { label: "1.4 T-Jet 120cv", yearFrom: 2007, yearTo: 2014 },
        { label: "1.6 MultiJet 105cv", yearFrom: 2007, yearTo: 2014 },
        { label: "2.0 MultiJet 165cv", yearFrom: 2007, yearTo: 2014 },
      ],
      Croma: [
        { label: "1.9 Multijet 150cv", yearFrom: 2005, yearTo: 2011 },
        { label: "2.2 16v 147cv", yearFrom: 2005, yearTo: 2011 },
      ],
      Multipla: [
        { label: "1.9 JTD 110cv", yearFrom: 1998, yearTo: 2010 },
        { label: "1.6 16v 103cv", yearFrom: 1998, yearTo: 2010 },
      ],
      Ducato: [
        { label: "2.3 MultiJet 120cv", yearFrom: 2014, yearTo: null },
        { label: "2.3 MultiJet 160cv", yearFrom: 2014, yearTo: null },
      ],
      Doblo: [
        { label: "1.6 MultiJet 100cv", yearFrom: 2010, yearTo: null },
        { label: "1.3 MultiJet 95cv", yearFrom: 2010, yearTo: null },
      ],
      Qubo: [
        { label: "1.3 MultiJet 80cv", yearFrom: 2008, yearTo: null },
        { label: "1.4 77cv", yearFrom: 2008, yearTo: null },
      ],
      Sedici: [
        { label: "1.6 107cv", yearFrom: 2006, yearTo: 2014 },
        { label: "1.9 MultiJet 120cv", yearFrom: 2006, yearTo: 2014 },
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
      Focus: [
        { label: "1.0 EcoBoost 125cv", yearFrom: 2018, yearTo: null },
        { label: "1.5 EcoBlue 120cv", yearFrom: 2018, yearTo: null },
        { label: "ST 2.3 EcoBoost 280cv", yearFrom: 2019, yearTo: null },
      ],
      Puma: [
        { label: "1.0 EcoBoost 125cv", yearFrom: 2019, yearTo: null },
        { label: "1.0 EcoBoost Hybrid 155cv", yearFrom: 2019, yearTo: null },
        { label: "ST 1.5 EcoBoost 200cv", yearFrom: 2020, yearTo: null },
      ],
      Kuga: [
        { label: "1.5 EcoBlue 120cv", yearFrom: 2019, yearTo: null },
        { label: "2.5 Duratec Plug-in Hybrid 225cv", yearFrom: 2020, yearTo: null },
      ],
      EcoSport: [
        { label: "1.0 EcoBoost 125cv", yearFrom: 2017, yearTo: 2022 },
        { label: "1.5 TDCi 100cv", yearFrom: 2017, yearTo: 2022 },
      ],
      Mondeo: [
        { label: "2.0 TDCi 150cv", yearFrom: 2014, yearTo: 2022 },
        { label: "2.0 EcoBlue 190cv", yearFrom: 2014, yearTo: 2022 },
      ],
      "C-Max": [
        { label: "1.0 EcoBoost 125cv", yearFrom: 2010, yearTo: 2019 },
        { label: "1.5 TDCi 120cv", yearFrom: 2010, yearTo: 2019 },
      ],
      Ka: [
        { label: "1.2 Ti-VCT 70cv", yearFrom: 2016, yearTo: 2021 },
        { label: "1.2 Ti-VCT 85cv", yearFrom: 2016, yearTo: 2021 },
      ],
      Ranger: [
        { label: "2.0 EcoBlue 170cv", yearFrom: 2019, yearTo: null },
        { label: "3.0 EcoBlue Raptor 240cv", yearFrom: 2022, yearTo: null },
      ],
      Galaxy: [{ label: "2.0 EcoBlue 150cv", yearFrom: 2015, yearTo: null }],
      Transit: [
        { label: "2.0 EcoBlue 130cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 EcoBlue 170cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Honda: {
      Civic: [
        { label: "1.0 VTEC Turbo 126cv", yearFrom: 2017, yearTo: 2022 },
        { label: "1.5 VTEC Turbo 182cv", yearFrom: 2017, yearTo: 2022 },
        { label: "e:HEV 2.0 Hybrid 184cv", yearFrom: 2022, yearTo: null },
        { label: "Type R 2.0 Turbo 329cv", yearFrom: 2017, yearTo: null },
      ],
      Jazz: [
        { label: "1.3 i-VTEC 102cv", yearFrom: 2015, yearTo: 2020 },
        { label: "1.5 e:HEV Hybrid 109cv", yearFrom: 2020, yearTo: null },
      ],
      "CR-V": [
        { label: "1.5 VTEC Turbo 173cv", yearFrom: 2018, yearTo: null },
        { label: "2.0 e:HEV Hybrid 184cv", yearFrom: 2018, yearTo: null },
      ],
      "HR-V": [
        { label: "1.5 i-VTEC 130cv", yearFrom: 2015, yearTo: 2021 },
        { label: "1.5 e:HEV Hybrid 131cv", yearFrom: 2021, yearTo: null },
      ],
      Accord: [
        { label: "1.5 VTEC Turbo 192cv", yearFrom: 2018, yearTo: 2022 },
        { label: "2.0 e:HEV Hybrid 215cv", yearFrom: 2018, yearTo: 2022 },
      ],
      "ZR-V": [{ label: "2.0 e:HEV Hybrid 184cv", yearFrom: 2023, yearTo: null }],
      e: [{ label: "Elettrica 136cv", yearFrom: 2020, yearTo: 2024 }],
    },
    Hyundai: {
      i10: [
        { label: "1.0 MPI 67cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 MPI 84cv", yearFrom: 2019, yearTo: null },
      ],
      i20: [
        { label: "1.0 T-GDI 100cv", yearFrom: 2020, yearTo: null },
        { label: "1.2 MPI 84cv", yearFrom: 2020, yearTo: null },
        { label: "N 1.6 T-GDI 204cv", yearFrom: 2021, yearTo: null },
      ],
      i30: [
        { label: "1.0 T-GDI 120cv", yearFrom: 2017, yearTo: null },
        { label: "1.6 CRDi 136cv", yearFrom: 2017, yearTo: null },
        { label: "N 2.0 T-GDI 280cv", yearFrom: 2018, yearTo: null },
      ],
      Kona: [
        { label: "1.0 T-GDI 120cv", yearFrom: 2017, yearTo: null },
        { label: "1.6 T-GDI Hybrid 141cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica 204cv", yearFrom: 2018, yearTo: null },
      ],
      Tucson: [
        { label: "1.6 T-GDI 150cv", yearFrom: 2020, yearTo: null },
        { label: "1.6 CRDi Hybrid 230cv", yearFrom: 2020, yearTo: null },
      ],
      "Santa Fe": [
        { label: "2.2 CRDi 200cv", yearFrom: 2018, yearTo: null },
        { label: "1.6 T-GDI Plug-in Hybrid 265cv", yearFrom: 2020, yearTo: null },
      ],
      Ioniq: [
        { label: "Hybrid 141cv", yearFrom: 2016, yearTo: 2022 },
        { label: "Elettrica 136cv", yearFrom: 2016, yearTo: 2022 },
      ],
      i40: [{ label: "1.7 CRDi 136cv", yearFrom: 2011, yearTo: 2019 }],
      Bayon: [{ label: "1.0 T-GDI 100cv", yearFrom: 2021, yearTo: null }],
      Staria: [{ label: "2.2 CRDi 177cv", yearFrom: 2021, yearTo: null }],
    },
    Jaguar: {
      XE: [
        { label: "2.0 D 163cv", yearFrom: 2015, yearTo: 2020 },
        { label: "2.0 P250 250cv", yearFrom: 2015, yearTo: 2020 },
      ],
      XF: [
        { label: "2.0 D 180cv", yearFrom: 2015, yearTo: null },
        { label: "3.0 D 300cv", yearFrom: 2015, yearTo: null },
      ],
      "F-Pace": [
        { label: "2.0 D 180cv", yearFrom: 2016, yearTo: null },
        { label: "3.0 D 300cv", yearFrom: 2016, yearTo: null },
        { label: "SVR 5.0 V8 550cv", yearFrom: 2018, yearTo: null },
      ],
      "E-Pace": [
        { label: "2.0 D 150cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 P200 200cv", yearFrom: 2017, yearTo: null },
      ],
      "I-Pace": [{ label: "Elettrica 400cv", yearFrom: 2018, yearTo: null }],
    },
    Jeep: {
      Renegade: [
        { label: "1.0 T3 120cv", yearFrom: 2018, yearTo: null },
        { label: "1.6 MultiJet 130cv", yearFrom: 2014, yearTo: null },
        { label: "4xe Plug-in Hybrid 190cv", yearFrom: 2020, yearTo: null },
      ],
      Compass: [
        { label: "1.3 T4 130cv", yearFrom: 2017, yearTo: null },
        { label: "1.6 MultiJet 130cv", yearFrom: 2017, yearTo: null },
        { label: "4xe Plug-in Hybrid 240cv", yearFrom: 2020, yearTo: null },
      ],
      Cherokee: [{ label: "2.2 MultiJet 200cv", yearFrom: 2014, yearTo: 2020 }],
      "Grand Cherokee": [
        { label: "3.0 CRD 250cv", yearFrom: 2010, yearTo: null },
        { label: "4xe Plug-in Hybrid 380cv", yearFrom: 2022, yearTo: null },
      ],
      Avenger: [
        { label: "1.2 T3 Hybrid 100cv", yearFrom: 2023, yearTo: null },
        { label: "Elettrica 156cv", yearFrom: 2023, yearTo: null },
      ],
      Wrangler: [
        { label: "2.2 MultiJet 200cv", yearFrom: 2018, yearTo: null },
        { label: "2.0 Turbo 272cv", yearFrom: 2018, yearTo: null },
        { label: "4xe Plug-in Hybrid 380cv", yearFrom: 2021, yearTo: null },
      ],
      Gladiator: [{ label: "3.6 Pentastar 285cv", yearFrom: 2019, yearTo: null }],
    },
    Kia: {
      Picanto: [
        { label: "1.0 MPI 67cv", yearFrom: 2017, yearTo: null },
        { label: "1.2 MPI 84cv", yearFrom: 2017, yearTo: null },
      ],
      Rio: [
        { label: "1.0 T-GDI 100cv", yearFrom: 2017, yearTo: null },
        { label: "1.4 MPI 100cv", yearFrom: 2017, yearTo: null },
      ],
      Ceed: [
        { label: "1.0 T-GDI 120cv", yearFrom: 2018, yearTo: null },
        { label: "1.6 CRDi 136cv", yearFrom: 2018, yearTo: null },
        { label: "GT 1.6 T-GDI 204cv", yearFrom: 2019, yearTo: null },
      ],
      Sportage: [
        { label: "1.6 T-GDI 150cv", yearFrom: 2021, yearTo: null },
        { label: "1.6 CRDi Hybrid 230cv", yearFrom: 2021, yearTo: null },
      ],
      Niro: [
        { label: "1.6 GDI Hybrid 141cv", yearFrom: 2016, yearTo: null },
        { label: "Elettrica e-Niro 204cv", yearFrom: 2018, yearTo: null },
      ],
      Stonic: [
        { label: "1.0 T-GDI 120cv", yearFrom: 2017, yearTo: null },
        { label: "1.4 CRDi 90cv", yearFrom: 2017, yearTo: null },
      ],
      Sorento: [
        { label: "2.2 CRDi 200cv", yearFrom: 2020, yearTo: null },
        { label: "1.6 T-GDI Plug-in Hybrid 265cv", yearFrom: 2020, yearTo: null },
      ],
      Xceed: [
        { label: "1.0 T-GDI 120cv", yearFrom: 2019, yearTo: null },
        { label: "1.6 CRDi 136cv", yearFrom: 2019, yearTo: null },
      ],
      EV6: [
        { label: "Elettrica 229cv", yearFrom: 2021, yearTo: null },
        { label: "GT 585cv", yearFrom: 2022, yearTo: null },
      ],
      EV9: [
        { label: "Elettrica 204cv", yearFrom: 2023, yearTo: null },
        { label: "GT-Line 384cv", yearFrom: 2023, yearTo: null },
      ],
    },
    Lamborghini: {
      Huracán: [
        { label: "5.2 V10 610cv", yearFrom: 2014, yearTo: null },
        { label: "Performante 5.2 V10 640cv", yearFrom: 2017, yearTo: null },
        { label: "STO 5.2 V10 640cv", yearFrom: 2021, yearTo: null },
      ],
      Aventador: [
        { label: "6.5 V12 700cv", yearFrom: 2011, yearTo: 2022 },
        { label: "SVJ 6.5 V12 770cv", yearFrom: 2018, yearTo: 2022 },
      ],
      Urus: [
        { label: "4.0 V8 Biturbo 650cv", yearFrom: 2018, yearTo: null },
        { label: "Performante 4.0 V8 666cv", yearFrom: 2022, yearTo: null },
      ],
    },
    Lancia: {
      Ypsilon: [
        { label: "1.2 69cv", yearFrom: 2011, yearTo: null },
        { label: "0.9 TwinAir 85cv", yearFrom: 2011, yearTo: 2021 },
        { label: "1.0 Hybrid 70cv", yearFrom: 2021, yearTo: null },
      ],
      Delta: [
        { label: "1.4 MultiAir 120cv", yearFrom: 2008, yearTo: 2014 },
        { label: "1.6 MultiJet 105cv", yearFrom: 2008, yearTo: 2014 },
      ],
      Musa: [
        { label: "1.4 8v 77cv", yearFrom: 2004, yearTo: 2012 },
        { label: "1.3 MultiJet 90cv", yearFrom: 2004, yearTo: 2012 },
      ],
      Thesis: [
        { label: "2.4 20v 170cv", yearFrom: 2002, yearTo: 2009 },
        { label: "2.4 JTD 150cv", yearFrom: 2002, yearTo: 2009 },
      ],
    },
    "Land Rover": {
      Defender: [
        { label: "2.0 D200 200cv", yearFrom: 2020, yearTo: null },
        { label: "3.0 D300 300cv", yearFrom: 2020, yearTo: null },
        { label: "P400e Plug-in Hybrid 404cv", yearFrom: 2020, yearTo: null },
      ],
      Discovery: [
        { label: "3.0 D250 249cv", yearFrom: 2017, yearTo: null },
        { label: "3.0 D300 300cv", yearFrom: 2017, yearTo: null },
      ],
      "Discovery Sport": [
        { label: "2.0 D165 163cv", yearFrom: 2019, yearTo: null },
        { label: "P300e Plug-in Hybrid 309cv", yearFrom: 2020, yearTo: null },
      ],
      "Range Rover": [
        { label: "3.0 D300 300cv", yearFrom: 2022, yearTo: null },
        { label: "P440e Plug-in Hybrid 440cv", yearFrom: 2022, yearTo: null },
      ],
      "Range Rover Evoque": [
        { label: "2.0 D150 150cv", yearFrom: 2019, yearTo: null },
        { label: "P300e Plug-in Hybrid 309cv", yearFrom: 2020, yearTo: null },
      ],
      "Range Rover Sport": [
        { label: "3.0 D300 300cv", yearFrom: 2022, yearTo: null },
        { label: "P440e Plug-in Hybrid 440cv", yearFrom: 2022, yearTo: null },
      ],
    },
    Maserati: {
      Ghibli: [
        { label: "3.0 V6 Diesel 275cv", yearFrom: 2013, yearTo: null },
        { label: "3.0 V6 350cv", yearFrom: 2013, yearTo: null },
        { label: "Trofeo 3.8 V8 580cv", yearFrom: 2020, yearTo: null },
      ],
      Quattroporte: [
        { label: "3.0 V6 Diesel 275cv", yearFrom: 2013, yearTo: null },
        { label: "3.0 V6 350cv", yearFrom: 2013, yearTo: null },
        { label: "Trofeo 3.8 V8 580cv", yearFrom: 2020, yearTo: null },
      ],
      Levante: [
        { label: "3.0 V6 Diesel 275cv", yearFrom: 2016, yearTo: null },
        { label: "3.0 V6 350cv", yearFrom: 2016, yearTo: null },
        { label: "Trofeo 3.8 V8 580cv", yearFrom: 2018, yearTo: null },
      ],
      Grecale: [
        { label: "2.0 Mild Hybrid 300cv", yearFrom: 2022, yearTo: null },
        { label: "Trofeo 3.0 V6 530cv", yearFrom: 2022, yearTo: null },
      ],
      GranTurismo: [
        { label: "4.7 V8 460cv", yearFrom: 2007, yearTo: 2019 },
        { label: "Folgore Elettrica 761cv", yearFrom: 2023, yearTo: null },
      ],
    },
    Mazda: {
      Mazda2: [
        { label: "1.5 Skyactiv-G 90cv", yearFrom: 2015, yearTo: null },
        { label: "1.5 Skyactiv-G 115cv", yearFrom: 2015, yearTo: null },
      ],
      Mazda3: [
        { label: "2.0 Skyactiv-G 122cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 e-Skyactiv X 180cv", yearFrom: 2019, yearTo: null },
      ],
      Mazda6: [
        { label: "2.0 Skyactiv-G 145cv", yearFrom: 2012, yearTo: 2022 },
        { label: "2.2 Skyactiv-D 150cv", yearFrom: 2012, yearTo: 2022 },
      ],
      "CX-3": [
        { label: "2.0 Skyactiv-G 121cv", yearFrom: 2015, yearTo: 2021 },
        { label: "1.8 Skyactiv-D 115cv", yearFrom: 2015, yearTo: 2021 },
      ],
      "CX-30": [
        { label: "2.0 Skyactiv-G 122cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 e-Skyactiv X 180cv", yearFrom: 2019, yearTo: null },
      ],
      "CX-5": [
        { label: "2.0 Skyactiv-G 165cv", yearFrom: 2017, yearTo: null },
        { label: "2.2 Skyactiv-D 184cv", yearFrom: 2017, yearTo: null },
      ],
      "MX-5": [
        { label: "1.5 Skyactiv-G 132cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 Skyactiv-G 184cv", yearFrom: 2015, yearTo: null },
      ],
      "CX-60": [
        { label: "3.3 e-Skyactiv D 200cv", yearFrom: 2022, yearTo: null },
        { label: "Plug-in Hybrid 327cv", yearFrom: 2022, yearTo: null },
      ],
      "MX-30": [{ label: "Elettrica 145cv", yearFrom: 2020, yearTo: null }],
    },
    "Mercedes-Benz": {
      "Classe A": [
        { label: "A180 1.3 136cv", yearFrom: 2018, yearTo: null },
        { label: "A200d 2.0 150cv", yearFrom: 2018, yearTo: null },
        { label: "A250 2.0 224cv", yearFrom: 2018, yearTo: null },
        { label: "A35 AMG 306cv", yearFrom: 2019, yearTo: null },
      ],
      "Classe B": [
        { label: "B180 1.3 136cv", yearFrom: 2018, yearTo: null },
        { label: "B200d 2.0 150cv", yearFrom: 2018, yearTo: null },
      ],
      "Classe C": [
        { label: "C200 1.5 204cv", yearFrom: 2021, yearTo: null },
        { label: "C220d 2.0 200cv", yearFrom: 2021, yearTo: null },
        { label: "C63 AMG 2.0 Turbo Hybrid 680cv", yearFrom: 2023, yearTo: null },
      ],
      "Classe E": [
        { label: "E200 2.0 197cv", yearFrom: 2016, yearTo: null },
        { label: "E220d 2.0 194cv", yearFrom: 2016, yearTo: null },
        { label: "E63 AMG 4.0 V8 612cv", yearFrom: 2017, yearTo: null },
      ],
      "Classe S": [
        { label: "S350d 3.0 286cv", yearFrom: 2020, yearTo: null },
        { label: "S500 3.0 435cv", yearFrom: 2020, yearTo: null },
      ],
      CLA: [
        { label: "CLA200 1.3 163cv", yearFrom: 2019, yearTo: null },
        { label: "CLA220d 2.0 190cv", yearFrom: 2019, yearTo: null },
      ],
      GLA: [
        { label: "GLA200 1.3 163cv", yearFrom: 2020, yearTo: null },
        { label: "GLA220d 2.0 190cv", yearFrom: 2020, yearTo: null },
      ],
      GLB: [
        { label: "GLB200 1.3 163cv", yearFrom: 2019, yearTo: null },
        { label: "GLB220d 2.0 190cv", yearFrom: 2019, yearTo: null },
      ],
      GLC: [
        { label: "GLC200 2.0 197cv", yearFrom: 2019, yearTo: null },
        { label: "GLC300d 2.0 245cv", yearFrom: 2019, yearTo: null },
      ],
      GLE: [
        { label: "GLE300d 2.0 245cv", yearFrom: 2019, yearTo: null },
        { label: "GLE450 3.0 367cv", yearFrom: 2019, yearTo: null },
      ],
      Sprinter: [
        { label: "2.1 CDI 143cv", yearFrom: 2018, yearTo: null },
        { label: "2.1 CDI 163cv", yearFrom: 2018, yearTo: null },
      ],
      Vito: [
        { label: "2.0 CDI 116cv", yearFrom: 2014, yearTo: null },
        { label: "2.0 CDI 163cv", yearFrom: 2014, yearTo: null },
      ],
      "Classe V": [
        { label: "220d 163cv", yearFrom: 2014, yearTo: null },
        { label: "300d 239cv", yearFrom: 2019, yearTo: null },
      ],
      EQA: [{ label: "250 190cv", yearFrom: 2021, yearTo: null }],
      EQB: [{ label: "300 228cv", yearFrom: 2021, yearTo: null }],
      EQC: [{ label: "400 4Matic 408cv", yearFrom: 2019, yearTo: null }],
      EQE: [{ label: "350 292cv", yearFrom: 2022, yearTo: null }],
      EQS: [{ label: "450+ 333cv", yearFrom: 2021, yearTo: null }],
    },
    Mini: {
      Cooper: [
        { label: "1.5 Cooper 136cv", yearFrom: 2014, yearTo: null },
        { label: "2.0 Cooper S 178cv", yearFrom: 2014, yearTo: null },
        { label: "John Cooper Works 231cv", yearFrom: 2014, yearTo: null },
      ],
      Countryman: [
        { label: "1.5 Cooper 136cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 Cooper S 178cv", yearFrom: 2017, yearTo: null },
        { label: "Cooper SE Plug-in Hybrid 224cv", yearFrom: 2017, yearTo: null },
      ],
      Clubman: [
        { label: "1.5 Cooper 136cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 Cooper S 178cv", yearFrom: 2015, yearTo: null },
      ],
      Cabrio: [
        { label: "1.5 Cooper 136cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 Cooper S 178cv", yearFrom: 2016, yearTo: null },
      ],
    },
    Mitsubishi: {
      "Space Star": [{ label: "1.2 MIVEC 80cv", yearFrom: 2013, yearTo: null }],
      ASX: [
        { label: "1.6 MIVEC 117cv", yearFrom: 2010, yearTo: null },
        { label: "1.6 DI-D 114cv", yearFrom: 2010, yearTo: null },
      ],
      "Eclipse Cross": [
        { label: "1.5 MIVEC Turbo 163cv", yearFrom: 2018, yearTo: null },
        { label: "Plug-in Hybrid 188cv", yearFrom: 2020, yearTo: null },
      ],
      Outlander: [
        { label: "2.0 MIVEC 150cv", yearFrom: 2012, yearTo: null },
        { label: "Plug-in Hybrid 224cv", yearFrom: 2013, yearTo: null },
      ],
      L200: [
        { label: "2.2 DI-D 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.4 DI-D 181cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Nissan: {
      Micra: [
        { label: "1.0 IG-T 92cv", yearFrom: 2017, yearTo: null },
        { label: "0.9 IG-T 90cv", yearFrom: 2017, yearTo: null },
      ],
      Note: [
        { label: "1.5 dCi 90cv", yearFrom: 2013, yearTo: 2016 },
        { label: "1.2 80cv", yearFrom: 2013, yearTo: 2016 },
      ],
      Juke: [
        { label: "1.0 DIG-T 114cv", yearFrom: 2019, yearTo: null },
        { label: "Hybrid 143cv", yearFrom: 2021, yearTo: null },
      ],
      Qashqai: [
        { label: "1.3 DIG-T 140cv", yearFrom: 2021, yearTo: null },
        { label: "e-Power Hybrid 190cv", yearFrom: 2021, yearTo: null },
      ],
      "X-Trail": [
        { label: "1.5 e-Power 204cv", yearFrom: 2022, yearTo: null },
        { label: "1.3 DIG-T 158cv", yearFrom: 2022, yearTo: null },
      ],
      Leaf: [
        { label: "Elettrica 150cv", yearFrom: 2018, yearTo: null },
        { label: "Elettrica e+ 217cv", yearFrom: 2019, yearTo: null },
      ],
      Ariya: [
        { label: "Elettrica 63kWh 218cv", yearFrom: 2022, yearTo: null },
        { label: "Elettrica e-4ORCE 306cv", yearFrom: 2022, yearTo: null },
      ],
      Navara: [{ label: "2.3 dCi 190cv", yearFrom: 2015, yearTo: null }],
    },
    Opel: {
      Corsa: [
        { label: "1.2 75cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 Turbo 100cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica 136cv", yearFrom: 2020, yearTo: null },
      ],
      Astra: [
        { label: "1.2 Turbo 110cv", yearFrom: 2021, yearTo: null },
        { label: "1.5 Diesel 122cv", yearFrom: 2021, yearTo: null },
      ],
      Insignia: [
        { label: "1.5 Turbo 165cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 Diesel 174cv", yearFrom: 2017, yearTo: null },
      ],
      Mokka: [
        { label: "1.2 Turbo 130cv", yearFrom: 2020, yearTo: null },
        { label: "Elettrica 136cv", yearFrom: 2020, yearTo: null },
      ],
      Crossland: [
        { label: "1.2 Turbo 110cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 Diesel 102cv", yearFrom: 2017, yearTo: null },
      ],
      Grandland: [
        { label: "1.2 Turbo 130cv", yearFrom: 2017, yearTo: null },
        { label: "Hybrid Plug-in 224cv", yearFrom: 2019, yearTo: null },
      ],
      Zafira: [{ label: "1.6 CDTI 136cv", yearFrom: 2011, yearTo: 2019 }],
      Combo: [{ label: "1.5 Diesel 100cv", yearFrom: 2018, yearTo: null }],
    },
    Peugeot: {
      "108": [
        { label: "1.0 VTi 68cv", yearFrom: 2014, yearTo: 2021 },
        { label: "1.2 PureTech 82cv", yearFrom: 2014, yearTo: 2021 },
      ],
      "208": [
        { label: "1.2 PureTech 75cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 PureTech 100cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 PureTech 130cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 BlueHDi 100cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica e-208 136cv", yearFrom: 2019, yearTo: null },
      ],
      "308": [
        { label: "1.2 PureTech 130cv", yearFrom: 2021, yearTo: null },
        { label: "1.5 BlueHDi 130cv", yearFrom: 2021, yearTo: null },
      ],
      "2008": [
        { label: "1.2 PureTech 130cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica e-2008 136cv", yearFrom: 2019, yearTo: null },
      ],
      "3008": [
        { label: "1.2 PureTech 130cv", yearFrom: 2016, yearTo: null },
        { label: "Hybrid4 300cv", yearFrom: 2020, yearTo: null },
      ],
      "5008": [
        { label: "1.2 PureTech 130cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 BlueHDi 130cv", yearFrom: 2017, yearTo: null },
      ],
      Partner: [
        { label: "1.5 BlueHDi 100cv", yearFrom: 2018, yearTo: null },
        { label: "Elettrica e-Partner 136cv", yearFrom: 2021, yearTo: null },
      ],
      Rifter: [{ label: "1.5 BlueHDi 100cv", yearFrom: 2018, yearTo: null }],
      "408": [
        { label: "1.2 PureTech 130cv", yearFrom: 2022, yearTo: null },
        { label: "Hybrid 225cv", yearFrom: 2022, yearTo: null },
      ],
      "508": [
        { label: "1.6 PureTech 225cv", yearFrom: 2018, yearTo: null },
        { label: "2.0 BlueHDi 160cv", yearFrom: 2018, yearTo: null },
      ],
    },
    Porsche: {
      "911": [
        { label: "Carrera 3.0 385cv", yearFrom: 2019, yearTo: null },
        { label: "Carrera S 3.0 450cv", yearFrom: 2019, yearTo: null },
        { label: "Turbo S 3.7 650cv", yearFrom: 2020, yearTo: null },
      ],
      "718 Cayman": [
        { label: "2.0 Turbo 300cv", yearFrom: 2016, yearTo: null },
        { label: "GTS 4.0 400cv", yearFrom: 2020, yearTo: null },
      ],
      "718 Boxster": [
        { label: "2.0 Turbo 300cv", yearFrom: 2016, yearTo: null },
        { label: "GTS 4.0 400cv", yearFrom: 2020, yearTo: null },
      ],
      Panamera: [
        { label: "3.0 V6 330cv", yearFrom: 2016, yearTo: null },
        { label: "Turbo 4.0 V8 620cv", yearFrom: 2016, yearTo: null },
      ],
      Macan: [
        { label: "2.0 Turbo 265cv", yearFrom: 2014, yearTo: null },
        { label: "GTS 2.9 V6 380cv", yearFrom: 2020, yearTo: null },
      ],
      Cayenne: [
        { label: "3.0 V6 340cv", yearFrom: 2018, yearTo: null },
        { label: "Turbo GT 4.0 640cv", yearFrom: 2021, yearTo: null },
      ],
      Taycan: [
        { label: "Elettrica 4S 435cv", yearFrom: 2019, yearTo: null },
        { label: "Turbo S 761cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Renault: {
      Clio: [
        { label: "1.0 SCe 65cv", yearFrom: 2019, yearTo: null },
        { label: "1.0 TCe 100cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 dCi/Blue dCi 85cv", yearFrom: 2019, yearTo: null },
        { label: "1.6 E-Tech Hybrid 140cv", yearFrom: 2020, yearTo: null },
      ],
      Captur: [
        { label: "1.0 TCe 100cv", yearFrom: 2019, yearTo: null },
        { label: "E-Tech Hybrid 145cv", yearFrom: 2020, yearTo: null },
      ],
      Megane: [
        { label: "1.3 TCe 140cv", yearFrom: 2020, yearTo: null },
        { label: "E-Tech Elettrica 218cv", yearFrom: 2022, yearTo: null },
      ],
      Kadjar: [
        { label: "1.3 TCe 140cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 Blue dCi 115cv", yearFrom: 2019, yearTo: 2022 },
      ],
      Scenic: [
        { label: "1.3 TCe 140cv", yearFrom: 2016, yearTo: 2022 },
        { label: "1.5 dCi 110cv", yearFrom: 2016, yearTo: 2022 },
      ],
      Twingo: [
        { label: "1.0 SCe 65cv", yearFrom: 2014, yearTo: null },
        { label: "Elettrica 82cv", yearFrom: 2020, yearTo: null },
      ],
      Austral: [
        { label: "1.3 TCe 140cv", yearFrom: 2022, yearTo: null },
        { label: "E-Tech Full Hybrid 200cv", yearFrom: 2022, yearTo: null },
      ],
      Espace: [
        { label: "1.8 TCe 225cv", yearFrom: 2015, yearTo: 2023 },
        { label: "1.6 dCi 160cv", yearFrom: 2015, yearTo: 2023 },
      ],
      Trafic: [{ label: "2.0 dCi 145cv", yearFrom: 2014, yearTo: null }],
      Zoe: [
        { label: "Elettrica 108cv", yearFrom: 2012, yearTo: 2024 },
        { label: "Elettrica 135cv", yearFrom: 2019, yearTo: 2024 },
      ],
    },
    Seat: {
      Mii: [
        { label: "1.0 60cv", yearFrom: 2012, yearTo: 2022 },
        { label: "Elettrica e-Mii 83cv", yearFrom: 2019, yearTo: 2022 },
      ],
      Ibiza: [
        { label: "1.0 TSI 95cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 TSI 150cv FR", yearFrom: 2017, yearTo: null },
      ],
      Leon: [
        { label: "1.5 TSI 150cv", yearFrom: 2020, yearTo: null },
        { label: "Cupra 2.0 TSI 300cv", yearFrom: 2020, yearTo: null },
      ],
      Arona: [
        { label: "1.0 TSI 115cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 TSI 150cv", yearFrom: 2017, yearTo: null },
      ],
      Ateca: [
        { label: "1.5 TSI 150cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2016, yearTo: null },
      ],
      Tarraco: [
        { label: "1.5 TSI 150cv", yearFrom: 2018, yearTo: null },
        { label: "2.0 TDI 190cv", yearFrom: 2018, yearTo: null },
      ],
    },
    Škoda: {
      Scala: [
        { label: "1.0 TSI 116cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 TSI 150cv", yearFrom: 2019, yearTo: null },
      ],
      Enyaq: [
        { label: "Elettrica 60 179cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica RS 299cv", yearFrom: 2021, yearTo: null },
      ],
      Fabia: [
        { label: "1.0 TSI 95cv", yearFrom: 2021, yearTo: null },
        { label: "1.0 TSI 110cv", yearFrom: 2021, yearTo: null },
      ],
      Octavia: [
        { label: "1.5 TSI 150cv", yearFrom: 2020, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2020, yearTo: null },
        { label: "RS 2.0 TSI 245cv", yearFrom: 2020, yearTo: null },
      ],
      Kamiq: [
        { label: "1.0 TSI 116cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 TSI 150cv", yearFrom: 2019, yearTo: null },
      ],
      Karoq: [
        { label: "1.5 TSI 150cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2017, yearTo: null },
      ],
      Kodiaq: [
        { label: "2.0 TSI 190cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2017, yearTo: null },
      ],
      Superb: [
        { label: "2.0 TSI 190cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 TDI 190cv", yearFrom: 2015, yearTo: null },
      ],
    },
    Smart: {
      Fortwo: [
        { label: "1.0 71cv", yearFrom: 2014, yearTo: null },
        { label: "Elettrica EQ 82cv", yearFrom: 2017, yearTo: null },
      ],
      Forfour: [
        { label: "1.0 71cv", yearFrom: 2014, yearTo: null },
        { label: "Elettrica EQ 82cv", yearFrom: 2017, yearTo: null },
      ],
    },
    Subaru: {
      Impreza: [
        { label: "1.6i 114cv", yearFrom: 2016, yearTo: null },
        { label: "2.0i e-Boxer Hybrid 150cv", yearFrom: 2018, yearTo: null },
      ],
      Forester: [{ label: "2.0i e-Boxer Hybrid 150cv", yearFrom: 2018, yearTo: null }],
      XV: [
        { label: "1.6i 114cv", yearFrom: 2017, yearTo: 2023 },
        { label: "2.0i e-Boxer Hybrid 150cv", yearFrom: 2019, yearTo: 2023 },
      ],
      Outback: [
        { label: "2.5i 169cv", yearFrom: 2020, yearTo: null },
        { label: "2.0i e-Boxer Hybrid 150cv", yearFrom: 2021, yearTo: null },
      ],
    },
    Suzuki: {
      Swift: [
        { label: "1.2 Dualjet 90cv", yearFrom: 2017, yearTo: null },
        { label: "1.4 Boosterjet Sport 140cv", yearFrom: 2018, yearTo: null },
      ],
      Vitara: [
        { label: "1.4 Boosterjet 129cv", yearFrom: 2015, yearTo: null },
        { label: "1.4 Hybrid 129cv", yearFrom: 2020, yearTo: null },
      ],
      "S-Cross": [
        { label: "1.4 Boosterjet 129cv", yearFrom: 2013, yearTo: null },
        { label: "1.4 Hybrid 129cv", yearFrom: 2020, yearTo: null },
      ],
      Ignis: [{ label: "1.2 Dualjet 83cv", yearFrom: 2016, yearTo: null }],
      Jimny: [{ label: "1.5 102cv", yearFrom: 2018, yearTo: null }],
    },
    Tesla: {
      "Model 3": [
        { label: "Standard Range 283cv", yearFrom: 2019, yearTo: null },
        { label: "Long Range Dual Motor 498cv", yearFrom: 2019, yearTo: null },
        { label: "Performance 513cv", yearFrom: 2019, yearTo: null },
      ],
      "Model S": [
        { label: "Long Range 670cv", yearFrom: 2021, yearTo: null },
        { label: "Plaid 1020cv", yearFrom: 2021, yearTo: null },
      ],
      "Model X": [
        { label: "Long Range 670cv", yearFrom: 2021, yearTo: null },
        { label: "Plaid 1020cv", yearFrom: 2021, yearTo: null },
      ],
      "Model Y": [
        { label: "Long Range Dual Motor 498cv", yearFrom: 2021, yearTo: null },
        { label: "Performance 514cv", yearFrom: 2021, yearTo: null },
      ],
    },
    Toyota: {
      Aygo: [{ label: "1.0 VVT-i 72cv", yearFrom: 2014, yearTo: 2022 }],
      Yaris: [
        { label: "1.0 72cv", yearFrom: 2020, yearTo: null },
        { label: "1.5 Hybrid 116cv", yearFrom: 2020, yearTo: null },
        { label: "1.5 Hybrid 130cv GR Sport", yearFrom: 2022, yearTo: null },
        { label: "GR Yaris 1.6 Turbo 261cv", yearFrom: 2020, yearTo: 2023 },
        { label: "GR Yaris 1.6 Turbo 280cv", yearFrom: 2024, yearTo: null },
      ],
      Corolla: [
        { label: "1.2 Turbo 116cv", yearFrom: 2019, yearTo: null },
        { label: "1.8 Hybrid 122cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 Hybrid 196cv", yearFrom: 2019, yearTo: null },
      ],
      "C-HR": [
        { label: "1.8 Hybrid 122cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 Hybrid 184cv", yearFrom: 2020, yearTo: null },
      ],
      RAV4: [
        { label: "2.5 Hybrid 218cv", yearFrom: 2019, yearTo: null },
        { label: "Plug-in Hybrid 306cv", yearFrom: 2020, yearTo: null },
      ],
      Auris: [
        { label: "1.8 Hybrid 136cv", yearFrom: 2012, yearTo: 2019 },
        { label: "1.2 Turbo 116cv", yearFrom: 2015, yearTo: 2019 },
      ],
      Prius: [
        { label: "1.8 Hybrid 122cv", yearFrom: 2016, yearTo: null },
        { label: "Plug-in Hybrid 223cv", yearFrom: 2016, yearTo: null },
      ],
      Hilux: [
        { label: "2.4 D-4D 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.8 D-4D 204cv", yearFrom: 2020, yearTo: null },
      ],
      Highlander: [{ label: "2.5 Hybrid 248cv", yearFrom: 2020, yearTo: null }],
      Camry: [{ label: "2.5 Hybrid 218cv", yearFrom: 2019, yearTo: null }],
      "Land Cruiser": [{ label: "2.8 D-4D 204cv", yearFrom: 2018, yearTo: null }],
    },
    Volkswagen: {
      Polo: [
        { label: "1.0 TSI 95cv", yearFrom: 2017, yearTo: null },
        { label: "GTI 2.0 TSI 207cv", yearFrom: 2018, yearTo: null },
      ],
      Golf: [
        { label: "1.0 TSI 110cv", yearFrom: 2016, yearTo: null },
        { label: "1.5 TSI 130cv", yearFrom: 2017, yearTo: null },
        { label: "1.6 TDI 105cv", yearFrom: 2012, yearTo: 2019 },
        { label: "2.0 TDI 150cv", yearFrom: 2012, yearTo: null },
        { label: "2.0 TSI GTI 245cv", yearFrom: 2013, yearTo: null },
      ],
      Passat: [
        { label: "2.0 TDI 150cv", yearFrom: 2014, yearTo: null },
        { label: "2.0 TSI 190cv", yearFrom: 2014, yearTo: null },
      ],
      Tiguan: [
        { label: "1.5 TSI 150cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2016, yearTo: null },
        { label: "R 2.0 TSI 320cv", yearFrom: 2021, yearTo: null },
      ],
      "T-Roc": [
        { label: "1.5 TSI 150cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2017, yearTo: null },
        { label: "R 2.0 TSI 300cv", yearFrom: 2019, yearTo: null },
      ],
      "T-Cross": [
        { label: "1.0 TSI 95cv", yearFrom: 2019, yearTo: null },
        { label: "1.0 TSI 110cv", yearFrom: 2019, yearTo: null },
      ],
      Touareg: [
        { label: "3.0 TDI 231cv", yearFrom: 2018, yearTo: null },
        { label: "3.0 TSI 340cv", yearFrom: 2018, yearTo: null },
      ],
      Arteon: [
        { label: "2.0 TDI 190cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 TSI R 320cv", yearFrom: 2020, yearTo: null },
      ],
      Caddy: [{ label: "2.0 TDI 122cv", yearFrom: 2020, yearTo: null }],
      Multivan: [
        { label: "1.5 TSI 136cv", yearFrom: 2021, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2021, yearTo: null },
        { label: "eHybrid 218cv", yearFrom: 2021, yearTo: null },
      ],
      "Up!": [
        { label: "1.0 60cv", yearFrom: 2016, yearTo: null },
        { label: "Elettrica e-up! 82cv", yearFrom: 2016, yearTo: null },
      ],
      "ID.3": [
        { label: "Elettrica Pro 150cv", yearFrom: 2020, yearTo: null },
        { label: "Elettrica Pro S 204cv", yearFrom: 2020, yearTo: null },
      ],
      "ID.4": [
        { label: "Elettrica Pro 170cv", yearFrom: 2021, yearTo: null },
        { label: "GTX 4motion 299cv", yearFrom: 2021, yearTo: null },
      ],
    },
    Volvo: {
      V40: [
        { label: "T3 1.5 152cv", yearFrom: 2012, yearTo: 2019 },
        { label: "D2 1.6 120cv", yearFrom: 2012, yearTo: 2019 },
      ],
      V60: [
        { label: "B4 2.0 197cv", yearFrom: 2018, yearTo: null },
        { label: "T8 Plug-in Hybrid 390cv", yearFrom: 2018, yearTo: null },
      ],
      V90: [
        { label: "B4 2.0 197cv", yearFrom: 2016, yearTo: null },
        { label: "T8 Plug-in Hybrid 390cv", yearFrom: 2016, yearTo: null },
      ],
      XC40: [
        { label: "B3 1.5 163cv", yearFrom: 2018, yearTo: null },
        { label: "Elettrica Recharge 231cv", yearFrom: 2020, yearTo: null },
      ],
      XC60: [
        { label: "B4 2.0 197cv", yearFrom: 2017, yearTo: null },
        { label: "T8 Plug-in Hybrid 390cv", yearFrom: 2017, yearTo: null },
      ],
      XC90: [
        { label: "B5 2.0 235cv", yearFrom: 2014, yearTo: null },
        { label: "T8 Plug-in Hybrid 390cv", yearFrom: 2014, yearTo: null },
      ],
      EX30: [
        { label: "Elettrica Single Motor 272cv", yearFrom: 2023, yearTo: null },
        { label: "Twin Motor 428cv", yearFrom: 2023, yearTo: null },
      ],
      EC40: [
        { label: "Elettrica 231cv", yearFrom: 2023, yearTo: null },
        { label: "Twin Motor 402cv", yearFrom: 2023, yearTo: null },
      ],
    },
  },
  moto: {
    Beta: {
      "RR 350": [{ label: "350cc 4T enduro", yearFrom: 2013, yearTo: null }],
      Xtrainer: [{ label: "300cc 2T", yearFrom: 2015, yearTo: null }],
    },
    CFMoto: {
      "300NK": [{ label: "292cc 29cv", yearFrom: 2019, yearTo: null }],
      "450MT": [{ label: "449cc 43cv", yearFrom: 2023, yearTo: null }],
      "700CL-X": [{ label: "693cc 74cv", yearFrom: 2022, yearTo: null }],
    },
    Fantic: {
      Caballero: [
        { label: "500cc 40cv", yearFrom: 2018, yearTo: null },
        { label: "125cc 15cv", yearFrom: 2018, yearTo: null },
      ],
    },
    Kymco: {
      People: [
        { label: "125cc 11cv", yearFrom: 2010, yearTo: null },
        { label: "300cc 27cv", yearFrom: 2010, yearTo: null },
      ],
      Agility: [
        { label: "125cc 11cv", yearFrom: 2010, yearTo: null },
        { label: "150cc 13cv", yearFrom: 2010, yearTo: null },
      ],
    },
    Malaguti: {
      Centro: [{ label: "125cc 11cv", yearFrom: 2010, yearTo: null }],
      Madison: [
        { label: "125cc 11cv", yearFrom: 2010, yearTo: null },
        { label: "400cc 32cv", yearFrom: 2010, yearTo: null },
      ],
    },
    "Peugeot Motocycles": {
      Django: [
        { label: "125cc 12cv", yearFrom: 2014, yearTo: null },
        { label: "150cc 13cv", yearFrom: 2014, yearTo: null },
      ],
      Speedfight: [{ label: "125cc 15cv", yearFrom: 2014, yearTo: null }],
    },
    SWM: {
      Superdual: [{ label: "600cc 54cv", yearFrom: 2017, yearTo: null }],
      "Silver Vase": [{ label: "440cc 34cv", yearFrom: 2017, yearTo: null }],
    },
    "Zero Motorcycles": {
      "SR/F": [{ label: "Elettrica 110cv", yearFrom: 2019, yearTo: null }],
      DSR: [{ label: "Elettrica 70cv", yearFrom: 2019, yearTo: null }],
    },
    Aprilia: {
      "RS 660": [{ label: "659cc 100cv", yearFrom: 2020, yearTo: null }],
      "Tuono 660": [{ label: "659cc 95cv", yearFrom: 2021, yearTo: null }],
      RSV4: [{ label: "1099cc 217cv", yearFrom: 2021, yearTo: null }],
      "Tuareg 660": [{ label: "659cc 80cv", yearFrom: 2022, yearTo: null }],
      "SR GT": [
        { label: "125cc 15cv", yearFrom: 2022, yearTo: null },
        { label: "200cc 18cv", yearFrom: 2022, yearTo: null },
      ],
      "Shiver 900": [{ label: "896cc 95cv", yearFrom: 2017, yearTo: null }],
    },
    Benelli: {
      "TRK 502": [{ label: "500cc 47cv", yearFrom: 2017, yearTo: null }],
      "Leoncino 500": [{ label: "500cc 47cv", yearFrom: 2017, yearTo: null }],
      "752 S": [{ label: "754cc 76cv", yearFrom: 2020, yearTo: null }],
      "TNT 125": [{ label: "125cc 15cv", yearFrom: 2018, yearTo: null }],
    },
    BMW: {
      "S 1000 RR": [{ label: "999cc 210cv", yearFrom: 2019, yearTo: null }],
      "R 1250 GS": [{ label: "1254cc 136cv", yearFrom: 2019, yearTo: null }],
      "F 850 GS": [{ label: "853cc 95cv", yearFrom: 2018, yearTo: null }],
      "R nineT": [{ label: "1170cc 109cv", yearFrom: 2014, yearTo: null }],
      "G 310 R": [{ label: "313cc 34cv", yearFrom: 2017, yearTo: null }],
      "F 900 R": [{ label: "895cc 105cv", yearFrom: 2020, yearTo: null }],
    },
    Ducati: {
      "Panigale V4": [
        { label: "1103cc 214cv", yearFrom: 2018, yearTo: null },
        { label: "V4 S 1103cc 214cv", yearFrom: 2018, yearTo: null },
        { label: "V4 R 998cc 218cv", yearFrom: 2019, yearTo: null },
      ],
      "Panigale V2": [{ label: "955cc 155cv", yearFrom: 2020, yearTo: null }],
      Monster: [
        { label: "937cc 111cv", yearFrom: 2021, yearTo: null },
        { label: "821cc 112cv", yearFrom: 2014, yearTo: 2020 },
      ],
      Multistrada: [
        { label: "1158cc 170cv V4", yearFrom: 2021, yearTo: null },
        { label: "937cc 113cv", yearFrom: 2016, yearTo: 2020 },
      ],
      Scrambler: [{ label: "803cc 73cv", yearFrom: 2015, yearTo: null }],
      Diavel: [
        { label: "1158cc 168cv V4", yearFrom: 2023, yearTo: null },
        { label: "1262cc 159cv", yearFrom: 2019, yearTo: 2022 },
      ],
      "Streetfighter V4": [{ label: "1103cc 208cv", yearFrom: 2020, yearTo: null }],
    },
    "Harley-Davidson": {
      Sportster: [
        { label: "883cc 50cv", yearFrom: 2004, yearTo: 2022 },
        { label: "S 1252cc 121cv", yearFrom: 2021, yearTo: null },
      ],
      "Fat Boy": [{ label: "1868cc 92cv", yearFrom: 2018, yearTo: null }],
      "Street Bob": [{ label: "1746cc 78cv", yearFrom: 2018, yearTo: null }],
      "Road King": [{ label: "1868cc 92cv", yearFrom: 2017, yearTo: null }],
      "Pan America": [{ label: "1250cc 150cv", yearFrom: 2021, yearTo: null }],
    },
    Honda: {
      CBR600RR: [{ label: "599cc 121cv", yearFrom: 2007, yearTo: 2020 }],
      "CBR1000RR-R": [{ label: "999cc 217cv", yearFrom: 2020, yearTo: null }],
      CB650R: [{ label: "649cc 95cv", yearFrom: 2019, yearTo: null }],
      "Africa Twin": [
        { label: "CRF1000L 998cc 95cv", yearFrom: 2016, yearTo: 2019 },
        { label: "CRF1100L 1084cc 102cv", yearFrom: 2020, yearTo: null },
      ],
      CB500F: [{ label: "471cc 47cv", yearFrom: 2013, yearTo: null }],
      Hornet: [
        { label: "755cc 92cv", yearFrom: 2023, yearTo: null },
        { label: "CB600F 599cc 102cv", yearFrom: 2007, yearTo: 2013 },
      ],
      "SH 125/150": [
        { label: "125cc 13cv", yearFrom: 2013, yearTo: null },
        { label: "150cc 14cv", yearFrom: 2013, yearTo: null },
      ],
    },
    Husqvarna: {
      "Svartpilen 401": [{ label: "373cc 44cv", yearFrom: 2018, yearTo: null }],
      "Vitpilen 401": [{ label: "373cc 44cv", yearFrom: 2018, yearTo: null }],
      "Norden 901": [{ label: "889cc 105cv", yearFrom: 2022, yearTo: null }],
    },
    Kawasaki: {
      "Ninja 400": [{ label: "399cc 45cv", yearFrom: 2018, yearTo: null }],
      "Ninja 650": [{ label: "649cc 68cv", yearFrom: 2017, yearTo: null }],
      "Ninja ZX-10R": [{ label: "998cc 203cv", yearFrom: 2016, yearTo: null }],
      Z650: [{ label: "649cc 68cv", yearFrom: 2017, yearTo: null }],
      Z900: [{ label: "948cc 125cv", yearFrom: 2017, yearTo: null }],
      "Versys 650": [{ label: "649cc 68cv", yearFrom: 2015, yearTo: null }],
    },
    KTM: {
      "Duke 125": [{ label: "125cc 15cv", yearFrom: 2017, yearTo: null }],
      "Duke 390": [{ label: "373cc 44cv", yearFrom: 2013, yearTo: null }],
      "Duke 790": [{ label: "799cc 105cv", yearFrom: 2018, yearTo: 2021 }],
      "Duke 890": [{ label: "889cc 115cv", yearFrom: 2021, yearTo: null }],
      "1290 Super Duke": [{ label: "1301cc 180cv", yearFrom: 2020, yearTo: null }],
      "Adventure 390": [{ label: "373cc 44cv", yearFrom: 2020, yearTo: null }],
      "Adventure 1290": [{ label: "1301cc 160cv", yearFrom: 2021, yearTo: null }],
    },
    "Moto Guzzi": {
      V7: [
        { label: "850cc 65cv", yearFrom: 2021, yearTo: null },
        { label: "750cc 52cv", yearFrom: 2012, yearTo: 2020 },
      ],
      V9: [{ label: "850cc 55cv", yearFrom: 2016, yearTo: null }],
      "V85 TT": [{ label: "850cc 80cv", yearFrom: 2019, yearTo: null }],
      California: [{ label: "1380cc 96cv", yearFrom: 2013, yearTo: 2020 }],
    },
    "MV Agusta": {
      Brutale: [{ label: "798cc 140cv", yearFrom: 2016, yearTo: null }],
      F3: [{ label: "798cc 147cv", yearFrom: 2012, yearTo: null }],
      "Turismo Veloce": [{ label: "798cc 110cv", yearFrom: 2014, yearTo: null }],
      Dragster: [{ label: "798cc 140cv", yearFrom: 2014, yearTo: null }],
    },
    Piaggio: {
      Beverly: [
        { label: "300cc 22cv", yearFrom: 2010, yearTo: null },
        { label: "400cc 34cv", yearFrom: 2010, yearTo: null },
      ],
      MP3: [
        { label: "300cc 22cv", yearFrom: 2010, yearTo: null },
        { label: "500cc 44cv", yearFrom: 2010, yearTo: null },
      ],
      Liberty: [
        { label: "125cc 11cv", yearFrom: 2010, yearTo: null },
        { label: "150cc 13cv", yearFrom: 2010, yearTo: null },
      ],
    },
    "Royal Enfield": {
      "Classic 350": [{ label: "349cc 20cv", yearFrom: 2021, yearTo: null }],
      "Meteor 350": [{ label: "349cc 20cv", yearFrom: 2021, yearTo: null }],
      Himalayan: [{ label: "411cc 24cv", yearFrom: 2016, yearTo: null }],
      "Interceptor 650": [{ label: "648cc 47cv", yearFrom: 2018, yearTo: null }],
      "Continental GT 650": [{ label: "648cc 47cv", yearFrom: 2018, yearTo: null }],
    },
    Suzuki: {
      "GSX-R600": [{ label: "599cc 125cv", yearFrom: 2006, yearTo: null }],
      "GSX-R750": [{ label: "750cc 148cv", yearFrom: 2006, yearTo: null }],
      "GSX-R1000": [{ label: "999cc 202cv", yearFrom: 2017, yearTo: null }],
      SV650: [{ label: "645cc 75cv", yearFrom: 2016, yearTo: null }],
      "V-Strom 650": [{ label: "645cc 71cv", yearFrom: 2017, yearTo: null }],
      Hayabusa: [
        { label: "1340cc 190cv", yearFrom: 2021, yearTo: null },
        { label: "1299cc 197cv", yearFrom: 2008, yearTo: 2020 },
      ],
    },
    Triumph: {
      "Street Triple": [{ label: "765cc 128cv", yearFrom: 2017, yearTo: null }],
      "Speed Triple": [{ label: "1160cc 178cv", yearFrom: 2021, yearTo: null }],
      "Tiger 900": [{ label: "888cc 95cv", yearFrom: 2020, yearTo: null }],
      "Bonneville T120": [{ label: "1200cc 80cv", yearFrom: 2016, yearTo: null }],
      "Trident 660": [{ label: "660cc 81cv", yearFrom: 2021, yearTo: null }],
    },
    Vespa: {
      Primavera: [
        { label: "125cc 11cv", yearFrom: 2013, yearTo: null },
        { label: "150cc 13cv", yearFrom: 2013, yearTo: null },
      ],
      GTS: [{ label: "300cc 23cv", yearFrom: 2016, yearTo: null }],
      Sprint: [
        { label: "125cc 11cv", yearFrom: 2013, yearTo: null },
        { label: "150cc 13cv", yearFrom: 2013, yearTo: null },
      ],
      Elettrica: [{ label: "Elettrica 4cv", yearFrom: 2019, yearTo: null }],
    },
    Yamaha: {
      "MT-07": [{ label: "689cc 75cv", yearFrom: 2014, yearTo: null }],
      "MT-09": [
        { label: "890cc 119cv", yearFrom: 2021, yearTo: null },
        { label: "847cc 115cv", yearFrom: 2013, yearTo: 2020 },
      ],
      "MT-10": [{ label: "998cc 165cv", yearFrom: 2016, yearTo: null }],
      "YZF-R1": [{ label: "998cc 200cv", yearFrom: 2015, yearTo: null }],
      "YZF-R6": [{ label: "599cc 118cv", yearFrom: 2006, yearTo: 2020 }],
      "YZF-R125": [{ label: "125cc 15cv", yearFrom: 2019, yearTo: null }],
      "Tracer 9": [{ label: "890cc 119cv", yearFrom: 2021, yearTo: null }],
      "Tenere 700": [{ label: "689cc 73cv", yearFrom: 2019, yearTo: null }],
      NMAX: [
        { label: "125cc 12cv", yearFrom: 2015, yearTo: null },
        { label: "155cc 15cv", yearFrom: 2020, yearTo: null },
      ],
    },
  },
};

export function getEngineVariants(type: VehicleType, make: string, model: string): EngineVariant[] | null {
  return ENGINE_DATA[type]?.[make]?.[model] || null;
}
