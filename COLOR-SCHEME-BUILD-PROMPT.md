# BUILD PROMPT — `color-scheme.css` (modular color system, Part 1 of 2)

> PRELIMINARY DRAFT — working copy of the reusable build prompt, subject to further
> refinement before the build session. Not the final spec.

This is a focused, reusable build prompt. It builds ONE file, `color-scheme.css`,
the light/dark + system-adaptation GOVERNOR, independent of any color theme. Part 2
(`color-theme-*.css`, the palette derived from a single hex) is a SEPARATE later
session — do NOT build it here, but design the variable contract so it slots in.

## Goal
A single, dependency-free, **copy/paste-able** CSS file (`color-scheme.css`) that,
when linked in `<head>` of ANY site with NO other CSS/JS, makes the page render
correctly in light, dark, high-contrast, forced-colors, and reduced-transparency
modes — **driven by the user's system/browser preferences**. It exposes a semantic
`fg`/`bg` variable contract that color-theme files later fill; with NO theme file
present, every token falls back to a **CSS system color** so the page still looks
right. Drop it into a blank CodePen → it just works. No `id`/`class`/`data-*` hooks;
the only HTML touchpoints are the `<link>` and the `<meta name="color-scheme">`.

## Core behavior (build exactly this)
1. `:root { color-scheme: light dark; }` — the SYSTEM drives the actual scheme by
   default (CLAUDE.md Rule 19). Do NOT hard-default to dark.
2. FOUC prevention: ensure `<meta name="color-scheme" content="light dark">` is in
   `index.html` `<head>` (currently `content="dark light"` at line 11 — align the
   order to match `color-scheme: light dark`). RESEARCH + DOCUMENT the user-agent-
   stylesheet interaction: declaring `color-scheme` early lets the browser paint the
   correct `Canvas` before author CSS loads (prevents the white flash in dark mode).
   You cannot literally edit the UA stylesheet — instead MIRROR its system-color
   conventions (Canvas/CanvasText/…) so author defaults match UA defaults. Document
   the system-color names since most devs don't know they exist.
3. Scheme control = a THREE-STATE radio group (Light / Dark / System), replacing
   today's single ☼ checkbox at `header label:last-of-type` (index.html:39-42). Use
   state-machine radios in `<label>`s (architecture pattern), one `name` group, the
   **System radio `checked` by default**. Each radio maps to an ABSOLUTE scheme via
   pure CSS `:has()` — no media-query flip, no compare:
   ```css
   :root { color-scheme: light dark; }                                   /* System (default) follows OS */
   :root:has(header input[name="scheme"][value="light"]:checked) { color-scheme: light; }
   :root:has(header input[name="scheme"][value="dark"]:checked)  { color-scheme: dark;  }
   /* System radio checked → no override rule matches → stays light dark */
   ```
   (This replaces themes.css `color-scheme: dark` + `:root:has(...){color-scheme:light}`.)
   `value` is a standard attribute (already used by nav radios), not `data-*`. Style
   each radio-label icon appropriately (sun/moon/auto). Persistence + on-load restore
   is wired in JS — see "JS integration"; CSS owns styling, JS never writes styles.

## Variable contract (semantic fg/bg; recognizable to veterans AND noobs)
Define these at `:root`, each defaulting to a CSS SYSTEM COLOR (so theme-less +
forced-colors/contrast work for free). Color-theme files (Part 2) REASSIGN the SAME
names with palette values via `light-dark()`. Use `@layer` so themes override.
- Foreground: `--fg` (→ `CanvasText`), `--fg-link` (→ `LinkText`),
  `--fg-link-hover` (→ `LinkText`/`ActiveText`), `--fg-accent` (→ `AccentColor`),
  `--fg-emphasis` (= `--fg-accent`), `--fg-disabled` (→ `GrayText`),
  `--fg-muted` (→ `GrayText`).
- Background: mirror — `--bg` (→ `Canvas`), `--bg-link`, `--bg-link-hover`,
  `--bg-accent` (→ `AccentColor`/`Highlight`), `--bg-emphasis` (= `--bg-accent`),
  `--bg-disabled` (→ `ButtonFace`/`Field`), `--bg-muted` (→ `ButtonFace`).
- Focus ring: `--outline` (→ `AccentColor`, falling back to `Highlight` under
  forced-colors) — the keyboard-focus indicator color, tied to the SAME ACCENT hue as
  `--fg-accent` so the ring always matches the theme accent. In Part 2 it derives from
  the SAME single theme hex as the accent.
- Pick the most appropriate system color per token and DOCUMENT each choice inline.
- Apply the foundation so a bare drop-in is visible: `:root`/`body` get
  `background-color: var(--bg)` + `color: var(--fg)`; set `accent-color`, link
  colors, `::selection`, and the label-level `:focus-visible` indicator (see "Focus /
  keyboard navigation" below) from the contract.
- These names are chosen to map cleanly onto Tailwind/Bootstrap purposes later.
- NOTE the Part-2 ambition: ultimately ALL of fg/bg/accent/emphasis/muted/disabled
  derive from ONE hex (the theme file name) via hue + alpha (+ future filter/
  transform for "glass"/"isometric"). Keep the contract small + derivable.

## Focus / keyboard-navigation indicator (accessibility — WCAG 2.4.7 & 2.4.11)
ARCHITECTURE-SPECIFIC (MDN-verified): a `<label>` is NOT in the tab order — implicit
association (input nested in label) needs no `id`/`for`, but KEYBOARD FOCUS LANDS ON
THE INPUT, not the label. So the state-machine `<input>`s stay VISUALLY HIDDEN yet
KEYBOARD-FOCUSABLE, and the indicator is painted on the LABEL, which reacts to its
input's focus state via `:has()`. Making the label itself focusable would need
`tabindex` + JS activation and would break the `:checked`/radio single-source-of-truth
— do NOT.
- Keep the inputs visually hidden but FOCUSABLE — do NOT use `display:none` or
  `visibility:hidden` (both drop them from the tab order). Drive the indicator from the
  LABEL: `label:has(> input:focus-visible)` (keyboard-only — nothing on mouse
  `:focus`). NEVER remove focus visibility without an equal-or-better replacement.
- COLOR matches the ACCENT hue: use `--outline` (defaults to `AccentColor`, same family
  as `--fg-accent`) so the indicator tracks the theme accent in every scheme. In Part 2
  it derives from the SAME single theme hex as the accent.

### Indicator primitive — DECIDE AT BUILD TIME (both documented)
CORRECTION (MDN-verified — do NOT re-derive the old wrong claim): a CSS `outline` CAN
have rounded corners (via `border-radius`), an offset (`outline-offset`), animated
`outline-color`/`outline-width`/`outline-style`, and it transforms WITH its element.
What `outline` canNOT do: render as DISCONTINUOUS "tech-corner" brackets, be
transformed/animated INDEPENDENTLY of its element, or be a SINGLE indicator that
travels label→label. Choose per the roadmap, both are valid:
- OPTION A — standalone transformable layer: a pseudo-element (`::before`/`::after`) or
  an anchor-positioned element (Rule 32) painted from `--outline`. Needed for the
  future tech-corner brackets, independent isometric-3D transforms, and a single
  indicator that slides from one focused label to the next. More CSS; needs the
  forced-colors fallback below.
- OPTION B — CSS `outline` on the label (`outline: … var(--outline); outline-offset`).
  Simplest + most accessibility-robust (survives forced-colors natively); supports
  rounded corners + offset + color/width animation + transforms-with-element. BUT a
  continuous stroke bound per-element: no bracket corners, no independent transform, no
  traveling indicator.
- Either way: ensure contrast against both `--bg` and `--bg-accent`, and apply on BOTH
  global-nav labels AND the Light/Dark/System control labels so the entire keyboard
  path is visibly traversable.

### forced-colors
Decorative pseudo-element/box-shadow styling is STRIPPED under forced-colors, so if
OPTION A is chosen, provide a REAL `outline` fallback (system `Highlight`/`CanvasText`)
in `@media (forced-colors: active)` — the indicator MUST survive forced-colors. (OPTION
B survives natively.)

### Part 1 scope + research task
Part 1 = the `--outline` COLOR token + the `label:has(> input:focus-visible)` hook +
(if Option A) the forced-colors outline fallback. The tech-corners / intro-blink /
tab-to-tab transition / isometric-3D styling is a FUTURE session (Part 3 / effects) —
do not block it here. RESEARCH TASK (Part 2 / effects, BEFORE committing the decorative
build and the A-vs-B choice): investigate NEW / cutting-edge HTML+CSS for the indicator
— CSS anchor positioning (a single traveling indicator), `@property`-typed custom
properties (animatable corners/hues), `clip-path` / `border-image` / conic-gradients
(tech-corner brackets), `@view-transition` + scroll-driven animations, and newer focus
primitives — then pick Option A vs B WITH EVIDENCE. (CLAUDE.md: use cutting-edge
experimental CSS freely.)

## System preference detection (ALL FOUR)
- `prefers-color-scheme` — covered by `color-scheme: light dark` + system colors;
  use a query only for icon styling if needed.
- `forced-colors: active` — respect the forced palette; rely on system-color
  keywords, do not override with hard colors, keep non-color cues. Add a
  `@media (forced-colors: active)` block if anything needs securing.
- `prefers-contrast: more | less` — on `more`, snap tokens to pure system colors +
  stronger borders; on `less`, soften. Provide both queries.
- `prefers-reduced-transparency: reduce` — drop alpha/translucency to solid tokens.

## JS integration — selection persistence + on-load restore (REUSE existing functions)
The scheme selection is the ONE place Part 1 touches JS, and it must reuse the
existing init + storage plumbing, NOT a new system. JS only ever sets a radio's
`checked` (the HTML control) — it NEVER sets styles; CSS reacts to `:checked`. The
three-state radio with System as the HTML default makes this trivially simple — values
are ABSOLUTE, so there is NO `matchMedia` and NO compare logic.
- ON LOAD: add the check INTO the EXISTING init path (`initializeOnInputLifecycle()` /
  `triggerInitialSelection()` in `oninput.js`) — do NOT create a new init function.
  Read the persisted value from the SAME state object via
  `readPersistent("autocss.app.v1", "autocss.app.v1", {})` (storage.js), e.g. a
  `colorScheme` key beside `navigation` (mirror the existing `getInitialSelection()`
  reader). If absent or `"system"` → DO NOTHING (the System radio stays checked; CSS
  follows the OS). If `"light"`/`"dark"` → select (`input.checked = true`) the radio
  whose `value` matches (radios auto-uncheck the rest of the group). NO `dispatchEvent`
  — `:has(:checked)` reacts to the property directly, and this is not a data lifecycle
  (dispatch stays reserved for the nav-radio data call).
- ON SELECT (native user `oninput` on a scheme radio): persist the selected `value`
  (`"light"`/`"dark"`/`"system"`) to the same state object via `writePersistent(...)`
  (mirror `persistSelection()`), binding the scheme radios' `oninput` the way
  `bindNavOnInput()` binds nav radios (`input.oninput = …`, the sanctioned `oninput`
  property — Rule 12: NO `addEventListener`). Storage stays localStorage-primary,
  cookie-fallback (already handled by `read/writePersistent`).
- Keep JS idempotent/stateless and follow the file's existing comment/naming style.

## D7460N / architecture constraints
- CSS-only for styling. No `id`/`class`/`data-*`. Only `<link>` + `<meta>` in HTML.
- `color-scheme.css` MUST be independently copy/paste-able (the CodePen test below):
  on its own (no JS) it gives system-follow + the `:has()` Light/Dark/System radio
  override + system colors + icon styling. The selection PERSISTENCE + on-load RESTORE
  is the autocss JS integration layer (above), not part of the standalone CSS file.
- Use `@layer` (Rule 29); declare layer order so a later color-theme layer wins.
- Modern CSS; `light-dark()`, system colors, `:has()`; `@property` allowed if it
  helps (not required for Part 1). File name EXACTLY `color-scheme.css`.

## Integration with autocss (split, don't break parity)
- This SPLITS today's `assets/css/themes.css`: the light/dark MECHANISM + system
  detection + the toggle override → `color-scheme.css` (REMOVE `color-scheme: dark`
  and the `:root:has(...){color-scheme:light}` block from themes.css); the PALETTE →
  `color-theme-default.css` (Part 2, NOT now). Sequence the work so there is NO broken
  intermediate state and the app stays at VISUAL PARITY *within each scheme* — NOTE
  the DEFAULT intentionally changes from forced-dark to system-follow (resolving Rule
  19), so "parity" means today's dark still looks like dark and today's light still
  looks like light; the default just follows the OS now. Either keep `themes.css`
  tokens until `color-theme-default.css` lands, or bridge the existing consumers
  (`--txt`/`--bg`/`--accent` in layout.css/a11y.css/typography.css) onto the new
  `--fg`/`--bg` contract. Decide + state the migration order before editing.
- HTML: replace the single ☼ checkbox (index.html:39-42) with the 3-radio
  Light/Dark/System group (System `checked` by default), following the state-machine
  `<label>`+radio pattern and accessible labeling.
- JS: wire the selection persistence + on-load restore into the EXISTING init/storage
  functions (see "JS integration").
- `index.html`: add the `color-scheme.css` `<link>` early (before component CSS);
  align the `<meta name="color-scheme">` content to `light dark`. Confirm meta present.

## Examine & document first (the user's working method)
- Before changing anything, examine current `themes.css` vs `/home/user/DHCP` vs
  `/home/user/starter` (incl. trailing-underscore reference files) and DOCUMENT —
  using git history where useful — what each color-scheme/theming choice was and why
  it changed (the sRGB→OKLCH conversion, the dark-default deviation, the `:has()`
  toggle). Record in the NDJSON shard + SESSION-HANDOFF. This session RESOLVES the
  long-open "color-scheme dark vs Rule 19 light dark" question → `light dark` (system).
- Confirm `color-scheme.css` is genuinely copy/paste-able and works as designed.

## Verification (real browser; this env's recipe)
- STANDALONE test: a minimal HTML linking ONLY `color-scheme.css` (no JS) with a
  Light/Dark/System radio group → System follows the emulated OS scheme, Light forces
  light, Dark forces dark; correct system colors; no theme needed, no
  `id`/`class`/`data-*`.
- SELECTION PERSISTENCE (autocss app, with JS): pick Light/Dark/System → reload → the
  chosen radio is restored from storage (set on the radio, applied by CSS); a stored
  Light/Dark stays fixed when the emulated OS preference changes; System (or no stored
  value) follows the OS. Confirm Light↔Dark↔System round-trips (no permanent override).
  Assert JS sets only `checked`, never inline styles.
- chromium-over-http (serve + Playwright in ONE foreground node process,
  `ignoreHTTPSErrors:true`; chromium at `/opt/pw-browsers`): use `emulateMedia` /
  context to exercise `prefers-color-scheme: light|dark`, `prefers-contrast:
  more|less`, `forced-colors: active`, `prefers-reduced-transparency: reduce`; assert
  computed `background-color`/`color` adapt. Verify NO FOUC at first paint.
- FOCUS / keyboard nav: TAB through global nav, the Light/Dark/System control, and
  form controls — every focus stop shows the accent-hued indicator ON THE LABEL (the
  input stays hidden; no indicator on mouse click), driven by
  `label:has(> input:focus-visible)`; its color tracks the accent in light, dark, and
  (Part 2) themed palettes, and it survives forced-colors (natively for Option B, via
  the `@media (forced-colors: active)` outline fallback for Option A).
- Regression: the autocss app still renders at visual parity in light & dark; node
  tests (`node --test 'tests/*.test.mjs'`) + the step-7/8 suites still pass.

## Cadence / hard rules
- File-by-file. Stop and ask on ANY doubt; never guess. CSS-only; do NOT break
  parity. Check in before the FIRST push and after the feature is verified. Commit +
  update `PROGRESS.json` + append `progress/log-001.ndjson` + update
  `SESSION-HANDOFF.md`. Branch `claude/lucid-hawking-E5Ej2` (never `main`/`great-ride`).
  Do NOT touch `CLAUDE.md` or `ORIGINAL-PROMPT.md`.

## Open items to resolve early with the user
- Migration order / how to bridge existing `--txt`/`--bg`/`--accent` consumers to the
  new `--fg`/`--bg` contract without a visual break (and whether `themes.css` stays
  until Part 2).
- Exact CSS system-color choice per token (document each).
- "Don't create a new function": the on-load check goes INTO the existing init; for
  read/write reuse `read/writePersistent` and mirror the existing `getInitialSelection`
  /`persistSelection` pair. Confirm whether mirroring those tiny helpers is acceptable
  or the user wants it fully inlined.
- Exact radio-group markup + accessible labeling (label text/icons, `name`, `value`s,
  any `aria-*`) for the Light/Dark/System control — follow the established
  state-machine pattern; confirm specifics with the user during the build.
- Confirm the "examine every file & document deltas" scope is limited to
  color-scheme/theming for this session (the full-repo audit is a separate effort).

## Then (NOT this session)
Part 2 = `color-theme-default.css` + `color-theme-<hex>.css` (palette from a single
hex via hue/alpha) and Part 3 = the HTML controls (light/dark icon + the 4x4 hue
picker that reads hues from the linked `color-theme-*.css` file names via
`[href*="color-theme-"]` + `@property`, plus a native color input). Each is its own
session + handoff.
- FOCUS-INDICATOR RESEARCH (Part 2 / effects, its own task): research NEW / cutting-edge
  HTML+CSS capabilities for the focus indicator — CSS anchor positioning (a single
  indicator that travels label→label), `@property`-typed custom properties,
  `clip-path`/`border-image`/conic-gradients (tech-corner brackets), `@view-transition`
  + scroll-driven animations — and THEN finalize OPTION A (standalone transformable
  layer) vs OPTION B (CSS outline) for the indicator, with evidence. See the "Focus /
  keyboard-navigation indicator" section above.
