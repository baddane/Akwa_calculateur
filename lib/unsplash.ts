export type Photo = {
  id: string;
  src: string;         // URL hotlinkée du CDN Unsplash, jamais réhébergée
  alt: string;
  author: string;
  authorUrl: string;
};

const APP = "akwa_calculateur";
const UTM = `utm_source=${APP}&utm_medium=referral`;
export const UNSPLASH_URL = `https://unsplash.com/?${UTM}`;

/** Photos choisies une à une plutôt que prises au hasard en tête de recherche :
 *  un résultat de recherche change sans prévenir et sort n'importe quoi. */
export const PHOTOS = {
  hero:       "yeTvRuf9fwg",   // bac planté dense, cadrage large
  volume:     "-gxn0RkXsG0",   // bac entier, substrat et ligne d'eau visibles
  filtration: "6-eO8lCtM4s",   // batterie de bacs éclairés, ambiance installation
  cycle:      "7RG-ajHyesc",   // une personne devant son bac planté, chez elle
} as const;

/** Résolue au build. Sans clé, retourne null et le site bascule sur
 *  l'illustration SVG seule : le build ne casse jamais. */
export async function getPhoto(id: string, w = 1200): Promise<Photo | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const r = await fetch(`https://api.unsplash.com/photos/${id}`, {
      headers: { Authorization: `Client-ID ${key}` },
      next: { revalidate: 604800 },
    });
    if (!r.ok) return null;
    const p = await r.json();
    return {
      id: p.id,
      src: `${p.urls.raw}&w=${w}&q=72&fit=crop&auto=format`,
      alt: p.alt_description ?? "aquarium d'eau douce",
      author: p.user.name,
      authorUrl: `${p.user.links.html}?${UTM}`,
    };
  } catch {
    return null;
  }
}
