import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides d'achat pour aquarium d'eau douce",
  description: "Quel filtre, quel chauffage : des guides pour choisir le matériel de votre aquarium selon son volume, avec les chiffres à lire sur la boîte.",
  alternates: { canonical: "/guides" },
};

export default function Page() {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <nav className="fil"><Link href="/">{SITE.nom}</Link> <span>/</span> Guides</nav>
          <h1>Guides d&apos;achat</h1>
          <p>
            Les calculateurs disent combien : combien de litres, de watts, de litres par heure. Les guides
            disent quoi : quel type de matériel pour votre bac, et ce qu&apos;il faut vérifier avant d&apos;acheter.
          </p>
        </div>
      </header>
      <main className="wrap">
        <div className="tuiles" style={{ marginTop: 32 }}>
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="tuile">
              <b>{g.nom}</b><span>{g.description}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
