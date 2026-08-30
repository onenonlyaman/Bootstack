import { useEffect, useId, useRef, useState } from "react";
import { setSmoothScrollPaused } from "../hooks/useSmoothScroll";
import "./ScheduleCall.css";

/**
 * The Schedule a Call enquiry form.
 *
 * One instance per page, opened by that page's CTA and handed the service the
 * visitor is currently reading — so all thirteen service pages share this
 * single component rather than each carrying a form of its own.
 *
 * It posts to /api/schedule-call. No key, address or transport detail exists on
 * this side of the wire: the client sends field values and reads back either
 * `{ ok: true }` or an error string.
 */

const CALL_TIMES = [
  "Morning (9am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Evening (4pm – 8pm)",
  "Anytime",
];

const EMPTY = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  preferredTime: "",
};

export default function ScheduleCall({ open, service, onClose }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [failure, setFailure] = useState("");

  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const titleId = useId();

  const set = (field) => (event) => {
    const { value } = event.target;
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  // Fresh every time it opens: a previous send should not linger.
  useEffect(() => {
    if (!open) return undefined;
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
    setFailure("");
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  // Escape closes; the page behind does not scroll. A dedicated class rather
  // than the nav's `is-locked`, so the two cannot unlock each other.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("has-modal");
    // Lenis is still running the window behind the veil; hold it so it neither
    // moves the page nor competes for the wheel.
    setSmoothScrollPaused(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("has-modal");
      setSmoothScrollPaused(false);
    };
  }, [open, onClose]);

  if (!open) return null;

  const check = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.email.trim()) next.email = "Please add an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "That email does not look right.";
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = check();
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setFailure("");

    try {
      const response = await fetch("/api/schedule-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, service }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.errors) {
          setErrors(payload.errors);
          setStatus("idle");
          return;
        }
        throw new Error(payload.error || "Request failed.");
      }

      setStatus("sent");
    } catch (error) {
      // Show what actually went wrong. The endpoint returns a plain-language
      // reason ("Email is not configured on the server yet.", for one), and
      // discarding it in favour of a generic line makes a fixable
      // misconfiguration look like a mystery outage.
      const reason =
        error.message === "Failed to fetch"
          ? "No connection. Please check your network and try again."
          : error.message || "Something went wrong.";

      setFailure(`${reason} You can also email info@thebootstack.io.`);
      setStatus("error");
    }
  };

  return (
    <div
      className="sc"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-lenis-prevent
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="sc__panel" ref={panelRef}>
        <button
          type="button"
          className="sc__close"
          onClick={onClose}
          aria-label="Close"
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

        {status === "sent" ? (
          <div className="sc__done" data-lenis-prevent>
            <p className="sc__eyebrow mono">Request received</p>
            <h2 className="sc__title" id={titleId}>
              Thank you — we&rsquo;ll be in touch.
            </h2>
            <p className="sc__note">
              Your enquiry about <strong>{service}</strong> has reached the
              Bootstack team. We usually reply within one working day.
            </p>
            <button type="button" className="sc__submit" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="sc__eyebrow mono">Schedule a call</p>
            <h2 className="sc__title" id={titleId}>
              Let&rsquo;s discuss your project
            </h2>

            <p className="sc__about">You&rsquo;re enquiring about:</p>
            <p className="sc__pill">{service}</p>

            <form className="sc__form" onSubmit={submit} noValidate data-lenis-prevent>
              <label className="sc__field">
                <span className="sc__label">Name</span>
                <input
                  ref={firstFieldRef}
                  className="sc__input"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={set("name")}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <span className="sc__error">{errors.name}</span>
                ) : null}
              </label>

              <label className="sc__field">
                <span className="sc__label">Business / Company</span>
                <input
                  className="sc__input"
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  placeholder="Your company name"
                  value={values.company}
                  onChange={set("company")}
                />
              </label>

              <label className="sc__field">
                <span className="sc__label">Email</span>
                <input
                  className="sc__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={values.email}
                  onChange={set("email")}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? (
                  <span className="sc__error">{errors.email}</span>
                ) : null}
              </label>

              <label className="sc__field">
                <span className="sc__label">WhatsApp / Phone</span>
                <input
                  className="sc__input"
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={values.phone}
                  onChange={set("phone")}
                />
              </label>

              {/* Filled from the page the visitor is on, and shown read-only so
                  the enquiry cannot arrive against the wrong service. */}
              <div className="sc__field">
                <span className="sc__label">Service</span>
                <p className="sc__service">{service}</p>
              </div>

              <label className="sc__field">
                <span className="sc__label">Brief Project Requirement</span>
                <textarea
                  className="sc__input sc__textarea"
                  name="message"
                  rows={4}
                  placeholder="Tell us briefly about your project…"
                  value={values.message}
                  onChange={set("message")}
                />
              </label>

              <label className="sc__field">
                <span className="sc__label">Preferred Call Time</span>
                <select
                  className="sc__input sc__select"
                  name="preferredTime"
                  value={values.preferredTime}
                  onChange={set("preferredTime")}
                >
                  <option value="">Select a preferred time</option>
                  {CALL_TIMES.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>

              {status === "error" ? (
                <p className="sc__failure" role="alert">
                  {failure}
                </p>
              ) : null}

              <button
                type="submit"
                className="sc__submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Submit Request"}
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
