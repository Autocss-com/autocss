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

const STORAGE_KEY = "autocss.app.v1";
const COOKIE_KEY = "autocss.app.v1";

let isShellHydrated = false;

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
  // STEP 6 seam: injectNavItems(navData) builds <nav><details><section>
  // <label><input type="radio" name="nav" value="<endpoint>"> groups, then
  // bindNavOnInput() wires their oninput and triggerInitialSelection() runs.

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

  // STEP 6 seam: injectPageContent(endpoint, normalizeRecord(data)) builds the
  // <h1>/<p>, the dual-<ul> data table, and the <select>s via toTagName.

  persistSelection(endpoint);

  const record = Array.isArray(data) ? data[0] : data;
  logSuccess("Load complete", {
    endpoint,
    title: record?.title ?? "unknown",
    itemCount: Array.isArray(record?.items) ? record.items.length : 0
  });
}

// --- Nav binding + startup --------------------------------------------------

// Bind every nav radio's oninput to the shared lifecycle (idempotent).
export function bindNavOnInput() {
  document.querySelectorAll("nav input[type='radio'][name='nav']").forEach(input => {
    input.oninput = () => runOnInputLifecycle(input.value);
  });
}

// Enter the lifecycle by CHECKING the right nav radio (never a synthetic
// click or dispatched event). Checking is the single signal: it drives the
// CSS state machine (:checked) AND the data call. Selection priority:
// persisted (return visit) -> statically-checked default -> first radio.
// Programmatically setting .checked does NOT fire oninput, so we run the
// lifecycle for the checked input directly.
export function triggerInitialSelection() {
  const radios = [...document.querySelectorAll("nav input[type='radio'][name='nav']")];
  if (radios.length === 0) {
    return false;
  }

  const persisted = getInitialSelection();
  const target =
    radios.find(r => r.value === persisted) ??
    radios.find(r => r.checked) ??
    radios[0];

  target.checked = true;
  runOnInputLifecycle(target.value);
  return true;
}

// --- Persistence ------------------------------------------------------------

// Read the persisted endpoint selection.
export function getInitialSelection() {
  const state = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  return typeof state?.navigation?.endpoint === "string" ? state.navigation.endpoint : "";
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
}

// Expose the fetched nav map for the injector (step 6).
export function getNavData() {
  return navData;
}
