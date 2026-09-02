"use client";

import { useMemo, useState } from "react";
import {
  calcVolume, calcPoids, calcSubstrat, calcVerre, MATERIAUX,
} from "@/lib/aqua";
import { useTank } from "../useTank";
import { Champ, Stat, Verdict, Achat } from "../ui";
import TankView from "../TankView";
import Link from "next/link";

function Dims({ bac, set, avecSol = true }: { bac: ReturnType<typeof useTank>["bac"]; set: ReturnType<typeof useTank>["set"]; avecSol?: boolean }) {
  return (
    <>
      <div className="row">
        <Champ id="lo" label="Longueur" valeur={bac.longueur} onChange={set("longueur")} />
        <Champ id="la" label="Largeur" valeur={bac.largeur} onChange={set("largeur")} />
        <Champ id="ha" label="Hauteur" valeur={bac.hauteur} onChange={set("hauteur")} />
      </div>
      <p className="hint">Dimensions intérieures en centimètres. Elles vous suivent d&apos;un calculateur à l&apos;autre.</p>
      {avecSol && <Champ id="su" label="Épaisseur du substrat (cm)" valeur={bac.substrat} onChange={set("substrat")} />}
    </>
  );
}

export function Volume() {
  const { bac, set } = useTank();
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const perte = vol.brut > 0 ? Math.round((1 - vol.net / vol.brut) * 100) : 0;
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac</h2>
        <Dims bac={bac} set={set} />
        <Champ id="de" label="Volume occupé par le décor (%)" valeur={bac.decor} onChange={set("decor")}
          hint="Roches, racines et gros éléments. 10 % pour un bac planté classique." />
      </div>
      <div className="card">
        <TankView longueur={bac.longueur} largeur={bac.largeur} hauteur={bac.hauteur} substrat={bac.substrat} />
        <div className="stats">
          <Stat k="Volume brut" v={vol.brut} u="L" />
          <Stat k="Volume net utile" v={vol.net} u="L" lead />
          <Stat k="Surface d'eau" v={vol.surfaceEau} u="dm²" />
        </div>
        <p className="note">
          Vous perdez <b>{perte} %</b> entre l&apos;étiquette et la réalité : {vol.margeHaut} cm de marge sous
          le rebord, {bac.substrat} cm de substrat et {bac.decor} % de décor. La surface d&apos;eau compte
          autant que le volume, c&apos;est par elle que se font les échanges gazeux.
        </p>
        <p style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Achat q={`aquarium ${Math.round(vol.brut)} litres equipe`}>Voir les bacs de {Math.round(vol.brut)} L</Achat>
          <Link className="btn btn-sec" href="/calculateurs/kit">Le matériel pour {vol.net} L</Link>
        </p>
      </div>
    </div>
  );
}

export function Poids() {
  const { bac, set } = useTank();
  const [ep, setEp] = useState(8);
  const [decor, setDecor] = useState(10);
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const p = useMemo(() => calcPoids(bac, vol, ep, decor), [bac, vol, ep, decor]);
  // Le kg/m² d'un bac dépasse toujours 350 : c'est la charge totale qui décide
  // si un plancher mérite un examen, pas la pression sous une petite emprise.
  const lourd = p.total > 200;
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac</h2>
        <Dims bac={bac} set={set} />
        <Champ id="ep" label="Épaisseur du verre (mm)" valeur={ep} onChange={(e) => setEp(Math.max(0, Number(e.target.value) || 0))} />
        <Champ id="dk" label="Roches et racines (kg)" valeur={decor} onChange={(e) => setDecor(Math.max(0, Number(e.target.value) || 0))} />
      </div>
      <div className="card">
        <h2>Poids en charge</h2>
        <div className="stats">
          <Stat k="Verre" v={p.verre} u="kg" />
          <Stat k="Eau" v={p.eau} u="kg" />
          <Stat k="Substrat" v={p.sol} u="kg" />
          <Stat k="Total" v={p.total} u="kg" lead />
        </div>
        <p style={{ marginTop: 16 }}>
          <Verdict mot={`${p.total} kg au total, ${p.auSol} kg par m²`} ton={lourd ? "warn" : "ok"} />
        </p>
        <p className="note">
          {lourd
            ? "Au-delà de 200 kg, un plancher bois ancien mérite d'être regardé de près, et le bac doit reposer sur un meuble dédié, posé perpendiculairement aux solives quand c'est possible."
            : "Cette charge passe sans difficulté sur un plancher sain, à condition que le meuble soit dédié et parfaitement de niveau."}{" "}
          Un défaut de planéité concentre l&apos;effort sur un angle et fait céder la cuve : la mise à niveau
          n&apos;est pas un détail de finition.
        </p>
        <p style={{ marginTop: 14 }}><Achat q={`meuble aquarium ${bac.longueur} cm`}>Voir les meubles {bac.longueur} cm</Achat></p>
      </div>
    </div>
  );
}

export function Substrat() {
  const { bac, set } = useTank();
  const [mat, setMat] = useState("quartz");
  const m = MATERIAUX.find((x) => x.id === mat)!;
  const r = useMemo(() => calcSubstrat(bac.longueur, bac.largeur, bac.substrat, m.densite), [bac, m]);
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac</h2>
        <div className="row">
          <Champ id="lo" label="Longueur" valeur={bac.longueur} onChange={set("longueur")} />
          <Champ id="la" label="Largeur" valeur={bac.largeur} onChange={set("largeur")} />
          <Champ id="su" label="Épaisseur" valeur={bac.substrat} onChange={set("substrat")} />
        </div>
        <p className="hint">3 à 4 cm pour un bac non planté, 5 à 6 cm dès qu&apos;il y a des racines à nourrir.</p>
        <div className="field">
          <label htmlFor="mt">Matériau</label>
          <select id="mt" value={mat} onChange={(e) => setMat(e.target.value)}>
            {MATERIAUX.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}
          </select>
          <p className="hint">{m.note}.</p>
        </div>
      </div>
      <div className="card">
        <h2>Quantité nécessaire</h2>
        <div className="stats">
          <Stat k="Volume" v={r.litres} u="L" />
          <Stat k="Poids" v={r.kg} u="kg" lead />
          <Stat k="Sacs de 20 kg" v={r.sacs20} />
        </div>
        <p className="note">
          Prévoyez un peu plus que le calcul : on modèle presque toujours une pente vers l&apos;avant, plus
          basse devant et plus épaisse au fond, ce qui donne de la profondeur au décor. Rincez
          longuement avant de mettre en place, sans quoi le bac restera laiteux plusieurs jours.
        </p>
        <p style={{ marginTop: 14 }}><Achat q={`${m.nom} aquarium ${r.sacs20 * 20} kg`}>Voir les {m.nom.toLowerCase()}</Achat></p>
      </div>
    </div>
  );
}

export function Verre() {
  const { bac, set } = useTank();
  const [ep, setEp] = useState(8);
  const hauteurEau = Math.max(0, bac.hauteur - 4);
  const r = useMemo(() => calcVerre(bac.longueur, hauteurEau, ep), [bac.longueur, hauteurEau, ep]);
  const ton = r.verdict === "Correct" ? "ok" : r.verdict === "Juste" ? "warn" : "danger";
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre cuve</h2>
        <div className="row">
          <Champ id="lo" label="Longueur" valeur={bac.longueur} onChange={set("longueur")} />
          <Champ id="ha" label="Hauteur" valeur={bac.hauteur} onChange={set("hauteur")} />
          <Champ id="ep" label="Verre (mm)" valeur={ep} onChange={(e) => setEp(Math.max(0, Number(e.target.value) || 0))} />
        </div>
        <p className="hint">Hauteur d&apos;eau retenue : {hauteurEau} cm, soit la hauteur de cuve moins la marge sous le rebord.</p>
      </div>
      <div className="card">
        <h2>Vérification</h2>
        <div className="stats">
          <Stat k="Épaisseur en place" v={ep} u="mm" />
          <Stat k="Palier requis" v={r.requis} u="mm" lead />
        </div>
        <p style={{ marginTop: 16 }}><Verdict mot={r.verdict} ton={ton} /></p>
        <p className="note">{r.message} {r.renfort && "À cette longueur ou à cette hauteur, des barres de renfort collées en haut de cuve ne sont pas optionnelles."}</p>
        <p className="note" style={{ borderLeft: "3px solid var(--danger)" }}>
          Ce contrôle est indicatif et volontairement prudent. Il ne remplace pas l&apos;avis d&apos;un vitrier,
          qui seul tiendra compte de la qualité du verre, de l&apos;état des collages et du vieillissement.
          Une cuve qui cède ne prévient pas.
        </p>
        <p style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {r.verdict === "Insuffisant"
            ? <Achat q={`aquarium ${bac.longueur} cm equipe`}>Voir des bacs neufs de {bac.longueur} cm</Achat>
            : <Link className="btn btn-sec" href="/calculateurs/poids">Vérifier le poids en charge</Link>}
        </p>
      </div>
    </div>
  );
}
