# BUILD PROMPT — AutoCSS as a CDN resource ("UI as a Service")

> PRELIMINARY DRAFT — working copy, subject to refinement before the build session.

The AutoCSS UI is ONE zero-dependency, browser-native HTML+CSS UI. This phase serves
it as a REMOTE RESOURCE — referenced by URL like an image or a font — so any host can
render it and supply its own data. **One UI, many back-ends.** The back-ends are
data-logic layers (frameworks + CMSs: WordPress, Drupal, React, Vue, Angular, Laravel,
Rails, …). Each supplies DATA; all share ONE CDN-hosted UI.

Thesis to prove: declarative-first / browser-first **interoperates with everything AND
is simpler / faster / smaller / cheaper** than the over-engineered stacks it drops into.

## Why this is even possible (the linchpin — already built)
CLAUDE.md Rule 29: every AutoCSS stylesheet lives in a named `@layer`, and the link
order IS the cascade order — deliberately keeping our priority LOW. So **any unlayered
style the host writes wins by default**, with zero effort and no specificity fight.
That pre-emptive deconfliction is exactly what lets the UI "drop into any host" and be
re-skinned by it. The CDN phase is the payoff of that work — lean on it.

## The boundary (separation of concerns = the product)
- **CDN provides** (presentation + behavior, NO app data): the HTML skeleton (full-bleed
  Holy Grail), the CSS layer stack, the JS runtime (`api` / `oninput` / `storage` / `app`).
- **Host provides** (data only): the API base URL + endpoint suffixes; optionally which
  `color-theme-*.css` to link, and its own override CSS.
- The single config knob already exists in the runtime: **API base declared once; only
  the endpoint suffix varies** (`shell`, `home`, `products`, …). The host fills that in.
- The UI MUST stay data-free: it carries structure/behavior/style, never the host's data.

## Decisions to LOCK with the user FIRST (do not guess)
1. **Delivery mechanism** — the defining fork:
   - **A) Link + module import** — host `<link>`s the CDN CSS and `<script type="module">`s
     the CDN JS; the HTML skeleton is included by the host (static partial / SSI) or
     fetched as text. Most "like a font/image," preserves zero-dep AND the cascade
     deconfliction (host styles win). **Recommended** — but confirm.
   - **B) Web Component** (`<autocss-app api="…">`) bundle. Clean embed, BUT shadow DOM
     ENCAPSULATION BREAKS the host-override deconfliction (host CSS can't reach in) —
     direct tension with the linchpin above. If chosen, decide light-DOM vs shadow.
   - **C) iframe** — strongest isolation, weakest integration; host can't restyle; breaks
     "host styles win." Likely only for sandboxed demos.
   - **D) Build-time include / SSI / partial** — host inlines the skeleton at build.
2. **HTML skeleton delivery** — host hand-includes the Holy-Grail markup vs CDN serves a
   fetchable HTML partial. NOTE: injecting HTML from JS violates CLAUDE.md ("no HTML in
   JS"), so the skeleton stays static HTML the host includes (or fetched-as-text), NOT
   string-built in JS.
3. **Versioning + integrity** — immutable, URL-pinned versions (`/autocss/vX.Y.Z/…`),
   long-cache, SRI hashes (like fonts/scripts), and CORS for cross-origin data.
4. **Theming per host** — which `color-theme-*.css`; demonstrate a host re-skinning via
   its OWN unlayered CSS (the deconfliction principle, live).
5. **Data contract** — document the JSON shape the host's endpoints MUST return (the
   `toTagName()` / `tests/data-shaping` contract). This is "the API the host implements."
6. **Where it's actually hosted** — the real CDN/provider, and the CORS posture.

## Scope: slice it (ONE thing per session)
- **This session** = packaging the CDN bundle + ONE reference integration (start with a
  plain static host pointing at a live endpoint). NOT all frameworks at once.
- The interop demo SET (WordPress / Drupal / React / Vue / Angular / …) is the FULL
  phase — **each integration is its own later session + handoff.**

## Definition of done (proof)
A host page that links the CDN UI and points at its OWN data endpoint renders the full
AutoCSS UI with the host's data, AND the host's own CSS overrides our styles by default
(deconfliction demonstrated). Same bundle, swap the data → same UI.

## Constraints (canon — non-negotiable)
- Zero deps; HTML+CSS do everything; JS is CRUD-only via the `oninput` lifecycle.
- Separation of concerns is THE feature: presentation (CDN) vs data (host) never mix.
- `@layer` cascade preserved; our priority stays low so hosts override for free.
- No `id`/`class`/`data-*`; only `<link>`/`<script>`/`<meta>` as host touchpoints.

## Verification (real browser; this env's recipe)
- Serve + Playwright (chromium at `/opt/pw-browsers`, `NODE_PATH=/opt/node22/lib/node_modules`):
  a host page linking ONLY the CDN bundle + a data endpoint renders the UI; assert the
  host's own unlayered CSS overrides an AutoCSS rule with NO `!important`.
- Regression: the first-party app still renders; `node --test tests/*.test.mjs` passes.

## Cadence / hard rules
- Read `PROGRESS.json` + newest shard + `SESSION-HANDOFF.md` + `CLAUDE.md` first. ONE
  slice. Stop and ask on ANY doubt; never guess. Commit + update `PROGRESS.json` +
  append `progress/log-001.ndjson` + `SESSION-HANDOFF.md`. Feature branch, never `main`.
  Do NOT touch `CLAUDE.md` or `ORIGINAL-PROMPT.md`.

## Then (NOT this session)
- Each framework/CMS reference integration, one per session.
- A "one UI, N back-ends, ONE shared CDN instance" gallery proving the thesis.
- Optional: a tiny host-side adapter spec (how a back-end maps its data to the JSON
  contract) per ecosystem.
