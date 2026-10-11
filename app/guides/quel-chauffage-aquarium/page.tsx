import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";
import { calcChauffage } from "@/lib/aqua";
import { Achat } from "@/components/ui";
import { Faq } from "@/components/Contenu";
import { SchemaGuide } from "@/components/Schema";

const g = GUIDES.find((x) => x.slug === "quel-chauffage-aquarium")!;

export const metadata: Metadata = {
  title: g.titre,
  description: g.description,
  alternates: { canonical: `/guides/${g.slug}` },
  openGraph: {
    title: g.titre, description: g.description, type: "article", siteName: SITE.nom, locale: "fr_FR",
    images: [{ url: g.image, width: 1000, height: 1500, alt: g.titre }],
  },
};

const CIBLE = 25;
const PIECES = [21, 19, 16];

/** Volumes commerciaux et volume net approximatif (un cinquième de moins, voir
 *  le calculateur de volume). Les puissances viennent de la même formule que le
 *  calculateur de chauffage, pour que les deux pages ne se contredisent pas. */
const BACS = [
  { bac: "Nano 20 à 30 L", net: 20 },
  { bac: "54 à 60 L", net: 45 },
  { bac: "100 L", net: 80 },
  { bac: "150 L", net: 120 },
  { bac: "200 L", net: 160 },
  { bac: "300 L", net: 240 },
].map((b) => ({ ...b, cols: PIECES.map((t) => calcChauffage(b.net, t, CIBLE)) }));

const watts = (c: ReturnType<typeof calcChauffage>) => (c.nombre > 1 ? `${c.nombre} × ${c.palier} W` : `${c.palier} W`);
const B100 = BACS[2].cols;
const B200 = BACS[4].cols;

const TYPES = [
  {
    nom: "La résistance plongeante à thermostat",
    pour: "Le choix par défaut, de 20 à 300 L",
    txt: "Un tube de verre ou de plastique qui contient la résistance et son thermostat, fixé à la vitre par des ventouses. C'est le modèle vendu dans presque tous les kits : simple, peu coûteux, réglable par une molette graduée. Préférez une gaine incassable et un arrêt automatique hors de l'eau, qui évite l'éclatement si le niveau baisse.",
    q: "chauffage aquarium thermostat",
  },
  {
    nom: "Le chauffage externe en ligne",
    pour: "Bacs équipés d'un filtre externe",
    txt: "Il se branche sur le tuyau de retour du filtre externe, dans le meuble. Rien de visible dans le bac, et la chaleur est répartie par le courant du filtre. Il impose un filtre externe et des tuyaux du bon diamètre.",
    q: "chauffage externe aquarium filtre",
  },
  {
    nom: "Le thermostat séparé",
    pour: "Bacs coûteux, crevettes, éleveurs",
    txt: "Un boîtier qui mesure la température par sa propre sonde et coupe la résistance. Le thermostat d'une résistance dérive avec les années et reste coincé en position allumée quand il lâche : un boîtier séparé ajoute une sécurité indépendante, utile dès que les habitants valent cher.",
    q: "thermostat aquarium sonde",
  },
  {
    nom: "Le câble chauffant de sol",
    pour: "Bacs plantés, en complément",
    txt: "Posé sous le substrat, il entretient une légère circulation d'eau dans le sol, appréciée des racines. Sa puissance est faible : il complète une résistance, il ne la remplace pas.",
    q: "cable chauffant aquarium",
  },
];

const FAQ = [
  { q: "Quelle puissance de chauffage pour un aquarium de 100 litres ?",
    r: `Un bac vendu 100 L contient environ 80 L d'eau. Pour le tenir à ${CIBLE} °C, il faut un modèle de ${watts(B100[0])} si la pièce reste à 21 °C l'hiver, ${watts(B100[1])} si elle descend à 19 °C, et ${watts(B100[2])} si elle tombe à 16 °C. C'est l'écart entre la pièce et l'eau qui commande, pas le volume seul.` },
  { q: "Quelle puissance pour un aquarium de 200 litres ?",
    r: `Environ 160 L nets : ${watts(B200[0])} dans une pièce à 21 °C, ${watts(B200[1])} à 19 °C, ${watts(B200[2])} à 16 °C. Au-delà de 250 L nets, deux résistances de puissance moitié placées aux deux extrémités valent mieux qu'une seule.` },
  { q: "Un chauffage trop puissant est-il dangereux ?",
    r: "Un léger surdimensionnement ne pose pas de problème : le thermostat coupe plus tôt. Le risque apparaît quand le thermostat reste bloqué en position allumée, la panne la plus fréquente : une résistance très puissante dans un petit bac le surchauffe alors en quelques heures. C'est pourquoi on reste au palier juste supérieur au besoin, et qu'un thermomètre indépendant est indispensable." },
  { q: "Faut-il laisser le chauffage branché en été ?",
    r: "Oui. Il tient une consigne et ne se déclenche simplement pas quand l'eau est assez chaude. Le problème d'été est inverse : au-delà de 29 °C, un ventilateur de surface et un éclairage réduit font baisser la température." },
  { q: "Combien de temps attendre avant de brancher un chauffage neuf ?",
    r: "Immergez-le une vingtaine de minutes avant de le brancher, le temps que le verre et le thermostat se mettent à la température de l'eau. Pour le sortir, faites l'inverse : débranchez, attendez qu'il refroidisse dans l'eau, puis retirez-le. Un tube chaud sorti à l'air peut éclater." },
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
          <h1>Quel chauffage pour votre aquarium ?</h1>
          <p>
            La puissance ne dépend pas que du volume : elle dépend surtout de l&apos;écart entre la pièce, la
            nuit en hiver, et l&apos;eau. Comptez environ 0,15 watt par litre net et par degré d&apos;écart, puis
            prenez le palier du commerce juste au-dessus. Un même bac de 100 L demande 50 W dans un salon
            chauffé et 150 W dans une pièce qui descend à 16 °C.
          </p>
        </div>
      </header>

      <main className="wrap">
        <section className="prose" style={{ maxWidth: "none" }}>
          <h2>La puissance à acheter, selon votre bac et votre pièce</h2>
          <p style={{ maxWidth: "72ch" }}>
            Pour une eau à {CIBLE} °C, selon la température la plus basse de la pièce en hiver. Ce sont des
            paliers du commerce, pas des besoins bruts.
          </p>
          <div className="tablewrap card">
            <table>
              <thead>
                <tr><th>Bac</th>{PIECES.map((t) => <th key={t}>Pièce à {t} °C</th>)}<th></th></tr>
              </thead>
              <tbody>
                {BACS.map((b) => (
                  <tr key={b.bac}>
                    <td><div className="poste">{b.bac}</div><div className="specif">≈ {b.net} L nets</div></td>
                    {b.cols.map((c, k) => <td key={k}>{k === 1 ? <b>{watts(c)}</b> : watts(c)}</td>)}
                    <td><Achat q={`chauffage aquarium ${b.cols[1].palier}w thermostat`}>Voir</Achat></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 18, maxWidth: "72ch" }}>
            Votre pièce est plus froide, ou vous visez une autre température ?{" "}
            <Link href={`/calculateurs/${g.outil}`} className="lnk-u">Le calculateur de chauffage</Link>{" "}
            donne la puissance pour vos cotes, votre pièce et votre consigne.
          </p>
        </section>

        <section className="prose">
          <h2>Pourquoi la pièce compte plus que le volume</h2>
          <p>
            Un aquarium perd sa chaleur par les vitres et par la surface de l&apos;eau, d&apos;autant plus vite que
            l&apos;air autour est froid. Le chauffage ne sert qu&apos;à compenser cette perte. Dans un salon à 21 °C,
            il n&apos;a que quatre degrés à tenir ; dans une chambre ou une véranda qui descend à 16 °C, il en a
            neuf, et doit être plus de deux fois plus puissant pour le même bac.
          </p>
          <p>
            Prenez la température la plus basse de l&apos;année, celle des nuits de janvier, pas la moyenne.
            Un chauffage calculé sur la moyenne tourne en continu les nuits froides sans jamais tenir la
            consigne, et c&apos;est précisément là qu&apos;il s&apos;use et finit par lâcher.
          </p>
        </section>

        <section className="prose">
          <h2>Les types de chauffage</h2>
          {TYPES.map((t) => (
            <div key={t.nom} style={{ marginBottom: 26 }}>
              <h3 style={{ margin: "0 0 4px" }}>{t.nom}</h3>
              <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 14 }}>{t.pour}</p>
              <p>{t.txt}</p>
              <Achat q={t.q}>Voir les modèles</Achat>
            </div>
          ))}
        </section>

        <section className="prose">
          <h2>Les critères qui comptent, après la puissance</h2>
          <p>
            <b>Un thermostat lisible et réglable.</b> Une molette graduée en degrés, plutôt qu&apos;un réglage
            par signes plus et moins, permet de viser une consigne précise et de la retrouver après un
            nettoyage.
          </p>
          <p>
            <b>Les sécurités.</b> Arrêt automatique hors de l&apos;eau, gaine incassable, et pour les gros
            poissons un cache qui évite les brûlures quand ils se frottent contre le tube.
          </p>
          <p>
            <b>La longueur.</b> Le chauffage doit tenir dans la hauteur d&apos;eau, en position inclinée près du
            fond. Un modèle trop long pour un bac bas reste en partie hors de l&apos;eau, ce qui fausse son
            thermostat et use sa résistance.
          </p>
          <p>
            <b>Un thermomètre indépendant.</b> Le cadran du chauffage indique une consigne, pas une mesure.
            Seul un thermomètre séparé dit la température réelle, et révèle un thermostat qui dérive avant
            qu&apos;il ne cuise le bac.
          </p>
          <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Achat q="thermometre aquarium">Voir les thermomètres</Achat>
            <Achat q="ventilateur aquarium refroidissement">Voir les ventilateurs pour l&apos;été</Achat>
          </p>
        </section>

        <section className="prose">
          <h2>Bien le placer, et les erreurs à éviter</h2>
          <p>
            Placez-le dans une zone de courant, près du rejet ou de la crépine du filtre, pour que la chaleur
            se répartisse au lieu de stagner. Jamais enfoui dans le sol, jamais collé contre une vitre.
            Au-delà de 250 litres, deux chauffages de puissance moitié aux deux extrémités du bac valent mieux
            qu&apos;un seul : la chaleur est homogène, et une panne ne laisse pas le bac sans chauffage.
          </p>
          <p>
            Les erreurs qui coûtent cher : acheter sur le volume en oubliant la pièce, sortir un chauffage
            branché ou encore chaud (le verre éclate), et se fier au cadran sans thermomètre. Le chauffage
            est aussi le matériel qui tombe le plus souvent en panne : un modèle de rechange dans un tiroir
            évite de perdre une population lors d&apos;une nuit d&apos;hiver.
          </p>
        </section>

        <Faq questions={FAQ} />

        <section className="prose">
          <h2>Pour aller plus loin</h2>
          <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" href={`/calculateurs/${g.outil}`}>Calculer la puissance pour mon bac</Link>
            <Link className="btn btn-sec" href="/guides/quel-filtre-aquarium">Le guide du filtre</Link>
            <Link className="btn btn-sec" href="/calculateurs/kit">Tout le matériel pour démarrer</Link>
          </p>
        </section>
      </main>
    </>
  );
}
