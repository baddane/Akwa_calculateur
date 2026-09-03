/**
 * Rend en PNG 1000 × 1500 toutes les épingles définies dans lib/epingles.ts,
 * et en dépose une copie JPEG dans public/pins/ : c'est cette copie que
 * l'import en masse Pinterest va chercher (voir scripts/planifier-epingles.mjs,
 * qui construit les URL à partir du même nom de fichier).
 * Ne re-rend que celles qui manquent, sauf avec --tout.
 *
 *   node scripts/rendre-epingles.mjs [--tout] [--sortie <dossier>]
 *
 * Prérequis : npm install fait, et Chromium disponible.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { setTimeout as pause } from "node:timers/promises";

const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
// indexOf renvoie -1 quand l'option est absente : sans ce garde-fou,
// args[0] passait pour le dossier de sortie.
const iSortie = args.indexOf("--sortie");
const SORTIE = iSortie !== -1 ? args[iSortie + 1] : "epingles-rendues";
const PORT = 4123;

const CHROME = [
  process.env.CHROME_PATH,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
].find((p) => p && existsSync(p));

// Les identifiants viennent du fichier source, pour rester la seule référence.
const src = readFileSync(new URL("../lib/epingles.ts", import.meta.url), "utf8");
const ids = [...src.matchAll(/^\s*\{\s*id:\s*"([^"]+)"/gm)].map((m) => m[1]);
if (!ids.length) { console.error("Aucune épingle trouvée dans lib/epingles.ts"); process.exit(1); }

const PUBLIC = "public/pins";
mkdirSync(SORTIE, { recursive: true });
mkdirSync(PUBLIC, { recursive: true });

// Un serveur resté d'une exécution précédente servirait un ancien build sans
// qu'on s'en aperçoive : on refuse de démarrer si le port est déjà pris.
try {
  const sonde = await fetch(`http://127.0.0.1:${PORT}/`, { signal: AbortSignal.timeout(1500) });
  if (sonde) {
    console.error(`Le port ${PORT} est déjà occupé. Arrêtez le serveur qui y tourne, puis relancez.`);
    process.exit(1);
  }
} catch { /* port libre, on continue */ }

// `npx` lance un petit-fils : tuer le seul enfant laisserait le serveur vivant
// et le prochain lancement échouerait sur le port occupé. On tue le groupe.
const serveur = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
let arrete = false;
const arreter = () => {
  if (arrete) return;
  arrete = true;
  try { process.kill(-serveur.pid, "SIGKILL"); } catch { try { serveur.kill("SIGKILL"); } catch {} }
};
process.on("exit", arreter); process.on("SIGINT", () => { arreter(); process.exit(1); });

// Attente que le serveur réponde, plutôt qu'un délai fixe
let pret = false;
for (let i = 0; i < 40 && !pret; i++) {
  await pause(500);
  try { pret = (await fetch(`http://127.0.0.1:${PORT}/epingles`)).ok; } catch {}
}
if (!pret) { console.error("Le serveur n'a pas démarré. Avez-vous lancé `npm run build` ?"); arreter(); process.exit(1); }

const navigateur = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const page = await navigateur.newPage({ viewport: { width: 1200, height: 1700 } });

// `next start` répond 200 avant que sa feuille de style ne soit servable : la
// première visite peut tomber sur une page non stylée, et les épingles sont
// alors capturées à la taille du contenu au lieu de 1000 × 1500. On recharge
// jusqu'à ce que la mise en page soit effectivement appliquée.
let stylee = false;
for (let essai = 1; essai <= 8 && !stylee; essai++) {
  // `networkidle` n'aboutit pas de façon fiable avec vingt images de fond :
  // on attend le DOM, puis explicitement le chargement des photos.
  await page.goto(`http://127.0.0.1:${PORT}/epingles`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(
    () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    null, { timeout: 30000 }
  ).catch(() => {});
  await pause(600);
  const boite = await page.locator(`#pin-${ids[0]}`).boundingBox().catch(() => null);
  stylee = boite !== null && Math.round(boite.width) === 1000 && Math.round(boite.height) === 1500;
  if (!stylee) console.log(`  mise en page pas encore appliquée, nouvel essai (${essai}/8)`);
}
if (!stylee) {
  console.error("La feuille de style ne s'applique pas. Lancez `npm run build` puis réessayez.");
  await navigateur.close(); arreter(); process.exit(1);
}

let faites = 0, sautees = 0;
const manquantes = [];
for (const [i, id] of ids.entries()) {
  const num = String(i + 1).padStart(2, "0");
  const chemin = `${SORTIE}/${num}-${id}.png`;
  if (!TOUT && existsSync(chemin)) { sautees++; continue; }
  const el = page.locator(`#pin-${id}`);
  if (!(await el.count())) { manquantes.push(id); continue; }
  await el.screenshot({ path: chemin });
  const boite = await el.boundingBox();
  if (Math.round(boite.width) !== 1000 || Math.round(boite.height) !== 1500) {
    manquantes.push(`${id} (${Math.round(boite.width)}×${Math.round(boite.height)})`);
  }
  // Le PNG pèse 1,5 Mo ; Pinterest plafonne l'import à 20 Mo par image mais
  // télécharge chaque URL, donc autant servir un JPEG de 200 Ko.
  await sharp(chemin).jpeg({ quality: 88, mozjpeg: true }).toFile(`${PUBLIC}/${num}-${id}.jpg`);
  faites++;
}

await navigateur.close();
arreter();

console.log(`${faites} épingle(s) rendue(s), ${sautees} déjà présente(s), dans ${SORTIE}/`);
if (faites) console.log(`Copies JPEG pour l\u2019import Pinterest dans ${PUBLIC}/`);
if (manquantes.length) { console.error("Problèmes :", manquantes.join(", ")); process.exit(1); }
