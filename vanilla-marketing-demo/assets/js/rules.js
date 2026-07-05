// MARK: RULES
// inferFieldRules: derive a UI input rule (type + readOnly/required/options)
// for each field by inspecting the column's values across all items. Pure +
// stateless; no DOM. Consumed by the form/field generator (inject.js, step 6)
// to auto-build typed inputs from data.

import { DHCP_TYPES } from "./profile.js";

export function inferFieldRules(items = []) {
  if (!Array.isArray(items) || !items.length) return {};

  // Collect the distinct (stringified) values seen per field.
  const valueMap = {};
  for (const item of items) {
    for (const [key, val] of Object.entries(item)) {
      if (!valueMap[key]) valueMap[key] = new Set();
      if (val !== undefined && val !== null) {
        valueMap[key].add(String(val).trim());
      }
    }
  }

  const rules = {};
  for (const key of Object.keys(items[0])) {
    const values = [...(valueMap[key] || [])];
    const sample = values[0];

    const rule = {};

    if (values.every(v => v === "true" || v === "false")) {
      rule.type = "toggle";
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(sample)) {
      rule.type = "datetime";
      rule.readOnly = true;
    } else if (
      key === "id" ||
      (/^[a-f0-9\-]{4,}$/.test(sample) && values.every(v => /^[a-f0-9\-]{4,}$/.test(v)))
    ) {
      rule.type = "text";
      rule.readOnly = true;
    } else if (/author|modified|created|updated/.test(key)) {
      rule.type = "text";
      rule.readOnly = true;
    } else if (DHCP_TYPES.includes(String(sample))) {
      rule.type = "select";
      rule.options = DHCP_TYPES;
      rule.required = true;
    } else if (values.length > 1 && values.length <= 10 && values.every(v => v.length < 20)) {
      rule.type = "select";
      rule.options = values;
    } else if (typeof sample === "string" && sample.length > 100) {
      rule.type = "textarea";
    } else {
      rule.type = typeof sample === "number" ? "number" : "text";
    }

    if (items.every(it => String(it[key] ?? "").trim() !== "")) rule.required = true;

    rules[key] = rule;
  }

  return rules;
}
