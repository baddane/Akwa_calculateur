"use client";

import { useMemo, useState } from "react";
import {
  calcVolume, calcFiltration, calcLumiere, calcChauffage, calcKit,
  ROTATIONS, EXIGENCES, type Profil, type Exigence,
} from "@/lib/aqua";
import { useTank } from "../useTank";
import { Champ, Stat, Achat } from "../ui";
import { amz } from "@/lib/amazon";

function Cotes({ bac, set }: { bac: ReturnType<typeof useTank>["bac"]; set: ReturnType<typeof useTank>["set"] }) {
  return (
    <>
      <div className="row">
        <Champ id="lo" label="Longueur" valeur={bac.longueur} onChange={set("longueur")} />
        <Champ id="la" label="Largeur" valeur={bac.largeur} onChange={set("largeur")} />
        <Champ id="ha" label="Hauteur" valeur={bac.hauteur} onChange={set("hauteur")} />
      </div>
      <p className="hint">Dimensions intérieures en centimètres.</p>
    </>
  );
}

export function Filtration() {
  const { bac, set } = useTank();
  const [profil, setProfil] = useState<Profil>("communautaire");
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const f = useMemo(() => calcFiltration(vol.net, profil), [vol.net, profil]);
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac</h2>
        <Cotes bac={bac} set={set} />
        <div className="field">
          <label htmlFor="pr">Type de population</label>
          <select id="pr" value={profil} onChange={(e) => setProfil(e.target.value as Profil)}>
            {Object.entries(ROTATIONS).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}
          </select>
        </div>
      </div>
      <div className="card">
        <h2>Débit nécessaire</h2>
        <div className="stats">
          <Stat k="Rotations visées" v={f.rotation} u="×/h" />
          <Stat k="Débit réel utile" v={f.besoin} u="L/h" />
          <Stat k="Débit constructeur" v={f.constructeur} u="L/h" lead />
        </div>
        <p className="note">
          Achetez sur le chiffre de droite, pas sur celui du milieu. Le débit annoncé est mesuré à vide :
          garni de mousses et de céramiques, puis progressivement encrassé, un filtre en perd environ un
          tiers. En cas d&apos;hésitation entre deux modèles, prenez le plus puissant et bridez-le. Un filtre
          surdimensionné se règle, un filtre trop faible ne se rattrape jamais.
        </p>
        <p style={{ marginTop: 14 }}><Achat q={`filtre exterieur aquarium ${f.constructeur} l/h`}>Voir les filtres {f.constructeur} L/h</Achat></p>
      </div>
    </div>
  );
}

export function Eclairage() {
  const { bac, set } = useTank();
  const [ex, setEx] = useState<Exigence>("moyenne");
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const hauteurEau = Math.max(0, bac.hauteur - 4 - bac.substrat);
  const l = useMemo(() => calcLumiere(vol.net, hauteurEau, bac.longueur, ex), [vol.net, hauteurEau, bac.longueur, ex]);
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac</h2>
        <Cotes bac={bac} set={set} />
        <div className="field">
          <label htmlFor="ex">Exigence de vos plantes</label>
          <select id="ex" value={ex} onChange={(e) => setEx(e.target.value as Exigence)}>
            {Object.entries(EXIGENCES).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}
          </select>
          <p className="hint">{EXIGENCES[ex].exemples}.</p>
        </div>
      </div>
      <div className="card">
        <h2>Éclairage nécessaire</h2>
        <div className="stats">
          <Stat k="Flux lumineux" v={l.lumens} u="lm" lead />
          <Stat k="Puissance LED" v={l.watts} u="W" />
          <Stat k="Longueur de rampe" v={l.rampe} />
        </div>
        <p className="note">
          Comptez {EXIGENCES[ex].lmL} lumens par litre net pour cette catégorie de plantes.
          {l.majoration && " Votre colonne d'eau dépasse 45 cm, j'ai majoré de 30 % : la lumière s'atténue en traversant l'eau, et ce qui suffit en surface n'atteint plus le sol."}{" "}
          La puissance en watts n&apos;est donnée qu&apos;à titre indicatif, sur la base d&apos;environ 90 lumens par
          watt. Deux rampes de consommation identique peuvent éclairer du simple au double : c&apos;est le
          flux lumineux qui compte, jamais la consommation.
        </p>
        <p className="note">
          Huit heures par jour suffisent, sur minuterie. Au-delà, vous nourrissez surtout les algues.
        </p>
        <p style={{ marginTop: 14 }}><Achat q={`rampe led aquarium plantes ${bac.longueur} cm`}>Voir les rampes {bac.longueur} cm</Achat></p>
      </div>
    </div>
  );
}

export function Chauffage() {
  const { bac, set } = useTank();
  const [amb, setAmb] = useState(19);
  const [cible, setCible] = useState(25);
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const c = useMemo(() => calcChauffage(vol.net, amb, cible), [vol.net, amb, cible]);
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre bac et votre pièce</h2>
        <Cotes bac={bac} set={set} />
        <Champ id="am" label="Température de la pièce en hiver (°C)" valeur={amb} onChange={(e) => setAmb(Number(e.target.value) || 0)}
          hint="La plus basse, celle des nuits de janvier, pas la moyenne." />
        <Champ id="ci" label="Température visée dans le bac (°C)" valeur={cible} onChange={(e) => setCible(Number(e.target.value) || 0)}
          hint="24 à 26 °C pour un communautaire tropical." />
      </div>
      <div className="card">
        <h2>Puissance nécessaire</h2>
        <div className="stats">
          <Stat k="Écart à combler" v={c.delta} u="°C" />
          <Stat k="Besoin calculé" v={c.theorique} u="W" />
          <Stat k="Modèle à prendre" v={c.palier} u="W" lead />
        </div>
        <p className="note">
          Ce qui compte n&apos;est pas le volume seul mais l&apos;écart de {c.delta} °C à combler. Un chauffage
          trop juste tourne en continu sans jamais tenir la consigne, et rend l&apos;âme en une saison.
          {c.deux && " Au-delà de 250 L, deux résistances de puissance moitié placées aux extrémités valent mieux qu'une seule : la chaleur se répartit, et une panne ne laisse pas le bac à l'abandon."}
        </p>
        <p className="note">
          Vérifiez toujours avec un thermomètre indépendant. Le thermostat intégré dérive avec le temps,
          et c&apos;est la panne la plus fréquente du matériel d&apos;aquariophilie.
        </p>
        <p style={{ marginTop: 14 }}><Achat q={`chauffage aquarium ${c.palier}w thermostat`}>Voir les chauffages {c.palier} W</Achat></p>
      </div>
    </div>
  );
}

export function Kit() {
  const { bac, set } = useTank();
  const [profil, setProfil] = useState<Profil>("communautaire");
  const [plante, setPlante] = useState(true);
  const vol = useMemo(() => calcVolume(bac), [bac]);
  const kit = useMemo(() => calcKit(bac, vol, profil, plante), [bac, vol, profil, plante]);
  return (
    <div className="grid">
      <div className="card">
        <h2>Votre projet</h2>
        <Cotes bac={bac} set={set} />
        <div className="field">
          <label htmlFor="pr">Type de population</label>
          <select id="pr" value={profil} onChange={(e) => setProfil(e.target.value as Profil)}>
            {Object.entries(ROTATIONS).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pl">Bac planté</label>
          <select id="pl" value={plante ? "oui" : "non"} onChange={(e) => setPlante(e.target.value === "oui")}>
            <option value="oui">Oui, plantes vivantes</option>
            <option value="non">Non, décor inerte</option>
          </select>
        </div>
      </div>
      <div className="card">
        <div className="buylist-head">
          <h2 style={{ margin: 0 }}>Liste pour {vol.net} L nets</h2>
          <span>{kit.filter((l) => l.essentiel).length} postes indispensables</span>
        </div>
        {kit.map((l, i) => (
          <div className="buyrow" key={i}>
            <div>
              <b>{l.poste}{!l.essentiel && <em> · confort</em>}</b>
              <span>{l.specif}</span>
            </div>
            <a className="btn" href={amz(l.recherche)} target="_blank" rel="sponsored nofollow noopener">Voir</a>
          </div>
        ))}
        <p className="note">
          Comptez trois à six semaines de cycle de l&apos;azote avant d&apos;introduire le moindre poisson. Tant
          que le test de nitrites n&apos;est pas revenu à zéro, aucune introduction : c&apos;est l&apos;étape que tout
          le monde saute, et la première cause de mortalité chez les débutants.
        </p>
      </div>
    </div>
  );
}
