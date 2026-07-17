# AGENTS.md — autocss (project-specific ONLY)

**The canonical laws are NOT here.** They live in ONE file, once, for every project and
every AI vendor: **`Autocss-com/ai` → `AGENTS.md`** (Response Integrity Charter `C0`–`C8`
+ D7460N Architecture `1`–`16`). Never copy or restate them here.

**How they reach you:** clone the ai repo once and import it from your user-level memory —
then every repo on the machine gets them automatically, no per-repo file:

```bash
git clone https://github.com/Autocss-com/ai ~/.claude/ai
# ~/.claude/CLAUDE.md  ->  @~/.claude/ai/AGENTS.md
git -C ~/.claude/ai pull      # refresh the laws for ALL projects at once
```

**Conflict priority:** `Autocss-com/ai` AGENTS.md > this file > `.agents/SESSION-HANDOFF.md`.
On conflict, surface it to the user. **Never resolve silently.**

This repo is the **completed reference implementation** of the D7460N Architecture — the
FEATURE + LOOK target the other repos are measured against. This file declares only what is
TRUE OF THIS REPO and nothing else.

## 9. Project Structure

```html
<app-container>
  <app-banner></app-banner>
  <header><app-logo></app-logo><app-user></app-user></header>
  <nav><label><input type="radio" name="nav"></label></nav>
  <main><article><h1></h1><section></section></article></main>
  <aside></aside>
  <footer><app-legal></app-legal><app-version></app-version></footer>
  <app-banner></app-banner>
</app-container>
<script type="module" src="assets/js/app.js"></script>
```

Full-bleed Holy Grail via CSS Grid. State machines are `<label>` wrapping a bare
`<input type="radio"|"checkbox">` — no `role="button"`, no `aria-hidden`, input kept
focusable (see canonical §3). `:checked` drives every CSS rule.

## 10. Files

- `index.html` — full DOM, loaded upfront
- `assets/css/*.css` — active files (no trailing underscores); one concern per file, one `@layer` per file
- `assets/js/{app,oninput,api,storage,tour}.js` — the five data-layer modules; nothing else
- `assets/images/app/` — project-functional assets
- `assets/images/brand/` — brand assets (logos, marks, color-bound imagery)
- `manifest.webmanifest` — PWA manifest
- `PROGRESS.json` — control file / backlog single source of truth (`meta.future_goals`, `cursor.open_q`, `shards[]`)
- `progress/log-NNN.ndjson` — append-only session shards registered in `PROGRESS.json.shards`
- `.agents/SESSION-HANDOFF.md` — current session state / Constraint Lock
- `.claude/session-start.mjs` + `.claude/settings.json` — Claude Code SessionStart hook that reloads `PROGRESS.json` + newest shard (vendor harness wiring; stays in `.claude`)

Inactive (preserved, not loaded): `assets/js/pipeline/`, and `assets/css/` files with trailing underscores.

## 11. Endpoint suffixes (project data)

API base declared once; only the endpoint suffix varies: `shell`, `home`, `about`,
`products`, `events`, `contact`. Nav radio index maps to the suffix; shell content
(`header`, `nav`, `footer`, `meta`) is fetched once per runtime session.

## 13. Session Continuity

- At the start of every session, read [`.agents/SESSION-HANDOFF.md`](./.agents/SESSION-HANDOFF.md) before making implementation decisions.
- Re-assert the handoff Constraint Lock before coding changes.
- The `.claude/` SessionStart hook auto-prints `PROGRESS.json` + the newest shard tail on startup.
- If `SESSION-HANDOFF.md` conflicts with the canonical laws, STOP and ask.

## 14. Routing — Which Skill Owns This Task

Skill routing is **universal** — it is defined once in `Autocss-com/ai` → `AGENTS.md` §14,
not per repo. Follow that table. If a task touches more than one concern, do each part
inside its own skill.
