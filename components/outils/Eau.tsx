"use client";

import { useMemo, useState } from "react";
import { calcVolume, calcChangementEau, calcOsmose, F_VERS_DGH } from "@/lib/aqua";
import { useTank } from "../useTank";
import { Champ, Stat, Jauge, Achat } from "../ui";

export function ChangementEau() {
  const { bac, set } = useTank();
  const [eau, setEau] = useState({ actuel: 50, cible: 20, robinet: 15 });
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const r = useMemo(() => calcChangementEau(vol.net, eau), [vol.net, eau]);
  const maj = (k: keyof typeof eau) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEau((s) => ({ ...s, [k]: Math.max(0, Number(e.target.value) || 0) }));

  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac et votre eau</h2>
        <div className="row">
          <Champ id="lo" label="Longueur" valeur={bac.longueur} onChange={set("longueur")} />
          <Champ id="la" label="Largeur" valeur={bac.largeur} onChange={set("largeur")} />
          <Champ id="ha" label="Hauteur" valeur={bac.hauteur} onChange={set("hauteur")} />
        </div>
        <h3>Nitrates (mg/L)</h3>
        <Champ id="na" label="Taux actuel du bac" valeur={eau.actuel} onChange={maj("actuel")} />
        <Champ id="nc" label="Taux visé" valeur={eau.cible} onChange={maj("cible")}
          hint="Sous 25 mg/L pour un communautaire, sous 10 pour des crevettes ou des discus." />
        <Champ id="nr" label="Nitrates de votre eau du robinet" valeur={eau.robinet} onChange={maj("robinet")}
          hint="Le chiffre que tout le monde oublie. Il figure sur l'analyse annuelle de votre commune." />
      </div>
      <div className="card">
        <h2>Volume à renouveler</h2>
        <div className="stats">
          <Stat k="Part du volume" v={Math.round(r.fraction * 100)} u="%" />
          <Stat k="À changer" v={r.litres} u="L" lead />
          <Stat k="Plancher atteignable" v={r.plancher} u="mg/L" />
        </div>
        <Jauge part={r.fraction} ton={r.possible ? (r.fraction > 0.5 ? "warn" : "ok") : "danger"} />
        <p className="note">{r.message}</p>
        <p className="note">
          Sur {vol.net} L nets. Mettez l&apos;eau neuve à température avant de la verser : un écart de
          plus de deux degrés suffit à provoquer un choc thermique, et le conditionneur doit agir
          avant que l&apos;eau n&apos;atteigne les branchies.
        </p>
        <p style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Achat q="aspirateur a vase aquarium siphon">Voir les aspirateurs à vase</Achat>
          <Achat q="conditionneur eau aquarium anti chlore">Voir les conditionneurs</Achat>
          {!r.possible && <Achat q="osmoseur aquarium eau osmosee">Voir les osmoseurs</Achat>}
        </p>
      </div>
    </div>
  );
}

export function EauOsmosee() {
  const [v, setV] = useState(50);
  const [ghF, setGhF] = useState(28);
  const [cible, setCible] = useState(8);
  const r = useMemo(() => calcOsmose(v, ghF, cible), [v, ghF, cible]);
  const robinetDGH = ghF * F_VERS_DGH;

  return (
    <div className="grid">
      <div className="card">
        <h2>Votre mélange</h2>
        <Champ id="vo" label="Volume à préparer (L)" valeur={v} onChange={(e) => setV(Math.max(0, Number(e.target.value) || 0))} />
        <Champ id="gh" label="Dureté de votre eau du robinet (°f)" valeur={ghF} onChange={(e) => setGhF(Math.max(0, Number(e.target.value) || 0))}
          hint="Le degré français figure sur l'analyse d'eau de votre commune. Paris et l'Île-de-France tournent autour de 28 à 32 °f." />
        <Champ id="ci" label="Dureté visée (°dGH)" valeur={cible} onChange={(e) => setCible(Math.max(0, Number(e.target.value) || 0))}
          hint="Le degré allemand est l'unité de vos tests d'aquariophilie. 6 à 8 pour des crevettes, 8 à 12 pour un communautaire." />
      </div>
      <div className="card">
        <h2>Proportions</h2>
        <div className="stats">
          <Stat k="Eau osmosée" v={r.osmosee} u="L" lead />
          <Stat k="Eau du robinet" v={r.robinet} u="L" />
          <Stat k="Votre robinet vaut" v={robinetDGH.toFixed(1)} u="°dGH" />
        </div>
        <Jauge part={1 - r.part} ton={r.possible ? "ok" : "danger"} />
        <p className="note">{r.message}</p>
        <p className="note">
          Les deux unités disent la même chose autrement : 1 °f vaut 10 mg/L de carbonate de calcium,
          1 °dGH en vaut 17,8. Vos {ghF} °f de robinet font donc {robinetDGH.toFixed(1)} °dGH, et c&apos;est ce
          second chiffre que liront vos tests. Beaucoup de bacs à crevettes échouent sur cette confusion.
        </p>
        <p style={{ marginTop: 14 }}><Achat q="osmoseur aquarium 190 l/j">Voir les osmoseurs</Achat></p>
      </div>
    </div>
  );
}
