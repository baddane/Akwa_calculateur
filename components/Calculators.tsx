"use client";

import { useMemo, useState } from "react";
import {
  ESPECES, ROTATIONS, calcVolume, calcPopulation, calcFiltration, calcKit, calcChangementEau,
  type Profil, type Stock, type VolumeInput, type EauInput,
} from "@/lib/aqua";
import { amz } from "@/lib/amazon";

const ONGLETS = [
  { id: "volume", label: "Volume réel" },
  { id: "population", label: "Population" },
  { id: "filtration", label: "Filtration" },
  { id: "kit", label: "Kit de démarrage" },
  { id: "eau", label: "Changement d'eau" },
] as const;
type Onglet = (typeof ONGLETS)[number]["id"];

export default function Calculators() {
  const [onglet, setOnglet] = useState<Onglet>("volume");
  const [bac, setBac] = useState<VolumeInput>({ longueur: 80, largeur: 35, hauteur: 45, substrat: 5, decor: 10 });
  const [stock, setStock] = useState<Record<string, number>>({ neon: 12, corypanda: 6 });
  const [profil, setProfil] = useState<Profil>("communautaire");
  const [plante, setPlante] = useState(true);
  const [eau, setEau] = useState<EauInput>({ actuel: 50, cible: 20, robinet: 15 });

  const vol = useMemo(() => calcVolume(bac), [bac]);
  const stockList: Stock[] = useMemo(
    () => Object.entries(stock).map(([id, nb]) => ({ id, nb })).filter((s) => s.nb > 0),
    [stock]
  );
  const pop = useMemo(() => calcPopulation(vol.net, stockList), [vol.net, stockList]);
  const filtre = useMemo(() => calcFiltration(vol.net, profil), [vol.net, profil]);
  const kit = useMemo(() => calcKit(bac, vol, profil, plante), [bac, vol, profil, plante]);
  const chg = useMemo(() => calcChangementEau(vol.net, eau), [vol.net, eau]);

  const set = (k: keyof VolumeInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBac((b) => ({ ...b, [k]: Math.max(0, Number(e.target.value) || 0) }));

  const couleur = pop.verdict === "Confortable" ? "var(--ok)" : pop.verdict === "Correct" ? "var(--warn)" : "var(--danger)";

  return (
    <>
      <div className="tabs" role="tablist">
        {ONGLETS.map((o) => (
          <button key={o.id} className="tab" role="tab" aria-selected={onglet === o.id} onClick={() => setOnglet(o.id)}>
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {/* ---- Colonne de saisie ---- */}
        <div className="card">
          <h2>Dimensions du bac</h2>
          <div className="row">
            <div className="field">
              <label htmlFor="lo">Longueur</label>
              <input id="lo" type="number" min={0} value={bac.longueur} onChange={set("longueur")} />
            </div>
            <div className="field">
              <label htmlFor="la">Largeur</label>
              <input id="la" type="number" min={0} value={bac.largeur} onChange={set("largeur")} />
            </div>
            <div className="field">
              <label htmlFor="ha">Hauteur</label>
              <input id="ha" type="number" min={0} value={bac.hauteur} onChange={set("hauteur")} />
            </div>
          </div>
          <p className="hint">Dimensions intérieures en centimètres.</p>

          <div className="field">
            <label htmlFor="su">Épaisseur du substrat (cm)</label>
            <input id="su" type="number" min={0} value={bac.substrat} onChange={set("substrat")} />
          </div>
          <div className="field">
            <label htmlFor="de">Volume occupé par le décor (%)</label>
            <input id="de" type="number" min={0} max={60} value={bac.decor} onChange={set("decor")} />
            <p className="hint">Roches, racines et gros éléments. 10 % pour un bac planté classique.</p>
          </div>

          {(onglet === "filtration" || onglet === "kit") && (
            <>
              <h3>Type de population</h3>
              <div className="field">
                <select value={profil} onChange={(e) => setProfil(e.target.value as Profil)}>
                  {Object.entries(ROTATIONS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {onglet === "kit" && (
            <div className="field">
              <label htmlFor="pl">Bac planté</label>
              <select id="pl" value={plante ? "oui" : "non"} onChange={(e) => setPlante(e.target.value === "oui")}>
                <option value="oui">Oui, plantes vivantes</option>
                <option value="non">Non, décor inerte</option>
              </select>
            </div>
          )}

          {onglet === "eau" && (
            <>
              <h3>Nitrates (mg/L)</h3>
              <div className="field">
                <label htmlFor="na">Taux actuel du bac</label>
                <input id="na" type="number" min={0} value={eau.actuel}
                  onChange={(e) => setEau((s) => ({ ...s, actuel: Math.max(0, Number(e.target.value) || 0) }))} />
              </div>
              <div className="field">
                <label htmlFor="nc">Taux visé</label>
                <input id="nc" type="number" min={0} value={eau.cible}
                  onChange={(e) => setEau((s) => ({ ...s, cible: Math.max(0, Number(e.target.value) || 0) }))} />
                <p className="hint">Sous 25 mg/L pour un bac communautaire, sous 10 pour des crevettes ou des discus.</p>
              </div>
              <div className="field">
                <label htmlFor="nr">Taux de votre eau du robinet</label>
                <input id="nr" type="number" min={0} value={eau.robinet}
                  onChange={(e) => setEau((s) => ({ ...s, robinet: Math.max(0, Number(e.target.value) || 0) }))} />
                <p className="hint">Le chiffre que tout le monde oublie. Il figure sur l&apos;analyse annuelle de votre commune, ou se mesure au test en gouttes.</p>
              </div>
            </>
          )}

          {onglet === "population" && (
            <>
              <h3>Espèces</h3>
              <div className="species">
                {ESPECES.map((e) => (
                  <div className="sp" key={e.id}>
                    <div>
                      <div className="n">{e.nom}</div>
                      <div className="l">{e.latin}</div>
                    </div>
                    <input
                      type="number" min={0} aria-label={e.nom} value={stock[e.id] ?? 0}
                      onChange={(ev) => setStock((s) => ({ ...s, [e.id]: Math.max(0, Number(ev.target.value) || 0) }))}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ---- Colonne de résultats ---- */}
        <div className="card">
          {onglet === "volume" && (
            <>
              <h2>Volume réel</h2>
              <div className="stats">
                <div className="stat"><div className="k">Volume brut</div><div className="v">{vol.brut}<span className="u">L</span></div></div>
                <div className="stat lead"><div className="k">Volume net utile</div><div className="v">{vol.net}<span className="u">L</span></div></div>
                <div className="stat"><div className="k">Surface d&apos;eau</div><div className="v">{vol.surfaceEau}<span className="u">dm²</span></div></div>
              </div>
              <p className="note">
                Le volume brut est celui qu&apos;affichent les fabricants. Le volume net retire la marge de{" "}
                {vol.margeHaut} cm sous le rebord, le substrat et le décor. C&apos;est lui qui sert de base à tous
                les autres calculs : population, filtration, dosage des traitements. L&apos;écart atteint souvent
                20 à 25 %, ce qui suffit à transformer un bac correctement peuplé en bac surpeuplé.
              </p>
            </>
          )}

          {onglet === "population" && (
            <>
              <h2>Population</h2>
              <div className="stats">
                <div className="stat"><div className="k">Capacité du bac</div><div className="v">{pop.capaciteCm}<span className="u">cm</span></div></div>
                <div className="stat"><div className="k">Charge actuelle</div><div className="v">{pop.chargeCm}<span className="u">cm</span></div></div>
                <div className="stat lead"><div className="k">Occupation</div><div className="v">{Math.round(pop.taux * 100)}<span className="u">%</span></div></div>
              </div>
              <div className="bar"><span style={{ width: `${Math.min(100, pop.taux * 100)}%`, background: couleur }} /></div>
              <span className="badge" style={{ background: couleur, color: "#fff" }}>{pop.verdict}</span>
              {pop.tempMin !== null && pop.tempMax !== null && (
                <p className="note" style={{ marginTop: 14 }}>
                  {pop.tempMin <= pop.tempMax ? (
                    <>Fenêtre thermique commune à ces espèces : <strong>{pop.tempMin} à {pop.tempMax} °C</strong>. Réglez le chauffage dans cette plage.</>
                  ) : (
                    <>Ces espèces n&apos;ont <strong>aucune température commune</strong>. Le maintien ensemble condamne les unes ou les autres à vivre hors de leur plage.</>
                  )}
                </p>
              )}
              <p className="note">
                Répartition : {pop.parZone.Surface} en surface, {pop.parZone.Milieu} en pleine eau,{" "}
                {pop.parZone.Fond} au sol. Un bac équilibré occupe les trois zones. Le calcul retient
                1 cm de poisson adulte pour 1,6 L nets, plus prudent que la règle du centimètre par litre
                qui aboutit presque toujours à un bac surchargé.
              </p>
              {pop.alertes.length > 0 && (
                <ul className="alerts">
                  {pop.alertes.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}
            </>
          )}

          {onglet === "filtration" && (
            <>
              <h2>Filtration</h2>
              <div className="stats">
                <div className="stat"><div className="k">Rotations visées</div><div className="v">{filtre.rotation}<span className="u">×/h</span></div></div>
                <div className="stat"><div className="k">Débit réel utile</div><div className="v">{filtre.besoin}<span className="u">L/h</span></div></div>
                <div className="stat lead"><div className="k">Débit constructeur</div><div className="v">{filtre.constructeur}<span className="u">L/h</span></div></div>
              </div>
              <p className="note">
                Le débit annoncé sur l&apos;emballage est mesuré à vide. Une fois les masses filtrantes en
                place et encrassées, il chute d&apos;environ un tiers. C&apos;est pourquoi il faut acheter sur le
                chiffre de droite, pas sur celui du milieu. Prenez le modèle immédiatement supérieur si
                vous hésitez : un filtre trop puissant se bride, un filtre trop faible ne se rattrape pas.
              </p>
              <p style={{ marginTop: 16 }}>
                <a className="btn" href={amz(`filtre aquarium ${filtre.constructeur} l/h`)} target="_blank" rel="sponsored nofollow noopener">
                  Voir les filtres {filtre.constructeur} L/h
                </a>
              </p>
            </>
          )}

          {onglet === "kit" && (
            <>
              <h2>Kit de démarrage pour {vol.net} L nets</h2>
              <div className="tablewrap">
                <table>
                  <thead>
                    <tr><th>Poste</th><th style={{ width: 1 }} /></tr>
                  </thead>
                  <tbody>
                    {kit.map((l, i) => (
                      <tr key={i}>
                        <td>
                          <div className="poste">
                            {l.poste}
                            {!l.essentiel && <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}> · confort</span>}
                          </div>
                          <div className="specif">{l.specif}</div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <a className="btn" href={amz(l.recherche)} target="_blank" rel="sponsored nofollow noopener">Voir</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="note">
                Cette liste couvre la mise en eau. Comptez trois à six semaines de cycle de l&apos;azote avant
                d&apos;introduire le moindre poisson : le bac doit transformer l&apos;ammoniaque en nitrites, puis
                les nitrites en nitrates. Tant que le test NO2 n&apos;est pas revenu à zéro, aucune
                introduction. C&apos;est l&apos;étape que tout le monde saute, et la première cause de mortalité
                chez les débutants.
              </p>
            </>
          )}
          {onglet === "eau" && (
            <>
              <h2>Changement d&apos;eau</h2>
              <div className="stats">
                <div className="stat"><div className="k">Part à renouveler</div><div className="v">{Math.round(chg.fraction * 100)}<span className="u">%</span></div></div>
                <div className="stat lead"><div className="k">Volume à changer</div><div className="v">{chg.litres}<span className="u">L</span></div></div>
                <div className="stat"><div className="k">Plancher nitrates</div><div className="v">{chg.plancher}<span className="u">mg/L</span></div></div>
              </div>
              <div className="bar">
                <span style={{ width: `${Math.min(100, chg.fraction * 100)}%`, background: chg.possible ? "var(--accent)" : "var(--danger)" }} />
              </div>
              <ul className="alerts" style={{ marginTop: 14 }}>
                <li style={{ borderLeftColor: chg.possible ? "var(--accent)" : "var(--danger)" }}>{chg.message}</li>
              </ul>
              <p className="note">
                Les nitrates sont le déchet final du cycle de l&apos;azote. Ils ne s&apos;éliminent ni par la
                filtration ni par le temps : seuls le changement d&apos;eau et les plantes les font baisser.
                Le plancher affiché est celui de votre eau de robinet, aucun renouvellement ne descend
                en dessous.
              </p>
              {!chg.possible && (
                <p style={{ marginTop: 16 }}>
                  <a className="btn" href={amz("osmoseur aquarium eau osmosee")} target="_blank" rel="sponsored nofollow noopener">
                    Voir les osmoseurs
                  </a>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
