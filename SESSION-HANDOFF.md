CONTINUE AND COMPLETE THIS BUILD. This is a fresh session; prior chat context did
NOT carry over — everything you need is in this repo. The COMPLETE original spec is
in `ORIGINAL-PROMPT.md`. Steps 1–6 of its Build order are DONE, verified, AND
D7460N-compliant. A compliant rewrite of step 7 was attempted and FULLY REVERTED.

>>> STRATEGY OVERRIDE (deliberate, ONE-TIME, user-confirmed) <<<
To FINISH the app, PORT DHCP's remaining functionality AS-IS — it works — to reach
DHCP parity with NOTHING dropped. Do NOT rewrite it to D7460N compliance during the
port. THEN refine compliance (and add the PWA) in SEPARATE, focused future
sessions — ONE piece per session, each with its own handoff doc. "Comply later" is
a conscious decision for THIS BUILD ONLY — NOT a new policy. CLAUDE.md is still
canonical; every pattern we port that violates it is tracked in the COMPLIANCE-DEBT
LEDGER below and fixed later. PRESERVE all already-completed compliant work
(steps 4–6) and ALL memory/handoff docs — the point is to finish across multiple
sessions with accurate memory and zero drift.

Work on branch `claude/lucid-hawking-E5Ej2` (push there, never `main`). Stop and ask
on ANY doubt. Check in before your FIRST push and after each numbered step. Do NOT
drop any DHCP functionality. Do NOT add any feature DHCP does NOT have (e.g. the
unsaved-changes guard — that's a future feature session, see backlog).

============================= READ FIRST, IN THIS ORDER =============================
1. `CLAUDE.md` — canonical, non-negotiable D7460N architecture rules (still the
   target; the port-as-is below is an explicit, logged, one-time exception).
2. `ORIGINAL-PROMPT.md` — the full original plan/spec (goal, KEEP-&-MODERNIZE
   heuristic, HTML/scope reality, D7460N compliance, JS authoring conventions,
   cadence, memory standard, build order). NOTE: its "port capabilities, not code;
   rewrite to compliance as you port" is SUPERSEDED for this build by the strategy
   override above (logged 2026-06-07). The historical prompt is left unchanged.
3. `PROGRESS.json` — read the `meta` and the `cursor` (phase/last/next/open_q).
4. `progress/log-001.ndjson` — the append-only memory shard. READ IT IN FULL.
   Pay special attention to every record dated 2026-06-07 (the step-7 handoff;
   the revert; the carried-forward decisions; VERIFIED dhcp facts; the dispatchEvent
   decision; the state-persistence principle; the JSON-sourced-content correction;
   the port-as-is strategy decision) and lines 35–37 (step-7 requirements, the
   popover/undo finding, the forms line-by-line inventory).
5. `starter/.agents/SESSION-HANDOFF.md` — the prior Constraint Lock (re-assert it).
6. `ANALYSIS.md` — the dhcp→starter file reconciliation and per-file verdicts.

Reference repos in scope: `DHCP` (messy-but-complete working prototype = the
FEATURE + LOOK reference, and now the literal SOURCE we port from) and `starter`
(the D7460N-correct but incomplete architecture reference). `autocss` (this repo)
= the completion. End state: look/behave/work like DHCP now; become fully D7460N
through the later refinement sessions.

============================= GROUND TRUTH / CURRENT STATE =========================
- Branch `claude/lucid-hawking-E5Ej2`. HEAD = the latest commit on the branch (the
  step-7 handoff + this session's corrections), on top of `31c7925`. Tree clean.
- DONE + verified + COMPLIANT: steps 1–6 (DO NOT replace these with DHCP versions).
  - Step 4 = transport/lifecycle (`config.js`, `env.js`, `api.js` incl. write
    methods, `storage.js`, `oninput.js`).
  - Step 5 = data shaping (`schema.js`, `rules.js`) with node tests (7/7).
  - Step 6 = generation/`inject.js`: nav is STATIC HTML (text injected, not
    generated); the ONLY generated DOM is data-table cells = custom elements from
    the JSON item KEYS via `toTagName()` with the JSON VALUES injected. EVERYTHING
    rendered into the page is SOURCED FROM THE JSON — the `<h1>` title, the intro
    `<p>`, the column-header labels, the table rows, and (in step 7) the per-record
    form fields. NOTHING is hardcoded. The SPECIFIC values (header keys, row count)
    come from the live JSON and CHANGE with the data — do NOT treat them as
    invariants. The only code-level invariant is the `toTagName()` transform.
  - NO nav radio is `checked` in the HTML by default. On load the runtime reads the
    persisted endpoint from browser storage (`storage.js`) and SELECTS it, else the
    FIRST nav radio: `input.checked = true` then `input.dispatchEvent(new
    Event('input', { bubbles: true }))` so the radio's OWN `oninput` fires the
    lifecycle. The script never calls the lifecycle itself; never `.click()`. This
    storage-restore is the STARTER convention, not DHCP (DHCP has no storage and
    defaults to the first page). `dispatchEvent` here is the SINGLE sanctioned
    exception (the one programmatic selection with no real user event).
- Step 7 (a COMPLIANT rewrite) was implemented (commits 21bdf93, 2abd648) then
  FULLY REVERTED via `git reset --hard 31c7925` + force-push (it improvised features
  and falsely claimed things were tested). We are now porting AS-IS instead.
- Files that DO NOT currently exist: `assets/js/forms.js`, `assets/js/format.js`,
  `assets/css/forms.css`, `assets/css/fallbacks.css`.
- `assets/js/inject.js` `createListItem` currently builds a row with ONLY the
  `list-item` radio (the `row-toggle` checkbox is NOT there yet).
- Data source = a shared live mockapi (one API base, endpoint suffix varies).
  Save/Delete write to it — treat writes with care (throwaway record / ask).

============================= CADENCE / HARD RULES (STILL APPLY) ==================
- File-by-file. Stop and ask on ANY doubt. Check in before the FIRST push and after
  each numbered step. Commit + update `PROGRESS.json` cursor + the NDJSON shard
  after each step (append-only; never edit past records).
1. TEST ONLY VIA THE REAL TRIGGER. Exercise the actual user path (simulate the click
   on the row/label/button so the real `oninput`/`onchange` fires). NEVER call
   handler functions directly and call that "tested." NEVER say something is tested,
   wired, or working unless the real path actually ran and you observed the result.
2. NEVER ASSERT BEHAVIOR FROM READING CODE — observe it in a real browser.
3. NEVER ADD CODE, FILES, OR FEATURES NOT REQUESTED. Porting as-is means MATCH DHCP;
   do not "improve," redesign, or invent (the reverted attempt invented a broken
   unsaved-changes overlay — do not).
4. MATCH DHCP EXACTLY during the port. If DHCP looks buggy (e.g. the id lookup,
   fact 2), PORT THE BUG AS-IS and log it in the ledger; do not silently fix.
5. Test environment recipe (this env kills backgrounded servers): run the static
   file server AND the Playwright chromium test in ONE foreground node process
   (`createServer.listen(127.0.0.1:PORT)` → `chromium.launch` → `goto` → assert/
   screenshot → `server.close()`), `ignoreHTTPSErrors: true` (egress MITM cert).
   Node tests: GLOB form `node --test 'tests/*.test.mjs'`.

============================= DO-NOT-REPEAT (the reverted attempt's mistakes) =====
- The unsaved-changes OVERLAY was IMPROVISED (not in DHCP) and BROKEN: `html:not(
  :hover) app-container:has(aside form fieldset:not(:empty))::after`. `html:not(
  :hover)` is TRUE whenever the pointer is not over page CONTENT (scrollbar, browser
  chrome, another window, before mouse enters), so it showed "every time the form is
  open." NEVER use `html:not(:hover)` for mouse-leave. Do not re-add it.
- Falsely claimed "all wired"/"tested end-to-end" while the real selection path did
  not exist (the test synthesized `radio.checked=true; radio.oninput()`).
- Assumed the form fade from reading `transitions.css` (it does not fade).
- Skipped reading the session handoff at start.

============================= STEP 7 — PORT DHCP'S CRUD FORMS AS-IS ===============
Bring DHCP's working CRUD over AS-IS (keep its patterns: `.onchange`, `data-dirty/
valid`, `innerHTML`, `radio.dispatchEvent`, console debug, the `label > id`
lookup). Adapt ONLY what's needed to wire DHCP's code into autocss's EXISTING
compliant modules (different names/contracts). Goal = DHCP parity, nothing dropped.
- Port DHCP `assets/js/forms.js` → autocss `assets/js/forms.js` AS-IS. Adapt
  imports: DHCP `postJSON/putJSON/deleteJSON` → autocss `api.js`
  `postJson/putJson/deleteJson` (NOTE error contract differs, fact 7 — autocss
  returns null/false instead of throwing; DHCP's try/catch will simply not catch,
  which is fine for now, log it); DHCP `loadPageContent` → autocss
  `runOnInputLifecycle`; DHCP `getFieldRules` → autocss `getFieldRules` (add it,
  below); DHCP `denormalizeRecord` → autocss `schema.js`; DHCP inject fns → autocss
  `inject.js`.
- Port DHCP's form-related `inject.js` functions AS-IS into autocss `inject.js`:
  `createInputFromKey`, `mirrorToSelectedRow`, `injectRowField`, `injectRowValues`,
  `updateHeaderRow`; AND restore the TWO-input row in `createListItem` — the
  `row-toggle` checkbox + `handleRowToggle` WITH DHCP's `radio.dispatchEvent(new
  Event('input'))` AS-IS (the row-toggle→radio dispatch; fixing this to a direct
  call is a ledger item). Per Open-Q4/fact: the form's field SET + labels follow
  the table COLUMNS — keys+values read from the SELECTED ROW's cells, types/options
  from `getFieldRules()` (inferred over the data). Port this exactly; revisit later.
- Port DHCP's form helpers AS-IS (DHCP `utils.js`: `snapshotForm`,
  `hasUnsavedChanges`, `restoreFormFields`, `isFormValid`, `formatDateForInput`,
  `removeInlineStyles`, `clearFieldset`). Keep the `utils` shape for now; splitting
  into concern-named modules is a ledger item.
- Bring DHCP `loaders.js` RULES_CACHE/`getFieldRules` over (compute
  `inferFieldRules(items)` per endpoint, cached) and wire it into autocss's
  lifecycle so the form generator can type its inputs.
- Port DHCP CSS AS-IS: `assets/css/forms.css`, `fallbacks.css`, `loading.css`;
  `<link>` them in `index.html`. (Token/oklch reconcile + de-`data-*` = ledger.)
- Wire `forms.js` into the app so its handlers register (DOM is ready: script at end
  of `<body>`). The `<aside>` markup already exists (`<form><fieldset></fieldset>
  <p aria-live="polite"></p>` + Close/Delete/Reset/Save role=button labels with
  checkboxes; `<h2 aria-live="polite">DETAILS</h2>`).
GOAL/verify (REAL trigger, chromium-over-http): click a row → form loads; edit →
mirrors to the row; New/Save/Reset/Delete/Close all behave like DHCP. Save/Delete
hit the shared mockapi — use a throwaway record or ask. Run regression on steps 1–6.

============================= STEP 8 — DATASETS + REGRESSION (after parity) =======
Exercise ALL 12 nav endpoints (manage, faqs, api-registration, audit, option-set,
option-types, scope-type, server-types, servers, credentials, variables, settings):
confirm each loads + its form renders like DHCP; full behavioral + regression pass
(node tests + chromium). This completes DHCP PARITY.

============================= FUTURE SESSIONS — each its OWN session + handoff =====
Do these AFTER parity, ONE focused piece per session. Each session: read
`PROGRESS.json` + the newest shard + this handoff; do the ONE piece; test via the
REAL trigger; update the memory shard + this handoff; commit. This keeps accurate
cross-session memory and avoids drift.
1. PWA — add `sw.js` (precache + offline SPA fallback, asset list = autocss's real
   files) and confirm/repair `manifest.webmanifest`. (ANALYSIS §4 / Q4.) Own session.
2. Forms D7460N compliance — work the COMPLIANCE-DEBT LEDGER below; likely several
   focused sessions (triggers; dirty/valid→CSS; innerHTML→replaceChildren;
   row-toggle dispatch→direct; id-lookup; error display; spinner; naming/utils split).
3. Unsaved-changes GUARD — a NEW feature (Popover API, "not a modal but the other
   thing"), DHCP has NONE. Own session. Do NOT add during the port.
4. State-persistence generalization (decision D) — own session.
5. color-scheme + any remaining cross-cutting items.

============================= D7460N COMPLIANCE-DEBT LEDGER (fix in future sessions)
What we KNOWINGLY port as-is / defer, plus the decisions already taken this session
for HOW to fix each later:
- Form triggers: DHCP `.onchange` ×5 → `.oninput` (check → act → uncheck self).
- Dirty/valid: DHCP `form.dataset.dirty/valid` + `updateButtonStates` → pure CSS.
  DECISION (B): "no dirty state / record-open proxy" (aside visibility =
  `fieldset:not(:empty)`; Save gated `aside form:has(:invalid)`); tension noted
  (can't detect true "changed"; Reset keeps record open). Revisit when doing this.
- Undo/Reset: DECISION (A) = native per-input undo + Reset → `restoreForm` (restore
  fields + mirrored row); NO custom history stack, NO Ctrl+Z/X JS.
- `innerHTML` (`clearFieldset`, `headerLi.innerHTML=''`) → `replaceChildren`.
- Row-toggle: DHCP `radio.dispatchEvent(new Event('input'))` → DIRECT
  `rowSelectHandler()` call (the toggle's own real `oninput` already fires).
  NOTE: `dispatchEvent` is sanctioned ONLY for the single initial-load nav selection
  (CLAUDE.md "JS Runtime Conventions"); the row-toggle should NOT use it.
- id-lookup: DHCP `querySelector('label > id')` never matches the real `<id->` cell
  → SAVE always POSTs / DELETE-by-id never fires (fact 2). DECISION needed (was
  Q2): keep faithful (always POST) vs fix to `label > id-` (PUT/DELETE by id).
- Error display: DHCP writes the main article intro `<p>` (fact 8) — decide vs the
  form's `aria-live <p>` (was Q5).
- Loading spinner: reconcile DHCP `:checked`-driven dual-ring vs autocss's single
  `:root:has(article h1:empty)::before` — keep ONE (was Q6).
- `createInputFromKey` QUIRK: new-item EMPTY fields get `required=false`
  (unvalidated) — faithful to DHCP; revisit.
- `rules.js`: dead `number`-type branch (values are stringified) — faithful to DHCP.
- Naming: DHCP `utils.js` → split into concern-named modules (NO `utils`/`helpers`).
- CSS: forms.css token/oklch reconcile, de-`data-*` gating, fix DHCP css bugs
  (malformed `rgba(var(--error-color).05)`, self-ref `--valid-border-color`,
  `.error` class); fallbacks.css drop the obsolete `nav details section:empty`.
- State persistence (decision D): every state-machine input SAVES its boolean to
  storage on its own `oninput`; auto-RESTORE is NAV-ONLY for now; generalize later
  (which inputs + storage shape still open). `oninput` is independent/decoupled;
  there is NO orchestrated load/restore order.
- color-scheme: dark (DHCP fidelity) vs Rule 19 `light dark` auto-follow-OS.
- Principles to preserve through refinement: all page content is JSON-sourced (no
  hardcoding); `:checked` is the single source of truth for CSS state + the data
  call; `humanize()` derives header/label text identically.

============================= DECISIONS ALREADY MADE (for the refinement sessions) =
(A) UNDO/REDO = native per-input browser undo + Reset → `restoreForm`. No history
    stack, no Ctrl+Z/X JS.
(B) DIRTY SIGNAL = "pure CSS, record-open proxy." No dirty state, no `data-dirty`;
    aside visibility = `fieldset:not(:empty)`; Save gated `:has(:invalid)`. Reset
    (restores values, record stays open) does NOT close the aside — only Save
    (reload repopulates) or Close (clears fieldset) closes it.
(C) Save gating = `aside form:has(:invalid)` (validity only). Reset/Delete/Close
    available whenever a record is open.
(D) STATE PERSISTENCE — GENERAL PRINCIPLE. State always changes through USER input,
    sole exception (so far) = first load (the sanctioned `dispatchEvent` nav
    selection); `oninput` is independent and decoupled. INTENT: EVERY state-machine
    `<input>` (radio OR checkbox) SAVES its boolean state to storage on its own
    `oninput`, so those booleans can be controlled/manipulated "when we need them
    later." BUT do NOT auto-RESTORE them on load — NOT yet. The ONLY state restored
    from history on load is the NAV radio. Generalizing the SAVE (durable inputs)
    is a future task; auto-restore of others stays OFF. Momentary ACTION triggers
    (Save/Reset/Delete/Close/New, check→act→uncheck) have no meaningful resting
    state; the meaningful saved states are the DURABLE toggles/selections.

============================= VERIFIED DHCP REFERENCE FACTS (do NOT re-derive) ====
(These tell you exactly what the as-is port will do and what each compliance fix
targets.)
1. `toTagName(key)` is the JSON-key→custom-element-tag transform (camel/underscore
   → hyphen; a single-word key gets a TRAILING hyphen, so `id` → `id-`). Header
   cells and row cells ARE these tags, derived from whatever KEYS the JSON items
   have — the tag SET is DATA-SOURCED, not fixed (the `manage` data currently yields
   `id- name- created- updated- author- modified- type-`, but that follows the JSON).
   The invariant is the transform; `toTagName('id')='id-'` matters for fact 2.
2. dhcp `forms.js` looks up the row id via `querySelector('label > id')` (looks for
   `<id>`), which NEVER matches the real `<id->` cell → id is always undefined →
   dhcp SAVE ALWAYS POSTs (never PUT); dhcp DELETE-by-id never fires (only the no-id
   DOM-remove branch works). dhcp's ACTUAL behavior (a latent bug). Port as-is; fix
   later (ledger).
3. dhcp has NO unsaved overlay / popover / `<dialog>` / mouse-leave / beforeunload
   anywhere (grep-verified). The guard is a NEW feature; only vestiges exist
   (`utils.unsavedCheck` defined-never-called, `config.CONFIRM_FLAGS` unused,
   `OPTIONS.warnOnBlur` unused).
4. dhcp FORM-LABEL text === COLUMN-HEADER text === `humanize(key)` =
   `toTagName(key).replace(/^item-/,'').replace(/-/g,' ').titleCase`. Header built
   in `injectPageContent`; form labels in the row→form builder as `humanize(key)+': '`.
   New-item rebuilds the header via `updateHeaderRow(li)`. autocss `humanize()` is
   byte-identical. The form's field SET follows the table COLUMNS; keys+values come
   from the SELECTED ROW's cells, types/options from `getFieldRules()`
   (`inferFieldRules` over the data). Port as-is; revisit the coupling later.
5. dhcp `createListItem` = TWO hidden inputs per row sharing one `<label>`: FIRST a
   checkbox `name="row-toggle"` (`oninput = handleRowToggle`) — the label's click
   target; a checkbox UNTOGGLES on re-click = lets a second click DESELECT the row;
   SECOND a radio `name="list-item"` (single-selection + `:checked` styling + the
   form-load query). `handleRowToggle`: if now checked, uncheck all OTHER
   `row-toggle` checkboxes; set `radio.checked = checkbox.checked`; then dhcp does
   `radio.dispatchEvent(new Event('input'))` to fire the radio's oninput. PORT THIS
   AS-IS (the dispatch); the compliance fix (→ direct `rowSelectHandler()` call) is
   a ledger item. Re-clicking the selected row → checkbox unchecks → `radio.checked=
   false` → handler finds no `:checked` row → fieldset cleared → aside closes via
   `fieldset:not(:empty)`.
6. dhcp triggers New/Save/Reset/Delete/Close via `<checkbox>.onchange` ×5. Port
   as-is; → `.oninput` is a ledger item.
7. API ERROR CONTRACT DIFFERS. dhcp `fetch.js` `putJSON`/`postJSON` THROW on failure
   (try/catch). autocss `api.js` `writeData` RETURNS `null` on failure (no throw),
   `parseJson(response)` on success; `deleteJson` returns `true`/`false`. When you
   wire DHCP forms.js to autocss api.js, DHCP's try/catch simply won't catch (calls
   resolve to null/false) — acceptable for the port; note for the compliance pass.
   CAUTION: a successful write with empty/unparseable body → `parseJson` null →
   could read as failure.
8. dhcp error display: sets the main article intro `<p>`.textContent to "⚠️ Error
   saving/deleting record." + `console.error`.
9. dhcp Delete of a NEW (no-id) item also clears the header row
   (`headerUl.querySelector('li').innerHTML=''`).
10. dhcp `createInputFromKey` typing: select (required, blank "Select..." option +
    options, selected match) / toggle (checkbox checked if "true") / textarea
    (required if value) / datetime (readOnly, tabIndex -1) / default text with
    read-only heuristics: `key==='id'` OR 36-char uuid → readOnly + aria-disabled;
    ISO-Z date → datetime-local readOnly; key matches author|modified|created|
    updated → readOnly text; else text, `required = (val !== '')`, `pattern='.+'`.
    QUIRK: new-item EMPTY fields get `required=false` (unvalidated).

============================= REMAINING CROSS-CUTTING =============================
- Confirm the API base = the DHCP mockapi is the intended data source (steps 4–6
  already use it and work, so effectively confirmed; flag if you change endpoints).
- "Form elements appear DELAYED" was a user report during the REVERTED rewrite — it
  is NOT a fade. After the as-is port, observe whether it reproduces; if DHCP does
  not have it, the port won't. Do not chase it speculatively.

============================= DEFAULTS ==========================================
- Branch: `claude/lucid-hawking-E5Ej2` (push there, not `main`).
- Memory: `PROGRESS.json` (read first) + `progress/log-001.ndjson` (append-only).
- Assets carried from the `starter` base.
