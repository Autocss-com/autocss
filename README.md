```
                   A U T O C S S

  ::::======  :::::  ===== :::::======  ::::====== 
 :::::  ===== :::::  ===== :::::====== :::::  =====
 ============ =====  =====    =====    =====  =====
 =====  ===== =====  =====    =====    =====  =====
 =====  =====  ==========     =====      ======== 
                                   
            ::::====    ::::===   ::::===
           :::::       :::::     :::::    
           =====       =======   ======= 
           =====          =====     =====
            ========   =======   =======

___________________________________________________________
___________________________________/\\\____________________                
__/\\\\\\\\\\\\\\__/\\\____/\\\__/\\\\\\\\\\\__/\\\\\\\\\_____     
__\/\\\  ° °   \\\_\/\\\___\/\\\_\////\\\////__\/\\\///\\\__           
___\/\\\////////\\\_\/\\\___\/\\\____\/\\\_/\\__\/\\\_\/\\\_   
____\/\\\______\/\\\_\/\\\\\\\\\\\____\//\\\\\___\/\\\\\\\\\__  
_____\/\\\\\\\\\\\\\\_\///////////______\/////____\/////////___ 
______\/\\\\//////\\\\_______________________________________________
_______\/\\\______\/\\\__/\\\\\\\\\\\__/\\\\\\\\\\\__/\\\\\\\\\\\_______
________\/\\\______\/\\\_\/\\\///////__\/\\\///////__\/\\\///////_______
_________\///_______\///__\/\\\_________\/\\\\\\\\\\__\/\\\\\\\\\\_______
___________________________\/\\\_________\////////\\\__\////////\\\______
____________________________\/\\\\\\\\\\\_\/\\\\\\\\\\__\/\\\\\\\\\\_____
_____________________________\///////////_\///////////___\///////////_______
______________________________________________________________________

```


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

AutoCSS is proven by serving **one shared UI** — hosted at `https://autocss.com` — remotely to
several independent front-ends, each supplying its own data. The diversity *is* the proof: one
declarative-first UI approach adapting to anything. Adding a project adds **0 new codebases, 0 build
pipelines, 0 dependencies** — one UI serves one product or ten thousand identically.

**Current phase (iterative) — 4 demos,** each its own repo in the `autocss-com` org:

| Repo | Demo | Notes |
| --- | --- | --- |
| `autocss-com/vanilla` | **international.dance** (ballet studio) | the current AutoCSS architecture as-is |
| `autocss-com/react` | React reference demo | idiomatic React data-layer; not tied to a product yet |
| `autocss-com/vue` | Vue reference demo | idiomatic Vue data-layer; not tied to a product yet |
| `autocss-com/angular` | Angular reference demo | idiomatic Angular data-layer; not tied to a product yet |

The three framework demos are **standard/idiomatic instances of each framework** — they show how it
exposes data and how to call AutoCSS remotely, and are **not yet tied to a product** (real products
are a later iteration). Each builds to static assets and deploys to GitHub Pages via GitHub Actions;
the remote AutoCSS UI is attached only after the back-end renders on Pages.

**Deferred to a later iteration:** the real products (a psychiatrist practice, a Pokémon app, a
Fairfax County / Virginia crime-statistics app, a Bible-study app) and their back-end mappings, plus
**WordPress** and **Joomla** — which need more than static GitHub Pages can host (PHP + database +
server runtime). See `REMOTE-RENDERING-DEMO-BUILD-PROMPT.md` for the authoritative plan.

### Hosting model

Each demo **self-hosts its static front-end on GitHub Pages** (custom domains supported). The three
framework demos build to static assets (via GitHub Actions) which Pages then serves; the vanilla
demo is 100% static and needs no build step.

GitHub Pages is static-only — no server, no database, no secrets — so dynamic features
(user accounts/login, saved favorites + notes, payments + store) run against an
**external hosted backend** that the static front-end reaches through its CRUD JS
transport. This is the D7460N model by design: the front-end never holds data or
secrets.

Cross-cutting capabilities — authentication, account, favorites, notes, cart, checkout,
store — are built **once** as generic, single-concern, drop-in modules, so a feature
built for one demo drops into another with no rework.
