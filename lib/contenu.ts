export type Question = { q: string; r: string };
export type Contenu = { methode: string[]; faq: Question[] };

export const CONTENU: Record<string, Contenu> = {

  volume: {
    methode: [
      "Le calcul part des dimensions intérieures, jamais des dimensions extérieures : sur un bac en 10 mm, l'écart atteint déjà deux centimètres par côté. La formule de base est longueur × largeur × hauteur, divisée par mille pour obtenir des litres. C'est le volume brut, celui que le fabricant imprime sur le carton.",
      "De ce brut on retire trois choses. La marge sous le rebord d'abord, quatre centimètres en pratique, car personne ne remplit une cuve à ras bord : il faut la place pour la crépine du filtre, pour le brassage de surface et pour ne pas déborder à chaque changement d'eau. Le substrat ensuite, qui occupe toute la surface au sol sur son épaisseur. Le décor enfin, roches et racines, estimé en pourcentage du volume restant.",
      "Reste le volume net, celui qui contient réellement de l'eau. C'est lui, et lui seul, qui sert à calculer la population, le débit de filtration, la puissance de chauffage et le dosage de tout traitement. Un conditionneur dosé sur le volume affiché est systématiquement surdosé de vingt pour cent.",
    ],
    faq: [
      { q: "Pourquoi mon aquarium de 120 litres n'en contient-il que 90 ?",
        r: "Parce que les 120 litres correspondent à la cuve pleine à ras bord et vide de tout. Retirez quatre centimètres de marge sous le rebord, cinq centimètres de substrat sur toute la surface et le volume des roches : il ne reste couramment que 75 à 80 % du chiffre annoncé. Ce n'est pas un défaut du bac, c'est la différence entre un volume géométrique et un volume utile." },
      { q: "Dois-je utiliser les dimensions intérieures ou extérieures ?",
        r: "Les intérieures. Sur une cuve en 10 mm, compter l'extérieur ajoute deux centimètres en longueur et en largeur, soit près de cinq litres sur un bac de 100 cm. Mesurez à l'intérieur, ou retirez deux fois l'épaisseur du verre à chaque dimension." },
      { q: "La surface d'eau compte-t-elle autant que le volume ?",
        r: "Pour les échanges gazeux, oui. L'oxygène entre et le gaz carbonique sort par la surface : à volume égal, un bac large et bas oxygène mieux qu'un bac étroit et haut. C'est pourquoi les formats hauts, esthétiques mais pauvres en surface, supportent moins de poissons que leur contenance ne le laisse croire." },
      { q: "Faut-il retirer le volume du sable si je ne plante pas ?",
        r: "Oui, dans tous les cas. Un substrat de trois centimètres sur un bac de 80 × 35 occupe déjà huit litres et demi. Qu'il soit nutritif ou décoratif ne change rien : cette place n'est pas occupée par de l'eau." },
    ],
  },

  poids: {
    methode: [
      "Le poids total additionne quatre masses. Le verre d'abord, calculé sur la surface développée des cinq panneaux, fond compris, multipliée par l'épaisseur et par la densité du verre, soit 2,5. L'eau ensuite, à raison d'un kilo par litre net. Le substrat, dont la densité varie du simple au double selon qu'il s'agit d'un sol technique ou d'un sable de quartz. Le décor enfin, roches et racines, à peser ou à estimer.",
      "Le chiffre qui compte n'est pas le total mais la charge au mètre carré. Un bac de 120 cm pèse près de 380 kilos une fois en eau, concentrés sur six dixièmes de mètre carré : cela fait plus de 600 kilos au mètre carré, davantage qu'une bibliothèque pleine. Un plancher bois ancien mérite alors d'être regardé, et le bac gagne à être posé perpendiculairement aux solives plutôt que parallèlement.",
      "La planéité du support importe autant que sa résistance. Une cuve posée sur un meuble légèrement gauchi ne répartit plus la charge : tout l'effort se concentre sur un angle, le collage travaille, et la fuite arrive des mois plus tard sans prévenir. Un niveau à bulle et quelques cales valent mieux qu'un renfort ajouté après coup.",
    ],
    faq: [
      { q: "Mon plancher supportera-t-il un aquarium de 200 litres ?",
        r: "Un bac de 200 litres pèse environ 280 kilos en charge. Sur un plancher béton, aucun problème. Sur un plancher bois sain et récent, cela passe généralement, à condition de poser perpendiculairement aux solives et près d'un mur porteur plutôt qu'au milieu d'une pièce. Sur un plancher ancien ou dont vous ignorez l'état, faites regarder par un professionnel : le doute coûte moins cher que le sinistre." },
      { q: "Puis-je poser mon aquarium sur un meuble ordinaire ?",
        r: "Rarement au-delà de 60 litres. Un meuble de salon est conçu pour une charge répartie et modérée, pas pour deux à trois cents kilos ponctuels. Le plateau fléchit, la cuve suit, et le collage cède. Un meuble dédié à l'aquariophilie a un cadre et un plateau dimensionnés pour cela." },
      { q: "Faut-il un tapis sous l'aquarium ?",
        r: "Sur une cuve à fond collé sans cadre, oui : un tapis de mousse rattrape les micro-défauts du plateau et évite les points de contrainte. Sur une cuve à cadre périphérique, le fond ne touche pas le support et le tapis est inutile. Vérifiez la construction de votre bac avant d'en acheter un." },
      { q: "Le poids du verre change-t-il vraiment quelque chose ?",
        r: "Sur un grand bac, oui. Une cuve de 150 cm en 15 mm pèse à elle seule plus de 130 kilos à vide. C'est le poids d'un bac de 130 litres en eau, et cela se ressent au moment de porter la cuve à deux, avant même le premier litre." },
    ],
  },

  substrat: {
    methode: [
      "La quantité se déduit d'un volume : longueur × largeur × épaisseur, en centimètres, divisé par mille pour obtenir des litres. Le passage en kilos dépend ensuite du matériau, et c'est là que les erreurs de commande arrivent. Un sable de quartz pèse environ 1,5 kilo par litre, un gravier fin 1,6, un sol nutritif 0,8 et un sol technique 0,75. À volume identique, il faut donc deux fois plus de sacs de sable que de sacs de sol technique.",
      "L'épaisseur utile va de trois à quatre centimètres pour un bac non planté, et de cinq à six centimètres dès qu'il y a des racines à nourrir. En dessous, les plantes ne tiennent pas et déchaussent au premier nettoyage. Au-dessus de huit centimètres, la couche profonde ne reçoit plus d'oxygène, fermente et libère du sulfure d'hydrogène, reconnaissable à son odeur d'œuf pourri.",
      "En bac planté, la construction classique se fait en deux couches : trois centimètres de sol nutritif au fond, recouverts de trois centimètres de sable ou de gravier fin. La sous-couche nourrit les racines, la couche de recouvrement l'empêche de remonter et de troubler l'eau. Prévoyez toujours un peu plus que le calcul : on modèle presque toujours une pente vers l'avant, plus mince devant et plus épaisse au fond, ce qui donne de la profondeur au décor.",
    ],
    faq: [
      { q: "Combien de kilos de sable pour un aquarium de 100 litres ?",
        r: "Cela dépend de la surface au sol, pas du volume. Un bac de 100 × 40 cm sur quatre centimètres d'épaisseur demande 16 litres de substrat, soit environ 24 kilos de sable de quartz. Un bac de 60 × 30 de même contenance mais plus haut n'en demandera que 11 kilos." },
      { q: "Quel substrat pour des corydoras ?",
        r: "Un sable fin et rond, jamais un gravier anguleux. Les corydoras fouillent le sol avec leurs barbillons : sur un substrat coupant, les barbillons s'usent, s'infectent et ne repoussent pas. Le sable de quartz de granulométrie 0,4 à 1 mm convient parfaitement." },
      { q: "Faut-il rincer le substrat avant de le mettre ?",
        r: "Longuement, à l'eau claire et jusqu'à ce qu'elle ressorte transparente, pour tous les sables et graviers. Sans cela le bac restera laiteux plusieurs jours et les fines iront colmater les mousses du filtre. Les sols techniques et nutritifs, en revanche, ne se rincent jamais : on les perdrait." },
      { q: "Peut-on ajouter du substrat dans un bac déjà en eau ?",
        r: "Oui, mais par petites quantités et à l'aide d'un tube ou d'un verre descendu jusqu'au fond, pour éviter le nuage. Ajoutez au maximum deux centimètres à la fois, et attendez une semaine entre deux apports : remuer un sol installé libère d'un coup les composés piégés en profondeur." },
    ],
  },

  population: {
    methode: [
      "La règle du centimètre de poisson par litre traîne dans tous les forums et surpeuple à peu près tous les bacs qui la suivent. Son défaut n'est pas le rapport lui-même mais ce qu'elle ignore : un ancistrus de douze centimètres produit plusieurs fois les déchets d'un néon de même longueur cumulée, et douze néons n'occupent pas la même place qu'un seul gros poisson.",
      "Le calcul retenu ici part du volume net, à raison d'un centimètre de poisson adulte pour 1,1 litre, puis pondère chaque espèce par un facteur de charge. Les gros mangeurs et les poissons de fond montent au-dessus de un, les crevettes descendent à 0,3. La taille prise en compte est toujours la taille adulte, pas celle du poisson en animalerie : un scalaire vendu à quatre centimètres en fera quinze.",
      "Deux contrôles s'ajoutent au volume. L'effectif de banc d'abord : une espèce grégaire maintenue à deux ou trois individus s'étiole, se cache et meurt prématurément, même dans un bac immense. La fenêtre thermique ensuite, calculée comme l'intersection des plages tolérées par chaque espèce présente : un cardinal de Chine vit à 20 °C, un discus à 29, et aucun réglage ne convient aux deux.",
    ],
    faq: [
      { q: "Combien de poissons dans un aquarium de 100 litres ?",
        r: "Sur 100 litres bruts, comptez environ 75 litres nets, donc à peu près 68 centimètres de poisson adulte pondéré. Cela représente par exemple dix néons et six corydoras panda, et le bac est alors plein. Ce n'est pas un nombre de poissons mais une charge : dix néons et un ancistrus occupent bien davantage que dix néons seuls." },
      { q: "Puis-je mettre un seul poisson d'une espèce de banc ?",
        r: "Non. Un néon, un corydoras ou un danio maintenu seul passe sa vie stressé, se cache, mange mal et meurt bien avant son terme. Ces espèces se maintiennent à six individus au minimum, dix pour les plus petites. Si le volume ne le permet pas, changez d'espèce plutôt que de réduire le groupe." },
      { q: "Comment savoir si mon bac est surpeuplé ?",
        r: "Les nitrates qui montent vite entre deux changements d'eau sont le premier signal, avant tout calcul. Viennent ensuite les poissons qui restent en surface, une eau qui se trouble sans raison, et des algues qui reviennent malgré l'entretien. Le calculateur donne une estimation ; ces symptômes donnent la réponse." },
      { q: "Peut-on ajouter tous les poissons en même temps ?",
        r: "Jamais. Le filtre abrite une population bactérienne qui s'ajuste à la charge, et cet ajustement prend deux à trois semaines. Introduisez un groupe, attendez, contrôlez les nitrites, puis introduisez le suivant. Un bac peuplé d'un coup passe presque toujours par un pic de nitrites mortel." },
    ],
  },

  "changement-eau": {
    methode: [
      "Le changement d'eau obéit à une simple dilution. En renouvelant une fraction f du volume, la concentration passe de C0 à C0 (1 − f) + Ct × f, où Ct est la concentration de l'eau neuve. Pour viser une cible C1, la fraction nécessaire vaut donc (C0 − C1) divisé par (C0 − Ct). Tout le calcul tient dans cette formule, et c'est le Ct que presque personne ne renseigne.",
      "Car l'eau du robinet contient déjà des nitrates, souvent quinze à quarante milligrammes par litre en zone agricole. Cela fixe un plancher absolu : si votre eau titre vingt-cinq, aucun changement d'eau, même total, ne descendra le bac sous vingt-cinq. Viser dix devient alors mathématiquement impossible sans couper à l'eau osmosée. Le chiffre figure sur l'analyse annuelle publiée par votre commune, ou se mesure au test en gouttes sur un verre d'eau du robinet.",
      "Au-delà de la moitié du volume en une fois, le changement devient brutal : variation de température, de pH et de dureté que les poissons encaissent mal. Mieux vaut deux ou trois changements espacés de quarante-huit heures. En entretien courant, vingt à vingt-cinq pour cent par semaine suffisent à maintenir un bac correctement peuplé sous la barre des vingt-cinq milligrammes.",
    ],
    faq: [
      { q: "Quel pourcentage d'eau changer chaque semaine ?",
        r: "Vingt à vingt-cinq pour cent hebdomadaires conviennent à un bac communautaire correctement peuplé et planté. Un bac chargé ou peu planté demandera trente pour cent. Ce qui compte n'est pas le rituel mais le résultat : c'est le test de nitrates qui doit décider du rythme, pas le calendrier." },
      { q: "Mes nitrates ne descendent pas malgré les changements d'eau, pourquoi ?",
        r: "Regardez d'abord votre eau du robinet au test. Si elle titre déjà autant que votre bac, aucun renouvellement ne fera baisser quoi que ce soit : vous remplacez de l'eau chargée par de l'eau chargée. La solution passe alors par une coupe à l'eau osmosée, ou par des plantes à croissance rapide qui consomment les nitrates." },
      { q: "Peut-on changer toute l'eau d'un aquarium ?",
        r: "Il ne faut pas. Un changement total vide le bac de sa chimie stabilisée et provoque un choc osmotique et thermique. Il n'est justifié qu'en cas de traitement médicamenteux à évacuer ou d'accident de contamination, et se fait alors avec une eau préparée à l'identique en température et en paramètres." },
      { q: "Faut-il traiter l'eau neuve avant de la verser ?",
        r: "Oui, systématiquement. Le chlore et les chloramines du réseau détruisent la flore bactérienne du filtre et brûlent les branchies. Le conditionneur doit agir dans le seau, pas dans le bac, et l'eau doit être mise à température : au-delà de deux degrés d'écart, le choc thermique est réel." },
    ],
  },

  "eau-osmosee": {
    methode: [
      "Deux unités de dureté coexistent en France et sèment une confusion coûteuse. Le degré français, noté °f, sert aux analyses d'eau publiées par les communes : un degré vaut dix milligrammes de carbonate de calcium par litre. Le degré allemand, noté °dGH, est celui qu'affichent tous les tests d'aquariophilie : un degré en vaut 17,8. Le facteur de conversion entre les deux est donc de 1,78, et l'oublier fait croire à une eau deux fois plus dure qu'elle ne l'est.",
      "La coupe est une moyenne pondérée. L'eau osmosée est vide de minéraux, sa dureté est nulle. En mélangeant une part p d'eau du robinet à dureté GH avec le reste en osmosée, on obtient p × GH. Pour atteindre une cible, la part de robinet vaut donc simplement cible divisée par dureté du robinet. Trente degrés français font 16,9 °dGH : viser 8 °dGH demande 47 % de robinet et 53 % d'osmosée.",
      "Le mélange se prépare toujours à part, dans un bidon, jamais dans le bac. On mesure au test après mélange et avant de verser, car les analyses communales donnent des moyennes annuelles qui varient d'une saison à l'autre. Enfin, une eau osmosée pure ne se verse jamais seule : sans minéraux, elle n'a aucun pouvoir tampon, le pH s'effondre au moindre apport et les crevettes ne muent plus.",
    ],
    faq: [
      { q: "Comment convertir des °f en °dGH ?",
        r: "Divisez par 1,78. Une eau à 30 °f fait 16,9 °dGH, une eau à 20 °f fait 11,2 °dGH. Dans l'autre sens, multipliez par 1,78. C'est la conversion à faire entre l'analyse de votre commune, en degrés français, et vos tests d'aquariophilie, gradués en degrés allemands." },
      { q: "Ai-je besoin d'eau osmosée pour mon aquarium ?",
        r: "Pas systématiquement. Un communautaire classique de guppys, platys ou corydoras s'accommode très bien d'une eau de robinet à 12 ou 15 °dGH. L'osmosée devient nécessaire pour les crevettes Caridina, les discus, les tétras d'eau noire, ou dès que votre eau dépasse 20 °dGH et que vous visez des espèces d'eau douce." },
      { q: "Où trouver la dureté de mon eau du robinet ?",
        r: "Sur l'analyse annuelle affichée en mairie ou publiée sur le site de votre commune, sous l'intitulé dureté ou titre hydrotimétrique, exprimée en °f. Elle figure aussi souvent en annexe de la facture d'eau. Un test en gouttes sur un verre d'eau du robinet donne la même information en deux minutes, et à jour." },
      { q: "Peut-on utiliser de l'eau déminéralisée du commerce à la place ?",
        r: "Techniquement oui, la dureté est nulle dans les deux cas, mais l'eau déminéralisée pour fer à repasser contient parfois des additifs anticalcaire non déclarés. Pour un usage régulier, un osmoseur est plus sûr et devient rapidement moins cher qu'un achat de bidons chaque semaine." },
    ],
  },

  verre: {
    methode: [
      "La pression exercée sur une vitre croît avec le carré de la hauteur d'eau, et non avec le volume. Un bac de 150 × 40 × 40 contient bien plus qu'un bac de 60 × 40 × 60, et pourtant c'est le second qui sollicite le plus son verre : ce qui compte est la colonne d'eau au-dessus de chaque point, et la longueur non soutenue de la vitre.",
      "Le contrôle proposé ici repose sur des paliers d'épaisseur par hauteur d'eau, majorés selon la longueur, plutôt que sur une formule de résistance des matériaux. C'est un choix assumé : une formule donne une fausse précision alors que le résultat réel dépend de la qualité du verre, de son recuit, de l'état des collages et du vieillissement du silicone, autant de paramètres qu'un calculateur ne connaît pas.",
      "Au-delà d'un mètre de longueur ou de cinquante centimètres de hauteur d'eau, les barres de renfort collées en haut de cuve ne sont pas décoratives : elles reprennent l'écartement des vitres, et une cuve dont on a retiré la traverse pour des raisons esthétiques finit par s'ouvrir. Sur un bac d'occasion, le silicone est le point faible : il durcit, se décolle aux angles et lâche sans prévenir après dix ou quinze ans.",
    ],
    faq: [
      { q: "Quelle épaisseur de verre pour un aquarium de 100 cm ?",
        r: "Pour une hauteur d'eau d'environ 45 centimètres, comptez 10 millimètres avec une traverse de renfort. Descendre à 8 millimètres sur cette longueur revient à travailler sans marge, et la déformation devient visible en regardant la vitre de biais." },
      { q: "Un aquarium d'occasion est-il sûr ?",
        r: "Cela dépend de son âge et de son silicone, pas de son verre. Inspectez les joints intérieurs aux quatre angles : un silicone qui a bruni, durci ou décollé sur quelques millimètres doit être refait avant toute mise en eau. Faites un essai de remplissage à l'extérieur, sur une terrasse, pendant vingt-quatre heures avant d'installer le bac dans un salon." },
      { q: "Peut-on remplacer une vitre rayée ?",
        r: "Une rayure superficielle sur une face extérieure n'affecte pas la résistance. Une rayure profonde sur une face intérieure, en revanche, amorce une fissure : elle concentre les contraintes exactement là où le verre travaille le plus. Dans ce cas, le remplacement du panneau par un vitrier est la seule option raisonnable." },
      { q: "Le verre trempé est-il préférable ?",
        r: "Il est plus résistant aux chocs à épaisseur égale, mais il ne se perce ni ne se recoupe, et surtout il casse en totalité et d'un coup au lieu de fissurer. Sur un aquarium domestique, un verre flotté classique correctement dimensionné reste le choix courant et le plus réparable." },
    ],
  },

  filtration: {
    methode: [
      "Le débit nécessaire s'exprime en rotations horaires : le nombre de fois que le volume net passe dans le filtre en une heure. Trois rotations suffisent à un bac de crevettes ou à un planté calme, quatre conviennent au communautaire classique, six deviennent nécessaires avec des gros mangeurs ou une forte charge. En dessous de trois, les déchets décantent au sol plutôt que d'être captés.",
      "Le débit imprimé sur l'emballage est mesuré à vide, cuve nue et sans masse filtrante. Une fois le panier garni de mousses et de céramiques, puis progressivement colmaté entre deux nettoyages, il en reste environ deux tiers. C'est pourquoi il faut diviser le besoin réel par 0,65 pour obtenir le chiffre à chercher sur le carton, et non acheter au débit affiché.",
      "En cas d'hésitation entre deux modèles, prenez le plus puissant. Un filtre surdimensionné se bride au robinet ou par un diffuseur, et sa réserve de masse filtrante absorbe les à-coups de pollution. Un filtre trop faible ne se rattrape jamais : il tourne à saturation, se colmate plus vite et laisse le bac en déficit permanent de brassage.",
    ],
    faq: [
      { q: "Quel débit de filtre pour un aquarium de 100 litres ?",
        r: "Sur 100 litres bruts, soit environ 75 litres nets, un communautaire demande quatre rotations, donc 300 litres par heure de débit réel. En corrigeant la perte due aux masses filtrantes, il faut chercher un modèle annoncé autour de 450 à 500 litres par heure." },
      { q: "Filtre interne ou filtre externe ?",
        r: "L'interne convient jusqu'à 100 litres environ : simple, peu cher, mais il occupe de la place dans le bac et sa capacité de masse filtrante reste limitée. Au-delà, l'externe s'impose : volume de masses très supérieur, entretien moins fréquent, et rien de visible dans la cuve." },
      { q: "À quelle fréquence nettoyer son filtre ?",
        r: "Toutes les quatre à huit semaines, et jamais en même temps qu'un gros changement d'eau. Rincez les mousses dans l'eau du bac retirée, jamais sous le robinet : le chlore tuerait la colonie bactérienne qui vit dedans, et c'est elle qui fait tout le travail. Ne changez jamais toutes les masses d'un coup." },
      { q: "Un filtre trop puissant peut-il gêner les poissons ?",
        r: "Le courant peut épuiser un combattant, un gourami ou des espèces d'eau calme. Cela se règle sans changer de filtre : bridez le débit à la vanne, orientez le rejet vers la vitre arrière, ou intercalez une racine. Le brassage se pilote, la capacité de filtration ne se rattrape pas." },
    ],
  },

  eclairage: {
    methode: [
      "L'éclairage se raisonne en lumens, jamais en watts. La correspondance entre les deux a changé du tout au tout avec la LED : une rampe de trente watts peut produire mille lumens comme trois mille selon sa qualité. Le watt mesure ce que vous payez, le lumen mesure ce que les plantes reçoivent.",
      "Le besoin s'exprime en lumens par litre net, selon l'exigence des plantes retenues. Comptez vingt-cinq lumens par litre pour les plantes faciles, anubias, mousses et cryptocorynes, quarante pour les plantes moyennes, et soixante-cinq et plus pour les gazonnantes et les rotalas rouges, qui réclament en outre un apport de gaz carbonique.",
      "La lumière s'atténue en traversant l'eau, et ce qui suffit en surface n'atteint plus le sol. Au-delà de quarante-cinq centimètres de colonne d'eau, il faut majorer d'environ trente pour cent. La durée compte autant que l'intensité : huit heures par jour sur minuterie suffisent, et au-delà vous nourrissez surtout les algues, qui profitent de l'excès bien plus vite que les plantes.",
    ],
    faq: [
      { q: "Combien de lumens pour un aquarium planté de 100 litres ?",
        r: "Sur 75 litres nets et des plantes moyennes, comptez environ 3 000 lumens, soit une rampe LED de 30 à 35 watts. Pour des plantes faciles, 1 900 lumens suffisent. Pour des gazonnantes, visez 5 000 lumens et prévoyez un apport de CO2, sans lequel l'excès de lumière ne produira que des algues." },
      { q: "Combien d'heures d'éclairage par jour ?",
        r: "Huit heures, sur minuterie, sans exception ni rattrapage. Un éclairage irrégulier ou trop long déséquilibre le rapport entre plantes et algues au profit des secondes. En cas de poussée d'algues, réduisez à six heures pendant deux semaines plutôt que d'augmenter la puissance." },
      { q: "Faut-il un éclairage spécial pour les plantes ?",
        r: "Le spectre compte autant que le flux. Les plantes utilisent surtout le bleu et le rouge ; une rampe dite plantes renforce ces bandes. Une LED blanche de bricolage éclaire l'œil mais nourrit mal, et sa température de couleur trop froide donne un rendu bleuté peu flatteur." },
      { q: "Puis-je garder l'éclairage d'origine de mon aquarium ?",
        r: "Souvent non pour un bac planté. Les rampes livrées avec les kits sont dimensionnées pour éclairer, pas pour faire pousser, et plafonnent fréquemment autour de dix lumens par litre. Vérifiez le flux annoncé en lumens : s'il n'est pas indiqué, c'est généralement mauvais signe." },
    ],
  },

  chauffage: {
    methode: [
      "Ce qui détermine la puissance n'est pas le volume seul mais l'écart à combler entre la pièce et le bac. Un même aquarium dans un salon à 21 °C et dans une véranda à 12 °C ne demande pas la même résistance. La température de référence est la plus basse de l'année, celle des nuits de janvier, pas la moyenne annuelle.",
      "Le calcul retient environ 0,15 watt par litre et par degré d'écart, avec un plancher de 0,4 watt par litre pour couvrir les pertes courantes. Un bac de 90 litres nets dans une pièce à 19 °C visant 25 °C demande donc autour de 80 watts, soit un modèle de 100 watts au palier standard supérieur.",
      "Au-delà de 250 litres, deux résistances de puissance moitié placées aux extrémités du bac valent mieux qu'une seule. La chaleur se répartit au lieu de créer un gradient, et surtout une panne ne laisse pas le bac à l'abandon. Dans tous les cas, un thermomètre indépendant est indispensable : le thermostat intégré dérive avec le temps, et c'est la panne la plus fréquente de tout le matériel d'aquariophilie.",
    ],
    faq: [
      { q: "Quelle puissance de chauffage pour un aquarium de 200 litres ?",
        r: "Sur environ 150 litres nets, dans une pièce descendant à 19 °C et pour une consigne à 25 °C, le besoin tourne autour de 135 watts, soit un modèle de 150 watts. Si la pièce descend à 15 °C en hiver, il faut passer à 200 watts, voire à deux résistances de 100 watts." },
      { q: "Faut-il un chauffage en été ?",
        r: "Il reste branché toute l'année : son rôle est de tenir une consigne, pas de chauffer en permanence. En été il ne se déclenchera simplement pas. Le vrai problème estival est inverse, la surchauffe au-delà de 29 °C, qui se traite par un ventilateur de surface et une baisse du niveau d'éclairage." },
      { q: "Mon chauffage tourne en permanence, est-ce normal ?",
        r: "Non, c'est le signe d'une puissance insuffisante ou d'une pièce trop froide. Une résistance correctement dimensionnée fonctionne par cycles courts. Tourner en continu l'use prématurément et signifie que la consigne ne sera jamais tenue lors des nuits les plus fraîches." },
      { q: "Où placer le chauffage dans l'aquarium ?",
        r: "Dans une zone de courant, près du rejet du filtre ou de sa crépine, pour que la chaleur se diffuse au lieu de stagner. Jamais enfoui dans le substrat ni collé contre une vitre. En position inclinée ou horizontale près du fond plutôt que verticale, la répartition est nettement meilleure." },
    ],
  },

  kit: {
    methode: [
      "La liste est calculée à partir de vos dimensions : la puissance de chauffage découle du volume net, le débit de filtre des rotations visées, les kilos de substrat de la surface au sol, la longueur de rampe de la longueur de cuve. Rien n'y est générique, et c'est ce qui la distingue d'une liste d'achat recopiée d'un guide.",
      "Elle couvre la mise en eau, pas les poissons. Ceux-ci n'arrivent qu'une fois le cycle de l'azote achevé, soit trois à six semaines plus tard. Pendant ce temps, les bactéries colonisent les masses filtrantes et apprennent à transformer l'ammoniaque en nitrites, puis les nitrites en nitrates. Tant que le test de nitrites n'est pas revenu à zéro, aucune introduction n'est possible.",
      "Les tests en gouttes sont le seul poste sur lequel il ne faut pas économiser. Les bandelettes manquent de précision là où elle est vitale, c'est-à-dire aux très faibles concentrations de nitrites, celles qui tuent. Un jeu pH, NO2, NO3 et GH-KH en gouttes se conserve deux ans et sert à chaque étape du démarrage.",
    ],
    faq: [
      { q: "Que faut-il acheter pour démarrer un aquarium ?",
        r: "Le bac et son meuble, un filtre, un chauffage, un éclairage, le substrat, un conditionneur d'eau, des bactéries de démarrage, un jeu de tests en gouttes, un thermomètre, un aspirateur à vase, une épuisette, de la nourriture et un seau réservé à cet usage. Douze postes, dont tous sauf trois sont indispensables dès le premier jour." },
      { q: "Combien coûte un aquarium complet ?",
        r: "Cela dépend du format et de la qualité du matériel, mais l'ordre de grandeur pour un bac de 100 à 120 litres complet et correctement équipé se situe entre trois cents et six cents euros, hors poissons et plantes. Le filtre et l'éclairage sont les deux postes où l'économie se paie ensuite." },
      { q: "Peut-on mettre les poissons dès le premier jour ?",
        r: "Non, et c'est la première cause de mortalité chez les débutants. Le bac neuf n'a aucune flore bactérienne : l'ammoniaque produite par les poissons s'accumule sans être transformée et les empoisonne en quelques jours. Il faut attendre que le cycle de l'azote soit établi, entre trois et six semaines." },
      { q: "Faut-il un kit tout-en-un ou acheter séparément ?",
        r: "Le kit simplifie et revient souvent moins cher à l'achat, mais son éclairage et son filtre sont dimensionnés au plus juste, et beaucoup les remplacent dans l'année. Acheter séparément coûte davantage au départ et évite ce double achat. Si vous prenez un kit, vérifiez au moins le débit du filtre et le flux lumineux de la rampe avant de valider." },
    ],
  },
};
