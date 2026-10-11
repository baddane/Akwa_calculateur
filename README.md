# Calculateurs aquarium eau douce

Quatre calculateurs pour dimensionner un bac d'eau douce, avec liens affiliés Amazon.fr.

- **Volume réel** : volume net après marge de surface, substrat et décor
- **Population** : charge biologique pondérée, alertes par espèce (bancs, volume minimum)
- **Filtration** : débit réel utile et débit constructeur à viser
- **Kit de démarrage** : liste de matériel complète, dimensionnée sur le bac saisi

## Conformité Amazon Partenaires

- Tag affilié dans `lib/amazon.ts` (`baddane0a-21`)
- **Aucun prix affiché** : les informations tarifaires ne peuvent venir que de l'API
  Produits. À ajouter seulement une fois les clés API obtenues.
- Mention d'affiliation en pied de page
- Liens en `rel="sponsored nofollow noopener"`
- Déclarer le domaine dans le compte Partenaire **avant** publication

## Développement

```bash
npm install
npm run dev
```

## Déploiement

```bash
npx vercel --prod
```

## Publication Pinterest via Tampermonkey

Alternative à l'import en masse (`npm run epingles:csv`) : le script
`scripts/pinterest-auto-pins.user.js` publie depuis le navigateur, connecté au compte.

1. Tampermonkey > Créer un nouveau script > coller le contenu du fichier > Enregistrer.
   Accepter la demande d'accès aux domaines externes (téléchargement des images).
2. `npm run epingles:tampermonkey` → `epingles-tampermonkey.csv`
   (tableau « Aquariophilie » par défaut, variable `TABLEAU_PINTEREST` pour changer).
3. Ouvrir pinterest.com, charger le CSV dans le panneau « Auto-Pin », Vérifier, Publier.

Garde-fous : 5 pins par jour, 1 h 30 à 3 h entre deux, de 9 h à 21 h, un seul onglet à la fois.
La file reprend seule le lendemain si l'onglet reste ouvert (sinon « Reprendre ») ; un pin déjà publié d'après le journal
n'est jamais republié. Laisser l'onglet ouvert pendant la publication.
