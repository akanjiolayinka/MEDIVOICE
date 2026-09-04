const SESSION_STORAGE_KEY = "medivoice_session_id";

/**
 * Returns the current conversation's session id, creating one on first use.
 * Persisted in sessionStorage so a page reload keeps the same conversation
 * (per master prompt §10 — every voice conversation must have a session id).
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // Server-side render pass — a real id is assigned on the client on mount.
    return "";
  }

  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const created = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

export function resetSessionId(): string {
  if (typeof window === "undefined") return "";
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}
