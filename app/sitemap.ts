import type { MetadataRoute } from "next";
import { OUTILS } from "@/lib/outils";
import { SITE } from "@/lib/site";
import { GUIDES } from "@/lib/guides";
import { epinglesDe } from "@/components/Epingler";

const BASE = SITE.url;

/** Visuels des épingles de la page, affichés en bas de celle-ci : Google Images
 *  peut ainsi les proposer, avec un lien vers la page. */
const images = (chemin: string) => {
  const liste = epinglesDe(chemin).map((p) => p.image);
  return liste.length ? { images: liste } : {};
};

export default function sitemap(): MetadataRoute.Sitemap {
  // La date la plus récente parmi les contenus sert pour les pages d'index.
  const derniere = OUTILS.map((o) => o.maj).sort().at(-1)!;
  return [
    { url: BASE, lastModified: derniere, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/calculateurs`, lastModified: derniere, changeFrequency: "monthly", priority: 0.9 },
    ...OUTILS.map((o) => ({
      url: `${BASE}/calculateurs/${o.slug}`,
      lastModified: o.maj,
      ...images(`/calculateurs/${o.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/guides`, lastModified: GUIDES.map((g) => g.maj).sort().at(-1)!, changeFrequency: "monthly" as const, priority: 0.7 },
    ...GUIDES.map((g) => ({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: g.maj,
      ...images(`/guides/${g.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
