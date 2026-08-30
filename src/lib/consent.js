/**
 * Cookie consent state.
 *
 * This module is the consent record and nothing else — it loads no analytics,
 * no pixels, no third-party tags. If any are added later they must check
 * `readConsent()?.analytics` / `.marketing` before running, and re-check when
 * the `bootstack:consent-changed` event fires.
 */

const KEY = "bootstack:cookie-consent";

/** Bump when the categories change, so an old record is re-asked rather than trusted. */
const VERSION = 1;

export const OPEN_PREFERENCES = "bootstack:open-cookie-preferences";
export const CONSENT_CHANGED = "bootstack:consent-changed";

export const DEFAULT_CONSENT = {
  necessary: true,
  analytics: false,
  marketing: false,
};

/** The stored record, or null if this visitor has not answered yet. */
export function readConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== VERSION) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      at: parsed.at,
    };
  } catch {
    // Private mode, or a browser blocking site data. Treat as unanswered; the
    // banner will show again, which is the safe direction for consent.
    return null;
  }
}

export function saveConsent(choice) {
  const record = {
    ...DEFAULT_CONSENT,
    ...choice,
    necessary: true,
    version: VERSION,
    at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    /* nothing to store into — the choice still applies for this page view */
  }

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: record }));
  return record;
}

/** Re-opens the preferences panel — used by the footer's Cookie Settings. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES));
}
