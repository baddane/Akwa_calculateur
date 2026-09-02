/**
 * Rend en PNG 1000 × 1500 toutes les épingles définies dans lib/epingles.ts.
 * Ne re-rend que celles qui manquent, sauf avec --tout.
 *
 *   node scripts/rendre-epingles.mjs [--tout] [--sortie <dossier>]
 *
 * Prérequis : npm install fait, et Chromium disponible.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { setTimeout as pause } from "node:timers/promises";

const args = process.argv.slice(2);
const TOUT = args.includes("--tout");
const SORTIE = args[args.indexOf("--sortie") + 1] ?? "epingles-rendues";
const PORT = 4123;

const CHROME = [
  process.env.CHROME_PATH,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
].find((p) => p && existsSync(p));

// Les identifiants viennent du fichier source, pour rester la seule référence.
const src = readFileSync(new URL("../lib/epingles.ts", import.meta.url), "utf8");
const ids = [...src.matchAll(/^\s*\{\s*id:\s*"([^"]+)"/gm)].map((m) => m[1]);
if (!ids.length) { console.error("Aucune épingle trouvée dans lib/epingles.ts"); process.exit(1); }

mkdirSync(SORTIE, { recursive: true });

const serveur = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });
const arreter = () => { try { serveur.kill(); } catch {} };
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
await page.goto(`http://127.0.0.1:${PORT}/epingles`, { waitUntil: "networkidle" });
await pause(1200);

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
  faites++;
}

await navigateur.close();
arreter();

console.log(`${faites} épingle(s) rendue(s), ${sautees} déjà présente(s), dans ${SORTIE}/`);
if (manquantes.length) { console.error("Problèmes :", manquantes.join(", ")); process.exit(1); }
