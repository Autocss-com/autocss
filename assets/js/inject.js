// MARK: INJECT
// JSON -> DOM. The ONLY elements generated here are custom elements for the
// data-table cells, created from the record's KEYS via toTagName(); their text
// content is the record's VALUES. Everything else (nav, form) is static HTML
// into which we inject text. No innerHTML string-building, no event listeners,
// no dynamic import(), no dispatchEvent, no data-*. Row selection uses oninput.

import { formatDateForInput } from "./utils.js";

// Row-selection seam: the form lifecycle (step 7) registers a handler here so a
// row's oninput can load that record into the <aside> form.
export let rowSelectHandler = () => {};
export function setRowSelectHandler(fn) {
  if (typeof fn === "function") rowSelectHandler = fn;
}

// "item-name" -> "itemName" (custom-element tag name -> data key).
export function toCamel(str = "") {
  let result = str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  if (result.endsWith("-")) result = result.slice(0, -1);
  return result;
}

// data key -> valid custom-element tag name (must contain a hyphen).
export function toTagName(str = "") {
  if (!str || typeof str !== "string") return "unknown-tag";
  let dashed = str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(dashed)) {
    dashed = `unknown-${dashed.replace(/[^a-z0-9-]/g, "")}`;
  }
  if (!dashed.includes("-")) dashed = `${dashed}-`;
  return dashed;
}

// Humanize a data key for a column header ("itemName" -> "Name").
function humanize(key = "") {
  return toTagName(key)
    .replace(/^item-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

// Set an element's visible text without disturbing any nested <input>
// (state-machine inputs must survive). Idempotent.
function setLabelText(el, text = "") {
  for (const node of [...el.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) el.removeChild(node);
  }
  el.prepend(document.createTextNode(text));
}

// --- Nav: inject TEXT into the static <details>/<label> structure ----------

// navData: [{ <group>: { <endpoint>: { title, intro } } }] (or that object).
export function injectNavText(navData = {}) {
  const groups = Array.isArray(navData) ? navData[0] ?? {} : navData;
  const detailEls = document.querySelectorAll("nav details");
  const entries = Object.entries(groups);

  entries.forEach(([groupKey, groupValue], index) => {
    const detail = detailEls[index];
    if (!detail) return;

    const summary = detail.querySelector("summary");
    if (summary) {
      summary.textContent = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
    }

    detail.querySelectorAll("section label").forEach(label => {
      const input = label.querySelector("input[name='nav']");
      if (!input) return;
      const meta = groupValue[input.value];
      if (meta) setLabelText(label, meta.title || input.value);
    });
  });
}

// --- Data table: header cells + body rows (custom elements from keys) -------

// PORTED AS-IS FROM DHCP (step 7). The row uses TWO hidden inputs sharing one
// <label>: a checkbox (row-toggle) — the label's click target, which untoggles
// on re-click to DESELECT the row — and a radio (list-item) for single-selection
// styling + the form-load query. handleRowToggle mirrors the checkbox state onto
// the radio and dispatches the radio's `input` event so its own oninput fires
// rowSelectHandler. (Row-toggle->radio dispatch is a COMPLIANCE-DEBT LEDGER item:
// future fix = direct rowSelectHandler() call; dispatchEvent is only sanctioned
// for the initial-load nav selection.)
function handleRowToggle(event) {
  const checkbox = event.target;
  const li = checkbox.closest("li");
  const radio = li.querySelector('input[type="radio"][name="list-item"]');
  if (checkbox.checked) {
    checkbox.closest("ul").querySelectorAll('input[name="row-toggle"]').forEach(cb => {
      if (cb !== checkbox) cb.checked = false;
    });
  }
  radio.checked = checkbox.checked;
  radio.dispatchEvent(new Event("input", { bubbles: true }));
}

// One data row: <li><label><checkbox><radio><cell>value</cell>...</label></li>.
export function createListItem(item = {}) {
  const li = document.createElement("li");
  li.tabIndex = 0;

  const label = document.createElement("label");

  // Row-toggle checkbox FIRST = the label's click target (re-click deselects).
  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.name = "row-toggle";
  toggle.hidden = true;
  toggle.oninput = handleRowToggle;
  label.appendChild(toggle);

  // Single-selection radio (styling + form-load query).
  const select = document.createElement("input");
  select.type = "radio";
  select.name = "list-item";
  select.hidden = true;
  select.oninput = () => rowSelectHandler();
  label.appendChild(select);

  for (const [key, value] of Object.entries(item)) {
    const cell = document.createElement(toTagName(key));
    cell.textContent = value ?? "";
    label.appendChild(cell);
  }

  li.appendChild(label);
  return li;
}

// Inject a normalized page record into the article: h1/intro + dual-<ul> table.
export function injectPageContent(endpoint = "", data = {}) {
  const article = document.querySelector("main article");
  if (!article) return;

  const h1 = article.querySelector("h1");
  const intro = article.querySelector("p");
  if (h1) h1.textContent = data.title ?? "";
  if (intro) intro.textContent = data.description ?? "";

  const headerUl = article.querySelector('ul[aria-hidden="true"]');
  const headerLi = headerUl?.querySelector("li");
  const tableUl = headerUl?.nextElementSibling;

  const items = Array.isArray(data.items) ? data.items : [];
  const keys = Object.keys(items[0] || {});

  // Header row: one custom-element cell per key, humanized label text.
  if (headerLi) {
    headerLi.replaceChildren(
      ...keys.map(key => {
        const cell = document.createElement(toTagName(key));
        cell.textContent = humanize(key);
        return cell;
      })
    );
  }

  // Body rows.
  if (tableUl) {
    tableUl.replaceChildren(...items.map(createListItem));
  }

  // Parity with dhcp: a fresh page load clears any open <aside> form fieldset
  // (the previously selected row no longer exists after the table is rebuilt).
  // dhcp does `fieldset.innerHTML=''` in injectPageContent; replaceChildren here.
  document.querySelector("aside form fieldset")?.replaceChildren();
}

// --- Form field generation (PORTED AS-IS FROM DHCP, step 7) ------------------

// Build a typed input/select/textarea for a record field from its key, current
// value, and the inferred field rules (getFieldRules). Read-only heuristics +
// the new-item empty-field required=false QUIRK are faithful to dhcp.
export function createInputFromKey(key, value, fieldRules = {}) {
  const inputName = key;
  const val = value?.trim?.() ?? "";

  const rule = fieldRules[key];
  if (rule?.type === "select") {
    const select = document.createElement("select");
    select.name = key;
    select.required = true;

    const optBlank = document.createElement("option");
    optBlank.value = "";
    optBlank.textContent = "Select...";
    select.appendChild(optBlank);

    for (const opt of rule.options ?? []) {
      const o = document.createElement("option");
      o.value = o.textContent = opt;
      if (opt === value) o.selected = true;
      select.appendChild(o);
    }

    return select;
  }

  if (rule?.type === "toggle") {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = key;
    checkbox.checked = value === "true" || value === true;
    return checkbox;
  }

  if (rule?.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.name = key;
    textarea.value = value ?? "";
    textarea.required = !!value;
    return textarea;
  }

  if (rule?.type === "datetime") {
    const input = document.createElement("input");
    input.type = "datetime-local";
    input.name = key;
    input.value = formatDateForInput(value);
    input.readOnly = true;
    input.tabIndex = -1;
    return input;
  }

  // Default to text input
  const element = document.createElement("input");
  element.name = inputName;
  element.value = val;

  // Special handling for read-only fields
  if (key === "id" || /^[a-f0-9\-]{36}$/.test(val)) {
    element.type = "text";
    element.readOnly = true;
    element.tabIndex = -1;
    element.ariaDisabled = "true";
  } else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(val)) {
    element.type = "datetime-local";
    element.readOnly = true;
    element.tabIndex = -1;
    element.value = formatDateForInput(val);
  } else if (/author|modified|created|updated/.test(key)) {
    element.type = "text";
    element.readOnly = true;
    element.tabIndex = -1;
  } else {
    element.type = "text";
    element.required = val !== "";
    element.pattern = ".+";
  }

  return element;
}

// LIVE row mirroring: as a form field changes, write its value into the matching
// cell of the selected row (skips read-only fields).
export function mirrorToSelectedRow(event, injectRowField) {
  const input = event.target;
  const key = input.name;
  const selectedLi = document
    .querySelector('ul li input[name="list-item"]:checked')
    ?.closest("li");

  if (!selectedLi) return;

  if (!input.readOnly) {
    injectRowField(selectedLi, key, input.value);
  }
}

// Set one row cell's text by field name (used by mirrorToSelectedRow).
export function injectRowField(li, name = "", value = "") {
  if (!li) return;
  const target = li.querySelector(`label > ${toTagName(name)}`);
  if (target) target.textContent = value ?? "";
}

// Restore all of a row's cells from a data snapshot (used by Reset).
export function injectRowValues(li, data = {}) {
  if (!li) return;
  li.querySelectorAll("label > *:not(input)").forEach(el => {
    const key = toCamel(el.tagName.toLowerCase());
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      el.textContent = data[key];
    }
  });
}

// Rebuild the header row from a source row's cells (used on new-item creation).
export function updateHeaderRow(sourceRow, headerUl, toCamel, toTagName) {
  const headerLi = headerUl?.querySelector("li");
  if (!headerLi || !sourceRow) return;

  headerLi.innerHTML = "";

  sourceRow.querySelectorAll("label > *:not(input)").forEach(el => {
    const key = toCamel(el.tagName.toLowerCase());
    const clone = el.cloneNode(false);
    clone.textContent = toTagName(key)
      .replace(/^item-/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
    headerLi.appendChild(clone);
  });
}
