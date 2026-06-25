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

The canonical, non-negotiable rules live in **`CLAUDE.md`**; the live backlog and
project state live in **`PROGRESS.json`**.

## Demo ecosystem

AutoCSS is proven by a set of **real, diverse products** — each its own repository in
the `autocss-com` org, each with a completely different dataset, layout, workflow, and
user experience. The diversity *is* the proof: one declarative-first UI approach
adapting to anything. Repos follow the `autocss-<backend>` naming convention.

| Repo | Product | Notes |
| --- | --- | --- |
| `autocss-vanilla` | **international.dance** | the current architecture as-is; ballet studio (accounts, store, payments) |
| _tbd_ | Pokémon app | reuses the Holy Grail triage layout + workflow |
| _tbd_ | Crime statistics (Fairfax County + Virginia State Police) | reuses the Holy Grail triage layout + workflow |
| _tbd_ | Bible study app | reuses the Holy Grail triage layout + workflow |
| _tbd_ | Psychiatrist site | — |

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
