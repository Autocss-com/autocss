// Node test suite for the data-shaping layer (schema.js + rules.js).
// Zero dependencies: run with `node --test tests/`.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeRecord,
  denormalizeRecord,
  normalizeItems
} from "../assets/js/schema.js";
import { inferFieldRules } from "../assets/js/rules.js";

test("normalizeRecord maps API field names to UI names (servers)", () => {
  const api = {
    id: "50ed58f074e0",
    itemName: "auth01.ad.corp.net",
    itemType: "Auth",
    itemOS: "Windows Server 2019",
    itemStatus: "Active"
  };
  assert.deepEqual(normalizeRecord("servers", api), {
    id: "50ed58f074e0",
    name: "auth01.ad.corp.net",
    type: "Auth",
    os: "Windows Server 2019",
    status: "Active"
  });
});

test("normalizeRecord applies BASE_MAP (intro -> description) and passes unknown keys through", () => {
  assert.deepEqual(normalizeRecord("servers", { intro: "hi", extra: 1 }), {
    description: "hi",
    extra: 1
  });
});

test("denormalizeRecord is the inverse of normalizeRecord", () => {
  const api = {
    id: "x",
    itemName: "n",
    itemCreated: "2024-12-01",
    itemType: "Auth"
  };
  const ui = normalizeRecord("servers", api);
  assert.deepEqual(denormalizeRecord("servers", ui), api);
});

test("normalizeItems maps every item in an array", () => {
  const out = normalizeItems("faqs", [
    { question: "q1", answer: "a1" },
    { question: "q2", answer: "a2" }
  ]);
  assert.equal(out.length, 2);
  assert.deepEqual(out[0], { question: "q1", answer: "a1" });
});

test("inferFieldRules returns {} for empty input", () => {
  assert.deepEqual(inferFieldRules([]), {});
  assert.deepEqual(inferFieldRules(), {});
});

test("inferFieldRules classifies each field type deterministically", () => {
  const longText = "x".repeat(120);
  const items = [
    { id: "abc12345", created: "2024-12-01", stamp: "2024-12-01T00:00:00Z", enabled: "true", type: "Host", status: "Active", notes: longText },
    { id: "def67890", created: "2024-12-02", stamp: "2025-01-06T00:00:00Z", enabled: "false", type: "IP", status: "Down", notes: longText }
  ];
  const r = inferFieldRules(items);

  assert.deepEqual(r.id, { type: "text", readOnly: true, required: true });            // hex-ish id
  assert.deepEqual(r.created, { type: "text", readOnly: true, required: true });        // key-name match
  assert.deepEqual(r.stamp, { type: "datetime", readOnly: true, required: true });      // ISO datetime
  assert.equal(r.enabled.type, "toggle");                                               // true/false
  assert.equal(r.type.type, "select");                                                  // DHCP_TYPES member
  assert.deepEqual(r.type.options, ["Host", "IP", "URL", "File", "Service"]);
  assert.equal(r.status.type, "select");                                                // small distinct set
  assert.deepEqual(r.status.options.sort(), ["Active", "Down"]);
  assert.equal(r.notes.type, "textarea");                                               // long string
});

test("inferFieldRules marks fields required only when all rows are non-empty", () => {
  const items = [
    { name: "a", note: "x" },
    { name: "b", note: "" }
  ];
  const r = inferFieldRules(items);
  assert.equal(r.name.required, true);
  assert.notEqual(r.note.required, true);
});
