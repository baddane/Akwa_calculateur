"use client";

import { useEffect, useState } from "react";
import type { VolumeInput } from "@/lib/aqua";

const CLE = "akwa.bac";
const DEFAUT: VolumeInput = { longueur: 80, largeur: 35, hauteur: 45, substrat: 5, decor: 10 };

/** Le profil de bac suit l'utilisateur d'un calculateur à l'autre : il saisit ses
 *  cotes une fois. Stocké dans le navigateur, jamais transmis nulle part. */
export function useTank() {
  const [bac, setBac] = useState<VolumeInput>(DEFAUT);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) {
        const v = JSON.parse(brut) as Partial<VolumeInput>;
        setBac((b) => ({ ...b, ...v }));
      }
    } catch { /* stockage indisponible : on garde les valeurs par défaut */ }
    setCharge(true);
  }, []);

  useEffect(() => {
    if (!charge) return;
    try { localStorage.setItem(CLE, JSON.stringify(bac)); } catch { /* sans effet */ }
  }, [bac, charge]);

  const set = (k: keyof VolumeInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBac((b) => ({ ...b, [k]: Math.max(0, Number(e.target.value) || 0) }));

  return { bac, setBac, set, charge };
}
