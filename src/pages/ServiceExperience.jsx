import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gsap, ScrollTrigger } from "../lib/motion";

import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useReveal } from "../hooks/useReveal";

import Cursor from "../components/Cursor.jsx";
import BackgroundStage from "../components/BackgroundStage.jsx";
import Grain from "../components/Grain.jsx";
import Nav from "../components/Nav.jsx";
import Counter from "../components/Counter.jsx";
import MagneticButton from "../components/MagneticButton.jsx";
import ScheduleCall from "../components/ScheduleCall.jsx";
import Footer from "../sections/Footer.jsx";

import {
  serviceExperienceBySlug,
  serviceExperiences,
  serviceNeighbours,
} from "../data/serviceExperiences";
import { contact } from "../data/site";
import "./ServiceExperience.css";

/**
 * /services/:slug — one service, told as a chapter sequence.
 *
 * The page is a single continuous surface: every chapter is a `.band` carrying
 * a `data-bg`, and BackgroundStage — the same component the homepage mounts —
 * tweens the fixed plane behind them as each chapter takes the viewport
 * midline. Nothing here paints its own rectangle, so scrolling up reverses the
 * colour exactly the way it does on the homepage.
 *
 * Everything on the page is read from one data object, so all eight services
 * share this component: edit data/serviceExperiences.js and the page follows.
 */

/** Chapter grounds, in order. Keys must exist in BackgroundStage's GROUNDS. */
const CHAPTERS = [
  { id: "open", ground: "mist", label: "Overview" },
  { id: "what", ground: "white", label: "What it is" },
  { id: "importance", ground: "cyan", label: "Importance" },
  { id: "process", ground: "mist", label: "Process" },
  { id: "why", ground: "white", label: "Why it matters" },
  { id: "impact", ground: "yellow", label: "Impact" },
  { id: "close", ground: "cyandeep", label: "Next" },
];

/** "70%" -> { value: 70, suffix: "%" } so the counter can run and the bar can size. */
const splitMetric = (raw) => {
  const match = String(raw).match(/^\s*([\d.]+)\s*(.*)$/);
  if (!match) return { value: 0, suffix: "", weight: 1 };
  return {
    value: Number(match[1]),
    suffix: match[2] || "",
    weight: Number(match[1]) || 1,
  };
};

export default function ServiceExperience() {
  const { slug } = useParams();
  const service = serviceExperienceBySlug[slug];
  const rootRef = useRef(null);
  const [chapter, setChapter] = useState(0);
  const [callOpen, setCallOpen] = useState(false);

  const metrics = useMemo(
    () =>
      (service?.businessImpact.metrics ?? []).map((m) => ({
        ...m,
        ...splitMetric(m.value),
      })),
    [service],
  );

  // Only metrics with real copy earn a place in the hero. The impact chapter
  // still lists every one — that is where unwritten copy should be visible.
  const heroChips = useMemo(
    () => metrics.filter((m) => !/placeholder/i.test(m.label)).slice(0, 2),
    [metrics],
  );

  const { previous, next } = serviceNeighbours(slug);

  useSmoothScroll(true);
  useReveal([slug]);

  // A service link from another service page must start at the top, and the
  // triggers below must be rebuilt against the new content.
  useEffect(() => {
    window.scrollTo(0, 0);
    // Leave a marker so a Back navigation lands on this service's card in
    // Section 03 rather than at the top of the homepage. App clears it.
    try {
      sessionStorage.setItem("bootstack:from-service", slug);
    } catch {
      /* private mode — the marker is a convenience, not a requirement */
    }
  }, [slug]);

  useEffect(() => {
    if (!service) return undefined;
    const previousTitle = document.title;
    document.title = `${service.title} — Bootstack`;
    return () => {
      document.title = previousTitle;
    };
  }, [service]);

  // Layout settles once webfonts land — the same recalculation the homepage
  // does, so BackgroundStage's start/end points are measured against the real
  // layout rather than a fallback-font one.
  useEffect(() => {
    if (!service) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 220);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("load", refresh);
    };
  }, [service, slug]);

  useEffect(() => {
    if (!service) return undefined;

    const ctx = gsap.context(() => {
      // Which chapter owns the viewport — drives the rail's active mark. Cheap
      // enough to run unconditionally: it sets state, it does not animate.
      CHAPTERS.forEach((c, i) => {
        const el = rootRef.current?.querySelector(`#chapter-${c.id}`);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 52%",
          end: "bottom 52%",
          onEnter: () => setChapter(i),
          onEnterBack: () => setChapter(i),
        });
      });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 01 — the masthead title climbs out of its mask on load.
        gsap.from(".sx__title-line > span", {
          yPercent: 112,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.1,
          // The heading paints as gradient text; a transform left behind on a
          // descendant can drop the parent's clipped background, so the words
          // settle back to no transform at all. Same motion, clean end state.
          clearProps: "transform",
        });

        // 02 — the importance spine draws as the list is read, and each point
        // lifts as the line reaches it. Motion explaining sequence, not decor.
        gsap.to(".sx__spine-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".sx__points",
            start: "top 72%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        });

        // The stack on the right rises in lockstep with the spine.
        gsap.to(".sx__weigh-plate", {
          scaleX: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: ".sx__points",
            start: "top 72%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        });

        gsap.from(".sx__weigh-crown", {
          opacity: 0,
          y: 10,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sx__weigh", start: "bottom 80%" },
        });

        gsap.utils.toArray(".sx__point").forEach((point) => {
          gsap.from(point, {
            opacity: 0,
            y: 26,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: point, start: "top 84%" },
          });
        });

        // 03 — the process. The stage that owns the midline lights up, and the
        // rail fills in step, so the sequence reads as one connected run.
        gsap.utils.toArray(".sx__stage").forEach((stage) => {
          ScrollTrigger.create({
            trigger: stage,
            start: "top 62%",
            end: "bottom 62%",
            onToggle: (self) =>
              stage.classList.toggle("is-live", self.isActive),
          });
        });

        gsap.to(".sx__process-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".sx__stages",
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        });

        // 04 — the ratio bar unrolls left to right as the chapter is entered.
        gsap.from(".sx__bar-seg", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".sx__bar", start: "top 82%" },
        });

        // 05 — the schematic assembles itself once, on load: frames settle in,
        // then the interface draws its rows. Transform and opacity only.
        gsap
          .timeline({ delay: 0.35 })
          .from(".sx__frame", {
            opacity: 0,
            y: 22,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.09,
          })
          .from(
            ".sx__frame-bar i",
            { scale: 0, duration: 0.4, ease: "back.out(2)", stagger: 0.06 },
            "-=0.45",
          )
          .from(
            ".sx__tile",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.05,
            },
            "-=0.4",
          )
          .to(
            ".sx__wire",
            { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" },
            "-=0.35",
          )
          .from(
            ".sx__chip",
            {
              opacity: 0,
              y: 16,
              scale: 0.94,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.1,
            },
            "-=0.45",
          );
      });

      // Reduced motion: nothing scrubs, nothing hides. Every stage reads as live
      // so the process is still legible without movement.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".sx__spine-fill", ".sx__process-fill"], { scaleY: 1 });
        gsap.set(".sx__weigh-plate", { scaleX: 1 });
        gsap.set(".sx__wire", { strokeDashoffset: 0 });
        gsap.utils
          .toArray(".sx__stage")
          .forEach((stage) => stage.classList.add("is-live"));
      });
    }, rootRef);

    return () => ctx.revert();
  }, [service, slug]);

  if (!service) {
    return (
      <>
        <Cursor />
        <BackgroundStage />
        <Grain />
        <Nav ready />
        <main className="sx sx--missing">
          <section className="band" data-bg="mist">
            <div className="shell">
              <p className="mono sx__eyebrow">404</p>
              <h1 className="display display--xl">
                That service does not exist.
              </h1>
              <ul className="sx__missing-links">
                {serviceExperiences.map((s) => (
                  <li key={s.slug}>
                    <Link className="mono" to={`/services/${s.slug}`}>
                      {s.number} — {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const titleLines = service.title.split(" ");

  return (
    <>
      <Cursor />
      <BackgroundStage />
      <Grain />
      <Nav ready />

      <main
        ref={rootRef}
        className={`sx sx--${service.tone}`}
        id="top"
        key={slug}
      >
        {/* ---------- 01 · Masthead ----------
            One viewport, three bands: crumb at the top, title + visual through
            the middle, the service marker and cue at the foot. The section is
            sized so the next chapter starts as soon as the hero ends. */}
        <section id="chapter-open" className="sx__open band" data-bg="mist">
          <div className="shell sx__open-inner">
            <p className="sx__crumb mono">
              <Link to="/#capabilities">What Bootstack does</Link>
              <span aria-hidden="true">/</span>
              <span>{service.category}</span>
            </p>

            {/* Marker row sits directly under the navbar, above the title —
                not on the floor of the hero. */}
            <div className="sx__open-head">
              <p className="sx__number mono">
                <span className="sx__number-value">{service.number}</span>
                <span>Service</span>
              </p>
              <p className="sx__cue mono" aria-hidden="true">
                Scroll to read
              </p>
            </div>

            <div className="sx__open-main">
              <div className="sx__open-copy">
                {/* Fixed scale for every service, so a long name and a short
                    name carry the same weight. The title wraps; it never
                    re-sizes itself around its own length. */}
                <h1 className="sx__title display display--xl section-gradient-heading">
                  {service.title.split(" ").map((word, i) => (
                    <span className="sx__title-line" key={`${word}-${i}`}>
                      <span>{word}</span>
                    </span>
                  ))}
                </h1>

                {service.description && (
                  <p className="sx__description" data-reveal>
                    {service.description}
                  </p>
                )}

                <ul className="sx__signals">
                  {service.hero.signals.map((signal, i) => (
                    <li
                      className="sx__signal mono"
                      key={`${signal}-${i}`}
                      data-reveal
                      style={{ "--reveal-delay": `${260 + i * 70}ms` }}
                    >
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* The visual system. Structure is shared by all eight services;
                  every label inside it comes from that service's data, and
                  `theme` shifts the composition. Decorative, so it is hidden
                  from assistive tech. */}
              <div
                className={`sx__viz sx__viz--${service.hero.theme}`}
                aria-hidden="true"
              >
                <span className="sx__viz-grid" />

                <span className="sx__frame sx__frame--back" />
                <span className="sx__frame sx__frame--mid" />

                <div className="sx__frame sx__frame--front">
                  <div className="sx__frame-bar">
                    <i />
                    <i />
                    <i />
                    <span className="sx__frame-label mono">
                      {service.hero.label}
                    </span>
                    <span className="sx__pulse" />
                  </div>

                  {/* Readouts, straight from the service's data. Every tile
                      says something true about the work; none are blank. */}
                  <div className="sx__frame-body">
                    {service.hero.readouts.map((readout) => (
                      <div className="sx__tile" key={readout.label}>
                        <span className="sx__tile-value display">
                          {readout.value}
                        </span>
                        <span className="sx__tile-label mono">
                          {readout.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <span className="sx__scan" />
                </div>

                {/* Floating readouts — the service's own impact figures, so the
                    panels say something true rather than being chrome. A metric
                    still carrying placeholder copy is skipped rather than shown:
                    the hero never displays a card with nothing real in it, and
                    each one appears by itself once the figure is written. */}
                {heroChips.map((m, i) => (
                  <div className={`sx__chip sx__chip--${i + 1}`} key={m.label}>
                    <span className="sx__chip-value display">
                      {m.value}
                      {m.suffix}
                    </span>
                    <span className="sx__chip-label mono">{m.label}</span>
                  </div>
                ))}

                <svg
                  className="sx__wires"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    className="sx__wire"
                    d="M 18 26 L 78 12"
                    pathLength="100"
                  />
                  <path
                    className="sx__wire"
                    d="M 66 74 L 88 88"
                    pathLength="100"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 02 · What it is ---------- */}
        <section id="chapter-what" className="sx__what band" data-bg="white">
          <div className="shell sx__what-inner">
            <p className="sx__label mono" data-reveal>
              {service.whatItIs.title}
            </p>
            <p className="sx__statement display display--xl" data-reveal>
              {service.whatItIs.description}
            </p>
          </div>
        </section>

        {/* ---------- 03 · Importance ---------- */}
        <section
          id="chapter-importance"
          className="sx__importance band"
          data-bg="cyan"
        >
          <div className="shell sx__importance-grid">
            <div className="sx__importance-copy">
              <p className="sx__label mono" data-reveal>
                {service.importance.title}
              </p>

              <ol className="sx__points">
                <span className="sx__spine" aria-hidden="true">
                  <i className="sx__spine-fill" />
                </span>

                {service.importance.points.map((point, i) => (
                  <li className="sx__point" key={point}>
                    <span className="sx__point-num mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="sx__point-text display">{point}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* The same points, stacked. One plate each, widening as they go
                up: the reasons compound rather than sitting side by side. It
                builds on the same scroll range as the spine, so the two halves
                move together. Decorative - the list beside it is the content. */}
            <div className="sx__weigh" aria-hidden="true">
              <span className="sx__weigh-grid" />

              <ol className="sx__weigh-stack">
                {service.importance.points.map((point, i) => (
                  <li
                    className="sx__weigh-plate"
                    key={point}
                    style={{ "--i": i }}
                  >
                    <span className="sx__weigh-num mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ol>

              <span className="sx__weigh-crown mono">{service.category}</span>
            </div>
          </div>
        </section>

        {/* ---------- 04 · Consultation process ---------- */}
        <section
          id="chapter-process"
          className="sx__process band"
          data-bg="mist"
        >
          <div className="shell sx__process-inner">
            <div className="sx__process-aside">
              <p className="sx__label mono" data-reveal>
                Our Consultation Process
              </p>
              <p className="sx__process-count display" data-reveal>
                {String(service.consultationProcess.length).padStart(2, "0")}
                <span className="mono">stages</span>
              </p>
            </div>

            <ol className="sx__stages">
              <span className="sx__process-track" aria-hidden="true">
                <i className="sx__process-fill" />
              </span>

              {service.consultationProcess.map((stage) => (
                <li className="sx__stage" key={stage.number}>
                  <span className="sx__stage-dot" aria-hidden="true" />
                  <span className="sx__stage-num mono">{stage.number}</span>
                  <h3 className="sx__stage-title display">{stage.title}</h3>
                  <p className="sx__stage-text">{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- 05 · Why it matters ---------- */}
        <section id="chapter-why" className="sx__why band" data-bg="white">
          <div className="shell sx__why-inner">
            <p className="sx__label mono" data-reveal>
              {service.whyItMatters.title}
            </p>
            <p className="sx__why-text display display--xl" data-reveal>
              {service.whyItMatters.description}
            </p>
          </div>
        </section>

        {/* ---------- 06 · Business impact ---------- */}
        <section
          id="chapter-impact"
          className="sx__impact band"
          data-bg="yellow"
        >
          <div className="shell">
            <p className="sx__label mono" data-reveal>
              {service.businessImpact.title}
            </p>

            <p className="sx__equation display display--xxl" data-reveal>
              {service.businessImpact.statement}
            </p>

            {/* The ratio, drawn to scale rather than listed. */}
            <div
              className="sx__bar"
              role="img"
              aria-label={metrics
                .map((m) => `${m.value}${m.suffix} ${m.label}`)
                .join(", ")}
            >
              {metrics.map((m) => (
                <span
                  className="sx__bar-seg"
                  key={m.label}
                  style={{ flexGrow: m.weight }}
                  aria-hidden="true"
                />
              ))}
            </div>

            <dl className="sx__metrics">
              {metrics.map((m, i) => (
                <div
                  className="sx__metric"
                  key={m.label}
                  style={{
                    flexGrow: m.weight,
                    "--reveal-delay": `${i * 90}ms`,
                  }}
                  data-reveal
                >
                  <dt className="sx__metric-value display">
                    <Counter value={m.value} suffix={m.suffix} />
                  </dt>
                  <dd className="sx__metric-label mono">{m.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

       {/* ---------- 07 · Close ---------- */}
<section
  id="chapter-close"
  className="sx__close band"
  data-bg="cyandeep"
>
  <div className="shell sx__close-inner">
    <p className="sx__label mono" data-reveal>
      Start your project
    </p>

    <h2 className="sx__close-title" data-reveal>
  Let&rsquo;s put {service.title.toLowerCase()} to work for your
  business.
</h2>

    <div
      className="sx__actions"
      data-reveal
      style={{ "--reveal-delay": "80ms" }}
    >
      <MagneticButton
        as="button"
        type="button"
        variant="solid"
        onClick={() => setCallOpen(true)}
      >
        Start Your Project
      </MagneticButton>

      <MagneticButton
        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
        variant="ghost"
      >
        Book a Consultation Call
      </MagneticButton>
    </div>

    <nav className="sx__walk" aria-label="Services">
      {previous ? (
        <Link
          className="sx__walk-link"
          to={`/services/${previous.slug}`}
        >
          <span className="mono">&larr; Previous</span>
          <span className="sx__walk-name display">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      <Link className="sx__walk-back mono" to="/#idea">
        Back to Services
      </Link>

      {next ? (
        <Link
          className="sx__walk-link sx__walk-link--next"
          to={`/services/${next.slug}`}
        >
          <span className="mono">Next &rarr;</span>
          <span className="sx__walk-name display">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  </div>
</section>
      </main>

      <Footer />

      <ScheduleCall
        open={callOpen}
        service={service.title}
        onClose={() => setCallOpen(false)}
      />
    </>
  );
}
