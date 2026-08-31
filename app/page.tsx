import Calculators from "@/components/Calculators";
import { Credit } from "@/components/Credit";
import { getPhoto, PHOTOS, type Photo } from "@/lib/unsplash";

export const revalidate = 86400;

const SUJETS = [
  { cle: "volume" as const, titre: "Le volume net, pas celui de la boîte",
    txt: "Entre la marge sous le rebord, le substrat et le décor, un bac perd couramment un cinquième de sa contenance annoncée. Tous les autres calculs partent de là." },
  { cle: "filtration" as const, titre: "Le débit s'effondre une fois le filtre chargé",
    txt: "Les fabricants mesurent à vide. Avec les masses filtrantes en place, comptez un tiers de moins. C'est l'erreur d'achat la plus répandue." },
  { cle: "cycle" as const, titre: "Le cycle avant le premier poisson",
    txt: "Trois à six semaines pour que les bactéries s'installent. Tant que le test de nitrites n'est pas revenu à zéro, aucune introduction." },
];

export default async function Page() {
  const [hero, ...vignettes] = await Promise.all([
    getPhoto(PHOTOS.hero, 1800),
    ...SUJETS.map((s) => getPhoto(PHOTOS[s.cle], 800)),
  ]);
  const cartes = SUJETS.map((s, i) => ({ ...s, photo: vignettes[i] }));
  const credits = [hero, ...vignettes].filter(Boolean) as Photo[];

  return (
    <>
      <header className="hero">
        {hero && <img className="hero-img" src={hero.src} alt={hero.alt} fetchPriority="high" />}
        <div className="wrap hero-inner">
          <span className="eyebrow">
            <svg width="13" height="13" viewBox="0 0 100 60" aria-hidden>
              <path d="M6,30 C16,15 50,12 68,22 L95,9 L88,30 L95,51 L68,38 C50,48 16,45 6,30 Z" fill="currentColor" />
            </svg>
            Aquarium d&apos;eau douce
          </span>
          <h1>Dimensionnez votre bac avant d&apos;acheter</h1>
          <p>
            La moitié des échecs en aquariophilie se joue avant la mise en eau. Un bac sous-filtré,
            un chauffage trop juste, une population calculée sur le volume affiché plutôt que sur le
            volume réel. Cinq calculateurs répondent à ces questions en une minute.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><b>5</b><span>calculateurs</span></div>
            <div className="hero-stat"><b>41</b><span>espèces référencées</span></div>
            <div className="hero-stat"><b>0 €</b><span>et sans inscription</span></div>
          </div>
        </div>
        {hero && <Credit photo={hero} inverse />}
      </header>

      <main className="wrap">
        <Calculators />
      </main>

      <section className="wrap band">
        <h2>Trois erreurs qui coûtent un bac</h2>
        <p>Elles se produisent toutes avant le premier poisson, et se corrigent toutes en amont.</p>
        <div className="cards">
          {cartes.map((c) => (
            <article className="pcard" key={c.titre}>
              {c.photo && (
                <figure>
                  <img src={c.photo.src} alt={c.photo.alt} loading="lazy" />
                  <figcaption><Credit photo={c.photo} /></figcaption>
                </figure>
              )}
              <div className="body">
                <h3>{c.titre}</h3>
                <p>{c.txt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p><strong>En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.</strong></p>
          <p>
            Aucun prix n&apos;est affiché sur ce site. Les liens renvoient vers les résultats de recherche
            Amazon.fr, où le prix et la disponibilité en vigueur font foi.
          </p>
          <p>
            Les calculs sont des ordres de grandeur destinés à orienter un choix de matériel. Ils ne
            remplacent ni l&apos;observation du bac ni le suivi régulier des paramètres de l&apos;eau.
          </p>
          {credits.length > 0 && (
            <p className="credit">
              Photographies : {credits.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ", "}
                  <a href={p.authorUrl} target="_blank" rel="noopener nofollow">{p.author}</a>
                </span>
              ))} sur <a href="https://unsplash.com/?utm_source=akwa_calculateur&utm_medium=referral" target="_blank" rel="noopener nofollow">Unsplash</a>.
            </p>
          )}
        </div>
      </footer>
    </>
  );
}
