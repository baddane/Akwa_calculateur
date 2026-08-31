export type Famille = "Les essentiels" | "L'eau" | "Le matériel";

export type Outil = {
  slug: string;
  nom: string;
  famille: Famille;
  titre: string;        // balise title, ciblée sur la requête
  description: string;  // méta description
  h1: string;
  intro: string;
};

export const OUTILS: Outil[] = [
  {
    slug: "volume", nom: "Volume réel", famille: "Les essentiels",
    titre: "Calcul du volume d'un aquarium en litres",
    description: "Calculez le volume réel de votre aquarium en litres, une fois retirés la marge sous le rebord, le substrat et le décor. C'est ce volume net qui sert à tous les autres calculs.",
    h1: "Quel est le volume réel de votre aquarium ?",
    intro: "Le chiffre affiché par les fabricants est le volume brut, celui d'une boîte vide. Une fois le niveau d'eau placé sous le rebord, le sol étalé et le décor posé, il reste couramment un cinquième de moins. Tous les calculs qui suivent, population, filtration, dosage des traitements, partent de ce volume net et non du volume commercial.",
  },
  {
    slug: "poids", nom: "Poids en charge", famille: "Les essentiels",
    titre: "Poids d'un aquarium rempli : calcul en kilos",
    description: "Calculez le poids total d'un aquarium en eau : verre, eau, substrat et décor, plus la charge au mètre carré. À vérifier avant de poser un bac sur un meuble ou un plancher.",
    h1: "Combien pèsera votre aquarium une fois rempli ?",
    intro: "Un bac vide se porte à deux. Le même bac en eau dépasse souvent le poids d'un piano droit, concentré sur moins d'un demi-mètre carré. C'est la vérification qu'on saute, et celle qui coûte le plus cher quand un meuble cède ou qu'un plancher ancien travaille.",
  },
  {
    slug: "substrat", nom: "Substrat", famille: "Les essentiels",
    titre: "Combien de kilos de sable ou de sol pour un aquarium",
    description: "Calculez la quantité de substrat nécessaire en litres et en kilos selon la surface du bac, l'épaisseur voulue et le matériau : sable de quartz, gravier, sol nutritif ou technique.",
    h1: "Combien de substrat pour votre bac ?",
    intro: "Trop peu et les plantes ne s'enracinent pas. Trop et le sol se compacte, fermente et empoisonne le bac. L'épaisseur utile se situe entre 3 et 6 cm selon que vous plantez ou non, et la quantité dépend du matériau : un sol technique pèse moitié moins qu'un sable de quartz à volume égal.",
  },
  {
    slug: "population", nom: "Population", famille: "Les essentiels",
    titre: "Combien de poissons dans un aquarium : calculateur",
    description: "Calculez combien de poissons votre aquarium peut accueillir, espèce par espèce. Charge biologique pondérée, effectifs de banc, volume minimum et fenêtre de température commune.",
    h1: "Combien de poissons pouvez-vous maintenir ?",
    intro: "La règle du centimètre de poisson par litre traîne partout et surpeuple à peu près tous les bacs qui la suivent. Elle ignore que deux poissons de même longueur ne salissent pas pareil, qu'une espèce grégaire seule dépérit, et que deux espèces vendues côte à côte peuvent réclamer des températures incompatibles.",
  },
  {
    slug: "changement-eau", nom: "Changement d'eau", famille: "L'eau",
    titre: "Quel pourcentage de changement d'eau pour baisser les nitrates",
    description: "Calculez le volume d'eau à renouveler pour atteindre un taux de nitrates visé, en tenant compte des nitrates déjà présents dans votre eau du robinet.",
    h1: "Quel changement d'eau pour vos nitrates ?",
    intro: "Les nitrates sont le déchet final du cycle de l'azote. Ni la filtration ni le temps ne les font disparaître : seuls le changement d'eau et les plantes y parviennent. Et votre eau du robinet en contient déjà, ce qui fixe un plancher sous lequel aucun renouvellement ne descendra jamais.",
  },
  {
    slug: "eau-osmosee", nom: "Coupe à l'eau osmosée", famille: "L'eau",
    titre: "Couper son eau du robinet à l'osmosée : calcul du mélange",
    description: "Calculez la proportion d'eau osmosée et d'eau du robinet pour atteindre une dureté cible. Conversion entre degrés français de votre commune et degrés allemands de vos tests.",
    h1: "Quelle proportion d'eau osmosée pour votre bac ?",
    intro: "L'eau du robinet française est souvent très dure, jusqu'à 30 °f en Île-de-France, quand un bac à crevettes en réclame 6 à 8 °dGH. Deux unités coexistent et sèment la confusion : votre commune publie des degrés français, vos tests d'aquariophilie affichent des degrés allemands. Le facteur de conversion est de 1,78.",
  },
  {
    slug: "verre", nom: "Sécurité du verre", famille: "L'eau",
    titre: "Épaisseur de verre nécessaire pour un aquarium",
    description: "Vérifiez si l'épaisseur de verre de votre aquarium convient à sa hauteur d'eau et à sa longueur. Contrôle indicatif fondé sur des paliers prudents.",
    h1: "Votre verre est-il assez épais ?",
    intro: "La pression exercée sur une vitre croît avec le carré de la hauteur d'eau, pas avec le volume. Un bac bas et long est moins sollicité qu'un bac haut et court de même contenance. C'est la vérification à faire avant d'acheter un bac d'occasion, ou avant de remonter une cuve dont on ignore l'histoire.",
  },
  {
    slug: "filtration", nom: "Filtration", famille: "Le matériel",
    titre: "Quel débit de filtre pour un aquarium : calcul en L/h",
    description: "Calculez le débit de filtre nécessaire pour votre aquarium, corrigé de la perte réelle une fois les masses filtrantes en place. Le débit constructeur à viser à l'achat.",
    h1: "Quel débit de filtre pour votre bac ?",
    intro: "Le débit imprimé sur l'emballage est mesuré à vide, sans mousse ni céramique. Une fois le filtre garni puis progressivement encrassé, il en reste environ deux tiers. C'est pourquoi il faut acheter sur un chiffre corrigé, et non sur celui du carton.",
  },
  {
    slug: "eclairage", nom: "Éclairage", famille: "Le matériel",
    titre: "Combien de lumens pour un aquarium planté",
    description: "Calculez la puissance d'éclairage nécessaire en lumens et en watts selon le volume, la hauteur d'eau et l'exigence de vos plantes.",
    h1: "Quel éclairage pour vos plantes ?",
    intro: "L'éclairage se raisonne en lumens, pas en watts : deux rampes de même consommation peuvent produire du simple au double. Et la lumière s'atténue en traversant l'eau, donc un bac haut réclame davantage qu'un bac bas de même contenance.",
  },
  {
    slug: "chauffage", nom: "Chauffage", famille: "Le matériel",
    titre: "Quelle puissance de chauffage pour un aquarium en watts",
    description: "Calculez la puissance de chauffage nécessaire selon le volume net, la température de la pièce et la température visée dans le bac.",
    h1: "Quelle puissance de chauffage ?",
    intro: "Ce qui compte n'est pas le volume seul mais l'écart à combler entre la pièce et le bac. Un même aquarium dans une véranda non chauffée et dans un salon à 21 °C ne demande pas la même puissance, et un chauffage trop juste tourne en permanence sans jamais tenir la consigne.",
  },
  {
    slug: "kit", nom: "Kit de démarrage", famille: "Le matériel",
    titre: "Liste de matériel pour démarrer un aquarium",
    description: "Obtenez la liste complète du matériel nécessaire au démarrage d'un aquarium d'eau douce, dimensionnée sur vos mesures : filtre, chauffage, éclairage, substrat, tests et entretien.",
    h1: "Tout ce qu'il faut pour démarrer",
    intro: "La liste ci-dessous est calculée sur vos dimensions : puissance de chauffage, débit de filtre, kilos de substrat et longueur de rampe en découlent directement. Elle couvre la mise en eau, pas les poissons, qui n'arrivent qu'une fois le cycle de l'azote terminé.",
  },
];

export const outilParSlug = (slug: string) => OUTILS.find((o) => o.slug === slug);
export const FAMILLES: Famille[] = ["Les essentiels", "L'eau", "Le matériel"];
