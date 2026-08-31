import { ImageResponse } from "next/og";
import { OUTILS, outilParSlug } from "@/lib/outils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return OUTILS.map((o) => ({ slug: o.slug }));
}

/** Coupe au dernier mot entier, une description tranchée en plein milieu
 *  fait négligé sur une carte de partage. */
function court(s: string, max = 130): string {
  if (s.length <= max) return s;
  const bout = s.slice(0, max);
  return bout.slice(0, bout.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

export default async function Image({ params }: { params: { slug: string } }) {
  const o = outilParSlug(params.slug);
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "72px 80px",
        background: "linear-gradient(140deg, #16233a 0%, #0b1526 100%)", color: "#f5f1e8",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#e8b48a", letterSpacing: 2 }}>
          <svg width="32" height="20" viewBox="0 0 100 60">
            <path d="M6,30 C16,15 50,12 68,22 L95,9 L88,30 L95,51 L68,38 C50,48 16,45 6,30 Z" fill="#e8b48a" />
          </svg>
          AKWA · {(o?.famille ?? "").toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 62, lineHeight: 1.12, fontWeight: 700, maxWidth: 960 }}>
            {o?.h1 ?? "Calculateur aquarium"}
          </div>
          <div style={{ fontSize: 27, color: "#b9c4d6", maxWidth: 900, lineHeight: 1.45 }}>
            {court(o?.description ?? "")}
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#8fa0ba" }}>
          akwa-calculateur.vercel.app
        </div>
      </div>
    ),
    size
  );
}
