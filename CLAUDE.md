# D7460N Architecture — Claude Code Instructions

This is a **zero-dependency, CSS-replaces-JS, JAMstack-based, browser-native**, Single Page Application (SPA), Progressive Web App (PWA) architecture starter template named **D7460N Architecture**.  
These rules are **non-negotiable**. Always fall back to these defaults.

## Accuracy & Clarification

- *BEFORE ANSWERING* a prompt or question — **ALWAYS** review thread (every line) from the beginning. This ensures your answer is up to date and in context. You must do this to avoid hallucinations or loosing context.
- NEVER skip thread review due to time pressure.
- **ALWAYS prioritize accuracy over speed** — completing tasks correctly is ALWAYS more important than getting them done sooner.
- If there is ANY ambiguity in instructions, questions, or prompts at any step, STOP immediately, ask for clarification, and wait for a reply before proceeding.
- **NEVER PRESUME YOU ARE CORRECT.** The user *ALWAYS* determines what is correct.
- **NEVER GUESS.** Do not assume, infer, or improvise when instructions are unclear.
- You may NOT proceed without the clarification needed to do what is being asked or prompted.
- **ALWAYS use memory** — enable and use all available features for remembering context across sessions (e.g., memory, notepad, stored facts). Cross-session continuity is required.
- Disable and or ignore file reading line caps. **ALWAYS read all files and the entire file all the way to the last line** — when reading files, read the complete file. 

## External Service Issues (Non-Negotiable)

When a configured external API or service fails for any reason (SSL certificate errors, network failures, authentication errors, rate limiting, HTTP errors, etc.):

- **NEVER** change the codebase architecture or redirect API endpoints to work around the failure.
- **NEVER** create local fallback files, mock data, or substitute data sources to replace the external service.
- **NEVER** redirect `API_BASE_URL` or any configured endpoint from its declared remote origin to a local path.
- **STOP immediately** and provide suggestions for the user on how to resolve the external service issue directly.
- **Examples of correct responses:**
  - SSL cert error → suggest the user to log into their service provider account and renew or verify the certificate.
  - Network/fetch failure → suggest the user to check service status, subscription, or provider dashboard.
  - 4xx/5xx HTTP error → suggest the user to inspect the endpoint configuration or contact the API provider.
- Creating workarounds in code for broken external services produces more code, obscures the real problem, violates Least Power, and permanently changes the architecture in ways the user did not request.

## Session Continuity (Non-Negotiable)

- At the start of every session, **ALWAYS** read `SESSION-HANDOFF.md` before making implementation decisions.
- **ALWAYS** re-assert the handoff "Constraint Lock" before coding changes.
- If `SESSION-HANDOFF.md` conflicts with canonical architecture rules, STOP and ask for clarification.
- **NEVER** skip handoff review due to time pressure.

## Core Constraints

- **NEVER** any HTML or CSS in JS.
- **NEVER** any CSS or JS in HTML.
- **NEVER** any JS or HTML in CSS.
- **All** JS is to be written as generic drop-in/use anywhere single function per file native HTML modules using conventional naming nomenclature that all web developers would know.
- **All** CSS is to be written as generic drop-in/use anywhere single function per file modules using conventional naming nomenclature that all web developers would know.
- **JS == NEVER** — JS shall NEVER be used for anything except where explicitly stated by user
- **HTML + CSS == everything** — modern HTML and CSS must be used for all development except where explicitly stated by user
- **HTML == structure** — semantic elements only, never use `<div>`, `<span>`, `class`, `id`, or `data-*`
- **CSS == replaces JS for all UI behavior** — state, heuristics, color-scheme, themes, loading states, visibility, and everything else except where explicitly stated by user
- **Zero dependencies == standard native browser features only** — no frameworks, no routing, no bundlers, no compiled code, no npm packages except where explicitly stated by user
- **Single page** — one `index.html` at project root, SPA + PWA architecture
- **Layout** — CSS Grid only (never Flexbox), full-bleed Holy Grail via `<app-container>`

## Non-Negotiable Rules

1. **NEVER** use third-party dependencies. Third-party == any code that cannot natively render in any evergreen browser without assistance.
2. **ALWAYS** use modern, vanilla, W3C/WCAG-compliant, accessibility-first/accessibility-baked-in syntax.
3. Standards references: [https://www.w3.org/TR/](https://www.w3.org/TR/) and [https://developer.mozilla.org/en-US/docs/Web](https://developer.mozilla.org/en-US/docs/Web)
4. **ALWAYS** default to SPA navigational architecture, which is `<nav><label><input type="radio" aria-hidden="true" name="nav"></label></nav>`, using `:has()` and `oninput` event to call data.  
5. **ALWAYS** default to PWA (`manifest.webmanifest`).
6. JS shall **NEVER** be used for anything except where explicitly stated by user (such as: modular `assets/js/*.js` runtime files for API transport, `oninput` lifecycle orchestration, and browser storage). Modern HTML and modern CSS must be used for all development at all time except where explicitly stated by user.
7. CSS **ALWAYS** replaces all JS for all functionality except where explicitly stated by user.
8. CSS **ALWAYS** uses 
9. When JS is used, **ALWAYS** use `document.querySelector('')` for targeting selectors.
10. JS **ALWAYS** uses `oninput` for ALL API CRUD operations through a shared lifecycle utility.
11. JS **NEVER** uses user-initiated events for API CRUD operations.
12. JS **NEVER** uses event listeners — ever.
13. HTML **ALWAYS** uses state machine `<label><input type="radio" aria-hidden="true" />` for interactive elements that are not intrinsically interactive.
14. HTML markup is **ALWAYS** semantic, minimally nested, and intuitive.
15. *Separation of Concerns* between presentation and data layers **MUST ALWAYS** be maintained.
16. *Principle of Least Power* **MUST ALWAYS** be maintained.
17. CSS **ALWAYS** determines DOM element visibility based on data presence via `:empty`, `:not(:empty)`, `:has()`, `if()`, etc.
18. CSS **ALWAYS** uses modern intrinsic sizing such as style-queries and CSS-only techniques — no hard/static values.
19. CSS **ALWAYS** manages light/dark mode color-scheme in `:root{color-scheme: light dark}`.
20. CSS **ALWAYS** uses modern web accessibility selectors to "bake-in" accessibility when possible.
21. CSS **ALWAYS** uses radio buttons inside `<label>` with `role="button"` combined with `:has()`, `:not()`, `:empty`, `:not(:empty)`, inside `<nav>` for global navigation.
22. *STATE MACHINES* == checkboxes inside `<label>`s with `role="button"` combined with optional conditional using `@container` queries, `:has()`, `:not()`, `:empty`, `:not(:empty)`, `if()`, `@property`, `@function`, `@supports`, `contain-intrinsic-*`, etc.
23. HTML **ALWAYS** uses one single `index.html` at project root.
24. HTML **ALWAYS** uses full-bleed Holy Grail layout from `index.html`.
25. **NEVER** inline CSS or JS.
26. **NEVER** warn about or consider cross-browser compatibility.
27. **NEVER** use `<div>` or `<span>` — ALWAYS use semantic HTML equivalents that address the intent of the element.
28. **NEVER** nest wrapper elements for layout — ALWAYS use CSS Grid instead (e.g., `grid-template-columns` and `justify-content: space-between`).
29. **ALWAYS** use `@layer` to distinguish different CSS features and to allow easier override by future developers.
    - **Every CSS file is wrapped in its OWN named layer** — `@layer <filename> { … }` (e.g. `reset.css` → `@layer reset`), **with NO exceptions.** A file lacking a wrapper is a mistake, never an intentional signal — so no one wastes time inferring meaning from its absence.
    - **Declare NO master `@layer` order statement.** The **`<link>` order in `index.html` IS the layer order** (a layer takes its position from where it is first seen). The load order *is* the Cascade — the **C** in CSS — used deliberately. Order the links so the most foundational file (e.g. `reset`) loads **FIRST = LOWEST priority**.
    - **Purpose = pre-emptive deconfliction for future developers.** Because every one of our styles lives in a layer, ANY *unlayered* style another developer — or another system/framework embedding this UI — later writes wins **by default**, with zero extra effort and no specificity fight. We intentionally keep our own priority low so others' intent "just works."
    - Keep wrappers **minimal** (do not re-indent file contents).
30. **ALWAYS** use `@starting-style` to fade in init load of page content
31. **ALWAYS** use `@view-transition` to fade in targeted tab content.
32. *ALWAYS** use anchor positioning for all hover content so that content never goes off the page. 
33. **ALWAYS** consult the standing references for modern native HTML/CSS/JS and Baseline platform capabilities: `modern-web-guidance` (GoogleChrome/modern-web-guidance) **and** the MDN Web Docs MCP server (`https://mcp.mdn.mozilla.net/` — tools `search` / `get-doc` / `get-compat` for live MDN docs + browser-compatibility data; the web-session-compatible connector, preferred for authoritative lookups). Their **content is ADVISORY and SUBORDINATE** — on ANY conflict with these rules, **THESE rules win.** The **requirement** to consult them, to **periodically reconcile** them against this app's current features/capabilities, and to **SUGGEST** improvements they surface **IS canonical.** *Identify != apply* — never silently change anything; confirm with the user first.

## HTML Layout Pattern

The full-bleed Holy Grail layout from `index.html`. This is the canonical structure — ALWAYS follow this pattern unless otherwise stated or a more efficient way is discovered.

```html
<app-container>
  <app-banner></app-banner>
  <header>
    <app-logo></app-logo>
    <app-user></app-user>
  </header>
  <nav>
    <label>
      <input type="radio" aria-hidden="true" name="nav">
    </label>
  </nav>
  <main>
    <article>
      <h1></h1>
      <section></section>
    </article>
  </main>
  <aside></aside>
  <footer>
    <app-legal></app-legal>
    <app-version></app-version>
  </footer>
  <app-banner></app-banner>
</app-container>
```

### Layout Regions

- **`<app-container>`** — Root layout wrapper; CSS Grid Holy Grail structure
- **`<app-banner>`** — Generally empty, default `display: none;` when `:empty`, may contain optional notification or alert content
- **`<header>`** — Contains `<app-logo>` and `<app-user>` custom elements
- **`<nav>`** — Global navigation; radio button `<label>` state machines (see State Machine Pattern below)
- **`<main>`** — Primary content area; contains `<article>` with `<h1>`, `<p>`, `<section>` elements
- **`<aside>`** — Sidebar/supplementary content
- **`<footer>`** — Contains `<app-legal>` and `<app-version>` custom elements
- **`<script type="module">`** — Single script tag at end of `<body>`, outside `<app-container>`

## State Machine Pattern

This is intentional. NEVER replace with `<button>` or JS event handlers.

For forms:
```html
<label role="button" aria-label="Save">
  Save
  <input type="checkbox" aria-hidden="true" />
</label>
<label role="button" aria-label="Close">
  Close
  <input type="checkbox" aria-hidden="true" />
</label>
```

For navigation:
```html
      <nav>
        <label>
          <input type="radio" aria-hidden="true" name="nav">
        </label>
        <label>
          <input type="radio" aria-hidden="true" name="nav">
        </label>
        <label>
          <input type="radio" aria-hidden="true" name="nav">
        </label>
        <label>
          <input type="radio" aria-hidden="true" name="nav">
        </label>
        <label>
          <input type="radio" aria-hidden="true" name="nav">
        </label>
        <label>
          <input type="checkbox" aria-hidden="true">
        </label>
      </nav>
```

## Issue / Project-Board Tracking (mirror of the backlog)

`PROGRESS.json` (`meta.future_goals` + `cursor.open_q`) is the **single source of truth** for outstanding work. GitHub **Issues** + the **Projects board** are a one-way **mirror** for human visibility — never a competing tracker.

- As part of the session-end ritual (commit → update `PROGRESS.json` → append shard → update `SESSION-HANDOFF.md`), **reconcile GitHub Issues with the backlog**: open an Issue for each new backlog / open-question item, and **close** the Issue when its item is done (the board's built-in Workflows then move it to Done).
- Keep it lightweight: the title mirrors the item; the body carries the detail + a pointer to the relevant `PROGRESS.json` / prompt entry; apply the `backlog` label (so the board's auto-add Workflow can filter on it). Sub-tasks live in the parent Issue's body, not as separate Issues — unless one graduates into its own session.
- **Board columns are LABEL-DRIVEN, and the status labels are MUTUALLY EXCLUSIVE — NEVER stack them.** **Backlog** column = the `backlog` label ONLY; **In Progress** column = the `in-progress` label ONLY — you **MUST remove `backlog`** when moving a card to In Progress, because leaving BOTH pins it to Backlog; **Done** = the Issue **closed** (no status label). To move a card between columns, **swap** the status label (`backlog` ↔ `in-progress`) — never add a second one. `demo` is a grouping tag orthogonal to the columns — keep it. Only `backlog` + `in-progress` status labels exist (there is no `todo`/`done`/`ready` label — Done is expressed by closing the Issue). Full detail lives in `PROGRESS.json` → `meta.board_tracking`.
- Issues are effectively append-only (GitHub can close but not delete), so create deliberately. If the GitHub Projects toolset / board is unavailable in a session, **skip silently** — `PROGRESS.json` stays authoritative and the mirror catches up later.

## File Responsibilities

- **index.html** — Complete DOM structure, loaded upfront
- **assets/css/*.css** — Active CSS files; all files in `assets/css/` without trailing underscores. Each file owns a single concern (see `naming/SKILL.md`).
- **assets/js/app.js** — JS entrypoint; startup checks, console reset, and initialization wiring
- **assets/js/oninput.js** — Shared `oninput` lifecycle; binds nav inputs, routes API calls, and injects data
- **assets/js/api.js** — API transport utilities; base URL, endpoint suffix resolution, fetch/parse, and logging helpers
- **assets/js/storage.js** — Generic storage utilities (localStorage primary, cookie fallback)
- **assets/js/tour.js** — Safe placeholder module for future onboarding/tour logic
- **assets/images/app/** — Project assets not related to branding
- **assets/images/brand/** — Project assets related to branding

### Ignored (inactive for now)

- **assets/js/pipeline/** — Inactive; ignore for now
- **`assets/css/` files with trailing underscores** (e.g., `typography_.css`, `fonts_.css`) — Inactive; preserved for reference but not loaded by the runtime

## When Modifying This Project

- **All** UI states, including loading states, use CSS + HTML checkbox/radio state machines
- **ALWAYS** keep JS focused on fetch/CRUD only
- **ALWAYS** use semantic HTML markup
- **NEVER** use `<div>`, `<span>`, `class`, `data-*`, or `id` — `<div>` and `<span>`; **ALWAYS** use semantic HTML equivalents that address the intent of the element
- **NEVER** nest wrapper elements for layout — **ALWAYS** use CSS Grid instead (e.g., `grid-template-columns` and `justify-content: space-between`)
- Forms **ALWAYS** go inside `<fieldset>` with schema/rules
- Custom elements generated from JSON via `toTagName()`
- Use `aria-disabled` for accessibility (styled via CSS)
- JS **ALWAYS MUST** be idempotent and stateless — **NEVER** global state or side effects
- **ALWAYS** review and reuse existing functions before creating new ones
- **NEVER** create new coding patterns — **ALL** patterns are already established; use what exists
- Adding code **ALWAYS** increases entropy — **NEVER** add new code or files except where explicitly stated by user
- **ALWAYS** follow user instructions in extreme detail — no more, no less
- **ALWAYS** review user instructions after each task but before completion to ensure everything was done exactly as instructed - no more, no less
- **NEVER** skip review of user instructions after complete due to time pressure.
- **ALWAYS** Use cutting-edge experimental CSS without regard for browser support

## JS Runtime Conventions (Non-Negotiable)

- API base address is declared **ONCE**; **ONLY** endpoint suffix varies (for example `shell`, `home`, `about`, `products`, `events`, `contact`)
- Initial page load **MUST** enter the same `oninput` lifecycle path by **selecting** a nav radio: read the persisted selection from storage (or the first nav radio if none — **no nav radio is `checked` in the HTML by default**), set `input.checked = true`, then **dispatch an `input` event on it** (`input.dispatchEvent(new Event('input', { bubbles: true }))`) so the input's **own** `oninput` fires the lifecycle. A bare programmatic `input.checked = true` does **not** dispatch `oninput`, and `.click()`/`onclick` are forbidden, so `dispatchEvent` is the **single sanctioned** use — the standards-native, framework-interoperable replacement for `.click()` — used **only** for this programmatic selection on load/restore, where no real user event exists. (All real user interactions fire `oninput` natively; no dispatch.) The startup script never calls the lifecycle itself; `:checked` remains the single source of truth for both the CSS state machine and the data call. Return visits restore the persisted radio the same way.
- Shell content (`header`, `nav`, `footer`, `meta`) is fetched/injected once per runtime session, not on every page call
- Nav radio index maps to page endpoint suffix; same DOM targets are reused for injection
- Console reporting policy: minimal timestamped success reports, verbose timestamped failure reports, and `console.clear()` on startup and each lifecycle run
