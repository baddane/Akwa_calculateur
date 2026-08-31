"use client";

import { useMemo, useState } from "react";
import { ESPECES, calcVolume, calcPopulation, type Stock } from "@/lib/aqua";
import { useTank } from "../useTank";
import { Champ, Stat, Verdict, Jauge, Achat } from "../ui";
import TankView from "../TankView";
import { Fish } from "../Aqua";

export function Population() {
  const { bac, set } = useTank();
  const [stock, setStock] = useState<Record<string, number>>({ neon: 10, corypanda: 6 });
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const liste: Stock[] = useMemo(
    () => Object.entries(stock).map(([id, nb]) => ({ id, nb })).filter((s) => s.nb > 0), [stock]);
  const pop = useMemo(() => calcPopulation(vol.net, liste), [vol.net, liste]);
  const ton = pop.verdict === "Confortable" ? "ok" : pop.verdict === "Correct" ? "warn" : "danger";
  const conflit = pop.tempMin !== null && pop.tempMax !== null && pop.tempMin > pop.tempMax;

  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac</h2>
        <div className="row">
          <Champ id="lo" label="Longueur" valeur={bac.longueur} onChange={set("longueur")} />
          <Champ id="la" label="Largeur" valeur={bac.largeur} onChange={set("largeur")} />
          <Champ id="ha" label="Hauteur" valeur={bac.hauteur} onChange={set("hauteur")} />
        </div>
        <p className="hint">{vol.net} L nets, c&apos;est sur ce chiffre que porte le calcul.</p>
        <h3>Espèces</h3>
        <div className="species">
          {ESPECES.map((e) => {
            const trop = vol.net < e.volumeMin;
            return (
              <div className={(stock[e.id] ?? 0) > 0 ? "sp on" : "sp"} key={e.id} style={trop ? { opacity: .5 } : undefined}>
                <span className="sp-ico"><Fish shape={e.shape} size={16} /></span>
                <div>
                  <div className="n">{e.nom}</div>
                  <div className="l">{trop ? `${e.volumeMin} L minimum` : e.latin}</div>
                </div>
                <input type="number" min={0} aria-label={e.nom} value={stock[e.id] ?? 0}
                  onChange={(ev) => setStock((s) => ({ ...s, [e.id]: Math.max(0, Number(ev.target.value) || 0) }))} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <TankView longueur={bac.longueur} largeur={bac.largeur} hauteur={bac.hauteur} substrat={bac.substrat} stock={liste} />
        <div className="stats">
          <Stat k="Capacité du bac" v={pop.capaciteCm} u="cm" />
          <Stat k="Charge actuelle" v={pop.chargeCm} u="cm" />
          <Stat k="Occupation" v={Math.round(pop.taux * 100)} u="%" lead />
        </div>
        <Jauge part={pop.taux} ton={ton} />
        <p><Verdict mot={pop.verdict} ton={ton} /></p>
        {pop.tempMin !== null && (
          <p className="note">
            {conflit
              ? "Ces espèces n'ont aucune température commune. En maintenir certaines dans leur plage condamne les autres à vivre hors de la leur."
              : <>Fenêtre thermique commune : <b>{pop.tempMin} à {pop.tempMax} °C</b>. Réglez le chauffage dans cette plage.</>}
          </p>
        )}
        <p className="note">
          Répartition : {pop.parZone.Surface} en surface, {pop.parZone.Milieu} en pleine eau,{" "}
          {pop.parZone.Fond} au sol. Un bac équilibré occupe les trois étages. Le calcul retient 1 cm de
          poisson adulte pour 1,1 L nets, pondéré par la charge propre à chaque espèce : un ancistrus et
          un néon de même longueur ne salissent pas pareil, ce que la règle du centimètre par litre ignore.
        </p>
        {pop.alertes.length > 0 && (
          <ul className="alerts">{pop.alertes.map((a, i) => <li key={i}>{a}</li>)}</ul>
        )}
        <p style={{ marginTop: 14 }}><Achat q="test aquarium gouttes no2 no3">Voir les tests en gouttes</Achat></p>
      </div>
    </div>
  );
}
