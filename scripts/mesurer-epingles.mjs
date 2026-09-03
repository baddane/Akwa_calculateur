/**
 * Mesure, pour chaque épingle, si le contenu déborde sur le pied de page.
 *   node scripts/mesurer-epingles.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { setTimeout as pause } from "node:timers/promises";

const PORT = 4124;
const CHROME = [process.env.CHROME_PATH, "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find((p) => p && existsSync(p));
const src = readFileSync(new URL("../lib/epingles.ts", import.meta.url), "utf8");
const ids = [...src.matchAll(/^\s*\{\s*id:\s*"([^"]+)"/gm)].map((m) => m[1]);

try { const s = await fetch(`http://127.0.0.1:${PORT}/`, { signal: AbortSignal.timeout(1500) }); if (s) { console.error("port occupé"); process.exit(1); } } catch {}
const serveur = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
const arreter = () => { try { process.kill(-serveur.pid, "SIGKILL"); } catch {} };
process.on("exit", arreter);
let pret = false;
for (let i = 0; i < 40 && !pret; i++) { await pause(500); try { pret = (await fetch(`http://127.0.0.1:${PORT}/epingles`)).ok; } catch {} }
if (!pret) { console.error("serveur KO"); process.exit(1); }

const nav = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const page = await nav.newPage({ viewport: { width: 1100, height: 1600 }, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/epingles`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 }).catch(() => {});
await pause(800);

const res = await page.evaluate((ids) => ids.map((id) => {
  const pin = document.getElementById(`pin-${id}`);
  const corps = pin.querySelector(".pin-corps");
  const foot = pin.querySelector(".pin-foot");
  const bas = corps.getBoundingClientRect();
  const enfants = [...corps.children].map((c) => c.getBoundingClientRect().bottom);
  const basReel = Math.max(...enfants);
  return {
    id,
    corpsHaut: Math.round(bas.top - pin.getBoundingClientRect().top),
    contenuH: Math.round(basReel - bas.top),
    dispo: Math.round(bas.height),
    debord: Math.round(basReel - foot.getBoundingClientRect().top),
  };
}), ids);

console.log("id".padEnd(24), "haut", "contenu", "dispo", "débord");
for (const r of res) console.log(r.id.padEnd(24), String(r.corpsHaut).padStart(4), String(r.contenuH).padStart(7), String(r.dispo).padStart(5), String(r.debord).padStart(6), r.debord > 0 ? "  ← DÉBORDE" : "");
await nav.close(); arreter();
