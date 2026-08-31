"use client";

export function Champ({ id, label, valeur, onChange, hint, min = 0, step }: {
  id: string; label: string; valeur: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string; min?: number; step?: number;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min={min} step={step} value={valeur} onChange={onChange} />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Stat({ k, v, u, lead = false }: { k: string; v: string | number; u?: string; lead?: boolean }) {
  return (
    <div className={lead ? "stat lead" : "stat"}>
      <div className="k">{k}</div>
      <div className="v">{v}{u && <span className="u">{u}</span>}</div>
    </div>
  );
}

export function Verdict({ mot, ton }: { mot: string; ton: "ok" | "warn" | "danger" }) {
  const c = ton === "ok" ? "var(--ok)" : ton === "warn" ? "var(--warn)" : "var(--danger)";
  return <span className="badge" style={{ background: c }}>{mot}</span>;
}

export function Jauge({ part, ton }: { part: number; ton: "ok" | "warn" | "danger" }) {
  const c = ton === "ok" ? "var(--ok)" : ton === "warn" ? "var(--warn)" : "var(--danger)";
  return <div className="bar"><span style={{ width: `${Math.min(100, part * 100)}%`, background: c }} /></div>;
}

export function Achat({ q, children }: { q: string; children: React.ReactNode }) {
  const url = `https://www.amazon.fr/s?k=${encodeURIComponent(q)}&tag=baddane0a-21`;
  return <a className="btn" href={url} target="_blank" rel="sponsored nofollow noopener">{children}</a>;
}
