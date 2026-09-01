import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OUTILS, outilParSlug } from "@/lib/outils";
import { SITE } from "@/lib/site";
import Outil from "@/components/outils";
import { CONTENU } from "@/lib/contenu";
import { SchemaOutil } from "@/components/Schema";
import { Methode, Faq } from "@/components/Contenu";
import { chargerVisuels } from "@/lib/catalogue";

export function generateStaticParams() {
  return OUTILS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = outilParSlug(slug);
  if (!o) return {};
  return {
    title: o.titre,
    description: o.description,
    alternates: { canonical: `/calculateurs/${o.slug}` },
    openGraph: { title: o.titre, description: o.description, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = outilParSlug(slug);
  if (!o) notFound();

  const voisins = OUTILS.filter((x) => x.famille === o.famille && x.slug !== o.slug);
  const c = CONTENU[o.slug];
  const visuels = o.slug === "kit" ? await chargerVisuels() : {};

  return (
    <>
      <SchemaOutil outil={o} faq={c.faq} />
      <header className="page-head">
        <div className="wrap">
          <nav className="fil">
            <Link href="/">{SITE.nom}</Link> <span>/</span>{" "}
            <Link href="/calculateurs">Calculateurs</Link> <span>/</span> {o.nom}
          </nav>
          <h1>{o.h1}</h1>
          <p>{o.intro}</p>
        </div>
      </header>

      <main className="wrap">
        <Outil slug={o.slug} visuels={visuels} />

        <Methode paragraphes={c.methode} titre={`Comment se calcule ${o.nom.toLowerCase()}`} />
        <Faq questions={c.faq} />

        <section className="voisins">
          <h2>Dans la même famille</h2>
          <div className="tuiles">
            {voisins.map((v) => (
              <Link key={v.slug} href={`/calculateurs/${v.slug}`} className="tuile">
                <b>{v.nom}</b><span>{v.description}</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 18 }}>
            <Link href="/" className="lnk-u">Vous débutez ? L&apos;assistant vous guide de bout en bout</Link>
          </p>
        </section>
      </main>
    </>
  );
}
