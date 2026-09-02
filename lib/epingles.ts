export type Mise = "stat" | "question" | "liste" | "duel";

export type Epingle = {
  id: string;
  mise: Mise;
  ton: 1 | 2 | 3 | 4;
  kicker: string;
  punch: string;
  big?: string;
  sub?: string;
  items?: string[];
  gauche?: { t: string; s: string };
  droite?: { t: string; s: string };
  fond: string;           // photo de fond, dans public/fonds/
  vers: string;           // page de destination
  titre: string;          // titre Pinterest, ~60 caractères utiles
  description: string;    // description Pinterest, riche en mots-clés
};

const U = "https://www.aquametre.fr";

export const EPINGLES: Epingle[] = [
  { id: "volume-perte", mise: "stat", ton: 1, kicker: "Erreur n°1 des débutants",
    punch: "Votre aquarium contient moins d'eau que ce qui est écrit sur la boîte",
    big: "−28 %", sub: "Marge sous le rebord, substrat, décor. C'est le volume net qui commande tout le reste.",
    fond: "plante-clair",
    vers: `${U}/calculateurs/volume`,
    titre: "Calculer le volume réel de son aquarium en litres",
    description: "Le volume affiché par les fabricants est le volume brut. Une fois le substrat et le décor en place, il reste couramment un quart de moins. Calculateur gratuit du volume net, celui qui sert à la population, à la filtration et aux dosages. #aquariophilie #aquarium #aquascaping" },

  { id: "volume-calcul", mise: "question", ton: 2, kicker: "Volume",
    punch: "Combien de litres fait vraiment mon aquarium ?",
    sub: "Longueur × largeur × hauteur, moins la marge, le sol et le décor. Résultat en une saisie.",
    fond: "bac-bureau",
    vers: `${U}/calculateurs/volume`,
    titre: "Combien de litres fait mon aquarium ? Calcul en 30 secondes",
    description: "Entrez vos trois dimensions intérieures et obtenez le volume brut, le volume net utile et la surface d'eau. Gratuit, sans inscription. #aquarium #aquariophilie #débutant" },

  { id: "poids-plancher", mise: "stat", ton: 3, kicker: "À vérifier avant d'acheter",
    punch: "Un bac de 120 cm pèse plus qu'un piano droit",
    big: "380 kg", sub: "Verre, eau, substrat et décor, sur moins d'un demi-mètre carré de plancher.",
    fond: "plante-racine",
    vers: `${U}/calculateurs/poids`,
    titre: "Combien pèse un aquarium rempli ? Calcul du poids en charge",
    description: "Verre, eau, substrat et décor : le poids total d'un aquarium en eau surprend toujours. À vérifier avant de le poser sur un meuble ou un plancher ancien. #aquarium #aquariophilie #bricolage" },

  { id: "poids-meuble", mise: "question", ton: 1, kicker: "Support",
    punch: "Mon meuble tiendra-t-il mon aquarium ?",
    sub: "Au-delà de 60 litres, un meuble de salon fléchit, la cuve suit et le collage cède.",
    fond: "bac-bureau",
    vers: `${U}/calculateurs/poids`,
    titre: "Quel meuble pour un aquarium ? Calculer la charge réelle",
    description: "Un meuble ordinaire est conçu pour une charge répartie, pas pour deux cents kilos ponctuels. Calculez le poids en charge de votre bac avant de l'installer. #aquarium #aménagement" },

  { id: "population-regle", mise: "stat", ton: 4, kicker: "La règle qu'il faut oublier",
    punch: "1 cm de poisson par litre surpeuple presque tous les bacs",
    sub: "Elle ignore la charge réelle de chaque espèce et les effectifs de banc. Un ancistrus et un néon de même taille ne salissent pas pareil.",
    fond: "plantes-fond",
    vers: `${U}/calculateurs/population`,
    titre: "Combien de poissons dans un aquarium ? Le calcul honnête",
    description: "La règle du centimètre par litre surpeuple. Calculateur de population avec charge biologique pondérée, effectifs de banc minimum et fenêtre de température commune. 41 espèces référencées. #aquariophilie #poissons #aquarium" },

  { id: "population-100l", mise: "question", ton: 2, kicker: "Peuplement",
    punch: "Combien de poissons dans 100 litres ?",
    sub: "Environ 10 néons et 6 corydoras. Et le bac est alors plein, pas à moitié.",
    fond: "banc-plante",
    vers: `${U}/calculateurs/population`,
    titre: "Combien de poissons dans 100 litres d'aquarium ?",
    description: "Le nombre dépend des espèces, pas du volume seul. Sélectionnez vos poissons et voyez le taux d'occupation se calculer en direct. #aquarium100l #aquariophilie #néons" },

  { id: "temperature", mise: "duel", ton: 3, kicker: "Compatibilité",
    punch: "Ces deux poissons ne peuvent pas vivre ensemble",
    gauche: { t: "16–22 °C", s: "Cardinal de Chine" },
    droite: { t: "28–31 °C", s: "Discus" },
    sub: "Vendus au même rayon, aucune température ne convient aux deux.",
    fond: "poisson-rouge",
    vers: `${U}/calculateurs/population`,
    titre: "Compatibilité des poissons d'aquarium : la température",
    description: "Deux espèces vendues côte à côte peuvent réclamer des températures incompatibles. Le calculateur affiche la fenêtre thermique commune à votre sélection. #aquariophilie #compatibilité #poissons" },

  { id: "banc", mise: "stat", ton: 1, kicker: "Erreur fréquente",
    punch: "Un poisson de banc maintenu seul dépérit",
    big: "×6", sub: "Six individus minimum pour un corydoras, dix pour un néon. En dessous, ils se cachent, mangent mal et meurent avant terme.",
    fond: "poisson-vert",
    vers: `${U}/calculateurs/population`,
    titre: "Combien de néons, de corydoras ? Les effectifs de banc",
    description: "Les espèces grégaires ne se maintiennent pas à deux ou trois. Le calculateur signale chaque effectif insuffisant. #aquariophilie #néons #corydoras" },

  { id: "filtre-debit", mise: "stat", ton: 2, kicker: "Filtration",
    punch: "Le débit annoncé sur l'emballage est mesuré à vide",
    big: "−35 %", sub: "Une fois les mousses en place et encrassées, il en reste deux tiers. Achetez sur le chiffre corrigé.",
    fond: "plantes-bleu",
    vers: `${U}/calculateurs/filtration`,
    titre: "Quel débit de filtre pour un aquarium ? Le calcul corrigé",
    description: "Les fabricants mesurent le débit à vide, sans masse filtrante. Calculez le débit constructeur à viser réellement selon votre volume et votre population. #aquariophilie #filtration #aquarium" },

  { id: "filtre-choix", mise: "question", ton: 4, kicker: "Matériel",
    punch: "Quel filtre pour un bac planté de 100 litres ?",
    sub: "Quatre rotations horaires en communautaire, trois pour un bac de crevettes, six en forte charge.",
    fond: "plante-racine",
    vers: `${U}/calculateurs/filtration`,
    titre: "Quel filtre choisir pour son aquarium planté ?",
    description: "Le débit se calcule en rotations horaires du volume net, puis se corrige de la perte due aux masses filtrantes. #aquascaping #filtration #bacplanté" },

  { id: "lumens", mise: "stat", ton: 3, kicker: "Éclairage",
    punch: "L'éclairage se raisonne en lumens, jamais en watts",
    big: "90 lm", sub: "par décimètre carré pour des plantes moyennes. Deux rampes de même consommation peuvent éclairer du simple au double.",
    fond: "plantes-bleu",
    vers: `${U}/calculateurs/eclairage`,
    titre: "Combien de lumens pour un aquarium planté ?",
    description: "Le watt mesure ce que vous payez, le lumen ce que les plantes reçoivent. Calculez le flux nécessaire selon la surface, la profondeur et l'exigence de vos plantes. #aquascaping #plantesaquarium #éclairage" },

  { id: "8heures", mise: "stat", ton: 1, kicker: "Algues",
    punch: "Au-delà de 8 heures d'éclairage, vous nourrissez les algues",
    big: "8 h", sub: "Sur minuterie, sans rattrapage. En cas de poussée, réduisez à six heures plutôt que d'augmenter la puissance.",
    fond: "poisson-herbe",
    vers: `${U}/calculateurs/eclairage`,
    titre: "Combien d'heures d'éclairage par jour en aquarium ?",
    description: "Huit heures sur minuterie suffisent. Un éclairage trop long déséquilibre le rapport entre plantes et algues au profit des secondes. #aquariophilie #algues #plantesaquarium" },

  { id: "chauffage-w", mise: "question", ton: 2, kicker: "Chauffage",
    punch: "Quelle puissance de chauffage pour mon aquarium ?",
    sub: "Ce n'est pas le volume qui commande, c'est l'écart à combler entre la pièce et le bac.",
    fond: "poisson-rouge",
    vers: `${U}/calculateurs/chauffage`,
    titre: "Quelle puissance de chauffage pour un aquarium en watts ?",
    description: "Un même bac dans une véranda et dans un salon ne demande pas la même puissance. Calcul selon le volume net, la température de la pièce en hiver et la consigne visée. #aquariophilie #matériel" },

  { id: "chauffage-continu", mise: "question", ton: 4, kicker: "Symptôme",
    punch: "Votre chauffage tourne en continu ?",
    sub: "Il est sous-dimensionné. Il ne tiendra jamais la consigne et rendra l'âme en une saison.",
    fond: "poisson-vert",
    vers: `${U}/calculateurs/chauffage`,
    titre: "Chauffage d'aquarium qui tourne en permanence : pourquoi",
    description: "Une résistance correctement dimensionnée fonctionne par cycles courts. Tourner en continu signale une puissance insuffisante. #aquariophilie #dépannage" },

  { id: "osmose-durete", mise: "stat", ton: 3, kicker: "Eau du robinet",
    punch: "Votre eau est trop dure pour des crevettes",
    big: "30 °f", sub: "L'eau francilienne titre 16 °dGH, quand un bac à Caridina en réclame 6 à 8. Il faut couper à l'osmosée.",
    fond: "crevette",
    vers: `${U}/calculateurs/eau-osmosee`,
    titre: "Eau trop dure pour les crevettes : quelle proportion d'osmosée",
    description: "Calculez la coupe entre eau du robinet et eau osmosée pour atteindre la dureté visée. Conversion entre degrés français et degrés allemands incluse. #crevettes #caridina #aquariophilie" },

  { id: "osmose-unites", mise: "duel", ton: 1, kicker: "La confusion qui coûte cher",
    punch: "°f ou °dGH : ce n'est pas la même chose",
    gauche: { t: "°f", s: "Votre commune" },
    droite: { t: "°dGH", s: "Vos tests" },
    sub: "Facteur 1,78 entre les deux. Beaucoup de bacs à crevettes échouent sur cet oubli.",
    fond: "escargot",
    vers: `${U}/calculateurs/eau-osmosee`,
    titre: "Convertir °f en °dGH : la dureté de l'eau en aquariophilie",
    description: "Votre commune publie des degrés français, vos tests d'aquariophilie affichent des degrés allemands. Le facteur est de 1,78, et l'oublier fait croire à une eau deux fois plus dure. #aquariophilie #paramètres #crevettes" },

  { id: "nitrates", mise: "question", ton: 2, kicker: "Entretien",
    punch: "Vos nitrates ne descendent pas malgré les changements d'eau ?",
    sub: "Testez votre eau du robinet. Si elle en contient déjà, aucun renouvellement ne fera baisser le bac sous ce seuil.",
    fond: "plantes-fond",
    vers: `${U}/calculateurs/changement-eau`,
    titre: "Nitrates qui ne baissent pas en aquarium : la cause oubliée",
    description: "L'eau du robinet contient souvent des nitrates, ce qui fixe un plancher absolu. Calculez le volume à renouveler en tenant compte de votre eau. #aquariophilie #nitrates #entretien" },

  { id: "verre", mise: "question", ton: 4, kicker: "Sécurité",
    punch: "Votre verre est-il assez épais ?",
    sub: "La pression croît avec le carré de la hauteur d'eau, pas avec le volume. À vérifier sur tout bac d'occasion.",
    fond: "plante-clair",
    vers: `${U}/calculateurs/verre`,
    titre: "Épaisseur de verre nécessaire pour un aquarium",
    description: "Un bac haut et court sollicite plus son verre qu'un bac long et bas de même contenance. Contrôle indicatif selon la hauteur d'eau et la longueur. #aquariophilie #sécurité #bricolage" },

  { id: "kit", mise: "liste", ton: 3, kicker: "Avant le premier poisson",
    punch: "12 choses à acheter pour démarrer un aquarium",
    items: ["Le bac et son meuble", "Filtre et chauffage", "Éclairage et substrat", "Conditionneur et bactéries", "Tests en gouttes", "Aspirateur à vase"],
    fond: "bac-bureau",
    vers: `${U}/calculateurs/kit`,
    titre: "Liste de matériel pour démarrer un aquarium d'eau douce",
    description: "La liste complète, dimensionnée sur vos mesures : puissance de chauffage, débit de filtre, kilos de substrat et longueur de rampe en découlent directement. #aquariophilie #débutant #matériel" },

  { id: "cycle", mise: "stat", ton: 1, kicker: "L'étape que tout le monde saute",
    punch: "Le bac doit tourner 3 à 6 semaines avant le premier poisson",
    big: "NO₂ = 0", sub: "Le temps que les bactéries transforment l'ammoniaque en nitrites, puis en nitrates. Tant que le test n'est pas à zéro, aucune introduction.",
    fond: "poisson-herbe",
    vers: `${U}/calculateurs/kit`,
    titre: "Cycle de l'azote : combien de temps avant les premiers poissons",
    description: "Trois à six semaines pour que la flore bactérienne s'installe. C'est l'étape que tout le monde saute, et la première cause de mortalité chez les débutants. #aquariophilie #cycledelazote #débutant" },
];

export const CREDITS: Record<string, string> = {
  "plante-clair": "Christian Ang",
  "plante-racine": "Christian Ang",
  "poisson-herbe": "Fad Lan",
  "plantes-bleu": "karl muscat",
  "bac-bureau": "Huy Phan",
  "poisson-rouge": "Ilias Triantos",
  "plantes-fond": "Sally K",
  "poisson-vert": "Hanna Lazar",
  "banc-plante": "Jonah Townsley",
  "escargot": "Sharat Arackal",
  "crevette": "Jeffrey Hamilton"
};
