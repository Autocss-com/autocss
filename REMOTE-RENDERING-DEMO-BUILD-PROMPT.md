# BUILD PROMPT — AutoCSS Remote-Rendering Demo Phase (5 back-end data-layers)

> **NEXT-SESSION HANDOFF. Written 2026-07-01 on branch `claude/autocss-remote-rendering-demo-kueqca`.**
> This prompt REFOCUSES (does not delete) `CDN-PHASE-BUILD-PROMPT.md`. That older file
> is marked "PRELIMINARY DRAFT" and is now partly stale; where the two disagree, **THIS
> file + `PROGRESS.json` (`meta.future_goals`, dated 2026-06-25) win.** `CLAUDE.md`
> remains canonical over everything.

---

## 0. READ FIRST, IN THIS ORDER (non-negotiable, per CLAUDE.md + prior handoffs)
1. `CLAUDE.md` — canonical D7460N architecture rules (still the target).
2. `SESSION-HANDOFF.md` — prior Constraint Lock; re-assert it.
3. `PROGRESS.json` — read `meta`, `cursor`, `meta.future_goals` (esp. the **DEMO ECOSYSTEM**
   entry dated 2026-06-25 — it is the authoritative product/back-end mapping), and `open_q`.
4. `progress/log-001.ndjson` — append-only memory shard; read IN FULL, esp. all 2026-06-25 records.
5. This file.
6. `CDN-PHASE-BUILD-PROMPT.md` — background on the "UI as a service" thesis (advisory; some parts stale).

**Branch facts (updated 2026-07-01):** `claude/lucid-hawking-E5Ej2` — which carried all AutoCSS
work + memory — was PROMOTED TO `main` on 2026-07-01 (PR #2, merge commit `90a6a8b`; PR #43 then
recorded the promotion in the memory files). So the canonical work + memory now live on **`main`**.
This demo-phase branch `claude/autocss-remote-rendering-demo-kueqca` was cut from the old
`lucid-hawking` tip (`783709c`, now contained in `main`) and adds only this build prompt; it does
NOT yet carry PR #43's memory updates that landed on `main`. For future demo work, **branch off the
latest `main`.** **Never DIRECT-push to `main` — it is branch-protected; promote via a PR merge.**
Do NOT touch `CLAUDE.md` or `ORIGINAL-PROMPT.md`.

---

## 1. WHAT THIS PHASE IS (the goal, in the user's words)
Demo AutoCSS's ability to be **called remotely as a resource — like a font or an image — from any
data-layer back-end**, to render the data those back-ends supply. **Have UI, bring your own data
(BYOD). One UI, many back-ends.** AutoCSS is the ONE zero-dependency, browser-native HTML+CSS UI;
each back-end is an interchangeable **data layer** that supplies only DATA. AutoCSS cares about
exactly one thing: **when data shows up in the user-agent** (it watches via `:has()`, `:empty`,
etc. and renders reactively).

**Naming clarification from the user (2026-07-01):** it was called the "CDN phase" only because the
user first considered moving AutoCSS to a CDN. **That is dropped for now. For simplicity, AutoCSS
STAYS WHERE IT IS** — served from **`https://autocss.com`** (GitHub Pages, repo `autocss-com/autocss`).
Back-ends reference it remotely at `https://autocss.com/assets/css/*.css` and
`https://autocss.com/assets/js/app.js` (see §6 for the exact asset list).

---

## 2. THE BACK-ENDS (user-updated 2026-07-01)
Full set (5): Angular, Vue, React, WordPress, Joomla. **This DROPS Drupal and SharePoint from the
earlier "reserved" list and ADDS Joomla.**

### ⭐ ACTIVE NOW (user-confirmed 2026-07-01): **JUST THE 3 FRAMEWORKS — React, Vue, Angular.**
> "Let's drop wordpress and joomla for now. Just the frameworks."

**WordPress + Joomla are DEFERRED to a later iteration.** Their repos exist (`autocss-com/wordpress`,
`autocss-com/joomla`) but do NOT build them this phase. IMPORTANT CONSEQUENCE: the "GitHub Pages
can't run PHP" decision (§4, options A/B/C) **no longer blocks the current work** — it only matters
when WP/Joomla come back. So the active path is clean: all three frameworks build to static and
deploy to Pages via GitHub Actions.

- The user's 2026-06-25 real-product → back-end mapping (in `PROGRESS.json`) was:
  WordPress→psychiatrist, Vue→Pokémon, Angular→crime-stats, React→Bible-study; Joomla was reserved.
  (Products are a LATER iteration — see the framing decision below.)

### Framing decision (user-confirmed 2026-07-01): ITERATIVE. Framework-reference demos NOW; real products LATER.
> "These will eventually be real products, but I want to do this iteratively."

So for THIS stage each repo is a **standard/idiomatic instance of that framework/CMS** that (a)
demonstrates how it exposes/renders data and (b) serves as a **developer reference for how to call
AutoCSS remotely**. Distinct real products (and the Joomla product) are a LATER iteration, not now.

### Sequence (user-confirmed 2026-07-01): back-ends FIRST, AutoCSS SECOND.
> "Let's get the back-end data-layers installed into each repo I just created and working using
> github pages, first. … Then we can attach autocss."

**Step 1 of the phase = get each back-end data-layer standing up and RENDERING on GitHub Pages.**
**Step 2 = attach AutoCSS (wire the remote UI to the back-end's data).** Do NOT attach AutoCSS until
the back-end renders on Pages.

---

## 3. THE REPOS (⚠️ SCOPE — this is WHY we handed off to a new session)
The user **has already created** the 5 repos. In the 2026-07-01 session Claude's GitHub access was
scoped to only `d7460n/starter`, `d7460n/dhcp`, `autocss-com/autocss`, so Claude **could not see or
push to the new repos** — hence this handoff. Per prior memory: **the USER creates + maintains org
repos; Claude is repo-scoped and cannot create them.**

**EXACT REPO NAMES (user-provided 2026-07-01 — plain names, NOT `autocss-<backend>`):**
- **Active now:** `autocss-com/react`, `autocss-com/vue`, `autocss-com/angular`
- **Deferred:** `autocss-com/wordpress`, `autocss-com/joomla`

**FIRST ACTIONS NEXT SESSION:**
1. **Confirm the 3 active repos are in this session's GitHub scope** (`autocss-com/react`,
   `autocss-com/vue`, `autocss-com/angular`). In the 2026-07-01 session Claude's scope was still only
   `d7460n/starter`, `d7460n/dhcp`, `autocss-com/autocss` — so verify the new repos are reachable. If
   they are NOT in scope, STOP and tell the user; nothing can be written to them until they are.
2. Confirm which branch to work on inside each repo (default: a feature branch, never `main`; confirm
   the exact branch name the user wants — mirror the D7460N "never main" rule).

---

## 4. ⚠️ HARD TECHNICAL REALITY — GitHub Pages is STATIC-ONLY (DEFERRED: only affects WP/Joomla)
> **NOTE (2026-07-01): WordPress + Joomla are DEFERRED (§2), so this section does NOT block the
> current 3-framework work. Keep it here for when WP/Joomla resume.**

GitHub Pages serves static files only. **No PHP, no MySQL, no server runtime.**

- **Angular / Vue / React** — OK on Pages. They compile to static assets. Use a **GitHub Actions
  workflow** (`npm ci` → framework build → deploy `dist/`/`build/` to Pages via
  `actions/deploy-pages`). This is the sanctioned "use GitHub features to render each." These are the
  deliberately "over-engineered" data-layer stacks AutoCSS drops into — **their own build tooling
  (npm/node/bundlers) is fine and expected; AutoCSS's zero-dep rule applies ONLY to AutoCSS itself,
  NOT to these back-ends.**
- **WordPress / Joomla** — ❌ **cannot run as a live install on Pages** (both are PHP+DB server apps).
  A decision is REQUIRED before building these two. Present these options and LOCK one WITH the user
  (do not guess):
  - **(A) Emulate the CMS as static JSON [RECOMMENDED].** Commit static files that mimic each CMS's
    real REST API shape — WordPress `/wp-json/wp/v2/…`, Joomla `/api/index.php/v1/…` — served from
    Pages, plus a small static front page. Faithfully demos "how a WordPress/Joomla data-layer
    exposes data to AutoCSS," and is the only option that actually runs on Pages. Fits the current
    framework-reference framing.
  - **(B) Host a real WP/Joomla elsewhere** (PHP host / container / wordpress.com) and point the demo
    at it via CORS. Not Pages; a live server the user maintains.
  - **(C) Static-export a real site** (WordPress: Simply Static / WP2Static; Joomla equivalent).
    Requires a live CMS to export FROM — which contradicts "can't run locally."

---

## 5. DECISIONS ALREADY LOCKED vs STILL OPEN

### Locked (2026-07-01):
- Keep AutoCSS at `https://autocss.com` (no separate CDN move for now).
- **ACTIVE back-ends this phase = React, Vue, Angular only** (repos `autocss-com/react`, `.../vue`,
  `.../angular`). **WordPress + Joomla DEFERRED** (repos `autocss-com/wordpress`, `.../joomla` exist,
  left untouched for now).
- Framework-reference demos now; real products later; iterative.
- Order: back-ends render on Pages first, THEN attach AutoCSS.
- React/Vue/Angular → build via GitHub Actions → deploy to Pages.

### Still OPEN — LOCK WITH THE USER before/at the relevant step (CDN prompt's "Decisions to LOCK"):
1. **WP/Joomla on Pages** → choose A / B / C (see §4). **DEFERRED — only when WP/Joomla resume; does
   not block current work.**
2. **Pacing** → recommend proving ONE framework repo end-to-end on Pages first (React, Vue, or
   Angular — pick one), then replicate to the other two. Confirm.
3. **Delivery mechanism (when attaching AutoCSS)** → the 2026-06-25 memory CONFIRMED a **light-DOM web
   component (NOT iframe)**; the older CDN prompt "recommended" plain `<link>` + `<script type=module>`
   (Option A). Re-confirm which for this phase before wiring AutoCSS.
4. **HTML skeleton delivery** → host hand-includes the Holy-Grail markup vs. fetch-as-text (never
   string-build HTML in JS — violates CLAUDE.md).
5. **Versioning + integrity** → URL pinning, long-cache, SRI hashes, CORS posture for cross-origin data.
6. **Theming per host** → which `color-theme-*.css`; optionally demo a host re-skin via its own
   unlayered CSS (the `@layer` deconfliction, live).
7. **Data contract doc** → the JSON shape each back-end MUST return (see §6).
8. **Data per demo (later iteration)** → real products: WordPress→psychiatrist, Vue→Pokémon,
   Angular→crime-stats, React→Bible-study, Joomla→**TBD (ask the user)**. Not needed for the
   framework-reference stage.

---

## 6. THE DATA CONTRACT (what each back-end must feed AutoCSS)
AutoCSS renders **everything from JSON** — the `<h1>` title, intro `<p>`, column-header labels, table
rows, and per-record form fields are ALL sourced from the endpoint response; nothing is hardcoded.
The only code-level invariant is the `toTagName()` transform (JSON keys → custom-element tag names;
JSON values injected as content). Study these in the `autocss` repo to document the exact shape:
- `assets/js/api.js` — one API base declared once; only the **endpoint suffix** varies
  (`shell`, `home`, `products`, …). The host fills in base + suffixes.
- `assets/js/inject.js` — `toTagName()`, row/field generation, header row, page-content injection.
- `assets/js/schema.js`, `assets/js/rules.js` — data shaping + field rules.
- `tests/` (data-shaping tests) — the concrete contract examples.
Deliverable for this phase: a short **"API the host implements"** doc (JSON shape + example) each
back-end conforms to. Each back-end's job is simply to RETURN that JSON at its endpoint suffixes.

**Remote asset list to reference from a host** (from `index.html`, order = the `@layer` cascade;
keep AutoCSS priority LOW so host overrides win for free):
`reset.css, fonts.css, color-scheme.css, color-theme-66ccff.css, themes.css, layout.css,
transitions.css, inputs.css, media.css, typography.css, scrolling.css, a11y.css, forms.css,
fallbacks.css, loading.css` (all under `https://autocss.com/assets/css/`) and the module
`https://autocss.com/assets/js/app.js`.

---

## 7. DEFINITION OF DONE (this phase, per-repo)
**Stage 1 (now):** the back-end repo builds/deploys on GitHub Pages and renders its own data-layer
(framework-reference instance) at its Pages URL — no AutoCSS yet.
**Stage 2 (after):** the same host page links the remote AutoCSS UI from `https://autocss.com` and
points at its OWN data; the full AutoCSS UI renders the host's data; the host's own **unlayered** CSS
overrides an AutoCSS rule with **no `!important`** (deconfliction demonstrated). Same AutoCSS bundle,
swap the data → same UI.

---

## 8. CADENCE / HARD RULES (carry from CLAUDE.md + SESSION-HANDOFF — still apply)
- ONE slice at a time. **Stop and ask on ANY doubt; never guess; the user is the arbiter.**
- Do only what the user asks — no more, no less. Adding code adds entropy.
- Test ONLY via the REAL trigger in a REAL browser (Playwright chromium at `/opt/pw-browsers`,
  `NODE_PATH=/opt/node22/lib/node_modules`, `ignoreHTTPSErrors: true`; serve + test in ONE
  foreground node process because this env kills backgrounded servers). Never assert behavior from
  reading code.
- Session-end ritual: commit → update `PROGRESS.json` cursor → append to `progress/log-001.ndjson`
  (append-only; never edit past records) → update `SESSION-HANDOFF.md`. Reconcile GitHub Issues
  (label `backlog`/`demo`) as a one-way mirror if the board is available; skip silently if not.
- External-service failures: STOP and advise the user; NEVER add fallbacks/mock redirects/architecture
  workarounds (CLAUDE.md "External Service Issues").
- Consult advisory refs (`modern-web-guidance`, MDN MCP) per Rule 33; repo docs win on conflict;
  identify ≠ apply (confirm before changing anything).

---

## 9. OUTSTANDING / ADMIN
- **"Caveman" skill:** the user re-uploaded it late in the 2026-07-01 session ("Uploaded the caveman
  skill maybe you will pick that up next session also"). It was NOT yet visible in the 2026-07-01
  session's skills list. **Next session: check the available-skills list for `caveman`; if present,
  apply it for the session per the user's standing request ("until told otherwise").** If still
  absent, tell the user.
- Nothing was changed in `autocss-com/autocss` this session except adding/refining this file. No
  back-end code was written (the new repos were not in this session's GitHub scope).

---

## 10. FIRST ACTIONS NEXT SESSION (checklist)
1. Do the §0 reading; re-assert the Constraint Lock.
2. Confirm the **3 active repos** (`autocss-com/react`, `autocss-com/vue`, `autocss-com/angular`) are
   in this session's GitHub scope (§3). If not in scope → STOP + tell the user. (WordPress/Joomla are
   deferred — ignore for now.)
3. Check the available-skills list for **`caveman`** (§9); apply it if present, else tell the user.
4. Lock the **pacing** decision (§5.2): pick ONE framework to prove end-to-end first, then replicate.
5. Build that **one** framework back-end end-to-end onto GitHub Pages via GitHub Actions (Stage 1 =
   renders its own data-layer, no AutoCSS yet), check in with the user, then replicate to the other
   two. Attach AutoCSS (Stage 2) only AFTER the back-end renders on Pages.
