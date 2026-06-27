# TASK: Continue the D7460N "Benefits Matrix" + research the THOR precursor lineage

You are continuing prior work. You have NO memory of the earlier session; everything you
need is below or in the repos. Prioritize ACCURACY over speed. Do NOT fabricate. Use only
real, documented material that already exists in the repos, and cite which file it came
from. No filler, no "word salad." People will decide whether to adopt this architecture
based on what they read, so every claim must be grounded.

## READ FIRST (in this order), entirely, from GitHub — not local copies

1. autocss-com/autocss @ branch `claude/lucid-hawking-E5Ej2`:
   - `CLAUDE.md`  (canonical, non-negotiable D7460N rules — obey them)
   - `SESSION-HANDOFF.md`  (re-assert its constraints)
   - `BENEFITS-MATRIX.md`  (THIS is the deliverable you are improving — read it fully first)
2. d7460n/DHCP: `docs/architecture/README.md` (the "UI Architecture Feature Matrix"),
   `ADD.md` (Architecture Decision Doc; huge; has UX / WEBDX / USABILITY / ADVANTAGES
   sections), `README.md`, `SECURITY.md`, `docs/customer/customer-overview.md`,
   `docs/client/client-summary-dashboard.md`,
   `docs/architecture/sharepoint-spa-safety-checklist-ready.md`
3. d7460n/starter: `README.md` (audience-segmented benefits), `.agents/SOUL.md`

## DELIVERABLE + WHERE IT LIVES

- File: `BENEFITS-MATRIX.md` at the ROOT of autocss-com/autocss.
- Branch: `claude/lucid-hawking-E5Ej2` (NEVER commit to main; never open a PR unless asked).
- It is a STANDALONE file (the user explicitly wanted a new file, NOT edits to README.md).
- Commit message footer (every commit):
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  Claude-Session: <this session's URL>
  (Do NOT put the model id anywhere inside committed files.)

## CURRENT STATE OF BENEFITS-MATRIX.md (already done — do NOT redo, only extend/refine)

It is organized BY EXPERIENCE DOMAIN so a reader opens the one that is theirs:

- Title + one-line intro.
- "In plain words (no tech knowledge needed)" — a jargon-free explanation of what a web
  app / the architecture is and why a NON-technical person should be excited (written for
  someone who has never used a website). Keep this.
- "The four experiences" table mapping each domain to its audience + documented definition.
- Four collapsible `<details>` sections — UX, DX, CX, MX — each a table:
  `Capability | What [that audience] gets | How it works (technical)` plus a
  "Proven by:" line citing real examples.
- A "Sources" footer listing the in-scope files used.

Definitions are taken verbatim from DHCP's feature matrix:

- UX = perceived performance, usability, accessibility, interaction stability.
- DX = maintainability, clarity, velocity, architectural durability.
- CX = risk reduction, cost efficiency, longevity, organizational flexibility.
- MX (Management Experience, "the prime") = NEW; not in the docs. Synthesized from the
  documented stakeholder / procurement-legal / security-compliance / government material.
  MX LEADS with the cross-stovepipe point: because the UI is DATA-AGNOSTIC (one UI conforms
  to each program's own data structure, built from its JSON keys via `toTagName()`), the
  METHOD of building web apps cuts ACROSS stovepiped government programs, delivering
  accessibility, usability, security, performance, interoperability, and scalability
  across the whole portfolio instead of rebuilding per project. (Grounded in the feature
  matrix's "Data-Agnostic UI", "Cross-Stack UI Reuse", "Presentation/Data Decoupling"
  and customer-overview's "designed for government".)

## RULES THE USER ENFORCES (hard)

- Do EXACTLY what is asked — no more, no less. Ask on ANY ambiguity; never guess.
- Read whole files; read from the GitHub repos, never local clones.
- NO checkmark-only cells — write real benefit explanations.
- Every cell traceable to a real documented statement; leave a cell blank rather than invent.
- Real shipped examples to use: the autocss demo ecosystem (international.dance ballet
  studio w/ accounts+store+payments; psychiatrist practice on headless WordPress; Pokémon;
  Fairfax County / Virginia crime statistics; Bible study) and the DHCP management portal.

## THE NEW WORK FOR THIS SESSION: THOR → D7460N lineage

Confirmed fact (in-scope, citable): D7460N was formerly "THOR UI" — see DHCP/SECURITY.md
header "D7460N / THOR UI" and "implements the D7460N (THOR UI) architecture." ADD.md also
uses the "Thor's hammer / Mjölnir" metaphor against monolithic overkill.

These repos hold the precursor history and were NOT readable in the prior session (scope).
This session MUST be created with them in scope. Read them and fold any worthwhile,
DOCUMENTED lineage/benefit material into BENEFITS-MATRIX.md (e.g., a short, sourced
"Lineage: from THOR to D7460N" note, and/or strengthen MX/CX with real precursor proof):

- dragontheory/THOR        (default branch is `master`, not main)
- dragontheory/THOR-STACKLESS, dragontheory/THOR-netlify
- dragontheory/D7460N
- D7460N/D7460N.dev        (has its own fuller ADD.md)
- dragontheory/D7460N-EMS  (2021 "Entity Management System — JAMstack, SPA, PWA,
                            Bring Your Own Data (BYOD)") — likely the earliest BYOD framing
- (optional) D7460N/D7460N.io, D7460N-ai/D7460N.ai, dragontheory/ID, international-dance/*

REQUIRED SCOPE for this new session (select all in the repo picker):
autocss-com/autocss (write target), dragontheory/THOR, dragontheory/THOR-STACKLESS,
dragontheory/THOR-netlify, dragontheory/D7460N, D7460N/D7460N.dev, dragontheory/D7460N-EMS,
d7460n/DHCP, d7460n/starter.

If any of those is still "not configured for this session," STOP and tell the user exactly
which one and that it must be added to the session scope — do not work around it.

## ACCEPTANCE

- BENEFITS-MATRIX.md still reads cleanly by domain (UX/DX/CX/MX) with the plain-language
  section intact.
- Any THOR/lineage additions are short, true, and cite the exact source repo/file.
- Nothing invented; blanks over guesses. Commit to claude/lucid-hawking-E5Ej2.

## BACKGROUND CONTEXT (why this exists)

- The D7460N Architecture is zero-dependency, CSS-replaces-JS, browser-native, SPA + PWA.
  HTML = structure (semantic only; no div/span/class/id/data-*), CSS = all UI behavior/state,
  JS = data transport (CRUD) only via `oninput`. One `index.html`, Holy Grail CSS Grid.
- The goal of BENEFITS-MATRIX.md is to let any reader — end user, developer, customer, or
  program management/prime — quickly find how the architecture benefits THEM, backed by
  real documented examples, so they can decide whether to adopt it.
- Earlier deliverable history (for context, do not undo): the matrix started life appended
  to README.md, was corrected to remove a checkmark layout, then moved to its own file
  `BENEFITS-MATRIX.md`, then reframed around the UX/DX/CX/MX experience domains, then had
  the plain-language section and the MX cross-stovepipe lead row added.
