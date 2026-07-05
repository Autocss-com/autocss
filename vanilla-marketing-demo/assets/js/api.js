// MARK: API
// Transport only. The API base origin is declared here ONCE; only the
// endpoint suffix varies. GET + write (POST/PUT/DELETE) + timestamped
// console reporting (minimal success / verbose failure). Stateless.

import { JSON_HEADERS } from "./config.js";

// Shared API origin; endpoint suffix is the only variable. This demo is READ-ONLY,
// so the "API" is a folder of static JSON files served alongside the app — no backend
// needed. (User-directed for this static demo; resolveEndpoint appends ".json".)
export const API_BASE_URL = "./data";

// Build a compact timestamp for all console reporting.
function nowStamp() {
  return new Date().toISOString();
}

// Verbose, timestamped failure reporting.
export function logStage(stage, payload = {}) {
  const row = { timestamp: nowStamp(), stage, ...payload };
  console.group(`FAIL [${row.timestamp}] ${stage}`);
  console.table([row]);
  if (payload?.errorStack) {
    console.error(payload.errorStack);
  }
  console.groupEnd();
}

// Minimal, timestamped success reporting.
export function logSuccess(message, payload = {}) {
  console.table([{ timestamp: nowStamp(), message, ...payload }]);
}

// Resolve an endpoint suffix or absolute URL into a concrete URL.
export function resolveEndpoint(endpointOrUrl = "") {
  if (typeof endpointOrUrl !== "string" || endpointOrUrl.length === 0) {
    return "";
  }
  return endpointOrUrl.startsWith("http")
    ? endpointOrUrl
    : `${API_BASE_URL}/${endpointOrUrl}.json`;
}

// Parse a fetch Response as JSON, logging parse failures.
async function parseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    logStage("json-parse", {
      errorName: error.name,
      message: error.message,
      errorStack: error.stack
    });
    return null;
  }
}

// GET + parse JSON from an endpoint suffix or URL. Returns null on failure.
export async function requestData(endpointOrUrl) {
  const url = resolveEndpoint(endpointOrUrl);

  if (!url) {
    logStage("endpoint", {
      message: `Endpoint not configured: ${endpointOrUrl ?? "unknown"}`
    });
    return null;
  }

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    logStage("network", {
      errorName: error.name,
      message: error.message,
      errorStack: error.stack,
      url
    });
    return null;
  }

  if (!response.ok) {
    logStage("fetch", {
      status: response.status,
      statusText: response.statusText,
      url
    });
    return null;
  }

  return parseJson(response);
}

// Shared writer for POST/PUT. Returns the parsed record or null on failure.
async function writeData(method, endpointOrUrl, data) {
  const url = resolveEndpoint(endpointOrUrl);

  if (!url) {
    logStage("endpoint", { message: `Endpoint not configured: ${endpointOrUrl ?? "unknown"}` });
    return null;
  }

  let response;

  try {
    response = await fetch(url, {
      method,
      headers: JSON_HEADERS,
      body: JSON.stringify(data ?? {})
    });
  } catch (error) {
    logStage("network", {
      method,
      errorName: error.name,
      message: error.message,
      errorStack: error.stack,
      url
    });
    return null;
  }

  if (!response.ok) {
    logStage("write", { method, status: response.status, statusText: response.statusText, url });
    return null;
  }

  return parseJson(response);
}

// Create a record.
export function postJson(endpointOrUrl, data) {
  return writeData("POST", endpointOrUrl, data);
}

// Replace a record (endpoint suffix must target the record id).
export function putJson(endpointOrUrl, data) {
  return writeData("PUT", endpointOrUrl, data);
}

// Delete a record. Returns true on success, false on failure.
export async function deleteJson(endpointOrUrl) {
  const url = resolveEndpoint(endpointOrUrl);

  if (!url) {
    logStage("endpoint", { message: `Endpoint not configured: ${endpointOrUrl ?? "unknown"}` });
    return false;
  }

  let response;

  try {
    response = await fetch(url, { method: "DELETE", headers: JSON_HEADERS });
  } catch (error) {
    logStage("network", {
      method: "DELETE",
      errorName: error.name,
      message: error.message,
      errorStack: error.stack,
      url
    });
    return false;
  }

  if (!response.ok) {
    logStage("write", { method: "DELETE", status: response.status, statusText: response.statusText, url });
    return false;
  }

  return true;
}
