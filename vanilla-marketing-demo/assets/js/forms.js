// MARK: FORMS (PORTED AS-IS FROM DHCP — comply-later, see SESSION-HANDOFF LEDGER)
// dhcp/assets/js/forms.js ported verbatim-logic to reach DHCP CRUD parity.
// Imports adapted to autocss's existing modules ONLY (different names/contracts):
//   dhcp fetch.js postJSON/putJSON/deleteJSON  -> api.js postJson/putJson/deleteJson
//     (NOTE error contract differs: autocss writers RETURN null/false on failure
//      instead of throwing, so dhcp's try/catch simply won't catch — accepted for
//      the port; LEDGER item to handle return values in the compliance pass.)
//   dhcp loaders.js loadPageContent           -> oninput.js runOnInputLifecycle
//   dhcp loaders.js getFieldRules             -> oninput.js getFieldRules
//   dhcp schema.js denormalizeRecord          -> schema.js denormalizeRecord
//   dhcp inject.js / utils.js                 -> autocss inject.js / utils.js
// Patterns KNOWINGLY ported as-is (each a COMPLIANCE-DEBT LEDGER item): .onchange
// x5, form.dataset.dirty/valid, clearFieldset innerHTML, headerLi.innerHTML='',
// the `label > id` id lookup (never matches <id-> -> Save always POSTs), console
// debug. Do NOT "fix" these here — they are the as-is baseline.

import { OPTIONS } from "./config.js";
import { postJson, putJson, deleteJson } from "./api.js";
import { denormalizeRecord } from "./schema.js";
import { runOnInputLifecycle as loadPageContent, getFieldRules } from "./oninput.js";
import {
  createListItem,
  toTagName,
  toCamel,
  setRowSelectHandler,
  injectRowValues,
  injectRowField,
  createInputFromKey,
  mirrorToSelectedRow,
  updateHeaderRow,
} from "./inject.js";
import {
  snapshotForm,
  hasUnsavedChanges,
  removeInlineStyles,
  clearFieldset,
  isFormValid,
  restoreFormFields,
} from "./utils.js";

// Form DOM element references
const headerUl = document.querySelector('main article ul[aria-hidden="true"]');
const tableUl = document.querySelector('main article ul[aria-hidden="true"] + ul');
const form = document.querySelector("aside form");
const fieldset = form.querySelector("fieldset");
const mainEl = document.querySelector("main");
const newItem = document.querySelector('main article [aria-label*="new item"]');
const closeItem = document.querySelector('aside [aria-label="Close"]');
const deleteItem = form.querySelector('[aria-label="Delete"]');
const resetItem = form.querySelector('[aria-label="Reset"]');
const submitItem = form.querySelector('[aria-label="Save"]');
const savedMessage = form.querySelector('p[aria-live="polite"]');

// Form State Management
let originalData = {};
let snapshotLi = null;

// Reusable function to clear the aside panel completely
export function clearAsidePanel() {
  // Clear any selected row
  const selected = document
    .querySelector('ul li input[name="list-item"]:checked')
    ?.closest("li");
  if (selected) {
    const radio = selected.querySelector('input[name="list-item"]');
    if (radio) radio.checked = false;
    const toggle = selected.querySelector('input[name="row-toggle"]');
    if (toggle) toggle.checked = false;
  }

  // Clear the form and reset styles
  clearFieldset(fieldset);
  removeInlineStyles(mainEl);
  captureFormSnapshot();
  form.oninput();
}

// Form state functions
function checkUnsavedChanges() {
  return hasUnsavedChanges(fieldset.querySelectorAll("input[name], select[name]"), originalData);
}

function captureFormSnapshot() {
  originalData = snapshotForm(fieldset.querySelectorAll("input[name], select[name]"));
  snapshotLi = document.querySelector('ul li input[name="list-item"]:checked')?.closest("li");
  updateButtonStates();
}

function restoreForm() {
  if (!originalData || !Object.keys(originalData).length) return;
  restoreFormFields(fieldset, originalData);
  if (snapshotLi) injectRowValues(snapshotLi, originalData);
}

// Consolidated button state management
function updateButtonStates() {
  const dirty = checkUnsavedChanges();
  const valid = isFormValid(form);

  // Update form dataset for CSS styling - CSS handles button states
  form.dataset.dirty = dirty ? "true" : "false";
  form.dataset.valid = valid ? "true" : "false";
}

// Form coordination
function updateFormFromSelectedRow() {
  clearFieldset(fieldset);

  const selectedRow = document
    .querySelector('ul li input[name="list-item"]:checked')
    ?.closest("li");

  if (!selectedRow) {
    removeInlineStyles(mainEl);
    captureFormSnapshot();
    form.oninput();
    return;
  }

  selectedRow.querySelectorAll("label > *:not(input)").forEach(source => {
    const key = toCamel(source.tagName.toLowerCase());
    const value = source.textContent;

    const label = document.createElement("label");
    label.textContent =
      toTagName(key)
        .replace(/^item-/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase()) + ": ";

    const input = createInputFromKey(key, value, getFieldRules());
    input.oninput = (e) => mirrorToSelectedRow(e, injectRowField);
    label.appendChild(input);
    fieldset.appendChild(label);
  });

  captureFormSnapshot();
}

setRowSelectHandler(updateFormFromSelectedRow);

// Form event assignments
form.oninput = updateButtonStates;

// New item creation - CSS-first pattern: listen to checkbox change
const newItemCheckbox = newItem?.querySelector('input[type="checkbox"]');
if (newItemCheckbox) {
  newItemCheckbox.onchange = async (e) => {
    if (!e.target.checked) return; // Only act on check, not uncheck

    // Reset checkbox after user action
    e.target.checked = false;

    clearFieldset(fieldset);

    const existingLi = tableUl.querySelector("li");
    let keys;

    if (existingLi) {
      keys = Array.from(existingLi.querySelectorAll("label > *:not(input)")).map(el =>
        toCamel(el.tagName.toLowerCase()),
      );
    } else {
      keys = ["id", "name", "description", "created", "updated"];
    }

    const item = {};
    keys.forEach(key => {
      item[key] = "";
      const formLabel = document.createElement("label");
      formLabel.textContent =
        toTagName(key)
          .replace(/^item-/, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase()) + ": ";

      const input = createInputFromKey(key, "", getFieldRules());
      input.oninput = (e) => mirrorToSelectedRow(e, injectRowField);
      formLabel.appendChild(input);
      fieldset.appendChild(formLabel);
    });

    const li = createListItem(item);
    tableUl.prepend(li);

    updateHeaderRow(li, headerUl, toCamel, toTagName);
    li.querySelector('input[name="list-item"]').checked = true;
    captureFormSnapshot();
  };
}

// Form submission - CSS-first pattern: listen to checkbox change
const submitCheckbox = submitItem?.querySelector('input[type="checkbox"]');
if (submitCheckbox) {
  submitCheckbox.onchange = async (e) => {
    if (!e.target.checked) return; // Only act on check, not uncheck

    // Reset checkbox after user action
    e.target.checked = false;

    const selected = document.querySelector('ul li input[name="list-item"]:checked');
    const id = selected?.closest("li")?.querySelector("label > id")?.textContent?.trim();
    const endpoint = document.querySelector('nav input[name="nav"]:checked')?.value;
    if (!endpoint) return;

    const data = {};
    fieldset.querySelectorAll("input[name], select[name]").forEach(el => {
      if (!el.readOnly) data[el.name] = el.value.trim();
    });
    const payload = denormalizeRecord(endpoint, data);

    try {
      if (id) {
        await putJson(`${endpoint}/${id}`, payload);
      } else {
        await postJson(endpoint, payload);
      }

      savedMessage.textContent = `Saved ${new Date().toLocaleTimeString()}`;
      await loadPageContent(endpoint);
      captureFormSnapshot();
      setTimeout(() => {
        savedMessage.textContent = "";
      }, 2000);
    } catch (err) {
      console.error("Failed to save:", err);
      const intro = document.querySelector("main article > p"); if (intro) intro.textContent = "⚠️ Error saving record.";
    }
  };
}

// Form reset - CSS-first pattern: listen to checkbox change
const resetCheckbox = resetItem?.querySelector('input[type="checkbox"]');
if (resetCheckbox) {
  resetCheckbox.onchange = (e) => {
    if (!e.target.checked) return; // Only act on check, not uncheck

    // Reset checkbox after user action
    e.target.checked = false;

    restoreForm();
    captureFormSnapshot();
  };
}

// Delete operation - CSS-first pattern: listen to checkbox change
const deleteCheckbox = deleteItem?.querySelector('input[type="checkbox"]');
if (deleteCheckbox) {
  deleteCheckbox.onchange = async (e) => {
    if (!e.target.checked) return; // Only act on check, not uncheck

    // Reset checkbox after user action
    e.target.checked = false;

    const selected = document.querySelector('ul li input[name="list-item"]:checked')?.closest("li");
    if (!selected) return;

    const id = selected.querySelector("label > id")?.textContent?.trim();
    const endpoint = document.querySelector('nav input[name="nav"]:checked')?.value;
    if (!endpoint) return;

    // For new items without ID, just remove from DOM
    if (!id) {
      selected.remove();
      clearFieldset(fieldset);
      headerUl.querySelector("li").innerHTML = "";
      captureFormSnapshot();
      return;
    }

    try {
      await deleteJson(`${endpoint}/${id}`);
      await loadPageContent(endpoint);
      captureFormSnapshot();
    } catch (err) {
      console.error("Failed to delete:", err);
      const intro = document.querySelector("main article > p"); if (intro) intro.textContent = "⚠️ Error deleting record.";
    }
  };
}

// Close form - CSS-first pattern: listen to checkbox change
const closeCheckbox = closeItem?.querySelector('input[type="checkbox"]');
if (closeCheckbox) {
  closeCheckbox.onchange = (e) => {
    if (!e.target.checked) return; // Only act on check, not uncheck

    // Reset checkbox after user action
    e.target.checked = false;

    // Use the reusable clear function
    clearAsidePanel();
  };
}

// Initialize button states on load
console.log("Initializing buttons:", { resetItem, submitItem, deleteItem });
updateButtonStates();
