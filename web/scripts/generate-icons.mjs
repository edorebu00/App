/**
 * Genera le icone PNG della PWA a partire da app/icon.svg, così esiste una sola sorgente di
 * verità per il logo: se cambia l'SVG basta rilanciare `npm run icons` invece di ridisegnare
 * a mano cinque file.
 *
 * I nomi dei file contengono l'impronta dell'SVG di partenza. Non e' un vezzo: il manifest e'
 * l'unico modo che Chrome ha per accorgersi che l'icona e' cambiata, e lo fa confrontando il
 * CONTENUTO del manifest. Se il file si chiamasse sempre "icon-192.png", sostituirlo lascerebbe
 * il manifest identico e l'icona gia' installata sulla schermata Home non verrebbe mai
 * aggiornata. Col nome che cambia, il manifest cambia e Chrome rilegge l'icona.
 *
 * Le icone "maskable" meritano una nota: Android ritaglia l'icona con forme diverse a seconda
 * del telefono (cerchio, goccia, quadrato stondato), e garantisce solo che resti visibile il
 * cerchio interno pari all'80% del lato. Per quelle si rigenera l'SVG con il disegno rimpicciolito
 * dentro un fondo pieno, altrimenti su alcuni telefoni le ruote dell'auto verrebbero tagliate.
 */
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "app", "icon.svg");
const PUBLIC = join(root, "public");

/** Quota del lato occupata dal disegno in una icona maskable (il resto è margine di sicurezza). */
const SAFE_RATIO = 0.72;

/**
 * Costruisce la variante maskable: fondo a tutta pagina e solo il segno rimpicciolito dentro la
 * zona sicura.
 *
 * NON si puo' semplicemente rimpicciolire tutta l'icona su un colore di fondo: con una tessera
 * dorata si otterrebbe un quadrato d'oro circondato di bordi scuri, e sotto il ritaglio tondo di
 * Android si vedrebbero gli angoli. Il fondo deve arrivare fino al bordo, ed e' per questo che
 * l'SVG marca separatamente il rettangolo di fondo (#bg) e il segno (#mark).
 */
function toMaskable(svg) {
  const size = 64;
  const scaled = size * SAFE_RATIO;
  const offset = (size - scaled) / 2;

  const withoutClip = svg
    // via il ritaglio ad angoli stondati: e' il sistema operativo a decidere la forma
    .replace(/\s*clip-path="url\(#round\)"/, "")
    .replace(/<clipPath id="round">[\s\S]*?<\/clipPath>/, "");

  const marked = withoutClip.replace(
    /<g id="mark">/,
    `<g id="mark" transform="translate(${offset} ${offset}) scale(${SAFE_RATIO})">`
  );

  if (marked === withoutClip) {
    throw new Error("app/icon.svg non contiene <g id=\"mark\">: la variante maskable non e' costruibile");
  }
  return marked;
}

const TARGETS = [
  { name: "icon", size: 192, maskable: false },
  { name: "icon", size: 512, maskable: false },
  { name: "icon-maskable", size: 192, maskable: true },
  { name: "icon-maskable", size: 512, maskable: true },
];

const svg = await readFile(SOURCE, "utf-8");
const maskableSvg = toMaskable(svg);
const hash = createHash("sha256").update(svg).digest("hex").slice(0, 8);
await mkdir(PUBLIC, { recursive: true });

// Via le icone della generazione precedente, altrimenti a ogni cambio di logo ne resta una copia.
for (const file of await readdir(PUBLIC)) {
  if (/^icon(-maskable)?-\d+-[0-9a-f]{8}\.png$/.test(file)) await unlink(join(PUBLIC, file));
}

const generated = [];
for (const { name, size, maskable } of TARGETS) {
  const file = `${name}-${size}-${hash}.png`;
  const source = Buffer.from(maskable ? maskableSvg : svg);
  await sharp(source, { density: 384 }).resize(size, size).png().toFile(join(PUBLIC, file));
  generated.push({ file, size, maskable });
  console.log(`  ${file.padEnd(30)} ${size}×${size}${maskable ? "  (maskable)" : ""}`);
}

// apple-icon.png sta in app/: Next lo serve da sé come apple-touch-icon. iOS non applica
// trasparenza né angoli: si usa la versione con fondo pieno.
await sharp(Buffer.from(maskableSvg), { density: 384 })
  .resize(180, 180)
  .png()
  .toFile(join(root, "app", "apple-icon.png"));
console.log("  app/apple-icon.png         180×180  (iOS)");

await writeFile(join(PUBLIC, "icon-maskable.svg"), maskableSvg);

// Modulo generato: e' la sola fonte dei percorsi usati dal manifest, cosi' il nome con
// l'impronta non va mai ricopiato a mano.
const lines = generated
  .map(
    ({ file, size, maskable }) =>
      `  { src: "/${file}", sizes: "${size}x${size}", type: "image/png", purpose: "${maskable ? "maskable" : "any"}" },`
  )
  .join("\n");

await writeFile(
  join(root, "lib", "appIcons.ts"),
  `import type { MetadataRoute } from "next";

// GENERATO DA scripts/generate-icons.mjs — non modificare a mano, si rigenera con \`npm run icons\`.
// L'impronta nel nome serve a far accorgere Chrome che l'icona e' cambiata: vedi lo script.
export const APP_ICONS: MetadataRoute.Manifest["icons"] = [
${lines}
];
`
);
console.log("  lib/appIcons.ts                percorsi per il manifest");
