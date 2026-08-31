import type { Shape } from "@/lib/aqua";

/* Silhouettes stylisées, dessinées dans une boîte 100 × 60, nageant vers la droite. */
const PATHS: Record<Shape, string> = {
  tetra: "M6,30 C16,15 50,12 68,22 L95,9 L88,30 L95,51 L68,38 C50,48 16,45 6,30 Z",
  guppy: "M6,30 C15,17 44,15 60,24 L90,7 C97,19 97,41 90,53 L60,36 C44,45 15,43 6,30 Z",
  cory:  "M6,40 C14,20 46,15 66,23 L93,12 L86,31 L93,48 L66,39 C46,45 14,48 6,40 Z",
  betta: "M10,30 C18,19 42,17 56,25 L84,5 C95,19 95,41 84,55 L56,35 C42,43 18,41 10,30 Z",
  disc:  "M22,30 C22,11 42,4 56,14 L70,3 L65,20 L92,30 L65,40 L70,57 L56,46 C42,56 22,49 22,30 Z",
  eel:   "M4,26 C22,14 40,40 58,26 C74,14 86,32 97,25 L97,35 C86,42 74,26 58,38 C40,52 22,26 4,36 Z",
  shrimp:"M12,38 C12,22 28,14 46,16 C64,18 76,26 84,20 L92,26 L84,32 C76,40 64,44 46,44 L46,50 L38,44 C22,44 12,44 12,38 Z",
  snail: "M14,46 C14,30 26,18 44,18 C62,18 74,28 74,40 C74,50 66,56 56,56 C48,56 42,51 42,44 C42,38 46,34 52,34 C56,34 59,37 59,41 L52,41 C52,43 54,44 56,44 C60,44 62,42 62,39 C62,34 57,30 51,30 C42,30 36,36 36,44 C36,52 44,58 55,58 L92,58 L92,50 Z",
};

export function Fish({ shape, size = 22, color = "currentColor", flip = false, style }: {
  shape: Shape; size?: number; color?: string; flip?: boolean; style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 60" width={size * 1.6} height={size} aria-hidden style={style}
      preserveAspectRatio="xMidYMid meet">
      <g transform={flip ? "translate(100,0) scale(-1,1)" : undefined}>
        <path d={PATHS[shape]} fill={color} />
        {shape !== "snail" && shape !== "shrimp" && (
          <circle cx={shape === "disc" ? 34 : 22} cy={shape === "cory" ? 32 : 27} r="3.4" fill="#04222a" opacity=".55" />
        )}
      </g>
    </svg>
  );
}

/** Touffe de plantes : lames effilées partant de la base. */
export function Plant({ x, h, hue = 0, sway = 0 }: { x: number; h: number; hue?: number; sway?: number }) {
  const lames = [-0.55, -0.28, 0, 0.3, 0.58];
  const base = Math.max(0.9, h * 0.045);
  return (
    <g transform={`translate(${x} 0)`}>
      <g className="plant" style={{ animationDelay: `${sway}s` }}>
      {lames.map((f, i) => {
        const len = h * (0.55 + 0.45 * (1 - Math.abs(f)));
        const dx = f * h * 0.42;
        return (
          <path key={i}
            d={`M${-base},0 C${dx * 0.25},${-len * 0.42} ${dx * 0.7},${-len * 0.74} ${dx},${-len}` +
               ` C${dx * 0.5},${-len * 0.7} ${dx * 0.2 + base},${-len * 0.36} ${base},0 Z`}
            fill={`hsl(${150 + hue + i * 6} 52% ${26 + i * 4}%)`} opacity=".92" />
        );
      })}
      </g>
    </g>
  );
}

export function Bubbles({ n = 7, w = 100 }: { n?: number; w?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r = 1.6 + ((i * 7) % 5) * 0.75;
        return (
          <circle key={i} className="bubble" r={r}
            cx={(((i * 37) % 100) / 100) * w} cy="100"
            style={{ animationDelay: `${(i * 1.7) % 9}s`, animationDuration: `${7 + (i % 4) * 2.5}s` }} />
        );
      })}
    </>
  );
}

/** Rais de lumière traversant la surface. */
export function LightRays({ w, h }: { w: number; h: number }) {
  return (
    <g opacity=".5">
      {[0.12, 0.31, 0.52, 0.74, 0.89].map((p, i) => {
        const x = p * w;
        const spread = 16 + i * 9;
        return (
          <path key={i} d={`M${x - 9},0 L${x + 9},0 L${x + spread},${h} L${x - spread + 6},${h} Z`}
            fill="url(#ray)" />
        );
      })}
    </g>
  );
}

export function AquaDefs() {
  return (
    <defs>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4fb9cc" stopOpacity=".78" />
        <stop offset="55%" stopColor="#0d7a92" stopOpacity=".88" />
        <stop offset="100%" stopColor="#053b4e" stopOpacity=".97" />
      </linearGradient>
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bdf3ff" stopOpacity=".5" />
        <stop offset="100%" stopColor="#bdf3ff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d9c39c" />
        <stop offset="100%" stopColor="#7d6a4e" />
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity=".28" />
        <stop offset="18%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity=".1" />
      </linearGradient>
    </defs>
  );
}
