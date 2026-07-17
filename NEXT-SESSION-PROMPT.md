# NEXT SESSION PROMPT — SAVE/DELETE DATA-MODEL FIX

This is the COMPLETION PROMPT for the next focused session. Paste it as the task.
It is ONE piece: make Save/Delete actually persist to the right place. Do NOT
bundle other backlog items (PWA, broad forms-compliance, unsaved-guard,
state-persistence, color-scheme) into this session — each is its own session.

>>> CONTEXT (read, do not re-litigate) <<<
The PORT-AS-IS parity build is DONE: steps 1–8 reached DHCP parity (the app
looks/behaves/works like DHCP across all 12 endpoints, nothing dropped). The
"comply-later" exception applied to THAT build only. This session fixes the ONE
remaining FUNCTIONAL gap discovered during the port: Save writes to the WRONG
LEVEL and Delete never hits the server. Everything else outstanding is
render/compliance and stays in the ledger for later sessions.

SINCE PARITY (also DONE — do not re-litigate): the MODULAR COLOR SYSTEM landed —
Phase 1→2 migration applied (consumers moved onto the `color-scheme.css` contract;
`themes.css` → `color-theme-66ccff.css` in OKLCH); EVERY CSS file is now wrapped in
its own `@layer <filename>`, and the load-order = cascade deconfliction is documented
in CLAUDE.md Rule 29; region panels + the selected-tab seam were tuned to 5% accent.
Tracking moved to GitHub: the backlog is mirrored as Issues #4–#14 (label `backlog`)
on the autocss Project board, governed by the new CLAUDE.md "Issue / Project-Board
Tracking" mandate (PROGRESS.json remains the single source of truth). THIS session =
**GitHub Issue #4** — close it when done so the board auto-moves it to Done.

Work on a fresh branch cut from the latest `main` (never direct-push to `main` — it is
branch-protected; promote via a PR merge). NOTE: `claude/lucid-hawking-E5Ej2` was
PROMOTED TO MAIN on 2026-07-01 (PR #2, merge commit `90a6a8b`) — ALL work + memory now
live on `main`, so branch off `main`. A fresh container may check out an EMPTY harness
default branch; switch to a branch based on the latest `main`. Confirm the current tip
with `git log -1` / `git ls-remote` if the local clone looks empty.

============================= READ FIRST, IN THIS ORDER =============================
1. `CLAUDE.md` — canonical, non-negotiable D7460N rules (now also Rule 29 `@layer`
   load-order deconfliction + the "Issue / Project-Board Tracking" mandate). This is a
   NEW focused session, so the as-is exception does NOT automatically apply here — see
   Open Question A about how compliant this fix must be.
2. `PROGRESS.json` — `meta`, `cursor` (phase/last/next/open_q). The first two
   `open_q` entries are THIS session (the defect + the residue cleanup).
3. `progress/log-001.ndjson` — read in full. CRUCIAL: the 2026-06-10 record
   `type=lesson`, topic "SAVE/DELETE DATA-MODEL DEFECT" is the complete root-cause
   analysis + OPTION A/B plan. Also the 2026-06-10 feature/test records (steps 7–8)
   and the maintenance/cleanup note.
4. `.agents/SESSION-HANDOFF.md` — the COMPLIANCE-DEBT LEDGER entry "SAVE/DELETE DATA-MODEL
   DEFECT" (detailed) and FUTURE SESSIONS #1. Re-assert the Constraint Lock.
5. `ANALYSIS.md` §8 addendum.

Reference repos: `DHCP` (the as-is source we ported; the FEATURE/LOOK reference) and
`starter` (the D7460N-correct but incomplete architecture reference).

============================= THE DEFECT (one-paragraph restatement) ===============
Saves SUCCEED (HTTP 200) but land at the wrong level. The READ model is nested —
`oninput.js` (~lines 96–98) takes `data[0]` and renders `record[0].items[]`. The
WRITE model is flat — `forms.js` Save does `postJson(endpoint, payload)` →
`POST {API_BASE}/{endpoint}` (`api.js` resolveEndpoint), which creates a NEW
top-level resource in the mockapi COLLECTION (a sibling of `[0]`), never inside
`record[0].items`. Compounded by the id-lookup bug: `forms.js` Save (~line 202) and
Delete (~line 258) use `querySelector('label > id')`, but the real cell tag is
`<id->` (toTagName adds a trailing hyphen to single-word keys), so `id` is ALWAYS
undefined → Save always POSTs/creates (the `putJson` branch is dead) and Delete
only removes the DOM row (the `deleteJson` branch is dead). Net: edits/new rows
never appear, stray top-level resources accumulate, server deletes never happen.
AFFECTS ALL 12 ENDPOINTS (all use the `[0].items` read model).

============================= THE TASK =============================================
Make Save and Delete operate on the SAME data the app reads (`record[0].items`),
so a Save shows up after reload and a Delete actually removes the item server-side.
Endpoint-agnostic: fixing it once fixes all 12.

RECOMMENDED = OPTION A (keep the current mockapi shape; least churn):
1. Fix BOTH id selectors in `forms.js` from `label > id` → `label > id-` (match the
   real `<id->` cell) so the row's item id resolves for edit + delete.
2. Carry `record[0]`'s REAL top-level resource id through the read layer so writes
   can target the resource. Today `oninput.js` takes `data[0]` but the rendered
   record does not expose that resource id. Add a SMALL shared accessor in
   `oninput.js` (e.g. `getActiveResourceId()` / a getter), NOT global mutable state
   — idempotent/stateless per CLAUDE.md. (The mockapi `manage` resource's real
   top-level `id` may be absent/odd on `[0]`; CONFIRM what `raw[0].id` actually is
   per endpoint before relying on it — see Open Question B.)
3. Re-model the WRITE so it edits the resource's `items[]`:
   - SAVE (edit): find the item in `record[0].items` by its item id, replace its
     fields with the (denormalized) form values; for a NEW item, append it; then
     `PUT {endpoint}/{resourceId}` with the WHOLE updated resource. Then reload via
     `runOnInputLifecycle(endpoint)` so the table re-renders from the server truth.
   - DELETE: remove the item from `record[0].items` by id, then
     `PUT {endpoint}/{resourceId}` the updated resource (or, for a never-saved new
     item, just remove the DOM row as today). Reload.
   - Keep `normalizeRecord`/`denormalizeRecord` symmetric (schema.js) — items go
     out in API field names (itemName, …).
ALTERNATIVE = OPTION B (cleaner data model, more work): restructure the backend so
each ITEM is its own mockapi resource with real per-item routes (POST/PUT/DELETE
`{endpoint}/{itemId}`), and point BOTH read and write at the same flat level (the
app would fetch a flat item list per endpoint instead of `[0].items`). Only choose
B if the user wants the data model itself reworked (Open Question A/C).

============================= HARD CONSTRAINTS =====================================
- DO NOT break the READ rendering (steps 6–8). After the fix, all 12 endpoints must
  still load + render exactly as they do now (re-run the step-8 all-12 test).
- ONE API base, declared once in `api.js`; only the endpoint suffix varies. Do NOT
  add a second base or redirect endpoints. (External-service rule still applies: if
  the mockapi fails, STOP and report — do not invent local fallbacks.)
- Idempotent/stateless JS, no global mutable state, `document.querySelector` for
  targeting, no event listeners. `oninput` is the single bridge; `dispatchEvent` is
  sanctioned ONLY for the initial-load nav selection.
- This fix deliberately leaves the compliance-vs-functional scope OPEN (Open
  Question A): do NOT assume a default — ASK the user at the start of the session
  whether this fix also converts the touched code to D7460N compliance
  (onchange→oninput, drop `data-dirty/valid` → CSS `:has(:invalid)`,
  innerHTML→replaceChildren) or stays minimal/functional with compliance left to the
  separate forms-compliance session(s) (#3). Both are defensible; it is the user's
  call. Wait for the answer before coding.

============================= ALSO IN THIS SESSION =================================
Finish the shared-mockapi residue cleanup (started for `manage` only). Residue
remains on faqs (+7), option-set (+3), audit (+1), servers (+1), and `manage`
(+11 seed-ish). Audit EVERY endpoint; the legit record is the one with `title` +
`items`. CAUTION: mockapi decorates resources with faker `name`/`avatar`/`createdAt`,
and `name` collides with the data `name` field, so automated classification is
unreliable — REVIEW borderline records MANUALLY and confirm with the user before
mass-deleting beyond the obvious Save-residue ({itemName/itemType, no items/title}).

============================= TEST RECIPE (this env) ===============================
- Real trigger ONLY: simulate the actual user path (click the row/label/button;
  fill/selectOption) so the real `oninput`/`onchange` fires. NEVER call handlers
  directly and call it tested. NEVER claim tested unless the real path ran and you
  observed the result in a real browser.
- This env kills backgrounded servers: run the static server AND the Playwright
  chromium test in ONE foreground node process (`createServer.listen(127.0.0.1,
  PORT)` → `chromium.launch` → `goto http://127.0.0.1:PORT` → assert/screenshot →
  `server.close()`), `newContext({ ignoreHTTPSErrors: true })` (egress MITM cert).
  Playwright module: `import pkg from '/opt/node22/lib/node_modules/playwright/
  index.js'; const {chromium}=pkg;`. Chromium lives at `/opt/pw-browsers`
  (`PLAYWRIGHT_BROWSERS_PATH`); if missing on a fresh boot run
  `playwright install chromium` (network=Full).
- Node logic tests: `node --test 'tests/*.test.mjs'` (GLOB form; directory form
  fails on node22).
- ACCEPTANCE for this session:
  1. Edit an existing row → Save → after the lifecycle reload, the EDIT PERSISTS
     and is visible in the table (verify via API GET that `record[0].items` changed,
     and via the re-rendered DOM).
  2. New Item → fill → Save → the new row PERSISTS in `record[0].items` and shows
     after reload.
  3. Delete a saved row → it is REMOVED from `record[0].items` server-side and gone
     after reload (verify via API GET).
  4. No stray top-level resources are created by Save (collection top-level count
     unchanged across a Save). Use a THROWAWAY record and CLEAN IT UP (direct API
     DELETE) so the shared API is left as you found it.
  5. Regression: step-8 all-12 endpoints still load/render; node tests still pass;
     the step-7 behavioral suite (row-select/mirror/Reset/New/Close) still passes.

============================= CADENCE / HARD RULES =================================
- File-by-file. Stop and ask on ANY doubt. NEVER guess; the user determines what is
  correct. Resolve the Open Questions BELOW with the user BEFORE writing code.
- Check in before your FIRST push and after the fix is verified. Commit + update
  `PROGRESS.json` cursor + append to `progress/log-001.ndjson` (append-only; never
  edit past records) + update `.agents/SESSION-HANDOFF.md` (mark the defect FIXED, move it
  out of the open items, refresh the LEDGER/cursor) + CLOSE GitHub Issue #4 (state
  closed, reason completed) so the Project board auto-moves it to Done — per the
  CLAUDE.md "Issue / Project-Board Tracking" mandate.
- Treat live writes with care (throwaway record; clean up). Do NOT delete others'
  records or seed data without explicit confirmation.

============================= OPEN QUESTIONS (resolve BEFORE coding) ===============
A. SCOPE/COMPLIANCE (left OPEN on purpose — ASK the user, no default assumed):
   Should this session ALSO make the touched Save/Delete code D7460N-compliant
   (onchange→oninput check→act→uncheck; remove `form.dataset.dirty/valid` → CSS
   `:has(:invalid)`; innerHTML→replaceChildren), or stay FUNCTIONAL-ONLY (minimal
   change to fix persistence) and leave compliance to the separate forms-compliance
   session(s)? Both are defensible (the backlog currently separates them); it is the
   user's call. Do NOT pick a default — ask first and wait.
B. RESOURCE ID: Confirm what `raw[0].id` actually is for each endpoint (the legit
   `manage` record printed an `undefined` top-level id during investigation). If the
   read-anchor resource has no stable id, OPTION A's `PUT {endpoint}/{resourceId}`
   needs a reliable id source — settle this first (it may force OPTION B).
C. MODEL CHOICE: OPTION A (PUT the whole `record[0]`) vs OPTION B (per-item routes /
   reshape the data). Recommend A unless the user wants the data model reworked.
D. CLEANUP SCOPE: For the residue sweep, confirm whether to delete only obvious
   Save-residue or also the faker/seed-shaped records, per endpoint.

============================= DO-NOT-REPEAT =======================================
- Never claim something is wired/tested unless the REAL trigger ran and you observed
  it in a browser (a prior step-7 attempt was reverted for false "tested" claims).
- Never add features the user didn't ask for (a prior attempt invented a broken
  unsaved-changes overlay; `html:not(:hover)` is NOT a mouse-leave detector).
- Never assert behavior from reading code — observe it.
- Do NOT touch `CLAUDE.md` (canonical) or `ORIGINAL-PROMPT.md` (historical).

============================= DEFAULTS ============================================
- Branch: cut a fresh branch from the latest `main`. `claude/lucid-hawking-E5Ej2` was
  merged to `main` 2026-07-01 (PR #2, `90a6a8b`); never direct-push to protected `main`
  (promote via PR merge).
- Memory: `PROGRESS.json` (read first) + `progress/log-001.ndjson` (append-only).
- Data source: the one mockapi base in `api.js` (DHCP domain).
