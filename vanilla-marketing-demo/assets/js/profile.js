// MARK: PROFILE
// HOST DATA PROFILE — the ONLY project-specific data for this AutoCSS instance
// (the Étoile Ballet Studio marketing demo). The generic transport (api.js),
// browser storage, oninput lifecycle, and data-shaping MECHANISMS carry none of it.
// Swap THIS file to point AutoCSS at a different data source.
// Pure data — no logic, no DOM, no imports.

// Shell resource (fetched once on load; carries banner + nav menu + footer).
export const NAV_ENDPOINT = "shell";

// Data endpoint suffixes (the nav radio values in index.html mirror these; api.js
// joins them to API_BASE_URL and appends ".json" -> ./data/<endpoint>.json).
export const ENDPOINTS = ["home", "classes", "about", "faculty", "tuition"];

// Fixed option set for generated <select> inputs. Unused by this read-only demo.
export const DHCP_TYPES = [];

// API <-> UI field-name map. BASE_MAP applies to every endpoint; the data already
// uses UI-facing names, so only `intro` is renamed to `description` (what
// injectPageContent reads for the intro <p>). No per-endpoint renames needed.
export const BASE_MAP = {
  intro: "description"
};

export const ENDPOINT_SCHEMAS = {};
