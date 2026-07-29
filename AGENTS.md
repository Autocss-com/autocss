# AGENTS.md — Autocss-com/autocss (project-specific ONLY)

**The canonical laws are NOT here.** They live in ONE file, once, for every project and
every AI vendor: **`Autocss-com/ai` → `AGENTS.md`** (Response Integrity Charter `C0`–`C8`
+ AutoCSS Architecture Part II `1`–`15`). Never copy or restate them here.

**How they reach you:** clone the ai repo once and import it from your user-level memory:

```bash
git clone https://github.com/Autocss-com/ai ~/.claude/ai
# ~/.claude/CLAUDE.md  ->  @~/.claude/ai/AGENTS.md
git -C ~/.claude/ai pull      # refresh the laws for ALL projects at once
```

**Conflict priority:** `Autocss-com/ai` AGENTS.md > this file > `SESSION-HANDOFF.md`.
On conflict, surface it to the user. **Never resolve silently.**

This repo is the **canonical reference implementation** — the example app the canonical
laws describe. It is not yet perfect: it carries tracked compliance-debt (see the last
section).

## 9. Project Structure

Full-bleed Holy-Grail SPA shell. Regions (CSS Grid; never Flexbox):

- `<app-container>` — root Grid wrapper.
- `<app-banner>` — empty by default (`display:none` when `:empty`); optional notices.
- `<header>` — `<app-logo>`, a Layouts toggle, and a Light/Dark/System color-scheme
  control (`<label>` wrapping `<input name="color-scheme" value="light|dark|system">`).
- `<nav>` — global nav as `<details>` groups; each item is a `<label>` wrapping
  `<input type="radio" name="nav" value="…">`. Interactive-element rules: **canonical §3**
  (label wraps the native input; the input keeps its role + checked state; no
  `role="button"`, no `aria-hidden` on the input/label, never `display:none` the input).
- `<main><article>` — `<h1>`, `<p>`, `<section>`, a New-Item control, an `<input
  type="search" name="filter">`, a decorative skeleton `<ul aria-hidden="true">`
  placeholder, and the live data `<ul>`.
- `<aside>` — details panel: `<form><fieldset>` (schema-driven) + Save / Reset / Delete
  controls.
- `<footer>` — `<app-legal>`, `<app-version>`.
- `<template>` — inert content-element pool cloned by tag name for non-tabular records.
- One `<script type="module" src="./assets/js/app.js">` before `</body>`, outside
  `<app-container>`.

## 10. Files

- `index.html` — complete DOM, loaded upfront.
- `assets/css/*.css` — active files (no trailing underscore); one concern per file, each
  wrapped in its own `@layer <filename>`. The `<link>` order in `index.html` IS the
  cascade order (most foundational = loaded first = lowest priority). `index.html` is the
  authoritative loaded set/order; `themes.css` and `transitions.css` are currently
  commented for a clean light/dark demo.
- `assets/js/{app,oninput,api,storage,tour}.js` — the five data-layer modules, period.
- `assets/images/app/` — non-brand assets. `assets/images/brand/` — brand assets.
- `manifest.webmanifest` — PWA manifest.
- Inactive: trailing-underscore files; `assets/js/pipeline/`.

## JS runtime (project specifics beyond canonical Part II §5)

- API base declared once; only the endpoint suffix varies. Nav radio index maps to the
  page endpoint suffix; the same DOM targets are reused for injection.
- Shell content (`header`, `nav`, `footer`, `meta`) fetched/injected once per runtime
  session, not per page call.
- Initial load enters the same `oninput` lifecycle by selecting a nav radio and
  dispatching its `input` event (the single sanctioned `dispatchEvent`; canonical §5).
- Console: `console.clear()` on startup and each lifecycle run; success = minimal
  timestamped; failure = verbose timestamped.

## Issue / Project-board tracking (mirror of the backlog)

`PROGRESS.json` (`meta.future_goals` + `cursor.open_q`) is the single source of truth for
outstanding work. GitHub Issues + the Projects board are a one-way mirror for human
visibility — never a competing tracker.

- Session-end ritual: commit → update `PROGRESS.json` → append shard → update
  `SESSION-HANDOFF.md` → reconcile Issues with the backlog.
- Board columns are LABEL-DRIVEN and status labels are MUTUALLY EXCLUSIVE: **Backlog** =
  `backlog` only; **In Progress** = `in-progress` only (remove `backlog` when moving);
  **Done** = Issue closed (no status label). Swap the label to move a card; never stack.
  `demo` is an orthogonal grouping tag. Full detail: `PROGRESS.json` →
  `meta.board_tracking`. If the board tooling is unavailable in a session, skip silently.

## 13. Session Continuity

Read `SESSION-HANDOFF.md` before any implementation decision; re-assert its Constraint
Lock before coding. If it conflicts with the canonical laws, **STOP and ask.**

## Compliance-debt (tracked — do NOT silently "fix" mid-task)

This reference still carries pre-§3 patterns, deliberately deferred per the project's
one-fix-per-session strategy (`SESSION-HANDOFF.md` COMPLIANCE-DEBT LEDGER + `PROGRESS.json`):

- State-machine `<input>`s (nav radios, color-scheme radios) are hidden with
  `display:none` + `aria-hidden="true"`. Canonical §3 requires visually-hidden-but-
  keyboard-FOCUSABLE (clip/opacity) with no `aria-hidden` on the input/label.
- Form action controls (New Item, Close, Save, Reset, Delete) use `<label role="button">`.
  Canonical §3 forbids `role="button"` on these labels. The CSS enable/disable logic in
  `forms.css` currently keys off `[role="button"]` / `[aria-label]`, so this fix is a
  cross-file change (HTML + `layout.css` + `forms.css` + `themes.css` + `scrolling.css`),
  not an attribute removal.
- `ul[aria-hidden="true"]` on the decorative skeleton row is a LEGITIMATE use (a
  non-interactive placeholder) and is **not** part of this debt — leave it.

Each fix is its own focused session with its own handoff, per the ledger. Never bundle
these into an unrelated task.
