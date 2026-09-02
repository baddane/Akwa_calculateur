import type { Outil } from "@/lib/outils";
import type { Question } from "@/lib/contenu";
import { SITE } from "@/lib/site";

const BASE = SITE.url;

function Ld({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function SchemaSite() {
  return (
    <Ld data={{
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.nom,
      alternateName: `${SITE.nom}, ${SITE.accroche}`,
      url: BASE,
      inLanguage: "fr-FR",
      description:
        "Onze calculateurs gratuits pour dimensionner un aquarium d'eau douce : volume, poids, population, filtration, éclairage, chauffage et sécurité du verre.",
    }} />
  );
}

export function SchemaOutil({ outil, faq }: { outil: Outil; faq: Question[] }) {
  const url = `${BASE}/calculateurs/${outil.slug}`;
  return (
    <>
      <Ld data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.nom, item: BASE },
          { "@type": "ListItem", position: 2, name: "Calculateurs", item: `${BASE}/calculateurs` },
          { "@type": "ListItem", position: 3, name: outil.nom, item: url },
        ],
      }} />
      <Ld data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: outil.nom,
        url,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Calculateur d'aquariophilie",
        operatingSystem: "Tout navigateur web",
        description: outil.description,
        isAccessibleForFree: true,
        dateModified: outil.maj,
        inLanguage: "fr-FR",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      }} />
      <Ld data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.r },
        })),
      }} />
    </>
  );
}

export function SchemaListe({ outils }: { outils: Outil[] }) {
  return (
    <>
      <Ld data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.nom, item: BASE },
          { "@type": "ListItem", position: 2, name: "Calculateurs", item: `${BASE}/calculateurs` },
        ],
      }} />
      <Ld data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Les onze calculateurs pour aquarium d'eau douce",
        numberOfItems: outils.length,
        itemListElement: outils.map((o, i) => ({
          "@type": "ListItem", position: i + 1, name: o.nom,
          url: `${BASE}/calculateurs/${o.slug}`,
        })),
      }} />
    </>
  );
}
