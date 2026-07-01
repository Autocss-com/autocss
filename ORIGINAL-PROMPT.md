EXECUTE THIS PLAN. It is the complete spec from prior planning (that context did
not carry into this fresh session). Access is now resolved: all three repos
(starter, DHCP, autocss) are in scope and you have push access to autocss. Begin
at the Build order, step 1, on branch claude/lucid-hawking-E5Ej2 (create from
main). Stop and ask me on ANY doubt. Check in before your FIRST push and after
each numbered step. Do NOT drop anything from this spec.

================================ PLAN / SPEC ================================

# Plan/Spec: build `autocss` = refined completion of `starter`

## Goal
Produce, in repo `github.com/Autocss-com/autocss`, the refined/completed version
of `starter`. Measuring stick: the finished app must **look, behave, and work
like `dhcp`** -- because `dhcp` is the working prototype we are reproducing
correctly. We change nothing except to **improve to the D7460N Architecture**.
Separate repo only so the two originals are never touched.

## Roles of the three repos
- `starter` = the D7460N-correct **rewrite** of `dhcp`; CSS-driven visibility
  (display:none -> grid on data) is DONE; it is just **incomplete**.
- `dhcp` = messy-but-complete **working prototype**; the FEATURE + LOOK reference.
- `autocss` = best-of-both: starter's architecture, completed using dhcp as the
  target, every feature rewritten to D7460N. Result *tends* smaller than dhcp.

## Size rule
Smaller = guideline, NOT a hard rule. D7460N compliance may need more/older-school
code; that's fine. If autocss ends up larger than dhcp, I must explain why.

## Per-feature decision heuristic (the core method)
DEFAULT = **KEEP & MODERNIZE.** Dropping is a rare exception, never the
fall-through branch. For each HTML/CSS/JS feature, do NOT ask "which file is
shorter." Ask:
1. What does this feature do (HTML + its companion CSS + companion JS together)?
   Track all partners -- companion tracking is mandatory and never forgotten.
2. **Is there a MORE MODERN native HTML/CSS way to do this than the prior
   hand-rolled version?** THIS is what the user means by "efficient" -- NOT
   smaller, but "check that there isn't a newer/cleaner standards-native solution
   than how I did it before." Do this for EVERY feature.
   - Finding a more modern way is **NEVER license to change it.** If I find a
     better HTML-markup/CSS approach I MUST **STOP and ASK the user FIRST**,
     every time, before altering any markup or CSS -- regardless of whether the
     change is behavior-neutral. Identifying the modern option and applying it
     are two separate steps; the user authorizes the second one each time.
   - If NO modern improvement exists -> keep the existing approach unchanged.
   - Worked example (settled, per user): when the viewport is wide enough AND
     `<aside>` is visible, `<main>` and `<aside>` become user-resizable. User did
     this before via CSS `resize`; the exact mechanism is unsettled ("not sure
     how that's going to work yet... there may be a more modern solution than what
     I did before"). So: inspect the prior version, evaluate modern options, then
     **ask the user before reimplementing.** This is the TEMPLATE for every
     feature: inspect -> find modern option -> ASK -> only then change.
3. Will the universal "one UI to rule them all" app ever need that capability?
   - YES (the overwhelming default) -> KEEP it, with its companion CSS and JS.
   - Only if a feature looks genuinely DROPPABLE (truly redundant / a duplicate
     capability) -> **STOP and confirm with the user before dropping anything.**
     Never drop silently; the user double-checks every drop.

### Partial / incomplete features (per user -- critical)
The user has LIKELY started features in either repo that aren't finished yet (the
resizable main/aside is a probable example). So before treating anything as
droppable I MUST:
- INSPECT the feature (and its companions) to judge whether it's complete,
  partial, or abandoned -- I need the ability to inspect partial features.
- Default to the OPTION TO COMPLETE it (finished the modern way), NOT drop it.
- Only raise "drop?" to the user if, after inspection, it's truly redundant.
Better to ask than to delete something half-built that was meant to ship.

Earlier example, restated under the corrected rule: dhcp `<nav>` has extra HTML
for conditional vertical dropdown sections. A universal app needs dropdowns ->
KEEP that nav HTML **and** its `@container`/`:has()` menu CSS, modernizing the
mechanism if a newer native approach exists.

## HTML reality (per user)
- **True SPA, no routing.** One page shows ONE page at a time. All layout and
  features live inside a SINGLE parent wrapper scaffold with minimal nesting, as
  laid out in `index.html`. There is no router and no multi-page markup.
- The HTML holds **one of everything** (one nav, one article, one form, one row
  template...) until data-level granularity.
- Elements are present by default but unused until filled; e.g. `<details>` is
  `display:none` until it has content. Visibility is data-driven (already built
  in starter). Do not re-invent this.

## Scope reality (per user) -- dhcp is an MVP, not the finish line
- `dhcp` is just an MVP; there is much more to do beyond it. The feature/look
  reference is a floor, not a ceiling -- do not treat dhcp's current feature set
  as the complete target.
- **Future recurring feature: dismissable modal-like admin panels.** Admin panels
  (and similar dismissable modal windows) will appear ALL OVER the app, built on
  the new native browser CSS/HTML API for dismissable surfaces (Popover API /
  `<dialog>` -- CSS-driven, light-dismiss, NO JS event handlers, per D7460N).
  This is NOT yet present in either `starter` or `dhcp`. Don't build it now, but
  keep the universal scaffold + companion-tracking ready to host it cleanly when
  it lands (e.g. the "will a universal app ever need this?" heuristic = YES).

## D7460N compliance (improve dhcp's implementation, keep its behavior)
Rewrite forbidden dhcp patterns while preserving identical behavior/look:
- CRUD triggers via `oninput` on state-machine `<input>`s ONLY. Remove every
  `.onchange`/`.onclick`/`addEventListener`/`dispatchEvent`/dynamic `import()`.
- No `data-*`: drive dirty/valid/enabled purely via CSS `:has(:valid)`,
  `:has(:invalid)`, `:checked`, `:empty`/`:not(:empty)`, `aria-disabled`.
- JSON -> elements via `toTagName()` is allowed (sanctioned in CLAUDE.md); drop
  `innerHTML` string-building. JS stays stateless/idempotent. One API base.

### JS authoring conventions (per user -- governs every rewrite)
- **`oninput` is the only bridge to the UI -- but NOT limited to user actions.**
  `oninput` on state-machine `<input>`s is JS's single connection to the UI, yet
  it is fired BOTH by user interaction AND programmatically by the runtime (e.g.
  dhcp invokes it on page load to fetch initial data -- the same lifecycle path,
  triggered by code, not a person). Matches CLAUDE.md: "initial page load MUST
  enter the same `oninput` lifecycle path." NEVER `click`/`change`/
  `addEventListener`/any other handler -- the only entry point is `oninput`.
- **JS is CRUD-only.** Its only job is API transport (create/read/update/delete).
  It never owns UI state, visibility, or presentation -- CSS does, data-driven.
- **Markup stays clean.** No inline CSS, no JS in HTML, no `class`/`id`/`data-*`.
- **Generic, modular, copy/paste-ready.** Each function drops into any standards-
  compliant system and works out of the box; no project-specific coupling.
- **DRY without obfuscation; "utility" is a meaningless name.** Because every
  function is utility-like, naming anything `utils`/`utility`/`helpers` carries
  zero information. Split files into conventional, intuitive, readable functions
  named for what they actually DO (what any JS dev would expect to find).
- **Modern baseline.** ES6+ baseline-supported features; performant, extensible,
  interoperable, future-leaning.
- **Semantic clarity beats cleverness.** If a terser form loses context, raises
  cognitive load, or strips semantic meaning, use the more verbose semantic form.

## Cadence (per user)
Work file-by-file, feature-by-feature. **Stop and ask on ANY doubt** before
choosing. **Test each feature and run regression as we go.** Keep companions in
lockstep. Better to ask than to fix later.

## Verification decision = "Enable full test env first"
Build is PAUSED until the environment can actually test. This environment today
CANNOT: render a browser (no chromium; experimental CSS unsupported anyway),
reach the data APIs (mock endpoints return 403), or write to `autocss` (MCP
denied; push 403). I can only do JS-logic unit tests + static/compliance checks
here. So nothing ships until enablement below is done.

### Enablement checklist (user action; see code.claude.com/docs/en/claude-code-on-the-web)
1. **Repo** -- ❌ STILL OPEN, the only remaining blocker. This session is scoped
   to `d7460n/starter` + `d7460n/dhcp` ONLY; `Autocss-com/autocss` is NOT
   reachable and there is no add_repo tool here. Fix: authorize the Claude
   GitHub App on the `Autocss-com` org (push/write), then use the **`+` chip**
   beside the `starter`/`DHCP` chips to add `Autocss-com/autocss` to the session.
   Until this is done I can build content in-container but cannot push it.
2. **Network policy** -- ✅ DONE. Environment set to Full network access.
   (Covers the data hosts + Playwright CDN.)
3. **Browser for tests** -- ✅ DONE. Playwright setup script added to the
   environment (`npx ... playwright install --with-deps chromium`).
   Caveat unchanged: bleeding-edge CSS visual fidelity needs a HUMAN eye;
   the browser enables DOM-level + live-data behavioral/regression tests, not
   pixel-perfect visual proof.

## Persistent memory standard (default for all projects/threads going forward)
Format = **NDJSON shards + JSON index** (append-only = cheapest writes; 1 JSON
object/line = line-cap maps to record count; each line independently parseable
by any future AI).
- `PROGRESS.json` (control file, read FIRST): meta (goal/refs/rules/heuristic/
  verify), `_self` (self-maintenance instructions), `shards[]`, `cursor`
  (phase/last/next/open_q). Small; rewritten only to update cursor/shards.
- `progress/log-NNN.ndjson`: append-only records, one JSON/line. Record types:
  `decision|feature|test|note|setup|lesson`. `feature` carries companion map
  `{name, html, css:[...], js:[...], verdict, status, why, tested}`.
  `setup` = the FULL environment-enablement recipe (product-agnostic): network
  policy chosen + why, setup-script contents (e.g. `npx playwright install
  --with-deps chromium`), repo/app authorizations (Autocss-com org, `+` chip),
  data hosts, and the who/what/why/where/when/how so any future env is rebuilt
  by copy-paste, never rediscovery. `lesson` = a learned fact/gotcha + its cause
  + the rule it produces, so the same mistake is never repeated.
- `_self` rules (embedded, so any AI can maintain it): append to newest shard;
  at 1500 lines start next shard + register in `shards[]`; never edit past
  records, only append corrections; always read PROGRESS.json then the newest
  shard to resume.
- SessionStart hook (repo `.claude/settings.json`) prints `PROGRESS.json` + tail
  of newest shard so any session auto-reloads context+why.
- Lives in the `autocss` repo (committed each step).
- Continuity decision (settled): cross-session resume comes from these
  git-committed files, NOT from any persistent machine. Cloud env is sufficient;
  Remote Control / laptop (`claude rc`) is OPTIONAL and declined for now -- its
  only unique benefit is real-browser visual checks, which the user does
  manually. No keep-awake laptop dependency.
- Persistence boundary (settled, do not re-litigate): env config (network policy
  + setup scripts) persists at the ENVIRONMENT level and re-runs automatically
  each container boot -- it is NOT redone per session; only a brand-new env for an
  unrelated project needs it re-applied (a ~2-min copy-paste from the `setup`
  record). NDJSON content is fully product-agnostic (any AI reading the repo gets
  it); the auto-LOAD hook is Claude-Code-specific but other products can read the
  same JSON. A file CANNOT self-grant network access or configure the platform --
  the `setup` record documents the recipe; a human still applies it once per env.

## Build order (after enablement; each step tested before next)
1. Repo skeleton + `PROGRESS.json` + SessionStart hook + CLAUDE.md.
2. CSS base (starter set; reconcile dhcp concerns; candidate-to-drop demo/decor
   like diag/stars/hero/_* -> inspect first, confirm with user before dropping).
3. `index.html` single universal scaffold (incl. dropdown-capable nav + its CSS).
4. Transport+lifecycle: `config/env/api(+write methods)/storage/oninput`.
5. Data shaping: `schema`(dhcp domain for now)/`rules`/ + concern-named modules
   (NEVER a `utils`/`helpers` file -- name each for what it does) -- node tests.
6. Generation `inject` (toTagName, no innerHTML/events).
7. CRUD UI `forms` + `forms.css`(de-data-*) + `fallbacks.css` + `loading.css`.
8. Wire dhcp datasets; full behavioral + regression pass in the enabled env.

## Defaults
- Dev branch in autocss: `claude/lucid-hawking-E5Ej2` (push there, not `main`).
- Assets carried from `starter` base.

## First-time environment setup (HUMAN action -- promote to GLOBAL instructions)
Per user: capture this once, globally, so no project ever rediscovers it. During
execution, write this verbatim into BOTH (a) the user's global instructions
(`~/.claude/CLAUDE.md`) and (b) a `setup` record in the NDJSON log, so it is
permanent and product-agnostic.

CORE PRINCIPLE (verbatim, to be written into global instructions):
> "The only thing a file fundamentally can't do is self-grant network access
> to a brand-new environment."

Everything else -- decisions, recipes, lessons, setup-script contents -- the
committed files and NDJSON carry forward automatically. Granting network access
to a brand-new environment is the ONE thing no file can do for itself; it is a
human-set security control by design, and therefore the only mandatory 1st-time
human step. Plan for the user to do it ONLY if necessary (i.e. a brand-new
environment with no/insufficient network policy); reuse an existing environment
to skip it entirely.

Human 1st-time-setup step (do only if necessary):
1. **Network policy (the only thing a file can't self-grant)** -> set to
   **Full** (or at least allow the project's data hosts + the Playwright CDN).
   Required once per brand-new environment; persists at the ENVIRONMENT level
   and re-runs automatically thereafter -- never redone per session.

Secondary, file-carryable (NOT fundamental limits -- listed for completeness):
- Setup script `npx playwright install --with-deps chromium` (its contents live
  in a committed file; only the network grant that lets it download is human).
- GitHub App authorization + adding the repo via the **`+` chip**.

## Current status / resume point
- ANALYSIS.md was added manually by the user and is already in the repo — done,
  no push needed.
- Enablement: network ✅, browser/Playwright ✅. Repo access ✅ (autocss in scope,
  push access confirmed). No autocss build started yet.
- Next action: build step 1 begins.
