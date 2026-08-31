import SectionMarker from "../components/SectionMarker.jsx";
import { testimonials } from "../data/approach";
import "./About.css";

/* The four moves Bootstack runs, in order. */
const STAGES = ["Consult", "Solution", "Execution", "Growth"];

/* About Bootstack information */
const FOUNDER_INFO = [
  {
    name: "Aayush Vora",
    label: "CEO, Co-Founder, Bootstack",
  },
  {
    name: "Aman Bele, Shraddha Nayak",
    label: "Leadership",
  },
  {
    name: "Pune, Mumbai, Nashik, Ahmedabad",
    label: "City",
  },
];

/* Founder testimonial */
const [founder] = testimonials;

export default function About() {
  return (
    <section id="about" className="about band" data-bg="cyan">
      <div className="shell about__inner">
        {/* SECTION MARKER */}
        <SectionMarker index="04" title="About Bootstack" />

        {/* ============================================================
            MAIN ABOUT LAYOUT
            LEFT  = IMAGE + FOUNDER
            RIGHT = ABOUT CONTENT + STAGES + LEADERSHIP + CITY
            ============================================================ */}

        <div className="about__main">
          {/* ==========================================================
              LEFT COLUMN
              ========================================================== */}

          <aside className="about__founder">
            {/* Founder image placeholder */}
            <div
              className="about__portrait"
              data-reveal
              aria-label="Founder image placeholder"
            />

            {/* Founder name + role */}
            <div className="about__founder-main" data-reveal>
              <span className="about__name">{FOUNDER_INFO[0].name}</span>

              <span className="about__role mono">{FOUNDER_INFO[0].label}</span>
            </div>
          </aside>

          {/* ==========================================================
              RIGHT COLUMN
              ========================================================== */}

          <div className="about__col">
            {/* MAIN HEADING */}
            <h2
              className="about__statement display display--xl section-gradient-heading"
              data-reveal
            >
              I didn&rsquo;t start Bootstack to build projects. I started it to{" "}
              <span className="accent">build businesses.</span>
            </h2>

            {/* MAIN ABOUT COPY */}
            <div className="about__copy">
              <p className="lead" data-reveal>
                Too many companies invest in websites, marketing and software
                separately, without a clear strategy.
              </p>

              <p
                className="body"
                data-reveal
                style={{ "--reveal-delay": "80ms" }}
              >
                Bootstack was created to bring everything together from branding
                and technology to automation and growth, so every solution works
                toward one goal: helping businesses scale. One team decides the
                positioning, makes the work, ships the platform and runs the
                media, so there is never a question about who is accountable for
                the number.
              </p>
            </div>

            {/* ========================================================
                THANK YOU MESSAGE
                ======================================================== */}

            <figure
              className="about__note"
              data-reveal
              style={{ "--reveal-delay": "120ms" }}
            >
              <blockquote className="about__thanks">
                {founder?.quote ||
                  "Thank you for trusting Bootstack. We're excited to be part of your growth journey."}
              </blockquote>
            </figure>

            {/* ========================================================
                FOUR STAGES
                ======================================================== */}

            <ul
              className="about__stages"
              data-reveal
              style={{ "--reveal-delay": "180ms" }}
            >
              {STAGES.map((stage, i) => (
                <li className="about__stage" key={stage}>
                  <span className="about__stage-num mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {stage}
                </li>
              ))}
            </ul>

            {/* ========================================================
                LEADERSHIP + CITY

                IMPORTANT:
                This is INSIDE about__col.

                Therefore desktop and mobile naturally follow:

                Thank You
                    ↓
                Stages
                    ↓
                Leadership
                    ↓
                City
                ======================================================== */}

            <div className="about__record">
              {/* LEADERSHIP */}
              <div className="about__position" data-reveal>
                <span className="about__name">{FOUNDER_INFO[1].name}</span>

                <span className="about__role mono">
                  {FOUNDER_INFO[1].label}
                </span>
              </div>

              {/* CITY */}
              <div className="about__position" data-reveal>
                <span className="about__name">{FOUNDER_INFO[2].name}</span>

                <span className="about__role mono">
                  {FOUNDER_INFO[2].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
