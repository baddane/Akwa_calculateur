/**
 * Produit le fichier d'import en masse Pinterest à partir de lib/epingles.ts.
 *
 *   node scripts/planifier-epingles.mjs [--depart 2026-09-08] [--par-semaine 3]
 *
 * Colonnes attendues par Pinterest (Créer > Importer en masse) :
 *   Title, Media URL, Pinterest board, Thumbnail, Description, Link,
 *   Publish date, Keywords
 *
 * « Media URL » doit pointer vers une image accessible publiquement : ce sont
 * les JPEG déposés par scripts/rendre-epingles.mjs dans public/pins/, que le
 * site sert tels quels. Ils sont hors de /epingles, que robots.txt interdit :
 * sous ce préfixe, le robot de Pinterest ne pourrait pas les télécharger.
 * MEDIA_BASE permet de les héberger ailleurs.
 */
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (nom, defaut) => { const i = args.indexOf(nom); return i !== -1 ? args[i + 1] : defaut; };

const DEPART = opt("--depart", null);
const PAR_SEMAINE = Number(opt("--par-semaine", 3));
const SORTIE = opt("--sortie", "publication.csv");
const MEDIA_BASE = process.env.MEDIA_BASE ?? "https://www.aquametre.fr/pins";
const TABLEAU = process.env.TABLEAU_PINTEREST ?? "Aquariophilie";

// On importe le fichier source directement : Node 22 retire les annotations de
// type de lui-même. lib/epingles.ts reste ainsi la seule référence, sans risque
// de désynchronisation entre l'image rendue et la ligne du CSV.
const { EPINGLES } = await import(new URL("../lib/epingles.ts", import.meta.url));

// Trois jours par semaine, espacés : Pinterest pénalise les rafales.
const JOURS = [1, 3, 5]; // lundi, mercredi, vendredi
const debut = DEPART ? new Date(`${DEPART}T09:00:00`) : (() => {
  const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d;
})();

function dates(n) {
  const out = [];
  const d = new Date(debut);
  const creneaux = JOURS.slice(0, Math.max(1, Math.min(JOURS.length, PAR_SEMAINE)));
  while (out.length < n) {
    if (creneaux.includes(d.getDay())) {
      out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} 09:00`);
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const motsCles = (e) => [...e.description.matchAll(/#(\S+)/g)].map((m) => m[1]).join(", ");
const q = (v) => `"${String(v).replace(/"/g, '""')}"`;

const quand = dates(EPINGLES.length);
const lignes = [
  ["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"].join(","),
  ...EPINGLES.map((e, i) => [
    e.titre,
    `${MEDIA_BASE}/${String(i + 1).padStart(2, "0")}-${e.id}.jpg`,
    TABLEAU,
    "",
    e.description.replace(/\s*#\S+/g, "").trim(),
    e.vers,
    quand[i],
    motsCles(e),
  ].map(q).join(",")),
];

writeFileSync(SORTIE, "﻿" + lignes.join("\r\n") + "\r\n", "utf8");
console.log(`${EPINGLES.length} épingles écrites dans ${SORTIE}, du ${quand[0]} au ${quand.at(-1)}.`);
console.log(`Images attendues sous ${MEDIA_BASE}/ (variable MEDIA_BASE pour changer).`);
