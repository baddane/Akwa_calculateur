import type { MetadataRoute } from "next";
import { OUTILS } from "@/lib/outils";
import { SITE } from "@/lib/site";
import { GUIDES } from "@/lib/guides";

const BASE = SITE.url;

export default function sitemap(): MetadataRoute.Sitemap {
  // La date la plus récente parmi les contenus sert pour les pages d'index.
  const derniere = OUTILS.map((o) => o.maj).sort().at(-1)!;
  return [
    { url: BASE, lastModified: derniere, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/calculateurs`, lastModified: derniere, changeFrequency: "monthly", priority: 0.9 },
    ...OUTILS.map((o) => ({
      url: `${BASE}/calculateurs/${o.slug}`,
      lastModified: o.maj,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...GUIDES.map((g) => ({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: g.maj,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
