import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculateurs aquarium eau douce : volume, population, filtration, matériel",
  description:
    "Quatre calculateurs gratuits pour dimensionner un aquarium d'eau douce : volume réel après substrat et décor, population maximale par espèce, débit de filtration réel, et liste de matériel de démarrage complète.",
  openGraph: {
    title: "Calculateurs aquarium eau douce",
    description:
      "Volume réel, population maximale, débit de filtration et kit de démarrage. Quatre outils gratuits pour dimensionner un bac d'eau douce.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
