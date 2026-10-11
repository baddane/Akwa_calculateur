/**
 * Ce que Pinterest reçoit pour chaque épingle : une seule définition, partagée
 * par le flux /epingles.json (lu par le script Tampermonkey) et par le CSV de
 * scripts/planifier-epingles.mjs. Sans import à l'exécution : Node charge ce
 * fichier directement, sans passer par le compilateur de Next.
 */
import type { Epingle } from "./epingles";

export const MEDIA_BASE = "https://www.aquametre.fr/pins";
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
  return epingles
    .map((e, i) => ({
      id: e.id, titre: e.titre, description: sansMotsCles(e), lien: e.vers,
      image: imageEpingle(e, i, base), tableau, alt: texteAlt(e), priorite: e.priorite ?? 0, rang: i,
    }))
    .sort((a, b) => b.priorite - a.priorite || a.rang - b.rang)
    .map(({ rang: _rang, ...p }) => p);
}
