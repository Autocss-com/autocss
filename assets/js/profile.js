// MARK: PROFILE
// HOST DATA PROFILE — the ONLY project-specific data for this AutoCSS instance
// (the DHCP-domain management app). The generic transport (api.js), browser
// storage, oninput lifecycle, and data-shaping MECHANISMS carry none of it.
// To point AutoCSS at a different data source, swap THIS one file: the shell
// endpoints it fetches, the fixed option sets, and the API<->UI field-name map.
// Pure data — no logic, no DOM, no imports.

// Shell endpoint suffixes (fetched once per session; joined to API_BASE_URL in api.js).
export const NAV_ENDPOINT = "navItems";
export const BANNER_ENDPOINT = "app-banner";

// Data endpoint suffixes for this source (the nav radio values in index.html mirror these).
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

// Fixed option set for generated <select> inputs (matches this data's casing).
export const DHCP_TYPES = ["Host", "IP", "URL", "File", "Service"];

// API <-> UI field-name map. BASE_MAP applies to every endpoint; ENDPOINT_SCHEMAS
// adds per-endpoint renames. schema.js reads these to normalize (read) and
// denormalize (write) without knowing any field name itself.
export const BASE_MAP = {
  intro: "description"
};

export const ENDPOINT_SCHEMAS = {
  manage: {
    itemName: "name",
    itemCreated: "created",
    itemUpdated: "updated",
    itemAuthor: "author",
    itemModified: "modified",
    itemType: "type"
  },
  "api-registration": {
    itemName: "name",
    itemCreated: "created",
    itemUpdated: "updated",
    itemAuthor: "author",
    itemModifiedBy: "modified",
    itemType: "type"
  },
  audit: {
    type: "type",
    timestamp: "timestamp",
    user: "user",
    action: "action",
    target: "target",
    details: "details"
  },
  credentials: {
    subtype: "subtype",
    type: "type",
    name: "name",
    description: "description",
    schedule: "schedule",
    status: "status",
    enabled: "enabled"
  },
  faqs: {
    question: "question",
    answer: "answer"
  },
  "option-set": {
    type: "type",
    name: "name",
    description: "description",
    options: "options"
  },
  "option-types": {
    type: "type",
    name: "name",
    description: "description",
    enabled: "enabled"
  },
  "scope-type": {
    type: "type",
    name: "name",
    description: "description",
    enabled: "enabled"
  },
  servers: {
    itemName: "name",
    itemCreated: "created",
    itemUpdated: "updated",
    itemAuthor: "author",
    itemModified: "modified",
    itemType: "type",
    itemOS: "os",
    itemStatus: "status"
  },
  "server-types": {
    itemName: "name",
    itemCreated: "created",
    itemUpdated: "updated",
    itemAuthor: "author",
    itemModified: "modified",
    itemType: "type",
    itemOS: "os",
    itemStatus: "status"
  },
  variables: {
    name: "name",
    value: "value",
    description: "description",
    type: "type"
  },
  settings: {}
};
