# TASK: Continue the D7460N "Benefits Matrix" + research the THOR precursor lineage

You are continuing prior work. You have NO memory of the earlier session; everything you
need is below or in the repos. Prioritize ACCURACY over speed. Do NOT fabricate. Use only
real, documented material that already exists in the repos, and cite which file it came
from. No filler, no "word salad." People will decide whether to adopt this architecture
based on what they read, so every claim must be grounded.

## TWO DELIVERABLE FILES (do not lose either)

- `BENEFITS-MATRIX.md` — the STABLE version. Leave it intact unless told otherwise.
- `BENEFITS-MATRIX-v2.md` — the WORKING COPY where new concepts are added (the user
  iterates here to avoid risking the stable one). DEFAULT to editing the v2 copy. If the
  user later says "promote v2," replace BENEFITS-MATRIX.md with it.

Both live at the ROOT of autocss-com/autocss on branch `claude/lucid-hawking-E5Ej2`.

## READ FIRST (in this order), entirely, from GitHub — not local copies

1. autocss-com/autocss @ branch `claude/lucid-hawking-E5Ej2`:
   - `CLAUDE.md`  (canonical, non-negotiable D7460N rules — obey them; note Rule 29:
     every CSS file is wrapped in its OWN named `@layer`, and the <link> order in
     index.html IS the cascade order)
   - `SESSION-HANDOFF.md`  (re-assert its constraints)
   - `BENEFITS-MATRIX.md` AND `BENEFITS-MATRIX-v2.md`  (read both fully first)
   - `index.html` and `assets/css/*.css` — the CSS files carry their OWN header notes
     worth quoting; `color-scheme.css` especially ("drop-in-anywhere… link this ONE
     file… with NO other CSS/JS"). `a11y.css`, `loading.css`, `fallbacks.css`,
     `reset.css`, `transitions.css` each open `@layer <name> { … }`.
2. d7460n/DHCP: `docs/architecture/README.md` (the "UI Architecture Feature Matrix"),
   `ADD.md` (Architecture Decision Doc; huge; has UX / WEBDX / USABILITY / ADVANTAGES
   sections), `README.md`, `SECURITY.md`, `docs/customer/customer-overview.md`,
   `docs/client/client-summary-dashboard.md`,
   `docs/architecture/sharepoint-spa-safety-checklist-ready.md`,
   `assets/css/README.md`, `assets/css/STYLEGUIDE.md`
3. d7460n/starter: `README.md` (audience-segmented benefits), `.agents/SOUL.md`,
   `.agents/skills/css/SKILL.md`

## DELIVERABLE STRUCTURE (already built — extend/refine, do NOT redo)

Organized BY EXPERIENCE DOMAIN so a reader opens the one that is theirs:
- Title + one-line intro.
- "In plain words (no tech knowledge needed)" — a jargon-free explanation of what a web
  app / the architecture is and why a NON-technical person should be excited. KEEP THIS.
- "The four experiences" table mapping each domain to its audience + documented definition.
- "Agnostic by design — the common thread" (v2): a table of the agnostic dimensions
  (data, framework, project, browser, platform, resolution, user-preference/OS), what each
  means, which experience it lands in most, and the documented source. KEEP/strengthen.
- Four collapsible `<details>` sections — UX, DX, CX, MX — each a table:
  `Capability | What [that audience] gets | How it works (technical)` plus a
  "Proven by:" line citing real examples.
- A "Sources" footer listing the in-scope files used, plus a closing note that MX
  (and the ATO framing inside it) is the synthesized/management-facing domain.

Definitions taken verbatim from DHCP's feature matrix:
- UX = perceived performance, usability, accessibility, interaction stability.
- DX = maintainability, clarity, velocity, architectural durability.
- CX = risk reduction, cost efficiency, longevity, organizational flexibility.
- MX (Management Experience, "the prime") = NEW; not in the docs. Synthesized from the
  documented stakeholder / procurement-legal / security-compliance / government material.
  MX opens with TWO framing paragraphs — (1) the cross-stovepipe point and (2) the ATO
  point (both below) — then its capability table.

## ADDED THREADS IN v2 (keep them; they are well-grounded)

1. AGNOSTIC BY DESIGN — the one trait that makes one UI serve every audience. Each
   dimension is documented in-scope:
   - data → "Data-Agnostic UI" (DHCP feature matrix); UI built from each endpoint's JSON
     keys via `toTagName()`.
   - framework → "Framework-Optional Architecture" (DHCP matrix); "Bring them if you want"
     (starter); "cross-framework adaptable" (DHCP assets/css/STYLEGUIDE.md).
   - project → "One codebase. One UI. Infinite backends" (starter); the demo ecosystem.
   - browser → "any modern browser (Chrome, Edge, Firefox, Safari)" (DHCP README).
   - platform/host → "Any backend. Any language. Any platform" (starter); customer-overview
     (REST/GraphQL/file; Cloudflare/AWS).
   - resolution/device → "Responsive by default (no media queries unless needed)"
     (DHCP assets/css/README.md).
   - user-preference/OS → color-scheme.css (light/dark/high-contrast/forced-colors/
     reduced-transparency, driven by the user's system/browser preferences).
   NOTE: the single-sentence tagline "Data, framework, platform, resolution, and browser
   agnostic…" appears verbatim in the OUT-OF-SCOPE lineage repos (e.g. dragontheory/*);
   in-scope we ground each dimension separately, which is enough.

2. STANDALONE, DROP-IN, SINGLE-FEATURE CSS — each CSS file is one self-contained concern,
   copy/paste-able into any project, and each is wrapped in its OWN `@layer` so any
   unlayered author rule overrides it with no specificity fight. Grounded in:
   `color-scheme.css` header; DHCP `assets/css/README.md` ("organized via global
   functionality per file"); DHCP `assets/css/STYLEGUIDE.md` ("Plug-and-play override
   layering with no JS, no classes, and no markup mutation"); starter css/SKILL.md
   ("Each CSS feature is independent and copy-pastable"); SOUL.md ("CSS must remain
   copy/paste modular… through @layers and @scope"); CLAUDE.md Rule 29.

3. MX CROSS-STOVEPIPE + ATO (Authority to Operate) — the government management angle.
   - CROSS-STOVEPIPE: programs are usually stovepiped (each builds its own front and back
     end). Because the UI is data-/framework-/project-/platform-agnostic (it conforms to
     each program's own data structure), the METHOD of building web apps cuts ACROSS the
     stovepipes — carrying accessibility, usability, security, performance,
     interoperability, and scalability uniformly across the portfolio instead of rebuilt
     (and re-certified) per project. Grounded in the feature matrix (Data-Agnostic UI,
     Cross-Stack UI Reuse, Presentation/Data Decoupling) + customer-overview "designed for
     government."
   - ATO: every government system normally runs its own security review + control
     assessment + paperwork before go-live — slow, costly, repeated per project; management
     wants to stop repeating it. Because the D7460N front end is ONE SHARED resource with
     almost no JavaScript, zero third-party dependencies, and a strict CSP from day one, its
     security posture is identical everywhere it is used, so the UI layer's assessment
     EVIDENCE can be INHERITED/REUSED across programs (control inheritance / reciprocity)
     instead of re-derived. It does NOT grant a program its ATO; it shrinks and standardizes
     the front-end's share of the package. Implemented in v2 as: a second MX framing
     paragraph + the "Reusable security posture across ATOs" capability row.
   - HONESTY CAVEAT (must keep): the security/audit/dependency/CSP traits are DOCUMENTED
     (customer-overview "easier audits"; starter Security/compliance + Procurement/legal;
     SECURITY.md). The terms "ATO," "control inheritance," and "reciprocity" are the
     MANAGEMENT-FACING INTERPRETATION under the explicitly-synthesized MX domain — not taken
     verbatim from the repos. v2 marks this with an inline note in the row and a footer note.
     Do not present ATO as a documented architecture feature; keep the framing/caveat.

## RULES THE USER ENFORCES (hard)

- Do EXACTLY what is asked — no more, no less. Ask on ANY ambiguity; never guess.
- Read whole files; read from the GitHub repos, never local clones.
- NO checkmark-only cells — write real benefit explanations.
- Every cell traceable to a real documented statement; leave a cell blank rather than invent.
  Where a claim is a management-facing interpretation (e.g. ATO), label it as such.
- When adding a NEW kind of content the user wants to keep safe, COPY the file first
  (don't risk the known-good one) — the user explicitly works this way.
- Real examples to use: the autocss demo ecosystem (international.dance ballet
  studio w/ accounts+store+payments — the LIVE vanilla demo; plus the PLANNED psychiatrist
  practice on headless WordPress, Pokémon, Fairfax County / Virginia crime statistics, and
  Bible study products — a LATER iteration) and the DHCP management portal. NOTE (2026-07-01):
  the near-term remote-rendering phase builds React/Vue/Angular reference demos + the vanilla
  international.dance demo, NOT tied to products yet; WordPress/Joomla are dropped from that
  phase. See `REMOTE-RENDERING-DEMO-BUILD-PROMPT.md`.

## THE NEW WORK: THOR -> D7460N lineage (needs wider scope)

Confirmed fact (in-scope, citable): D7460N was formerly "THOR UI" — see DHCP/SECURITY.md
header "D7460N / THOR UI" and "implements the D7460N (THOR UI) architecture." ADD.md also
uses the "Thor's hammer / Mjölnir" metaphor against monolithic overkill.

These repos hold the precursor history and were NOT readable in prior sessions (scope).
This session MUST be created with them in scope. Read them and fold any worthwhile,
DOCUMENTED lineage/benefit material into the matrix (e.g., a short, sourced
"Lineage: from THOR to D7460N" note, and/or strengthen MX/CX with real precursor proof):

- dragontheory/THOR        (default branch is `master`, not main)
- dragontheory/THOR-STACKLESS, dragontheory/THOR-netlify
- dragontheory/D7460N
- D7460N/D7460N.dev        (has its own fuller ADD.md)
- dragontheory/D7460N-EMS  (2021 "Entity Management System — JAMstack, SPA, PWA,
                            Bring Your Own Data (BYOD)") — likely the earliest BYOD framing
- (optional) D7460N/D7460N.io, D7460N-ai/D7460N.ai, dragontheory/ID, international-dance/*

REQUIRED SCOPE for the new session (select all in the repo picker):
autocss-com/autocss (write target), dragontheory/THOR, dragontheory/THOR-STACKLESS,
dragontheory/THOR-netlify, dragontheory/D7460N, D7460N/D7460N.dev, dragontheory/D7460N-EMS,
d7460n/DHCP, d7460n/starter.

NOTE on access: "connected repos" in the GitHub app is account-level; a SESSION is scoped
to the repos chosen at creation and that scope is FIXED for the session's life. If any
required repo returns "not configured for this session," STOP and tell the user exactly
which one must be added to the session scope — do not work around it.

## ACCEPTANCE

- BENEFITS-MATRIX.md (stable) untouched unless told; BENEFITS-MATRIX-v2.md reads cleanly
  by domain (UX/DX/CX/MX) with the plain-language section, the Agnostic-by-design thread,
  the standalone-CSS row, and the MX cross-stovepipe + ATO framing (with its honesty
  caveat) all intact.
- Any THOR/lineage additions are short, true, and cite the exact source repo/file.
- Nothing invented; blanks over guesses; management-facing interpretations labeled as such.
  Commit to claude/lucid-hawking-E5Ej2; never main; no PR unless asked. Do not put the
  model id in committed files.

## BACKGROUND CONTEXT (why this exists)

- The D7460N Architecture is zero-dependency, CSS-replaces-JS, browser-native, SPA + PWA.
  HTML = structure (semantic only; no div/span/class/id/data-*), CSS = all UI behavior/state,
  JS = data transport (CRUD) only via `oninput`. One `index.html`, Holy Grail CSS Grid.
- Goal of the matrix: let any reader — end user, developer, customer, or program
  management/prime — quickly find how the architecture benefits THEM, backed by real
  documented examples, so they can decide whether to adopt it.
- Deliverable history (context; do not undo): the matrix started appended to README.md,
  was corrected off a checkmark layout, moved to its own file, reframed around the
  UX/DX/CX/MX experience domains, gained a plain-language section and the MX cross-stovepipe
  lead row, then the v2 copy added the agnostic-by-design thread, the standalone-CSS row,
  and the MX ATO / reusable-security-posture framing.
