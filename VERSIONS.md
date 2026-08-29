# Versions

## 1.1.0 — 2026-08-29

Fork vertical pour les professions réglementées françaises du conseil :
avocats et gestionnaires de patrimoine.

**Ajouts**
- `compliance-check` : contrôle déontologique avant publication, verdict motivé
  et réécriture conforme. Grilles avocat (RIN, secret professionnel, publicité)
  et CGP / CIF (AMF, DDA, ORIAS).
- Références réglementaires par profession dans
  `skills/compliance-check/references/`.
- Structure multi-clients (`clients/`, `CLIENTS.md`) avec cloisonnement par
  dossier et journal de conformité.

**Modifications**
- `hook-generator` : abandon du clickbait, incompatible avec les principes de
  dignité et modération de l'avocat et avec l'exigence de communication non
  trompeuse du CGP. Six nouveaux angles fondés sur la précision et l'enjeu.
- `post-writer`, `content-matrix`, `hook-generator` : porte de conformité
  obligatoire avant toute sortie.
- `post-writer`, `profile-optimizer`, `content-matrix`, `post-scorer`,
  `hook-generator` : résolution du client actif au démarrage.
- `content-matrix` : bibliothèque de piliers par profession, format
  Motivational remplacé par Cas d'école.
- `post-scorer` : suppression du référentiel à 415k abonnés, remplacé par
  historique client puis palier d'audience. Ajout des critères de densité
  d'information et de passage en conformité.

18 skills.

## 1.0.0 — 2026-04-22

Initial release. 17 skills covering the full content system documented in the MarTech AI newsletter.

**Voice foundation**
- voice-builder
- newsletter-voice

**LinkedIn**
- profile-optimizer
- post-writer
- graphic-designer
- post-scorer
- post-formatter
- hook-generator
- content-matrix
- niche-research
- gemini-infographic
- gemini-carousel
- quote-post

**Instagram Reels**
- reels-scripting

**YouTube**
- youtube-thumbnail

**Community**
- pinned-comment

**Analytics**
- analytics-dashboard
