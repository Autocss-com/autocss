// MARK: APP ENTRY
// Startup wiring only: reset the console, persist environment metadata, and
// hand off to the oninput lifecycle. No UI logic lives here.

import { initializeOnInputLifecycle } from "./oninput.js";
import { logSuccess } from "./api.js";
import { readPersistent, writePersistent } from "./storage.js";
import { ENV } from "./env.js";
// Side-effect import: registers the CRUD form handlers (row->form, New/Save/
// Reset/Delete/Close) and the row-select handler. DOM is ready (script at end
// of <body>). Loaded before the lifecycle runs so the seam is registered first.
import "./forms.js";

const STORAGE_KEY = "autocss.app.v1";
const COOKIE_KEY = "autocss.app.v1";

// Persist runtime environment metadata for future onboarding/tour flows.
function persistEnvironment() {
  const current = readPersistent(STORAGE_KEY, COOKIE_KEY, {});
  return writePersistent(STORAGE_KEY, COOKIE_KEY, {
    ...current,
    environment: { ...(current.environment ?? {}), env: ENV },
    updatedAt: new Date().toISOString()
  });
}

console.clear();
persistEnvironment();
logSuccess("App startup", { env: ENV });

initializeOnInputLifecycle();
