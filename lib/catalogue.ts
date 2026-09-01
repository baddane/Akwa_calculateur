import { chercherProduit, apiDisponible } from "./amazon-api";
import { TAG } from "./amazon";

/** Une requête représentative par famille de matériel. Les spécifications
 *  précises (débit, watts, longueur) restent portées par le texte et par le
 *  lien de recherche ; la photo n'illustre que la catégorie. */
export const REQUETES: Record<string, string> = {
  bac:         "aquarium equipe eau douce",
  filtre:      "filtre exterieur aquarium",
  chauffage:   "chauffage aquarium thermostat",
  lampe:       "rampe led aquarium plantes",
  substrat:    "sable de quartz aquarium",
  flacon:      "conditionneur eau aquarium anti chlore",
  bacteries:   "bacteries demarrage aquarium",
  tests:       "test aquarium gouttes no2 no3",
  thermometre: "thermometre aquarium",
  siphon:      "aspirateur a vase aquarium siphon",
  epuisette:   "epuisette aquarium",
  nourriture:  "nourriture poisson aquarium granules",
  seau:        "seau gradue 10 litres",
  outils:      "pince ciseaux aquascaping",
};

export type Visuel = { image: string; largeur: number; hauteur: number; titre: string };
export type Visuels = Record<string, Visuel>;

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Le quota PA-API est limité et plusieurs pages ont besoin des mêmes visuels :
 *  on ne les récupère qu'une fois par build. */
let enCours: Promise<Visuels> | null = null;

export function chargerVisuels(): Promise<Visuels> {
  if (!enCours) enCours = recuperer();
  return enCours;
}

/** Sans clés, ou si l'API refuse, retourne un objet vide et l'affichage
 *  retombe sur les pictogrammes. */
async function recuperer(): Promise<Visuels> {
  if (!apiDisponible()) return {};
  const out: Visuels = {};
  // PA-API limite à une requête par seconde tant que le compte n'a pas de
  // volume : on séquence au lieu de paralléliser.
  for (const [icone, mots] of Object.entries(REQUETES)) {
    const p = await chercherProduit(mots, TAG);
    if (p?.image) out[icone] = { image: p.image, largeur: p.largeur, hauteur: p.hauteur, titre: p.titre };
    await pause(1100);
  }
  return out;
}
