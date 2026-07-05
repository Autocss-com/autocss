// MARK: SCHEMA
// Generic API <-> UI field-name shaping. The field MAPS live in profile.js
// (project data); this file is the MECHANISM — normalize (read) and denormalize
// (write) — and knows no field name itself. Pure + stateless. No DOM, no events.

import { BASE_MAP, ENDPOINT_SCHEMAS } from "./profile.js";

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
