// MARK: SCHEMA
// API <-> UI field-name mapping for the DHCP domain, plus normalize/
// denormalize. Pure + stateless: API field names (itemName, itemCreated, ...)
// become friendly UI names (name, created, ...) on read, and back on write.
// No DOM, no events.

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

// Invert a {apiKey: uiKey} map into {uiKey: apiKey}.
const invert = obj =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

export const REVERSE_SCHEMAS = Object.fromEntries(
  Object.entries(ENDPOINT_SCHEMAS).map(([ep, map]) => [ep, invert(map)])
);

export const BASE_REVERSE = invert(BASE_MAP);

// API record -> UI record (rename known fields; pass others through).
export function normalizeRecord(endpoint = "", record = {}) {
  const schema = { ...BASE_MAP, ...(ENDPOINT_SCHEMAS[endpoint] || {}) };
  const out = {};
  for (const [key, val] of Object.entries(record)) {
    out[schema[key] || key] = val;
  }
  return out;
}

// UI record -> API record (inverse of normalizeRecord; for writes).
export function denormalizeRecord(endpoint = "", record = {}) {
  const schema = { ...BASE_REVERSE, ...(REVERSE_SCHEMAS[endpoint] || {}) };
  const out = {};
  for (const [key, val] of Object.entries(record)) {
    out[schema[key] || key] = val;
  }
  return out;
}

export const normalizeItems = (endpoint = "", items = []) =>
  items.map(item => normalizeRecord(endpoint, item));

export const denormalizeItems = (endpoint = "", items = []) =>
  items.map(item => denormalizeRecord(endpoint, item));
