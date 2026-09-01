/** Identité du site, en un seul endroit. L'URL était auparavant répétée dans
 *  quatre fichiers, ce qui rend toute migration de domaine risquée. */
export const SITE = {
  url: "https://aquametre.fr",
  nom: "Aquamètre",
  nomCourt: "AQUAMÈTRE",
  utm: "aquametre",
  accroche: "calculateurs pour aquarium d'eau douce",
} as const;
