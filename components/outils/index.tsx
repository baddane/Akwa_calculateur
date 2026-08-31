"use client";

import { Volume, Poids, Substrat, Verre } from "./Essentiels";
import { Population } from "./Population";
import { ChangementEau, EauOsmosee } from "./Eau";
import { Filtration, Eclairage, Chauffage, Kit } from "./Materiel";

const OUTIL: Record<string, () => React.JSX.Element> = {
  volume: Volume,
  poids: Poids,
  substrat: Substrat,
  population: Population,
  "changement-eau": ChangementEau,
  "eau-osmosee": EauOsmosee,
  verre: Verre,
  filtration: Filtration,
  eclairage: Eclairage,
  chauffage: Chauffage,
  kit: Kit,
};

export default function Outil({ slug }: { slug: string }) {
  const C = OUTIL[slug];
  return C ? <C /> : null;
}
