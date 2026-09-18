export interface MotorsportCalendarLink {
  campionato: string;
  url: string;
}

/**
 * Link ufficiali al calendario di ogni campionato.
 *
 * Sono indirizzi statici, non il risultato di una ricerca dell'agente IA. Un calendario di gara
 * cambia poche volte l'anno, la fonte giusta è sempre e solo il sito ufficiale del campionato, e
 * farlo cercare e verificare gara per gara a un modello — con tanto di link ai biglietti, che sono
 * proprio il genere di dato che non si vuole sbagliato — costava una seconda ricerca web ad ogni
 * rigenerazione del riquadro senza aggiungere nulla che questi quattro indirizzi non diano già.
 * Cambiano solo se un campionato cambia sito, cosa rara quanto aggiornare a mano questo file.
 */
export const MOTORSPORT_CALENDARS: MotorsportCalendarLink[] = [
  { campionato: "Formula 1", url: "https://www.formula1.com/en/racing" },
  { campionato: "MotoGP", url: "https://www.motogp.com/en/calendar" },
  { campionato: "WEC", url: "https://www.fiawec.com/en/calendar" },
  { campionato: "Formula E", url: "https://www.fiaformulae.com/en/calendar" },
];
