import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import SectionMarker from "../components/SectionMarker.jsx";
import { testimonials } from "../data/approach";
import "./About.css";

const INTERSECTION = [
  "Branding",
  "Creativity",
  "Marketing",
  "Technology",
  "Automation",
];

// The one founder area: name over role, read as a ledger under the portrait.
const FOUNDER_INFO = [
  { name: "Aayush Vora", label: "CEO, Co-Founder, Bootstack" },
  { name: "Aman Bele, Shraddha Nayak", label: "Leadership" },
  { name: "Pune, Mumbai, Nashik, Ahmedabad", label: "City" },
];

// The founder's line heads the founder column; the remaining two are
// Bootstack's stated positions, kept together under a rule further down.
const [founder, ...positions] = testimonials;

/**
 * Section 04 — About Bootstack.
 *
 * Two columns: the statement and the argument read down the left, the founder
 * — portrait, his line, then the ledger — sits together on the right. The
 * stated positions close the prose between two rules, and the drifting
 * intersection words run full-bleed underneath as the coda.
 */
export default function About() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".about__word", {
          xPercent: (i) => (i % 2 ? -6 : 6),
          ease: "none",
          scrollTrigger: {
            trigger: ".about__words",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="about" className="about band" data-bg="cyan">
      <div className="shell about__inner">
        <SectionMarker index="04" title="About Bootstack" />

        <div className="about__main">
          <div className="about__col">
            <h2 className="about__statement display display--xl section-gradient-heading" data-reveal>
              I didn&rsquo;t start Bootstack to build projects. I started it to{" "}
              <span className="accent">build businesses.</span>
            </h2>

            <div className="about__copy">
              <p className="lead" data-reveal>
                Too many companies invest in websites, marketing and software
                separately, without a clear strategy.
              </p>
              <p className="body" data-reveal style={{ "--reveal-delay": "80ms" }}>
                Bootstack was created to bring everything together from branding
                and technology to automation and growth, so every solution works
                toward one goal: helping businesses scale. One team decides the
                positioning, makes the work, ships the platform and runs the media,
                so there is never a question about who is accountable for the
                number.
              </p>
            </div>
          </div>

          <aside className="about__founder">
            {/* Portrait slot — drop the founder image in here as
                <img src={...} alt="Aayush Vora" /> and it will fill the frame. */}
            <div className="about__portrait" data-reveal />

            <p className="about__thanks" data-reveal style={{ "--reveal-delay": "70ms" }}>
              {founder.quote}
            </p>

            <ul className="about__ledger">
              {FOUNDER_INFO.map((row, i) => (
                <li
                  className="about__ledger-row"
                  key={row.label}
                  data-reveal
                  style={{ "--reveal-delay": `${140 + i * 70}ms` }}
                >
                  <span className="about__name">{row.name}</span>
                  <span className="about__role mono">{row.label}</span>
                </li>
              ))}
            </ul>
          </aside>

          {positions.length > 0 && (
            <div className="about__record">
              <div className="about__record-pair">
                {positions.map((item, i) => (
                  <figure
                    className="about__position"
                    key={item.id}
                    data-reveal
                    style={{ "--reveal-delay": `${i * 90}ms` }}
                  >
                    <blockquote className="about__position-text">
                      {item.quote}
                    </blockquote>
                    <figcaption className="about__meta">
                      <span className="about__role mono">{item.role}</span>
                      <span className="about__where mono">{item.industry}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="about__words" aria-hidden="true">
        {INTERSECTION.map((word) => (
          <span className="about__word display" key={word}>
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
