"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

/** Audience du site, sans cookie (Vercel Web Analytics), plus un événement à
 *  chaque clic vers Amazon : c'est ce clic qui peut rapporter, et sans lui on
 *  ne sait pas quelle page convertit. Les événements personnalisés ne
 *  s'affichent qu'avec l'offre Pro de Vercel ; sur l'offre gratuite, les pages
 *  vues restent mesurées et l'appel est sans effet. */
export default function Mesure() {
  useEffect(() => {
    const surClic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='amazon.fr']") as HTMLAnchorElement | null;
      if (!a) return;
      const k = new URL(a.href).searchParams.get("k") ?? "";
      track("Clic Amazon", { page: location.pathname, recherche: k.slice(0, 80) });
    };
    document.addEventListener("click", surClic, { capture: true });
    return () => document.removeEventListener("click", surClic, { capture: true });
  }, []);
  return <Analytics />;
}
