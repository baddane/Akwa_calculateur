import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/epingles" },
    sitemap: "https://akwa-calculateur.vercel.app/sitemap.xml",
  };
}
