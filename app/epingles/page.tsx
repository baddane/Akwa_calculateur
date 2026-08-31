import type { Metadata } from "next";

export const metadata: Metadata = { title: "Épingles", robots: { index: false, follow: false } };

type Pin = { id: string; kicker: string; punch: string; big?: string; sub: string; tone: "a" | "b" | "c" };

const PINS: Pin[] = [
  { id: "volume", tone: "a", kicker: "Erreur n°1 des débutants",
    punch: "Votre aquarium contient moins d'eau que ce qui est écrit sur la boîte",
    big: "−22 %", sub: "Substrat, décor et marge sous le rebord. C'est le volume net qui sert à calculer la population, la filtration et les dosages." },
  { id: "filtre", tone: "b", kicker: "Filtration",
    punch: "Le débit annoncé sur l'emballage est mesuré à vide",
    big: "−35 %", sub: "Une fois les masses filtrantes en place, le débit réel s'effondre. Achetez toujours sur le chiffre corrigé." },
  { id: "population", tone: "c", kicker: "La règle qu'il faut oublier",
    punch: "1 cm de poisson par litre surpeuple presque tous les bacs",
    sub: "Elle ignore la charge réelle de chaque espèce et les effectifs de banc. Un ancistrus et un néon de même longueur ne salissent pas pareil." },
  { id: "nitrates", tone: "a", kicker: "Ce que personne ne vérifie",
    punch: "Votre eau du robinet fixe un plancher de nitrates que rien ne fait descendre",
    sub: "Si elle titre 25 mg/L, aucun changement d'eau ne descendra le bac sous 25. Il faut couper à l'osmosée." },
  { id: "temperature", tone: "b", kicker: "Compatibilité",
    punch: "Deux poissons vendus côte à côte peuvent être incompatibles",
    big: "16 → 31 °C", sub: "Un cardinal de Chine vit à 20 °C, un discus à 29. Aucune température ne convient aux deux." },
  { id: "cycle", tone: "c", kicker: "Avant le premier poisson",
    punch: "Le bac doit tourner 3 à 6 semaines à vide",
    sub: "Le temps que les bactéries transforment l'ammoniaque en nitrites puis en nitrates. Tant que le test NO2 n'est pas à zéro, aucune introduction." },
];

export default function Epingles() {
  return (
    <div style={{ padding: 24, background: "#e9eef0", display: "flex", flexWrap: "wrap", gap: 24 }}>
      {PINS.map((p) => (
        <div key={p.id} id={`pin-${p.id}`} className={`pin tone-${p.tone}`}>
          <div className="pin-kicker">{p.kicker}</div>
          <div className="pin-punch">{p.punch}</div>
          {p.big && <div className="pin-big">{p.big}</div>}
          <div className="pin-sub">{p.sub}</div>
          <div className="pin-foot">
            <span className="pin-dot" />
            Calculateurs aquarium eau douce
          </div>
        </div>
      ))}
    </div>
  );
}
