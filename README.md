# AutoCSS

A zero-dependency, **CSS-replaces-JS**, browser-native **SPA + PWA** starter — the
**D7460N Architecture**. One UI, driven almost entirely by modern HTML and CSS.
JavaScript is used *only* as a thin CRUD transport to external APIs — never for UI
state, behavior, or presentation.

## Principles

- **HTML = structure** — semantic elements only (no `div`/`span`/`class`/`id`/`data-*`).
- **CSS = all UI behavior** — state, color-scheme, visibility, loading, themes — via
  `:has()`, `:empty`/`:not(:empty)`, container & style queries, `@layer`, etc.
- **JS = API transport only** — fetch/CRUD, fired through `oninput` on state-machine
  `<input>`s. No event listeners, no UI logic, one API base.
- **Zero dependencies** — native evergreen-browser features only; no frameworks, no
  bundler, no build step.
- **Single `index.html`** — full-bleed Holy Grail layout via CSS Grid.
- **Air-gapped layers** — complete separation: no shared hooks and no agreed-upon
  vocabulary between HTML, CSS, and JS (which is *why* `class`/`id`/`data-*` are banned).
  Any layer can be replaced without touching the others.

The canonical, non-negotiable rules live in **`CLAUDE.md`**; the live backlog and
project state live in **`PROGRESS.json`**.

## Security by design

Banning inline scripts, event-handler attributes, and `innerHTML` removes the usual XSS
vectors by construction — so a strict **Content Security Policy** works from day one,
with no `unsafe-inline` or `unsafe-eval`.

## Accessibility by construction

Because only semantic elements and real form controls are allowed — never `div`/`span`
stand-ins — inaccessibility is effectively *unreachable*. Real buttons, inputs, and
landmarks deliver **WCAG / Section 508** conformance as a property of the markup, not a
retrofit.

## Demo ecosystem

AutoCSS is proven by a set of **real, diverse products** — each its own repository in
the `autocss-com` org, each with a completely different dataset, layout, workflow, and
user experience. The diversity *is* the proof: one declarative-first UI approach
adapting to anything. Adding a project adds **0 new codebases, 0 build pipelines, 0
dependencies** — one UI serves one product or ten thousand identically. Repos follow the
`autocss-<backend>` naming convention.

| Repo | Product | Notes |
| --- | --- | --- |
| `autocss-vanilla` | **international.dance** (ballet studio) | the current architecture as-is; accounts, store, payments |
| `autocss-wordpress` | **Psychiatrist** practice site | headless WordPress (booking, accounts) |
| `autocss-vue` | **Pokémon** app | Holy Grail triage; PokéAPI + sprite pictures |
| `autocss-angular` | **Crime statistics** (Fairfax County + Virginia State Police) | Holy Grail triage; FCPD ArcGIS + FBI CDE |
| `autocss-react` | **Bible study** app | Holy Grail triage; AO Lab bible.helloao.org |
| `autocss-drupal` · `autocss-joomla` · `autocss-sharepoint` | _reserved_ | held for future products |

### Hosting model

Each demo **self-hosts its static front-end on GitHub Pages** (custom domains
supported). Because the architecture is 100% static, Pages serves the UI directly with
no build step.

GitHub Pages is static-only — no server, no database, no secrets — so dynamic features
(user accounts/login, saved favorites + notes, payments + store) run against an
**external hosted backend** that the static front-end reaches through its CRUD JS
transport. This is the D7460N model by design: the front-end never holds data or
secrets.

Cross-cutting capabilities — authentication, account, favorites, notes, cart, checkout,
store — are built **once** as generic, single-concern, drop-in modules, so a feature
built for one demo drops into another with no rework.
