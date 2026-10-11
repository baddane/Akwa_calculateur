/** Guides d'achat : ils ciblent les recherches qui précèdent un achat
 *  (« quel filtre », « meilleur chauffage »), que les calculateurs, centrés sur
 *  « combien », ne captent pas. Chaque guide renvoie vers son calculateur. */
export type Guide = {
  slug: string;
  nom: string;
  titre: string;        // balise title
  description: string;  // méta description
  outil: string;        // calculateur associé
  maj: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "quel-filtre-aquarium",
    nom: "Quel filtre choisir",
    titre: "Quel filtre pour un aquarium ? Guide selon le volume",
    description: "Interne, externe, cascade ou éponge : quel filtre choisir selon le volume de votre aquarium, quel débit lire sur la boîte, et les erreurs qui font acheter trop petit.",
    outil: "filtration",
    maj: "2026-10-11",
  },
  {
    slug: "quel-chauffage-aquarium",
    nom: "Quel chauffage choisir",
    titre: "Quelle puissance de chauffage pour un aquarium ? Guide d'achat",
    description: "Combien de watts pour votre aquarium selon son volume et la température de la pièce, quel type de chauffage choisir, où le placer et les erreurs qui le font lâcher en une saison.",
    outil: "chauffage",
    maj: "2026-10-11",
  },
];
