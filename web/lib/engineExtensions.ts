import type { EngineVariant, VehicleType } from "./types";

/**
 * Ampliamento del catalogo motorizzazioni, sullo stesso schema di CATALOGUE_EXTENSIONS per i
 * modelli: si aggiunge qui invece di gonfiare ENGINE_DATA, così il dataset originale resta
 * leggibile e le aggiunte sono isolate.
 *
 * Scritto a mano da conoscenza generale, come il resto del catalogo: non è l'elenco ufficiale ed
 * esaustivo di ogni allestimento e mercato, ma le motorizzazioni più diffuse in Europa di ciascun
 * modello. Dove non c'era una certezza ragionevole la voce è stata omessa: un menu con una
 * motorizzazione inventata è peggio di un campo di testo libero.
 *
 * Restano scoperti soprattutto i modelli di mercati extra-europei (Brasile, India, Giappone, Nord
 * America) e le auto d'anteguerra, dove la gamma motori è troppo frammentata per essere riassunta
 * senza rischiare di sbagliare.
 */
export const ENGINE_EXTENSIONS: Partial<
  Record<VehicleType, Record<string, Record<string, EngineVariant[]>>>
> = {
  auto: {
    Fiat: {
      "Grande Punto": [
        { label: "1.2 8v 65cv", yearFrom: 2005, yearTo: 2012 },
        { label: "1.4 8v 77cv", yearFrom: 2005, yearTo: 2012 },
        { label: "1.4 T-Jet 120cv", yearFrom: 2007, yearTo: 2012 },
        { label: "1.3 MultiJet 75cv", yearFrom: 2005, yearTo: 2012 },
        { label: "1.3 MultiJet 90cv", yearFrom: 2005, yearTo: 2012 },
        { label: "1.9 MultiJet 130cv", yearFrom: 2005, yearTo: 2009 },
      ],
      Scudo: [
        { label: "1.9 D 70cv", yearFrom: 1996, yearTo: 2006 },
        { label: "2.0 JTD 110cv", yearFrom: 2000, yearTo: 2006 },
        { label: "1.6 MultiJet 90cv", yearFrom: 2007, yearTo: 2016 },
        { label: "2.0 MultiJet 120cv", yearFrom: 2007, yearTo: 2016 },
        { label: "2.0 MultiJet 165cv", yearFrom: 2011, yearTo: 2016 },
      ],
      Freemont: [
        { label: "2.0 MultiJet 140cv", yearFrom: 2011, yearTo: 2016 },
        { label: "2.0 MultiJet 170cv", yearFrom: 2011, yearTo: 2016 },
        { label: "3.6 V6 280cv", yearFrom: 2011, yearTo: 2016 },
      ],
      Brava: [
        { label: "1.4 12v 80cv", yearFrom: 1995, yearTo: 2001 },
        { label: "1.6 16v 103cv", yearFrom: 1996, yearTo: 2001 },
        { label: "1.8 16v 113cv", yearFrom: 1995, yearTo: 2001 },
        { label: "1.9 JTD 105cv", yearFrom: 1999, yearTo: 2001 },
      ],
      Tempra: [
        { label: "1.4 i.e. 70cv", yearFrom: 1990, yearTo: 1996 },
        { label: "1.6 i.e. 90cv", yearFrom: 1990, yearTo: 1996 },
        { label: "1.8 i.e. 105cv", yearFrom: 1990, yearTo: 1996 },
        { label: "1.9 TD 90cv", yearFrom: 1990, yearTo: 1996 },
      ],
      Talento: [
        { label: "1.6 MultiJet 95cv", yearFrom: 2016, yearTo: 2021 },
        { label: "1.6 MultiJet 120cv", yearFrom: 2016, yearTo: 2021 },
        { label: "2.0 MultiJet 145cv", yearFrom: 2019, yearTo: 2021 },
      ],
      Fullback: [
        { label: "2.4 D 154cv", yearFrom: 2016, yearTo: 2019 },
        { label: "2.4 D 180cv", yearFrom: 2016, yearTo: 2019 },
      ],
      Linea: [
        { label: "1.4 77cv", yearFrom: 2007, yearTo: 2015 },
        { label: "1.4 T-Jet 120cv", yearFrom: 2007, yearTo: 2015 },
        { label: "1.3 MultiJet 95cv", yearFrom: 2007, yearTo: 2015 },
      ],
      "500e": [
        { label: "Elettrica 24 kWh 95cv", yearFrom: 2020, yearTo: null },
        { label: "Elettrica 42 kWh 118cv", yearFrom: 2020, yearTo: null },
      ],
      "600e": [{ label: "Elettrica 54 kWh 156cv", yearFrom: 2023, yearTo: null }],
      Regata: [
        { label: "1.3 70cv", yearFrom: 1983, yearTo: 1990 },
        { label: "1.5 85cv", yearFrom: 1983, yearTo: 1990 },
        { label: "1.9 D 65cv", yearFrom: 1984, yearTo: 1990 },
      ],
      "X1/9": [
        { label: "1.3 75cv", yearFrom: 1972, yearTo: 1978 },
        { label: "1.5 85cv", yearFrom: 1978, yearTo: 1989 },
      ],
      "128": [
        { label: "1.1 55cv", yearFrom: 1969, yearTo: 1985 },
        { label: "1.3 60cv", yearFrom: 1972, yearTo: 1985 },
      ],
      "132": [
        { label: "1.6 98cv", yearFrom: 1972, yearTo: 1981 },
        { label: "1.8 107cv", yearFrom: 1972, yearTo: 1981 },
        { label: "2.0 112cv", yearFrom: 1977, yearTo: 1981 },
      ],
      "850": [{ label: "0.8 34cv", yearFrom: 1964, yearTo: 1973 }],
      Campagnola: [
        { label: "1.9 D 65cv", yearFrom: 1974, yearTo: 1987 },
        { label: "2.0 benzina 80cv", yearFrom: 1974, yearTo: 1987 },
      ],
    },

    Volkswagen: {
      Bora: [
        { label: "1.6 16v 105cv", yearFrom: 1998, yearTo: 2005 },
        { label: "1.9 TDI 110cv", yearFrom: 1998, yearTo: 2005 },
        { label: "1.9 TDI 130cv", yearFrom: 2000, yearTo: 2005 },
        { label: "2.3 V5 170cv", yearFrom: 1999, yearTo: 2005 },
      ],
      CC: [
        { label: "1.8 TSI 160cv", yearFrom: 2008, yearTo: 2016 },
        { label: "2.0 TSI 210cv", yearFrom: 2008, yearTo: 2016 },
        { label: "2.0 TDI 140cv", yearFrom: 2008, yearTo: 2016 },
        { label: "2.0 TDI 177cv", yearFrom: 2011, yearTo: 2016 },
      ],
      "Golf Plus": [
        { label: "1.4 TSI 122cv", yearFrom: 2005, yearTo: 2014 },
        { label: "1.9 TDI 105cv", yearFrom: 2005, yearTo: 2009 },
        { label: "1.6 TDI 105cv", yearFrom: 2009, yearTo: 2014 },
        { label: "2.0 TDI 140cv", yearFrom: 2005, yearTo: 2014 },
      ],
      Transporter: [
        { label: "2.0 TDI 102cv", yearFrom: 2009, yearTo: null },
        { label: "2.0 TDI 140cv", yearFrom: 2009, yearTo: null },
        { label: "2.0 TDI 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 TDI 199cv", yearFrom: 2015, yearTo: null },
      ],
      T5: [
        { label: "1.9 TDI 102cv", yearFrom: 2003, yearTo: 2009 },
        { label: "2.5 TDI 130cv", yearFrom: 2003, yearTo: 2009 },
        { label: "2.0 TDI 140cv", yearFrom: 2009, yearTo: 2015 },
      ],
      T6: [
        { label: "2.0 TDI 102cv", yearFrom: 2015, yearTo: 2019 },
        { label: "2.0 TDI 150cv", yearFrom: 2015, yearTo: 2019 },
        { label: "2.0 TDI 204cv", yearFrom: 2015, yearTo: 2019 },
      ],
      "e-Up!": [
        { label: "Elettrica 18,7 kWh 82cv", yearFrom: 2013, yearTo: 2019 },
        { label: "Elettrica 32,3 kWh 83cv", yearFrom: 2019, yearTo: 2023 },
      ],
      "e-Golf": [
        { label: "Elettrica 24,2 kWh 115cv", yearFrom: 2014, yearTo: 2017 },
        { label: "Elettrica 35,8 kWh 136cv", yearFrom: 2017, yearTo: 2020 },
      ],
      "ID.5": [
        { label: "Elettrica 77 kWh 174cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica 77 kWh 204cv", yearFrom: 2021, yearTo: null },
        { label: "GTX 77 kWh 299cv", yearFrom: 2021, yearTo: null },
      ],
      "ID.7": [
        { label: "Elettrica 77 kWh 286cv", yearFrom: 2023, yearTo: null },
        { label: "Elettrica 86 kWh 286cv", yearFrom: 2023, yearTo: null },
      ],
      "ID. Buzz": [
        { label: "Elettrica 77 kWh 204cv", yearFrom: 2022, yearTo: null },
        { label: "Elettrica 86 kWh 286cv", yearFrom: 2023, yearTo: null },
      ],
      Vento: [
        { label: "1.8 75cv", yearFrom: 1992, yearTo: 1998 },
        { label: "2.0 115cv", yearFrom: 1992, yearTo: 1998 },
        { label: "1.9 TDI 90cv", yearFrom: 1993, yearTo: 1998 },
      ],
      Crafter: [
        { label: "2.0 TDI 140cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 TDI 177cv", yearFrom: 2016, yearTo: null },
      ],
      Caravelle: [
        { label: "2.0 TDI 150cv", yearFrom: 2015, yearTo: null },
        { label: "2.0 TDI 204cv", yearFrom: 2015, yearTo: null },
      ],
    },

    Renault: {
      Fluence: [
        { label: "1.6 16v 110cv", yearFrom: 2010, yearTo: 2016 },
        { label: "1.5 dCi 105cv", yearFrom: 2010, yearTo: 2016 },
        { label: "1.6 dCi 130cv", yearFrom: 2012, yearTo: 2016 },
      ],
      Master: [
        { label: "2.3 dCi 110cv", yearFrom: 2010, yearTo: null },
        { label: "2.3 dCi 135cv", yearFrom: 2010, yearTo: null },
        { label: "2.3 dCi 165cv", yearFrom: 2014, yearTo: null },
      ],
      Express: [
        { label: "1.3 TCe 100cv", yearFrom: 2021, yearTo: null },
        { label: "1.5 Blue dCi 95cv", yearFrom: 2021, yearTo: null },
      ],
      Safrane: [
        { label: "2.0 16v 136cv", yearFrom: 1992, yearTo: 2000 },
        { label: "2.2 dT 115cv", yearFrom: 1993, yearTo: 2000 },
        { label: "3.0 V6 170cv", yearFrom: 1992, yearTo: 2000 },
      ],
      "Vel Satis": [
        { label: "2.0 T 165cv", yearFrom: 2002, yearTo: 2009 },
        { label: "2.2 dCi 150cv", yearFrom: 2002, yearTo: 2009 },
        { label: "3.0 dCi 181cv", yearFrom: 2002, yearTo: 2009 },
      ],
      "Grand Espace": [
        { label: "2.0 T 170cv", yearFrom: 2002, yearTo: 2014 },
        { label: "2.0 dCi 150cv", yearFrom: 2002, yearTo: 2014 },
        { label: "3.0 dCi 181cv", yearFrom: 2002, yearTo: 2010 },
      ],
      Latitude: [
        { label: "1.5 dCi 110cv", yearFrom: 2010, yearTo: 2015 },
        { label: "2.0 dCi 150cv", yearFrom: 2010, yearTo: 2015 },
      ],
      Avantime: [
        { label: "2.0 16v Turbo 165cv", yearFrom: 2001, yearTo: 2003 },
        { label: "3.0 V6 210cv", yearFrom: 2001, yearTo: 2003 },
      ],
      Wind: [
        { label: "1.2 TCe 100cv", yearFrom: 2010, yearTo: 2013 },
        { label: "1.6 16v 133cv", yearFrom: 2010, yearTo: 2013 },
      ],
      Fuego: [
        { label: "1.4 64cv", yearFrom: 1980, yearTo: 1986 },
        { label: "2.0 110cv", yearFrom: 1980, yearTo: 1986 },
        { label: "2.1 TD 88cv", yearFrom: 1982, yearTo: 1986 },
      ],
      "21": [
        { label: "1.7 90cv", yearFrom: 1986, yearTo: 1994 },
        { label: "2.0 120cv", yearFrom: 1986, yearTo: 1994 },
        { label: "2.1 TD 88cv", yearFrom: 1986, yearTo: 1994 },
      ],
    },

    Ford: {
      "B-Max": [
        { label: "1.0 EcoBoost 100cv", yearFrom: 2012, yearTo: 2017 },
        { label: "1.0 EcoBoost 120cv", yearFrom: 2012, yearTo: 2017 },
        { label: "1.4 90cv", yearFrom: 2012, yearTo: 2017 },
        { label: "1.5 TDCi 95cv", yearFrom: 2012, yearTo: 2017 },
      ],
      "Grand C-Max": [
        { label: "1.0 EcoBoost 125cv", yearFrom: 2012, yearTo: 2019 },
        { label: "1.6 TDCi 115cv", yearFrom: 2010, yearTo: 2015 },
        { label: "2.0 TDCi 150cv", yearFrom: 2010, yearTo: 2019 },
      ],
      Edge: [
        { label: "2.0 TDCi 180cv", yearFrom: 2016, yearTo: 2020 },
        { label: "2.0 TDCi 210cv", yearFrom: 2016, yearTo: 2020 },
      ],
      "Transit Connect": [
        { label: "1.5 TDCi 100cv", yearFrom: 2013, yearTo: null },
        { label: "1.5 TDCi 120cv", yearFrom: 2013, yearTo: null },
        { label: "1.8 TDCi 90cv", yearFrom: 2002, yearTo: 2013 },
      ],
      "Transit Custom": [
        { label: "2.0 EcoBlue 105cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 EcoBlue 130cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 EcoBlue 170cv", yearFrom: 2016, yearTo: null },
        { label: "2.2 TDCi 125cv", yearFrom: 2012, yearTo: 2016 },
      ],
      "Tourneo Connect": [
        { label: "1.5 TDCi 100cv", yearFrom: 2013, yearTo: null },
        { label: "1.5 TDCi 120cv", yearFrom: 2013, yearTo: null },
      ],
      "Tourneo Custom": [
        { label: "2.0 EcoBlue 130cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 EcoBlue 170cv", yearFrom: 2016, yearTo: null },
      ],
      "Mustang Mach-E": [
        { label: "Elettrica 70 kWh 269cv", yearFrom: 2020, yearTo: null },
        { label: "Elettrica 91 kWh 294cv", yearFrom: 2020, yearTo: null },
        { label: "GT 91 kWh 487cv", yearFrom: 2021, yearTo: null },
      ],
      Orion: [
        { label: "1.4 75cv", yearFrom: 1990, yearTo: 1993 },
        { label: "1.6 90cv", yearFrom: 1990, yearTo: 1993 },
        { label: "1.8 D 60cv", yearFrom: 1990, yearTo: 1993 },
      ],
      Probe: [
        { label: "2.0 16v 115cv", yearFrom: 1993, yearTo: 1998 },
        { label: "2.5 V6 163cv", yearFrom: 1993, yearTo: 1998 },
      ],
      Granada: [
        { label: "2.0 101cv", yearFrom: 1977, yearTo: 1985 },
        { label: "2.8 V6 150cv", yearFrom: 1977, yearTo: 1985 },
      ],
      Capri: [
        { label: "1.6 72cv", yearFrom: 1969, yearTo: 1986 },
        { label: "2.0 101cv", yearFrom: 1972, yearTo: 1986 },
        { label: "2.8 V6 160cv", yearFrom: 1981, yearTo: 1986 },
      ],
      Taunus: [
        { label: "1.6 72cv", yearFrom: 1970, yearTo: 1982 },
        { label: "2.0 101cv", yearFrom: 1970, yearTo: 1982 },
      ],
    },

    Opel: {
      Omega: [
        { label: "2.0 16v 136cv", yearFrom: 1994, yearTo: 2003 },
        { label: "2.2 16v 144cv", yearFrom: 1999, yearTo: 2003 },
        { label: "2.5 TD 131cv", yearFrom: 1994, yearTo: 2001 },
        { label: "2.2 DTI 125cv", yearFrom: 2000, yearTo: 2003 },
        { label: "3.0 V6 211cv", yearFrom: 1994, yearTo: 2003 },
      ],
      Signum: [
        { label: "1.8 16v 122cv", yearFrom: 2003, yearTo: 2008 },
        { label: "1.9 CDTI 120cv", yearFrom: 2004, yearTo: 2008 },
        { label: "1.9 CDTI 150cv", yearFrom: 2004, yearTo: 2008 },
        { label: "3.0 V6 CDTI 177cv", yearFrom: 2003, yearTo: 2008 },
      ],
      Vivaro: [
        { label: "1.9 DTI 82cv", yearFrom: 2001, yearTo: 2006 },
        { label: "2.0 CDTI 115cv", yearFrom: 2006, yearTo: 2014 },
        { label: "1.6 CDTI 120cv", yearFrom: 2014, yearTo: 2019 },
        { label: "2.0 Diesel 122cv", yearFrom: 2019, yearTo: null },
        { label: "2.0 Diesel 177cv", yearFrom: 2019, yearTo: null },
      ],
      Movano: [
        { label: "2.3 CDTI 125cv", yearFrom: 2010, yearTo: null },
        { label: "2.3 CDTI 145cv", yearFrom: 2010, yearTo: null },
        { label: "2.2 Diesel 140cv", yearFrom: 2021, yearTo: null },
      ],
      Cascada: [
        { label: "1.4 Turbo 140cv", yearFrom: 2013, yearTo: 2019 },
        { label: "1.6 Turbo 170cv", yearFrom: 2013, yearTo: 2019 },
        { label: "2.0 CDTI 165cv", yearFrom: 2013, yearTo: 2019 },
      ],
      Kadett: [
        { label: "1.3 60cv", yearFrom: 1984, yearTo: 1991 },
        { label: "1.6 75cv", yearFrom: 1984, yearTo: 1991 },
        { label: "2.0 GSi 150cv", yearFrom: 1987, yearTo: 1991 },
        { label: "1.7 D 57cv", yearFrom: 1984, yearTo: 1991 },
      ],
      Ascona: [
        { label: "1.6 75cv", yearFrom: 1981, yearTo: 1988 },
        { label: "1.8 100cv", yearFrom: 1981, yearTo: 1988 },
        { label: "2.0 130cv", yearFrom: 1984, yearTo: 1988 },
      ],
      Manta: [
        { label: "1.8 90cv", yearFrom: 1975, yearTo: 1988 },
        { label: "2.0 100cv", yearFrom: 1975, yearTo: 1988 },
      ],
      Rekord: [
        { label: "1.8 90cv", yearFrom: 1977, yearTo: 1986 },
        { label: "2.0 100cv", yearFrom: 1977, yearTo: 1986 },
        { label: "2.3 D 65cv", yearFrom: 1978, yearTo: 1986 },
      ],
      Ampera: [{ label: "Ibrida plug-in 150cv", yearFrom: 2011, yearTo: 2016 }],
    },

    "Alfa Romeo": {
      Alfasud: [
        { label: "1.2 63cv", yearFrom: 1972, yearTo: 1983 },
        { label: "1.3 79cv", yearFrom: 1977, yearTo: 1983 },
        { label: "1.5 Ti 95cv", yearFrom: 1978, yearTo: 1983 },
      ],
      Alfetta: [
        { label: "1.6 109cv", yearFrom: 1972, yearTo: 1984 },
        { label: "1.8 122cv", yearFrom: 1972, yearTo: 1984 },
        { label: "2.0 130cv", yearFrom: 1977, yearTo: 1984 },
        { label: "2.4 TD 110cv", yearFrom: 1979, yearTo: 1984 },
      ],
      Sprint: [
        { label: "1.3 79cv", yearFrom: 1976, yearTo: 1989 },
        { label: "1.5 95cv", yearFrom: 1978, yearTo: 1989 },
        { label: "1.7 118cv", yearFrom: 1987, yearTo: 1989 },
      ],
      "90": [
        { label: "2.0 128cv", yearFrom: 1984, yearTo: 1987 },
        { label: "2.5 V6 158cv", yearFrom: 1984, yearTo: 1987 },
        { label: "2.4 TD 110cv", yearFrom: 1984, yearTo: 1987 },
      ],
      "6": [
        { label: "2.0 V6 135cv", yearFrom: 1979, yearTo: 1986 },
        { label: "2.5 V6 158cv", yearFrom: 1979, yearTo: 1986 },
      ],
      Arna: [
        { label: "1.2 63cv", yearFrom: 1983, yearTo: 1987 },
        { label: "1.3 86cv", yearFrom: 1985, yearTo: 1987 },
      ],
      Montreal: [{ label: "2.6 V8 200cv", yearFrom: 1970, yearTo: 1977 }],
      SZ: [{ label: "3.0 V6 210cv", yearFrom: 1989, yearTo: 1991 }],
      RZ: [{ label: "3.0 V6 210cv", yearFrom: 1992, yearTo: 1994 }],
      "156 Crosswagon": [{ label: "1.9 JTD 150cv", yearFrom: 2004, yearTo: 2007 }],
      "8C Competizione": [{ label: "4.7 V8 450cv", yearFrom: 2007, yearTo: 2010 }],
    },

    Lancia: {
      "Delta Integrale": [
        { label: "2.0 16v Turbo 200cv", yearFrom: 1989, yearTo: 1994 },
        { label: "2.0 16v Turbo Evo 210cv", yearFrom: 1991, yearTo: 1994 },
        { label: "2.0 8v Turbo 185cv", yearFrom: 1987, yearTo: 1989 },
      ],
      Prisma: [
        { label: "1.3 75cv", yearFrom: 1982, yearTo: 1989 },
        { label: "1.6 105cv", yearFrom: 1982, yearTo: 1989 },
        { label: "1.9 TD 80cv", yearFrom: 1986, yearTo: 1989 },
      ],
      Trevi: [
        { label: "1.6 100cv", yearFrom: 1980, yearTo: 1984 },
        { label: "2.0 115cv", yearFrom: 1980, yearTo: 1984 },
      ],
      Phedra: [
        { label: "2.0 JTD 109cv", yearFrom: 2002, yearTo: 2010 },
        { label: "2.2 JTD 128cv", yearFrom: 2002, yearTo: 2010 },
        { label: "3.0 V6 204cv", yearFrom: 2002, yearTo: 2006 },
      ],
      Zeta: [
        { label: "1.9 TD 92cv", yearFrom: 1995, yearTo: 2002 },
        { label: "2.0 JTD 109cv", yearFrom: 1999, yearTo: 2002 },
        { label: "2.0 123cv", yearFrom: 1995, yearTo: 2002 },
      ],
      Voyager: [
        { label: "2.8 CRD 178cv", yearFrom: 2011, yearTo: 2015 },
        { label: "3.6 V6 283cv", yearFrom: 2011, yearTo: 2015 },
      ],
      Y10: [
        { label: "1.0 Fire 45cv", yearFrom: 1985, yearTo: 1995 },
        { label: "1.1 Fire 50cv", yearFrom: 1989, yearTo: 1995 },
        { label: "1.3 Turbo 85cv", yearFrom: 1987, yearTo: 1992 },
      ],
      Montecarlo: [{ label: "2.0 120cv", yearFrom: 1975, yearTo: 1981 }],
      Aurelia: [
        { label: "2.0 V6 75cv", yearFrom: 1950, yearTo: 1958 },
        { label: "2.5 V6 118cv", yearFrom: 1953, yearTo: 1958 },
      ],
      Flaminia: [
        { label: "2.5 V6 102cv", yearFrom: 1957, yearTo: 1970 },
        { label: "2.8 V6 129cv", yearFrom: 1963, yearTo: 1970 },
      ],
    },

    Seat: {
      Toledo: [
        { label: "1.6 102cv", yearFrom: 1999, yearTo: 2009 },
        { label: "1.9 TDI 110cv", yearFrom: 1999, yearTo: 2004 },
        { label: "2.0 TDI 140cv", yearFrom: 2004, yearTo: 2009 },
        { label: "1.2 TSI 105cv", yearFrom: 2012, yearTo: 2019 },
        { label: "1.6 TDI 105cv", yearFrom: 2012, yearTo: 2019 },
      ],
      Cordoba: [
        { label: "1.4 16v 100cv", yearFrom: 1999, yearTo: 2009 },
        { label: "1.9 TDI 100cv", yearFrom: 1999, yearTo: 2009 },
        { label: "1.4 TDI 80cv", yearFrom: 2002, yearTo: 2009 },
      ],
      Exeo: [
        { label: "1.8 TSI 160cv", yearFrom: 2008, yearTo: 2013 },
        { label: "2.0 TDI 143cv", yearFrom: 2008, yearTo: 2013 },
        { label: "2.0 TDI 170cv", yearFrom: 2008, yearTo: 2013 },
      ],
      Marbella: [
        { label: "0.9 40cv", yearFrom: 1986, yearTo: 1998 },
        { label: "1.0 45cv", yearFrom: 1986, yearTo: 1998 },
      ],
      Malaga: [
        { label: "1.2 63cv", yearFrom: 1985, yearTo: 1991 },
        { label: "1.5 85cv", yearFrom: 1985, yearTo: 1991 },
      ],
      Arosa: [
        { label: "1.0 50cv", yearFrom: 1997, yearTo: 2004 },
        { label: "1.4 60cv", yearFrom: 1997, yearTo: 2004 },
        { label: "1.7 SDI 60cv", yearFrom: 1997, yearTo: 2004 },
      ],
      Inca: [
        { label: "1.4 60cv", yearFrom: 1995, yearTo: 2003 },
        { label: "1.9 D 64cv", yearFrom: 1995, yearTo: 2003 },
      ],
    },

    "Mercedes-Benz": {
      ML: [
        { label: "270 CDI 163cv", yearFrom: 1999, yearTo: 2005 },
        { label: "320 CDI 224cv", yearFrom: 2005, yearTo: 2011 },
        { label: "350 CDI 231cv", yearFrom: 2009, yearTo: 2011 },
        { label: "500 V8 306cv", yearFrom: 1999, yearTo: 2011 },
      ],
      GLK: [
        { label: "220 CDI 170cv", yearFrom: 2008, yearTo: 2015 },
        { label: "250 CDI 204cv", yearFrom: 2009, yearTo: 2015 },
        { label: "350 CDI 231cv", yearFrom: 2008, yearTo: 2015 },
      ],
      SLK: [
        { label: "200 Kompressor 163cv", yearFrom: 1996, yearTo: 2016 },
        { label: "250 CDI 204cv", yearFrom: 2011, yearTo: 2016 },
        { label: "350 V6 306cv", yearFrom: 2004, yearTo: 2016 },
      ],
      SL: [
        { label: "350 V6 316cv", yearFrom: 2001, yearTo: 2020 },
        { label: "500 V8 388cv", yearFrom: 2001, yearTo: 2020 },
        { label: "55 AMG 500cv", yearFrom: 2002, yearTo: 2012 },
      ],
      R: [
        { label: "280 CDI 190cv", yearFrom: 2005, yearTo: 2013 },
        { label: "320 CDI 224cv", yearFrom: 2005, yearTo: 2013 },
      ],
      Citan: [
        { label: "109 CDI 95cv", yearFrom: 2012, yearTo: null },
        { label: "111 CDI 116cv", yearFrom: 2012, yearTo: null },
      ],
      Vaneo: [
        { label: "1.6 82cv", yearFrom: 2002, yearTo: 2005 },
        { label: "1.7 CDI 91cv", yearFrom: 2002, yearTo: 2005 },
      ],
      W123: [
        { label: "200 D 60cv", yearFrom: 1976, yearTo: 1985 },
        { label: "240 D 72cv", yearFrom: 1976, yearTo: 1985 },
        { label: "230 E 136cv", yearFrom: 1980, yearTo: 1985 },
      ],
      W124: [
        { label: "200 D 75cv", yearFrom: 1985, yearTo: 1995 },
        { label: "250 D 94cv", yearFrom: 1985, yearTo: 1995 },
        { label: "300 D 113cv", yearFrom: 1985, yearTo: 1995 },
        { label: "230 E 132cv", yearFrom: 1985, yearTo: 1993 },
      ],
    },

    Toyota: {
      "Corolla Verso": [
        { label: "1.6 VVT-i 110cv", yearFrom: 2004, yearTo: 2009 },
        { label: "1.8 VVT-i 129cv", yearFrom: 2004, yearTo: 2009 },
        { label: "2.2 D-4D 136cv", yearFrom: 2004, yearTo: 2009 },
      ],
      Proace: [
        { label: "1.6 D-4D 115cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 D-4D 122cv", yearFrom: 2016, yearTo: null },
        { label: "2.0 D-4D 177cv", yearFrom: 2016, yearTo: null },
      ],
      "Proace City": [
        { label: "1.5 D-4D 100cv", yearFrom: 2019, yearTo: null },
        { label: "1.5 D-4D 130cv", yearFrom: 2019, yearTo: null },
      ],
      "GR Yaris": [
        { label: "1.6 Turbo 261cv", yearFrom: 2020, yearTo: null },
        { label: "1.6 Turbo 280cv", yearFrom: 2024, yearTo: null },
      ],
      bZ4X: [{ label: "Elettrica 71 kWh 204cv", yearFrom: 2022, yearTo: null }],
      "Land Cruiser Prado": [
        { label: "3.0 D-4D 173cv", yearFrom: 2002, yearTo: 2009 },
        { label: "2.8 D-4D 177cv", yearFrom: 2015, yearTo: null },
      ],
      Mirai: [{ label: "Idrogeno 182cv", yearFrom: 2020, yearTo: null }],
      Starlet: [
        { label: "1.3 75cv", yearFrom: 1996, yearTo: 1999 },
        { label: "1.3 16v 88cv", yearFrom: 1996, yearTo: 1999 },
      ],
      Previa: [
        { label: "2.0 D-4D 116cv", yearFrom: 2001, yearTo: 2006 },
        { label: "2.4 VVT-i 156cv", yearFrom: 2000, yearTo: 2006 },
      ],
    },

    Nissan: {
      Almera: [
        { label: "1.5 90cv", yearFrom: 2000, yearTo: 2006 },
        { label: "1.8 114cv", yearFrom: 2000, yearTo: 2006 },
        { label: "1.5 dCi 82cv", yearFrom: 2003, yearTo: 2006 },
        { label: "2.2 dCi 112cv", yearFrom: 2000, yearTo: 2006 },
      ],
      Cube: [{ label: "1.6 110cv", yearFrom: 2009, yearTo: 2011 }],
      March: [
        { label: "1.0 68cv", yearFrom: 2002, yearTo: 2010 },
        { label: "1.2 80cv", yearFrom: 2002, yearTo: 2010 },
      ],
      Primastar: [
        { label: "1.9 dCi 100cv", yearFrom: 2002, yearTo: 2014 },
        { label: "2.0 dCi 115cv", yearFrom: 2006, yearTo: 2014 },
        { label: "2.0 dCi 150cv", yearFrom: 2021, yearTo: null },
      ],
      NV200: [
        { label: "1.5 dCi 90cv", yearFrom: 2009, yearTo: 2021 },
        { label: "1.5 dCi 110cv", yearFrom: 2014, yearTo: 2021 },
      ],
      Interstar: [
        { label: "2.5 dCi 100cv", yearFrom: 2002, yearTo: 2010 },
        { label: "2.5 dCi 145cv", yearFrom: 2002, yearTo: 2010 },
      ],
      Serena: [
        { label: "2.0 126cv", yearFrom: 1992, yearTo: 2001 },
        { label: "2.3 D 75cv", yearFrom: 1992, yearTo: 2001 },
      ],
      Townstar: [
        { label: "1.3 TCe 130cv", yearFrom: 2022, yearTo: null },
        { label: "1.5 dCi 95cv", yearFrom: 2022, yearTo: null },
      ],
    },

    Volvo: {
      "340": [
        { label: "1.4 64cv", yearFrom: 1976, yearTo: 1991 },
        { label: "1.7 90cv", yearFrom: 1985, yearTo: 1991 },
      ],
      "440": [
        { label: "1.8 90cv", yearFrom: 1988, yearTo: 1996 },
        { label: "2.0 110cv", yearFrom: 1991, yearTo: 1996 },
      ],
      "460": [
        { label: "1.8 90cv", yearFrom: 1989, yearTo: 1996 },
        { label: "2.0 110cv", yearFrom: 1991, yearTo: 1996 },
      ],
      "480": [
        { label: "1.7 102cv", yearFrom: 1986, yearTo: 1995 },
        { label: "2.0 110cv", yearFrom: 1992, yearTo: 1995 },
      ],
      "740": [
        { label: "2.3 114cv", yearFrom: 1984, yearTo: 1992 },
        { label: "2.4 TD 109cv", yearFrom: 1984, yearTo: 1992 },
      ],
      "850": [
        { label: "2.0 126cv", yearFrom: 1991, yearTo: 1997 },
        { label: "2.5 170cv", yearFrom: 1991, yearTo: 1997 },
        { label: "2.5 TDI 140cv", yearFrom: 1995, yearTo: 1997 },
      ],
      "940": [
        { label: "2.3 116cv", yearFrom: 1990, yearTo: 1998 },
        { label: "2.4 TD 122cv", yearFrom: 1990, yearTo: 1998 },
      ],
      "960": [
        { label: "2.5 170cv", yearFrom: 1990, yearTo: 1997 },
        { label: "3.0 204cv", yearFrom: 1990, yearTo: 1997 },
      ],
      S70: [
        { label: "2.0 126cv", yearFrom: 1996, yearTo: 2000 },
        { label: "2.5 TDI 140cv", yearFrom: 1996, yearTo: 2000 },
        { label: "2.3 T5 250cv", yearFrom: 1996, yearTo: 2000 },
      ],
      C40: [
        { label: "Elettrica 69 kWh 238cv", yearFrom: 2021, yearTo: null },
        { label: "Elettrica 78 kWh 408cv", yearFrom: 2021, yearTo: null },
      ],
      "V40 Cross Country": [
        { label: "2.0 D2 120cv", yearFrom: 2012, yearTo: 2019 },
        { label: "2.0 D3 150cv", yearFrom: 2012, yearTo: 2019 },
        { label: "T3 152cv", yearFrom: 2015, yearTo: 2019 },
      ],
    },

    Mazda: {
      "323": [
        { label: "1.3 72cv", yearFrom: 1994, yearTo: 2003 },
        { label: "1.5 88cv", yearFrom: 1994, yearTo: 2003 },
        { label: "2.0 DiTD 101cv", yearFrom: 1998, yearTo: 2003 },
      ],
      "121": [
        { label: "1.3 54cv", yearFrom: 1996, yearTo: 2002 },
        { label: "1.25 75cv", yearFrom: 1996, yearTo: 2002 },
      ],
      Premacy: [
        { label: "1.8 100cv", yearFrom: 1999, yearTo: 2005 },
        { label: "2.0 DiTD 100cv", yearFrom: 1999, yearTo: 2005 },
      ],
      "MX-3": [
        { label: "1.6 88cv", yearFrom: 1991, yearTo: 1998 },
        { label: "1.8 V6 133cv", yearFrom: 1991, yearTo: 1998 },
      ],
      "MX-6": [
        { label: "2.0 16v 115cv", yearFrom: 1992, yearTo: 1997 },
        { label: "2.5 V6 165cv", yearFrom: 1992, yearTo: 1997 },
      ],
      "RX-7": [
        { label: "1.3 Wankel Turbo 239cv", yearFrom: 1992, yearTo: 2002 },
        { label: "1.3 Wankel Turbo 280cv", yearFrom: 1992, yearTo: 2002 },
      ],
      "CX-7": [
        { label: "2.3 Turbo 260cv", yearFrom: 2006, yearTo: 2012 },
        { label: "2.2 MZR-CD 173cv", yearFrom: 2009, yearTo: 2012 },
      ],
      Mazda5: [
        { label: "1.8 115cv", yearFrom: 2005, yearTo: 2015 },
        { label: "2.0 146cv", yearFrom: 2005, yearTo: 2015 },
        { label: "1.6 MZ-CD 115cv", yearFrom: 2010, yearTo: 2015 },
      ],
    },

    Honda: {
      City: [
        { label: "1.4 100cv", yearFrom: 2002, yearTo: 2008 },
        { label: "1.5 120cv", yearFrom: 2008, yearTo: null },
      ],
      "CR-Z": [{ label: "1.5 IMA Ibrida 124cv", yearFrom: 2010, yearTo: 2016 }],
      Stream: [
        { label: "1.7 125cv", yearFrom: 2001, yearTo: 2006 },
        { label: "2.0 156cv", yearFrom: 2001, yearTo: 2006 },
      ],
      Legend: [
        { label: "3.5 V6 295cv", yearFrom: 2006, yearTo: 2012 },
        { label: "3.5 V6 Ibrida 381cv", yearFrom: 2014, yearTo: 2021 },
      ],
      NSX: [
        { label: "3.0 V6 274cv", yearFrom: 1990, yearTo: 2005 },
        { label: "3.5 V6 Ibrida 581cv", yearFrom: 2016, yearTo: 2022 },
      ],
    },

    Suzuki: {
      Alto: [
        { label: "1.0 68cv", yearFrom: 2009, yearTo: 2014 },
        { label: "1.1 63cv", yearFrom: 2002, yearTo: 2006 },
      ],
      Celerio: [{ label: "1.0 68cv", yearFrom: 2014, yearTo: 2019 }],
      Splash: [
        { label: "1.0 65cv", yearFrom: 2008, yearTo: 2015 },
        { label: "1.2 86cv", yearFrom: 2008, yearTo: 2015 },
        { label: "1.3 DDiS 75cv", yearFrom: 2008, yearTo: 2015 },
      ],
      Samurai: [
        { label: "1.3 70cv", yearFrom: 1988, yearTo: 2004 },
        { label: "1.9 D 64cv", yearFrom: 1998, yearTo: 2004 },
      ],
      Liana: [
        { label: "1.6 107cv", yearFrom: 2001, yearTo: 2007 },
        { label: "1.4 DDiS 90cv", yearFrom: 2004, yearTo: 2007 },
      ],
      "Wagon R+": [
        { label: "1.0 65cv", yearFrom: 1997, yearTo: 2006 },
        { label: "1.3 76cv", yearFrom: 2000, yearTo: 2006 },
      ],
      Across: [{ label: "2.5 Plug-in Hybrid 306cv", yearFrom: 2020, yearTo: null }],
      Swace: [{ label: "1.8 Hybrid 122cv", yearFrom: 2020, yearTo: null }],
    },

    Kia: {
      Cerato: [
        { label: "1.6 105cv", yearFrom: 2004, yearTo: 2009 },
        { label: "2.0 CRDi 113cv", yearFrom: 2004, yearTo: 2009 },
      ],
      Magentis: [
        { label: "2.0 144cv", yearFrom: 2001, yearTo: 2010 },
        { label: "2.0 CRDi 140cv", yearFrom: 2006, yearTo: 2010 },
      ],
      Sedona: [
        { label: "2.9 CRDi 185cv", yearFrom: 2006, yearTo: 2014 },
        { label: "2.2 CRDi 197cv", yearFrom: 2010, yearTo: 2014 },
      ],
      Rondo: [
        { label: "2.0 144cv", yearFrom: 2007, yearTo: 2012 },
        { label: "2.0 CRDi 140cv", yearFrom: 2007, yearTo: 2012 },
      ],
      Pride: [
        { label: "1.3 64cv", yearFrom: 1990, yearTo: 2001 },
        { label: "1.3 75cv", yearFrom: 1995, yearTo: 2001 },
      ],
      Seltos: [
        { label: "1.6 T-GDI 177cv", yearFrom: 2019, yearTo: null },
        { label: "1.6 CRDi 136cv", yearFrom: 2019, yearTo: null },
      ],
    },

    Hyundai: {
      Accent: [
        { label: "1.3 75cv", yearFrom: 1994, yearTo: 2005 },
        { label: "1.5 90cv", yearFrom: 1994, yearTo: 2005 },
        { label: "1.5 CRDi 82cv", yearFrom: 2002, yearTo: 2005 },
      ],
      Elantra: [
        { label: "1.6 105cv", yearFrom: 2000, yearTo: 2010 },
        { label: "2.0 CRDi 113cv", yearFrom: 2000, yearTo: 2010 },
      ],
      Sonata: [
        { label: "2.0 136cv", yearFrom: 1998, yearTo: 2010 },
        { label: "2.0 CRDi 140cv", yearFrom: 2005, yearTo: 2010 },
      ],
      Lantra: [
        { label: "1.6 114cv", yearFrom: 1995, yearTo: 2000 },
        { label: "1.8 128cv", yearFrom: 1995, yearTo: 2000 },
      ],
      Trajet: [
        { label: "2.0 CRDi 113cv", yearFrom: 2000, yearTo: 2008 },
        { label: "2.0 140cv", yearFrom: 2000, yearTo: 2008 },
      ],
      "i20 N": [{ label: "1.6 T-GDI 204cv", yearFrom: 2021, yearTo: null }],
      "i30 N": [
        { label: "2.0 T-GDI 250cv", yearFrom: 2017, yearTo: null },
        { label: "2.0 T-GDI 280cv", yearFrom: 2017, yearTo: null },
      ],
      Inster: [
        { label: "Elettrica 42 kWh 97cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica 49 kWh 115cv", yearFrom: 2024, yearTo: null },
      ],
    },

    Dacia: {
      "Sandero Stepway": [
        { label: "0.9 TCe 90cv", yearFrom: 2012, yearTo: 2020 },
        { label: "1.0 TCe 90cv", yearFrom: 2020, yearTo: null },
        { label: "1.5 dCi 90cv", yearFrom: 2012, yearTo: 2020 },
        { label: "1.0 TCe ECO-G 100cv", yearFrom: 2020, yearTo: null },
      ],
      "Logan MCV": [
        { label: "1.2 16v 75cv", yearFrom: 2007, yearTo: 2020 },
        { label: "0.9 TCe 90cv", yearFrom: 2013, yearTo: 2020 },
        { label: "1.5 dCi 90cv", yearFrom: 2007, yearTo: 2020 },
      ],
      "Pick-Up": [
        { label: "1.6 84cv", yearFrom: 2007, yearTo: 2012 },
        { label: "1.5 dCi 85cv", yearFrom: 2007, yearTo: 2012 },
      ],
      Solenza: [
        { label: "1.4 75cv", yearFrom: 2003, yearTo: 2005 },
        { label: "1.9 D 63cv", yearFrom: 2003, yearTo: 2005 },
      ],
      Bigster: [
        { label: "1.2 Hybrid 155cv", yearFrom: 2025, yearTo: null },
        { label: "1.2 mild hybrid 140cv", yearFrom: 2025, yearTo: null },
      ],
    },

    Mini: {
      One: [
        { label: "1.6 90cv", yearFrom: 2001, yearTo: 2006 },
        { label: "1.4 95cv", yearFrom: 2006, yearTo: 2013 },
        { label: "1.2 102cv", yearFrom: 2014, yearTo: 2021 },
      ],
      Coupe: [
        { label: "Cooper 1.6 122cv", yearFrom: 2011, yearTo: 2015 },
        { label: "Cooper S 1.6 184cv", yearFrom: 2011, yearTo: 2015 },
        { label: "John Cooper Works 211cv", yearFrom: 2011, yearTo: 2015 },
      ],
      Roadster: [
        { label: "Cooper 1.6 122cv", yearFrom: 2012, yearTo: 2015 },
        { label: "Cooper S 1.6 184cv", yearFrom: 2012, yearTo: 2015 },
      ],
      Aceman: [
        { label: "Elettrica 42,5 kWh 184cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica 54,2 kWh 218cv", yearFrom: 2024, yearTo: null },
      ],
    },

    Smart: {
      Roadster: [{ label: "0.7 Turbo 82cv", yearFrom: 2003, yearTo: 2006 }],
      "#1": [
        { label: "Elettrica 66 kWh 272cv", yearFrom: 2022, yearTo: null },
        { label: "Brabus 66 kWh 428cv", yearFrom: 2023, yearTo: null },
      ],
      "#3": [
        { label: "Elettrica 66 kWh 272cv", yearFrom: 2023, yearTo: null },
        { label: "Brabus 66 kWh 428cv", yearFrom: 2023, yearTo: null },
      ],
    },

    Cupra: {
      Tavascan: [
        { label: "Elettrica 77 kWh 286cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica 77 kWh 340cv", yearFrom: 2024, yearTo: null },
      ],
      Terramar: [
        { label: "1.5 eTSI 150cv", yearFrom: 2024, yearTo: null },
        { label: "2.0 TSI 265cv", yearFrom: 2024, yearTo: null },
      ],
    },

    Tesla: {
      Cybertruck: [
        { label: "Elettrica AWD 600cv", yearFrom: 2023, yearTo: null },
        { label: "Cyberbeast 845cv", yearFrom: 2023, yearTo: null },
      ],
    },

    Škoda: {
      Felicia: [
        { label: "1.3 54cv", yearFrom: 1994, yearTo: 2001 },
        { label: "1.6 75cv", yearFrom: 1996, yearTo: 2001 },
        { label: "1.9 D 64cv", yearFrom: 1995, yearTo: 2001 },
      ],
      Favorit: [{ label: "1.3 54cv", yearFrom: 1987, yearTo: 1995 }],
      Elroq: [
        { label: "Elettrica 55 kWh 170cv", yearFrom: 2024, yearTo: null },
        { label: "Elettrica 82 kWh 286cv", yearFrom: 2024, yearTo: null },
      ],
    },
  },

  moto: {
    Ducati: {
      Monster: [
        { label: "797 803cc 73cv", yearFrom: 2017, yearTo: 2020 },
        { label: "937 937cc 111cv", yearFrom: 2021, yearTo: null },
      ],
      SuperSport: [{ label: "950 937cc 110cv", yearFrom: 2017, yearTo: null }],
      DesertX: [{ label: "937cc 110cv", yearFrom: 2022, yearTo: null }],
      "Multistrada V4": [{ label: "1158cc 170cv", yearFrom: 2021, yearTo: null }],
      "Streetfighter V2": [{ label: "955cc 153cv", yearFrom: 2022, yearTo: null }],
      "XDiavel": [{ label: "1262cc 160cv", yearFrom: 2016, yearTo: null }],
    },
    Yamaha: {
      "MT-03": [{ label: "321cc 42cv", yearFrom: 2016, yearTo: null }],
      "MT-125": [{ label: "125cc 15cv", yearFrom: 2014, yearTo: null }],
      "Tracer 7": [{ label: "689cc 73cv", yearFrom: 2016, yearTo: null }],
      "YZF-R3": [{ label: "321cc 42cv", yearFrom: 2015, yearTo: null }],
      "XSR700": [{ label: "689cc 73cv", yearFrom: 2016, yearTo: null }],
      TMAX: [
        { label: "530cc 46cv", yearFrom: 2012, yearTo: 2016 },
        { label: "560cc 48cv", yearFrom: 2020, yearTo: null },
      ],
      "XT1200Z Super Ténéré": [{ label: "1199cc 112cv", yearFrom: 2010, yearTo: 2021 }],
    },
    Honda: {
      "CB125R": [{ label: "125cc 15cv", yearFrom: 2018, yearTo: null }],
      "CB1000 Hornet": [{ label: "1000cc 157cv", yearFrom: 2024, yearTo: null }],
      "CB500 Hornet": [{ label: "471cc 47cv", yearFrom: 2024, yearTo: null }],
      NC750X: [{ label: "745cc 58cv", yearFrom: 2014, yearTo: null }],
      "CBR500R": [{ label: "471cc 47cv", yearFrom: 2013, yearTo: null }],
      "CRF300L": [{ label: "286cc 27cv", yearFrom: 2021, yearTo: null }],
      "X-ADV": [{ label: "745cc 58cv", yearFrom: 2017, yearTo: null }],
      "PCX 125": [{ label: "125cc 12cv", yearFrom: 2010, yearTo: null }],
      "Transalp": [{ label: "755cc 92cv", yearFrom: 2023, yearTo: null }],
    },
    Kawasaki: {
      "Z1000": [{ label: "1043cc 142cv", yearFrom: 2010, yearTo: 2020 }],
      "Ninja 1000SX": [{ label: "1043cc 142cv", yearFrom: 2020, yearTo: null }],
      "Z125": [{ label: "125cc 15cv", yearFrom: 2019, yearTo: null }],
      "Ninja 125": [{ label: "125cc 15cv", yearFrom: 2019, yearTo: null }],
      "Z H2": [{ label: "998cc 200cv", yearFrom: 2020, yearTo: null }],
      "ZX-6R": [{ label: "636cc 130cv", yearFrom: 2013, yearTo: null }],
    },
    Suzuki: {
      "V-Strom 1050": [{ label: "1037cc 107cv", yearFrom: 2020, yearTo: null }],
      "GSX-8S": [{ label: "776cc 83cv", yearFrom: 2023, yearTo: null }],
      "V-Strom 800DE": [{ label: "776cc 84cv", yearFrom: 2023, yearTo: null }],
      Katana: [{ label: "999cc 152cv", yearFrom: 2019, yearTo: null }],
      Bandit: [
        { label: "650cc 85cv", yearFrom: 2005, yearTo: 2012 },
        { label: "1250cc 98cv", yearFrom: 2007, yearTo: 2016 },
      ],
    },
    BMW: {
      "R 1250 RT": [{ label: "1254cc 136cv", yearFrom: 2019, yearTo: null }],
      "F 900 XR": [{ label: "895cc 105cv", yearFrom: 2020, yearTo: null }],
      "S 1000 XR": [{ label: "999cc 165cv", yearFrom: 2015, yearTo: null }],
      "R 1300 GS": [{ label: "1300cc 145cv", yearFrom: 2023, yearTo: null }],
      "C 400 X": [{ label: "350cc 34cv", yearFrom: 2018, yearTo: null }],
      "G 310 GS": [{ label: "313cc 34cv", yearFrom: 2017, yearTo: null }],
      "M 1000 RR": [{ label: "999cc 212cv", yearFrom: 2021, yearTo: null }],
    },
    KTM: {
      "690 Duke": [{ label: "690cc 74cv", yearFrom: 2012, yearTo: 2019 }],
      "790 Adventure": [{ label: "799cc 95cv", yearFrom: 2019, yearTo: null }],
      "890 Adventure": [{ label: "889cc 105cv", yearFrom: 2021, yearTo: null }],
      "RC 390": [{ label: "373cc 44cv", yearFrom: 2014, yearTo: null }],
      "1390 Super Duke R": [{ label: "1350cc 190cv", yearFrom: 2024, yearTo: null }],
    },
    Aprilia: {
      "Tuono V4": [{ label: "1077cc 175cv", yearFrom: 2021, yearTo: null }],
      "RS125": [{ label: "125cc 15cv", yearFrom: 2017, yearTo: null }],
      "Tuono 125": [{ label: "125cc 15cv", yearFrom: 2017, yearTo: null }],
      Dorsoduro: [{ label: "896cc 95cv", yearFrom: 2017, yearTo: 2020 }],
      "SR 50": [{ label: "50cc 4cv", yearFrom: 1992, yearTo: 2020 }],
    },
    Triumph: {
      "Tiger 1200": [{ label: "1160cc 150cv", yearFrom: 2022, yearTo: null }],
      "Speed Twin": [{ label: "1200cc 100cv", yearFrom: 2019, yearTo: null }],
      "Scrambler 900": [{ label: "900cc 65cv", yearFrom: 2019, yearTo: null }],
      "Scrambler 1200": [{ label: "1200cc 90cv", yearFrom: 2019, yearTo: null }],
      "Rocket 3": [{ label: "2458cc 167cv", yearFrom: 2019, yearTo: null }],
      "Tiger 660 Sport": [{ label: "660cc 81cv", yearFrom: 2022, yearTo: null }],
    },
    "Moto Guzzi": {
      "V100 Mandello": [{ label: "1042cc 115cv", yearFrom: 2022, yearTo: null }],
      Stelvio: [
        { label: "1151cc 105cv", yearFrom: 2008, yearTo: 2016 },
        { label: "1042cc 115cv", yearFrom: 2024, yearTo: null },
      ],
      Griso: [{ label: "1151cc 110cv", yearFrom: 2007, yearTo: 2016 }],
      Breva: [{ label: "744cc 48cv", yearFrom: 2003, yearTo: 2012 }],
    },
    Vespa: {
      PX: [
        { label: "125cc 8cv", yearFrom: 1977, yearTo: 2017 },
        { label: "150cc 9cv", yearFrom: 1977, yearTo: 2017 },
      ],
      LX: [
        { label: "50cc 4cv", yearFrom: 2005, yearTo: 2013 },
        { label: "125cc 11cv", yearFrom: 2005, yearTo: 2013 },
      ],
      GTV: [{ label: "300cc 22cv", yearFrom: 2006, yearTo: null }],
      "946": [{ label: "125cc 12cv", yearFrom: 2013, yearTo: null }],
    },
    Piaggio: {
      NRG: [{ label: "50cc 4cv", yearFrom: 1994, yearTo: 2016 }],
      Typhoon: [
        { label: "50cc 4cv", yearFrom: 1993, yearTo: null },
        { label: "125cc 10cv", yearFrom: 2011, yearTo: null },
      ],
      "1": [{ label: "Elettrico 1,2 kW", yearFrom: 2021, yearTo: null }],
    },
    "Royal Enfield": {
      "Super Meteor 650": [{ label: "648cc 47cv", yearFrom: 2023, yearTo: null }],
      "Hunter 350": [{ label: "349cc 20cv", yearFrom: 2022, yearTo: null }],
      "Bullet 350": [{ label: "349cc 20cv", yearFrom: 1932, yearTo: null }],
      "Scram 411": [{ label: "411cc 24cv", yearFrom: 2022, yearTo: null }],
    },
    "Harley-Davidson": {
      "Iron 883": [{ label: "883cc 51cv", yearFrom: 2009, yearTo: 2022 }],
      "Nightster": [{ label: "975cc 90cv", yearFrom: 2022, yearTo: null }],
      "Low Rider": [{ label: "1868cc 94cv", yearFrom: 2018, yearTo: null }],
      "Heritage Classic": [{ label: "1868cc 94cv", yearFrom: 2018, yearTo: null }],
    },
    "MV Agusta": {
      "Brutale 800": [{ label: "798cc 140cv", yearFrom: 2016, yearTo: null }],
      "F4": [{ label: "998cc 195cv", yearFrom: 2010, yearTo: 2018 }],
      "Rush": [{ label: "998cc 208cv", yearFrom: 2020, yearTo: null }],
    },
    Husqvarna: {
      "Svartpilen 701": [{ label: "693cc 75cv", yearFrom: 2019, yearTo: 2021 }],
      "Vitpilen 701": [{ label: "693cc 75cv", yearFrom: 2018, yearTo: 2021 }],
      "Svartpilen 125": [{ label: "125cc 15cv", yearFrom: 2021, yearTo: null }],
    },
    Benelli: {
      "TRK 702": [{ label: "698cc 70cv", yearFrom: 2023, yearTo: null }],
      "Imperiale 400": [{ label: "374cc 21cv", yearFrom: 2019, yearTo: null }],
      "502 C": [{ label: "500cc 47cv", yearFrom: 2019, yearTo: null }],
    },
    CFMoto: {
      "650MT": [{ label: "649cc 61cv", yearFrom: 2018, yearTo: null }],
      "800MT": [{ label: "799cc 95cv", yearFrom: 2021, yearTo: null }],
      "125NK": [{ label: "125cc 15cv", yearFrom: 2018, yearTo: null }],
    },
    Kymco: {
      "AK 550": [{ label: "550cc 53cv", yearFrom: 2017, yearTo: null }],
      "Downtown": [
        { label: "125cc 12cv", yearFrom: 2009, yearTo: null },
        { label: "350cc 29cv", yearFrom: 2015, yearTo: null },
      ],
      Xciting: [{ label: "400cc 35cv", yearFrom: 2013, yearTo: null }],
    },
  },
};
