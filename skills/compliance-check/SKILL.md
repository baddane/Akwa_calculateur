---
name: compliance-check
description: >
  Contrôle de conformité déontologique d'un contenu avant publication, pour les professions réglementées françaises du conseil : avocats (RIN, secret professionnel, publicité) et conseillers en gestion de patrimoine / CIF / courtiers (AMF, DDA, ORIAS). Produces a verdict (CONFORME, A CORRIGER, BLOQUANT), the exact offending spans, and a rewritten compliant version. Use this skill whenever the user says "vérifie la conformité", "check déonto", "est-ce que je peux publier ça", "contrôle réglementaire", "passe ça en conformité", "compliance check", or pastes any draft written for an avocat or a CGP. Also runs automatically as the final gate of post-writer, post-formatter, hook-generator, gemini-carousel and profile-optimizer in this fork. Never approves silently: always names the rule applied.
---

# Compliance Check

Passage obligatoire avant toute publication produite par ce fork.
Aucun contenu ne sort sans être passé par ce contrôle.

## CRITICAL: Auto-start on load

Quand ce skill se déclenche, aller directement à l'étape 1. Ne pas résumer le
skill. Ne pas expliquer la réglementation avant d'avoir le texte.

## Étape 1. Résoudre le profil réglementaire

Lire `compliance-profile.md` dans le dossier client courant
(voir `CLIENTS.md` à la racine du dépôt).

Si le fichier existe, en extraire la profession, les statuts, les mentions
obligatoires, et le passer en contexte sans reposer la question.

S'il n'existe pas, appeler AskUserQuestion :

```json
[
  {
    "question": "Pour quelle profession ce contenu est-il écrit ?",
    "header": "Profession",
    "multiSelect": false,
    "options": [
      {"label": "Avocat", "description": "Inscrit à un barreau, soumis au RIN et au secret professionnel"},
      {"label": "CGP / CIF", "description": "Conseil en gestion de patrimoine, statuts AMF, ORIAS, courtage"},
      {"label": "Les deux", "description": "Structure pluridisciplinaire ou contenu co-signé"}
    ]
  }
]
```

Charger ensuite la ou les références correspondantes :

- Avocat : `references/avocat.md`
- CGP / CIF : `references/gestion-patrimoine.md`

Si "Les deux", appliquer l'union des deux grilles. La règle la plus stricte
l'emporte toujours.

## Étape 2. Récupérer le contenu

Si l'utilisateur a déjà collé le texte, l'utiliser. Sinon :

> Colle le contenu à contrôler. Post, carrousel, section de profil, message de
> prospection, réponse en commentaire : tout passe par la même grille.

Contrôler aussi ce qui accompagne le texte quand c'est fourni : le hook seul,
la slide 1 d'un carrousel, la légende d'un visuel. Un hook conforme au sein
d'un post conforme peut devenir non conforme sorti de son contexte, et c'est
pourtant lui qui est lu en premier.

## Étape 3. Passer la grille

Contrôler dans cet ordre, sans en sauter :

1. **Interdits durs** de la référence chargée. Chacun est un BLOQUANT.
2. **Points de vigilance** de la référence chargée. Chacun est un A CORRIGER.
3. **Mentions obligatoires** absentes. A CORRIGER.
4. **Exactitude factuelle.** Toute affirmation de droit, de fiscalité ou de
   chiffre doit être vérifiable et à jour. Un texte non promulgué présenté
   comme applicable est un BLOQUANT, pas une nuance.
5. **Équilibre avantage / risque** (CGP uniquement). Si l'avantage est dans
   le hook et le risque en fin de post, c'est A CORRIGER même si tout y est.

Pour chaque problème, relever le **passage exact** en citation. Ne jamais
signaler un problème sans pouvoir montrer les mots qui le posent.

## Étape 4. Rendre le verdict

Format de sortie, toujours le même :

```
VERDICT : [CONFORME | A CORRIGER | BLOQUANT]
Profil appliqué : [profession + statuts]

── BLOQUANTS ──
[Aucun] ou, pour chacun :
  Passage   : "[citation exacte]"
  Règle     : [nom de la règle, référence du texte]
  Pourquoi  : [une phrase, concrète]
  Correction: "[réécriture conforme du même passage]"

── A CORRIGER ──
[même structure]

── MENTIONS MANQUANTES ──
[liste, ou Aucune]
```

Puis, si le verdict n'est pas CONFORME, produire la **version réécrite
complète** dans un bloc de code, corrections intégrées, en conservant la voix
du client telle que définie dans `voice.md`.

La correction ne doit jamais se contenter de supprimer. Un post amputé de son
angle n'a plus d'intérêt. Chercher la formulation qui garde la force du propos
en le rendant conforme. C'est là que se trouve la valeur du contrôle.

## Étape 5. Tracer

Sur une surface disposant d'outils fichiers, ajouter une ligne au journal
`clients/[slug]/compliance-log.md` :

```
| Date | Contenu | Verdict | Bloquants levés |
```

Ce journal est ce qui protège la prestation en cas de contestation. Il montre
qu'un contrôle a été fait, quand, et sur quoi.

## Règles

- Ne jamais rendre CONFORME sans avoir nommé au moins la profession et les
  règles passées en revue. Une validation muette n'a aucune valeur.
- Ne jamais arbitrer un cas limite à la place du client. En cas de doute
  sérieux, verdict A CORRIGER avec la mention : "à faire valider par le
  bâtonnier / le responsable conformité avant publication".
- Ne jamais présenter ce contrôle comme une validation juridique. C'est une
  aide à la rédaction. La responsabilité de la publication reste au
  professionnel inscrit.
- Ne jamais assouplir une règle parce que l'utilisateur insiste. Signaler que
  la décision lui appartient, maintenir le verdict, et le tracer dans le journal.
- Les références sont datées et le droit évolue. Si une règle citée a plus de
  douze mois sans revue, le signaler dans le verdict.
