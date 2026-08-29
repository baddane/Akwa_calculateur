---
name: hook-generator
description: >
  Generate 6 clickbait-style LinkedIn hook variations for any topic. Two-line hooks built on the formula: a 40-char opening line, a 40-char bold contrast line. Includes digits, "How I" or "I" statements, and metrics. Use this skill whenever the user says "write me hooks", "hook ideas", "generate hooks", "I need a hook for a post about...", or pastes a topic and asks for openers. Fast output, no preamble.
---

# Hook Generator

## CRITICAL: Auto-start on load

When this skill triggers, go straight to Step 1. Do not summarise. Do not explain what makes a good hook.

## Étape 0. Résoudre le client

Ce fork travaille en portefeuille. Avant toute chose, déterminer sur quel
client on écrit.

- Si le répertoire courant contient `compliance-profile.md`, c'est le client
  actif. Le lire et continuer sans poser de question.
- Sinon, si `clients/` existe à la racine, lister les dossiers clients et
  appeler AskUserQuestion pour demander lequel. Ne jamais deviner.
- Sinon, continuer en mono-client (comportement d'origine).

Charger `compliance-profile.md` du client retenu et garder la profession et
les statuts en contexte : ils conditionnent tout ce qui suit.
Voir `CLIENTS.md` à la racine du dépôt.

## Step 1. Get the topic

If the user already pasted a topic in their message, use it and skip to Step 2.

Otherwise ask:

> What topic do you want hooks for?

Wait for response.

## Step 2. Write 6 hook variations

Le clickbait est écarté dans ce fork. Sur ces professions il est contre-productique
sur deux plans : il heurte les principes de dignité, délicatesse et modération pour
un avocat, et il tombe sous le caractère trompeur pour un CGP. Il abîme aussi la
seule chose que le client vend, qui est la sobriété du sachant.

La tension vient donc de la **précision et de l'enjeu**, jamais de l'exagération.
Un hook réussi ici fait dire "je ne savais pas ça", pas "il exagère".

Chaque hook fait deux lignes :

- **Ligne 1 (ouverture)** : 45 caractères maximum. Un fait, une distinction ou un
  enjeu. Pas de question.
- **Ligne 2 (bascule)** : 45 caractères maximum. Renverse, précise ou chiffre
  la conséquence.

Le français est plus long que l'anglais. 45 caractères, pas 40, mais les compter.

Produire 6 variations sur ces 6 angles, dans cet ordre :

1. **Le contresens courant** : une croyance répandue que le droit ou la fiscalité
   contredit. Doit être vérifiable, pas seulement contre-intuitive.
2. **Le coût de l'inaction** : ce que coûte une clause absente, un délai manqué,
   une déclaration oubliée. Chiffré uniquement si le chiffre est sourçable et
   général, jamais tiré d'un dossier.
3. **Le mécanisme méconnu** : un dispositif qui existe et que peu de gens
   connaissent. L'angle le plus performant sur ces niches.
4. **La question récurrente** : ce qu'on demande au client en permanence,
   formulé de façon agrégée. "La question qu'on me pose le plus souvent sur",
   jamais "un client m'a demandé".
5. **Le changement daté** : un texte qui entre en vigueur, avec sa date.
   Vérifier l'état d'avancement avant d'écrire. Un texte non promulgué présenté
   comme applicable est un bloquant de conformité.
6. **La distinction qui change tout** : deux notions que le public confond et
   dont la confusion coûte cher. Usufruit et nue-propriété, licenciement et
   rupture conventionnelle, assurance-vie et succession.

### Interdits sur tous les hooks

Ces formulations sont bloquées à la source, avant même le contrôle de conformité :

- Toute revendication de résultat personnel : "j'ai gagné", "j'ai fait obtenir",
  "j'ai récupéré", tout pourcentage de réussite.
- Tout rendement, toute économie d'impôt présentés comme acquis.
- "Spécialiste" et "spécialisé" si le client n'a pas de certificat de
  spécialisation (voir `compliance-profile.md`).
- Tout élément permettant de reconnaître un dossier ou un client.
- Le superlatif et la comparaison confraternelle.
- L'urgence inventée. Un délai légal réel se rappelle, un délai commercial
  se fabrique et se voit.

## Étape de conformité (obligatoire, non contournable)

Avant de montrer quoi que ce soit à l'utilisateur, faire passer le brouillon
par le skill `compliance-check` avec le profil réglementaire du client.

- Verdict CONFORME : afficher le contenu, suivi d'une ligne indiquant le
  profil appliqué et le fait que le contrôle est passé.
- Verdict A CORRIGER : appliquer les corrections proposées, puis afficher la
  version corrigée en signalant ce qui a été modifié et pourquoi.
- Verdict BLOQUANT : ne pas afficher le brouillon d'origine. Expliquer le
  blocage, proposer un angle de remplacement, et repartir à l'étape de
  rédaction.

Ne jamais livrer un contenu non contrôlé, même si l'utilisateur presse, même
pour un simple brouillon de travail. Un brouillon copié-collé devient un post
publié.

## Step 3. Output format

```
HOOKS for [topic]

1. [Contresens courant]
[Line 1]
[Line 2]

2. [Coût de l'inaction]
[Line 1]
[Line 2]

3. [Mécanisme méconnu]
[Line 1]
[Line 2]

4. [Question récurrente]
[Line 1]
[Line 2]

5. [Changement daté]
[Line 1]
[Line 2]

6. [Distinction qui change tout]
[Line 1]
[Line 2]
```

## Step 4. Offer the next move

Ask:

> Lequel veux-tu que je développe en post complet ? Donne le numéro et je le
> passe au post-formatter, contrôle de conformité inclus.

## Rules

- 45 caractères maximum par ligne. Les compter.
- No questions in the opening line.
- No em dashes.
- No filler words. Every word earns its place.
- Prefer digits over spelled numbers (3, not three).
- British English unless voice.md says otherwise.
- La sobriété n'est pas la fadeur. Un hook plat ne sert personne : chercher
  l'angle précis plutôt que l'adjectif fort.
- En cas de doute sur un angle, le proposer en le signalant plutôt que de
  l'écarter en silence. L'arbitrage appartient au client.
