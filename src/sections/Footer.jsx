import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';
import ScheduleCall from '../components/ScheduleCall.jsx';
import {
  brand,
  nav,
  footerServices,
  footerResources,
  socials,
  contact,
} from '../data/site';
import './Footer.css';

const year = new Date().getFullYear();

/** Social marks, keyed by the label already in data/site.js. */
const SOCIAL_ICONS = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <path d="M14.5 8.5h2V5.6h-2.3c-2.2 0-3.4 1.3-3.4 3.4v1.8H9v2.9h1.8V21h3v-7.3h2.2l.4-2.9h-2.6V9.4c0-.6.3-.9.7-.9Z" />
  ),
  X: (
    <>
      <path d="M4 4l7.4 9.6L4.4 21" />
      <path d="M20 21l-7.4-9.6L19.6 4" />
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
};

/** A resource with no route yet stays plain text — a dead link is worse. */
function FooterItem({ label, to }) {
  if (!to) return <span className="foot__soon">{label}</span>;
  return to.startsWith('/#') || to.startsWith('#') ? (
    <a href={to}>{label}</a>
  ) : (
    <Link to={to}>{label}</Link>
  );
}

export default function Footer() {
  const [callOpen, setCallOpen] = useState(false);

  return (
    <footer className="foot" data-bg="cyandeep">
      <div className="shell">
        <div className="foot__cols">
          {/* 1 — brand */}
          <div className="foot__brandcol">
            <a
              className="foot__brand"
              href="#top"
              aria-label={`${brand.name} — back to top`}
            >
              <Wordmark />
            </a>

            <p className="foot__blurb">{brand.blurb}</p>

            <ul className="foot__social">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {SOCIAL_ICONS[social.label]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 2 — quick links */}
          <nav className="foot__col" aria-label="Quick links">
            <h2 className="foot__label">Quick Links</h2>
            <ul>
              {nav.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </nav>

          {/* 3 — services, each to its own page */}
          <nav className="foot__col" aria-label="Services">
            <h2 className="foot__label">Services</h2>
            <ul>
              {footerServices.map((service) => (
                <li key={service.label}>
                  <FooterItem {...service} />
                </li>
              ))}
            </ul>
          </nav>

          {/* 4 — resources */}
          <nav className="foot__col" aria-label="Resources">
            <h2 className="foot__label">Resources</h2>
            <ul>
              {footerResources.map((item) => (
                <li key={item.label}>
                  <FooterItem {...item} />
                </li>
              ))}

              
            </ul>
          </nav>

          {/* 5 — contact */}
          <address className="foot__col foot__contact">
            <h2 className="foot__label">Contact Us</h2>
            <ul>
              <li>
                <a href={`mailto:${contact.email}`}>
                  <svg
                    className="foot__ico"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
                  <svg
                    className="foot__ico"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M5 4h3.5l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L15 13l4 1.5V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
                  </svg>
                  {contact.phone}
                </a>
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
        </div>

        <div className="foot__base">
          <p className="mono">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
          <a className="foot__top-link mono" href="#top">
            Back to top
            <span aria-hidden="true">&uarr;</span>
          </a>
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
