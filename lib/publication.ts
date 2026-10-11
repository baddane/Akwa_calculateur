/**
 * Ce que Pinterest reçoit pour chaque épingle : une seule définition, partagée
 * par le flux /epingles.json (lu par le script Tampermonkey) et par le CSV de
 * scripts/planifier-epingles.mjs. Sans import à l'exécution : Node charge ce
 * fichier directement, sans passer par le compilateur de Next.
 */
import type { Epingle } from "./epingles";

export const MEDIA_BASE = "https://www.aquametre.fr/pins";
/** Tableau de repli, pour une épingle sans tableau. */
export const TABLEAU = "Aquariophilie";

/** Nom du JPEG déposé par scripts/rendre-epingles.mjs : il suit la position
 *  dans EPINGLES, d'où l'ajout des nouvelles épingles en fin de liste. */
export const imageEpingle = (e: Epingle, i: number, base = MEDIA_BASE) =>
  `${base}/${String(i + 1).padStart(2, "0")}-${e.id}.jpg`;

/** Pinterest n'exploite plus les hashtags : on les retire du texte. */
export const sansMotsCles = (e: Epingle) => e.description.replace(/\s*#\S+/g, "").trim();

/** Texte alternatif : ce qu'on lit sur l'image. */
export const texteAlt = (e: Epingle) =>
  [e.punch, e.sub].filter(Boolean).map((t) => (/[.!?…]$/.test(t!) ? t : `${t}.`)).join(" ");

export type Publication = {
  id: string; titre: string; description: string; lien: string;
  image: string; tableau: string; alt: string; priorite: number;
};

/** Ordre de publication : priorité décroissante, puis ordre de la liste. Une
 *  nouvelle série passe ainsi devant les anciennes sans renuméroter les images. */
export function publications(epingles: Epingle[], base = MEDIA_BASE, tableau = TABLEAU): Publication[] {
  const tries = epingles
    .map((e, i) => ({
      id: e.id, titre: e.titre, description: sansMotsCles(e), lien: e.vers,
      image: imageEpingle(e, i, base), tableau: e.tableau || tableau, alt: texteAlt(e), priorite: e.priorite ?? 0, rang: i,
    }))
    .sort((a, b) => b.priorite - a.priorite || a.rang - b.rang)
    .map(({ rang: _rang, ...p }) => p);
  return espacer(tries);
}

/** Évite que deux épingles vers la même page se suivent de trop près : à
 *  cinq épingles par jour, quatre pins du même guide d'affilée feraient
 *  quatre liens identiques dans la journée, ce que Pinterest lit comme du
 *  spam. On prend à chaque fois la première épingle dont le lien n'est pas
 *  sorti dans les ECART dernières ; l'ordre de priorité est conservé autant
 *  que possible. */
const ECART = 4;
function espacer(liste: Publication[]): Publication[] {
  const reste = [...liste];
  const out: Publication[] = [];
  while (reste.length) {
    const recents = new Set(out.slice(-ECART).map((p) => p.lien));
    const k = reste.findIndex((p) => !recents.has(p.lien));
    out.push(reste.splice(k === -1 ? 0 : k, 1)[0]);
  }
  return out;
}
