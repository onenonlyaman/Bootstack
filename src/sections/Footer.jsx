import { useState } from "react";
import { Link } from "react-router-dom";
import Wordmark from "../components/Wordmark.jsx";
import ScheduleCall from "../components/ScheduleCall.jsx";
import { openCookiePreferences } from "../lib/consent";
import {
  brand,
  footerQuickLinks,
  footerResources,
  socials,
  contact,
} from "../data/site";
import "./Footer.css";

const year = new Date().getFullYear();

/** The same WhatsApp chat the nav opens, with the same opening message. */
const WHATSAPP_URL = `https://wa.me/+${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi Bootstack Team,\n\nI visited your website and would like to discuss my project. Please get in touch with me.",
)}`;

/** Instagram, LinkedIn and Facebook from data/site.js, then WhatsApp. */
const FOOTER_SOCIALS = [
  ...["Instagram", "LinkedIn", "Facebook"]
    .map((label) => socials.find((social) => social.label === label))
    .filter(Boolean),
  { label: "WhatsApp", href: WHATSAPP_URL },
];

/** Social marks, keyed by label. Outline glyphs on a 24px grid. */
const SOCIAL_ICONS = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  LinkedIn: (
    <>
      <path d="M6.5 10v8" />
      <circle cx="6.5" cy="6.6" r="1.3" />
      <path d="M11 18v-4.6a2.6 2.6 0 0 1 5.2 0V18" />
      <path d="M11 10v8" />
    </>
  ),
  Facebook: (
    <path d="M14.5 8.5h2V5.6h-2.3c-2.2 0-3.4 1.3-3.4 3.4v1.8H9v2.9h1.8V21h3v-7.3h2.2l.4-2.9h-2.6V9.4c0-.6.3-.9.7-.9Z" />
  ),
  WhatsApp: (
    <>
      <path d="M3.8 20.2 5 16.1a8.6 8.6 0 1 1 3 3Z" />
      <path d="M9.1 8.4c.3-.5.9-.5 1.1 0l.8 1.8c.1.3 0 .6-.2.8l-.6.6a6 6 0 0 0 2.9 2.9l.6-.6c.2-.2.5-.3.8-.2l1.8.8c.5.2.5.8 0 1.1-.6.5-1.4.8-2.2.6a7.3 7.3 0 0 1-5.6-5.6c-.2-.8.1-1.6.6-2.2Z" />
    </>
  ),
};

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.6",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

/** In-page chapters are plain anchors; real routes go through the router. */
function FooterLink({ label, to }) {
  return to.startsWith("/#") || to.startsWith("#") ? (
    <a href={to}>{label}</a>
  ) : (
    <Link to={to}>{label}</Link>
  );
}

/**
 * Three columns, on the site's own light ground:
 *
 *   [ brand + socials ]   [ contact / resources ]   [ quick links ]
 *
 * A hairline rule opens it, with a port at its start and a signal that runs
 * along it now and then; a patch of board grid and a small trace network sit
 * faintly in the top corner. Phones stack the columns in the same order.
 */
export default function Footer() {
  const [callOpen, setCallOpen] = useState(false);

  return (
    <footer className="foot" data-bg="mist">
      <div className="foot__backdrop" aria-hidden="true">
        <span className="foot__grid" />
        <svg className="foot__net" viewBox="0 0 520 240" focusable="false">
          <path className="foot__trace" d="M0 36H148l28 28H300l24-24H520" />
          <path className="foot__trace" d="M176 64v58l22 22h118" />
          <path className="foot__trace" d="M324 40v84l24 24h172" />
          <path className="foot__trace foot__trace--soft" d="M198 144v96" />
          <rect className="foot__node" x="144" y="32" width="8" height="8" />
          <rect className="foot__node" x="296" y="60" width="8" height="8" />
          <rect
            className="foot__node foot__node--lit"
            x="320"
            y="120"
            width="8"
            height="8"
          />
          <rect className="foot__node" x="312" y="140" width="8" height="8" />
          <rect className="foot__node" x="194" y="140" width="8" height="8" />
        </svg>
      </div>

      <div className="shell foot__shell">
        <span className="foot__rule" aria-hidden="true">
          <i />
        </span>

        <div className="foot__cols">
          {/* 1 — brand and socials */}
          <div className="foot__brandcol">
            <a
              className="foot__brand"
              href="#top"
              aria-label={`${brand.name} — back to top`}
            >
              <Wordmark />
            </a>

            <p className="foot__blurb">{brand.blurb}</p>

            <ul
              className="foot__social"
              aria-label={`${brand.name} on social media`}
            >
              {FOOTER_SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <svg {...ICON_PROPS}>{SOCIAL_ICONS[social.label]}</svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 2 — contact, then resources */}
          <div className="foot__mid">
            <address className="foot__group foot__contact">
              <h2 className="foot__label">Contact Us</h2>
              <ul className="foot__contact-list">
                <li>
                  <a href={`mailto:${contact.email}`}>
                    <span className="foot__ico">
                      <svg {...ICON_PROPS}>
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                    <span className="foot__ico">
                      <svg {...ICON_PROPS}>
                        <path d="M5 4h3.5l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L15 13l4 1.5V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
                      </svg>
                    </span>
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <span className="foot__place">
                    <span className="foot__ico">
                      <svg {...ICON_PROPS}>
                        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
                        <circle cx="12" cy="10" r="2.3" />
                      </svg>
                    </span>
                    {contact.location}
                  </span>
                </li>
              </ul>

              {/* Opens the same enquiry form the service pages use. */}
              <button
                type="button"
                className="foot__book"
                onClick={() => setCallOpen(true)}
              >
                Book a Call
                <span aria-hidden="true">&rarr;</span>
              </button>
            </address>

            <nav className="foot__group" aria-label="Resources">
              <h2 className="foot__label">Resources</h2>
              <ul className="foot__links">
                {footerResources.map((item) => (
                  <li key={item.label}>
                    <FooterLink {...item} />
                  </li>
                ))}
                <li>
                  {/* Re-opens the consent panel rather than going anywhere. */}
                </li>
              </ul>
            </nav>
          </div>

          {/* 3 — quick links */}
          <nav className="foot__group foot__quick" aria-label="Quick links">
            <h2 className="foot__label">Quick Links</h2>
            <ul className="foot__links foot__links--caps">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="foot__base">
          <p className="mono">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>

      <ScheduleCall
        open={callOpen}
        service="General enquiry"
        onClose={() => setCallOpen(false)}
      />
    </footer>
  );
}
