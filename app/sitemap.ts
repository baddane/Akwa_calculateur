import type { MetadataRoute } from "next";
import { OUTILS } from "@/lib/outils";
import { SITE } from "@/lib/site";

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
  ];
}
