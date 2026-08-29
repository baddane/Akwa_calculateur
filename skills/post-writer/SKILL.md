---
name: post-writer
description: >
  Write LinkedIn posts that match the user's voice system (about-me.md and voice.md). Use this skill whenever the user says "write a post", "draft a post", "LinkedIn post", "post about [topic]", "content idea", or wants help writing any LinkedIn content. Also trigger when the user pastes a context dump (notes, transcripts, bullet points) and wants it turned into a post. Always references the voice files in the project before writing. Always outputs the final post in a code block.
---

# Post Writer

## CRITICAL: Auto-start on load

The moment this skill triggers, go straight to Step 1. Do not summarise the skill. Do not explain what it does. Do not list the files it references. Jump to input gathering immediately.

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

## Step 1. Gather inputs

Check the project for about-me.md and voice.md. Read both. If either is missing, tell the user to run the Voice Builder skill first ("say build my voice"), then stop.

If both files exist, call AskUserQuestion with this exact JSON:

```json
[
  {
    "question": "What topic do you want to post about?",
    "header": "Topic",
    "multiSelect": false,
    "options": [
      {"label": "Paste a context dump", "description": "I have notes, transcripts, or raw ideas to turn into a post"},
      {"label": "I have a topic in mind", "description": "I will type the topic after this"},
      {"label": "Suggest topics for me", "description": "Based on my voice system, suggest 5 topics I should post about"}
    ]
  },
  {
    "question": "Do you have any reference posts you want me to use as structural inspiration?",
    "header": "References",
    "multiSelect": false,
    "options": [
      {"label": "No references", "description": "Write from scratch using my voice files only"},
      {"label": "I will paste examples", "description": "I have posts from other creators I want you to study first"},
      {"label": "Use my training posts", "description": "Reference the posts I used in the Voice Builder"}
    ]
  }
]
```

Based on the answers:
- "Paste a context dump": wait for the user to paste, extract the core idea, then proceed to Step 2
- "I have a topic in mind": wait for the user to type it, then proceed to Step 2
- "Suggest topics for me": read about-me.md topic pillars and voice.md, suggest 5 specific topics with a one-line angle for each, then use AskUserQuestion to let them pick one
- "I will paste examples": wait for reference posts, note the structural patterns, then proceed
- "Use my training posts": reference whatever posts are already in the project

## Step 2. Research and plan

Before writing, research the topic. Look for:
- Data points or statistics that support the angle
- Contrarian takes or surprising facts
- Real examples or case studies
- Common misconceptions to challenge

Then present a post plan. Call AskUserQuestion:

```json
[
  {
    "question": "Which angle works best for this post?",
    "header": "Angle",
    "multiSelect": false,
    "options": [
      {"label": "[Angle 1 name]", "description": "[One sentence describing the angle and hook]"},
      {"label": "[Angle 2 name]", "description": "[One sentence describing the angle and hook]"},
      {"label": "[Angle 3 name]", "description": "[One sentence describing the angle and hook]"}
    ]
  },
  {
    "question": "Which framework do you want?",
    "header": "Framework",
    "multiSelect": false,
    "options": [
      {"label": "PAS", "description": "Problem, Agitate, Solution"},
      {"label": "How-to list", "description": "Numbered steps or tips"},
      {"label": "Story to lesson", "description": "Personal story with a takeaway"},
      {"label": "Contrarian take", "description": "Challenge a common belief"}
    ]
  }
]
```

Fill in the actual angle options based on the topic research. Do not use placeholder text for the angle descriptions.

## Step 3. Write the draft

Write the post following these rules:
- Read voice.md for tone, rhythm, hook style, CTA style, and the absence patterns section (what the voice never does)
- Read about-me.md for audience and topic context
- Match the sentence length and paragraph rhythm from voice.md
- Avoid every banned word, structure, and pattern listed in voice.md's absence section
- Use the hook pattern that fits the chosen angle
- End with the CTA style from voice.md

Output the post inside a plain code block:

```
[The full post goes here with all line breaks and formatting exactly as it should appear on LinkedIn]
```

After the code block, add 2 to 3 sentences on why you chose this hook and structure, referencing specific patterns from voice.md.

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

## Step 4. Iterate

Ask the user:

> How does this feel? Tell me what to change, or say "ship it" and I will save the final version.

If the user gives feedback, revise and output a new code block. Maximum 3 revision rounds.

If the user says "ship it" or equivalent, save the final post as a markdown file in the project.

Then say:

> Post saved. Say "design a graphic" to create a visual, or "score my post" to get feedback before publishing.

## Rules

- Always read about-me.md and voice.md before writing.
- Always output posts in a plain code block.
- Never use em dashes in any post.
- British English unless voice.md says otherwise.
- Do not add hashtags unless voice.md explicitly uses them.
- Do not add engagement bait CTAs unless they appear in voice.md.
- Keep posts between 150 and 300 words unless the user requests otherwise.
- Plan before writing. Never skip Step 2.

### Règles propres à la verticale

- Français par défaut sur cette verticale, sauf mention contraire dans voice.md.
- Toute affirmation de droit, de fiscalité ou de chiffre doit être vérifiable.
  En cas de doute, écrire la version prudente et signaler le point à vérifier
  au client plutôt que de laisser passer une approximation.
- Ne jamais transformer un dossier en anecdote, même anonymisée. Si le client
  fournit un cas réel, le convertir en cas d'école explicitement hypothétique.
- Ne jamais répondre à une situation individuelle dans un post ou en commentaire.
  Renvoyer vers un échange privé, ce qui est aussi le bon réflexe commercial.
- Le CTA se limite à une invitation à échanger. Pas d'appel à l'action pressant,
  pas d'engagement bait, pas de promesse de résultat.
- Aucun contenu ne sort sans passer l'étape de conformité.
