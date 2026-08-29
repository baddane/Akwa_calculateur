---
name: content-matrix
description: >
  Generate 32+ LinkedIn post ideas in a single table by pairing the user's content pillars with 8 proven content formats. Based on the Justin Welsh content matrix. Use this skill whenever the user says "give me post ideas", "content matrix", "what should I post about", "generate post ideas", "content ideation", or "map out my content for the month". Pulls from about-me.md and voice.md if they exist, otherwise asks for pillars and context.
---

# Content Matrix

## CRITICAL: Auto-start on load

When this skill triggers, go straight to Step 1. Do not summarise. Start input gathering immediately.

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

Check the project for about-me.md. If it exists, read it and pre-fill the description of who the user is. Skip that question and tell the user what you pulled.

If about-me.md is missing, ask:

> Give me at least two paragraphs describing who you are, what you do, and what you like to discuss. The more specific you are, the more relevant the ideas.

Wait for response.

Then call AskUserQuestion:

```json
[
  {
    "question": "What are your content pillars?",
    "header": "Pillars",
    "multiSelect": false,
    "options": [
      {"label": "I will type them", "description": "I have 3 to 4 content pillars to use"},
      {"label": "Pull from voice.md", "description": "Use the topics already defined in my voice files"},
      {"label": "Suggest them for me", "description": "Based on my about-me.md, recommend 4 pillars"}
    ]
  }
]
```

If the user types their own, accept 3 to 5 pillars. If fewer than 3, ask for more.

If the user picks "Suggest them for me", read about-me.md, propose 4 pillars covering their positioning, and ask them to confirm or edit before continuing.

### Bibliothèque de piliers par profession

Si le client ne sait pas nommer ses piliers, proposer à partir de cette base et
faire valider. Ne jamais l'imposer : ce sont des points de départ, la
différenciation vient de l'angle propre au client.

**Avocat**

- Pédagogie juridique : rendre lisible un mécanisme de droit que le public subit.
- Décryptage d'actualité : texte nouveau, jurisprudence publiée, réforme datée.
- Prévention : ce qui se joue avant le contentieux, clauses, délais, formalisme.
- Le métier vu de l'intérieur : la réalité du travail, sans aucun élément de dossier.
- Le droit comme outil de décision : pourquoi un dirigeant devrait appeler plus tôt.

**CGP / CIF**

- Pédagogie patrimoniale : assurance-vie, PER, démembrement, expliqués simplement.
- Décryptage fiscal : loi de finances, dispositifs, conditions réelles.
- Comportement d'investisseur : biais, horizon, discipline, coût de l'agitation.
- Étapes de vie : cession d'entreprise, transmission, retraite, expatriation, divorce.
- Idées reçues : ce que le grand public croit et que les chiffres contredisent.

Le pilier "étapes de vie" est le plus rentable en prospection sur ces deux
métiers : il capte des gens à l'instant précis où ils ont un besoin, plutôt
qu'une audience qui se cultive.

### Formats à manier avec précaution sur ces niches

Le format **Contrarian** doit rester factuel. Aller contre une idée reçue
vérifiable est bon. Aller contre un confrère, une profession voisine ou l'état
du droit ne l'est pas.

Le format **Motivational** au sens d'origine (récit d'un exploit) fonctionne mal
ici et frôle le témoignage client. Le remplacer par **Cas d'école** : une
situation type explicitement présentée comme hypothétique, qui illustre un
mécanisme sans jamais renvoyer à un dossier réel.

## Step 2. Build the matrix

Generate a markdown table with:

- X axis (columns): 8 content formats, always in this order:
  1. Actionable
  2. Cas d'école
  3. Analytical
  4. Contrarian
  5. Observation
  6. X vs Y
  7. Present vs Future
  8. Listicle
- Y axis (rows): the user's 3 to 5 pillars

Every cell contains one specific, concrete post idea tailored to the pillar and format. Not generic. Not reusable across pillars.

Format definitions to apply when filling each cell:

- **Actionable**: Ultra-specific how-to. Teaches the reader to do one thing.
- **Cas d'école**: Situation type, explicitement hypothétique, qui illustre un mécanisme. Jamais un dossier réel, même anonymisé.
- **Analytical**: Breakdown of why something works the way it does.
- **Contrarian**: Go against the common advice in the niche and back it up.
- **Observation**: A hidden, silent, or underdiscussed trend the user has noticed.
- **X vs Y**: Compare two entities (tools, styles, frameworks, companies).
- **Present vs Future**: Current state vs a specific prediction, with the why.
- **Listicle**: A list of resources, tips, mistakes, lessons, or steps.

Each cell's idea should be a specific headline, not a theme. Good: "The 3-line hook formula I stole from David Ogilvy". Bad: "Hooks".

## Step 3. Output (surface-aware)

Pick the output mode based on the surface you are running on. Do not output the table in a fenced markdown code block — that renders as monospace plain text and makes a 5×8 grid hard to scan.

- **Claude.ai or Claude Cowork (chat surfaces with interactive chart support):** render the matrix as an interactive chart / interactive table widget. Pillars as rows, formats as columns, each cell holding one specific headline. The user should be able to click a cell to see the full headline and any expansion notes. Do not also dump the table as markdown — the chart is the deliverable.
- **Claude Code (file-system surface, has Write/Edit tools):** save the matrix to `content-matrix-YYYY-MM-DD.md` in the current working directory and print the same table inline in the response as a plain markdown table (no triple-backtick wrap). Confirm the file path so the user can open it.
- **Fallback (no interactive chart, no file-system tools):** output a plain markdown table inline. Still no code-fence wrap.

Below the table or chart, add one sentence naming the single strongest idea across the matrix and why.

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

## Step 4. Offer the next move

Ask:

> Any cell here you want me to write as a full post? Reference the cell by pillar + format (for example "Hooks × Contrarian") and I will hand it to the post-writer or post-formatter skill.

On Claude Code, also offer to append the drafted post into the same `content-matrix-YYYY-MM-DD.md` file under the cell reference.

## Rules

- Minimum 3 pillars, maximum 5. More than 5 dilutes the matrix.
- Every cell idea must be specific to that pillar AND that format. Do not reuse the same idea across pillars.
- Tune the language to the user's voice if voice.md exists.
- British English unless voice.md specifies American.
- Never use em dashes.
