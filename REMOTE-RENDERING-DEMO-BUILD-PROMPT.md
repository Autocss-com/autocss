# BUILD PROMPT — AutoCSS Remote-Rendering Demo Phase (4 demos — 1 vanilla + 3 frameworks)

> **NEXT-SESSION HANDOFF. Written 2026-07-01 on branch `claude/autocss-remote-rendering-demo-kueqca`.**
> This is the SINGLE authoritative build prompt for the remote-rendering demo phase. It absorbed and
> REPLACED the old `CDN-PHASE-BUILD-PROMPT.md` (retired 2026-07-01: its still-true thesis is folded
> into §11 below; its stale "CDN" framing is dropped — AutoCSS stays at `https://autocss.com`, §1).
> On any conflict, **this file + `PROGRESS.json` (`meta.future_goals`) win**, and `CLAUDE.md` remains
> canonical over everything.

---

## 0. READ FIRST, IN THIS ORDER (non-negotiable, per CLAUDE.md + prior handoffs)
1. `CLAUDE.md` — canonical D7460N architecture rules (still the target).
2. `SESSION-HANDOFF.md` — prior Constraint Lock; re-assert it.
3. `PROGRESS.json` — read `meta`, `cursor`, `meta.future_goals` (the **DEMO ECOSYSTEM** entry —
   RESCOPED 2026-07-01 — already LEADS with THIS phase's direction: 4 demos, framework demos NOT tied
   to products yet, WordPress/Joomla dropped; the older product↔back-end mapping is preserved there
   only as the DEFERRED later iteration), `meta.demo_data_sources` (deferred products),
   `meta.board_tracking` (board label rules), and `open_q`.
4. `progress/log-001.ndjson` — append-only memory shard; read IN FULL, esp. the 2026-06-25 AND
   2026-07-01 records (the 2026-07-01 rescope + board-tracking lessons).
5. This file (esp. **§11** — the "why it works" thesis + linchpin, folded in from the retired CDN prompt).

**Branch facts (updated 2026-07-01):** `claude/lucid-hawking-E5Ej2` — which carried all AutoCSS
work + memory — was PROMOTED TO `main` on 2026-07-01 (PR #2, `90a6a8b`), and the demo-phase docs +
memory were then reconciled to this phase's direction across PRs #43–#50. The canonical work + memory
now live on **`main`** (this prompt included). For future demo work, **branch off the latest `main`.**
**Never DIRECT-push to `main` — it is branch-protected; promote via a PR merge.** Do NOT touch
`ORIGINAL-PROMPT.md`; `CLAUDE.md` is canonical — edit it ONLY when the user explicitly authorizes it.

---

## 1. WHAT THIS PHASE IS (the goal, in the user's words)
Demo AutoCSS's ability to be **called remotely as a resource — like a font or an image — from any
data-layer back-end**, to render the data those back-ends supply. **Have UI, bring your own data
(BYOD). One UI, many back-ends.** AutoCSS is the ONE zero-dependency, browser-native HTML+CSS UI;
each back-end is an interchangeable **data layer** that supplies only DATA. AutoCSS cares about
exactly one thing: **when data shows up in the user-agent** (it watches via `:has()`, `:empty`,
etc. and renders reactively). See **§11** for the full thesis and why this is even possible.

**Naming clarification from the user (2026-07-01):** it was called the "CDN phase" only because the
user first considered moving AutoCSS to a CDN. **That is dropped for now. For simplicity, AutoCSS
STAYS WHERE IT IS** — served from **`https://autocss.com`** (GitHub Pages, repo `autocss-com/autocss`).
Back-ends reference it remotely at `https://autocss.com/assets/css/*.css` and
`https://autocss.com/assets/js/app.js` (see §6 for the exact asset list).

---

## 2. THE DEMOS (user-updated 2026-07-01)
**4 demos total:**
- **1 vanilla AutoCSS demo — International.dance** (repo `autocss-com/vanilla`; the current AutoCSS
  architecture as-is, serving the International.dance content).
- **3 framework demos — React, Vue, Angular** (repos `autocss-com/react`, `autocss-com/vue`,
  `autocss-com/angular`).

### Only the 3 frameworks this phase (user-confirmed 2026-07-01)
> "We are now just doing the 3 frameworks because the others need additional setup than github.com
> alone can handle."

**WordPress + Joomla are DROPPED from this phase.** They are PHP+DB server apps that need more setup
than GitHub (Pages) alone can host, so they are out of scope for now — do NOT build them this phase.

### Framing decision (user-confirmed 2026-07-01): the frameworks are NOT tied to a product yet.
> "We will not tie the frameworks to a product yet." · "These will eventually be real products, but I
> want to do this iteratively."

So for THIS stage each framework repo is a **standard/idiomatic instance of that framework** that (a)
demonstrates how it exposes/renders data and (b) serves as a **developer reference for how to call
AutoCSS remotely**. **No product is assigned to any framework demo yet** — assigning real products is
a LATER iteration. (The vanilla demo is the one exception: it serves International.dance.)

### Sequence (user-confirmed 2026-07-01): back-ends FIRST, AutoCSS SECOND.
> "Let's get the back-end data-layers installed into each repo I just created and working using
> github pages, first. … Then we can attach autocss."

**Step 1 of the phase = get each framework data-layer standing up and RENDERING on GitHub Pages.**
**Step 2 = attach AutoCSS (wire the remote UI to the back-end's data).** Do NOT attach AutoCSS until
the back-end renders on Pages.

---

## 3. THE REPOS (⚠️ SCOPE — this is WHY we handed off to a new session)
The user **has already created** the 4 demo repos. In the 2026-07-01 session Claude's GitHub
access was scoped to only `d7460n/starter`, `d7460n/dhcp`, `autocss-com/autocss`, so Claude **could
not see or push to the new repos** — hence this handoff. Per prior memory: **the USER creates +
maintains org repos; Claude is repo-scoped and cannot create them.**

**EXACT REPO NAMES (user-provided 2026-07-01 — plain names, NOT `autocss-<backend>`):**
- **The vanilla demo:** `autocss-com/vanilla` — the AutoCSS vanilla instance for **International.dance**.
- **The 3 framework demos:** `autocss-com/react`, `autocss-com/vue`, `autocss-com/angular`.

**FIRST ACTIONS NEXT SESSION:**
1. **Confirm the 4 demo repos are in this session's GitHub scope** (`autocss-com/vanilla`,
   `autocss-com/react`, `autocss-com/vue`, `autocss-com/angular`). In the 2026-07-01 session Claude's
   scope was still only `d7460n/starter`, `d7460n/dhcp`, `autocss-com/autocss` — so verify the new
   repos are reachable. If they are NOT in scope, STOP and tell the user; nothing can be written to
   them until they are.
2. Confirm which branch to work on inside each repo (default: a feature branch, never `main`; confirm
   the exact branch name the user wants — mirror the D7460N "never main" rule).

---

## 4. ⚠️ TECHNICAL REALITY — GitHub Pages is STATIC-ONLY (this is WHY it's just the 3 frameworks)
GitHub Pages serves static files only. **No PHP, no MySQL, no server runtime.**

- **Angular / Vue / React** — OK on Pages. They compile to static assets. Use a **GitHub Actions
  workflow** (`npm ci` → framework build → deploy `dist/`/`build/` to Pages via
  `actions/deploy-pages`). This is the sanctioned "use GitHub features to render each." These are the
  deliberately "over-engineered" data-layer stacks AutoCSS drops into — **their own build tooling
  (npm/node/bundlers) is fine and expected; AutoCSS's zero-dep rule applies ONLY to AutoCSS itself,
  NOT to these back-ends.**
- **WordPress / Joomla** — ❌ cannot run on Pages (both are PHP+DB server apps). They need more setup
  than GitHub alone can host, which is exactly why they are **DROPPED from this phase** (§2). Not
  built here.

---

## 5. DECISIONS ALREADY LOCKED vs STILL OPEN

### Locked (2026-07-01):
- Keep AutoCSS at `https://autocss.com` (no separate CDN move for now).
- **4 demos total: 1 vanilla AutoCSS demo (International.dance) + 3 framework demos — React, Vue,
  Angular** (repos `autocss-com/vanilla`, `.../react`, `.../vue`, `.../angular`).
- **WordPress + Joomla DROPPED this phase** — they need more setup than GitHub Pages alone can host.
- Framework demos are NOT tied to a product yet; assigning real products is a later iteration.
- Order: back-ends render on Pages first, THEN attach AutoCSS.
- React/Vue/Angular → build via GitHub Actions → deploy to Pages.

### Still OPEN — LOCK WITH THE USER before/at the relevant step:
1. **Pacing** → recommend proving ONE framework repo end-to-end on Pages first (React, Vue, or
   Angular — pick one), then replicate to the other two. Confirm.
2. **Delivery mechanism (when attaching AutoCSS)** → the 2026-06-25 memory CONFIRMED a **light-DOM web
   component (NOT iframe)**; the alternative is plain `<link>` + `<script type=module>` (host-included
   skeleton). Re-confirm which for this phase before wiring AutoCSS.
3. **HTML skeleton delivery** → host hand-includes the Holy-Grail markup vs. fetch-as-text (never
   string-build HTML in JS — violates CLAUDE.md).
4. **Versioning + integrity** → URL pinning, long-cache, SRI hashes, CORS posture for cross-origin data.
5. **Theming per host** → which `color-theme-*.css`; optionally demo a host re-skin via its own
   unlayered CSS (the `@layer` deconfliction, live).
6. **Data contract doc** → the JSON shape each back-end MUST return (see §6).
7. **Data per framework demo** → use generic/sample data; the framework demos are NOT tied to
   products yet (real products = later iteration). The vanilla demo uses International.dance content.

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

(The vanilla International.dance demo is the existing AutoCSS instance serving its own content — no
framework build step; it is the baseline the 3 framework demos are compared against.)

---

## 8. CADENCE / HARD RULES (carry from CLAUDE.md + SESSION-HANDOFF — still apply)
- ONE slice at a time. **Stop and ask on ANY doubt; never guess; the user is the arbiter.**
- Do only what the user asks — no more, no less. Adding code adds entropy.
- Test ONLY via the REAL trigger in a REAL browser (Playwright chromium at `/opt/pw-browsers`,
  `NODE_PATH=/opt/node22/lib/node_modules`, `ignoreHTTPSErrors: true`; serve + test in ONE
  foreground node process because this env kills backgrounded servers). Never assert behavior from
  reading code.
- Session-end ritual: commit → update `PROGRESS.json` cursor → append to `progress/log-001.ndjson`
  (append-only; never edit past records) → update `SESSION-HANDOFF.md`. Reconcile GitHub Issues as a
  one-way mirror if the board is available (skip silently if not). Board columns are LABEL-DRIVEN +
  MUTUALLY EXCLUSIVE: Backlog = `backlog` only, In Progress = `in-progress` only (REMOVE `backlog`),
  Done = Issue closed; `demo` is an orthogonal grouping tag. See CLAUDE.md "Issue / Project-Board
  Tracking" + `PROGRESS.json` `meta.board_tracking`.
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
- In the 2026-07-01 sessions the demo-phase docs + memory were reconciled to this direction
  (`PROGRESS.json`, `README.md`, the `CLAUDE.md` board rule, this prompt; Issues #5/#33-#41 + board).
  NO back-end code was written and the 4 demo repos were NOT yet in GitHub scope — confirm that first.

---

## 10. FIRST ACTIONS NEXT SESSION (checklist)
1. Do the §0 reading; re-assert the Constraint Lock.
2. Confirm the **4 demo repos** (`autocss-com/vanilla`, `autocss-com/react`, `autocss-com/vue`,
   `autocss-com/angular`) are in this session's GitHub scope (§3). If not in scope → STOP + tell the
   user. (WordPress/Joomla are dropped from this phase — ignore.)
3. Check the available-skills list for **`caveman`** (§9); apply it if present, else tell the user.
4. Lock the **pacing** decision (§5): pick ONE framework to prove end-to-end first, then replicate.
5. Build that **one** framework back-end end-to-end onto GitHub Pages via GitHub Actions (Stage 1 =
   renders its own data-layer, no AutoCSS yet), check in with the user, then replicate to the other
   two. Attach AutoCSS (Stage 2) only AFTER the back-end renders on Pages.

---

## 11. WHY IT WORKS — THESIS & LINCHPIN (folded in from the retired CDN prompt)
> This section absorbs the still-true conceptual "why" from the old `CDN-PHASE-BUILD-PROMPT.md`,
> retired 2026-07-01 so there is ONE build prompt. The CDN framing itself is dropped (AutoCSS stays
> at `https://autocss.com`, §1); only the rationale that remains true is kept here.

**Thesis to prove:** fully decoupled / declarative-first / browser-first **interoperates with
everything AND is simpler / faster / smaller / cheaper / more performant** than the over-engineered
stacks it drops into — and ALSO **more standard, accessible, usable, scalable, and secure**, because
it offloads essentially all JavaScript down to a single `oninput` event (a smaller JS surface = a
smaller attack surface).

**Why this is even possible (the linchpin — already built):**
1. AutoCSS uses modern CSS (`:has()`, `:empty`, …) to watch, in real time, for the data a data-layer
   delivers to the user-agent, and reacts declaratively.
2. CLAUDE.md Rule 29: every AutoCSS stylesheet lives in a named `@layer`, and the `<link>` order in
   `index.html` IS the cascade order — deliberately keeping AutoCSS priority LOW. It styles everything
   by default, yet **any unlayered style the host writes wins by default**, with no `!important` and
   no specificity fight. That pre-emptive deconfliction is exactly what lets the UI drop into any host
   and be re-skinned by it.

**The boundary (separation of concerns = the product):**
- **AutoCSS provides** (presentation + behavior, NO app data): the HTML skeleton — one `index.html`,
  full-bleed Holy Grail, tabs-architecture nav, checkbox/radio `<input>` state machines — plus the
  `@layer` CSS stack and the JS runtime (`api` / `oninput` / `storage` / `app`).
- **The host provides** (data only): the API base URL + endpoint suffixes; optionally which
  `color-theme-*.css` to link, and its own override CSS.
- The single config knob already exists: **API base declared once; only the endpoint suffix varies**
  (`shell`, `home`, `products`, …). The host fills that in.
- The UI stays data-free: it carries structure/behavior/style, never the host's data — yet it handles
  ALL user interaction (no events except the single `oninput`) and ALL data states, including loading
  states, itself, in HTML+CSS.
