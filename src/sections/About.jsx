import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { focusShift } from "../components/SystemScene.jsx";
import { testimonials } from "../data/approach";
import "./About.css";

/* About Bootstack information */
const FOUNDER_INFO = [
  {
    name: "Aayush Vora",
    label: "Founder, Bootstack",
  },
];

/*
 * The founder photograph for the reserved visual space. Import the image and
 * set it here (e.g. `import founderImage from "../assets/founder.jpg"`); until
 * then the frame shows the Bootstack system mark instead of an empty box.
 */
const FOUNDER_IMAGE = null;

/* Founder testimonial */
const [founder] = testimonials;

/*
 * The founder's line is the chapter's heading, one entry per line of the
 * design so each line can rise on its own.
 */
const TITLE = [
  "I didn’t start Bootstack",
  "to build projects.",
  "I started it to build",
  "businesses.",
];

/*
 * Where the system's core sat in Section 02, so the signal line that left it
 * continues into this section at exactly the same x. Desktop: the full-width
 * scene's focus (70% plus its narrow-screen nudge). Below that: the system
 * bus's spine, one gutter plus 1.6rem in from the left.
 */
const SYSTEM_FX = 0.7;

/**
 * Section 03 — About Bootstack.
 *
 * Section 02 ends by handing its signal down out of the core. This chapter
 * catches that line: it drops onto the section rule and lights it, and the
 * story turns from what the system does to who builds it — the founder, his
 * reason for starting Bootstack, the story behind it, and the path every
 * engagement runs.
 */
export default function About() {
  const rootRef = useRef(null);

  // ---- Geometry: place the incoming signal under Section 02's core ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const measure = () => {
      const box = root.getBoundingClientRect();
      const rule = root.querySelector(".about__rule").getBoundingClientRect();
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const gutter =
        parseFloat(
          getComputedStyle(root.querySelector(".about__inner")).paddingLeft,
        ) || 0;

      const coreX = desktop
        ? (SYSTEM_FX + focusShift(box.width)) * box.width
        : gutter + 1.6 * rem;
      root.style.setProperty("--core-x", `${coreX.toFixed(1)}px`);
      root.style.setProperty(
        "--rule-y",
        `${(rule.top - box.top + rule.height / 2).toFixed(1)}px`,
      );
      root.style.setProperty(
        "--rule-origin",
        `${(coreX - (rule.left - box.left)).toFixed(1)}px`,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ScrollTrigger.addEventListener("refresh", measure);
    let live = true;
    document.fonts?.ready.then(() => live && measure());

    return () => {
      live = false;
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, []);

  // ---- The chapter, revealed by scroll ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      root
        .querySelectorAll("[data-lit]")
        .forEach((el) => el.setAttribute("data-lit", "true"));
      return undefined;
    }

    const ctx = gsap.context(() => {
      const rule = root.querySelector(".about__rule");
      const setLit = (el, on) =>
        el.setAttribute("data-lit", on ? "true" : "false");

      // 1 · The signal from Section 02's core drops onto the section rule.
      gsap.fromTo(
        ".about__entry",
        { "--p": 0 },
        {
          "--p": 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            endTrigger: rule,
            end: "center 60%",
            scrub: 1.0,
            onUpdate: (self) =>
              setLit(root.querySelector(".about__chip"), self.progress > 0.97),
          },
        },
      );

      // 2 · The rule lights outward from where the signal landed; the label rises;
      //     the board detail beside the chip switches on a node at a time.
      const nodes = gsap.utils.toArray(".about__node");
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rule,
            start: "center 72%",
            end: "center 30%",
            scrub: 1.0,
            onUpdate: (self) =>
              nodes.forEach((node, i) =>
                setLit(node, self.progress > 0.25 + i * 0.16),
              ),
          },
        })
        .fromTo(
          ".about__rule-lit",
          { scaleX: 0 },
          { scaleX: 1, duration: 1 },
          0,
        )
        // Pixels, not yPercent: a percentage offset can be stacked with a stale
        // pixel offset when a reload lands mid-page, leaving the label hidden.
        .fromTo(
          ".about__marker-label > span",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          0.1,
        )
        .fromTo(
          ".about__grid",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.2,
        );

      // 3 · The founder image opens, settling as it does.
      gsap.fromTo(
        ".about__visual-space",
        { clipPath: "inset(14% 6% 0% 6% round 22px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 22px)",
          ease: "none",
          scrollTrigger: {
            trigger: ".about__visual-space",
            start: "top 95%",
            end: "top 25%",
            scrub: 1.05,
          },
        },
      );
      gsap.fromTo(
        ".about__visual-media",
        { scale: 1.12, y: 18 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".about__visual-space",
            start: "top 95%",
            end: "bottom 35%",
            scrub: 1.05,
          },
        },
      );

      // 4 · The founder's line enters, line by line.
      //
      // Driven by one number, `--reveal`, on the heading rather than a transform
      // on each line: About.css turns it into each line's offset. A transform
      // tween on the lines could be left stranded at its hidden start after a
      // reload (a stale percentage offset stacked on a pixel one), which is what
      // kept the heading invisible. The CSS default is 1 — fully shown — so if
      // this tween is ever reverted or never runs, the heading is still there.
      gsap.fromTo(
        ".about__title",
        { "--reveal": 0 },
        {
          "--reveal": 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".about__title",
            start: "top 88%",
            end: "bottom 50%",
            scrub: 1.0,
          },
        },
      );

      // 5 · Attribution and story follow the statement.
      gsap.utils.toArray(".about__rise").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 55%",
              scrub: 1.0,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="about"
      className="about"
      data-bg="mist"
      aria-labelledby="about-title"
    >
      {/* The signal arriving from Section 02's core. */}
      <span className="about__entry" aria-hidden="true">
        <i className="about__entry-fill" />
        <i className="about__entry-head" />
      </span>

      <span className="about__chip" data-lit="false" aria-hidden="true">
        <b>B</b>
        <i />
      </span>

      <div className="about__grid" aria-hidden="true">
        <i className="about__node" data-lit="false" />
        <i className="about__node" data-lit="false" />
        <i className="about__node about__node--accent" data-lit="false" />
        <i className="about__node" data-lit="false" />
      </div>

      <div className="shell about__inner">
        {/* ============================================================
            MARKER — 03 / About Bootstack, on the rule the signal lights
            ============================================================ */}
        <div className="about__marker">
          <p className="about__marker-label mono">
            <span>
              <b>03</b> / About Bootstack
            </span>
          </p>
          <span className="about__rule" aria-hidden="true">
            <i className="about__rule-lit" />
          </span>
        </div>

        <div className="about__main">
          {/* ============================================================
              ABOUT VISUAL
              Reserved for the Bootstack founder image
              ============================================================ */}
          <figure className="about__visual-space">
            <div className="about__visual-media">
              {FOUNDER_IMAGE ? (
                <img
                  src={FOUNDER_IMAGE}
                  alt={FOUNDER_INFO[0].name}
                  loading="lazy"
                />
              ) : (
                <div className="about__visual-placeholder" aria-hidden="true">
                  <span className="about__visual-grid" />
                  <span className="about__visual-mark">
                    <b>B</b>
                    <i />
                  </span>
                </div>
              )}
            </div>
            <span
              className="about__visual-corner about__visual-corner--tl"
              aria-hidden="true"
            />
            <span
              className="about__visual-corner about__visual-corner--br"
              aria-hidden="true"
            />
          </figure>

          <div className="about__content">
            {/* ==========================================================
                THE HEADING — the founder's reason for Bootstack
                ========================================================== */}
            <h2 id="about-title" className="about__title display">
              {TITLE.map((line, i) => (
                <span
                  className="about__title-line"
                  key={line}
                  style={{ "--i": i }}
                >
                  <span>
                    {i === 0 ? (
                      <span className="about__qmark">&ldquo;</span>
                    ) : null}
                    {line}
                    {i === TITLE.length - 1 ? (
                      <span className="about__qmark">&rdquo;</span>
                    ) : null}
                  </span>
                </span>
              ))}
            </h2>

            {/* ==========================================================
                THE STORY
                ========================================================== */}
            <div className="about__copy">
              <p className="about__lead about__rise">
                Too many companies invest in websites, marketing and software
                separately, without a clear strategy.
              </p>

              <p className="about__rise">
                Bootstack was created to bring everything together from branding
                and technology to automation and growth, so every solution works
                toward one goal: helping businesses scale.
              </p>

              <p className="about__rise">
                One team decides the positioning, makes the work, ships the
                platform and runs the media, so there is never a question about
                who is accountable for the number.
              </p>

              <blockquote className="about__thanks about__rise">
                {founder?.quote ||
                  "Thank you for trusting Bootstack. We're excited to be part of your growth journey."}
              </blockquote>

              <p className="about__byline about__rise">
                <span className="about__name">{FOUNDER_INFO[0].name}</span>
                <span className="about__role mono">
                  {FOUNDER_INFO[0].label}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
