import { CATALOGUE_SWEEP } from "./catalogueSweep";
import { ENGINE_EXTENSIONS } from "./engineExtensions";
import type { EngineVariant, VehicleType } from "./types";

/**
 * Dataset curato di marche/modelli per suggerire i valori nel form "Aggiungi veicolo".
 * Il form usa datalist, non select bloccanti: qualsiasi marca o modello assente dal dataset
 * puo' comunque essere digitato e salvato. Il catalogo migliora quindi la velocita' di inserimento
 * senza escludere veicoli storici, rari, d'importazione o appena lanciati.
 */
export const VEHICLE_DATA: Record<VehicleType, Record<string, string[]>> = {
  auto: {
    Abarth: ["500", "500C", "595", "595C", "695", "124 Spider", "Grande Punto", "Punto Evo"],
    AIXAM: ["City", "Coupé", "GTO", "Miniauto"],
    "Aston Martin": ["DBX", "DB11", "DBS Superleggera", "Rapide S", "V12", "V8 Vantage"],
    "Alfa Romeo": ["Giulia", "Giulietta", "Stelvio", "Tonale", "Junior", "MiTo", "159", "156", "166", "164", "155", "147", "146", "145", "75", "33", "4C", "Brera", "Spider", "GTV", "GT"],
    Alpine: ["A110"],
    Autobianchi: ["Y10", "A112"],
    Audi: ["80/90", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "Q8 e-tron", "e-tron GT", "R8", "TT", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8", "TT RS"],
    Bentley: ["Bentayga", "Continental", "Flying Spur", "Mulsanne"],
    BMW: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "M2", "M3", "M4", "M5", "M8", "X1", "X2", "X3", "X3 M", "X4", "X4 M", "X5", "X5 M", "X6", "X6 M", "X7", "Z1", "Z3", "Z4", "Z4 M", "i3", "i4", "i8", "iX", "iX1", "iX3"],
    BYD: ["Atto 3", "Seal", "Dolphin", "Seal U"],
    Cadillac: ["Escalade"],
    Casalini: ["M20"],
    Chatenet: ["CH26", "CH46"],
    Chevrolet: ["Aveo", "Spark", "Captiva", "Camaro", "Corvette", "Cruze", "Kalos", "Matiz", "Orlando", "Tahoe", "Trax"],
    Chrysler: ["300 C", "Crossfire", "PT Cruiser", "Sebring"],
    Citroën: ["2CV", "Ami", "C1", "C2", "Saxo", "C3", "C3 Aircross", "C3 Picasso", "C4", "C4 Aircross", "C4 Cactus", "C4 Picasso", "C5", "C5 Aircross", "C5 X", "C6", "C8", "Xsara", "Xantia", "XM", "Berlingo", "Jumpy", "Jumper", "Nemo", "Mehari", "DS3", "DS4"],
    Cupra: ["Formentor", "Leon", "Born", "Ateca"],
    Dacia: ["Sandero", "Duster", "Jogger", "Spring", "Dokker", "Lodgy", "Logan"],
    Daewoo: ["Matiz"],
    Daihatsu: ["Cuore", "Feroza", "Materia", "Sirion", "Terios"],
    Dodge: ["Caliber", "Journey", "Nitro"],
    DR: ["DR1", "DR3", "DR4", "DR4.0", "DR5", "DR5.0", "DR6", "DR6.0", "DR Evo5", "DR F35", "DR Zero"],
    "DS Automobiles": ["DS 3", "DS 4", "DS 7", "DS 9"],
    Ferrari: ["California", "458", "488", "F8", "Portofino", "Roma", "F430", "360", "SF90", "F12 Berlinetta", "GTC4Lusso"],
    Fiat: ["Panda", "Grande Panda", "Topolino", "Grizzly", "Grizzly Fastback", "500", "600", "500X", "500L", "Tipo", "Punto", "Uno", "Ritmo", "126", "127", "131", "Cinquecento", "Seicento", "Idea", "Bravo", "Stilo", "Marea", "Coupé", "Barchetta", "Croma", "Multipla", "Ducato", "Doblo", "Fiorino", "Qubo", "Ulysse", "Sedici"],
    Ford: ["Fiesta", "Focus", "Puma", "Kuga", "EcoSport", "Explorer", "Mondeo", "Sierra", "Scorpio", "Cougar", "Escort", "Mustang", "C-Max", "S-Max", "Ka", "Ranger", "Galaxy", "Transit"],
    Genesis: ["G70", "GV70"],
    GWM: ["Ora Funky Cat", "Hover", "Hover 5", "Steed"],
    Honda: ["Civic", "Jazz", "CR-V", "HR-V", "ZR-V", "Accord", "Prelude", "Integra", "S2000", "FR-V", "Insight", "e"],
    Hummer: ["H2", "H3"],
    Hyundai: ["i10", "i20", "i30", "i40", "Atos", "Bayon", "Coupe", "Galloper", "Getz", "H-1", "Kona", "ix20", "ix35", "Matrix", "Santa Fe", "Staria", "Terracan", "Veloster", "Ioniq", "Ioniq 5", "Ioniq 6"],
    Infiniti: ["Q30", "QX30", "FX", "QX70"],
    Innocenti: ["Mini"],
    Isuzu: ["D-Max"],
    Iveco: ["Daily"],
    Jaecoo: ["Jaecoo 7"],
    Lada: ["Niva"],
    Jaguar: ["XE", "XF", "F-Pace", "E-Pace", "I-Pace", "F-Type", "S-Type", "X-Type", "XJ", "XK"],
    Jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Avenger", "Wrangler", "Gladiator", "Commander", "Patriot"],
    Kia: ["Picanto", "Rio", "Ceed", "ProCeed", "Xceed", "Sportage", "Niro", "e-Niro", "Stonic", "Sorento", "Soul", "Stinger", "Carens", "Carnival", "Optima", "Venga", "EV6", "EV9"],
    Lamborghini: ["Huracán", "Aventador", "Urus", "Diablo", "Gallardo", "Murciélago"],
    Lancia: ["Ypsilon", "Delta", "Musa", "Thesis", "Kappa", "Thema", "Dedra", "Beta", "Fulvia", "Flavia", "Gamma", "Lybra", "Y"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
    Ligier: ["JS50", "JS60"],
    Lotus: ["Elan", "Elise", "Esprit"],
    Mahindra: ["Goa", "KUV100", "XUV500"],
    McLaren: ["720S"],
    Microcar: ["Dué", "M.GO"],
    Lexus: ["UX", "NX", "RX", "IS", "LC", "LS"],
    Maserati: ["Ghibli", "Quattroporte", "Levante", "Grecale", "GranTurismo", "MC20"],
    Maxus: ["T90", "eDeliver 9", "eDeliver 3"],
    Mazda: ["Mazda2", "Mazda3", "Mazda6", "626", "RX-8", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30"],
    "Mercedes-Benz": ["190", "Classe A", "Classe B", "Classe C", "Classe E", "Classe G", "Classe S", "Classe V", "CLA", "CLK", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV", "Sprinter", "Vito"],
    MG: ["ZS", "HS", "MG4", "MG3"],
    Mini: ["Cooper", "Countryman", "Clubman", "Paceman", "Cabrio"],
    Mitsubishi: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200", "Colt", "Lancer", "Pajero", "Pajero Pinin", "Pajero Sport"],
    Nissan: ["Micra", "Note", "Primera", "Pulsar", "Juke", "Qashqai", "X-Trail", "350Z", "370Z", "GT-R", "Ariya", "Navara", "Leaf", "e-NV200", "Murano", "Pathfinder", "Patrol", "Terrano II"],
    Omoda: ["Omoda 5"],
    Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Zafira", "Combo", "Vectra", "Meriva", "Calibra", "Tigra", "Antara", "Agila", "Adam", "Frontera", "Karl"],
    Peugeot: ["106", "107", "108", "205", "206", "207", "208", "306", "307", "308", "406", "407", "408", "508", "807", "1007", "RCZ", "2008", "3008", "5008", "Partner", "Bipper", "Traveller"],
    Polestar: ["Polestar 2"],
    RAM: ["1500"],
    Pontiac: ["Firebird"],
    Porsche: ["911", "718 Cayman", "718 Boxster", "Panamera", "Macan", "Cayenne", "Taycan", "924", "928", "944"],
    Renault: ["Clio", "Captur", "Megane", "Kadjar", "Scenic", "Espace", "Laguna", "Trafic", "Twingo", "Twizy", "Zoe", "Austral", "Arkana", "Koleos", "Talisman", "Kangoo", "Modus", "R4", "R5", "R19"],
    "Rolls Royce": ["Corniche", "Phantom", "Silver Shadow", "Wraith"],
    Rover: ["75"],
    Saab: ["9-3", "9-5"],
    Seat: ["Mii", "Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra", "Altea"],
    Škoda: ["Fabia", "Scala", "Octavia", "Kamiq", "Karoq", "Kodiaq", "Enyaq", "Superb", "Yeti", "Roomster", "Rapid", "Citigo"],
    Smart: ["Fortwo", "Forfour"],
    SsangYong: ["Tivoli", "Korando", "Rexton", "XLV"],
    Subaru: ["Impreza", "Forester", "XV", "Outback", "BRZ", "Legacy", "Levorg", "WRX"],
    Suzuki: ["Swift", "Vitara", "Grand Vitara", "S-Cross", "SX4", "Baleno", "Ignis", "Jimny"],
    Tata: ["Safari", "Xenon"],
    Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    Toyota: ["Aygo", "iQ", "Yaris", "Yaris Cross", "Corolla", "Corolla Cross", "Celica", "Supra", "GT86", "GR86", "MR2", "C-HR", "RAV4", "Avensis", "Verso", "Highlander", "Camry", "Auris", "Prius", "Hilux", "Land Cruiser"],
    Volkswagen: ["Polo", "Golf", "Scirocco", "Corrado", "Beetle", "Lupo", "Fox", "Jetta", "Passat", "Phaeton", "Arteon", "Sharan", "Touran", "Eos", "Tiguan", "T-Roc", "T-Cross", "Taigo", "Touareg", "Amarok", "Caddy", "Multivan", "Up!", "ID.3", "ID.4"],
    Volvo: ["240", "S40", "S60", "S80", "S90", "C30", "C70", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90", "EX30", "EC40"],
    XEV: ["Yoyo"],
  },
  moto: {
    Aprilia: ["RS 660", "Tuono 660", "RSV4", "Tuareg 660", "SR GT", "Scarabeo", "Shiver 900"],
    Benelli: ["TRK 502", "Leoncino 500", "752 S", "TNT 125"],
    Beta: ["RR 350", "Xtrainer"],
    BMW: ["S 1000 RR", "R 1250 GS", "F 850 GS", "R nineT", "G 310 R", "F 900 R"],
    CFMoto: ["300NK", "450MT", "700CL-X"],
    Bimota: ["Tesi H2", "KB4"],
    Ducati: ["Panigale V4", "Panigale V2", "Monster", "Multistrada", "Scrambler", "Diavel", "Streetfighter V4", "Hypermotard"],
    Fantic: ["Caballero"],
    Generic: ["Trigger", "XOR"],
    Gilera: ["Runner", "Nexus", "Fuoco"],
    Italjet: ["Dragster"],
    Keeway: ["RKS", "K300"],
    "Harley-Davidson": ["Sportster", "Fat Boy", "Street Bob", "Road King", "Pan America"],
    Honda: ["CBR600RR", "CBR1000RR-R", "CB650R", "Africa Twin", "CB500F", "Hornet", "SH 125/150", "Forza", "Vision"],
    Husqvarna: ["Svartpilen 401", "Vitpilen 401", "Norden 901"],
    Kawasaki: ["Ninja 400", "Ninja 650", "Ninja ZX-10R", "Z650", "Z900", "Versys 650", "Versys 1000", "Vulcan S"],
    KTM: ["Duke 125", "Duke 390", "Duke 790", "Duke 890", "1290 Super Duke", "Adventure 390", "Adventure 1290"],
    Kymco: ["People", "Agility"],
    Malaguti: ["Centro", "Madison"],
    "Moto Guzzi": ["V7", "V9", "V85 TT", "California"],
    "MV Agusta": ["Brutale", "F3", "Turismo Veloce", "Dragster"],
    "Peugeot Motocycles": ["Django", "Speedfight"],
    Piaggio: ["Beverly", "MP3", "Liberty", "Zip", "Medley", "X10"],
    Rieju: ["MRT"],
    "Royal Enfield": ["Classic 350", "Meteor 350", "Himalayan", "Interceptor 650", "Continental GT 650"],
    Sym: ["Joymax", "Fiddle"],
    Suzuki: ["GSX-R600", "GSX-R750", "GSX-R1000", "GSX-S750", "GSX-S1000", "SV650", "V-Strom 650", "Burgman", "Hayabusa"],
    SWM: ["Superdual", "Silver Vase"],
    Triumph: ["Street Triple", "Speed Triple", "Tiger 900", "Bonneville T120", "Trident 660"],
    Vespa: ["Primavera", "GTS", "Sprint", "50 Special", "Elettrica"],
    Yamaha: ["MT-07", "MT-09", "MT-10", "YZF-R1", "YZF-R6", "YZF-R7", "YZF-R125", "Tracer 9", "Tenere 700", "NMAX", "XMAX", "Tricity", "Aerox", "XSR900"],
    "Zero Motorcycles": ["SR/F", "DSR"],
  },
};

/**
 * Estensioni del catalogo: modelli di grande diffusione, recenti e storici che non
 * comparivano nel dataset iniziale. Restano separate dai dati delle motorizzazioni:
 * se non e' presente una variante verificata, il form propone correttamente il campo libero.
 */
const CATALOGUE_EXTENSIONS: Partial<Record<VehicleType, Record<string, string[]>>> = {
  auto: {
    Abarth: ["124 Rally", "500e", "A112 Abarth", "Grande Punto Abarth", "Punto Abarth"],
    Alpine: ["A106", "A108", "A310", "A610", "GTA"],
    "Alfa Romeo": ["6", "8C Competizione", "33 Stradale", "90", "1900", "2600", "Alfasud", "Alfetta", "Arna", "Montreal", "RZ", "Sprint", "SZ"],
    "Aston Martin": ["DB4", "DB5", "DB6", "DB7", "DB9", "DB12", "DBR1", "Lagonda", "One-77", "Valhalla", "Valkyrie", "Vantage", "Virage"],
    Audi: ["50", "100", "200", "A4 allroad", "A6 allroad", "A6 e-tron", "Coupé", "Q6 e-tron", "Quattro", "RS e-tron GT", "S1", "S3", "S4", "S5", "S6", "S7", "S8", "SQ2", "SQ5", "SQ6 e-tron", "SQ7", "SQ8", "TT Roadster", "V8"],
    BAIC: ["Beijing X35", "Beijing X55", "BJ40", "BJ60"],
    Bentley: ["Arnage", "Azure", "Blower", "Brooklands", "Eight", "R-Type", "Turbo R"],
    BMW: ["1500", "2002", "3.0 CSL", "507", "Isetta", "Serie 2 Active Tourer", "Serie 2 Gran Coupé", "Serie 4 Gran Coupé", "Serie 5 Touring", "Serie 6 Gran Turismo", "Serie 8 Gran Coupé", "i5", "i7", "iX2", "M1", "X7", "XM", "Z8"],
    BYD: ["Atto 2", "Dolphin Surf", "Han", "Sealion 7", "Tang"],
    Cadillac: ["ATS", "CT4", "CT5", "CTS", "DeVille", "Eldorado", "ELR", "Lyriq", "Seville", "SRX", "XT4", "XT5", "XT6"],
    Chevrolet: ["Blazer", "Bolt", "Chevelle", "Epica", "Impala", "Malibu", "Nova", "Tacuma", "Trailblazer", "Volt"],
    Autobianchi: ["Bianchina", "Primula", "Stellina"],
    Chrysler: ["300M", "Concorde", "Delta", "Grand Voyager", "LHS", "Neon", "Stratus", "Town & Country", "Voyager"],
    Citroën: ["AX", "BX", "C15", "C3 Pluriel", "C4 X", "C-Crosser", "C-Elysée", "C-Zero", "DS", "DS5", "Dyane", "Evasion", "GS", "SM", "Traction Avant", "Visa", "Xsara Picasso", "ZX"],
    Cupra: ["Raval", "Tavascan", "Terramar"],
    Dacia: ["Bigster", "Duster III", "Sandero Stepway"],
    Daihatsu: ["Charade", "Rocky", "Taft", "Wildcat"],
    DeLorean: ["DMC-12"],
    DFSK: ["E5", "Glory 500", "Glory 580", "Seres 3"],
    Dodge: ["Challenger", "Charger", "Dakota", "Durango", "Ram", "Viper"],
    Dongfeng: ["Box", "Fengon 500", "Shine", "Voyah Free"],
    "DS Automobiles": ["DS 3 Crossback", "DS 4 Crossback", "DS 7 Crossback", "DS N°8"],
    EBRO: ["S400", "S700", "S800"],
    EVO: ["3", "4", "5", "6", "7", "Cross 4", "Spazio"],
    Ferrari: ["12Cilindri", "250 GTO", "288 GTO", "296 GTB", "296 GTS", "308", "328", "348", "400", "412", "550 Maranello", "575M Maranello", "599 GTB", "612 Scaglietti", "812 Superfast", "Daytona SP3", "Dino", "Enzo", "F40", "F50", "LaFerrari", "Mondial", "Purosangue", "Testarossa"],
    Fiat: ["124", "130", "132", "500e", "600e", "850", "850 Spider", "Argenta", "Campagnola", "Dino", "Duna", "Freemont", "Fullback", "Grande Punto", "Mobi", "Palio", "Regata", "Scudo", "Talento", "Tempra", "Toro", "Viaggio", "X1/9"],
    Ford: ["Anglia", "Bronco", "Capri", "Edge", "F-150", "GT", "Granada", "Maverick", "Mustang Mach-E", "Probe", "Puma Gen-E", "RS200", "Taunus", "Tourneo Connect", "Tourneo Courier", "Tourneo Custom", "Transit Connect", "Transit Courier", "Transit Custom"],
    Genesis: ["G80", "G90", "GV60", "GV80"],
    GMC: ["Acadia", "Canyon", "Sierra", "Yukon"],
    Hummer: ["EV", "H1"],
    Innocenti: ["Elba", "Mille"],
    Honda: ["Beat", "City", "CR-Z", "e:Ny1", "Element", "Legend", "NSX", "Odyssey", "Passport", "Pilot", "S660", "Stream"],
    Hyundai: ["Accent", "Elantra", "Excel", "i20 N", "i30 N", "Inster", "Ioniq 9", "Nexo", "Palisade", "Pony", "Sonata", "Stellar", "Tucson"],
    Infiniti: ["G35", "G37", "M35", "FX35", "FX50", "Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
    Ineos: ["Grenadier", "Quartermaster"],
    Daewoo: ["Espero", "Lanos", "Leganza", "Nubira", "Tico"],
    Isuzu: ["Trooper", "VehiCROSS"],
    Iveco: ["Eurocargo", "Massif", "Stralis"],
    Jaguar: ["C-Type", "D-Type", "E-Type", "I-Type", "Mark 2", "XJ220", "XJS"],
    Jeep: ["CJ", "Grand Wagoneer", "Liberty", "Wagoneer", "Willys"],
    Kia: ["Cerato", "EV3", "EV4", "EV5", "Joice", "K4", "Magentis", "Mohave", "Pride", "PV5", "Pregio", "Sedona", "Shuma"],
    Lamborghini: ["350 GT", "400 GT", "Countach", "Espada", "Islero", "Jalpa", "LM002", "Miura", "Revuelto", "Silhouette", "Temerario", "Urraco"],
    Lancia: ["037", "Appia", "Ardea", "Augusta", "Aurelia", "Delta Integrale", "Flaminia", "Montecarlo", "Phedra", "Prisma", "Stratos", "Trevi", "Voyager", "Y10"],
    Lada: ["1200", "1500", "Granta", "Kalina", "Priora", "Riva", "Samara", "Vesta"],
    "Land Rover": ["Range Rover Classic", "Range Rover Electric", "Series I", "Series II", "Series III"],
    Leapmotor: ["C10", "T03"],
    Lexus: ["CT", "ES", "GS", "GX", "HS", "LBX", "LFA", "LX", "RZ", "SC"],
    Lotus: ["Eletre", "Emeya", "Emira", "Evora", "Exige"],
    "Lynk & Co": ["01", "02", "03", "06", "08"],
    Maserati: ["222", "3200 GT", "Biturbo", "Bora", "GranCabrio", "Indy", "Karif", "Khamsin", "MC12", "Merak", "Shamal", "Spyder"],
    Mazda: ["121", "323", "CX-80", "MPV", "MX-3", "MX-6", "RX-3", "RX-7", "Tribute", "Xedos 6", "Xedos 9"],
    McLaren: ["12C", "540C", "570GT", "570S", "600LT", "650S", "675LT", "765LT", "Artura", "Elva", "F1", "GT", "P1", "Senna", "Speedtail"],
    "Mercedes-Benz": ["190 SL", "300 SL", "Citan", "Classe T", "CLE", "EQT", "G 63", "GLK", "ML", "R", "SL", "SLC", "SLK", "Unimog", "Vaneo", "X-Class"],
    Mahindra: ["Scorpio", "Thar"],
    MG: ["Cyberster", "Marvel R", "MG5", "MGS5 EV", "TF", "ZR", "ZS EV", "ZT"],
    Mini: ["Aceman", "Coupe", "Electric", "Moke", "Roadster"],
    Mitsubishi: ["3000 GT", "Carisma", "Eclipse", "FTO", "Grandis", "i-MiEV", "L300", "L400", "Lancer Evolution", "Mirage", "Sigma", "Starion"],
    Nissan: ["180SX", "200SX", "Almera", "Cube", "Figaro", "GT-R Nismo", "Interstar", "Laurel", "Maxima", "Silvia", "Skyline", "Sunny", "Townstar", "Vanette"],
    NIO: ["EL6", "EL7", "ET5", "ET7"],
    Opel: ["Ascona", "Campo", "Commodore", "GT", "Kadett", "Monterey", "Movano", "Omega", "Rocks-e", "Senator", "Signum", "Sintra", "Vivaro"],
    Peugeot: ["104", "301", "309", "404", "4007", "4008", "504", "505", "605", "607", "806", "e-3008", "e-5008", "Expert", "Rifter", "Tepee"],
    Polestar: ["Polestar 1", "Polestar 3", "Polestar 4"],
    Pontiac: ["Fiero", "Grand Am", "GTO", "Sunfire"],
    Porsche: ["356", "550 Spyder", "718 Spyder", "912", "914", "918 Spyder", "959", "968", "Boxster", "Carrera GT", "Cayman", "Mission R", "Taycan Cross Turismo"],
    RAM: ["2500", "3500", "ProMaster"],
    Renault: ["11", "14", "18", "20", "21", "25", "30", "Alaskan", "Avantime", "Estafette", "Fuego", "Master", "Rafale", "R5 E-Tech", "Safrane", "Sport Spider", "Symbioz", "Vel Satis", "Wind"],
    "Rolls Royce": ["Camargue", "Cullinan", "Dawn", "Ghost", "Park Ward", "Silver Cloud", "Silver Spirit", "Spectre"],
    Rover: ["25", "45", "200", "400", "600", "800", "Metro", "Mini", "P6", "SD1"],
    Saab: ["900", "9000", "9-2X", "9-4X", "9-7X"],
    Seat: ["127", "131", "600", "850", "Cordoba", "Exeo", "Inca", "Malaga", "Marbella", "Panda", "Ronda", "Toledo"],
    SsangYong: ["Actyon", "Musso", "Rodius", "Torres"],
    Seres: ["3", "5"],
    Škoda: ["105", "120", "1000 MB", "Elroq", "Favorit", "Felicia", "Forman", "Kushaq", "Slavia"],
    Smart: ["#1", "#3", "Crossblade", "Roadster"],
    Subaru: ["360", "Alcyone", "Ascent", "Baja", "Justy", "Solterra", "SVX", "Tribeca", "Vivio"],
    Suzuki: ["Across", "Alto", "Cappuccino", "Celerio", "Kizashi", "Liana", "S-Presso", "Samurai", "Swace", "Wagon R+", "X-90", "e Vitara"],
    Tata: ["Indica", "Nano"],
    Tesla: ["Cybertruck", "Roadster", "Semi"],
    Toyota: ["bZ4X", "Carina", "Century", "Cressida", "Crown", "GR Corolla", "GR Yaris", "Land Cruiser Prado", "Paseo", "Previa", "Proace", "Proace City", "Sera", "Starlet", "Tercel", "Urban Cruiser", "bZ3"],
    Volkswagen: ["Atlas", "Atlas Cross Sport", "Derby", "ID.2all", "ID. Buzz", "ID.5", "ID.7", "ID.7 Tourer", "Iltis", "LT", "Santana", "T-Cross", "T5", "T6", "T7", "Tayron", "Vento", "Virtus"],
    Volvo: ["140", "460", "480", "740", "760", "850", "940", "960", "1800", "Amazon", "C40", "EX40", "EX90", "ES90", "V40 Cross Country"],
    XPeng: ["G6", "G9", "P7"],
    Zeekr: ["001", "7X", "X"],
  },
  moto: {
    Aprilia: ["Dorsoduro", "Falco", "Pegaso", "RS 457", "RS125", "RSV Mille", "Tuono V4"],
    Benelli: ["180S", "302R", "502 C", "Imperiale 400", "TRK 702"],
    Beta: ["Alp 200", "RR 300", "Urban"],
    BMW: ["C 400 X", "CE 04", "F 750 GS", "F 800 GS", "K 100", "K 1600 GT", "R 18", "R 80 G/S", "R 90 S", "R 1300 GS", "S 1000 R", "S 1000 XR"],
    Ducati: ["748", "851", "916", "996", "999", "DesertX", "Desmosedici RR", "Monster SP", "Multistrada V4", "SuperSport", "XDiavel"],
    "Harley-Davidson": [
      "Breakout",
      "Electra Glide",
      "Iron 883",
      "Knucklehead",
      "Low Rider S",
      "Nightster",
      "Road Glide",
      "Shovelhead",
      "Softail Standard",
      "V-Rod",
    ],
    Honda: [
      "CB1000R",
      "CB500X",
      "CBR650R",
      "CBX1000",
      "Gold Wing",
      "Monkey",
      "NC750X",
      "RC30",
      "RC45",
      "Rebel 500",
      "Rebel 1100",
      "Transalp",
      "VFR800",
      "X-ADV",
    ],
    Husqvarna: ["701 Enduro", "Svartpilen 250", "Vitpilen 250"],
    "Indian Motorcycle": ["Chief", "Chieftain", "FTR", "Scout", "Springfield"],
    Kawasaki: ["Eliminator", "GPZ900R", "H2", "KLR650", "KLX", "Ninja 250", "Versys-X 300", "W800", "Z400", "ZX-14R", "ZX-25R", "ZX-6R"],
    KTM: [
      "125 Duke",
      "250 Duke",
      "350 Duke",
      "450 Rally",
      "500 EXC-F",
      "690 Duke",
      "690 Enduro",
      "890 Adventure",
      "990 Duke",
      "1290 Super Adventure",
      "RC 390",
    ],
    Gilera: ["DNA", "GP800", "Saturno"],
    "Moto Guzzi": ["Falcone", "Griso", "Le Mans", "Norge", "Stelvio", "V100 Mandello", "V7 Stone", "V9 Roamer"],
    "MV Agusta": ["750 Sport", "F4", "Rush", "Superveloce", "Turismo Veloce Lusso"],
    Norton: ["Commando", "Dominator", "V4 SS"],
    Piaggio: ["1", "Ape", "Vespa 946"],
    "Royal Enfield": ["Bullet 350", "Electra", "Hunter 350", "Scram 411", "Shotgun 650", "Super Meteor 650"],
    Suzuki: ["Address 125", "Bandit", "DR-Z400", "GSX-8R", "GSX-8S", "Katana", "RG500", "TL1000R", "V-Strom 1050"],
    Triumph: ["Daytona 675", "Rocket 3", "Scrambler 900", "Scrambler 1200", "Speed Twin", "Thruxton", "Tiger 800", "Tiger 1200", "Trophy"],
    Vespa: ["946", "ET3", "GTV", "PX"],
    Yamaha: ["FZR1000", "MT-03", "MT-125", "Niken", "RD350", "TMAX", "V-Max", "WR250F", "XT600", "YZF-R3"],
  },
};

export function getMakes(type: VehicleType): string[] {
  const extensions = CATALOGUE_EXTENSIONS[type] || {};
  return Array.from(
    new Set([...Object.keys(VEHICLE_DATA[type]), ...Object.keys(extensions), ...Object.keys(CATALOGUE_SWEEP[type])])
  ).sort((a, b) => a.localeCompare(b));
}

export function getModels(type: VehicleType, make: string): string[] {
  const base = VEHICLE_DATA[type][make] || [];
  const extensions = CATALOGUE_EXTENSIONS[type]?.[make] || [];
  const sweep = CATALOGUE_SWEEP[type][make] || [];
  return Array.from(new Set([...base, ...extensions, ...sweep])).sort((a, b) => a.localeCompare(b));
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
    AIXAM: {
      City: [{ label: "Diesel 400cc 6cv", yearFrom: 2010, yearTo: null }],
      "Coupé": [{ label: "Diesel 400cc 6cv", yearFrom: 2010, yearTo: null }],
      GTO: [{ label: "Diesel 400cc 6cv", yearFrom: 2010, yearTo: null }],
      Miniauto: [{ label: "Diesel 400cc 6cv", yearFrom: 2010, yearTo: null }],
    },
    "Aston Martin": {
      DBX: [{ label: "4.0 V8 Turbo 550cv", yearFrom: 2020, yearTo: null }],
      V12: [{ label: "5.2 V12 Turbo 700cv", yearFrom: 2018, yearTo: null }],
      "V8 Vantage": [{ label: "4.0 V8 Turbo 510cv", yearFrom: 2018, yearTo: null }],
      DB11: [{ label: "5.2 V12 Turbo 610cv", yearFrom: 2016, yearTo: null }],
      "DBS Superleggera": [{ label: "5.2 V12 Turbo 725cv", yearFrom: 2018, yearTo: null }],
      "Rapide S": [{ label: "6.0 V12 560cv", yearFrom: 2013, yearTo: 2019 }],
    },
    Bentley: {
      Bentayga: [{ label: "4.0 V8 550cv", yearFrom: 2015, yearTo: null }],
      Continental: [{ label: "6.0 W12 635cv", yearFrom: 2018, yearTo: null }],
      "Flying Spur": [{ label: "6.0 W12 635cv", yearFrom: 2019, yearTo: null }],
      Mulsanne: [{ label: "6.75 V8 Turbo 512cv", yearFrom: 2010, yearTo: 2020 }],
    },
    Cadillac: {
      Escalade: [{ label: "6.2 V8 426cv", yearFrom: 2015, yearTo: null }],
    },
    Casalini: {
      M20: [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
    },
    Chatenet: {
      CH26: [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
      CH46: [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
    },
    Chrysler: {
      "300 C": [
        { label: "3.0 V6 CRD 218cv", yearFrom: 2005, yearTo: 2010 },
        { label: "5.7 V8 HEMI 340cv", yearFrom: 2005, yearTo: 2010 },
      ],
      Crossfire: [{ label: "3.2 V6 218cv", yearFrom: 2003, yearTo: 2008 }],
      "PT Cruiser": [{ label: "2.2 CRD 150cv", yearFrom: 2000, yearTo: 2010 }],
      Sebring: [{ label: "2.0 CRD 140cv", yearFrom: 2007, yearTo: 2010 }],
    },
    Daewoo: {
      Matiz: [{ label: "0.8 51cv", yearFrom: 1998, yearTo: 2005 }],
    },
    Daihatsu: {
      Cuore: [{ label: "1.0 58cv", yearFrom: 1998, yearTo: 2013 }],
      Feroza: [{ label: "1.6 16v 97cv", yearFrom: 1988, yearTo: 1998 }],
      Materia: [{ label: "1.5 105cv", yearFrom: 2006, yearTo: 2011 }],
      Sirion: [{ label: "1.0 69cv", yearFrom: 1998, yearTo: 2013 }],
      Terios: [{ label: "1.5 105cv", yearFrom: 1997, yearTo: 2017 }],
    },
    Dodge: {
      Caliber: [{ label: "2.0 CRD 156cv", yearFrom: 2006, yearTo: 2012 }],
      Journey: [{ label: "2.0 CRD 150cv", yearFrom: 2008, yearTo: 2011 }],
      Nitro: [{ label: "2.8 CRD 177cv", yearFrom: 2007, yearTo: 2011 }],
    },
    DR: {
      DR1: [{ label: "1.5 105cv", yearFrom: 2010, yearTo: null }],
      DR3: [{ label: "1.5 Turbo 156cv", yearFrom: 2019, yearTo: null }],
      DR4: [{ label: "1.5 Turbo 156cv", yearFrom: 2018, yearTo: null }],
      "DR4.0": [{ label: "1.5 Turbo 156cv", yearFrom: 2021, yearTo: null }],
      DR5: [{ label: "1.5 Turbo 156cv", yearFrom: 2019, yearTo: null }],
      "DR5.0": [{ label: "1.5 Turbo 156cv", yearFrom: 2021, yearTo: null }],
      DR6: [{ label: "1.5 Turbo 156cv", yearFrom: 2020, yearTo: null }],
      "DR6.0": [{ label: "1.5 Turbo 156cv", yearFrom: 2022, yearTo: null }],
      "DR Evo5": [{ label: "1.6 116cv", yearFrom: 2016, yearTo: null }],
      "DR F35": [{ label: "1.6 116cv", yearFrom: 2015, yearTo: null }],
      "DR Zero": [{ label: "Elettrica 95cv", yearFrom: 2022, yearTo: null }],
    },
    Hummer: {
      H2: [{ label: "6.2 V8 393cv", yearFrom: 2007, yearTo: 2009 }],
      H3: [{ label: "3.7 242cv", yearFrom: 2005, yearTo: 2010 }],
    },
    Innocenti: {
      Mini: [{ label: "1.0 45cv", yearFrom: 1974, yearTo: 1993 }],
    },
    Ligier: {
      JS50: [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
      JS60: [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
    },
    Lotus: {
      Elan: [{ label: "1.6 16v 130cv", yearFrom: 1989, yearTo: 1995 }],
      Elise: [{ label: "1.8 16v 136cv", yearFrom: 1996, yearTo: 2021 }],
      Esprit: [{ label: "2.2 Turbo 240cv", yearFrom: 1987, yearTo: 2004 }],
    },
    Mahindra: {
      Goa: [{ label: "2.5 TD 100cv", yearFrom: 2000, yearTo: 2010 }],
      KUV100: [{ label: "1.2 82cv", yearFrom: 2016, yearTo: null }],
      XUV500: [{ label: "2.2 CRDe 155cv", yearFrom: 2012, yearTo: null }],
    },
    McLaren: {
      "720S": [{ label: "4.0 V8 Turbo 720cv", yearFrom: 2017, yearTo: null }],
    },
    Microcar: {
      "Dué": [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
      "M.GO": [{ label: "Diesel 500cc 5cv", yearFrom: 2010, yearTo: null }],
    },
    Pontiac: {
      Firebird: [{ label: "5.7 V8 Trans Am 305cv", yearFrom: 1993, yearTo: 2002 }],
    },
    "Rolls Royce": {
      Corniche: [{ label: "6.75 V8 296cv", yearFrom: 1971, yearTo: 2002 }],
      Phantom: [{ label: "6.75 V12 460cv", yearFrom: 2003, yearTo: null }],
      "Silver Shadow": [{ label: "6.75 V8 200cv", yearFrom: 1965, yearTo: 1980 }],
      Wraith: [{ label: "6.6 V12 632cv", yearFrom: 2013, yearTo: 2023 }],
    },
    Tata: {
      Safari: [{ label: "2.2 DICOR 140cv", yearFrom: 2008, yearTo: null }],
      Xenon: [{ label: "2.2 DICOR 140cv", yearFrom: 2010, yearTo: null }],
    },
    XEV: {
      Yoyo: [{ label: "Elettrica 6cv", yearFrom: 2020, yearTo: null }],
    },
    Jaecoo: {
      "Jaecoo 7": [
        { label: "1.6 Turbo 145cv", yearFrom: 2024, yearTo: null },
        { label: "Plug-in Hybrid halcyon 306cv", yearFrom: 2024, yearTo: null },
      ],
    },
    Maxus: {
      T90: [{ label: "2.0 Diesel 163cv", yearFrom: 2021, yearTo: null }],
      "eDeliver 9": [{ label: "Elettrica 177cv", yearFrom: 2021, yearTo: null }],
      "eDeliver 3": [{ label: "Elettrica 122cv", yearFrom: 2021, yearTo: null }],
    },
    Omoda: {
      "Omoda 5": [
        { label: "1.6 Turbo 145cv", yearFrom: 2023, yearTo: null },
        { label: "Elettrica 204cv", yearFrom: 2023, yearTo: null },
      ],
    },
    RAM: {
      "1500": [{ label: "5.7 V8 HEMI 395cv", yearFrom: 2019, yearTo: null }],
    },
    Ferrari: {
      California: [{ label: "4.3 V8 460cv", yearFrom: 2008, yearTo: 2017 }],
      "458": [{ label: "4.5 V8 570cv", yearFrom: 2009, yearTo: 2015 }],
      "488": [{ label: "3.9 V8 Turbo 670cv", yearFrom: 2015, yearTo: 2019 }],
      F8: [{ label: "3.9 V8 Turbo 720cv", yearFrom: 2019, yearTo: 2023 }],
      Portofino: [{ label: "3.9 V8 Turbo 600cv", yearFrom: 2017, yearTo: null }],
      Roma: [{ label: "3.9 V8 Turbo 620cv", yearFrom: 2020, yearTo: null }],
      F430: [{ label: "4.3 V8 490cv", yearFrom: 2004, yearTo: 2009 }],
      "360": [{ label: "3.6 V8 400cv", yearFrom: 1999, yearTo: 2005 }],
      SF90: [{ label: "4.0 V8 Turbo Ibrida 1000cv", yearFrom: 2019, yearTo: null }],
      "F12 Berlinetta": [{ label: "6.3 V12 740cv", yearFrom: 2012, yearTo: 2017 }],
      GTC4Lusso: [{ label: "6.3 V12 690cv", yearFrom: 2016, yearTo: 2020 }],
    },
    Lada: {
      Niva: [{ label: "1.7 80cv", yearFrom: 1977, yearTo: null }],
    },
    Polestar: {
      "Polestar 2": [
        { label: "Elettrica Single Motor 231cv", yearFrom: 2020, yearTo: null },
        { label: "Elettrica Dual Motor 421cv", yearFrom: 2020, yearTo: null },
      ],
    },
    Rover: {
      "75": [
        { label: "1.8 Turbo 150cv", yearFrom: 1999, yearTo: 2005 },
        { label: "2.0 CDTi 131cv", yearFrom: 1999, yearTo: 2005 },
      ],
    },
    Saab: {
      "9-3": [
        { label: "1.8t 150cv", yearFrom: 2002, yearTo: 2012 },
        { label: "1.9 TiD 150cv", yearFrom: 2002, yearTo: 2012 },
      ],
      "9-5": [
        { label: "2.0t 150cv", yearFrom: 1997, yearTo: 2010 },
        { label: "1.9 TiD 150cv", yearFrom: 2008, yearTo: 2010 },
      ],
    },
    Autobianchi: {
      Y10: [
        { label: "1.0 45cv", yearFrom: 1985, yearTo: 1995 },
        { label: "1.1 Turbo 85cv", yearFrom: 1985, yearTo: 1995 },
      ],
      A112: [
        { label: "0.9 42cv", yearFrom: 1969, yearTo: 1986 },
        { label: "Abarth 70cv", yearFrom: 1971, yearTo: 1986 },
      ],
    },
    Genesis: {
      G70: [
        { label: "2.0 T-GDI 245cv", yearFrom: 2021, yearTo: null },
        { label: "2.2 CRDi 202cv", yearFrom: 2021, yearTo: null },
      ],
      GV70: [
        { label: "2.5 T-GDI 304cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica 490cv", yearFrom: 2022, yearTo: null },
      ],
    },
    Infiniti: {
      Q30: [
        { label: "1.6 156cv", yearFrom: 2015, yearTo: 2019 },
        { label: "2.2d 170cv", yearFrom: 2015, yearTo: 2019 },
      ],
      QX30: [{ label: "2.2d 170cv", yearFrom: 2016, yearTo: 2019 }],
      FX: [{ label: "3.7 V6 320cv", yearFrom: 2009, yearTo: 2013 }],
      QX70: [{ label: "3.0d V6 238cv", yearFrom: 2013, yearTo: 2017 }],
    },
    Iveco: {
      Daily: [
        { label: "2.3 MultiJet 116cv", yearFrom: 2014, yearTo: null },
        { label: "3.0 MultiJet 160cv", yearFrom: 2014, yearTo: null },
      ],
    },
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
      Camaro: [{ label: "6.2 V8 SS 426cv", yearFrom: 2016, yearTo: null }],
      Corvette: [{ label: "6.2 V8 495cv", yearFrom: 2020, yearTo: null }],
      Cruze: [{ label: "2.0 VCDi 163cv", yearFrom: 2009, yearTo: 2015 }],
      Kalos: [{ label: "1.4 16v 94cv", yearFrom: 2005, yearTo: 2011 }],
      Matiz: [{ label: "0.8 51cv", yearFrom: 2005, yearTo: 2010 }],
      Orlando: [{ label: "2.0 VCDi 163cv", yearFrom: 2011, yearTo: 2018 }],
      Tahoe: [{ label: "5.3 V8 355cv", yearFrom: 2015, yearTo: null }],
      Trax: [{ label: "1.4 Turbo 140cv", yearFrom: 2013, yearTo: 2020 }],
    },
    GWM: {
      "Ora Funky Cat": [{ label: "Elettrica 171cv", yearFrom: 2023, yearTo: null }],
      Hover: [{ label: "2.4 16v 126cv", yearFrom: 2008, yearTo: 2013 }],
      "Hover 5": [{ label: "2.0 VGT 143cv", yearFrom: 2013, yearTo: 2018 }],
      Steed: [{ label: "2.0 VGT 143cv", yearFrom: 2013, yearTo: null }],
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
      IS: [{ label: "300h Hybrid 223cv", yearFrom: 2013, yearTo: null }],
      LC: [{ label: "500h Hybrid 359cv", yearFrom: 2017, yearTo: null }],
      LS: [{ label: "500h Hybrid 359cv", yearFrom: 2017, yearTo: null }],
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
      XLV: [{ label: "1.6 e-XDi 115cv", yearFrom: 2016, yearTo: 2019 }],
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
      "Grande Punto": [
        { label: "1.4 T-Jet 155cv", yearFrom: 2007, yearTo: 2010 },
        { label: "1.9 MultiJet 130cv", yearFrom: 2007, yearTo: 2010 },
      ],
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
      "164": [
        { label: "2.0 T.Spark 148cv", yearFrom: 1987, yearTo: 1998 },
        { label: "3.0 V6 192cv", yearFrom: 1987, yearTo: 1998 },
      ],
      "155": [
        { label: "1.8 T.Spark 129cv", yearFrom: 1992, yearTo: 1997 },
        { label: "2.5 V6 165cv", yearFrom: 1992, yearTo: 1997 },
      ],
      "146": [
        { label: "1.6 T.Spark 103cv", yearFrom: 1994, yearTo: 2001 },
        { label: "1.9 TD 90cv", yearFrom: 1994, yearTo: 2001 },
      ],
      "145": [
        { label: "1.6 T.Spark 103cv", yearFrom: 1994, yearTo: 2000 },
        { label: "1.9 TD 90cv", yearFrom: 1994, yearTo: 2000 },
      ],
      "75": [
        { label: "1.8 120cv", yearFrom: 1985, yearTo: 1992 },
        { label: "3.0 V6 188cv", yearFrom: 1987, yearTo: 1992 },
      ],
      "4C": [{ label: "1.75 Turbo 240cv", yearFrom: 2013, yearTo: 2020 }],
      "156": [
        { label: "1.8 T.Spark 144cv", yearFrom: 1997, yearTo: 2005 },
        { label: "1.9 JTD 115cv", yearFrom: 1997, yearTo: 2005 },
        { label: "2.5 V6 190cv", yearFrom: 1997, yearTo: 2005 },
      ],
      "166": [
        { label: "2.4 JTD 150cv", yearFrom: 1998, yearTo: 2007 },
        { label: "3.0 V6 226cv", yearFrom: 1998, yearTo: 2007 },
      ],
      "33": [
        { label: "1.5 QV 105cv", yearFrom: 1983, yearTo: 1994 },
        { label: "1.7 16v 132cv", yearFrom: 1990, yearTo: 1994 },
      ],
      GTV: [
        { label: "2.0 T.Spark 150cv", yearFrom: 1995, yearTo: 2005 },
        { label: "3.2 V6 240cv", yearFrom: 2003, yearTo: 2005 },
      ],
      Spider: [
        { label: "2.0 T.Spark 150cv", yearFrom: 1995, yearTo: 2005 },
        { label: "3.2 V6 240cv", yearFrom: 2003, yearTo: 2005 },
      ],
    },
    Alpine: {
      A110: [
        { label: "1.8 Turbo 252cv", yearFrom: 2017, yearTo: null },
        { label: "1.8 Turbo S 300cv", yearFrom: 2019, yearTo: null },
      ],
    },
    Audi: {
      "80/90": [
        { label: "1.8 90cv", yearFrom: 1986, yearTo: 1996 },
        { label: "2.0 20v 137cv", yearFrom: 1986, yearTo: 1996 },
      ],
      A2: [{ label: "1.4 TDI 75cv", yearFrom: 2000, yearTo: 2005 }],
      R8: [
        { label: "4.2 V8 420cv", yearFrom: 2007, yearTo: null },
        { label: "5.2 V10 620cv", yearFrom: 2015, yearTo: null },
      ],
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
      RS3: [
        { label: "2.5 TFSI 367cv", yearFrom: 2017, yearTo: 2020 },
        { label: "2.5 TFSI 400cv", yearFrom: 2021, yearTo: null },
      ],
      RS4: [
        { label: "Avant 4.2 V8 420cv", yearFrom: 2005, yearTo: 2008 },
        { label: "Avant 4.2 V8 450cv", yearFrom: 2012, yearTo: 2015 },
        { label: "Avant 2.9 V6 Turbo 450cv", yearFrom: 2017, yearTo: null },
      ],
      RS5: [
        { label: "Coupé 4.2 V8 450cv", yearFrom: 2010, yearTo: 2015 },
        { label: "Coupé 2.9 V6 Turbo 450cv", yearFrom: 2017, yearTo: null },
        { label: "Sportback 2.9 V6 Turbo 450cv", yearFrom: 2018, yearTo: null },
      ],
      RS6: [
        { label: "Avant 4.2 V8 Twin Turbo 580cv", yearFrom: 2013, yearTo: 2018 },
        { label: "Avant 4.0 V8 Twin Turbo 600cv", yearFrom: 2019, yearTo: null },
        { label: "Avant Performance 4.0 V8 Twin Turbo 630cv", yearFrom: 2022, yearTo: null },
      ],
      RS7: [
        { label: "4.0 V8 Twin Turbo 560cv", yearFrom: 2013, yearTo: 2018 },
        { label: "4.0 V8 Twin Turbo 600cv", yearFrom: 2019, yearTo: null },
        { label: "Performance 4.0 V8 Twin Turbo 630cv", yearFrom: 2022, yearTo: null },
      ],
      "RS Q3": [
        { label: "2.5 TFSI 400cv", yearFrom: 2019, yearTo: null },
        { label: "Sportback 2.5 TFSI 400cv", yearFrom: 2019, yearTo: null },
      ],
      "RS Q8": [
        { label: "4.0 V8 Twin Turbo 600cv", yearFrom: 2020, yearTo: null },
        { label: "Performance 4.0 V8 Twin Turbo 631cv", yearFrom: 2023, yearTo: null },
      ],
      "TT RS": [
        { label: "2.5 TFSI 400cv", yearFrom: 2016, yearTo: 2023 },
        { label: "2.5 TFSI 401cv", yearFrom: 2019, yearTo: 2023 },
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
      "Serie 6": [
        { label: "630d 3.0 258cv", yearFrom: 2011, yearTo: 2018 },
        { label: "650i 4.4 V8 450cv", yearFrom: 2011, yearTo: 2018 },
      ],
      "Serie 8": [
        { label: "840d 3.0 320cv", yearFrom: 2018, yearTo: null },
        { label: "M850i 4.4 V8 530cv", yearFrom: 2018, yearTo: null },
      ],
      M2: [
        { label: "3.0 Turbo 370cv", yearFrom: 2016, yearTo: 2018 },
        { label: "Competition 3.0 Turbo 410cv", yearFrom: 2018, yearTo: 2021 },
        { label: "CS 3.0 Turbo 450cv", yearFrom: 2020, yearTo: 2021 },
        { label: "3.0 Turbo 460cv", yearFrom: 2023, yearTo: null },
      ],
      M3: [
        { label: "4.0 V8 420cv", yearFrom: 2007, yearTo: 2013 },
        { label: "3.0 Turbo 431cv", yearFrom: 2014, yearTo: 2018 },
        { label: "Competition 3.0 Turbo 450cv", yearFrom: 2016, yearTo: 2018 },
        { label: "3.0 Turbo 480cv", yearFrom: 2021, yearTo: null },
        { label: "Competition 3.0 Turbo 510cv", yearFrom: 2021, yearTo: null },
        { label: "Touring Competition 3.0 Turbo 510cv", yearFrom: 2022, yearTo: null },
      ],
      M4: [
        { label: "3.0 Turbo 431cv", yearFrom: 2014, yearTo: 2020 },
        { label: "Competition 3.0 Turbo 450cv", yearFrom: 2016, yearTo: 2020 },
        { label: "CS 3.0 Turbo 460cv", yearFrom: 2017, yearTo: 2018 },
        { label: "3.0 Turbo 480cv", yearFrom: 2021, yearTo: null },
        { label: "Competition 3.0 Turbo 510cv", yearFrom: 2021, yearTo: null },
        { label: "CSL 3.0 Turbo 550cv", yearFrom: 2022, yearTo: 2023 },
      ],
      M5: [
        { label: "5.0 V8 400cv", yearFrom: 1998, yearTo: 2003 },
        { label: "5.0 V10 507cv", yearFrom: 2005, yearTo: 2010 },
        { label: "4.4 V8 Turbo 560cv", yearFrom: 2011, yearTo: 2016 },
        { label: "Competition 4.4 V8 Turbo 600cv", yearFrom: 2014, yearTo: 2016 },
        { label: "4.4 V8 Turbo 600cv", yearFrom: 2018, yearTo: 2023 },
        { label: "Competition 4.4 V8 Turbo 625cv", yearFrom: 2018, yearTo: 2023 },
        { label: "Ibrida 4.4 V8 Turbo 727cv", yearFrom: 2024, yearTo: null },
      ],
      M8: [
        { label: "4.4 V8 Turbo 600cv", yearFrom: 2019, yearTo: null },
        { label: "Competition 4.4 V8 Turbo 625cv", yearFrom: 2019, yearTo: null },
        { label: "Gran Coupé 4.4 V8 Turbo 600cv", yearFrom: 2019, yearTo: null },
      ],
      "X3 M": [
        { label: "3.0 Turbo 480cv", yearFrom: 2019, yearTo: 2024 },
        { label: "Competition 3.0 Turbo 510cv", yearFrom: 2019, yearTo: 2024 },
      ],
      "X4 M": [
        { label: "3.0 Turbo 480cv", yearFrom: 2019, yearTo: 2024 },
        { label: "Competition 3.0 Turbo 510cv", yearFrom: 2019, yearTo: 2024 },
      ],
      "X5 M": [
        { label: "4.4 V8 Turbo 575cv", yearFrom: 2015, yearTo: 2018 },
        { label: "4.4 V8 Turbo 600cv", yearFrom: 2020, yearTo: null },
        { label: "Competition 4.4 V8 Turbo 625cv", yearFrom: 2020, yearTo: null },
      ],
      "X6 M": [
        { label: "4.4 V8 Turbo 575cv", yearFrom: 2015, yearTo: 2018 },
        { label: "4.4 V8 Turbo 600cv", yearFrom: 2020, yearTo: null },
        { label: "Competition 4.4 V8 Turbo 625cv", yearFrom: 2020, yearTo: null },
      ],
      "Z4 M": [{ label: "3.2 343cv", yearFrom: 2006, yearTo: 2008 }],
      Z1: [{ label: "2.5 170cv", yearFrom: 1988, yearTo: 1991 }],
      Z3: [
        { label: "1.9 140cv", yearFrom: 1995, yearTo: 2002 },
        { label: "3.2 M 321cv", yearFrom: 1997, yearTo: 2002 },
      ],
      i8: [{ label: "1.5 Turbo Ibrida 374cv", yearFrom: 2014, yearTo: 2020 }],
      iX1: [{ label: "xDrive30 313cv", yearFrom: 2022, yearTo: null }],
      iX3: [{ label: "286cv", yearFrom: 2020, yearTo: null }],
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
      Saxo: [
        { label: "1.1i 60cv", yearFrom: 1996, yearTo: 2003 },
        { label: "1.6 16v VTS 118cv", yearFrom: 1996, yearTo: 2003 },
      ],
      Xsara: [
        { label: "1.6i 90cv", yearFrom: 1997, yearTo: 2004 },
        { label: "2.0 HDi 90cv", yearFrom: 1998, yearTo: 2004 },
      ],
      Xantia: [
        { label: "1.8i 110cv", yearFrom: 1993, yearTo: 2001 },
        { label: "2.0 HDi 90cv", yearFrom: 1998, yearTo: 2001 },
      ],
      "C4 Cactus": [
        { label: "1.2 PureTech 82cv", yearFrom: 2014, yearTo: 2020 },
        { label: "1.5 BlueHDi 100cv", yearFrom: 2018, yearTo: 2020 },
      ],
      "2CV": [{ label: "0.6 29cv", yearFrom: 1948, yearTo: 1990 }],
      Ami: [{ label: "Elettrica 8cv", yearFrom: 2020, yearTo: null }],
      C2: [{ label: "1.4i 75cv", yearFrom: 2003, yearTo: 2009 }],
      "C3 Picasso": [{ label: "1.6 HDi 90cv", yearFrom: 2009, yearTo: 2017 }],
      "C4 Aircross": [{ label: "1.8 DID 150cv", yearFrom: 2012, yearTo: 2017 }],
      C5: [
        { label: "2.0 16v 143cv", yearFrom: 2001, yearTo: 2017 },
        { label: "2.0 HDi 138cv", yearFrom: 2001, yearTo: 2017 },
      ],
      C6: [{ label: "2.7 HDi V6 208cv", yearFrom: 2005, yearTo: 2012 }],
      C8: [{ label: "2.0 HDi 136cv", yearFrom: 2002, yearTo: 2014 }],
      XM: [{ label: "2.1 Turbo D 109cv", yearFrom: 1989, yearTo: 2000 }],
      Jumper: [{ label: "2.2 HDi 120cv", yearFrom: 2006, yearTo: null }],
      Nemo: [{ label: "1.3 HDi 75cv", yearFrom: 2008, yearTo: 2017 }],
      Mehari: [{ label: "0.6 29cv", yearFrom: 1968, yearTo: 1988 }],
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
      Dokker: [{ label: "1.5 dCi 90cv", yearFrom: 2013, yearTo: null }],
      Lodgy: [{ label: "1.5 dCi 110cv", yearFrom: 2012, yearTo: 2022 }],
      Logan: [{ label: "1.0 SCe 75cv", yearFrom: 2004, yearTo: null }],
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
      Uno: [
        { label: "1.0 45cv", yearFrom: 1983, yearTo: 1995 },
        { label: "1.4 Turbo i.e. 118cv", yearFrom: 1985, yearTo: 1995 },
      ],
      Ritmo: [
        { label: "1.3 65cv", yearFrom: 1978, yearTo: 1988 },
        { label: "Abarth 130 TC 130cv", yearFrom: 1981, yearTo: 1988 },
      ],
      "126": [{ label: "0.65 24cv", yearFrom: 1972, yearTo: 2000 }],
      "127": [{ label: "0.9 45cv", yearFrom: 1971, yearTo: 1987 }],
      "131": [{ label: "1.6 75cv", yearFrom: 1974, yearTo: 1984 }],
      Cinquecento: [
        { label: "0.9 41cv", yearFrom: 1991, yearTo: 1998 },
        { label: "Sporting 1.1 54cv", yearFrom: 1994, yearTo: 1998 },
      ],
      Seicento: [{ label: "1.1 54cv", yearFrom: 1998, yearTo: 2010 }],
      Idea: [
        { label: "1.4 8v 77cv", yearFrom: 2003, yearTo: 2012 },
        { label: "1.3 MultiJet 90cv", yearFrom: 2003, yearTo: 2012 },
      ],
      Fiorino: [{ label: "1.3 MultiJet 80cv", yearFrom: 2007, yearTo: null }],
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
      Stilo: [
        { label: "1.6 16v 103cv", yearFrom: 2001, yearTo: 2007 },
        { label: "1.9 JTD 115cv", yearFrom: 2001, yearTo: 2007 },
      ],
      Marea: [
        { label: "1.6 16v 103cv", yearFrom: 1996, yearTo: 2007 },
        { label: "1.9 JTD 105cv", yearFrom: 1996, yearTo: 2007 },
      ],
      "Coupé": [
        { label: "2.0 20v 147cv", yearFrom: 1993, yearTo: 2000 },
        { label: "2.0 20v Turbo 220cv", yearFrom: 1996, yearTo: 2000 },
      ],
      Barchetta: [{ label: "1.8 16v 130cv", yearFrom: 1995, yearTo: 2005 }],
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
      "Grande Panda": [
        { label: "1.2 Turbo Benzina 100cv", yearFrom: 2024, yearTo: null },
        { label: "Hybrid 110cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica 113cv", yearFrom: 2024, yearTo: null },
      ],
      Topolino: [{ label: "Elettrica quadriciclo 3cv (45 km/h)", yearFrom: 2023, yearTo: null }],
      Grizzly: [
        { label: "1.2 Turbo Benzina 100cv", yearFrom: 2026, yearTo: null },
        { label: "Hybrid 110cv", yearFrom: 2026, yearTo: null },
        { label: "Elettrica", yearFrom: 2026, yearTo: null },
      ],
      "Grizzly Fastback": [
        { label: "1.2 Turbo Benzina 100cv", yearFrom: 2026, yearTo: null },
        { label: "Hybrid 110cv", yearFrom: 2026, yearTo: null },
        { label: "Elettrica", yearFrom: 2026, yearTo: null },
      ],
      Ulysse: [
        { label: "2.0 MultiJet 180cv", yearFrom: 2022, yearTo: null },
        { label: "E-Ulysse Elettrica 136cv", yearFrom: 2022, yearTo: null },
      ],
    },
    Ford: {
      Fiesta: [
        { label: "1.1 Ti-VCT 85cv", yearFrom: 2017, yearTo: null },
        { label: "1.0 EcoBoost 100cv", yearFrom: 2017, yearTo: null },
        { label: "1.0 EcoBoost 125cv", yearFrom: 2017, yearTo: null },
        { label: "1.5 TDCi 85cv", yearFrom: 2017, yearTo: 2021 },
        { label: "ST 1.6 EcoBoost 182cv", yearFrom: 2013, yearTo: 2017 },
        { label: "1.5 EcoBoost ST 200cv", yearFrom: 2018, yearTo: null },
      ],
      Focus: [
        { label: "1.0 EcoBoost 125cv", yearFrom: 2018, yearTo: null },
        { label: "1.5 EcoBlue 120cv", yearFrom: 2018, yearTo: null },
        { label: "ST 2.3 EcoBoost 280cv", yearFrom: 2019, yearTo: null },
        { label: "RS 2.3 EcoBoost 350cv", yearFrom: 2016, yearTo: 2018 },
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
      Sierra: [
        { label: "2.0i 120cv", yearFrom: 1982, yearTo: 1993 },
        { label: "Cosworth 2.0 Turbo 204cv", yearFrom: 1986, yearTo: 1992 },
      ],
      Scorpio: [
        { label: "2.0i 120cv", yearFrom: 1985, yearTo: 1998 },
        { label: "2.9 24v 195cv", yearFrom: 1994, yearTo: 1998 },
      ],
      Cougar: [{ label: "2.5 V6 170cv", yearFrom: 1998, yearTo: 2002 }],
      Escort: [
        { label: "1.6i 90cv", yearFrom: 1990, yearTo: 2000 },
        { label: "RS Cosworth 227cv", yearFrom: 1992, yearTo: 1996 },
      ],
      Mustang: [
        { label: "2.3 EcoBoost 290cv", yearFrom: 2015, yearTo: null },
        { label: "5.0 V8 GT 450cv", yearFrom: 2015, yearTo: null },
      ],
      "S-Max": [
        { label: "2.0 EcoBlue 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.5 Duratec Hybrid 190cv", yearFrom: 2019, yearTo: null },
      ],
      Explorer: [{ label: "3.0 EcoBoost PHEV 457cv", yearFrom: 2019, yearTo: null }],
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
      Prelude: [{ label: "2.2 VTEC 185cv", yearFrom: 1996, yearTo: 2001 }],
      Integra: [{ label: "1.8 VTEC Type R 190cv", yearFrom: 1995, yearTo: 2001 }],
      S2000: [{ label: "2.0 VTEC 240cv", yearFrom: 1999, yearTo: 2009 }],
      "FR-V": [{ label: "2.2 i-CTDi 140cv", yearFrom: 2004, yearTo: 2009 }],
      Insight: [{ label: "1.3 Hybrid 102cv", yearFrom: 2009, yearTo: 2014 }],
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
      "Ioniq 5": [{ label: "Elettrica 170cv", yearFrom: 2021, yearTo: null }],
      "Ioniq 6": [{ label: "Elettrica 229cv", yearFrom: 2022, yearTo: null }],
      i40: [{ label: "1.7 CRDi 136cv", yearFrom: 2011, yearTo: 2019 }],
      Atos: [{ label: "1.0 55cv", yearFrom: 1998, yearTo: 2008 }],
      Coupe: [{ label: "2.0 16v 143cv", yearFrom: 1996, yearTo: 2009 }],
      Galloper: [{ label: "2.5 TDI 99cv", yearFrom: 1998, yearTo: 2003 }],
      Getz: [{ label: "1.3 82cv", yearFrom: 2002, yearTo: 2011 }],
      "H-1": [{ label: "2.5 CRDi 170cv", yearFrom: 2008, yearTo: null }],
      ix20: [{ label: "1.4 90cv", yearFrom: 2010, yearTo: 2019 }],
      ix35: [{ label: "1.7 CRDi 116cv", yearFrom: 2010, yearTo: 2015 }],
      Matrix: [{ label: "1.6 103cv", yearFrom: 2001, yearTo: 2010 }],
      Terracan: [{ label: "2.9 CRDi 150cv", yearFrom: 2001, yearTo: 2007 }],
      Veloster: [{ label: "1.6 GDI 140cv", yearFrom: 2011, yearTo: 2017 }],
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
      "F-Type": [
        { label: "2.0 300cv", yearFrom: 2013, yearTo: null },
        { label: "5.0 V8 R 575cv", yearFrom: 2013, yearTo: null },
      ],
      "S-Type": [{ label: "2.7 V6 Diesel 207cv", yearFrom: 1999, yearTo: 2008 }],
      "X-Type": [{ label: "2.0 V6 Diesel 130cv", yearFrom: 2001, yearTo: 2009 }],
      XJ: [{ label: "3.0 V6 Diesel 275cv", yearFrom: 2009, yearTo: 2019 }],
      XK: [{ label: "5.0 V8 385cv", yearFrom: 2006, yearTo: 2014 }],
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
      Commander: [{ label: "3.0 CRD 218cv", yearFrom: 2006, yearTo: 2010 }],
      Patriot: [{ label: "2.2 CRD 163cv", yearFrom: 2007, yearTo: 2016 }],
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
      ProCeed: [{ label: "1.4 T-GDI 140cv", yearFrom: 2018, yearTo: null }],
      "e-Niro": [{ label: "Elettrica 204cv", yearFrom: 2018, yearTo: null }],
      Soul: [{ label: "1.6 CRDi 136cv", yearFrom: 2009, yearTo: null }],
      Carens: [{ label: "1.7 CRDi 136cv", yearFrom: 2006, yearTo: 2022 }],
      Carnival: [{ label: "2.2 CRDi 202cv", yearFrom: 2014, yearTo: null }],
      Optima: [{ label: "1.7 CRDi 141cv", yearFrom: 2011, yearTo: 2020 }],
      Venga: [{ label: "1.4 90cv", yearFrom: 2009, yearTo: 2019 }],
      Stinger: [{ label: "3.3 V6 Turbo GT 370cv", yearFrom: 2017, yearTo: null }],
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
      Diablo: [{ label: "5.7 V12 492cv", yearFrom: 1990, yearTo: 2001 }],
      Gallardo: [{ label: "5.0 V10 500cv", yearFrom: 2003, yearTo: 2013 }],
      "Murciélago": [{ label: "6.2 V12 580cv", yearFrom: 2001, yearTo: 2010 }],
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
      Kappa: [
        { label: "2.0 20v 155cv", yearFrom: 1994, yearTo: 2001 },
        { label: "2.4 JTD 125cv", yearFrom: 1994, yearTo: 2001 },
      ],
      Thema: [
        { label: "2.0 Turbo 16v 155cv", yearFrom: 1984, yearTo: 1994 },
        { label: "2.8 V6 168cv", yearFrom: 2011, yearTo: 2014 },
      ],
      Dedra: [
        { label: "1.8 16v 113cv", yearFrom: 1989, yearTo: 1999 },
        { label: "2.0 Turbo 165cv", yearFrom: 1989, yearTo: 1999 },
      ],
      Beta: [{ label: "1.6 90cv", yearFrom: 1972, yearTo: 1984 }],
      Fulvia: [{ label: "1.3 Rallye 90cv", yearFrom: 1965, yearTo: 1976 }],
      Flavia: [{ label: "1.8 92cv", yearFrom: 1960, yearTo: 1971 }],
      Gamma: [{ label: "2.5 140cv", yearFrom: 1976, yearTo: 1984 }],
      Lybra: [
        { label: "1.8 16v 131cv", yearFrom: 1999, yearTo: 2005 },
        { label: "2.4 JTD 150cv", yearFrom: 1999, yearTo: 2005 },
      ],
      Y: [{ label: "1.2 60cv", yearFrom: 1995, yearTo: 2003 }],
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
      Freelander: [{ label: "2.2 TD4 150cv", yearFrom: 2006, yearTo: 2014 }],
      "Range Rover Velar": [{ label: "2.0 D200 200cv", yearFrom: 2017, yearTo: null }],
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
      MC20: [{ label: "3.0 V6 Turbo 630cv", yearFrom: 2020, yearTo: null }],
    },
    Mazda: {
      Mazda2: [
        { label: "1.5 Skyactiv-G 90cv", yearFrom: 2015, yearTo: null },
        { label: "1.5 Skyactiv-G 115cv", yearFrom: 2015, yearTo: null },
      ],
      "626": [
        { label: "2.0i 115cv", yearFrom: 1997, yearTo: 2002 },
        { label: "2.0 TD 101cv", yearFrom: 1997, yearTo: 2002 },
      ],
      "RX-8": [{ label: "1.3 Rotativo 231cv", yearFrom: 2003, yearTo: 2012 }],
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
      "190": [
        { label: "190E 2.0 122cv", yearFrom: 1982, yearTo: 1993 },
        { label: "190D 2.5 90cv", yearFrom: 1982, yearTo: 1993 },
      ],
      "Classe G": [
        { label: "G350d 3.0 286cv", yearFrom: 2018, yearTo: null },
        { label: "AMG G63 4.0 V8 585cv", yearFrom: 2018, yearTo: null },
      ],
      CLK: [
        { label: "CLK 200 2.0 163cv", yearFrom: 1997, yearTo: 2010 },
        { label: "CLK 320 V6 218cv", yearFrom: 1997, yearTo: 2010 },
      ],
      CLS: [{ label: "CLS 350d 3.0 286cv", yearFrom: 2018, yearTo: null }],
      GLS: [{ label: "GLS 400d 3.0 330cv", yearFrom: 2019, yearTo: null }],
      "AMG GT": [{ label: "4.0 V8 Turbo 476cv", yearFrom: 2014, yearTo: null }],
      EQV: [{ label: "Elettrica 204cv", yearFrom: 2020, yearTo: null }],
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
      Paceman: [
        { label: "1.6 Cooper 122cv", yearFrom: 2013, yearTo: 2016 },
        { label: "2.0 Cooper S 184cv", yearFrom: 2013, yearTo: 2016 },
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
      Colt: [{ label: "1.5 109cv", yearFrom: 2004, yearTo: 2012 }],
      Lancer: [{ label: "2.0 DI-D 140cv", yearFrom: 2007, yearTo: 2016 }],
      Pajero: [{ label: "3.2 DI-D 165cv", yearFrom: 2006, yearTo: null }],
      "Pajero Pinin": [{ label: "1.8 GDI 120cv", yearFrom: 1999, yearTo: 2006 }],
      "Pajero Sport": [{ label: "2.4 DI-D 181cv", yearFrom: 2016, yearTo: null }],
    },
    Nissan: {
      Micra: [
        { label: "1.0 IG-T 92cv", yearFrom: 2017, yearTo: null },
        { label: "0.9 IG-T 90cv", yearFrom: 2017, yearTo: null },
      ],
      Primera: [
        { label: "1.8 16v 116cv", yearFrom: 1996, yearTo: 2007 },
        { label: "2.2 Di 126cv", yearFrom: 1999, yearTo: 2007 },
      ],
      "350Z": [{ label: "3.5 V6 280cv", yearFrom: 2003, yearTo: 2009 }],
      "GT-R": [
        { label: "3.8 V6 Biturbo 480cv", yearFrom: 2007, yearTo: null },
        { label: "Nismo 3.8 V6 600cv", yearFrom: 2014, yearTo: null },
      ],
      "370Z": [{ label: "3.7 V6 328cv", yearFrom: 2009, yearTo: 2020 }],
      Murano: [{ label: "3.5 V6 249cv", yearFrom: 2008, yearTo: 2016 }],
      Pathfinder: [{ label: "2.5 dCi 190cv", yearFrom: 2005, yearTo: 2014 }],
      Patrol: [{ label: "3.0 Di 158cv", yearFrom: 1997, yearTo: 2010 }],
      "Terrano II": [{ label: "2.7 TDi 125cv", yearFrom: 1993, yearTo: 2006 }],
      Pulsar: [{ label: "1.5 dCi 110cv", yearFrom: 2014, yearTo: 2018 }],
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
      "e-NV200": [{ label: "Elettrica 109cv", yearFrom: 2014, yearTo: 2021 }],
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
        { label: "OPC 1.6 Turbo 192cv", yearFrom: 2007, yearTo: 2014 },
        { label: "OPC 1.6 Turbo 207cv", yearFrom: 2015, yearTo: 2019 },
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
      Vectra: [
        { label: "1.8 16v 122cv", yearFrom: 2002, yearTo: 2008 },
        { label: "1.9 CDTI 150cv", yearFrom: 2002, yearTo: 2008 },
      ],
      Meriva: [
        { label: "1.4 Turbo 120cv", yearFrom: 2010, yearTo: 2017 },
        { label: "1.6 CDTI 136cv", yearFrom: 2010, yearTo: 2017 },
      ],
      Calibra: [{ label: "2.0i 16v 150cv", yearFrom: 1990, yearTo: 1997 }],
      Tigra: [{ label: "1.4 16v 90cv", yearFrom: 1994, yearTo: 2009 }],
      Antara: [{ label: "2.2 CDTI 184cv", yearFrom: 2010, yearTo: 2015 }],
      Agila: [{ label: "1.2 16v 86cv", yearFrom: 2008, yearTo: 2014 }],
      Adam: [{ label: "1.4 87cv", yearFrom: 2013, yearTo: 2019 }],
      Frontera: [{ label: "2.2 DTI 120cv", yearFrom: 1998, yearTo: 2004 }],
      Karl: [{ label: "1.0 75cv", yearFrom: 2015, yearTo: 2019 }],
    },
    Peugeot: {
      "108": [
        { label: "1.0 VTi 68cv", yearFrom: 2014, yearTo: 2021 },
        { label: "1.2 PureTech 82cv", yearFrom: 2014, yearTo: 2021 },
      ],
      "306": [
        { label: "1.8 16v 101cv", yearFrom: 1993, yearTo: 2002 },
        { label: "2.0 HDi 90cv", yearFrom: 1998, yearTo: 2002 },
      ],
      "406": [
        { label: "2.0 16v 135cv", yearFrom: 1995, yearTo: 2004 },
        { label: "2.0 HDi 110cv", yearFrom: 1999, yearTo: 2004 },
      ],
      RCZ: [
        { label: "1.6 THP 156cv", yearFrom: 2010, yearTo: 2015 },
        { label: "1.6 THP R 270cv", yearFrom: 2014, yearTo: 2015 },
      ],
      "106": [{ label: "1.1i 60cv", yearFrom: 1991, yearTo: 2003 }],
      "107": [{ label: "1.0 68cv", yearFrom: 2005, yearTo: 2014 }],
      "205": [
        { label: "1.1 50cv", yearFrom: 1983, yearTo: 1998 },
        { label: "GTI 1.9 130cv", yearFrom: 1986, yearTo: 1994 },
      ],
      "206": [
        { label: "1.4 75cv", yearFrom: 1998, yearTo: 2012 },
        { label: "2.0 HDi 90cv", yearFrom: 1998, yearTo: 2012 },
      ],
      "207": [
        { label: "1.4 75cv", yearFrom: 2006, yearTo: 2014 },
        { label: "1.6 HDi 90cv", yearFrom: 2006, yearTo: 2014 },
      ],
      "307": [
        { label: "1.6 16v 110cv", yearFrom: 2001, yearTo: 2008 },
        { label: "2.0 HDi 136cv", yearFrom: 2001, yearTo: 2008 },
      ],
      "407": [
        { label: "2.0 16v 140cv", yearFrom: 2004, yearTo: 2010 },
        { label: "2.0 HDi 136cv", yearFrom: 2004, yearTo: 2010 },
      ],
      "807": [{ label: "2.0 HDi 136cv", yearFrom: 2002, yearTo: 2014 }],
      "1007": [{ label: "1.4 16v 75cv", yearFrom: 2005, yearTo: 2009 }],
      Bipper: [{ label: "1.3 HDi 75cv", yearFrom: 2008, yearTo: 2017 }],
      Traveller: [{ label: "2.0 BlueHDi 150cv", yearFrom: 2016, yearTo: null }],
      "208": [
        { label: "1.2 PureTech 75cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 PureTech 100cv", yearFrom: 2019, yearTo: null },
        { label: "1.2 PureTech 130cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 BlueHDi 100cv", yearFrom: 2019, yearTo: null },
        { label: "Elettrica e-208 136cv", yearFrom: 2019, yearTo: null },
        { label: "GTi 1.6 THP 200cv", yearFrom: 2012, yearTo: 2015 },
        { label: "GTi by Peugeot Sport 1.6 THP 208cv", yearFrom: 2015, yearTo: 2019 },
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
      "924": [{ label: "2.0 125cv", yearFrom: 1976, yearTo: 1988 }],
      "928": [{ label: "4.5 V8 240cv", yearFrom: 1977, yearTo: 1995 }],
      "944": [{ label: "2.5 163cv", yearFrom: 1982, yearTo: 1991 }],
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
      Laguna: [
        { label: "2.0 16v 140cv", yearFrom: 2007, yearTo: 2015 },
        { label: "2.0 dCi 150cv", yearFrom: 2007, yearTo: 2015 },
      ],
      Trafic: [{ label: "2.0 dCi 145cv", yearFrom: 2014, yearTo: null }],
      Twizy: [{ label: "Elettrica 17cv", yearFrom: 2012, yearTo: null }],
      Arkana: [
        { label: "1.3 TCe 140cv", yearFrom: 2021, yearTo: null },
        { label: "E-Tech Hybrid 145cv", yearFrom: 2021, yearTo: null },
      ],
      Koleos: [
        { label: "1.7 dCi 150cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 dCi 190cv", yearFrom: 2017, yearTo: null },
      ],
      Talisman: [
        { label: "1.6 dCi 160cv", yearFrom: 2015, yearTo: 2022 },
        { label: "1.8 TCe 225cv", yearFrom: 2015, yearTo: 2022 },
      ],
      Kangoo: [{ label: "1.5 dCi 90cv", yearFrom: 1997, yearTo: null }],
      Modus: [{ label: "1.5 dCi 85cv", yearFrom: 2004, yearTo: 2012 }],
      R4: [{ label: "1.1 34cv", yearFrom: 1961, yearTo: 1992 }],
      R5: [{ label: "1.4 Turbo 115cv", yearFrom: 1972, yearTo: 1996 }],
      R19: [{ label: "1.7 95cv", yearFrom: 1988, yearTo: 1996 }],
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
        { label: "Cupra 1.8 TSI 192cv", yearFrom: 2015, yearTo: 2017 },
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
      Alhambra: [
        { label: "2.0 TDI 150cv", yearFrom: 2010, yearTo: 2020 },
        { label: "2.0 TSI 220cv", yearFrom: 2010, yearTo: 2020 },
      ],
      Altea: [
        { label: "1.6 102cv", yearFrom: 2004, yearTo: 2015 },
        { label: "2.0 TDI 140cv", yearFrom: 2004, yearTo: 2015 },
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
      Yeti: [
        { label: "1.4 TSI 122cv", yearFrom: 2009, yearTo: 2017 },
        { label: "2.0 TDI 140cv", yearFrom: 2009, yearTo: 2017 },
      ],
      Roomster: [{ label: "1.6 105cv", yearFrom: 2006, yearTo: 2015 }],
      Rapid: [
        { label: "1.0 TSI 95cv", yearFrom: 2012, yearTo: 2019 },
        { label: "1.6 TDI 105cv", yearFrom: 2012, yearTo: 2019 },
      ],
      Citigo: [{ label: "1.0 60cv", yearFrom: 2012, yearTo: 2019 }],
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
      BRZ: [{ label: "2.4 Boxer 234cv", yearFrom: 2021, yearTo: null }],
      Legacy: [{ label: "2.0i e-Boxer 150cv", yearFrom: 2014, yearTo: null }],
      Levorg: [{ label: "1.6 GT Turbo 170cv", yearFrom: 2015, yearTo: null }],
      WRX: [{ label: "2.4 Boxer Turbo 275cv", yearFrom: 2022, yearTo: null }],
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
      "Grand Vitara": [{ label: "1.9 DDiS 129cv", yearFrom: 2005, yearTo: 2015 }],
      SX4: [
        { label: "1.6 120cv", yearFrom: 2006, yearTo: 2014 },
        { label: "1.9 DDiS 120cv", yearFrom: 2006, yearTo: 2014 },
      ],
      Baleno: [{ label: "1.0 Boosterjet 111cv", yearFrom: 2016, yearTo: null }],
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
      iQ: [{ label: "1.0 VVT-i 68cv", yearFrom: 2009, yearTo: 2015 }],
      "Yaris Cross": [{ label: "1.5 Hybrid 116cv", yearFrom: 2021, yearTo: null }],
      "Corolla Cross": [{ label: "1.8 Hybrid 140cv", yearFrom: 2022, yearTo: null }],
      GT86: [{ label: "2.0 Boxer 200cv", yearFrom: 2012, yearTo: 2021 }],
      GR86: [{ label: "2.4 Boxer 234cv", yearFrom: 2021, yearTo: null }],
      Verso: [
        { label: "1.8 147cv", yearFrom: 2009, yearTo: 2018 },
        { label: "2.0 D-4D 126cv", yearFrom: 2009, yearTo: 2018 },
      ],
      Celica: [
        { label: "1.8 VVTL-i 192cv", yearFrom: 1999, yearTo: 2006 },
        { label: "2.0 GT-Four 239cv", yearFrom: 1994, yearTo: 1999 },
      ],
      Supra: [
        { label: "3.0 Turbo 340cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 Turbo 258cv", yearFrom: 2019, yearTo: null },
      ],
      MR2: [{ label: "2.0 16v Turbo 245cv", yearFrom: 1989, yearTo: 1999 }],
      Avensis: [
        { label: "1.8 VVT-i 147cv", yearFrom: 2009, yearTo: 2018 },
        { label: "2.0 D-4D 143cv", yearFrom: 2009, yearTo: 2018 },
      ],
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
        { label: "2.0 TSI R 300cv", yearFrom: 2014, yearTo: 2017 },
      ],
      Scirocco: [
        { label: "1.4 TSI 122cv", yearFrom: 2008, yearTo: 2017 },
        { label: "2.0 TSI R 280cv", yearFrom: 2009, yearTo: 2017 },
      ],
      Corrado: [{ label: "2.0 16v 136cv", yearFrom: 1988, yearTo: 1995 }],
      Lupo: [
        { label: "1.0 50cv", yearFrom: 1998, yearTo: 2005 },
        { label: "GTI 1.6 125cv", yearFrom: 2000, yearTo: 2005 },
      ],
      Fox: [{ label: "1.2 55cv", yearFrom: 2005, yearTo: 2011 }],
      Phaeton: [{ label: "3.0 TDI V6 240cv", yearFrom: 2002, yearTo: 2016 }],
      Touran: [
        { label: "1.5 TSI 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2015, yearTo: null },
      ],
      Eos: [{ label: "1.4 TSI 122cv", yearFrom: 2006, yearTo: 2015 }],
      Taigo: [
        { label: "1.0 TSI 110cv", yearFrom: 2021, yearTo: null },
        { label: "1.5 TSI 150cv", yearFrom: 2021, yearTo: null },
      ],
      Amarok: [
        { label: "2.0 TDI 150cv", yearFrom: 2016, yearTo: null },
        { label: "3.0 TDI V6 258cv", yearFrom: 2016, yearTo: null },
      ],
      Beetle: [
        { label: "1.2 TSI 105cv", yearFrom: 2011, yearTo: 2019 },
        { label: "2.0 TSI 220cv", yearFrom: 2011, yearTo: 2019 },
      ],
      Jetta: [
        { label: "1.4 TSI 125cv", yearFrom: 2011, yearTo: 2018 },
        { label: "2.0 TDI 150cv", yearFrom: 2011, yearTo: 2018 },
      ],
      Sharan: [
        { label: "2.0 TDI 150cv", yearFrom: 2010, yearTo: 2022 },
        { label: "2.0 TSI 220cv", yearFrom: 2010, yearTo: 2022 },
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
      "240": [{ label: "2.3 B230 116cv", yearFrom: 1974, yearTo: 1993 }],
      S60: [
        { label: "B4 2.0 197cv", yearFrom: 2018, yearTo: null },
        { label: "T8 Plug-in Hybrid 390cv", yearFrom: 2018, yearTo: null },
      ],
      S80: [
        { label: "2.0 D4 190cv", yearFrom: 2006, yearTo: 2016 },
        { label: "T6 3.0 285cv", yearFrom: 2006, yearTo: 2016 },
      ],
      C30: [
        { label: "T5 2.5 230cv", yearFrom: 2006, yearTo: 2013 },
        { label: "D2 1.6 115cv", yearFrom: 2006, yearTo: 2013 },
      ],
      S40: [
        { label: "T4 1.6 180cv", yearFrom: 2004, yearTo: 2012 },
        { label: "D2 1.6 109cv", yearFrom: 2004, yearTo: 2012 },
      ],
      C70: [{ label: "T5 2.5 230cv", yearFrom: 2006, yearTo: 2013 }],
      V50: [
        { label: "T5 2.5 230cv", yearFrom: 2004, yearTo: 2012 },
        { label: "D2 1.6 109cv", yearFrom: 2004, yearTo: 2012 },
      ],
      V70: [
        { label: "2.0D 136cv", yearFrom: 2007, yearTo: 2016 },
        { label: "T5 2.5 231cv", yearFrom: 2007, yearTo: 2016 },
      ],
      XC70: [{ label: "2.4D 5 163cv", yearFrom: 2007, yearTo: 2016 }],
      S90: [
        { label: "B4 2.0 197cv", yearFrom: 2016, yearTo: null },
        { label: "T8 Plug-in Hybrid 390cv", yearFrom: 2016, yearTo: null },
      ],
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
    Bimota: {
      "Tesi H2": [{ label: "998cc Supercharged 228cv", yearFrom: 2020, yearTo: null }],
      KB4: [{ label: "1043cc 144cv", yearFrom: 2022, yearTo: null }],
    },
    Generic: {
      Trigger: [{ label: "125cc 15cv", yearFrom: 2010, yearTo: null }],
      XOR: [{ label: "50cc 4cv", yearFrom: 2010, yearTo: null }],
    },
    Gilera: {
      Runner: [{ label: "125cc 15cv", yearFrom: 1997, yearTo: null }],
      Nexus: [{ label: "300cc 22cv", yearFrom: 2006, yearTo: null }],
      Fuoco: [{ label: "500cc 40cv", yearFrom: 2007, yearTo: null }],
    },
    Italjet: {
      Dragster: [{ label: "125cc 15cv", yearFrom: 1999, yearTo: null }],
    },
    Keeway: {
      RKS: [{ label: "125cc 11cv", yearFrom: 2018, yearTo: null }],
      K300: [{ label: "300cc 29cv", yearFrom: 2020, yearTo: null }],
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
      Scarabeo: [
        { label: "125cc 15cv", yearFrom: 2011, yearTo: null },
        { label: "300cc 22cv", yearFrom: 2011, yearTo: null },
      ],
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
      Hypermotard: [{ label: "950cc 114cv", yearFrom: 2019, yearTo: null }],
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
      Forza: [
        { label: "125cc 15cv", yearFrom: 2015, yearTo: null },
        { label: "350cc 29cv", yearFrom: 2021, yearTo: null },
      ],
      Vision: [{ label: "110cc 9cv", yearFrom: 2011, yearTo: null }],
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
      "Versys 1000": [{ label: "1043cc 120cv", yearFrom: 2019, yearTo: null }],
      "Vulcan S": [{ label: "649cc 61cv", yearFrom: 2015, yearTo: null }],
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
      Zip: [{ label: "50cc 3cv", yearFrom: 2010, yearTo: null }],
      Medley: [{ label: "125cc 12cv", yearFrom: 2016, yearTo: null }],
      X10: [{ label: "350cc 33cv", yearFrom: 2012, yearTo: 2018 }],
    },
    Rieju: {
      MRT: [{ label: "50cc 6cv", yearFrom: 2015, yearTo: null }],
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
      "GSX-S750": [{ label: "749cc 114cv", yearFrom: 2017, yearTo: null }],
      "GSX-S1000": [{ label: "999cc 152cv", yearFrom: 2015, yearTo: null }],
      Burgman: [
        { label: "400cc 34cv", yearFrom: 2017, yearTo: null },
        { label: "650cc 55cv", yearFrom: 2013, yearTo: null },
      ],
      SV650: [{ label: "645cc 75cv", yearFrom: 2016, yearTo: null }],
      "V-Strom 650": [{ label: "645cc 71cv", yearFrom: 2017, yearTo: null }],
      Hayabusa: [
        { label: "1340cc 190cv", yearFrom: 2021, yearTo: null },
        { label: "1299cc 197cv", yearFrom: 2008, yearTo: 2020 },
      ],
    },
    Sym: {
      Joymax: [{ label: "300cc 27cv", yearFrom: 2015, yearTo: null }],
      Fiddle: [{ label: "125cc 11cv", yearFrom: 2013, yearTo: null }],
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
      "50 Special": [{ label: "50cc 2cv", yearFrom: 1969, yearTo: 1983 }],
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
      "YZF-R7": [{ label: "689cc 73cv", yearFrom: 2021, yearTo: null }],
      "YZF-R125": [{ label: "125cc 15cv", yearFrom: 2019, yearTo: null }],
      Aerox: [{ label: "125cc 11cv", yearFrom: 2013, yearTo: null }],
      "XSR900": [{ label: "890cc 119cv", yearFrom: 2022, yearTo: null }],
      "Tracer 9": [{ label: "890cc 119cv", yearFrom: 2021, yearTo: null }],
      "Tenere 700": [{ label: "689cc 73cv", yearFrom: 2019, yearTo: null }],
      NMAX: [
        { label: "125cc 12cv", yearFrom: 2015, yearTo: null },
        { label: "155cc 15cv", yearFrom: 2020, yearTo: null },
      ],
      XMAX: [
        { label: "125cc 15cv", yearFrom: 2017, yearTo: null },
        { label: "300cc 28cv", yearFrom: 2017, yearTo: null },
      ],
      Tricity: [{ label: "125cc 12cv", yearFrom: 2014, yearTo: null }],
    },
  },
};

export function getEngineVariants(type: VehicleType, make: string, model: string): EngineVariant[] | null {
  const base = ENGINE_DATA[type]?.[make]?.[model];
  const extra = ENGINE_EXTENSIONS[type]?.[make]?.[model];
  if (!base && !extra) return null;

  // Le estensioni si sommano al dataset originale; a parità di sigla vince la voce già presente.
  const merged: EngineVariant[] = [];
  const seen = new Set<string>();
  for (const variant of [...(base || []), ...(extra || [])]) {
    if (seen.has(variant.label)) continue;
    seen.add(variant.label);
    merged.push(variant);
  }
  return merged;
}
