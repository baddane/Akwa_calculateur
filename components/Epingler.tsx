import { EPINGLES } from "@/lib/epingles";
import { publications } from "@/lib/publication";
import { SITE } from "@/lib/site";

/** Les épingles qui mènent à une page, rattachées à cette page. Utilisé par la
 *  section « Enregistrer sur Pinterest » et par le sitemap d'images : Google ne
 *  retient une image du sitemap que si elle est visible sur la page déclarée. */
export function epinglesDe(chemin: string) {
  const url = `${SITE.url}${chemin}`;
  return publications(EPINGLES).filter((p) => p.lien === url);
}

/** Section en bas de page : les visuels de la page, chacun avec un lien
 *  « Enregistrer » vers Pinterest. Un visiteur qui épingle fait connaître le
 *  compte sans automatisation. */
export default function Epingler({ chemin }: { chemin: string }) {
  const pins = epinglesDe(chemin);
  if (!pins.length) return null;
  const page = `${SITE.url}${chemin}`;
  return (
    <section className="prose epingler" style={{ maxWidth: "none" }}>
      <h2>Enregistrer sur Pinterest</h2>
      <p style={{ maxWidth: "72ch" }}>Pour retrouver cette page plus tard, ou la partager.</p>
      <div className="epingles">
        {pins.map((p) => (
          <a key={p.id} className="epingle"
            href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(page)}&media=${encodeURIComponent(p.image)}&description=${encodeURIComponent(p.titre)}`}
            target="_blank" rel="noopener nofollow">
            <img src={p.image.replace(SITE.url, "")} alt={p.alt || p.titre} width={1000} height={1500} loading="lazy" decoding="async" />
            <span>Enregistrer</span>
          </a>
        ))}
      </div>
    </section>
  );
}
