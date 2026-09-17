/**
 * Finestra della cronologia passata al modello, calcolata a blocchi.
 *
 * La cache dei prompt è un confronto di prefisso: se il primo messaggio della finestra cambia a
 * ogni turno — com'è inevitabile con un "ultimi N messaggi" che scorre — il prefisso è sempre
 * nuovo e non viene mai riletto dalla cache. Ancorando l'inizio della finestra a un multiplo di
 * `block`, il punto di partenza resta fermo per `block` turni: in quei turni il prefisso è
 * identico byte per byte, e si paga un solo "miss" ogni `block` messaggi invece che uno per turno.
 */
export function historyWindow(total: number, limit: number, block: number) {
  const skip = Math.floor(Math.max(0, total - limit) / block) * block;
  return { skip, take: limit + block };
}
