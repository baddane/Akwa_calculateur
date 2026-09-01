import type { MetadataRoute } from "next";
import { OUTILS } from "@/lib/outils";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/calculateurs`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...OUTILS.map((o) => ({
      url: `${BASE}/calculateurs/${o.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
