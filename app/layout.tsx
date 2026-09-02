import type { Metadata } from "next";
import Link from "next/link";
import { Spectral } from "next/font/google";
import { OUTILS } from "@/lib/outils";
import { SITE } from "@/lib/site";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nom} — ${SITE.accroche}`,
    template: `%s | ${SITE.nom}`,
  },
  description:
    "Onze calculateurs gratuits pour dimensionner un aquarium d'eau douce : volume réel, poids en charge, population, filtration, éclairage, chauffage, coupe à l'eau osmosée et sécurité du verre.",
  openGraph: { locale: "fr_FR", type: "website", siteName: SITE.nom },
  // La vérification par DNS couvre le domaine entier et vaut mieux ; cette
  // balise n'est là que pour qui préfère la méthode HTML.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={spectral.variable}>
      <body>
        <nav className="topbar">
          <div className="wrap topbar-in">
            <Link href="/" className="brand">
              <svg width="20" height="13" viewBox="0 0 100 60" aria-hidden>
                <path d="M6,30 C16,15 50,12 68,22 L95,9 L88,30 L95,51 L68,38 C50,48 16,45 6,30 Z" fill="currentColor" />
              </svg>
              {SITE.nom}
            </Link>
            <div className="topnav">
              <Link href="/">Assistant</Link>
              <Link href="/calculateurs">Les 11 calculateurs</Link>
            </div>
          </div>
        </nav>

        {children}

        <footer>
          <div className="wrap">
            <div className="foot-cols">
              {(["Les essentiels", "L'eau", "Le matériel"] as const).map((fam) => (
                <div key={fam}>
                  <h4>{fam}</h4>
                  <ul>
                    {OUTILS.filter((o) => o.famille === fam).map((o) => (
                      <li key={o.slug}><Link href={`/calculateurs/${o.slug}`}>{o.nom}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p><strong>En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.</strong></p>
            <p>
              Aucun prix n&apos;est affiché sur ce site. Les liens renvoient vers les résultats de recherche
              Amazon.fr, où le prix et la disponibilité en vigueur font foi.
            </p>
            <p>
              Les calculs sont des ordres de grandeur destinés à orienter un choix de matériel. Ils ne
              remplacent ni l&apos;observation du bac ni le suivi régulier des paramètres de l&apos;eau.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
