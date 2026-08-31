import { ESPECES, type Stock } from "@/lib/aqua";
import { Fish, Plant, Bubbles, LightRays, AquaDefs } from "./Aqua";

const MARGE_EAU = 4;

export default function TankView({ longueur, largeur, hauteur, substrat, stock = [] }: {
  longueur: number; largeur: number; hauteur: number; substrat: number; stock?: Stock[];
}) {
  const L = Math.max(20, longueur);
  const H = Math.max(15, hauteur);
  const sol = Math.min(substrat, H * 0.5);

  const fs = Math.max(2.6, H * 0.072);        // typo exprimée en unités du viewBox
  const padL = fs * 2.2, padR = fs * 2.2, padT = fs * 2.1, padB = fs * 1.9;
  const vh = H + padT + padB;
  const vw = L + padL + padR;
  const baseY = vh - padB;                    // sol du meuble
  const topY = baseY - H;                     // rebord du bac
  const eauY = topY + MARGE_EAU;              // niveau d'eau
  const solY = baseY - sol;                   // haut du substrat

  // Répartition des poissons par zone dans la colonne d'eau
  const colonne = Math.max(1, solY - eauY);
  const bandes = { Surface: [0.03, 0.26], Milieu: [0.28, 0.7], Fond: [0.8, 0.97] } as const;

  type Placed = { id: string; shape: (typeof ESPECES)[number]["shape"]; x: number; y: number; s: number; flip: boolean };
  const placed: Placed[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

  for (const s of stock) {
    const e = ESPECES.find((x) => x.id === s.id);
    if (!e || s.nb <= 0) continue;
    const n = Math.min(s.nb, 14);
    const [a, b] = bandes[e.zone];
    for (let i = 0; i < n; i++) {
      if (placed.length >= 34) break;
      placed.push({
        id: `${e.id}-${i}`, shape: e.shape,
        x: padL + 6 + rnd() * (L - 14),
        y: eauY + (a + rnd() * (b - a)) * colonne,
        s: Math.max(7, Math.min(20, e.taille * 1.5)),
        flip: rnd() > 0.55,
      });
    }
  }

  return (
    <svg className="tank" viewBox={`0 0 ${vw} ${vh}`} role="img"
      aria-label={`Vue en coupe d'un bac de ${longueur} par ${largeur} par ${hauteur} centimètres`}>
      <AquaDefs />
      <clipPath id="cuve"><rect x={padL} y={topY} width={L} height={H} rx="2" /></clipPath>

      {/* Meuble */}
      <rect x={padL - 3} y={baseY} width={L + 6} height={Math.max(2, H * 0.045)} rx="1" fill="#2c2118" opacity=".8" />

      <g clipPath="url(#cuve)">
        <rect x={padL} y={eauY} width={L} height={baseY - eauY} fill="url(#water)" />
        <g transform={`translate(0 ${eauY})`}><LightRays w={vw} h={colonne * 1.1} /></g>

        {/* Plantes enracinées dans le substrat */}
        <g transform={`translate(0 ${solY})`}>
          <Plant x={padL + L * 0.1} h={Math.min(H * 0.62, colonne * 0.8)} hue={0} sway={0} />
          <Plant x={padL + L * 0.28} h={Math.min(H * 0.4, colonne * 0.55)} hue={14} sway={1.4} />
          <Plant x={padL + L * 0.74} h={Math.min(H * 0.7, colonne * 0.86)} hue={-10} sway={.7} />
          <Plant x={padL + L * 0.9} h={Math.min(H * 0.45, colonne * 0.6)} hue={8} sway={2.1} />
        </g>

        {/* Racine décorative */}
        <path d={`M${padL + L * 0.42},${solY} c4,-8 -6,-14 2,-20 c7,-5 14,2 12,9 c-1,5 -6,5 -6,11`}
          stroke="#5b4025" strokeWidth={Math.max(2, H * 0.035)} fill="none" strokeLinecap="round" opacity=".9" />

        {/* Substrat */}
        <rect x={padL} y={solY} width={L} height={sol} fill="url(#sand)" />
        <path d={`M${padL},${solY} Q${padL + L * 0.3},${solY - 2.5} ${padL + L * 0.55},${solY + 1} T${padL + L},${solY - 1} L${padL + L},${solY + 3} L${padL},${solY + 3} Z`}
          fill="#d8c4a4" opacity=".55" />

        {placed.map((f) => (
          <g key={f.id} transform={`translate(${f.x - f.s * 0.8} ${f.y - f.s * 0.3})`}>
            <Fish shape={f.shape} size={f.s} flip={f.flip} color="#f2f7f4" style={{ opacity: 0.94 }} />
          </g>
        ))}

        <g transform={`translate(${padL} ${eauY})`}><Bubbles n={8} w={L} /></g>
        <rect x={padL} y={topY} width={L} height={H} fill="url(#glass)" />
      </g>

      {/* Ligne d'eau et vitre */}
      <line x1={padL} y1={eauY} x2={padL + L} y2={eauY} stroke="#dff6ff" strokeWidth="1.1" opacity=".75" />
      <rect x={padL} y={topY} width={L} height={H} rx="2" fill="none" stroke="#8fb3bd" strokeWidth="1.6" opacity=".75" />

      {/* Cotes */}
      <text x={padL + L / 2} y={topY - fs * 0.7} textAnchor="middle" className="tank-dim"
        fontSize={fs}>{longueur} cm</text>
      <text x={padL - fs * 0.8} y={topY + H / 2} textAnchor="middle" className="tank-dim"
        fontSize={fs} transform={`rotate(-90 ${padL - fs * 0.8} ${topY + H / 2})`}>{hauteur} cm</text>
</svg>
  );
}
