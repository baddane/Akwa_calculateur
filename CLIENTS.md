# Structure multi-clients

Les skills d'origine lisent `about-me.md` et `voice.md` à la racine du projet,
ce qui suppose un seul client. Ce fork travaille en portefeuille.

## Convention

```
clients/
  _template/                  modèle à copier pour chaque nouveau client
  dupont-avocats/
    about-me.md               qui est le client, audience, offre
    voice.md                  règles de voix, produites par voice-builder
    compliance-profile.md     profession, statuts, mentions obligatoires
    compliance-log.md         journal des contrôles de conformité
    posts/                    brouillons et posts publiés
    data/                     exports LinkedIn, scrapes Apify
  patrimoine-durand/
    ...
```

## Ouvrir un client

```bash
cp -r clients/_template clients/<slug>
```

Puis remplir `compliance-profile.md` **avant** toute production. C'est le
fichier que `compliance-check` lit pour savoir quelle grille appliquer.
Sans lui, chaque contrôle repose la question du statut.

Lancer ensuite `voice-builder` pour produire `about-me.md` et `voice.md`.

## Travailler sur un client

Deux options, au choix selon la surface :

- **Claude Code** : ouvrir la session avec `clients/<slug>` comme répertoire
  de travail. Les skills retrouvent alors leurs fichiers à la racine, sans
  modification.
- **Claude Desktop / Cowork** : un projet par client, avec les quatre fichiers
  du dossier client téléversés dedans.

Dans les deux cas, les skills patchés de ce fork exécutent une résolution de
client au démarrage (étape 0) et demandent sur quel client ils travaillent
si le contexte est ambigu.

## Cloisonnement

Ne jamais mélanger deux clients dans une même session. Les fichiers de voix se
ressemblent, les dossiers non : pour un avocat, un mélange de contexte entre
deux clients est un risque de secret professionnel, pas une simple erreur de
rédaction.

`clients/` est ignoré par git par défaut (voir `.gitignore`). Les données
clients ne remontent pas dans le dépôt.
