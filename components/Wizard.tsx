"use client";

import { useMemo, useState } from "react";
import {
  ESPECES, calcVolume, calcPopulation, calcFiltration, calcKit,
  type Profil, type Stock, type VolumeInput,
} from "@/lib/aqua";
import { amz } from "@/lib/amazon";
import TankView from "./TankView";
import { Fish } from "./Aqua";
import Link from "next/link";

type Depart = "zero" | "bac";
const ETAPES = ["Point de départ", "Taille du bac", "Type de bac", "Poissons", "Votre liste"];

const TAILLES: { id: string; label: string; sous: string; dim: [number, number, number] }[] = [
  { id: "60",  label: "60 cm", sous: "Nano, environ 55 L bruts",       dim: [60, 30, 36] },
  { id: "80",  label: "80 cm", sous: "Le format le plus courant",      dim: [80, 35, 45] },
  { id: "100", label: "100 cm", sous: "Confortable, environ 200 L",    dim: [100, 40, 50] },
  { id: "120", label: "120 cm", sous: "Grand bac, environ 300 L",      dim: [120, 50, 50] },
];

const TYPES: { id: string; label: string; sous: string; profil: Profil; plante: boolean }[] = [
  { id: "planté",  label: "Communautaire planté", sous: "Le classique. Petits bancs et plantes vivantes.", profil: "communautaire", plante: true },
  { id: "crevettes", label: "Crevettes et nano-poissons", sous: "Bac calme, faible charge, filtration douce.", profil: "crevettes", plante: true },
  { id: "betta",   label: "Un combattant seul",   sous: "Un mâle unique, éventuellement des escargots.", profil: "crevettes", plante: true },
  { id: "grands",  label: "Grands poissons",      sous: "Scalaires, cichlidés nains, gros mangeurs.", profil: "forte", plante: false },
];

export default function Wizard() {
  const [etape, setEtape] = useState(0);
  const [depart, setDepart] = useState<Depart>("zero");
  const [taille, setTaille] = useState("80");
  const [sur, setSur] = useState(false);            // dimensions sur mesure
  const [dim, setDim] = useState<[number, number, number]>([80, 35, 45]);
  const [type, setType] = useState("planté");
  const [stock, setStock] = useState<Record<string, number>>({});

  const typeSel = TYPES.find((t) => t.id === type)!;
  const bac: VolumeInput = {
    longueur: dim[0], largeur: dim[1], hauteur: dim[2],
    substrat: typeSel.plante ? 6 : 4, decor: 10,
  };
  const vol = useMemo(() => calcVolume(bac), [dim, typeSel.plante]);
  const stockList: Stock[] = useMemo(
    () => Object.entries(stock).map(([id, nb]) => ({ id, nb })).filter((s) => s.nb > 0), [stock]);
  const pop = useMemo(() => calcPopulation(vol.net, stockList), [vol.net, stockList]);
  const filtre = useMemo(() => calcFiltration(vol.net, typeSel.profil), [vol.net, typeSel.profil]);
  const kit = useMemo(() => calcKit(bac, vol, typeSel.profil, typeSel.plante), [bac, vol, typeSel]);

  // Seules les espèces que le volume accepte, pour ne jamais proposer l'impossible
  const possibles = useMemo(
    () => ESPECES.filter((e) => e.volumeMin <= vol.net)
      .sort((a, b) => a.zone.localeCompare(b.zone) || a.taille - b.taille),
    [vol.net]);

  const lignes = depart === "bac" ? kit.filter((l) => l.poste !== "Aquarium") : kit;
  const surcharge = pop.taux > 1;
  const conflitTemp = pop.tempMin !== null && pop.tempMax !== null && pop.tempMin > pop.tempMax;

  const choisirTaille = (t: typeof TAILLES[number]) => { setTaille(t.id); setSur(false); setDim(t.dim); setStock({}); };
  const majDim = (i: number, v: number) =>
    setDim((d) => { const n = [...d] as [number, number, number]; n[i] = Math.max(0, v); return n; });

  const toggle = (id: string, bancMin: number) =>
    setStock((s) => ({ ...s, [id]: (s[id] ?? 0) > 0 ? 0 : Math.max(1, bancMin) }));

  return (
    <section className="wiz">
      <ol className="steps">
        {ETAPES.map((e, i) => (
          <li key={e} className={i === etape ? "on" : i < etape ? "done" : ""}>
            <span className="dot">{i < etape ? "✓" : i + 1}</span><span className="lbl">{e}</span>
          </li>
        ))}
      </ol>

      <div className="wiz-body">
        {etape === 0 && (
          <>
            <h2>Vous partez de quoi ?</h2>
            <p className="wiz-sub">Cela détermine si votre liste doit inclure le bac lui-même.</p>
            <div className="choices">
              {([["zero", "Je pars de zéro", "Je n'ai encore rien acheté."],
                 ["bac", "J'ai déjà le bac", "Il me manque l'équipement."]] as const).map(([id, t, s]) => (
                <button key={id} className={depart === id ? "choice on" : "choice"} onClick={() => setDepart(id)}>
                  <b>{t}</b><span>{s}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {etape === 1 && (
          <>
            <h2>Quelle taille de bac ?</h2>
            <p className="wiz-sub">La taille décide de tout le reste : ce que vous pourrez y mettre, et le matériel qu&apos;il faudra.</p>
            <div className="choices">
              {TAILLES.map((t) => (
                <button key={t.id} className={!sur && taille === t.id ? "choice on" : "choice"} onClick={() => choisirTaille(t)}>
                  <b>{t.label}</b><span>{t.sous}</span>
                </button>
              ))}
              <button className={sur ? "choice on" : "choice"} onClick={() => setSur(true)}>
                <b>Dimensions précises</b><span>Je connais mes mesures exactes.</span>
              </button>
            </div>
            {sur && (
              <div className="row" style={{ marginTop: 18, maxWidth: 380 }}>
                {["Longueur", "Largeur", "Hauteur"].map((l, i) => (
                  <div className="field" key={l}>
                    <label>{l} (cm)</label>
                    <input type="number" min={0} value={dim[i]} onChange={(e) => majDim(i, Number(e.target.value) || 0)} />
                  </div>
                ))}
              </div>
            )}
            <p className="wiz-out">Volume net utile : <b>{vol.net} L</b> <span>sur {vol.brut} L bruts</span></p>
          </>
        )}

        {etape === 2 && (
          <>
            <h2>Quel type de bac voulez-vous ?</h2>
            <p className="wiz-sub">Ce choix fixe la filtration, le substrat et les espèces proposées ensuite.</p>
            <div className="choices">
              {TYPES.map((t) => (
                <button key={t.id} className={type === t.id ? "choice on" : "choice"}
                  onClick={() => { setType(t.id); setStock({}); }}>
                  <b>{t.label}</b><span>{t.sous}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {etape === 3 && (
          <>
            <h2>Quels poissons vous attirent ?</h2>
            <p className="wiz-sub">
              Seules les espèces que {vol.net} L peuvent accueillir sont affichées. Un clic ajoute
              directement l&apos;effectif minimum, parce qu&apos;un poisson de banc seul dépérit.
            </p>
            <div className="picks">
              {possibles.map((e) => (
                <button key={e.id} className={(stock[e.id] ?? 0) > 0 ? "pick on" : "pick"}
                  onClick={() => toggle(e.id, e.bancMin)}>
                  <Fish shape={e.shape} size={20} />
                  <b>{e.nom}</b>
                  <span>{e.bancMin > 1 ? `banc de ${e.bancMin}` : "solitaire"} · {e.zone.toLowerCase()}</span>
                  {(stock[e.id] ?? 0) > 0 && <em>{stock[e.id]}</em>}
                </button>
              ))}
            </div>
            <div className="wiz-gauge">
              <div className="bar">
                <span style={{ width: `${Math.min(100, pop.taux * 100)}%`,
                  background: surcharge ? "var(--danger)" : pop.taux > 0.7 ? "var(--warn)" : "var(--ok)" }} />
              </div>
              <p className="wiz-out">
                Occupation : <b>{Math.round(pop.taux * 100)} %</b>
                {surcharge && <span className="ko"> Trop chargé, retirez une espèce.</span>}
                {!surcharge && conflitTemp && <span className="ko"> Températures incompatibles.</span>}
                {!surcharge && !conflitTemp && pop.tempMin !== null &&
                  <span> Chauffage à régler entre {pop.tempMin} et {pop.tempMax} °C.</span>}
              </p>
            </div>
          </>
        )}

        {etape === 4 && (
          <>
            <h2>Votre bac, et ce qu&apos;il faut pour le monter</h2>
            <TankView longueur={dim[0]} largeur={dim[1]} hauteur={dim[2]} substrat={bac.substrat} stock={stockList} />
            <div className="stats" style={{ marginBottom: 18 }}>
              <div className="stat lead"><div className="k">Volume net</div><div className="v">{vol.net}<span className="u">L</span></div></div>
              <div className="stat"><div className="k">Filtre à viser</div><div className="v">{filtre.constructeur}<span className="u">L/h</span></div></div>
              <div className="stat"><div className="k">Occupation</div><div className="v">{Math.round(pop.taux * 100)}<span className="u">%</span></div></div>
            </div>

            {(surcharge || conflitTemp || pop.alertes.length > 0) && (
              <ul className="alerts">
                {surcharge && <li>Le bac est surpeuplé. Réduisez avant d&apos;acheter, pas après.</li>}
                {conflitTemp && <li>Ces espèces n&apos;ont aucune température commune.</li>}
                {pop.alertes.slice(0, 4).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            )}

            <div className="buylist">
              <div className="buylist-head">
                <h3>Liste de matériel</h3>
                <span>{lignes.filter((l) => l.essentiel).length} postes indispensables</span>
              </div>
              {lignes.map((l, i) => (
                <div className="buyrow" key={i}>
                  <div>
                    <b>{l.poste}{!l.essentiel && <em> · confort</em>}</b>
                    <span>{l.specif}</span>
                  </div>
                  <a className="btn" href={amz(l.recherche)} target="_blank" rel="sponsored nofollow noopener">Voir</a>
                </div>
              ))}
              <a className="btn btn-xl" href={amz(lignes[0]?.recherche ?? "aquarium eau douce")}
                target="_blank" rel="sponsored nofollow noopener">
                Commencer par le {lignes[0]?.poste.toLowerCase()} sur Amazon
              </a>
              <p className="hint" style={{ textAlign: "center" }}>
                Ouvrez chaque ligne dans un onglet, puis validez un seul panier. Lien affilié : le prix
                pour vous est identique.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="wiz-nav">
        <button className="lnk" onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0}>
          Retour
        </button>
        {etape < 4 ? (
          <button className="btn btn-lg" onClick={() => setEtape((e) => e + 1)}
            disabled={etape === 3 && stockList.length === 0}>
            {etape === 3 ? "Voir ma liste" : "Continuer"}
          </button>
        ) : (
          <button className="lnk" onClick={() => { setEtape(0); setStock({}); }}>Recommencer</button>
        )}
      </div>

      <p className="wiz-esc">
        Vous savez déjà ce que vous cherchez ?{" "}
        <Link className="lnk-u" href="/calculateurs">Allez droit au calculateur qu&apos;il vous faut</Link>
      </p>
    </section>
  );
}
