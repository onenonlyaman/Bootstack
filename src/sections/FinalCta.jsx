import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import MagneticButton from "../components/MagneticButton.jsx";
import { contact } from "../data/site";
import "./FinalCta.css";

const HEADING = ["Let's build your", "growth system."];

const CTA_POINTS = [
  "Brand Strategy",
  "Website",
  "Marketing",
  "Technology & Software",
];

/**
 * Section 08 — the closing beat. The ground turns brand yellow, the type fills
 * the screen, and everything the visitor needs to start a conversation is here.
 */
export default function FinalCta() {
  const rootRef = useRef(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta__line > span", {
          yPercent: 112,
          duration: 1.35,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".cta__heading", start: "top 85%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="contact" className="cta band" data-bg="yellow">
      <div className="shell cta__inner">
        <p className="cta__eyebrow mono" data-reveal>
          Start your project
        </p>

        <h2 className="cta__heading display display--mega">
          {HEADING.map((line, i) => (
            <span className={`cta__line cta__line--${i + 1}`} key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h2>

        <div className="cta__body">
          <p className="cta__support lead" data-reveal>
            Tell us about your business, goals and challenges. Our team will
            recommend the right branding, marketing, technology and automation
            strategy to help you grow.
          </p>

          <div className="cta__points" data-reveal>
            {CTA_POINTS.map((point) => (
              <span className="cta__point" key={point}>
                <span aria-hidden="true">•</span>
                {point}
              </span>
            ))}
          </div>

          <div
            className="cta__actions"
            data-reveal
            style={{ "--reveal-delay": "80ms" }}
          >
            <MagneticButton
              as="button"
              type="button"
              variant="solid"
              onClick={() => setFormOpen(true)}
            >
              Start Your Project
            </MagneticButton>
          </div>
        </div>
      </div>

      {formOpen && (
        <div
          className="project-form-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Start your project form"
          onClick={() => setFormOpen(false)}
        >
          <div
            className="project-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="project-form-close"
              aria-label="Close form"
              onClick={() => setFormOpen(false)}
            >
              ×
            </button>

            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdfjni5XcbpQTtJ99tCgBPfDYgMMVM6aw86sJ6uDLY2ekqJdA/viewform"
              title="Start Your Project"
              className="project-form-iframe"
            />
          </div>
        </div>
      )}
    </section>
  );
}
