// MARK: CONFIG
// Project-specific runtime configuration: the endpoint registry and flags.
// The API base origin lives in api.js (declared once); this file only names
// the endpoint suffixes and option flags the app uses.

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

// Shell endpoint suffixes (fetched once per session).
export const NAV_ENDPOINT = "navItems";
export const BANNER_ENDPOINT = "app-banner";

// Valid data endpoint suffixes (DHCP domain — joined to API_BASE_URL).
export const ENDPOINTS = [
  "manage",
  "api-registration",
  "audit",
  "credentials",
  "faqs",
  "option-set",
  "option-types",
  "scope-type",
  "server-types",
  "servers",
  "variables",
  "settings"
];

// Unsaved-change confirmation flags (consumed by the form lifecycle).
export const CONFIRM_FLAGS = {
  save: { value: false },
  delete: { value: false },
  reset: { value: false },
  close: { value: false }
};

// Standard JSON request headers for write operations.
export const JSON_HEADERS = { "Content-Type": "application/json" };

// DHCP type options used for generated dropdowns (matches data casing).
export const DHCP_TYPES = ["Host", "IP", "URL", "File", "Service"];
