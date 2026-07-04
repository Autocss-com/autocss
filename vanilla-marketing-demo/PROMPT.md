# NEXT-SESSION BUILD PROMPT — Vanilla marketing-site demo (Étoile Ballet Studio)

> **Accuracy is paramount. Completeness beats brevity. Assume nothing.**
> This document is self-contained. Read it in full before acting. It captures
> every decision from the session that produced it so the next session can build
> without re-deriving anything.

---

## 0. MISSION (one paragraph)

Build a **pure-vanilla AutoCSS marketing website** — a 5-tab ballet-studio site —
in the **`autocss-com/vanilla`** repo, driven **entirely by JSON data** fetched at
runtime, rendered by AutoCSS's own HTML+CSS+JS with **zero framework and (almost)
zero new JS**. This is a **test of AutoCSS's generality**: the same UI engine that
renders the DHCP admin app must render a completely different app (carousel, cards,
filterable gallery, contact, a searchable table, and text pages) purely from data.
The 6 JSON files already exist in this directory (`./data/*.json`); you will host
them on mockapi and build the rendering engine + markup that makes them render.

---

## 1. GROUND FACTS — repo, branch, scope, hosting

- **Target repo:** `autocss-com/vanilla`. It was OUT of scope in the session that
  wrote this; confirm it is now in your session's allowed-repos list before starting.
  If access is denied, STOP and tell the user to add `autocss-com/vanilla` to the
  environment's repository scope (Claude Code on the web env config).
- **Do NOT touch the DHCP admin app.** That lives in `autocss-com/autocss` (main).
  Nothing in this build modifies that repo's app. `autocss` is only the **reference**
  you PORT the engine FROM (see §4). Leave its DHCP demo alone.
- **Branch:** develop on `claude/autocss-remote-rendering-demo-ml2uf8`, cut fresh
  from `vanilla`'s `main`. Never direct-push to `main` (assume branch-protected;
  promote via PR merge). If that branch already exists and its PR is merged, restart
  it from the latest `main` (`git fetch origin main && git checkout -B <branch>
  origin/main`), keep the same name.
- **Git commit trailers (every commit):**
  ```
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01PC3wqYigrVv7SPH5xi3cR7
  ```
  (Do NOT put the model id in any pushed artifact.)
- **PR body footer:** end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)` and the session URL.
- **Data hosting (mockapi):** the user has a mockapi project at ID
  `697b63070e6ff62c3c5bec7f` → API base **`https://697b63070e6ff62c3c5bec7f.mockapi.io`**.
  - The dashboard URL form `https://mockapi.io/projects/<id>` returns HTML — it is NOT
    a data endpoint. The data endpoints are the **subdomain + resource-name** form:
    `https://697b63070e6ff62c3c5bec7f.mockapi.io/<resource>`.
  - You (or the user) create **6 resources** in that project, one per file below, and
    paste the JSON from `./data/`. Ask the user to confirm the exact resource names
    they created; the recommended names are: `shell`, `home`, `classes`, `about`,
    `faculty`, `tuition`.
  - **mockapi returns an ARRAY** for a collection; AutoCSS takes `data[0]` as the
    record. Each file here is already `[ { ... } ]`.
  - **CORS:** mockapi sends `Access-Control-Allow-Origin: *`, so browser fetch works.
  - **Images** are `https://picsum.photos/...` placeholders (free, no key). `<img>`
    display does NOT require CORS, so they render cross-origin fine. Swap for real
    ballet photos later; the URLs are just placeholders.

---

## 2. WHAT AUTOCSS / D7460N IS — the non-negotiable rules that bind this build

AutoCSS is a **zero-dependency, CSS-replaces-JS, browser-native SPA+PWA** ("D7460N
Architecture"). Read `vanilla`'s own `CLAUDE.md` first (canonical). The rules that
directly constrain THIS build:

- **HTML = structure only.** Semantic elements. **NEVER** `<div>`, `<span>`, `class`,
  `id`, or `data-*`. Use semantic tags and **custom elements** (they contain a hyphen)
  where a generic container is needed.
- **CSS does all UI behavior/state.** No JS for visibility, filtering, carousels,
  toggles, themes. Visibility is driven by `:empty` / `:not(:empty)` / `:has()`.
- **JS is CRUD/transport only**, and only via the single **`oninput`** lifecycle.
  **NEVER** `addEventListener`, `.click()`, `onclick`, `.onchange` (for new code),
  or `dispatchEvent` — **except** the ONE sanctioned use: the initial programmatic nav
  selection on load (`radio.checked = true; radio.dispatchEvent(new Event('input',{bubbles:true}))`).
- **No `innerHTML` for presentation.** Build DOM with `document.createElement` /
  `cloneNode` / `replaceChildren`; set text with `textContent`.
- **Layout = CSS Grid** (never Flexbox), full-bleed Holy Grail via `<app-container>`.
- **`@layer` per CSS file:** every new CSS file is wrapped in its own named layer
  (`@layer carousel { … }`), and the **`<link>` order in `index.html` IS the layer
  order** (load order = cascade; foundational files first = lowest priority). No master
  `@layer` statement.
- **JS is idempotent + stateless.** No global state, no side effects. Every lifecycle
  run must produce the same DOM for the same data.
- Use cutting-edge CSS freely; **never** warn about or code around browser compat.
- **`@starting-style`** fade-in on load, **`@view-transition`** on tab change, **anchor
  positioning** for hover content (already architectural; keep consistent).

---

## 3. THE ARCHITECTURE THIS SESSION ESTABLISHED (context you must carry)

AutoCSS renders **any** source through a clean split. **No new files, no invented
concept-nouns** ("projector"/"adapter"/"map"/"crawl" were rejected as names — describe
everything by the real files):

- **`assets/js/inject.js`** — JSON → DOM (the renderer/mechanism). Generates data-table
  cells from item KEYS via `toTagName()`, and (as of this session) content-level
  elements from a `content` array (see §4). **This is the file you EXTEND** for the
  demo. Pure mechanism; knows no field names.
- **`assets/js/schema.js`** — field-name normalize/denormalize MECHANISM. Untouched by
  this build.
- **`assets/js/profile.js`** — the ONLY per-source DATA (endpoints, field-name maps,
  option sets). You EDIT this to point vanilla at the ballet endpoints. `api.js` is
  untouched except its one `API_BASE_URL`.
- **`assets/js/api.js`** — transport. `API_BASE_URL` declared ONCE; `resolveEndpoint()`
  passes absolute `http(s)` URLs through unchanged and otherwise joins base+suffix.
  For vanilla, set `API_BASE_URL = "https://697b63070e6ff62c3c5bec7f.mockapi.io"`.

Also established (background — do not re-litigate):
- **Discovery → profile (FUTURE, build-time only):** a dev tool could probe a domain's
  OpenAPI/JSON:API/OData/GraphQL/RSS description and GENERATE `profile.js`. Not part of
  this build. If ever named, it is `discover`/`generate-profile`, never `crawl`, and it
  is build-time tooling, not shipped runtime.
- **Three platform walls** (why "any domain, from a domain alone, securely" is bounded):
  (1) **CORS** — a cross-origin source must send `Access-Control-Allow-Origin` for our
  origin or browser JS cannot read it; (2) **secrets can't live in the browser** —
  credentialed sources need a server broker, not keys in the client; (3) **nested /
  undocumented sources need assembly logic**, not config. None of these block THIS
  build (mockapi is CORS-open, keyless, and already contract-shaped).

---

## 4. CURRENT ENGINE STATE TO PORT INTO `vanilla` (verbatim), THEN EXTEND

`autocss` main already has the **content branch** (merged PRs: #52 profile extraction,
#53 design note, #54 content branch). `vanilla` may be behind. **First reconcile
`vanilla`'s `assets/js/inject.js`, `index.html`, and `assets/css/layout.css` against
`autocss` main**, porting the pieces below, THEN extend them for the demo.

### 4a. `inject.js` — the CURRENT content branch (single `<section>`, atomic `{tag:text}` only)

```js
// Non-tabular content: render an ordered `content` array of { tag: text } blocks
// (e.g. { h2: "..." }, { p: "..." }) as REAL semantic elements in <article><section>.
// The block's KEY is the element tag. Reuse-first: fill a matching element already
// in <section> when one is free; otherwise clone it from the <template> pool (an
// allow-list — a tag not in the pool is skipped). Idempotent across nav switches:
// leftover elements are EMPTIED (CSS :empty hides them) and kept for reuse, so
// clicking through tabs re-fills the same elements instead of accumulating stale
// ones. Text-only (textContent) — the pool is the security allow-list.
export function injectContentBlocks(article, blocks = []) {
  const section = article.querySelector("section");
  if (!section) return;

  const pool = document.querySelector("template")?.content ?? null;

  // Bucket the section's current children by tag so they can be reused.
  const buckets = new Map();
  for (const el of [...section.children]) {
    const tag = el.tagName.toLowerCase();
    if (!buckets.has(tag)) buckets.set(tag, []);
    buckets.get(tag).push(el);
  }

  const used = new Set();
  const ordered = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    const tag = Object.keys(block)[0]; // the KEY is the element tag
    if (!tag) continue;
    let el = (buckets.get(tag) || []).find(node => !used.has(node));
    if (!el) {
      const proto = pool?.querySelector(tag);
      if (!proto) continue; // not in the pool allow-list
      el = proto.cloneNode(false);
    }
    used.add(el);
    el.textContent = block[tag] ?? "";
    ordered.push(el);
  }

  // Surplus reused-pool elements: empty them (CSS :empty hides) and keep them
  // for the next endpoint. Filled blocks first, then the emptied remainder.
  const surplus = [...section.children].filter(node => !used.has(node));
  for (const node of surplus) node.textContent = "";
  section.replaceChildren(...ordered, ...surplus);
}
```

Called inside `injectPageContent` right after title/intro:
```js
  if (h1) h1.textContent = data.title ?? "";
  if (intro) intro.textContent = data.description ?? "";
  injectContentBlocks(article, data.content);
```

### 4b. `index.html` — the CURRENT additions (single section + pool)

Inside `<article>`, after the intro `<p></p>`:
```html
        <section></section>
```
Before the closing `</app-container>`/`<script>` (inert pool, selected by TAG — NO id):
```html
  <template><h1></h1><h2></h2><h3></h3><p></p><blockquote></blockquote></template>
```

### 4c. `layout.css` — the CURRENT additions (the `:not(:empty)` idiom)

Inside the `article { … }` block:
```css
      &:has(section > :not(:empty)) {
        display: grid;
        /* Also show for non-tabular content-only records */
      }
```
and:
```css
      section {
        display: none;                 /* Hide by default */
        align-content: start;
        &:has(> :not(:empty)) { display: grid; }   /* show when it holds real content */
        > :empty { display: none; }                /* emptied/surplus blocks stay hidden */
        > :not(:empty) { margin-inline: 1rem; }    /* align with other article content */
      }
```

### 4d. The reuse-first / empty-the-surplus idempotency model — DO NOT lose this

Because this is a **SPA**, the SAME DOM is reused as the user clicks tabs; the injector
re-runs into the same `<article>` each nav switch. Every render step MUST be idempotent:
**reuse a matching element already present → else clone from the pool → EMPTY (not
remove) the surplus so CSS `:empty` hides it and it is available to reuse on the next
tab.** No accumulation. This model must extend to sections, images, and every composite.

### 4e. PRE-BUILT + BROWSER-VERIFIED drop-ins (built this session with full context)

Two drop-in CSS files are already written and verified in chromium; copy them into
`vanilla/assets/css/` and `<link>` them (each in its own `@layer`, after `layout.css`):

- **`./assets/css/cards.css`** — responsive card grid. VERIFIED: a `<section>` holding
  `<app-card>`s is an auto-fit grid (2-up wide `526px 526px 0px`, 1-up narrow); card
  padding applied. **Pool markup per card:** `<app-card><h2></h2><p></p></app-card>`.
- **`./assets/css/carousel.css`** — full-bleed carousel that is **BOTH swipeable AND
  auto-advancing, 100% CSS, zero JS** (all rem/%). VERIFIED in chromium: `<app-carousel>`
  is a real `scroll-snap` scroller (native swipe works) AND auto-advances every 5s, PAUSES
  on hover/focus (activity), and stops under `prefers-reduced-motion`.
  - **Technique** (credit: Christian Schaefer / "Schepp", *A CSS-only Carousel*): auto-advance
    animates the SNAP POINTS, not the slides — each slide carries an `<app-snapper>` whose
    `left` is animated one slide right (the snapped scroller follows), then `scroll-snap-align`
    briefly flips to `none` so the snapper can reset without dragging the view, then re-engages
    onto the next slide. Because the container stays a scroll-snap scroller, manual swipe is
    unaffected. This CORRECTS an earlier wrong note that said pure CSS can't do both — it can.
  - **Pool markup** (note the `<app-snapper>` per slide):
    `<app-carousel><figure><app-snapper></app-snapper><img><figcaption><h1></h1><p></p></figcaption></figure>…</app-carousel>`.
  - **Slide count** for the last-slide loop-back is read STRUCTURALLY in pure CSS
    (`app-carousel:has(> figure:nth-child(N):last-child){ --slide-count:N }`, provided for 3–8;
    extend if a carousel has more slides). No JS sets it.
  - **NOT yet verified (cutting-edge, progressive):** the `::scroll-button()` arrows and
    `::scroll-marker` dots (Chrome 135+ CSS Carousel) — may not render in every chromium;
    swipe + auto-advance still work without them. Re-verify in the target browser.
- The exact markup both target is in **`./test/carousel-cards-test.html`** (also the
  isolation harness); reuse it as the `<template>`-pool source for these two composites.
- Verification harness (committed): **`./test/verify-carousel.mjs`** — serves the demo dir,
  stubs `picsum.photos`, and asserts the carousel is a scroll-snap swipe container AND
  auto-advances (`carousel-tonext`/`carousel-tostart` + 5s), PAUSES on hover, stops under
  reduced-motion, `--slide-count` resolves structurally, and cards stay responsive. (The
  Playwright import path in it is env-specific — adjust to the target env.)

---

## 5. CONFIRMED DESIGN LOCKS FROM THIS SESSION (do not re-ask; build to these)

1. **Content shape = `sections[]`** on the record; each section is an array of blocks;
   a block is **atomic** (`{ "h2": "text" }`, `{ "p": "text" }`) OR **composite**
   (`carousel` / `card` / `gallery` / `contact` / `ul`, defined in §6). The KEY names
   the element/composite; the renderer clones the matching thing from the pool and
   fills it.
2. **4 empty `<section>` elements** live statically in the article; **hidden until
   used** (`:empty`). Pages use as many as they need (Home uses 4; text tabs use 1).
   **`<section>` is a layout element with NO padding and NO margin of its own** — only
   content-level elements (h1/h2/p/figure/…) carry spacing.
3. **Images:** the content renderer must handle an `img` block `{ "img": { "src": "…",
   "alt": "…" } }` by setting the element's `src`/`alt` attributes (NOT `textContent`).
   Add `img`/`figure` to the pool. Responsive: `max-width:100%`, intrinsic sizing.
4. **Carousel:** brand-new **`assets/css/carousel.css`** (its own `@layer carousel`,
   linked in `index.html`), with the **carousel markup pre-built in the `<template>`
   pool**. **100% CSS, zero JS**: responsive, accessible, semantic, swipeable,
   auto-advancing every **5s** when idle, ≥3 slides, each slide = `h1` + `p` + `img`.
   (Modern CSS scroll-snap + `@scroll-timeline`/`animation` or `:has()`-driven radios;
   pick a CSS-only technique and VERIFY it. No JS.)
5. **Cards:** brand-new semantic responsive **card** in the pool (+ CSS). Each card =
   `h2` + `p` from JSON. A section may hold multiple card blocks (Home has 2).
6. **Gallery + filters:** brand-new. ≥10 images, **4 filter radios** (state machines,
   D7460N), default = no filter (show all). Selecting a filter transitions the images
   at **250ms**. Image **min-width = 200px in `rem`** (`12.5rem`). CSS-only filtering
   (see §7 — hardest part).
7. **Contact:** a **static map IMAGE** (`<img>` from a URL in the JSON) + a semantic
   **directions list** (`ol`/`li`). **NO iframe, NO JS, NO Google embed.** (This was
   confirmed with the user: iframes are not allowed; a live interactive map is out.)
8. **Search tab (tab 2 = Classes):** H1 + a search box + a results **table (AutoCSS
   `ul`/`li`)** visible by default — clicking the tab fires `oninput` and returns ALL
   rows. **Radio-filter state machines** narrow the rows (same CSS-only categorical
   mechanism as the gallery). Clicking a row opens the **`<aside>` form** — this
   already works in AutoCSS (the form fills from the selected row's cells; the aside
   opens via the existing `fieldset:not(:empty)` CSS). **There is NO second detail API
   call today** — keep current behavior; a real per-item detail fetch is a LATER,
   separate feature if a source ever exposes extra fields.
9. **Text tabs (3–5 = About / Faculty / Tuition):** title + paragraphs + a long
   **`ul`/`li` list** that scrolls (per D7460N scrolling.css). Needs a `ul` content
   block `{ "ul": ["item", "item", …] }` → a real `<ul>` with `<li>` children.
10. **Keep `api.js`.** Only `API_BASE_URL` changes (to the bec7f project). Endpoint
    suffixes / field maps live in `profile.js`. `resolveEndpoint()` also passes full
    absolute URLs through, so a nav value MAY be a full `…mockapi.io/<resource>` URL if
    you prefer not to rely on the base+suffix join.

---

## 6. THE CONTENT CONTRACT (exact shapes — mirrors the 6 files in ./data)

The renderer dispatches on each block's key. **Atomic** blocks set `textContent`;
**composite** blocks clone a pre-built template and fill sub-parts (including REPEATED
children — slides, cards, images, list items). All idempotent per §4d.

```jsonc
// A record (one per endpoint):
{
  "id": "1",
  "title": "…",          // -> <h1>  (data.title)
  "intro": "…",          // -> intro <p> (maps to data.description via BASE_MAP intro:description)
  "sections": [          // ordered; each targets the next <section> in the article
    { "content": [ <block>, <block>, … ] }
  ],
  "items": [ … ],        // OPTIONAL: the ul/li table (search tab) — existing table path
  "filters": [ … ]       // OPTIONAL: filter categories for the table radios
}

// ATOMIC blocks (KEY = real semantic tag; value = text):
{ "h1": "…" } { "h2": "…" } { "h3": "…" } { "p": "…" } { "blockquote": "…" }

// IMAGE block (attributes, not text):
{ "img": { "src": "https://…", "alt": "…" } }

// LIST block -> <ul><li>…</li>…</ul> (scrollable):
{ "ul": [ "item one", "item two", … ] }

// CAROUSEL composite (>=3 slides; each slide h1+p+img); 100% CSS, auto-advance 5s:
{ "carousel": [ { "h1": "…", "p": "…", "img": { "src": "…", "alt": "…" } }, … ] }

// CARD composite (h2+p); multiple card blocks allowed in one section:
{ "card": { "h2": "…", "p": "…" } }

// GALLERY composite (filters + images; each image has a filter category):
{ "gallery": {
    "filters": [ "all", "ballet", "jazz", "tap", "contemporary" ],
    "images": [ { "src": "…", "alt": "…", "filter": "ballet" }, … ]
} }

// CONTACT composite (static map image + directions list; NO iframe):
{ "contact": {
    "h2": "…", "p": "…",
    "img": { "src": "…", "alt": "map …" },
    "directions": [ "step one", "step two", … ]
} }
```

**The 6 data files (./data/) map to 6 mockapi resources:**

| File | Resource | Nav value | Role |
|---|---|---|---|
| `01-shell.json` | `shell` | (loaded on page load, = the shell/`NAV_ENDPOINT`) | banner + nav menu + footer |
| `02-home.json` | `home` | `home` | Tab 1 — 4 sections: carousel, 2 cards, gallery+filters, contact |
| `03-classes.json` | `classes` | `classes` | Tab 2 — searchable `items[]` table + `filters[]` radios |
| `04-about.json` | `about` | `about` | Tab 3 — title + paragraphs + long `ul` |
| `05-faculty.json` | `faculty` | `faculty` | Tab 4 — title + paragraphs + long `ul` |
| `06-tuition.json` | `tuition` | `tuition` | Tab 5 — title + paragraphs + 2 `ul`s |

**Shell wiring (`01-shell.json`).** The shell record is `{ banner, menu, footer }`.
AutoCSS today fetches banner + nav SEPARATELY; here you fetch ONE `shell` resource and
split it:
- `shell.banner` → `injectBanner(text)`.
- `shell.menu` → `injectNavText(shell.menu)`. Note `injectNavText` expects
  `{ groupName: { endpointValue: { title } } }`; the file already wraps the 5 tabs in a
  single group **`"Menu"`**, so pass `shell.menu` directly. The nav HTML must be ONE
  `<details open>` group whose `<section>` holds **5 labels** with
  `input[name="nav"]` values `home`/`classes`/`about`/`faculty`/`tuition`.
- `shell.footer.legal` → `<app-legal>`; `shell.footer.version` → `<app-version>`.
- Set vanilla's `profile.js` `NAV_ENDPOINT = "shell"` (or whatever resource name the
  user actually created) and remove the DHCP-specific endpoints; add the 5 above.

---

## 7. THE HARD PARTS / RISKS (design carefully; VERIFY each in a real browser)

1. **CSS-only categorical filter (gallery AND table).** CSS cannot match by text
   content, and `class`/`data-*`/`id` are forbidden. So a category MUST be encoded
   **structurally**. Recommended D7460N-clean approach: render each filterable item as
   a **custom element named by its category** (e.g. `filter` `"ballet"` →
   `document.createElement("cat-ballet")`, or wrap the `<figure>`/`<li>` with a
   category custom element). Then pure CSS:
   ```css
   /* default (no filter, or value="all") shows everything.
      when a filter radio is checked, dim/hide the non-matching custom elements: */
   section:has(input[name="gallery-filter"][value="ballet"]:checked) :is(cat-jazz, cat-tap, cat-contemporary) {
     opacity: 0; scale: 0.9; pointer-events: none;   /* transition 250ms */
   }
   ```
   with `transition: opacity .25s, scale .25s;` on the items. The filter radios are
   `<label><input type="radio" name="gallery-filter" value="ballet" aria-hidden="true"></label>`
   state machines. **This is the single highest-risk piece — prototype it in isolation
   and confirm in chromium before wiring the data.** The same mechanism serves the
   Classes-table row filters (each row carries its `style` as a category custom element).
2. **Content `<ul>` vs the table `<ul>`.** The article's existing CSS targets
   `article ul` for the DHCP table (the dual `<ul aria-hidden> + <ul>`). A content
   `<ul>` inside `<section>` will ALSO match those rules. **Scope carefully** —
   e.g. target the table as `article > ul` / `article ul[aria-hidden] + ul` and the
   content list as `article section ul`. Verify neither breaks the other.
3. **Multi-section targeting.** Extend `injectContentBlocks` (or add a small sibling in
   the SAME file — no new file) to iterate `data.sections` and render each into the
   Nth `<section>`, staying idempotent (reuse-first, empty the surplus) PER section.
   Empty trailing sections must clear (so tab-to-tab leaves no stale content).
4. **Composite templating with repeated children.** Carousel (N slides), gallery
   (N images), card lists, and `ul` (N items) require cloning a composite template and
   filling a variable number of children. Keep the clone/fill/append idempotent; reuse
   existing children across nav where practical, empty the surplus.
5. **Image reachability in the sandbox.** The test environment's egress may not reach
   `picsum.photos`. Assert DOM STRUCTURE + attributes (`img[src]`, `img[alt]`, counts,
   order, filter custom-element tags, radio state) rather than actual pixel load. Do
   NOT treat a blocked image as a failure.
6. **`@layer` order.** New CSS files (`carousel.css`, and any `gallery.css`/`cards.css`
   you add) are each wrapped in their own `@layer` and `<link>`ed in `index.html` in the
   right cascade position (after the foundational files). One concern per file; name
   each file for what it does. Prefer FEW new files — fold gallery/card styles into
   existing files if they fit a concern, per the anti-entropy rule; add a new file only
   when it is a genuinely separate drop-in concern (carousel clearly is).

---

## 8. BUILD ORDER (increments — build + BROWSER-VERIFY each before the next)

Each increment: extend the engine, add markup/CSS, then verify in chromium with a
crafted record (and/or the matching `./data` file). Commit + update memory per §10.

1. **Reconcile + port** the current content branch (§4) from `autocss` into `vanilla`;
   confirm the existing DHCP-style table + the single-section text branch still work.
2. **Multi-section + images + `ul` block.** 4 static `<section>`s; iterate
   `data.sections`; add `img`/`figure`/`ul` to the pool + handling. Verify with
   `04-about.json` (text + long ul) and a 2-section crafted record.
3. **Cards.** Card template block + CSS; verify 2 cards render (section 2 of Home).
4. **Carousel.** `carousel.css` + template markup; CSS-only auto-advance/swipe/a11y;
   verify slides present, structure correct, no JS. (Auto-advance timing is hard to
   assert headlessly — assert structure + that it is CSS-driven; visually confirm via
   screenshot.)
5. **Gallery + filters.** The category-custom-element mechanism (§7.1); verify: 10
   images render; selecting each of the 4 radios hides the non-matching categories;
   default shows all; 250ms transition present.
6. **Contact.** Static map `<img>` + directions `<ol>`; verify structure.
7. **Classes/search tab.** `items[]` table renders on tab select (via the nav radio's
   own `oninput` — the default "search"); the search box + radio filters narrow rows;
   clicking a row opens the aside form (existing behavior). Verify the real path.
8. **Shell + 5-tab nav + wire all endpoints** in `profile.js`; set `api.js`
   `API_BASE_URL` to the bec7f project. Full walk-through of all 5 tabs in chromium.

---

## 9. INDEX.HTML CHANGES (summary)

- `<article>`: keep `<h1></h1>` + intro `<p></p>`; add **4** empty `<section></section>`
  elements after the intro (before the New-Item/`hr`/search/table block if you keep
  those for the Classes tab — or gate them so they only show on the search tab).
- `<nav>`: ONE `<details open>` group, `<section>` with **5** `<label><input
  type="radio" aria-hidden="true" name="nav" value="home|classes|about|faculty|tuition"></label>`.
- `<template>`: extend the pool with the composite markup + `img`/`figure`/`ul` +
  card + carousel + gallery + contact building blocks (all inert until cloned).
- `<head>`: add `<link rel="stylesheet" href="assets/css/carousel.css">` (and any other
  new layer files) in correct cascade order.
- Keep `<aside>` form markup as AutoCSS ships it (the Classes-tab detail form).

---

## 10. VERIFICATION + MEMORY + CADENCE (hard rules)

- **TEST VIA THE REAL BROWSER, REAL TRIGGER.** Never assert behavior from reading code.
  Use Playwright + chromium in ONE foreground node process (this env kills backgrounded
  servers): `createServer.listen(127.0.0.1:PORT)` → `chromium.launch({args:['--no-sandbox']})`
  → `goto` (`ignoreHTTPSErrors:true`; egress MITM cert) → assert DOM/attrs → screenshot →
  `server.close()`. Stub any unreachable external host (route + fulfill). A working
  reference harness pattern is in `autocss`'s `scratchpad/verify-content.mjs` (from the
  session that wrote this) — it serves the repo, stubs the API, imports the module in
  page context, drives `injectPageContent`, and asserts the DOM.
- **Never claim tested/working unless the real path ran and you observed the result.**
- **Memory ritual each increment:** if `vanilla` has `PROGRESS.json` + `progress/*.ndjson`
  (mirroring the autocss memory system), append a shard record + update the cursor. If it
  does not, mirror the pattern (create them) — `PROGRESS.json` is the single source of
  truth; GitHub Issues/board are a one-way mirror (skip silently if unavailable).
- **Cadence:** file-by-file; stop and ask on ANY doubt; check in with the user before the
  FIRST push and after each numbered increment. Commit + push after each. Open ONE PR per
  logical increment (or a stacked series), and MERGE only on user go-ahead unless told
  otherwise. After a PR merges, restart the branch from fresh `main`.

---

## 11. EXPLICIT DON'Ts

- ❌ Do NOT modify the DHCP app in `autocss` (or `dhcp`/`starter`).
- ❌ No `<iframe>`, no live map embed, no JS map. Contact map = static `<img>` + directions.
- ❌ No JS for the carousel, filters, or any UI behavior — CSS state machines only.
- ❌ No `innerHTML`; no `<div>`/`<span>`/`class`/`id`/`data-*`.
- ❌ No `addEventListener`/`.click()`/`onclick`; `dispatchEvent` ONLY for the initial
  nav selection on load.
- ❌ No new files/concept-names beyond what a concern genuinely needs (anti-entropy).
- ❌ Do NOT claim the auto-advance/filters/carousel work without a real-browser check.

---

## 12. CONFIRM WITH THE USER AT SESSION START

1. Is `autocss-com/vanilla` now in scope? (If not, STOP — ask them to add it.)
2. The exact **mockapi resource names** they created for the 6 files (default: `shell`,
   `home`, `classes`, `about`, `faculty`, `tuition`), and that they pasted the JSON.
3. Whether `vanilla` should point `API_BASE_URL` at the bec7f project (recommended) or
   use absolute per-tab URLs.
4. Confirm the ballet-studio theme/content is acceptable as the demo subject (it's a
   stand-in; swap copy/images freely).

Everything else is decided above. Build in order, verify each step in a real browser,
keep it CSS-first and data-driven, and do not touch the DHCP app.
