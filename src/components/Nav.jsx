import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { nav as navLinks, brand, contact, socials } from "../data/site";
import Wordmark from "./Wordmark.jsx";
import "./Nav.css";

/**
 * The bar reads the ground it is sitting on (via the same `data-bg` contract the
 * BackgroundStage uses) and inverts itself over light sections. It retracts on
 * the way down and returns on the way up, so the page keeps the full viewport
 * while you are reading.
 */
export default function Nav({ ready }) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;

    // The bar's entrance is a CSS transition on [data-state], not a GSAP `from`
    // tween: a from-tween writes opacity:0 inline the moment it is created, and
    // anything that interrupts it before it plays strands the nav invisible.
    //
    // There is no colour inversion to manage any more — every ground on the page
    // is light, so the bar stays ink throughout.

    const ctx = gsap.context(() => {
      // Retract while scrolling down past the first screen.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const hidden = self.direction === 1 && self.scroll() > 240;
          rootRef.current?.classList.toggle("is-hidden", hidden);
          rootRef.current?.classList.toggle("is-stuck", self.scroll() > 120);
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
  }, [open]);

  return (
    <>
      <header ref={rootRef} className="nav" data-state={ready ? "in" : "out"}>
        <div className="nav__bar">
          <a
            className="nav__brand"
            href="#top"
            aria-label={`${brand.name} — home`}
          >
            <Wordmark />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((link) => {
              const isServices = link.label.toLowerCase() === "services";

              if (isServices) {
                return (
                  <div className="nav__services" key={link.href}>
                    <a
                      className="nav__link nav__services-trigger mono"
                      href={link.href}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true">{link.label}</span>

                      <span className="nav__services-arrow" aria-hidden="true">
                        ↓
                      </span>
                    </a>

                    <div className="nav__dropdown">
                      <div className="nav__dropdown-grid">
                        <div className="nav__dropdown-column">
                          <Link to="/services/performance-marketing">
                            Performance Marketing
                          </Link>

                          <Link to="/services/branding-uiux">
                            Branding &amp; UI/UX
                          </Link>

                          <Link to="/services/website-development">
                            Website Development
                          </Link>

                          <Link to="/services/app-development">
                            App Development
                          </Link>
                        </div>

                        <div className="nav__dropdown-column">
                          <Link to="/services/social-media">
                            Social Media Management
                          </Link>

                          <Link to="/services/brand-consultation">
                            Brand Consultation
                          </Link>

                          <Link to="/services/software-development">
                            Software Development
                          </Link>

                          <Link to="/services/marketing-automation">
                            Marketing Automation
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a key={link.href} className="nav__link mono" href={link.href}>
                  <span>{link.label}</span>
                  <span aria-hidden="true">{link.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="nav__actions">
            <a
  className="nav__cta mono"
  href="https://wa.me/+919975499956?text=Hi%20Bootstack%20Team%2C%0A%0AI%20visited%20your%20website%20and%20would%20like%20to%20discuss%20my%20project.%20Please%20get%20in%20touch%20with%20me."
  target="_blank"
  rel="noopener noreferrer"
>
  Contact Us
</a>
            <button
              type="button"
              className={`nav__toggle${open ? " is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-panel"
            >
              <span className="visually-hidden">
                {open ? "Close menu" : "Open menu"}
              </span>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="nav-panel"
        className={`menu${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <div className="menu__inner shell">
          <nav className="menu__links" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ "--i": i }}
                className="display display--xl"
              >
                <span className="menu__index mono">0{i + 1}</span>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="menu__foot">
            <a className="menu__mail" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <ul className="menu__social mono">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
