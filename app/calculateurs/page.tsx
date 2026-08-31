import type { Metadata } from "next";
import Link from "next/link";
import { OUTILS, FAMILLES } from "@/lib/outils";

export const metadata: Metadata = {
  title: "Les 11 calculateurs pour aquarium d'eau douce",
  description:
    "Volume, poids en charge, substrat, population, changement d'eau, coupe à l'osmosée, sécurité du verre, filtration, éclairage, chauffage et liste de matériel. Onze calculateurs gratuits, sans inscription.",
  alternates: { canonical: "/calculateurs" },
};

export default function Page() {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <nav className="fil"><Link href="/">Akwa</Link> <span>/</span> Calculateurs</nav>
          <h1>Les onze calculateurs</h1>
          <p>
            Chacun répond à une question précise et fonctionne seul. Vos dimensions se retiennent
            d&apos;un outil à l&apos;autre : vous les saisissez une fois. Si vous débutez et ne savez pas par
            quel bout prendre le sujet, <Link href="/">l&apos;assistant</Link> les enchaîne pour vous.
          </p>
        </div>
      </header>
      <main className="wrap">
        {FAMILLES.map((fam) => (
          <section className="fam" key={fam}>
            <h2>{fam}</h2>
            <div className="tuiles">
              {OUTILS.filter((o) => o.famille === fam).map((o) => (
                <Link key={o.slug} href={`/calculateurs/${o.slug}`} className="tuile">
                  <b>{o.nom}</b><span>{o.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
