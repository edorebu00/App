/**
 * Genera le icone PNG della PWA a partire da app/icon.svg, così esiste una sola sorgente di
 * verità per il logo: se cambia l'SVG basta rilanciare `npm run icons` invece di ridisegnare
 * a mano cinque file.
 *
 * Le icone "maskable" meritano una nota: Android ritaglia l'icona con forme diverse a seconda
 * del telefono (cerchio, goccia, quadrato stondato), e garantisce solo che resti visibile il
 * cerchio interno pari all'80% del lato. Per quelle si rigenera l'SVG con il disegno rimpicciolito
 * dentro un fondo pieno, altrimenti su alcuni telefoni le ruote dell'auto verrebbero tagliate.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "app", "icon.svg");
const PUBLIC = join(root, "public");

/** Tinta di fondo del marchio: riempie i bordi quando Android ritaglia l'icona. */
const BACKGROUND = "#0a0908";
/** Quota del lato occupata dal disegno in una icona maskable (il resto è margine di sicurezza). */
const SAFE_RATIO = 0.72;

/** Avvolge l'SVG originale in un fondo pieno, rimpicciolito dentro la zona sicura. */
function toMaskable(svg) {
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    // gli id dei gradienti vengono rinominati per non collidere se un giorno i due SVG
    // finissero nella stessa pagina
    .replace(/(id="|url\(#)([a-zA-Z0-9_-]+)/g, "$1m-$2");

  // Il fondo interno dell'icona originale e' leggermente piu' chiaro dello sfondo pieno: sotto
  // una maschera circolare si vedrebbe l'arco del riquadro stondato, che sembra un difetto.
  // Per la versione maskable si appiattisce sul colore di fondo.
  const flat = inner.replace(/fill="url\(#m-bg\)"/g, `fill="${BACKGROUND}"`);

  const size = 64;
  const scaled = size * SAFE_RATIO;
  const offset = (size - scaled) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BACKGROUND}"/>
  <g transform="translate(${offset} ${offset}) scale(${SAFE_RATIO})">${flat}</g>
</svg>`;
}

const TARGETS = [
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-maskable-192.png", size: 192, maskable: true },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
];

const svg = await readFile(SOURCE, "utf-8");
const maskableSvg = toMaskable(svg);
await mkdir(PUBLIC, { recursive: true });

for (const { file, size, maskable } of TARGETS) {
  const source = Buffer.from(maskable ? maskableSvg : svg);
  await sharp(source, { density: 384 }).resize(size, size).png().toFile(join(PUBLIC, file));
  console.log(`  ${file.padEnd(26)} ${size}×${size}${maskable ? "  (maskable)" : ""}`);
}

// apple-icon.png sta in app/: Next lo serve da sé come apple-touch-icon. iOS non applica
// trasparenza né angoli: si usa la versione con fondo pieno.
await sharp(Buffer.from(maskableSvg), { density: 384 })
  .resize(180, 180)
  .png()
  .toFile(join(root, "app", "apple-icon.png"));
console.log("  app/apple-icon.png         180×180  (iOS)");

await writeFile(join(PUBLIC, "icon-maskable.svg"), maskableSvg);
console.log("  icon-maskable.svg          sorgente rigenerabile");
