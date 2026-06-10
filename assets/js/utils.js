// MARK: UTILS (PORTED AS-IS FROM DHCP — comply-later, see SESSION-HANDOFF LEDGER)
// Form helper functions ported from dhcp/assets/js/utils.js for the as-is CRUD
// port. Verbatim logic, reformatted to house style. NAMING/SPLIT into
// concern-named modules + clearFieldset innerHTML -> replaceChildren are tracked
// COMPLIANCE-DEBT LEDGER items to fix in a future session; kept "utils" shape
// for now so dhcp forms.js ports unchanged. No DOM ownership, no events.

export function formatDateForInput(str = "") {
  const d = new Date(str);
  return Number.isNaN(d) ? "" : d.toISOString().slice(0, 16);
}

export function normalizeKey(str = "") {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function snapshotForm(elements = []) {
  const data = {};
  elements.forEach(el => {
    data[el.name] = el.value;
  });
  return data;
}

export function hasUnsavedChanges(elements = [], original = {}) {
  return Array.from(elements).some(el => el.value !== original[el.name]);
}

export function unsavedCheck(flagRef, condition, proceed) {
  if (!flagRef.value && condition()) {
    flagRef.value = true;
    return;
  }
  flagRef.value = false;
  proceed();
}

// DOM utility functions
export function removeInlineStyles(element) {
  if (element && element instanceof HTMLElement) {
    element.removeAttribute("style");
  }
}

export function clearFieldset(fieldsetElement) {
  if (fieldsetElement && fieldsetElement instanceof HTMLElement) {
    fieldsetElement.innerHTML = "";
  }
}

// Form validation utilities
export function isFormValid(form) {
  return form.checkValidity();
}

// Form state management utilities
export function restoreFormFields(fieldset, data = {}) {
  fieldset.querySelectorAll("input[name], select[name]").forEach(el => {
    if (Object.prototype.hasOwnProperty.call(data, el.name)) {
      el.value = data[el.name];
    }
  });
}

export function toggleFormButton(button, shouldEnable = false) {
  if (button) {
    if (shouldEnable) {
      button.removeAttribute("aria-disabled");
    } else {
      button.setAttribute("aria-disabled", "true");
    }
  }
}

export function updateFormStatus(form, isDirty = false, isValid = true) {
  if (form) {
    form.dataset.dirty = isDirty ? "true" : "false";
    const status = form.querySelector('p[aria-live="polite"]');
    if (status) {
      if (!isDirty) {
        status.textContent = "ℹ️ Nothing to save or reset.";
        status.hidden = false;
      } else if (!isValid) {
        status.textContent = "⚠️ Please complete required fields.";
        status.hidden = false;
      } else {
        status.hidden = true;
      }
    }
  }
}
