// MARK: ONINPUT LIFECYCLE
// The single bridge between data and the UI. `oninput` on state-machine
// inputs is the ONLY entry point — fired both by user interaction AND
// programmatically by this runtime (startup). No event listeners, no
// click/change handlers. JS here is CRUD orchestration only; CSS owns all
// visibility/state. DOM *generation* (nav items, data grid, form fields)
// is provided by inject.js (step 6); this file orchestrates the lifecycle
// and calls those injectors.

import { requestData, logStage, logSuccess } from "./api.js";
import { NAV_ENDPOINT, BANNER_ENDPOINT, VERSION, OPTIONS } from "./config.js";
import { readPersistent, writePersistent } from "./storage.js";
import { injectNavText, injectPageContent } from "./inject.js";
import { normalizeRecord, normalizeItems } from "./schema.js";
import { inferFieldRules } from "./rules.js";

const STORAGE_KEY = "autocss.app.v1";
const COOKIE_KEY = "autocss.app.v1";

let isShellHydrated = false;

// Per-endpoint inferred field rules cache (ported from dhcp loaders.js).
// inferFieldRules() is computed once per endpoint and cached; the active set is
// exposed via getFieldRules() for the form generator (inject.createInputFromKey).
const RULES_CACHE = new Map();
let ACTIVE_RULES = {};

// The field rules for the most recently loaded endpoint.
export function getFieldRules() {
  return ACTIVE_RULES;
}

// Fetched navigation map, kept for the injector (step 6) and binding.
let navData = null;

// --- Shell (fetched/injected once per session) -----------------------------

// Inject banner text into <app-banner> (create the <p> slot if absent).
function injectBanner(text) {
  const message = (text ?? "").trim();
  document.querySelectorAll("app-banner").forEach(banner => {
    let p = banner.querySelector("p");
    if (!p) {
      p = document.createElement("p");
      banner.prepend(p);
    }
    p.textContent = message;
  });
}

// Inject the app version into <app-version>.
function injectVersion() {
  const el = document.querySelector("app-version");
  if (el) {
    el.textContent = `v${VERSION.version}`;
  }
}

// Fetch + inject the once-per-session shell (banner, nav map, version).
async function hydrateShell() {
  if (OPTIONS.showBanner) {
    const banner = await requestData(BANNER_ENDPOINT);
    const first = Array.isArray(banner) ? banner[0] : banner;
    injectBanner(first?.banner ?? "");
  }

  navData = await requestData(NAV_ENDPOINT);
  injectNavText(navData);

  injectVersion();

  isShellHydrated = true;
  logSuccess("Shell hydrated", {
    banner: OPTIONS.showBanner,
    navGroups: navData && typeof navData[0] === "object" ? Object.keys(navData[0]).length : 0
  });
}

// --- Per-endpoint data lifecycle -------------------------------------------

// Universal oninput lifecycle: fetch one endpoint's data and inject it.
export async function runOnInputLifecycle(endpoint) {
  console.clear();

  if (!endpoint) {
    logStage("validation", { message: "runOnInputLifecycle called without an endpoint" });
    return;
  }

  const data = await requestData(endpoint);

  if (!data) {
    return;
  }

  const raw = Array.isArray(data) ? data[0] : data;
  const record = normalizeRecord(endpoint, raw);
  record.items = normalizeItems(endpoint, raw.items || []);

  // Infer (and cache) the field rules for this endpoint so the form generator
  // can type its inputs (select/toggle/datetime/textarea/text).
  let rules = RULES_CACHE.get(endpoint);
  if (!rules) {
    rules = inferFieldRules(record.items);
    RULES_CACHE.set(endpoint, rules);
  }
  ACTIVE_RULES = rules;

  injectPageContent(endpoint, record);
  persistSelection(endpoint);

  logSuccess("Load complete", {
    endpoint,
    title: record?.title ?? "unknown",
    itemCount: record.items.length
  });
}

// --- Nav binding + startup --------------------------------------------------

// Bind every nav radio's oninput to the shared lifecycle (idempotent).
export function bindNavOnInput() {
  document.querySelectorAll("nav input[type='radio'][name='nav']").forEach(input => {
    input.oninput = () => runOnInputLifecycle(input.value);
  });
}

// Bind every scheme radio's oninput to PERSIST the chosen value (idempotent).
// The Light/Dark/System control is pure CSS for color (color-scheme.css reacts
// to :checked); JS only remembers the choice — NO lifecycle/data call here, and
// (unlike nav) NO dispatchEvent, because there is no data fetch to trigger.
export function bindSchemeOnInput() {
  document.querySelectorAll("input[type='radio'][name='scheme']").forEach(input => {
    input.oninput = () => persistColorScheme(input.value);
  });
}

// Enter the lifecycle by SELECTING a nav radio. NO nav radio is checked in the
// HTML by default. Select the persisted endpoint from browser memory (storage),
// or the first nav radio if there is none; check it and dispatch an `input`
// event on it so the input's OWN oninput fires the lifecycle. (A bare
// programmatic `.checked = true` does not dispatch oninput; dispatchEvent is the
// standards-native replacement for `.click()`. The script never calls the
// lifecycle itself.)
export function triggerInitialSelection() {
  const radios = [...document.querySelectorAll("nav input[type='radio'][name='nav']")];
  if (radios.length === 0) {
    return false;
  }

  const persisted = getInitialSelection();
  const target = radios.find(r => r.value === persisted) ?? radios[0];

  target.checked = true;
  target.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

// Restore the persisted color-scheme choice by SELECTING its radio. Mirrors the
// nav restore but with NO dispatchEvent: color is pure CSS, so `:has(:checked)`
// reacts to the property directly (this is not a data lifecycle; dispatch stays
// reserved for the nav-radio data call). If the stored value is absent or
// "system", do NOTHING — the System radio stays checked (HTML default) and CSS
// follows the OS.
export function restoreColorScheme() {
  const persisted = getInitialColorScheme();
  if (persisted !== "light" && persisted !== "dark") {
    return;
  }
  const radio = document.querySelector(`input[type='radio'][name='scheme'][value='${persisted}']`);
  if (radio) {
    radio.checked = true; // radios auto-uncheck the rest of the group
  }
}

// --- Persistence ------------------------------------------------------------

// Read the persisted endpoint selection.
export function getInitialSelection() {
  const state = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  return typeof state?.navigation?.endpoint === "string" ? state.navigation.endpoint : "";
}

// Read the persisted color-scheme choice ("light" | "dark" | "system" | "").
export function getInitialColorScheme() {
  const state = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  return typeof state?.colorScheme === "string" ? state.colorScheme : "";
}

// Persist the latest selected endpoint.
function persistSelection(endpoint) {
  const current = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  writePersistent(STORAGE_KEY, COOKIE_KEY, {
    ...current,
    navigation: { endpoint },
    updatedAt: new Date().toISOString()
  });
}

// Persist the latest color-scheme choice beside `navigation` in the same state.
function persistColorScheme(colorScheme) {
  const current = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  writePersistent(STORAGE_KEY, COOKIE_KEY, {
    ...current,
    colorScheme,
    updatedAt: new Date().toISOString()
  });
}

// --- Entry ------------------------------------------------------------------

// Initialize the runtime: hydrate the shell once, then enter the oninput
// lifecycle via a programmatic nav selection.
export async function initializeOnInputLifecycle() {
  console.clear();

  if (!isShellHydrated) {
    await hydrateShell();
  }

  bindNavOnInput();
  triggerInitialSelection();

  // Color-scheme control (CSS-driven): remember user choices and restore the
  // persisted one on load. Independent of the nav data lifecycle.
  bindSchemeOnInput();
  restoreColorScheme();
}

// Expose the fetched nav map for the injector (step 6).
export function getNavData() {
  return navData;
}
