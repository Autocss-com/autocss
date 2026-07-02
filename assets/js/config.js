// MARK: CONFIG
// Generic runtime option flags (project-agnostic). The API base origin lives in
// api.js (declared once); the data source's endpoints + field maps live in
// profile.js. This file holds only flags a host would set the same way anywhere.

import { isDev, FEATURES } from "./env.js";

// App version metadata (shown in <app-version>).
export const VERSION = {
  version: "0.0.1-alpha",
  timestamp: "2026-06-06T00:00:00Z",
  build: "20260606",
  description: "AutoCSS — D7460N Architecture (DHCP-domain data, oklch theme)"
};

// Runtime option flags.
export const OPTIONS = {
  showBanner: true,
  warnOnBlur: !isDev,
  debugging: FEATURES.debugging,
  liveReload: FEATURES.liveReload
};

// Unsaved-change confirmation flags (consumed by the form lifecycle).
export const CONFIRM_FLAGS = {
  save: { value: false },
  delete: { value: false },
  reset: { value: false },
  close: { value: false }
};

// Standard JSON request headers for write operations.
export const JSON_HEADERS = { "Content-Type": "application/json" };
