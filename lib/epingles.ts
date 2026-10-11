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
    punch: "Votre 100 litres n'en contient pas 100",
    big: "−28 %", sub: "Rebord, substrat, décor : c'est le volume net qui compte.",
    fond: "plante-clair",
    vers: `${U}/calculateurs/volume`,
    titre: "Calculer le volume réel de son aquarium en litres",
    description: "Calcul du volume réel d'un aquarium en litres : le volume affiché par le fabricant est celui d'une boîte vide. Une fois l'eau sous le rebord, le substrat et le décor en place, il manque souvent jusqu'à un quart. Entrez vos dimensions et obtenez le volume net, celui qui sert à choisir la population, le filtre et le chauffage. Gratuit, sans inscription, avec le matériel adapté à votre bac. #aquariophilie #aquarium #aquascaping" },

  { id: "volume-calcul", mise: "question", ton: 2, kicker: "Volume",
    punch: "Combien de litres fait vraiment mon aquarium ?",
    sub: "Trois dimensions, un résultat. Sans inscription.",
    fond: "bac-bureau",
    vers: `${U}/calculateurs/volume`,
    titre: "Combien de litres fait mon aquarium ? Calcul en 30 secondes",
    description: "Combien de litres fait votre aquarium ? Entrez longueur, largeur et hauteur intérieures : le calculateur donne le volume brut, le volume net réellement rempli d'eau et la surface d'eau. Utile avant d'acheter un bac ou de doser un traitement. Gratuit, sans inscription, avec des bacs équipés de la bonne taille. #aquarium #aquariophilie #débutant" },

  { id: "poids-plancher", mise: "stat", ton: 3, kicker: "À vérifier avant d'acheter",
    punch: "Un bac de 120 cm pèse plus qu'un piano droit",
    big: "380 kg", sub: "Sur moins d'un demi-mètre carré de plancher.",
    fond: "plante-racine",
    vers: `${U}/calculateurs/poids`,
    titre: "Combien pèse un aquarium rempli ? Calcul du poids en charge",
    description: "Poids d'un aquarium rempli : verre, eau, substrat et décor additionnés, un bac de 120 cm approche les 380 kg, sur moins d'un demi-mètre carré. Calculez le poids total et la charge au mètre carré avant de le poser sur un meuble ou un plancher ancien. Calcul gratuit, avec les meubles d'aquarium à la bonne longueur. #aquarium #aquariophilie #bricolage" },

  { id: "poids-meuble", mise: "question", ton: 1, kicker: "Support",
    punch: "Mon meuble tiendra-t-il mon aquarium ?",
    sub: "Au-delà de 60 litres, un meuble de salon fléchit.",
    fond: "bac-bureau",
    vers: `${U}/calculateurs/poids`,
    titre: "Quel meuble pour un aquarium ? Calculer la charge réelle",
    description: "Quel meuble pour un aquarium ? Un meuble de salon est prévu pour une charge répartie, pas pour deux cents kilos posés sur quatre pieds. Calculez le poids en charge de votre bac et la pression au sol, puis choisissez un meuble d'aquarium à la bonne longueur. Calcul gratuit en 30 secondes. #aquarium #aménagement" },

  { id: "population-regle", mise: "stat", ton: 4, kicker: "La règle qu'il faut oublier",
    punch: "1 cm par litre : la règle qui surpeuple",
    sub: "Elle ignore la charge réelle de chaque espèce.",
    fond: "plantes-fond",
    vers: `${U}/calculateurs/population`,
    titre: "Combien de poissons dans un aquarium ? Le calcul honnête",
    description: "Combien de poissons dans un aquarium ? La règle du centimètre par litre surpeuple presque tous les bacs. Le calculateur pondère la charge réelle de chaque espèce, vérifie les effectifs de banc minimum et la température commune à votre sélection. 41 espèces référencées, résultat en direct, puis la liste du matériel pour votre volume. #aquariophilie #poissons #aquarium" },

  { id: "population-100l", mise: "question", ton: 2, kicker: "Peuplement",
    punch: "Combien de poissons dans 100 litres ?",
    sub: "Environ 10 néons et 6 corydoras. Pas davantage.",
    fond: "banc-plante",
    vers: `${U}/calculateurs/population`,
    titre: "Combien de poissons dans 100 litres d'aquarium ?",
    description: "Combien de poissons dans un aquarium de 100 litres ? Tout dépend des espèces : environ 10 néons et 6 corydoras, pas davantage. Choisissez vos poissons et voyez le taux d'occupation, les alertes de compatibilité et la température commune se calculer en direct. Gratuit, sans inscription. #aquarium100l #aquariophilie #néons" },

  { id: "temperature", mise: "duel", ton: 3, kicker: "Compatibilité",
    punch: "Ces deux-là ne peuvent pas cohabiter",
    gauche: { t: "16–22 °C", s: "Cardinal de Chine" },
    droite: { t: "28–31 °C", s: "Discus" },
    sub: "Vendus au même rayon, jamais dans le même bac.",
    fond: "poisson-rouge",
    vers: `${U}/calculateurs/population`,
    titre: "Compatibilité des poissons d'aquarium : la température",
    description: "Compatibilité des poissons d'aquarium : deux espèces vendues au même rayon peuvent réclamer des températures sans aucun point commun, comme le cardinal de Chine (16–22 °C) et le discus (28–31 °C). Le calculateur affiche la fenêtre thermique commune à votre sélection, avant l'achat. Gratuit, 41 espèces référencées. #aquariophilie #compatibilité #poissons" },

  { id: "banc", mise: "stat", ton: 1, kicker: "Erreur fréquente",
    punch: "Un poisson de banc maintenu seul dépérit",
    big: "×6", sub: "Six corydoras minimum, dix néons. En dessous, ils dépérissent.",
    fond: "poisson-vert",
    vers: `${U}/calculateurs/population`,
    titre: "Combien de néons, de corydoras ? Les effectifs de banc",
    description: "Combien de néons ou de corydoras faut-il ? Les poissons de banc maintenus à deux ou trois stressent et dépérissent : six corydoras minimum, dix néons. Le calculateur signale chaque effectif insuffisant et vérifie que votre bac a la place pour le groupe complet. Gratuit, sans inscription. #aquariophilie #néons #corydoras" },

  { id: "filtre-debit", mise: "stat", ton: 2, kicker: "Filtration",
    punch: "Le débit annoncé sur l'emballage est mesuré à vide",
    big: "−35 %", sub: "Une fois les mousses en place, il en reste deux tiers.",
    fond: "plantes-bleu",
    vers: `${U}/calculateurs/filtration`,
    titre: "Quel débit de filtre pour un aquarium ? Le calcul corrigé",
    description: "Quel débit de filtre pour un aquarium ? Le débit imprimé sur la boîte est mesuré à vide : une fois les mousses et céramiques en place, il en reste environ deux tiers. Calculez le débit réel nécessaire selon votre volume et votre population, puis le débit constructeur à viser, avec les filtres correspondants. Gratuit. #aquariophilie #filtration #aquarium" },

  { id: "filtre-choix", mise: "question", ton: 4, kicker: "Matériel",
    punch: "Quel filtre pour un bac planté de 100 litres ?",
    sub: "Quatre rotations horaires du volume net.",
    fond: "plante-racine",
    vers: `${U}/calculateurs/filtration`,
    titre: "Quel filtre choisir pour son aquarium planté ?",
    description: "Quel filtre choisir pour un aquarium planté de 100 litres ? Visez quatre rotations horaires du volume net, puis corrigez de la perte due aux masses filtrantes : c'est ce chiffre corrigé qu'il faut lire sur l'emballage. Le calculateur le donne pour vos dimensions exactes, avec les filtres au bon débit. #aquascaping #filtration #bacplanté" },

  { id: "lumens", mise: "stat", ton: 3, kicker: "Éclairage",
    punch: "L'éclairage se raisonne en lumens, jamais en watts",
    big: "90 lm", sub: "par décimètre carré, pour des plantes moyennes.",
    fond: "plantes-bleu",
    vers: `${U}/calculateurs/eclairage`,
    titre: "Combien de lumens pour un aquarium planté ?",
    description: "Combien de lumens pour un aquarium planté ? Le watt mesure la consommation, le lumen ce que reçoivent les plantes : deux rampes de même puissance éclairent parfois du simple au double. Calculez le flux nécessaire selon la surface, la hauteur d'eau et l'exigence de vos plantes, puis trouvez la rampe LED à la longueur de votre bac. #aquascaping #plantesaquarium #éclairage" },

  { id: "8heures", mise: "stat", ton: 1, kicker: "Algues",
    punch: "Au-delà de 8 heures, vous nourrissez les algues",
    big: "8 h", sub: "Sur minuterie, sans rattrapage le lendemain.",
    fond: "poisson-herbe",
    vers: `${U}/calculateurs/eclairage`,
    titre: "Combien d'heures d'éclairage par jour en aquarium ?",
    description: "Combien d'heures d'éclairage par jour dans un aquarium ? Huit heures sur minuterie suffisent : au-delà, l'excédent de lumière profite aux algues plutôt qu'aux plantes. Vérifiez aussi que votre rampe délivre assez de lumens : le calculateur donne le flux nécessaire et la longueur de rampe adaptée à votre bac. #aquariophilie #algues #plantesaquarium" },

  { id: "chauffage-w", mise: "question", ton: 2, kicker: "Chauffage",
    punch: "Quelle puissance de chauffage pour mon aquarium ?",
    sub: "Pas le volume : l'écart à combler entre la pièce et le bac.",
    fond: "poisson-rouge",
    vers: `${U}/calculateurs/chauffage`,
    titre: "Quelle puissance de chauffage pour un aquarium en watts ?",
    description: "Quelle puissance de chauffage pour un aquarium ? Pas seulement le volume : l'écart entre la pièce en hiver et la température visée. Un même bac dans une véranda et dans un salon ne demande pas la même puissance. Calculez les watts nécessaires pour votre bac et votre pièce, avec les chauffages correspondants. Gratuit. #aquariophilie #matériel" },

  { id: "chauffage-continu", mise: "question", ton: 4, kicker: "Symptôme",
    punch: "Votre chauffage tourne en continu ?",
    sub: "Sous-dimensionné. Il rendra l'âme en une saison.",
    fond: "poisson-vert",
    vers: `${U}/calculateurs/chauffage`,
    titre: "Chauffage d'aquarium qui tourne en permanence : pourquoi",
    description: "Votre chauffage d'aquarium tourne en permanence ? Une résistance bien dimensionnée fonctionne par cycles courts. En continu, elle est trop faible pour l'écart à combler, ne tient jamais la consigne et s'use en une saison. Calculez la puissance qu'il vous faut vraiment selon votre volume et la température de la pièce. #aquariophilie #dépannage" },

  { id: "osmose-durete", mise: "stat", ton: 3, kicker: "Eau du robinet",
    punch: "Votre eau est trop dure pour des crevettes",
    big: "30 °f", sub: "16 °dGH au robinet, 6 à 8 pour un bac à Caridina.",
    fond: "crevette",
    vers: `${U}/calculateurs/eau-osmosee`,
    titre: "Eau trop dure pour les crevettes : quelle proportion d'osmosée",
    description: "Eau trop dure pour des crevettes Caridina ? Une eau du robinet à 30 °f fait 16 °dGH, quand un bac à crevettes en demande 6 à 8. Calculez la proportion exacte d'eau osmosée et d'eau du robinet pour atteindre votre dureté cible, conversion °f / °dGH incluse, avec les osmoseurs et tests GH/KH adaptés. #crevettes #caridina #aquariophilie" },

  { id: "osmose-unites", mise: "duel", ton: 1, kicker: "Dureté de l'eau",
    punch: "°f ou °dGH : ce n'est pas la même chose",
    gauche: { t: "°f", s: "Votre commune" },
    droite: { t: "°dGH", s: "Vos tests" },
    sub: "Facteur 1,78 entre les deux unités.",
    fond: "escargot",
    vers: `${U}/calculateurs/eau-osmosee`,
    titre: "Convertir °f en °dGH : la dureté de l'eau en aquariophilie",
    description: "Convertir les °f en °dGH : votre commune publie la dureté de l'eau en degrés français, vos tests d'aquariophilie l'affichent en degrés allemands. Le facteur est de 1,78, et l'oublier fait croire à une eau presque deux fois plus dure. Le calculateur convertit et donne le mélange d'eau osmosée qu'il vous faut. #aquariophilie #paramètres #crevettes" },

  { id: "nitrates", mise: "question", ton: 2, kicker: "Entretien",
    punch: "Vos nitrates ne baissent pas ?",
    sub: "Testez votre eau du robinet : elle en contient peut-être.",
    fond: "plantes-fond",
    vers: `${U}/calculateurs/changement-eau`,
    titre: "Nitrates qui ne baissent pas en aquarium : la cause oubliée",
    description: "Nitrates qui ne baissent pas malgré les changements d'eau ? Testez votre eau du robinet : elle en contient souvent déjà, ce qui fixe un plancher impossible à franchir. Calculez le volume d'eau à renouveler pour atteindre votre objectif, en tenant compte de votre robinet. Gratuit, avec les tests de nitrates en gouttes. #aquariophilie #nitrates #entretien" },

  { id: "verre", mise: "question", ton: 4, kicker: "Sécurité",
    punch: "Votre verre est-il assez épais ?",
    sub: "La pression croît avec le carré de la hauteur d'eau.",
    fond: "plante-clair",
    vers: `${U}/calculateurs/verre`,
    titre: "Épaisseur de verre nécessaire pour un aquarium",
    description: "Quelle épaisseur de verre pour un aquarium ? La pression sur les vitres croît avec le carré de la hauteur d'eau : un bac haut et court est plus sollicité qu'un bac long et bas de même volume. Vérifiez votre cuve, neuve ou d'occasion, selon sa hauteur et sa longueur. Contrôle gratuit et volontairement prudent. #aquariophilie #sécurité #bricolage" },

  { id: "kit", mise: "liste", ton: 3, kicker: "Avant le premier poisson",
    punch: "12 choses à acheter pour démarrer un aquarium",
    items: ["Le bac et son meuble", "Filtre et chauffage", "Éclairage et substrat", "Conditionneur et bactéries", "Tests en gouttes"],
    fond: "bac-bureau",
    vers: `${U}/calculateurs/kit`,
    titre: "Liste de matériel pour démarrer un aquarium d'eau douce",
    description: "Liste de matériel pour démarrer un aquarium d'eau douce, calculée sur vos dimensions : débit du filtre, puissance du chauffage, longueur de la rampe LED, kilos de substrat, conditionneur, bactéries et tests. Chaque ligne indique la spécification à viser et renvoie vers les modèles correspondants. À faire avant le premier achat. #aquariophilie #débutant #matériel" },

  { id: "cycle", mise: "stat", ton: 1, kicker: "Avant les poissons",
    punch: "3 à 6 semaines avant le premier poisson",
    big: "NO₂ = 0", sub: "Le temps que les bactéries s'installent. Pas avant.",
    fond: "poisson-herbe",
    vers: `${U}/calculateurs/kit`,
    titre: "Cycle de l'azote : combien de temps avant les premiers poissons",
    description: "Cycle de l'azote : comptez trois à six semaines avant d'introduire les premiers poissons, le temps que les bactéries s'installent. Tant que le test de nitrites n'est pas revenu à zéro, aucune introduction. Retrouvez la liste du matériel de démarrage, bactéries et tests en gouttes compris, calculée pour votre bac. #aquariophilie #cycledelazote #débutant" },
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
