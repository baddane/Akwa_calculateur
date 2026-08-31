export type Zone = "Surface" | "Milieu" | "Fond";
export type Shape = "tetra" | "guppy" | "cory" | "betta" | "disc" | "eel" | "shrimp" | "snail";

export type Species = {
  id: string;
  nom: string;
  latin: string;
  taille: number;      // taille adulte en cm
  volumeMin: number;   // volume net minimum en litres
  bancMin: number;     // effectif minimum (1 = solitaire ou couple)
  charge: number;      // facteur de charge biologique
  zone: Zone;
  shape: Shape;
  tMin: number;       // température basse tolérée, °C
  tMax: number;       // température haute tolérée, °C
  note?: string;
};

export const ESPECES: Species[] = [
  { id: "neon",     nom: "Néon bleu",         latin: "Paracheirodon innesi",     taille: 3.5, volumeMin: 80,  bancMin: 10, charge: 1.0, shape: "tetra", tMin: 21, tMax: 27, zone: "Milieu" },
  { id: "cardin",   nom: "Cardinalis",        latin: "Paracheirodon axelrodi",   taille: 4,   volumeMin: 100, bancMin: 10, charge: 1.0, shape: "tetra", tMin: 24, tMax: 29, zone: "Milieu" },
  { id: "guppy",    nom: "Guppy",             latin: "Poecilia reticulata",      taille: 5,   volumeMin: 60,  bancMin: 3,  charge: 1.0, shape: "guppy", tMin: 22, tMax: 28, zone: "Surface", note: "1 mâle pour 2 femelles minimum, sinon harcèlement" },
  { id: "platy",    nom: "Platy",             latin: "Xiphophorus maculatus",    taille: 6,   volumeMin: 80,  bancMin: 3,  charge: 1.1, shape: "guppy", tMin: 20, tMax: 26, zone: "Milieu" },
  { id: "xipho",    nom: "Xipho",             latin: "Xiphophorus hellerii",     taille: 10,  volumeMin: 150, bancMin: 3,  charge: 1.3, shape: "guppy", tMin: 22, tMax: 28, zone: "Milieu" },
  { id: "molly",    nom: "Molly",             latin: "Poecilia sphenops",        taille: 10,  volumeMin: 150, bancMin: 3,  charge: 1.3, shape: "guppy", tMin: 24, tMax: 28, zone: "Milieu" },
  { id: "danio",    nom: "Danio rerio",       latin: "Danio rerio",              taille: 5,   volumeMin: 80,  bancMin: 8,  charge: 1.0, shape: "tetra", tMin: 18, tMax: 24, zone: "Surface" },
  { id: "rasbora",  nom: "Rasbora arlequin",  latin: "Trigonostigma heteromorpha", taille: 4.5, volumeMin: 80, bancMin: 8, charge: 1.0, shape: "tetra", tMin: 23, tMax: 28, zone: "Milieu" },
  { id: "nezrouge", nom: "Nez rouge",         latin: "Hemigrammus rhodostomus",  taille: 5,   volumeMin: 120, bancMin: 10, charge: 1.0, shape: "tetra", tMin: 24, tMax: 28, zone: "Milieu", note: "Exige une eau très stable, à réserver aux bacs rodés" },
  { id: "pristella",nom: "Pristella",         latin: "Pristella maxillaris",     taille: 4.5, volumeMin: 80,  bancMin: 8,  charge: 1.0, shape: "tetra", tMin: 23, tMax: 28, zone: "Milieu" },
  { id: "barbus",   nom: "Barbus de Sumatra", latin: "Puntigrus tetrazona",      taille: 7,   volumeMin: 150, bancMin: 10, charge: 1.3, shape: "tetra", tMin: 21, tMax: 26, zone: "Milieu", note: "Mordeur de nageoires, à éviter avec des poissons voilés" },
  { id: "corypal",  nom: "Corydoras paleatus",latin: "Corydoras paleatus",       taille: 6,   volumeMin: 100, bancMin: 6,  charge: 1.1, shape: "cory", tMin: 18, tMax: 24, zone: "Fond",   note: "Exige un sol fin et non coupant" },
  { id: "corypanda",nom: "Corydoras panda",   latin: "Corydoras panda",          taille: 5,   volumeMin: 80,  bancMin: 6,  charge: 1.1, shape: "cory", tMin: 20, tMax: 25, zone: "Fond" },
  { id: "ancistrus",nom: "Ancistrus",         latin: "Ancistrus sp.",            taille: 12,  volumeMin: 120, bancMin: 1,  charge: 1.4, shape: "cory", tMin: 22, tMax: 27, zone: "Fond",   note: "Gros producteur de déchets, prévoir une racine" },
  { id: "oto",      nom: "Otocinclus",        latin: "Otocinclus affinis",       taille: 4,   volumeMin: 60,  bancMin: 6,  charge: 0.8, shape: "cory", tMin: 21, tMax: 27, zone: "Fond",   note: "À n'introduire que dans un bac mûr, riche en algues" },
  { id: "kuhli",    nom: "Loche kuhli",       latin: "Pangio kuhlii",            taille: 10,  volumeMin: 100, bancMin: 6,  charge: 1.0, shape: "eel", tMin: 24, tMax: 28, zone: "Fond" },
  { id: "betta",    nom: "Combattant",        latin: "Betta splendens",          taille: 6.5, volumeMin: 30,  bancMin: 1,  charge: 0.9, shape: "betta", tMin: 24, tMax: 28, zone: "Surface", note: "Un seul mâle par bac, jamais deux" },
  { id: "gourami",  nom: "Gourami nain",      latin: "Trichogaster lalius",      taille: 6,   volumeMin: 80,  bancMin: 2,  charge: 1.0, shape: "betta", tMin: 23, tMax: 28, zone: "Surface" },
  { id: "scalaire", nom: "Scalaire",          latin: "Pterophyllum scalare",     taille: 15,  volumeMin: 240, bancMin: 2,  charge: 1.5, shape: "disc", tMin: 24, tMax: 29, zone: "Milieu", note: "Hauteur de bac de 50 cm minimum" },
  { id: "crevette", nom: "Crevette Neocaridina", latin: "Neocaridina davidi",    taille: 3,   volumeMin: 20,  bancMin: 10, charge: 0.3, shape: "shrimp", tMin: 18, tMax: 26, zone: "Fond" },
  { id: "tetracitron", nom: "Tétra citron",     latin: "Hyphessobrycon pulchripinnis", taille: 4.5, volumeMin: 100, bancMin: 8, charge: 1.0, shape: "tetra", tMin: 23, tMax: 28, zone: "Milieu" },
  { id: "tetraemp",  nom: "Tétra empereur",    latin: "Nematobrycon palmeri",     taille: 5,   volumeMin: 100, bancMin: 8,  charge: 1.0, shape: "tetra", tMin: 23, tMax: 27, zone: "Milieu" },
  { id: "neonnoir",  nom: "Néon noir",         latin: "Hyphessobrycon herbertaxelrodi", taille: 4, volumeMin: 100, bancMin: 10, charge: 1.0, shape: "tetra", tMin: 23, tMax: 27, zone: "Milieu" },
  { id: "fantome",   nom: "Tétra fantôme noir",latin: "Hyphessobrycon megalopterus", taille: 4.5, volumeMin: 100, bancMin: 8, charge: 1.0, shape: "tetra", tMin: 22, tMax: 28, zone: "Milieu" },
  { id: "endler",    nom: "Guppy Endler",      latin: "Poecilia wingei",          taille: 3,   volumeMin: 45,  bancMin: 5,  charge: 0.8, shape: "guppy", tMin: 22, tMax: 28, zone: "Surface", note: "Se croise avec le guppy commun, à ne pas mélanger si vous tenez à la souche" },
  { id: "nanno",     nom: "Nannostomus",       latin: "Nannostomus beckfordi",    taille: 4,   volumeMin: 80,  bancMin: 8,  charge: 0.8, shape: "tetra", tMin: 23, tMax: 28, zone: "Milieu" },
  { id: "caplopez",  nom: "Killi Cap Lopez",   latin: "Aphyosemion australe",     taille: 6,   volumeMin: 60,  bancMin: 2,  charge: 0.9, shape: "betta", tMin: 21, tMax: 25, zone: "Milieu", note: "Sauteur, le bac doit être couvert" },
  { id: "gouramiel", nom: "Gourami miel",      latin: "Trichogaster chuna",       taille: 5,   volumeMin: 60,  bancMin: 2,  charge: 0.9, shape: "betta", tMin: 23, tMax: 28, zone: "Surface" },
  { id: "gouraperle",nom: "Gourami perlé",     latin: "Trichopodus leerii",       taille: 12,  volumeMin: 200, bancMin: 2,  charge: 1.3, shape: "betta", tMin: 24, tMax: 28, zone: "Surface" },
  { id: "cardchine", nom: "Cardinal de Chine", latin: "Tanichthys albonubes",     taille: 4,   volumeMin: 60,  bancMin: 8,  charge: 0.8, shape: "tetra", tMin: 16, tMax: 22, zone: "Milieu", note: "Espèce d'eau fraîche, incompatible avec un bac tropical chauffé" },
  { id: "corysterbai",nom: "Corydoras sterbai",latin: "Corydoras sterbai",        taille: 6.5, volumeMin: 120, bancMin: 6,  charge: 1.1, shape: "cory", tMin: 24, tMax: 28, zone: "Fond" },
  { id: "coryhabro", nom: "Corydoras habrosus",latin: "Corydoras habrosus",       taille: 3.5, volumeMin: 60,  bancMin: 8,  charge: 0.9, shape: "cory", tMin: 22, tMax: 26, zone: "Fond" },
  { id: "botia",     nom: "Botia clown",       latin: "Chromobotia macracanthus", taille: 25,  volumeMin: 500, bancMin: 5,  charge: 1.8, shape: "eel", tMin: 25, tMax: 29, zone: "Fond",   note: "Atteint 25 cm et vit en groupe, réservé aux très grands volumes" },
  { id: "amano",     nom: "Crevette Amano",    latin: "Caridina multidentata",    taille: 5,   volumeMin: 40,  bancMin: 5,  charge: 0.4, shape: "shrimp", tMin: 20, tMax: 27, zone: "Fond",   note: "Ne se reproduit pas en eau douce, la population ne se renouvelle pas" },
  { id: "neritina",  nom: "Escargot Neritina", latin: "Neritina natalensis",      taille: 3,   volumeMin: 20,  bancMin: 1,  charge: 0.3, shape: "snail", tMin: 22, tMax: 28, zone: "Fond",   note: "Pond des œufs blancs qui n'éclosent jamais en eau douce" },
  { id: "ramirezi",  nom: "Ramirezi",          latin: "Mikrogeophagus ramirezi",  taille: 5,   volumeMin: 100, bancMin: 2,  charge: 1.1, shape: "disc", tMin: 26, tMax: 29, zone: "Fond",   note: "Exige une eau chaude et très propre, fragile en bac neuf" },
  { id: "apisto",    nom: "Apistogramma",      latin: "Apistogramma cacatuoides", taille: 8,   volumeMin: 120, bancMin: 2,  charge: 1.1, shape: "disc", tMin: 24, tMax: 28, zone: "Fond",   note: "Territorial pendant la reproduction, prévoir des caches" },
  { id: "discus",    nom: "Discus",            latin: "Symphysodon sp.",          taille: 20,  volumeMin: 400, bancMin: 5,  charge: 1.8, shape: "disc", tMin: 28, tMax: 31, zone: "Milieu", note: "Réservé aux aquariophiles confirmés, eau très chaude et changements fréquents" },
  { id: "labeo",     nom: "Labeo bicolor",     latin: "Epalzeorhynchos bicolor",  taille: 12,  volumeMin: 200, bancMin: 1,  charge: 1.3, shape: "cory", tMin: 23, tMax: 27, zone: "Fond",   note: "Territorial, un seul individu par bac" },
  { id: "barbcerise",nom: "Barbus cerise",     latin: "Puntius titteya",          taille: 5,   volumeMin: 80,  bancMin: 8,  charge: 1.0, shape: "tetra", tMin: 22, tMax: 27, zone: "Milieu" },
  { id: "galaxy",    nom: "Rasbora galaxy",    latin: "Danio margaritatus",       taille: 2.5, volumeMin: 40,  bancMin: 8,  charge: 0.6, shape: "tetra", tMin: 21, tMax: 26, zone: "Milieu" },
];

/* ---------- 1. Volume réel ---------- */

export type VolumeInput = { longueur: number; largeur: number; hauteur: number; substrat: number; decor: number };
export type VolumeResult = { brut: number; net: number; surfaceEau: number; margeHaut: number };

/** Le volume affiché par les fabricants est le volume brut. Le volume utile est
 *  toujours inférieur : niveau d'eau sous le rebord, substrat, décor. */
export function calcVolume(i: VolumeInput): VolumeResult {
  const margeHaut = 4; // cm entre le niveau d'eau et le rebord
  const hauteurEau = Math.max(0, i.hauteur - i.substrat - margeHaut);
  const brut = (i.longueur * i.largeur * i.hauteur) / 1000;
  const colonne = (i.longueur * i.largeur * hauteurEau) / 1000;
  const net = colonne * (1 - i.decor / 100);
  return {
    brut: round(brut),
    net: round(net),
    surfaceEau: round((i.longueur * i.largeur) / 100), // dm²
    margeHaut,
  };
}

/* ---------- 2. Population ---------- */

export type Stock = { id: string; nb: number };
export type PopResult = {
  capaciteCm: number;
  chargeCm: number;
  taux: number;
  verdict: "Confortable" | "Correct" | "Surpeuplé";
  alertes: string[];
  parZone: Record<Zone, number>;
  tempMin: number | null;
  tempMax: number | null;
};

/** Modèle de charge : centimètres de poisson adulte pondérés, rapportés au volume
 *  net, à raison de 1 cm pour 1,1 L. Le facteur de charge propre à chaque espèce
 *  fait déjà le travail que la règle du pouce par gallon ignore : un ancistrus et
 *  un néon de même longueur ne salissent pas pareil. Calibré pour qu'un
 *  communautaire planté correctement filtré tombe autour de 90 %. */
export function calcPopulation(volumeNet: number, stock: Stock[]): PopResult {
  const capaciteCm = volumeNet / 1.1;
  let chargeCm = 0;
  const alertes: string[] = [];
  const parZone: Record<Zone, number> = { Surface: 0, Milieu: 0, Fond: 0 };

  for (const s of stock) {
    const e = ESPECES.find((x) => x.id === s.id);
    if (!e || s.nb <= 0) continue;
    chargeCm += s.nb * e.taille * e.charge;
    parZone[e.zone] += s.nb;
    if (volumeNet < e.volumeMin) {
      alertes.push(`${e.nom} : ${e.volumeMin} L nets minimum, le bac en fait ${Math.round(volumeNet)} L.`);
    }
    if (e.bancMin > 1 && s.nb < e.bancMin) {
      alertes.push(`${e.nom} : espèce grégaire, ${e.bancMin} individus minimum au lieu de ${s.nb}.`);
    }
    if (e.note) alertes.push(`${e.nom} : ${e.note}.`);
  }

  // Fenêtre thermique commune : l'intersection des plages tolérées par chaque espèce.
  let tempMin: number | null = null;
  let tempMax: number | null = null;
  for (const s of stock) {
    const e = ESPECES.find((x) => x.id === s.id);
    if (!e || s.nb <= 0) continue;
    tempMin = tempMin === null ? e.tMin : Math.max(tempMin, e.tMin);
    tempMax = tempMax === null ? e.tMax : Math.min(tempMax, e.tMax);
  }
  if (tempMin !== null && tempMax !== null && tempMin > tempMax) {
    alertes.push(
      "Aucune température ne convient à toutes ces espèces à la fois. Il faut en retirer au moins une."
    );
  }

  const taux = capaciteCm > 0 ? chargeCm / capaciteCm : 0;
  const verdict = taux <= 0.75 ? "Confortable" : taux <= 1 ? "Correct" : "Surpeuplé";
  return { capaciteCm: round(capaciteCm), chargeCm: round(chargeCm), taux, verdict, alertes, parZone, tempMin, tempMax };
}

/* ---------- 3. Filtration ---------- */

export type Profil = "crevettes" | "communautaire" | "forte";
export const ROTATIONS: Record<Profil, { x: number; label: string }> = {
  crevettes:     { x: 3, label: "Crevettes ou bac planté calme" },
  communautaire: { x: 4, label: "Communautaire classique" },
  forte:         { x: 6, label: "Forte charge, gros mangeurs" },
};

export type FiltreResult = { besoin: number; constructeur: number; rotation: number };

/** Le débit annoncé par les fabricants est mesuré à vide. Une fois les masses
 *  filtrantes en place, il chute d'environ un tiers. */
export function calcFiltration(volumeNet: number, profil: Profil): FiltreResult {
  const rotation = ROTATIONS[profil].x;
  const besoin = volumeNet * rotation;
  return { besoin: Math.round(besoin), constructeur: Math.round(besoin / 0.65 / 50) * 50, rotation };
}

/* ---------- 4. Kit de démarrage ---------- */

export type KitLigne = { poste: string; specif: string; recherche: string; essentiel: boolean };

const PALIERS_CHAUFFAGE = [25, 50, 75, 100, 150, 200, 300];

export function calcKit(v: VolumeInput, vol: VolumeResult, profil: Profil, plante: boolean): KitLigne[] {
  const filtre = calcFiltration(vol.net, profil);
  const watts = PALIERS_CHAUFFAGE.find((p) => p >= vol.net) ?? 300;
  const epaisseur = plante ? 6 : 4;
  const litresSol = (v.longueur * v.largeur * epaisseur) / 1000;
  const kgSol = Math.ceil(litresSol * 1.5);
  const rampe = `${Math.max(20, v.longueur - 10)} à ${v.longueur} cm`;

  const lignes: KitLigne[] = [
    { poste: "Aquarium",        specif: `${v.longueur} × ${v.largeur} × ${v.hauteur} cm, soit ${vol.brut} L bruts`, recherche: `aquarium ${Math.round(vol.brut)} litres équipé`, essentiel: true },
    { poste: "Filtre",          specif: `Débit constructeur ${filtre.constructeur} L/h (${filtre.rotation} rotations/h une fois chargé)`, recherche: `filtre aquarium ${filtre.constructeur} l/h`, essentiel: true },
    { poste: "Chauffage",       specif: `${watts} W, environ 1 W par litre net`, recherche: `chauffage aquarium ${watts}w thermostat`, essentiel: true },
    { poste: "Éclairage",       specif: plante ? `Rampe LED ${rampe}, spectre plantes` : `Rampe LED ${rampe}`, recherche: plante ? `rampe led aquarium plantes ${v.longueur} cm` : `rampe led aquarium ${v.longueur} cm`, essentiel: true },
  ];

  if (plante) {
    lignes.push({ poste: "Sol nutritif", specif: `Environ ${Math.ceil(kgSol * 0.45)} kg, en sous-couche de 3 cm`, recherche: "sol nutritif aquarium plante", essentiel: true });
    lignes.push({ poste: "Sable de recouvrement", specif: `Environ ${Math.ceil(kgSol * 0.55)} kg, 3 cm par-dessus`, recherche: "sable de quartz aquarium 3 kg", essentiel: true });
  } else {
    lignes.push({ poste: "Substrat", specif: `Environ ${kgSol} kg pour ${epaisseur} cm d'épaisseur`, recherche: "sable de quartz aquarium", essentiel: true });
  }

  lignes.push(
    { poste: "Conditionneur d'eau", specif: "Neutralise le chlore à chaque changement d'eau", recherche: "conditionneur eau aquarium anti chlore", essentiel: true },
    { poste: "Bactéries de démarrage", specif: "Amorce le cycle de l'azote", recherche: "bacteries demarrage aquarium", essentiel: true },
    { poste: "Tests en gouttes", specif: "pH, NO2, NO3, GH et KH. Les bandelettes sont trop imprécises pour un démarrage", recherche: "test aquarium gouttes ph no2 no3", essentiel: true },
    { poste: "Thermomètre", specif: "Contrôle indépendant du chauffage", recherche: "thermometre aquarium", essentiel: true },
    { poste: "Aspirateur à vase", specif: `Cloche adaptée à ${v.hauteur} cm de hauteur`, recherche: "aspirateur a vase aquarium siphon", essentiel: true },
    { poste: "Épuisette", specif: "Deux tailles, une fine pour les alevins", recherche: "epuisette aquarium lot", essentiel: false },
    { poste: "Nourriture", specif: profil === "crevettes" ? "Bâtonnets pour crevettes" : "Flocons ou granulés selon les zones occupées", recherche: profil === "crevettes" ? "nourriture crevettes aquarium" : "nourriture poisson aquarium granules", essentiel: true },
    { poste: "Seau dédié", specif: "Jamais un seau ayant vu du détergent", recherche: "seau gradue 10 litres", essentiel: false },
  );

  if (plante) {
    lignes.push(
      { poste: "Engrais liquide", specif: "À partir de la 4e semaine", recherche: "engrais plantes aquarium liquide", essentiel: false },
      { poste: "Pince et ciseaux", specif: "Plantation et taille", recherche: "pince ciseaux aquascaping", essentiel: false },
    );
  }

  return lignes;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}


/* ---------- 5. Changement d'eau ---------- */

export type EauInput = { actuel: number; cible: number; robinet: number };
export type EauResult = {
  possible: boolean;
  fraction: number;   // part du volume à renouveler
  litres: number;
  plancher: number;   // nitrates minimum atteignables avec cette eau
  message: string;
};

/** Dilution simple : après renouvellement d'une fraction f, la concentration devient
 *  C1 = C0 (1 - f) + Ct f. L'eau du robinet apporte ses propres nitrates, ce qui fixe
 *  un plancher en dessous duquel aucun changement d'eau ne fait descendre le bac. */
export function calcChangementEau(volumeNet: number, i: EauInput): EauResult {
  const { actuel, cible, robinet } = i;

  if (cible >= actuel) {
    return { possible: true, fraction: 0, litres: 0, plancher: robinet,
      message: "Le taux visé est déjà atteint. Un entretien de 20 à 25 % par semaine suffit à le maintenir." };
  }
  if (robinet >= cible) {
    return { possible: false, fraction: 0, litres: 0, plancher: robinet,
      message: `Votre eau du robinet contient déjà ${robinet} mg/L de nitrates. Aucun changement d'eau ne fera descendre le bac sous ce seuil : il faut couper avec de l'eau osmosée, ou revoir la cible.` };
  }

  const fraction = (actuel - cible) / (actuel - robinet);
  if (fraction > 0.5) {
    return { possible: true, fraction, litres: Math.round(volumeNet * fraction), plancher: robinet,
      message: `Il faudrait renouveler ${Math.round(fraction * 100)} % du volume en une fois, ce qui est brutal pour les poissons. Étalez sur deux ou trois changements espacés de 48 heures.` };
  }
  return { possible: true, fraction, litres: Math.round(volumeNet * fraction), plancher: robinet,
    message: `Un changement unique de ${Math.round(fraction * 100)} % suffit. Pensez à mettre l'eau neuve à température et à la conditionner avant de la verser.` };
}
