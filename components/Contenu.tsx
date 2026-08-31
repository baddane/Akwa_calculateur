import type { Contenu } from "@/lib/contenu";

export function Methode({ paragraphes, titre }: { paragraphes: string[]; titre: string }) {
  return (
    <section className="prose">
      <h2>{titre}</h2>
      {paragraphes.map((p, i) => <p key={i}>{p}</p>)}
    </section>
  );
}

export function Faq({ questions }: { questions: Contenu["faq"] }) {
  return (
    <section className="prose">
      <h2>Questions fréquentes</h2>
      <div className="faq">
        {questions.map((f, i) => (
          <details key={i} open={i === 0}>
            <summary>{f.q}</summary>
            <p>{f.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
