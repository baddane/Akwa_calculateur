export type Icone =
  | "bac" | "filtre" | "chauffage" | "lampe" | "substrat" | "flacon"
  | "bacteries" | "tests" | "thermometre" | "siphon" | "epuisette"
  | "nourriture" | "seau" | "outils";

/* Pictogrammes dessinés dans une boîte 48 × 48, trait de 2,4 pour rester
   lisibles à 26 px comme à 44 px. */
const D: Record<Icone, React.JSX.Element> = {
  bac: (<>
    <rect x="6" y="12" width="36" height="26" rx="2" />
    <path d="M6 19h36" />
    <path d="M14 30c2-2 5-2 7 0" />
    <circle cx="30" cy="28" r="1.6" fill="currentColor" stroke="none" />
    <path d="M27 28l-4-3v6z" fill="currentColor" stroke="none" />
  </>),
  filtre: (<>
    <rect x="12" y="20" width="20" height="22" rx="3" />
    <path d="M16 20v-4h12v4" />
    <path d="M32 26h5a4 4 0 004-4v-4" />
    <path d="M17 27h10M17 32h10M17 37h10" />
  </>),
  chauffage: (<>
    <rect x="19" y="6" width="10" height="36" rx="5" />
    <path d="M24 12v6" />
    <path d="M21 24l6 3-6 3 6 3" />
    <path d="M29 14h6" />
  </>),
  lampe: (<>
    <rect x="5" y="12" width="38" height="8" rx="2" />
    <path d="M13 26v6M24 26v9M35 26v6" />
    <path d="M9 14h30" />
  </>),
  substrat: (<>
    <path d="M14 14h20l4 26H10z" />
    <path d="M16 10h16l2 4H14z" />
    <circle cx="19" cy="28" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="26" cy="32" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="30" cy="25" r="1.8" fill="currentColor" stroke="none" />
  </>),
  flacon: (<>
    <path d="M20 6h8v7l6 10v17a2 2 0 01-2 2H16a2 2 0 01-2-2V23l6-10z" />
    <path d="M15 26h18" />
    <path d="M19 33h10" />
  </>),
  bacteries: (<>
    <path d="M18 6h12v6l4 8v20a2 2 0 01-2 2H16a2 2 0 01-2-2V20l4-8z" />
    <circle cx="21" cy="29" r="2.4" />
    <circle cx="28" cy="34" r="2" />
    <circle cx="28" cy="25" r="1.6" />
  </>),
  tests: (<>
    <path d="M13 6v28a5 5 0 0010 0V6" />
    <path d="M10 6h16" />
    <path d="M13 24h10" />
    <path d="M29 14v20a5 5 0 0010 0V14" />
    <path d="M26 14h16" />
    <path d="M29 28h10" />
  </>),
  thermometre: (<>
    <path d="M20 28V10a4 4 0 018 0v18a8 8 0 11-8 0z" />
    <circle cx="24" cy="34" r="3.4" fill="currentColor" stroke="none" />
    <path d="M31 14h5M31 20h5M31 26h5" />
  </>),
  siphon: (<>
    <path d="M17 8h14v12a7 7 0 01-14 0z" />
    <path d="M24 27v9a5 5 0 005 5h8" />
    <path d="M20 15h8" />
  </>),
  epuisette: (<>
    <circle cx="18" cy="17" r="11" />
    <path d="M9 14h18M9 20h18M18 6v22" />
    <path d="M26 25l13 15" />
  </>),
  nourriture: (<>
    <rect x="15" y="14" width="18" height="28" rx="2" />
    <path d="M13 10h22v4H13z" />
    <path d="M20 22h8M20 28h8M20 34h5" />
  </>),
  seau: (<>
    <path d="M11 16h26l-3 24H14z" />
    <path d="M16 16a8 8 0 0116 0" />
    <path d="M13 26h22" />
  </>),
  outils: (<>
    <path d="M10 8l16 22M38 8L22 30" />
    <circle cx="15" cy="36" r="5" />
    <circle cx="33" cy="36" r="5" />
  </>),
};

/** Photo produit si l'API Amazon en a fourni une, pictogramme sinon. */
export function VisuelMateriel({ nom, visuel }: { nom: Icone; visuel?: { image: string; titre: string } }) {
  if (visuel) {
    return (
      <span className="buyico buyphoto">
        <img src={visuel.image} alt={visuel.titre.slice(0, 90)} loading="lazy" />
      </span>
    );
  }
  return <span className="buyico"><IconeMateriel nom={nom} /></span>;
}

export function IconeMateriel({ nom, taille = 31 }: { nom: Icone; taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 48 48" aria-hidden
      fill="none" stroke="currentColor" strokeWidth="2.6"
      strokeLinecap="round" strokeLinejoin="round">
      {D[nom]}
    </svg>
  );
}
