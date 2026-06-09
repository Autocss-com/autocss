CONTINUE AND COMPLETE THIS BUILD. This is a fresh session; prior chat context did
NOT carry over — everything you need is in this repo. The COMPLETE original spec
is in `ORIGINAL-PROMPT.md` (read it in full). Steps 1–6 of its Build order are
DONE and verified; step 7 was attempted and FULLY REVERTED; steps 7–8 plus a few
cross-cutting items remain. Work on branch `claude/lucid-hawking-E5Ej2` (push
there, never `main`). Stop and ask me on ANY doubt. Check in before your FIRST
push and after each numbered step. Do NOT drop anything from the spec. Do NOT add
any code, file, or feature I did not explicitly ask for.

============================= READ FIRST, IN THIS ORDER =============================
1. `CLAUDE.md` — canonical, non-negotiable D7460N architecture rules.
2. `ORIGINAL-PROMPT.md` — the full original plan/spec (goal, the per-feature
   KEEP-&-MODERNIZE heuristic, HTML/scope reality, D7460N compliance, JS authoring
   conventions, cadence, memory standard, build order). This is the contract.
3. `PROGRESS.json` — read the `meta` and the `cursor` (phase/last/next/open_q).
4. `progress/log-001.ndjson` — the append-only memory shard. READ IT IN FULL.
   Pay special attention to:
   - every record dated **2026-06-07** (the complete step-7 handoff: revert note,
     DO-NOT-REPEAT lesson, carried-forward decisions, VERIFIED dhcp facts,
     corrected build plan, OPEN QUESTIONS), and
   - lines 35–37 (step-7 requirements, the popover/undo finding, the forms
     line-by-line inventory).
5. `starter/.agents/SESSION-HANDOFF.md` — the prior Constraint Lock (CLAUDE.md
   requires reading a handoff at session start; re-assert it).
6. `ANALYSIS.md` — the dhcp→starter file reconciliation and per-file verdicts.

Reference repos in scope: `DHCP` (messy-but-complete working prototype = the
FEATURE + LOOK reference) and `starter` (the D7460N-correct but incomplete
architecture reference). `autocss` (this repo) = the completion. The finished app
must look, behave, and work like DHCP, changing nothing except to improve it to
the D7460N Architecture.

============================= GROUND TRUTH / CURRENT STATE =========================
- Branch `claude/lucid-hawking-E5Ej2`. HEAD = the latest commit on the branch —
  the step-7 handoff PLUS this session's corrections (no-default-`checked` nav,
  storage-driven selection simplified to persisted-else-first, the `dispatchEvent`
  decision, the state-persistence principle, and the JSON-sourced-content
  correction), all on top of `31c7925`. Working tree clean.
- DONE + verified: steps 1–6.
  - Step 4 = transport/lifecycle (`config.js`, `env.js`, `api.js` incl. write
    methods, `storage.js`, `oninput.js`).
  - Step 5 = data shaping (`schema.js`, `rules.js`) with node tests (7/7).
  - Step 6 = generation/`inject.js`: nav is STATIC HTML (text injected, not
    generated); the ONLY generated DOM is data-table cells = custom elements from
    the JSON item KEYS via `toTagName()` with the JSON VALUES injected. EVERYTHING
    rendered into the page is SOURCED FROM THE JSON — the `<h1>` title, the intro
    `<p>`, the column-header labels, the table rows, and (in step 7) the per-record
    form fields. NOTHING is hardcoded; the code only faithfully renders whatever the
    JSON returns. Verified live (chromium over http) that this injection works: no
    console errors, and the `manage` endpoint's CURRENT data rendered its nav
    titles, its title `<h1>`, its header columns (from the item keys), and its rows.
    The SPECIFIC values (e.g. the particular header keys, and the row count) come
    from the live JSON and CHANGE with the data — do NOT treat them as invariants.
    The only code-level invariant is the `toTagName()` transform.
  - NO nav radio is `checked` in the HTML by default. On load the runtime reads
    the persisted endpoint from browser storage (`storage.js`) and CHECKS that nav
    radio (`input.checked = true`), then DISPATCHES an `input` event on it
    (`dispatchEvent(new Event('input', { bubbles: true }))`) so the radio's OWN
    `oninput` fires the lifecycle — never `.click()`/`onclick`; the script never
    calls the lifecycle itself. First-ever visit (no stored value) falls
    back to the first nav radio. `:checked` is the single source of truth for both
    the CSS state machine and the data call. (Verified live: fresh visit → "Manage";
    storage seeded to `audit` → reload restores "Audit".) IMPORTANT: this storage
    restore is the STARTER architecture convention (CLAUDE.md "JS Runtime
    Conventions"), NOT dhcp — dhcp uses NO browser storage and defaults to the
    first page every visit; autocss follows the starter convention, so it is not
    new.
- Step 7 (CRUD forms) was implemented (commits 21bdf93, 2abd648) then FULLY
  REVERTED via `git reset --hard 31c7925` + force-push, because the attempt
  improvised features and falsely claimed things were tested. REBUILD IT FRESH.
- Files that DO NOT currently exist (were reverted): `assets/js/forms.js`,
  `assets/js/format.js`, `assets/css/forms.css`, `assets/css/fallbacks.css`.
- `assets/js/inject.js` `createListItem` currently builds a row with ONLY the
  `list-item` radio (the step-7 `row-toggle` checkbox is NOT there yet).
- The data source is a shared live mockapi (one API base, endpoint suffix varies).
  Save/Delete write to it — treat writes with care (see Open Question 2).

============================= METHOD — HOW TO WORK (from the spec) ================
- DEFAULT = KEEP & MODERNIZE. Dropping is a rare exception, never the fall-through.
- For every feature: identify what it does with ALL its companions (HTML + CSS +
  JS together; companion tracking mandatory). If you find a MORE MODERN native
  HTML/CSS way, that is NOT license to change it — STOP and ASK me first, every
  time, before altering any markup or CSS. If no modern improvement exists, keep
  it unchanged. Only raise "drop?" after inspecting, and never drop silently.
- D7460N compliance, non-negotiable:
  - `oninput` on state-machine `<input>`s is the ONLY bridge to the UI; it is
    fired by BOTH user action AND programmatically. NEVER use `.onchange`,
    `.onclick`, `addEventListener`, or dynamic `import()`. `dispatchEvent` is the
    SINGLE SANCTIONED exception — used ONLY to make a programmatically-selected nav
    radio fire its OWN `oninput` on initial load/restore (the one place with no
    real user event): `input.checked = true` + `input.dispatchEvent(new
    Event('input', { bubbles: true }))`. All real user interactions fire `oninput`
    natively — no dispatch.
  - No `data-*`/`class`/`id`. Drive dirty/valid/enabled/visibility purely via CSS
    `:has(:valid)`, `:has(:invalid)`, `:checked`, `:empty`/`:not(:empty)`,
    `aria-disabled`.
  - JSON→elements via `toTagName()` is allowed; NO `innerHTML` for presentation
    (use `replaceChildren`/`createElement`/`textContent`). JS is CRUD-only,
    stateless, idempotent. One API base.
  - No `utils`/`helpers`/`utility` file names — name each module for what it DOES.
  - Use `@layer`, `@starting-style`, `@view-transition`, cutting-edge CSS
    (`field-sizing`, `appearance: base-select`, `::picker(select)`, anchor
    positioning) without regard for browser support.
- Cadence: file-by-file, feature-by-feature. Test each feature AND run regression
  as you go. Stop and ask on ANY doubt. Check in before the FIRST push and after
  each numbered step.

============================= HARD RULES FOR THIS REBUILD (learned the hard way) ==
1. TEST ONLY VIA THE REAL TRIGGER. Exercise the actual user path (simulate the
   click on the row/label/button so the real `oninput` fires). NEVER call handler
   functions directly and call that "tested." NEVER say something is tested,
   wired, or working unless the real path actually ran and you observed the result.
2. NEVER ASSERT BEHAVIOR FROM READING CODE — observe it in a real browser. (A
   prior claim that "the form fades in over 500ms" was wrong; the form does not
   fade.)
3. NEVER ADD CODE, FILES, OR FEATURES NOT EXPLICITLY REQUESTED (CLAUDE.md). The
   reverted attempt invented an unsaved-changes overlay — do not re-add it.
4. VERIFY EVERY DIVERGENCE FROM DHCP AGAINST DHCP before acting. Do not silently
   "fix" what looks like a dhcp bug; surface it and ASK.
5. Test environment recipe (this env kills backgrounded servers): run the static
   file server AND the Playwright chromium test in ONE foreground node process
   (`createServer.listen(127.0.0.1:PORT)` → `chromium.launch` → `goto` → assert/
   screenshot → `server.close()`), with `ignoreHTTPSErrors: true` (egress MITM
   cert). Node test files: use the GLOB form `node --test 'tests/*.test.mjs'`.

============================= DO-NOT-REPEAT (the reverted attempt's mistakes) =====
- The unsaved-changes OVERLAY was IMPROVISED (not in dhcp) and BROKEN: it used
  `html:not(:hover) app-container:has(aside form fieldset:not(:empty))::after`.
  `html:not(:hover)` is TRUE whenever the pointer is not over page CONTENT — over
  the scrollbar, the browser chrome/address bar, another window, or before the
  mouse first enters — so it shows "every time the form is open," not only on
  intentional leave. NEVER use `html:not(:hover)` for mouse-leave detection.
- Falsely claimed "all wired"/"tested end-to-end" while the real selection path
  did not exist (the test synthesized `radio.checked=true; radio.oninput()`).
- Assumed the form fade from reading `transitions.css`.
- Skipped reading the session handoff at start.

============================= DECISIONS ALREADY MADE (carry forward) ==============
(A) UNDO/REDO = native per-input browser undo (free) + the Reset button →
    `restoreForm()` (restore form fields AND the mirrored row to the loaded
    snapshot). NO custom history stack, NO Ctrl+Z/X JS.
(B) DIRTY SIGNAL = "pure CSS, record-open proxy." NO dirty state at all (no hidden
    dirty checkbox, no `data-dirty`). Aside/form visibility = CSS
    `fieldset:not(:empty)`. Accepted consequence: cannot detect true
    "changed-from-loaded"; Reset (restores values, record stays open) does NOT
    close the aside — only Save (reload repopulates) or Close (clears fieldset)
    closes it.
(C) Save button gating = `aside form:has(:invalid)` (validity only). Reset/Delete/
    Close are available whenever a record is open.
NOTE: (B) means the unsaved-changes GUARD cannot truly know "unsaved" in pure CSS,
and the `html:not(:hover)` leave-detection was broken anyway → the guard feature
needs a fresh design decision with me (see Open Question 1). Decisions A/B/C
themselves stand for the CRUD form.
(D) STATE PERSISTENCE — GENERAL PRINCIPLE (per user). State always changes through
    USER input, with the sole exception (so far) of first load (the sanctioned
    `dispatchEvent` nav selection). `oninput` is independent and decoupled from
    other processes. INTENT: EVERY state-machine `<input>` (radio OR checkbox)
    SAVES its boolean state to browser storage (`storage.js`) on its own `oninput`
    — so these booleans can be controlled/manipulated programmatically "when we
    need them later." BUT do NOT auto-RESTORE them on load — NOT yet. The ONLY
    state restored from browser history on load is the NAV radio input (persisted
    endpoint → checked → dispatch). CURRENT STATE: only the nav selection is wired
    (save + restore) via `persistSelection`/`getInitialSelection` in `oninput.js`.
    SAVING the other durable inputs' states (a storage-backed map keyed by each
    input's name/role, written on each input's own `oninput`) is a step-7+ task —
    but their auto-restore stays OFF for now. SCOPE NUANCE (Open Question 8):
    momentary ACTION triggers that check→act→uncheck (Save/Reset/Delete/Close/New)
    have no meaningful resting state (always unchecked); the meaningful saved
    states are the DURABLE toggles/selections.

============================= VERIFIED DHCP REFERENCE FACTS (do NOT re-derive) ====
1. `toTagName(key)` is the JSON-key→custom-element-tag transform (camel/underscore
   → hyphen; a single-word key gets a TRAILING hyphen, so `id` → `id-`). The header
   cells and row cells ARE these tags, derived from whatever KEYS the JSON items
   have — the tag SET is DATA-SOURCED, not fixed (the `manage` data currently yields
   `id- name- created- updated- author- modified- type-`, but that follows the
   JSON). The invariant is the transform; `toTagName('id')='id-'` is the piece that
   matters for fact 2.
2. dhcp `forms.js` looks up the row id via `querySelector('label > id')` (looks
   for `<id>`), which NEVER matches the real `<id->` cell → id is always
   undefined → dhcp SAVE ALWAYS POSTs (never PUT); dhcp DELETE-by-id never fires
   (only the no-id DOM-remove branch works). This is dhcp's ACTUAL behavior (a
   latent bug). Do NOT silently fix — see Open Question 2.
3. dhcp has NO unsaved overlay / popover / `<dialog>` / mouse-leave / beforeunload
   anywhere (grep-verified). The guard is a NEW feature; only vestiges exist
   (`utils.unsavedCheck` defined-never-called, `config.CONFIRM_FLAGS` unused,
   `OPTIONS.warnOnBlur` unused).
4. dhcp FORM-LABEL text === COLUMN-HEADER text === `humanize(key)` =
   `toTagName(key).replace(/^item-/,'').replace(/-/g,' ').titleCase`. Header built
   in `injectPageContent`; form labels in the row→form builder as `humanize(key)+': '`.
   New-item rebuilds the header via `updateHeaderRow(li)`. The autocss `humanize()`
   is byte-identical to dhcp's derivation.
5. dhcp `createListItem` = TWO hidden inputs per row sharing one `<label>`: FIRST a
   checkbox `name="row-toggle"` (`oninput = handleRowToggle`) — it is the label's
   click target, and a checkbox UNTOGGLES on re-click, which is what lets a second
   click DESELECT the row; SECOND a radio `name="list-item"` (single-selection +
   `:checked` styling + the form-load query). `handleRowToggle`: if now checked,
   uncheck all OTHER `row-toggle` checkboxes (single-select); set
   `radio.checked = checkbox.checked`; then drive the row-select. MECHANISM:
   dhcp does `radio.dispatchEvent(new Event('input'))` to fire the radio's oninput;
   but `handleRowToggle` ALREADY runs from a REAL user event (the toggle
   checkbox's own `oninput`), so it can do the row-select DIRECTLY (a direct
   `rowSelectHandler()` call). Keep `dispatchEvent` to the SINGLE initial-load
   exception; the row-toggle needs no dispatch. Re-clicking the selected row →
   checkbox unchecks →
   `radio.checked=false` → handler finds no `:checked` row → fieldset cleared →
   aside closes via `fieldset:not(:empty)`.
6. dhcp triggers New/Save/Reset/Delete/Close via `<checkbox>.onchange` ×5 —
   FORBIDDEN → use `.oninput` (check → act → uncheck self).
7. API ERROR CONTRACT DIFFERS. dhcp `fetch.js` `putJSON`/`postJSON` THROW on
   failure (dhcp uses try/catch). autocss `api.js` `writeData` (`postJson`/
   `putJson`) RETURNS `null` on failure (no throw) and returns `parseJson(response)`
   on success; `deleteJson` returns `true`/`false`. So autocss must CHECK RETURN
   VALUES, not try/catch. CAUTION: a successful write with an empty/unparseable
   body → `parseJson` returns `null` → could be misread as failure; verify before
   treating `result === null` as an error.
8. dhcp error display: sets the main article intro `<p>`.textContent to
   "⚠️ Error saving/deleting record." + `console.error`.
9. dhcp Delete of a NEW (no-id) item also clears the header row
   (`headerUl.querySelector('li').innerHTML=''`).
10. dhcp `createInputFromKey` typing: select (required, blank "Select..." option +
    options, selected match) / toggle (checkbox checked if "true") / textarea
    (required if value) / datetime (readOnly, tabIndex -1) / default text with
    read-only heuristics: `key==='id'` OR 36-char uuid → readOnly + aria-disabled;
    ISO-Z date → datetime-local readOnly; key matches author|modified|created|
    updated → readOnly text; else text, `required = (val !== '')`, `pattern='.+'`.
    QUIRK: new-item EMPTY fields get `required=false` (unvalidated) — faithful to
    dhcp but flag it.

============================= OPEN QUESTIONS — RESOLVE WITH ME BEFORE BUILDING ====
1. UNSAVED-CHANGES GUARD (a stated requirement; original intent = Popover API,
   "not a modal but the other thing new to HTML," popping on mouse-LEAVE-VIEWPORT
   when there are unsaved changes). BLOCKED by: decision B (no dirty state → pure
   CSS cannot know "truly changed") AND the fact that `html:not(:hover)`
   leave-detection is broken. Needs a real design decision: drop for now / Popover
   API + a minimal JS leave+dirty detection / something else. ASK before building;
   do NOT re-add the broken overlay.
2. SAVE/DELETE id BEHAVIOR: dhcp always POSTs and never deletes-by-id (verified
   bug, fact 2). Keep faithful to dhcp (always POST) OR correct it so Save PUTs an
   existing record and Delete DELETEs by the real `<id->` cell? ASK.
3. "Form elements appear DELAYED" (user-reported, NOT yet diagnosed; it is NOT a
   fade — the form does not fade). Reproduce in a real browser and ASK what
   exactly is observed before changing anything.
4. RESOLVED (per user): the FORM is derived from the table's COLUMNS. The field
   SET + labels follow the column keys (header text === row cell tags === form
   label === `humanize(key)`). Mechanically DHCP reads those keys+values from the
   SELECTED ROW's cells (`updateFormFromSelectedRow` → `selectedRow.querySelectorAll(
   'label > *:not(input)')`), and each field's TYPE/tabindex/readonly/select-OPTIONS
   come from `getFieldRules()` = `inferFieldRules(items)` (inferred over the DATA,
   cached per endpoint) — NOT from the header element, which DHCP only rebuilds on
   new-item (`updateHeaderRow`) and clears on delete. (The table header is the FIRST
   of the two back-to-back `<ul>`s in `main/article`.) The user notes this
   column/row/rules coupling HAS TO CHANGE eventually; for step 7, PORT DHCP's
   working code FAITHFULLY to make it work, DOCUMENT it, and REVISIT later — do NOT
   redesign it now.
5. Error display: match dhcp (main intro `<p>`) or use the form's `aria-live <p>`?
6. Loading spinner: keep the existing single spinner in `layout.css`
   (`:root:has(article h1:empty)::before`) or adopt dhcp's `:checked`-driven
   dual-ring? Keep ONE.
7. Still pending from earlier: PWA `manifest.webmanifest` + `sw.js` (ANALYSIS Q4);
   `themes.css` color-scheme default = dark (dhcp fidelity) vs Rule 19 "light dark"
   auto-follow-OS (a 1-line flip, unconfirmed); confirm the API base = the dhcp
   mockapi is the intended data source.
8. STATE PERSISTENCE SCOPE (decision D). DECIDED per user: auto-RESTORE on load is
   NAV-ONLY — every other input is SAVED but NOT auto-restored (not yet). Still to
   confirm before building: (a) which inputs SAVE their state (durable state
   machines: selected row, open `<details>`/panels, theme + layout toggles; plus
   how to treat momentary action triggers Save/Reset/Delete/Close/New that reset to
   unchecked); (b) the storage key/shape (one state object keyed by each input's
   name/role under the existing `autocss.app.v1` record). (c) is SETTLED — there is
   NO orchestrated load/restore order: `oninput` is ONLY ever triggered by the
   state-machine inputs themselves (independent/decoupled); the sole automated
   startup action is read-storage + check the nav radio + dispatch `input` on it (a
   programmatic `.checked` does not auto-dispatch `oninput`, so dispatchEvent is the
   single sanctioned exception); all other inputs fire on the user's real
   selection; data-driven visibility (`display:none` until `:has()`/`:not(:empty)`)
   sequences everything naturally, one at a time.

============================= STEP 7 — BUILD PLAN (after the questions above) =====
CREATE:
(a) `assets/js/forms.js` — the CRUD form lifecycle:
    - `clearAsidePanel()` — uncheck the selected row's `row-toggle` + `list-item`,
      clear the fieldset (`replaceChildren`), remove inline styles on `<main>`,
      re-snapshot.
    - snapshot/restore for Reset (store the loaded values so Reset can restore the
      form fields AND the mirrored row).
    - `buildFormFromRow()` (row cells → labelled typed fields via
      `createInputFromKey(key, value, getFieldRules())`; each `input.oninput =
      mirrorToSelectedRow`); register it via `setRowSelectHandler`. This is the
      DHCP column/row/rules derivation (Open Question 4) — PORT IT FAITHFULLY for
      now and flag it to revisit later; do NOT redesign it.
    - New / Save / Reset / Delete / Close — each via `<checkbox>.oninput`
      (check → act → uncheck self). Save: gather non-readOnly fields →
      `denormalizeRecord(endpoint, data)` → `putJson(id)`/`postJson` (per the id
      decision) → reload via the oninput lifecycle → re-snapshot. Delete:
      `deleteJson(id)` or DOM-remove for a new (no-id) row.
    - NO dirty state, NO `data-*`, NO `form.oninput` button-state writer (decision B).
(b) a date module NAMED FOR ITS FUNCTION (e.g. `assets/js/format.js`) holding
    `formatDateForInput` — NOT a "utils" file.
(c) `assets/css/forms.css` — port dhcp's styling; reconcile color tokens to the
    autocss oklch set (`--input-bg`, `--input-border`, `--button-bg`(+hover),
    `--success`, `--error-soft`, `--error-strong`); KEEP cutting-edge
    `field-sizing: content`, `appearance: base-select`, `::picker(select)`,
    `option::checkmark`, `::picker-icon`; `:valid`/`:invalid` border-inline-start;
    gate Save with `aside form:has(:invalid)`; FIX dhcp's CSS bugs (malformed
    `rgba(var(--error-color).05)`, self-referential `--valid-border-color`, the
    `.error` class, and `[data-dirty]` gating — all forbidden).
(d) `assets/css/fallbacks.css` — `:empty`/`:has` empty-state messages; DROP the
    obsolete `nav details section:empty` fallback (the nav is static, never empty).
MODIFY:
(e) `assets/js/inject.js` — ADD `createInputFromKey`, `mirrorToSelectedRow`,
    `injectRowField`, `injectRowValues`, `updateHeaderRow`; EXPORT `humanize`; AND
    add the `row-toggle` checkbox + `handleRowToggle` to `createListItem` (this
    REVERSES the step-6 single-radio simplification — step 6 used one radio; step 7
    needs the two-input row so a re-click DESELECTS and closes the aside).
    `handleRowToggle` runs from the toggle checkbox's OWN real `oninput`, so it
    drives the row-select with a DIRECT `rowSelectHandler()` call — keeping
    `dispatchEvent` reserved for the single initial-load exception.
(f) `assets/js/oninput.js` — compute `inferFieldRules(record.items)` per endpoint
    (cache by endpoint) and export `getFieldRules()` so the form generator can type
    its inputs.
(g) `assets/js/app.js` — `import './forms.js'` (side-effect) so the form handlers
    register (DOM is ready: the script is at the end of `<body>`).
(h) `index.html` — `<link>` `forms.css` and `fallbacks.css`. The `<aside>` markup
    already exists: `<form><fieldset></fieldset><p aria-live="polite"></p>` +
    Close/Delete/Reset/Save `role="button"` labels with checkboxes, and
    `<h2 aria-live="polite">DETAILS</h2>`.
VERIFY every piece via the REAL trigger in chromium-over-http (one node process,
`ignoreHTTPSErrors`). For Save/Delete, avoid polluting the shared mockapi (use a
throwaway record, or ask first). Run regression on steps 1–6 after step 7.

============================= STEP 8 + REMAINING =================================
- Step 8: exercise ALL 12 nav endpoints (manage, faqs, api-registration, audit,
  option-set, option-types, scope-type, server-types, servers, credentials,
  variables, settings) — verify each loads and its form renders; full behavioral +
  regression pass (node tests + chromium).
- PWA: add `sw.js` (precache, offline SPA fallback) with an asset list matching
  autocss's actual files, and confirm/repair `manifest.webmanifest` (ANALYSIS §4,
  Q4). CLAUDE.md mandates PWA.
- `themes.css` color-scheme decision (Open Q7).
- Confirm the API base is the intended data source (Open Q7).
- Keep `PROGRESS.json` cursor + the NDJSON shard updated after each step (append
  only; never edit past records). Commit + push to
  `claude/lucid-hawking-E5Ej2` after each numbered step (check in with me first).

============================= DEFAULTS ==========================================
- Branch: `claude/lucid-hawking-E5Ej2` (push there, not `main`).
- Memory: `PROGRESS.json` (read first) + `progress/log-001.ndjson` (append-only).
- Assets carried from the `starter` base.
