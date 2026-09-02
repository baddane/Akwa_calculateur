import type { Metadata } from "next";
import { EPINGLES, CREDITS, type Epingle } from "@/lib/epingles";

export const metadata: Metadata = { title: "Épingles", robots: { index: false, follow: false } };

function Corps({ e }: { e: Epingle }) {
  if (e.mise === "duel") {
    return (
      <>
        <div className="pin-punch">{e.punch}</div>
        <div className="pin-duel">
          <div><b>{e.gauche!.t}</b><span>{e.gauche!.s}</span></div>
          <em>≠</em>
          <div><b>{e.droite!.t}</b><span>{e.droite!.s}</span></div>
        </div>
        {e.sub && <div className="pin-sub">{e.sub}</div>}
      </>
    );
  }
  if (e.mise === "liste") {
    return (
      <>
        <div className="pin-punch">{e.punch}</div>
        <ul className="pin-liste">{e.items!.map((i) => <li key={i}>{i}</li>)}</ul>
      </>
    );
  }
  return (
    <>
      <div className="pin-punch">{e.punch}</div>
      {e.big && <div className="pin-big">{e.big}</div>}
      {e.sub && <div className="pin-sub">{e.sub}</div>}
    </>
  );
}

export default function Epingles() {
  return (
    <div className="planche">
      {EPINGLES.map((e) => (
        <div key={e.id} id={`pin-${e.id}`} className={`pin tone-${e.ton} mise-${e.mise}`}>
          <img className="pin-fond" src={`/fonds/${e.fond}.jpg`} alt="" />
          <div className="pin-voile" />
          <div className="pin-kicker">{e.kicker}</div>
          <div className="pin-corps"><Corps e={e} /></div>
          <div className="pin-foot">
            <svg width="34" height="21" viewBox="0 0 100 60" aria-hidden>
              <path d="M6,30 C16,15 50,12 68,22 L95,9 L88,30 L95,51 L68,38 C50,48 16,45 6,30 Z" fill="currentColor" />
            </svg>
            aquametre.fr
            <span className="pin-credit">Photo {CREDITS[e.fond]} / Unsplash</span>
          </div>
        </div>
      ))}
    </div>
  );
}
