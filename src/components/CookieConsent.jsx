import { useCallback, useEffect, useId, useState } from "react";
import { setSmoothScrollPaused } from "../hooks/useSmoothScroll";
import {
  CONSENT_CHANGED,
  DEFAULT_CONSENT,
  OPEN_PREFERENCES,
  readConsent,
  saveConsent,
} from "../lib/consent";
import "./CookieConsent.css";

/**
 * Cookie consent — a floating notice, and a preferences panel behind it.
 *
 * Mounted once for the whole site. The notice is a corner panel, not an
 * overlay: the page stays visible and usable behind it. Only the preferences
 * panel is modal, because that is a decision the visitor is actively making.
 *
 * Nothing here loads a tracker. It records a choice; see lib/consent.js.
 */

const CATEGORIES = [
  {
    key: "necessary",
    title: "Necessary Cookies",
    note: "Required for the site to work — page routing, security and your consent choice itself.",
    locked: true,
  },
  {
    key: "analytics",
    title: "Analytics Cookies",
    note: "Help us understand which pages are read, so the site can be improved.",
  },
  {
    key: "marketing",
    title: "Marketing Cookies",
    note: "Used to measure campaigns and show more relevant Bootstack content.",
  },
];

export default function CookieConsent() {
  // null = nothing showing, "notice" = the corner panel, "prefs" = the modal.
  const [view, setView] = useState(null);
  const [draft, setDraft] = useState(DEFAULT_CONSENT);
  const titleId = useId();

  // A returning visitor with a stored answer is never asked again.
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setDraft(stored);
      return;
    }
    setView("notice");
  }, []);

  // The footer's Cookie Settings re-opens the panel from anywhere on the site.
  useEffect(() => {
    const open = () => {
      setDraft(readConsent() ?? DEFAULT_CONSENT);
      setView("prefs");
    };
    window.addEventListener(OPEN_PREFERENCES, open);
    return () => window.removeEventListener(OPEN_PREFERENCES, open);
  }, []);

  // Only the preferences panel is modal, so only it locks the page.
  useEffect(() => {
    if (view !== "prefs") return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setView(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("has-modal");
    setSmoothScrollPaused(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("has-modal");
      setSmoothScrollPaused(false);
    };
  }, [view]);

  const decide = useCallback((choice) => {
    saveConsent(choice);
    setDraft({ ...DEFAULT_CONSENT, ...choice });
    setView(null);
  }, []);

  const acceptAll = () => decide({ analytics: true, marketing: true });
  const rejectAll = () => decide({ analytics: false, marketing: false });

  if (!view) return null;

  /* ---------------------------------------------------- the corner notice */
  if (view === "notice") {
    return (
      <aside
        className="cc"
        role="region"
        aria-labelledby={`${titleId}-notice`}
        aria-label="Cookie notice"
      >
        <p className="cc__eyebrow mono">Cookie notice</p>
        <h2 className="cc__title" id={`${titleId}-notice`}>
          We use cookies
        </h2>
        <p className="cc__text">
          We use cookies to improve your experience, understand website usage,
          and support essential website functionality.
        </p>

        <div className="cc__actions">
          <button type="button" className="cc__btn cc__btn--solid" onClick={acceptAll}>
            Accept All
          </button>
          <button type="button" className="cc__btn cc__btn--soft" onClick={rejectAll}>
            Reject All
          </button>
          <button
            type="button"
            className="cc__btn cc__btn--line"
            aria-expanded={false}
            aria-haspopup="dialog"
            onClick={() => {
              setDraft(readConsent() ?? DEFAULT_CONSENT);
              setView("prefs");
            }}
          >
            Manage Preferences
          </button>
        </div>
      </aside>
    );
  }

  /* ------------------------------------------------ the preferences panel */
  return (
    <div
      className="cc__veil"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${titleId}-prefs`}
      data-lenis-prevent
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setView(null);
      }}
    >
      <div className="cc__panel">
        <button
          type="button"
          className="cc__close"
          onClick={() => setView(null)}
          aria-label="Close cookie preferences"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="cc__eyebrow mono">Cookie preferences</p>
        <h2 className="cc__title" id={`${titleId}-prefs`}>
          Choose what you allow
        </h2>
        <p className="cc__text">
          Choose which types of cookies you allow. Necessary cookies are always
          enabled because they are required for the website to function.
        </p>

        <ul className="cc__list" data-lenis-prevent>
          {CATEGORIES.map((category) => {
            const on = category.locked || draft[category.key];
            return (
              <li className="cc__row" key={category.key}>
                <div className="cc__row-copy">
                  <span className="cc__row-title">{category.title}</span>
                  <span className="cc__row-note">{category.note}</span>
                </div>

                {category.locked ? (
                  <span className="cc__always mono">Always on</span>
                ) : (
                  <button
                    type="button"
                    className="cc__switch"
                    role="switch"
                    aria-checked={on}
                    aria-label={category.title}
                    onClick={() =>
                      setDraft((d) => ({ ...d, [category.key]: !d[category.key] }))
                    }
                  >
                    <span className="cc__knob" aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="cc__actions cc__actions--row">
          <button type="button" className="cc__btn cc__btn--line" onClick={rejectAll}>
            Reject All
          </button>
          <button
            type="button"
            className="cc__btn cc__btn--solid"
            onClick={() =>
              decide({ analytics: draft.analytics, marketing: draft.marketing })
            }
          >
            Save Preferences
          </button>
          <button type="button" className="cc__btn cc__btn--soft" onClick={acceptAll}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export { CONSENT_CHANGED };
