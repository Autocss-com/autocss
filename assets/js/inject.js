// MARK: INJECT
// JSON -> DOM. The ONLY elements generated here are custom elements for the
// data-table cells, created from the record's KEYS via toTagName(); their text
// content is the record's VALUES. Everything else (nav, form) is static HTML
// into which we inject text. No innerHTML string-building, no event listeners,
// no dynamic import(), no dispatchEvent, no data-*. Row selection uses oninput.

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

// One data row: <li><label><radio><cell>value</cell>...</label></li>.
export function createListItem(item = {}) {
  const li = document.createElement("li");
  li.tabIndex = 0;

  const label = document.createElement("label");

  // Single-selection state machine for the row (hidden; the row IS the label).
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
}
