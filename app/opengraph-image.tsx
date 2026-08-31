import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Akwa, calculateurs pour aquarium d'eau douce";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "72px 80px",
        background: "linear-gradient(140deg, #16233a 0%, #0b1526 100%)", color: "#f5f1e8",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, color: "#e8b48a", letterSpacing: 2 }}>
          <svg width="34" height="21" viewBox="0 0 100 60">
            <path d="M6,30 C16,15 50,12 68,22 L95,9 L88,30 L95,51 L68,38 C50,48 16,45 6,30 Z" fill="#e8b48a" />
          </svg>
          AKWA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, fontWeight: 700, maxWidth: 900 }}>
            Dimensionnez votre bac avant d&apos;acheter
          </div>
          <div style={{ fontSize: 30, color: "#b9c4d6", maxWidth: 860, lineHeight: 1.4 }}>
            Onze calculateurs pour aquarium d&apos;eau douce, et un assistant qui les enchaîne.
          </div>
        </div>
        <div style={{ display: "flex", gap: 44, fontSize: 25, color: "#8fa0ba" }}>
          <span>11 calculateurs</span><span>41 espèces</span><span>Gratuit, sans inscription</span>
        </div>
      </div>
    ),
    size
  );
}
