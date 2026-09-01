import Link from "next/link";
import Wizard from "@/components/Wizard";
import { Credit } from "@/components/Credit";
import { getPhoto, PHOTOS, type Photo } from "@/lib/unsplash";
import { OUTILS, FAMILLES } from "@/lib/outils";
import { SchemaSite } from "@/components/Schema";
import { chargerVisuels } from "@/lib/catalogue";

export const revalidate = 86400;

export const metadata = { alternates: { canonical: "/" } };

const SUJETS = [
  { cle: "volume" as const, titre: "Le volume net, pas celui de la boîte",
    txt: "Entre la marge sous le rebord, le substrat et le décor, un bac perd couramment un cinquième de sa contenance annoncée. Tous les autres calculs partent de là." },
  { cle: "filtration" as const, titre: "Le débit s'effondre une fois le filtre chargé",
    txt: "Les fabricants mesurent à vide. Avec les masses filtrantes en place, comptez un tiers de moins. C'est l'erreur d'achat la plus répandue." },
  { cle: "cycle" as const, titre: "Le cycle avant le premier poisson",
    txt: "Trois à six semaines pour que les bactéries s'installent. Tant que le test de nitrites n'est pas revenu à zéro, aucune introduction." },
];


const CAS = [
  { q: "Je démarre mon premier bac, par quoi commencer ?", href: "/calculateurs/kit", ou: "Kit de démarrage" },
  { q: "Combien de poissons dans mon 100 litres ?", href: "/calculateurs/population", ou: "Population" },
  { q: "Quel filtre pour un bac planté ?", href: "/calculateurs/filtration", ou: "Filtration" },
  { q: "Mon eau est trop dure pour des crevettes", href: "/calculateurs/eau-osmosee", ou: "Coupe à l'osmosée" },
  { q: "Mon plancher supportera-t-il 200 litres ?", href: "/calculateurs/poids", ou: "Poids en charge" },
  { q: "J'ai récupéré un bac d'occasion, est-il sûr ?", href: "/calculateurs/verre", ou: "Sécurité du verre" },
];

export default async function Page() {
  const [hero, ...vignettes] = await Promise.all([
    getPhoto(PHOTOS.hero, 1800),
    ...SUJETS.map((s) => getPhoto(PHOTOS[s.cle], 800)),
  ]);
  const cartes = SUJETS.map((s, i) => ({ ...s, photo: vignettes[i] }));
  const visuels = await chargerVisuels();
  const credits = [hero, ...vignettes].filter(Boolean) as Photo[];

  return (
    <>
      <SchemaSite />
      <header className="hero">
        {hero && <img className="hero-img" src={hero.src} alt={hero.alt} fetchPriority="high" />}
        <div className="wrap hero-inner">
          <span className="eyebrow">Aquarium d&apos;eau douce</span>
          <h1>Dimensionnez votre bac avant d&apos;acheter</h1>
          <p>
            La moitié des échecs en aquariophilie se joue avant la mise en eau. Un bac sous-filtré,
            un chauffage trop juste, une population calculée sur le volume affiché plutôt que sur le
            volume réel. Onze calculateurs, et un assistant qui les enchaîne pour vous.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><b>11</b><span>calculateurs</span></div>
            <div className="hero-stat"><b>41</b><span>espèces référencées</span></div>
            <div className="hero-stat"><b>0 €</b><span>et sans inscription</span></div>
          </div>
        </div>
        {hero && <Credit photo={hero} inverse />}
      </header>

      <main className="wrap">
        <Wizard visuels={visuels} />

        <section className="cas">
          <h2>Les questions qui amènent ici</h2>
          <div className="cas-liste">
            {CAS.map((c) => (
              <Link key={c.href} href={c.href} className="cas-item">
                <span className="cas-q">{c.q}</span>
                <span className="cas-ou">{c.ou}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="fam" style={{ marginTop: 46 }}>
          <h2>Ou allez droit au calculateur qu&apos;il vous faut</h2>
          <p className="fam-sous">
            Chacun fonctionne seul, et vos dimensions se retiennent d&apos;un outil à l&apos;autre.
          </p>
          {FAMILLES.map((f) => (
            <div key={f} className="fam-bloc">
              <h3>{f}</h3>
              <div className="tuiles">
                {OUTILS.filter((o) => o.famille === f).map((o) => (
                  <Link key={o.slug} href={`/calculateurs/${o.slug}`} className="tuile">
                    <b>{o.nom}</b><span>{o.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
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
        {credits.length > 0 && (
          <p className="credit" style={{ marginTop: 20 }}>
            Photographies : {credits.map((p, i) => (
              <span key={p.id}>{i > 0 && ", "}
                <a href={p.authorUrl} target="_blank" rel="noopener nofollow">{p.author}</a>
              </span>
            ))} sur <a href="https://unsplash.com/?utm_source=akwa_calculateur&utm_medium=referral" target="_blank" rel="noopener nofollow">Unsplash</a>.
          </p>
        )}
      </section>
    </>
  );
}
