import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";
import { calcVolume, calcKit, ESPECES, type VolumeInput } from "@/lib/aqua";
import { Achat } from "@/components/ui";
import { Faq } from "@/components/Contenu";
import { SchemaGuide } from "@/components/Schema";
import Epingler from "@/components/Epingler";

const g = GUIDES.find((x) => x.slug === "kit-aquarium-debutant")!;

export const metadata: Metadata = {
  title: g.titre,
  description: g.description,
  alternates: { canonical: `/guides/${g.slug}` },
  openGraph: {
    title: g.titre, description: g.description, type: "article", siteName: SITE.nom, locale: "fr_FR",
    images: [{ url: g.image, width: 1000, height: 1500, alt: g.titre }],
  },
};

/** Trois bacs types, calculés par la même fonction que le calculateur de kit :
 *  communautaire planté, 5 cm de sol, 10 % de décor. */
const BACS: { nom: string; v: VolumeInput }[] = [
  { nom: "Bac de 60 L", v: { longueur: 60, largeur: 30, hauteur: 36, substrat: 5, decor: 10 } },
  { nom: "Bac de 120 L", v: { longueur: 80, largeur: 35, hauteur: 45, substrat: 5, decor: 10 } },
  { nom: "Bac de 200 L", v: { longueur: 100, largeur: 40, hauteur: 50, substrat: 5, decor: 10 } },
];
const LISTES = BACS.map((b) => {
  const vol = calcVolume(b.v);
  const kit = calcKit(b.v, vol, "communautaire", true);
  const ligne = (poste: string) => kit.find((l) => l.poste === poste)!;
  return { ...b, vol, filtre: ligne("Filtre"), chauffage: ligne("Chauffage"), eclairage: ligne("Éclairage"),
    sol: ligne("Sol nutritif"), sable: ligne("Sable de recouvrement") };
});
const premier = (s: string) => s.split(/[,(]/)[0].trim();

/** Ce que les kits tout-en-un fournissent rarement : la liste du calculateur,
 *  hors bac, filtre, chauffage et éclairage. */
const OUBLIS = calcKit(BACS[1].v, calcVolume(BACS[1].v), "communautaire", true)
  .filter((l) => l.essentiel && !["Aquarium", "Filtre", "Chauffage", "Éclairage", "Sol nutritif", "Sable de recouvrement"].includes(l.poste))
  // La liste est générale : la hauteur du bac type n'a rien à faire ici.
  .map((l) => (l.poste === "Aspirateur à vase" ? { ...l, specif: "Cloche adaptée à la hauteur de votre bac" } : l));

const esp = (id: string) => ESPECES.find((e) => e.id === id)!;
const DEBUT = ["guppy", "platy", "corypanda", "neon"].map(esp);

const FAQ = [
  { q: "Quelle taille d'aquarium pour débuter ?",
    r: "Entre 60 et 120 litres. Plus le volume d'eau est grand, plus les paramètres restent stables et plus une erreur se rattrape. Les nano-aquariums de 20 ou 30 litres paraissent plus simples mais pardonnent moins : une mort non repérée ou un repas en trop suffisent à les déséquilibrer." },
  { q: "Un kit aquarium complet, ça vaut le coup ?",
    r: "Souvent, pour démarrer : le bac, le filtre et l'éclairage sont assortis et se montent sans réflexion. Vérifiez seulement trois points avant l'achat : que le chauffage est inclus, que le débit du filtre correspond au volume réel, et que l'éclairage suffit si vous voulez des plantes. Il faudra de toute façon ajouter les consommables que les kits fournissent rarement." },
  { q: "Combien de temps avant de mettre des poissons ?",
    r: "Trois à six semaines, filtre en marche, le temps que les bactéries s'installent et transforment les déchets. Tant que le test de nitrites n'est pas revenu à zéro, aucune introduction. Les bactéries de démarrage raccourcissent un peu le délai, elles ne le suppriment pas." },
  { q: "Quels poissons choisir pour un premier aquarium ?",
    r: "Des espèces robustes et paisibles, introduites par petits groupes : guppys et platys en pleine eau et en surface, corydoras au fond, en groupe de six au moins. Les néons, très populaires, demandent une eau déjà stable : attendez quelques semaines après le cycle avant de les ajouter." },
  { q: "Faut-il des plantes vivantes ?",
    r: "C'est fortement conseillé. Les plantes consomment une partie des nitrates, concurrencent les algues et abritent les poissons. Pour débuter, choisissez des espèces faciles comme l'anubias, la fougère de Java ou les cryptocorynes, qui se contentent d'un éclairage modeste." },
];

export default function Page() {
  return (
    <>
      <SchemaGuide guide={g} faq={FAQ} />
      <header className="page-head">
        <div className="wrap">
          <nav className="fil">
            <Link href="/">{SITE.nom}</Link> <span>/</span> <Link href="/guides">Guides</Link> <span>/</span> {g.nom}
          </nav>
          <h1>Kit aquarium débutant : que choisir ?</h1>
          <p>
            Pour un premier aquarium, visez 60 à 120 litres. Un kit complet est un bon point de départ,
            à condition de vérifier le chauffage, le débit du filtre et l&apos;éclairage, et d&apos;y ajouter
            ce qu&apos;il ne contient presque jamais : conditionneur d&apos;eau, tests en gouttes, thermomètre et
            aspirateur à vase. Puis trois à six semaines de patience avant le premier poisson.
          </p>
        </div>
      </header>

      <main className="wrap">
        <section className="prose">
          <h2>Kit complet ou matériel à la carte ?</h2>
          <p>
            <b>Le kit complet</b> réunit le bac, souvent son couvercle, un filtre et un éclairage, parfois
            un chauffage. C&apos;est la solution la plus simple pour démarrer : tout est assorti et se monte
            en une soirée. Ses limites tiennent aux éléments fournis : filtre interne au débit parfois juste
            pour le volume réel, éclairage pensé pour voir les poissons plus que pour faire pousser des plantes.
          </p>
          <p>
            <b>Le matériel à la carte</b> laisse choisir chaque pièce à la bonne taille : un filtre externe
            silencieux, une rampe adaptée aux plantes, un chauffage calculé sur votre pièce. Plus long à
            réunir, il vieillit mieux. Une voie médiane fonctionne bien : un bac nu ou un kit simple, et un
            filtre ou un éclairage de meilleure qualité dès le départ.
          </p>
          <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Achat q="kit aquarium complet 60 litres">Voir les kits de 60 L</Achat>
            <Achat q="aquarium 100 litres equipe">Voir les kits de 100 L</Achat>
          </p>
        </section>

        <section className="prose" style={{ maxWidth: "none" }}>
          <h2>Le matériel dimensionné pour trois tailles de bac</h2>
          <p style={{ maxWidth: "72ch" }}>
            Pour un bac communautaire planté. Le volume net est l&apos;eau réellement contenue, une fois le sol
            et le décor en place : c&apos;est sur lui que se calculent le filtre et le chauffage.
          </p>
          <div className="tablewrap card">
            <table>
              <thead>
                <tr><th>Bac</th><th>Filtre</th><th>Chauffage</th><th>Éclairage</th><th>Sol</th><th></th></tr>
              </thead>
              <tbody>
                {LISTES.map((b) => (
                  <tr key={b.nom}>
                    <td><div className="poste">{b.nom}</div><div className="specif">{b.v.longueur} × {b.v.largeur} × {b.v.hauteur} cm, ≈ {Math.round(b.vol.net)} L nets</div></td>
                    <td>{premier(b.filtre.specif).replace("Débit constructeur ", "")}</td>
                    <td>{premier(b.chauffage.specif)}</td>
                    <td>{premier(b.eclairage.specif).replace("Rampe LED ", "Rampe ")}</td>
                    <td className="specif">{b.sol.specif.match(/\d+ kg/)?.[0]} de sol nutritif + {b.sable.specif.match(/\d+ kg/)?.[0]} de sable</td>
                    <td><Achat q={b.filtre.recherche}>Filtre</Achat></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 18, maxWidth: "72ch" }}>
            Votre bac a d&apos;autres dimensions ?{" "}
            <Link href={`/calculateurs/${g.outil}`} className="lnk-u">Le calculateur de kit</Link>{" "}
            donne la liste complète, ligne par ligne, pour vos cotes exactes.
          </p>
        </section>

        <section className="prose">
          <h2>Ce qui manque presque toujours dans un kit</h2>
          <p>
            Les kits fournissent l&apos;équipement, rarement les consommables. Or ce sont eux qui font réussir
            le démarrage : sans conditionneur, le chlore du robinet abîme les branchies ; sans tests en
            gouttes, impossible de savoir quand le cycle est terminé ; sans thermomètre, une panne de
            chauffage passe inaperçue.
          </p>
          <div className="card">
            {OUBLIS.map((l) => (
              <div className="buyrow" key={l.poste}>
                <div className="buytxt"><b>{l.poste}</b><span>{l.specif}</span></div>
                <Achat q={l.recherche}>Voir</Achat>
              </div>
            ))}
          </div>
        </section>

        <section className="prose">
          <h2>Les étapes, de l&apos;achat au premier poisson</h2>
          <p>
            <b>Jour 1 : installation.</b> Bac posé de niveau sur un meuble prévu pour son{" "}
            <Link href="/calculateurs/poids" className="lnk-u">poids en charge</Link>, sol, décor et plantes,
            puis mise en eau avec du conditionneur. Filtre et chauffage en route immédiatement.
          </p>
          <p>
            <b>Semaines 1 à 6 : le cycle de l&apos;azote.</b> Les bactéries colonisent le filtre et apprennent à
            transformer les déchets. Testez les nitrites deux fois par semaine. Tant qu&apos;ils ne sont pas
            revenus à zéro, aucun poisson : c&apos;est l&apos;étape que tout le monde voudrait sauter, et la
            première cause de mortalité chez les débutants.
          </p>
          <p>
            <b>Ensuite : les premiers poissons, par petits groupes.</b> Un premier groupe, puis un autre deux
            ou trois semaines plus tard, pour laisser les bactéries suivre l&apos;augmentation de la charge. Le{" "}
            <Link href="/calculateurs/population" className="lnk-u">calculateur de population</Link> vérifie
            que votre sélection tient dans le bac.
          </p>
          <p>
            <b>Puis chaque semaine :</b> 20 à 25 % d&apos;eau renouvelée, avec une eau conditionnée à la même
            température.
          </p>
        </section>

        <section className="prose">
          <h2>Quels poissons pour commencer ?</h2>
          <p>Des espèces robustes et paisibles, à introduire une fois le cycle terminé :</p>
          <div className="card">
            {DEBUT.map((e) => (
              <div className="buyrow" key={e.id}>
                <div className="buytxt">
                  <b>{e.nom}</b>
                  <span>
                    {e.volumeMin} L nets minimum{e.bancMin > 1 ? `, groupe de ${e.bancMin} au moins` : ""}, {e.tMin} à {e.tMax} °C
                    {e.note ? `. ${e.note}` : ""}.
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 18 }}>
            Le nombre exact dépend du volume et du mélange d&apos;espèces : le{" "}
            <Link href="/calculateurs/population" className="lnk-u">calculateur de population</Link> le donne
            pour votre bac.
          </p>
        </section>

        <section className="prose">
          <h2>Les erreurs de débutant</h2>
          <p>
            Mettre les poissons le jour de l&apos;installation. Choisir un nano-aquarium en pensant que c&apos;est
            plus simple. Acheter le filtre sur le chiffre du carton sans tenir compte du volume réel (le{" "}
            <Link href="/guides/quel-filtre-aquarium" className="lnk-u">guide du filtre</Link> explique pourquoi).
            Poser le bac sur un meuble de salon ordinaire. Et trop nourrir : une pincée que les poissons
            finissent en deux minutes, une à deux fois par jour, suffit.
          </p>
        </section>

        <Faq questions={FAQ} />

        <Epingler chemin={`/guides/${g.slug}`} />

        <section className="prose">
          <h2>Pour aller plus loin</h2>
          <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" href={`/calculateurs/${g.outil}`}>Ma liste de matériel sur mesure</Link>
            <Link className="btn btn-sec" href="/guides/quel-filtre-aquarium">Le guide du filtre</Link>
            <Link className="btn btn-sec" href="/guides/quel-chauffage-aquarium">Le guide du chauffage</Link>
          </p>
        </section>
      </main>
    </>
  );
}
