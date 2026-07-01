// Safely parse serialized JSON values.
function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// Read a value from localStorage.
export function readLocalStorage(key, fallback = {}) {
  const value = window.localStorage.getItem(key);

  if (!value) {
    return fallback;
  }

  return safeParse(value, fallback);
}

// Write a value to localStorage.
export function writeLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

// Read a cookie value by name.
export function readCookie(name) {
  const row = document.cookie
    .split(";")
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`));

  if (!row) {
    return null;
  }

  return decodeURIComponent(row.slice(name.length + 1));
}

// Write a long-lived cookie value.
export function writeCookie(name, value, days = 3650) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Read persisted state using localStorage first, then cookie fallback.
export function readPersistent(storageKey, cookieKey, fallback = {}) {
  const localValue = readLocalStorage(storageKey, null);

  if (localValue) {
    return localValue;
  }

  const cookieValue = readCookie(cookieKey);

  if (!cookieValue) {
    return fallback;
  }

  return safeParse(cookieValue, fallback);
}

// Write persisted state to both localStorage and cookie.
export function writePersistent(storageKey, cookieKey, value) {
  writeLocalStorage(storageKey, value);
  writeCookie(cookieKey, JSON.stringify(value));
  return value;
}
