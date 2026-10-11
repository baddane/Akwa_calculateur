import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";
import { calcFiltration } from "@/lib/aqua";
import { Achat } from "@/components/ui";
import { Faq } from "@/components/Contenu";
import { SchemaGuide } from "@/components/Schema";

const g = GUIDES.find((x) => x.slug === "quel-filtre-aquarium")!;

export const metadata: Metadata = {
  title: g.titre,
  description: g.description,
  alternates: { canonical: `/guides/${g.slug}` },
  openGraph: { title: g.titre, description: g.description, type: "article" },
};

/** Volumes commerciaux courants et leur volume net approximatif : un bac perd
 *  couramment un cinquième de sa contenance (rebord, sol, décor), voir le
 *  calculateur de volume. Les débits viennent de la même formule que le
 *  calculateur de filtration, pour que les deux pages ne se contredisent pas. */
const BACS = [
  { bac: "Nano 20 à 30 L", net: 20, type: "Éponge sur bulleur ou petit filtre interne", q: "filtre interne aquarium nano" },
  { bac: "54 à 60 L", net: 45, type: "Interne ou cascade", q: "filtre interne aquarium 60 litres" },
  { bac: "100 L", net: 80, type: "Interne puissant ou externe", q: "filtre exterieur aquarium 100 litres" },
  { bac: "150 L", net: 120, type: "Externe", q: "filtre exterieur aquarium 150 litres" },
  { bac: "200 L", net: 160, type: "Externe", q: "filtre exterieur aquarium 200 litres" },
  { bac: "300 L", net: 240, type: "Externe, ou deux filtres", q: "filtre exterieur aquarium 300 litres" },
].map((b) => ({
  ...b,
  calme: calcFiltration(b.net, "crevettes").constructeur,
  commu: calcFiltration(b.net, "communautaire").constructeur,
  forte: calcFiltration(b.net, "forte").constructeur,
}));

const TYPES = [
  {
    nom: "Le filtre interne",
    pour: "Bacs de 20 à 120 L",
    txt: "Un bloc moteur et une cartouche de mousse immergés dans un coin du bac. C'est le moins cher et le plus simple à installer, souvent fourni dans les kits. Ses limites : il occupe de la place dans le bac, son volume de masse filtrante est petit, et il faut le sortir de l'eau pour l'entretenir.",
    q: "filtre interne aquarium",
  },
  {
    nom: "Le filtre externe",
    pour: "Bacs de 100 L et plus, bacs plantés",
    txt: "Une cuve posée dans le meuble, reliée au bac par deux tuyaux. Elle contient plusieurs paniers de masses filtrantes : c'est le filtre le plus efficace et le plus silencieux, et le seul qui laisse le bac entièrement libre. Plus cher, il demande un meuble avec de la place en dessous et des raccords à vanne pour l'entretien.",
    q: "filtre exterieur aquarium",
  },
  {
    nom: "Le filtre à cascade",
    pour: "Bacs de 20 à 150 L, ouverts",
    txt: "Accroché au bord du bac, il pompe l'eau et la renvoie en chute. L'entretien se fait sans rien démonter dans l'eau et la chute oxygène bien. En contrepartie, le bruit de l'eau qui retombe dérange dans une chambre, et il faut un couvercle découpé ou un bac ouvert.",
    q: "filtre cascade aquarium",
  },
  {
    nom: "Le filtre éponge sur bulleur",
    pour: "Bacs à crevettes, alevins, nano",
    txt: "Une éponge traversée par l'air d'un bulleur. Le courant est faible et aucune crevette ni aucun alevin ne peut être aspiré : c'est le filtre de référence des bacs d'élevage. Il ne suffit pas seul au-delà d'une soixantaine de litres peuplés de poissons.",
    q: "filtre eponge aquarium bulleur",
  },
];

const FAQ = [
  { q: "Quel débit de filtre pour un aquarium de 100 litres ?",
    r: `Un bac vendu 100 L contient environ 80 L d'eau une fois installé. Pour un communautaire classique, visez 4 brassages par heure, soit 320 L/h réels : cherchez un filtre annoncé autour de ${BACS[2].commu} L/h, car le débit du carton est mesuré à vide et chute d'environ un tiers une fois le filtre garni.` },
  { q: "Filtre interne ou externe, lequel choisir ?",
    r: "En dessous de 100 L, un bon filtre interne suffit. Au-delà, ou pour un bac planté, le filtre externe l'emporte : plus de masse filtrante, moins de bruit, et rien dans le bac. Entre les deux, le choix dépend surtout de la place disponible dans le meuble." },
  { q: "Un filtre trop puissant, est-ce grave ?",
    r: "Rarement, tant qu'il est réglable. Un filtre surdimensionné se bride avec sa vanne ou en orientant la sortie contre une vitre. Un filtre trop faible, lui, ne se rattrape jamais. Seuls les bettas, les crevettes et les alevins réclament un courant doux, avec une crépine protégée par une mousse." },
  { q: "Peut-on éteindre le filtre la nuit ?",
    r: "Non. Les bactéries qui transforment l'ammoniaque vivent dans les masses filtrantes et ont besoin d'un courant d'eau oxygénée en continu. Quelques heures d'arrêt suffisent à en tuer une partie, et l'eau stagnante du filtre relâche des toxiques au redémarrage." },
  { q: "Tous les combien nettoyer le filtre ?",
    r: "Rincez la mousse grossière toutes les deux à quatre semaines, dans l'eau retirée du bac lors du changement d'eau, jamais sous le robinet : le chlore tue les bactéries utiles. Ne touchez aux masses biologiques (céramiques) qu'en cas de baisse nette du débit, et jamais en même temps que la mousse." },
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
          <h1>Quel filtre pour votre aquarium ?</h1>
          <p>
            Deux chiffres décident de tout : le volume d&apos;eau réel de votre bac, et le débit du filtre
            une fois garni, pas celui du carton. Pour un aquarium communautaire, visez quatre fois le
            volume net par heure, puis choisissez un modèle annoncé environ une fois et demie
            au-dessus. Le type de filtre se choisit ensuite selon la taille du bac et vos habitants.
          </p>
        </div>
      </header>

      <main className="wrap">
        <section className="prose" style={{ maxWidth: "none" }}>
          <h2>Le débit à lire sur la boîte, selon votre bac</h2>
          <p style={{ maxWidth: "72ch" }}>
            Débit constructeur à viser, déjà corrigé de la perte due aux masses filtrantes. « Calme »
            convient aux bacs à crevettes et aux bacs plantés peu peuplés, « forte charge » aux
            cichlidés, poissons rouges et gros mangeurs.
          </p>
          <div className="tablewrap card">
            <table>
              <thead>
                <tr><th>Bac</th><th>Calme</th><th>Communautaire</th><th>Forte charge</th><th>Type conseillé</th><th></th></tr>
              </thead>
              <tbody>
                {BACS.map((b) => (
                  <tr key={b.bac}>
                    <td><div className="poste">{b.bac}</div><div className="specif">≈ {b.net} L nets</div></td>
                    <td>{b.calme} L/h</td>
                    <td><b>{b.commu} L/h</b></td>
                    <td>{b.forte} L/h</td>
                    <td className="specif">{b.type}</td>
                    <td><Achat q={b.q}>Voir</Achat></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 18, maxWidth: "72ch" }}>
            Votre bac n&apos;est pas dans la liste, ou vous connaissez ses dimensions exactes ?{" "}
            <Link href={`/calculateurs/${g.outil}`} className="lnk-u">Le calculateur de filtration</Link>{" "}
            donne le débit pour vos cotes et votre population.
          </p>
        </section>

        <section className="prose">
          <h2>Pourquoi le débit du carton ne suffit pas</h2>
          <p>
            Les fabricants mesurent le débit pompe nue, sans mousse, sans céramique, sans tuyau. Une fois
            le filtre garni, puis encrassé au fil des semaines, il en reste environ deux tiers. Un filtre
            annoncé 600 L/h débite donc autour de 400 L/h dans votre bac. C&apos;est l&apos;erreur d&apos;achat la plus
            répandue : on choisit le modèle dont le chiffre égale quatre fois le volume, et le bac se
            retrouve sous-filtré dès le premier mois.
          </p>
          <p>
            Le second piège est le volume lui-même. Un bac vendu 100 L n&apos;en contient pas 100 : le niveau
            d&apos;eau s&apos;arrête sous le rebord, le sol et le décor prennent leur place. Le{" "}
            <Link href="/calculateurs/volume" className="lnk-u">calculateur de volume</Link> donne le chiffre net.
          </p>
        </section>

        <section className="prose">
          <h2>Les quatre types de filtres</h2>
          {TYPES.map((t) => (
            <div key={t.nom} style={{ marginBottom: 26 }}>
              <h3 style={{ margin: "0 0 4px" }}>{t.nom}</h3>
              <p className="specif" style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 14 }}>{t.pour}</p>
              <p>{t.txt}</p>
              <Achat q={t.q}>Voir les modèles</Achat>
            </div>
          ))}
        </section>

        <section className="prose">
          <h2>Les critères qui comptent, après le débit</h2>
          <p>
            <b>Le volume de masse filtrante.</b> C&apos;est dans les mousses et les céramiques que vivent les
            bactéries qui transforment les déchets des poissons. Plus les paniers sont grands, plus la
            colonie est stable et mieux elle encaisse un nettoyage ou un repas trop copieux. À débit égal,
            préférez le modèle qui contient le plus de masse.
          </p>
          <p>
            <b>Le réglage du débit.</b> Une vanne ou un variateur permet d&apos;acheter un peu grand et de
            brider ensuite. Sans réglage, un filtre trop puissant pour un bac à bettas ou à crevettes reste
            trop puissant.
          </p>
          <p>
            <b>Le bruit.</b> Un filtre tourne jour et nuit. Les externes sont les plus silencieux, les
            cascades les plus audibles à cause de la chute d&apos;eau. Si le bac est dans une chambre, c&apos;est
            un critère à part entière.
          </p>
          <p>
            <b>L&apos;entretien.</b> Préfiltre facile d&apos;accès, raccords à vanne qui permettent de débrancher
            sans vider les tuyaux, pièces détachées (joint, rotor) vendues séparément : ce sont eux qui
            font qu&apos;un filtre dure dix ans plutôt que trois.
          </p>
          <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Achat q="masse filtrante ceramique aquarium">Voir les masses filtrantes</Achat>
            <Achat q="mousse filtrante aquarium">Voir les mousses</Achat>
          </p>
        </section>

        <section className="prose">
          <h2>Les erreurs à éviter</h2>
          <p>
            Rincer les mousses sous le robinet : le chlore détruit la colonie bactérienne, et le bac repart
            comme au premier jour. Changer toutes les masses d&apos;un coup, pour la même raison. Éteindre le
            filtre la nuit pour le bruit. Et installer le filtre le jour où arrivent les poissons : il lui
            faut trois à six semaines de{" "}
            <Link href="/calculateurs/kit" className="lnk-u">cycle de l&apos;azote</Link> avant d&apos;être efficace.
          </p>
        </section>

        <Faq questions={FAQ} />

        <section className="prose">
          <h2>Pour aller plus loin</h2>
          <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" href={`/calculateurs/${g.outil}`}>Calculer le débit pour mon bac</Link>
            <Link className="btn btn-sec" href="/calculateurs/kit">Tout le matériel pour démarrer</Link>
          </p>
        </section>
      </main>
    </>
  );
}
