# ANALYSIS.md -- DHCP -> starter file reconciliation

> **Purpose.** Decide, per DHCP source file, what `starter` still needs.
> **Scope (locked with user).** HTML + CSS + JS only. **Excluded:** DHCP
> `data-examples/*`, both `*-mcp-server/` dirs, and config files
> (`.github`, `.vscode`, `.stylelintrc`, `.markdownlint`, `package.json`,
> `manifest.webmanifest`). Markdown docs not verdicted.
> **Phase.** Analysis only -- no code moved. This file is the resumable record.
>
> **Verdict legend**
> - `keep` -- capability/intent missing from starter; port it in.
> - `merge` -- same concern already exists in starter; reconcile into the existing file.
> - `drop` -- obsolete, decorative, inactive, or superseded.
> - `needs-you` -- intent or desired scope is ambiguous; user decision required (see Questions).
>
> **Compliance flag.** `(!)D7460N` = file (usually JS) carries needed intent but
> violates current architecture rules in `starter/CLAUDE.md` (e.g. `.onchange`,
> `data-*`, `innerHTML`, dynamic `import()`); port the *capability*, rewrite to
> oninput + CSS-state + text injection.

---

## 1. Executive summary

`starter` is a clean, compliant **content-display shell**: `app.js -> oninput.js
-> api.js/storage.js/tour.js`. It fetches a `shell` + page JSON and injects
**text** into fixed semantic slots. It has **no write path, no forms, no data
grid, no schema, no service worker**.

`DHCP` is a complete **CRUD data-management portal** (servers, scopes,
credentials, audit, faqs, variables, etc.): grouped `<nav><details>` filters, a
two-`<ul>` data table (header row + rows), an `<aside>` edit form with
Save/Reset/Delete/Close, field-type inference, API<->UI schema mapping, full
GET/POST/PUT/DELETE, environment flags, empty-state fallbacks, and a PWA service
worker.

**The overlap is the architecture** (oninput lifecycle, CSS state machines,
fetch->inject, semantic HTML, theming). **The gap is the entire data layer** --
which lives only in DHCP. So most DHCP JS is `keep` (port the capability), but
much of it must be **rewritten** to satisfy `starter/CLAUDE.md`, because the DHCP
implementation uses event handlers, `data-*`, and `innerHTML` that the
architecture forbids.

---

## 2. HTML

| DHCP file | starter counterpart | verdict | rationale |
|---|---|---|---|
| `index.html` | `index.html` | `needs-you` | Different app *shape*. DHCP adds: `<nav><details><summary><section>` grouped filters, `<main>` new-item button + `<input type=search>` filter + dual `<ul>` (header + rows), `<aside>` CRUD `<form><fieldset>` with Delete/Reset/Save labels, SW registration. starter's is the generic radio-nav content shell. All DHCP structures are architecture-compliant and are the **template for a data UI** -- adopt only if starter is meant to become the management app (see Q1). |

---

## 3. CSS

DHCP active set (from `index.html` links + `sw.js`): `loading, fallbacks,
themes, layout, reset, scrollbars, transitions, typography, responsive, a11y,
forms, fonts`. Everything else is unlinked/inactive.

| DHCP file | starter counterpart | verdict | rationale |
|---|---|---|---|
| `reset.css` | `reset.css` | `merge` | Same concern (box-sizing/margin reset). Reconcile to one. |
| `themes.css` | `themes.css` | `merge` | Both own light/dark tokens. starter uses `light-dark()`+oklch; DHCP uses rgb triplets+opacity vars. starter approach is the target; fold any DHCP-only tokens. |
| `layout.css` | `layout.css` | `merge` | Both own Holy-Grail grid. starter's also carries nav/loading/state-machine; reconcile concerns. |
| `typography.css` | `typography.css` | `merge` | Same concern. |
| `transitions.css` | `transitions.css` | `merge` | Same concern (+view-transitions, reduced-motion). |
| `a11y.css` | `a11y.css` | `merge` | Same concern (focus, outlines, brand accent). |
| `fonts.css` | `fonts.css` | `merge` | Same concern (font import). |
| `responsive.css` | `media.css` | `merge` | Same concern (responsive/media rules). |
| `scrollbars.css` | `scrolling.css` | `merge` | Same concern (scrollbar styling). |
| `border-radius.css` | `radii.css` | `merge` | Same concern (radius tokens). DHCP files reference `--border-radius`; starter defines `--inner/outer-radius`. Reconcile token names. |
| `forms.css` | *(none)* | `keep` (!)D7460N | starter has **no form styling**. Needed for any edit form: input/select/textarea, valid/invalid borders, base-select. **But** its button-enable logic keys off `[data-dirty="true"]` -- forbidden `data-*`. Port styling; re-drive state from `:has(:valid/:invalid)`/`:checked`, not `data-*`. |
| `fallbacks.css` | *(none)* | `keep` | Empty-state messaging ("No items", "Title failed to load", "Form could not be loaded", "Navigation failed"). Compliant (`:empty`/`:has`). Genuinely useful UX starter lacks. |
| `loading.css` | (inline in `layout.css`) | `merge` | starter already has a loading spinner (`:root:has(article h1:empty)::before`). DHCP's is a `:checked`-driven variant. Keep one. |
| `_app.css` | -- | `drop` | Comments only, no rules. |
| `_browser-support.css` | `detection.css` | `drop` | `:has()` support message via `.support` class (uses `class`, forbidden). starter's `detection.css` covers feature detection. |
| `_iframe.css` | -- | `drop` | iframe styling; no iframes in either app. |
| `_menus.css` | -- | `drop` | `label[for=...]:hover menu` dropdown; relies on `for`/id, not used; superseded by `<details>` nav. |
| `hero.css` | -- | `drop` | `/* coming soon */` only. |
| `stars.css` | -- | `drop` (decorative) | Animated starfield (giant box-shadow). DHCP-specific aesthetic, not loaded. Keep only if the visual is wanted (Q3). |
| `diag.css` | -- | `drop` (dev-only) | Diagnostic overlay (layout/SR/violation badges). Useful dev tool, not runtime. Optionally preserve as an opt-in dev file (Q3). |

starter-only CSS with no DHCP source (`inputs.css`, `carousel.css`,
`2026.02.28.css`, `*_.css`): out of scope here -- they're starter's own
(`2026.02.28.css` is a modern-CSS reference cheatsheet; `*_.css` are
CLAUDE.md-declared inactive).

---

## 4. JS

starter active JS: `app, oninput, api, storage, tour`. DHCP JS is the data layer.

| DHCP file | starter counterpart | verdict | rationale |
|---|---|---|---|
| `app.js` | `app.js` | `merge` | Both are the init entry. starter's (console.clear, env persist, oninput startup) is the cleaner target; ensure it triggers the data loaders once ported. |
| `config.js` | `api.js` (partial) | `keep`/`merge` | starter has `API_BASE_URL`+`ENDPOINT_SUFFIX` only. config.js adds env-driven `OPTIONS`, `VERSION`, `NAV/BANNER_ENDPOINT`, `ENDPOINTS[]`, `CONFIRM_FLAGS`, `JSON_HEADERS`, `DHCP_TYPES`. Port the missing constants; reconcile endpoint registry. |
| `env.js` | (inline `isLocalOpen` in `app.js`) | `keep` | Environment detection (dev/test/prod) + feature flags. More complete than starter's one helper. Port as a small module. |
| `fetch.js` | `api.js` (GET only) | `keep` (!) | **Critical missing capability**: `postJSON/putJSON/deleteJSON`. starter `api.js` only does GET (`fetchJson`). Fold write methods into starter's `api.js` (keeping its logging). |
| `loaders.js` | `oninput.js` (partial) | `keep`/`merge` | Orchestrates nav/page/banner/version loads + field-rules cache. Overlaps starter's lifecycle but adds banner/version/rules-cache. Reconcile into the oninput lifecycle. |
| `inject.js` | `oninput.js` (text-only) | `keep` (!)D7460N | Builds data table rows, nav items, and **form inputs typed by rule** (select/toggle/textarea/datetime/text). starter only `createTextNode`s into fixed slots. Needed for data grids/forms. Rewrite away from `innerHTML`/dynamic `import()`/`dispatchEvent`; keep the JSON->element generation intent. |
| `forms.js` | *(none)* | `keep` (!)D7460N | **The whole CRUD form lifecycle** (new/edit/save/delete/reset/close, dirty-tracking, validation, row mirroring). No starter equivalent. Heaviest rewrite: uses `.onchange`, `form.dataset.dirty/valid`, console debug -- all forbidden. Port intent via `oninput` + CSS `:has`/`:checked` state. |
| `rules.js` | *(none)* | `keep` | `inferFieldRules()` -- derives input type from data values. No starter equivalent; required to auto-generate forms. Compliant (pure function). |
| `schema.js` | *(none)* | `keep` | `ENDPOINT_SCHEMAS` API<->UI field-name mapping + normalize/denormalize. Domain data-layer; needed if those endpoints are used (DHCP-specific -- confirm endpoints in Q2). |
| `utils.js` | *(none)* | `keep` | Form helpers (snapshot, dirty-check, validate, date format, restore). Mostly compliant; port. |
| `errors.js` | `api.js` loggers | `drop`/`merge` | Trivial `logError`. starter's `logStage`/`logSuccess` are richer; use those. |
| `sw.js` | *(none)* | `keep` | PWA service worker (precache, offline SPA fallback, background sync). starter ships `manifest.webmanifest` but **no SW**, though CLAUDE.md mandates PWA. Port; rewrite the `ASSETS[]` list to starter's actual files. |

---

## 5. Cross-cutting recommendation

Port DHCP's **capabilities**, not its **code**, in this dependency order, each
rewritten to `starter/CLAUDE.md` rules (oninput-only, no `data-*`, no event
handlers, no `innerHTML` for presentation):

1. **Transport** -- add write methods to `api.js` (from `fetch.js`); add `config`/`env` constants.
2. **Data shaping** -- `rules.js`, `schema.js`, `utils.js` (mostly drop-in; pure functions).
3. **Generation** -- reconcile `inject.js` element-building into the oninput lifecycle.
4. **CRUD UI** -- rewrite `forms.js` as CSS-state + oninput; add `forms.css` (de-`data-*`) and `fallbacks.css`.
5. **PWA** -- add `sw.js` with a corrected asset list.
6. **HTML** -- adopt DHCP's data-UI structure in `index.html` *iff* starter is to become the management app (Q1).

CSS 1:1 pairs (Sec.3 `merge` rows) are verdicted at the **concern level**; their
line-by-line reconciliation is a port-phase task, not part of this analysis.

---

## 6. Questions for user (blockers for the port phase)

1. **Scope of starter.** Should `starter` *become* the DHCP management app
   (adopt grouped-nav + data-table + edit-form HTML), or stay a generic content
   shell with the data layer available as opt-in modules?
2. **Endpoints/domain.** Is the target still the DHCP domain (servers, scopes,
   credentials, audit, ...) -- i.e. keep `schema.js`'s endpoint map -- or a
   different/generic data set? (Affects `schema.js`, `config.ENDPOINTS`.)
3. **Decorative/dev files.** Keep `stars.css` (starfield) and/or `diag.css`
   (dev diagnostic overlay) as optional files, or drop both?
4. **PWA.** Confirm `sw.js` (offline caching) is wanted in `starter` now.

---

## 7. Status / resume point

- [x] Inventoried + read: all starter HTML/CSS/JS; all DHCP JS; DHCP `index.html`; DHCP non-1:1 CSS.
- [x] Verdicts assigned for every in-scope DHCP file.
- [ ] DHCP 1:1 CSS read line-by-line (deferred -- verdicted by concern).
- [ ] User answers Q1-Q4.
- [ ] Port phase (separate, on approval) following Sec.5 order.
