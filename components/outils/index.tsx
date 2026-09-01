"use client";

import { Volume, Poids, Substrat, Verre } from "./Essentiels";
import { Population } from "./Population";
import { ChangementEau, EauOsmosee } from "./Eau";
import { Filtration, Eclairage, Chauffage, Kit } from "./Materiel";
import type { Visuels } from "@/lib/catalogue";

const OUTIL: Record<string, (p: { visuels?: Visuels }) => React.JSX.Element> = {
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

export default function Outil({ slug, visuels }: { slug: string; visuels?: Visuels }) {
  const C = OUTIL[slug];
  return C ? <C visuels={visuels} /> : null;
}
