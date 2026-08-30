import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { gsap, ScrollTrigger } from "../lib/motion";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useReveal } from "../hooks/useReveal";

import Cursor from "../components/Cursor.jsx";
import BackgroundStage from "../components/BackgroundStage.jsx";
import Grain from "../components/Grain.jsx";
import Nav from "../components/Nav.jsx";
import SectionMarker from "../components/SectionMarker.jsx";
import MagneticButton from "../components/MagneticButton.jsx";
import ScheduleCall from "../components/ScheduleCall.jsx";
import {
  ServicePanel,
  KeywordField,
  BuildBlueprint,
  ProcessBoard,
  ProcessOrbit,
  AdvantageStack,
} from "../components/ServiceVisuals.jsx";
import Footer from "../sections/Footer.jsx";

import { serviceBySlug, services } from "../data/services";
import { panelFor } from "../data/servicePanels";
import { contact } from "../data/site";
import "./ServiceDetail.css";

/**
 * /services/:slug — a service written out in full.
 *
 * Deliberately a quiet page: no pinning, no scrubbed timelines. It reuses the
 * homepage chrome (Nav, Footer, Cursor, Grain) and the existing type/spacing
 * tokens, so it reads as the same site without competing with the scroll story
 * on the homepage.
 */
export default function ServiceDetail() {
  const { slug } = useParams();
  const service = serviceBySlug[slug];
  const [callOpen, setCallOpen] = useState(false);
  const rootRef = useRef(null);

  useSmoothScroll(true);
  useReveal([slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Layout settles once webfonts land, so the triggers below measure against
  // the real page rather than a fallback-font one.
  useEffect(() => {
    if (!service) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 220);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    return () => window.clearTimeout(id);
  }, [service, slug]);

  /**
   * The page's motion. Every target is generated from the service's own data,
   * so this runs identically for every slug — nothing here is per-service.
   * Rebuilt on slug change; reverted by the context on unmount.
   */
  useEffect(() => {
    if (!service) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Masthead — the grid and the glow drift as the hero leaves, so the
        // title reads as the still point rather than the whole screen moving.
        gsap.to(".svc__grid", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: ".svc__head",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(".svc__glow", {
          yPercent: 22,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: ".svc__head",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // What we build and How we work now own their own motion — see
        // BuildFlow and ProcessTimeline.

        // Why Bootstack — the service's own name drifts behind the statement.
        gsap.to(".svc__why-ghost", {
          yPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: ".svc__why",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      });

      // BuildFlow and ProcessTimeline carry their own reduced-motion branch.
    }, rootRef);

    return () => ctx.revert();
  }, [service, slug]);

  useEffect(() => {
    if (!service) return undefined;
    const previous = document.title;
    document.title = `${service.label} — Bootstack`;
    return () => {
      document.title = previous;
    };
  }, [service]);

  if (!service) {
    return (
      <>
        <Cursor />
        <BackgroundStage />
        <Grain />
        <Nav ready />
        <main className="svc svc--missing">
          <div className="shell">
            <p className="mono svc__eyebrow">404</p>
            <h1 className="display display--xl">
              That service does not exist.
            </h1>
            <div className="svc__missing-links">
              {services.map((s) => (
                <Link key={s.slug} className="mono" to={`/services/${s.slug}`}>
                  {s.label}
                </Link>
              ))}
            </div>
            <MagneticButton as={Link} to="/" variant="ghost">
              Back to the homepage
            </MagneticButton>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Which visual object stands for this service. Every label inside it is
  // read from the service's own data below.
  const panel = panelFor(slug);

  const index = services.findIndex((s) => s.slug === slug);
  const next = services[(index + 1) % services.length];
  const previous = services[(index - 1 + services.length) % services.length];

  return (
    <>
      <Cursor />
      <BackgroundStage />
      <Grain />
      <Nav ready />

      <main className="svc" id="top" ref={rootRef} key={slug}>
        {/* ---- Masthead ---- */}
        <section className="svc__head band" data-bg="white">
          {/* Depth behind the title: a technical grid and one soft glow. */}
          <span className="svc__grid" aria-hidden="true" />
          <span className="svc__glow" aria-hidden="true" />

          <div className="shell svc__head-inner">
            <div className="svc__split">
              <div className="svc__copy">
                <p className="svc__crumb mono" data-reveal>
                  <Link to="/">Home</Link>
                  <span aria-hidden="true">/</span>
                  <Link to="/#idea">What we build</Link>
                  <span aria-hidden="true">/</span>
                  <span>{service.label}</span>
                </p>

                <h1
                  className="svc__title display display--xxl section-gradient-heading"
                  data-reveal
                >
                  {service.title}
                </h1>

                <p
                  className="svc__subtitle lead"
                  data-reveal
                  style={{ "--reveal-delay": "80ms" }}
                >
                  {service.subtitle}
                </p>

                <ul className="svc__highlights">
                  {service.highlights.map((item, i) => (
                    <li
                      key={item}
                      data-reveal
                      style={{ "--reveal-delay": `${120 + i * 60}ms` }}
                    >
                      <span className="svc__highlight-num mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="svc__visual">
                <ServicePanel
                  kind={panel.kind}
                  caption={panel.caption}
                  labels={service.highlights}
                  modules={service.build}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---- About ---- */}
        <section className="svc__body band" data-bg="mist">
          <div className="shell svc__split">
            <div className="svc__copy">
              <SectionMarker index="01" title={service.about.heading} />
              <p className="lead" data-reveal>
                {service.about.description}
              </p>
            </div>

            <div className="svc__visual">
              <ServicePanel
                kind={panel.kind}
                caption={service.label}
                labels={service.build}
                modules={service.highlights}
              />
            </div>
          </div>
        </section>

        {/* ---- Why it matters ---- */}
        <section className="svc__matters band" data-bg="white">
          <div className="shell svc__split">
            <div className="svc__copy">
              <SectionMarker index="02" title={service.whyItMatters.heading} />
              {service.whyItMatters.statements.map((line, i) => (
                <p
                  key={line}
                  className={i === 0 ? "svc__pull display" : "body"}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 80}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="svc__visual">
              <KeywordField words={service.highlights} />
            </div>
          </div>
        </section>

       {/* ---- What we build ---- */}
<section className="svc__build band" data-bg="white">
  <div className="shell">
    <SectionMarker
      index="03"
      title="What we build"
    />

    <ol className="svc__list">
      {service.build.map((item, i) => (
        <li
          key={item}
          data-reveal
          style={{ '--reveal-delay': `${i * 55}ms` }}
        >
          <span className="mono">
            {String(i + 1).padStart(2, '0')}
          </span>

          <span className="svc__list-label display">
            {item}
          </span>
        </li>
      ))}
    </ol>
  </div>
</section>

        {/* ---- Process ---- */}
        <section className="svc__process band" data-bg="mist">
          <div className="shell svc__split svc__split--wide">
            <div className="svc__copy">
              <SectionMarker
                index="04"
                title="How we work"
              />

              {/* The same stages as a loop, so the left column carries the
                  shape of the engagement rather than sitting empty. */}
              <ProcessOrbit stages={service.process} />
            </div>

            <div className="svc__visual">
              <ProcessBoard stages={service.process} />
            </div>
          </div>
        </section>

        {/* ---- Why Bootstack ---- */}
        <section className="svc__why band" data-bg="white">
          <span className="svc__why-ghost display" aria-hidden="true">
            {service.label}
          </span>

          <div className="shell svc__why-inner svc__split">
            <div className="svc__copy">
              <SectionMarker index="05" title={service.whyBootstack.heading} />
              <p className="svc__why-text display display--xl" data-reveal>
                {service.whyBootstack.description}
              </p>
            </div>

            <div className="svc__visual" data-reveal>
              <AdvantageStack />
            </div>
          </div>
        </section>

        {/* ---- Close ---- */}
        <section className="svc__cta band" data-bg="yellow" id="contact">
          <span className="svc__cta-grid" aria-hidden="true" />

          <div className="shell svc__cta-inner">
            <p className="svc__eyebrow mono" data-reveal>
              Start your project
            </p>
            <h2 className="svc__cta-title" data-reveal>
              {service.cta.title}
            </h2>
            <p
              className="lead"
              data-reveal
              style={{ "--reveal-delay": "80ms" }}
            >
              {service.cta.body}
            </p>

            <div
              className="svc__actions"
              data-reveal
              style={{ "--reveal-delay": "140ms" }}
            >
              <MagneticButton
                as="button"
                type="button"
                variant="solid"
                onClick={() => setCallOpen(true)}
              >
                Schedule a call
              </MagneticButton>
              <MagneticButton
                href={`https://wa.me/+919975499956?text=${encodeURIComponent(
                  `Hi Bootstack, I'd like to discuss my ${service.label} project. I'd like to schedule a call.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
              >
                Chat on WhatsApp
              </MagneticButton>
            </div>

            {/* Both links were bare siblings of the shell, so the only thing
                between them was .svc__back's margin-right. They share a flex
                row now, and the distance is one explicit column-gap. */}
            {/* Three columns — previous | back | next — matching the walk
                on the newer service pages, so both page types read the same. */}
            <nav className="svc__service-nav" aria-label="Services">
              <Link className="svc__nav-link" to={`/services/${previous.slug}`}>
                <span className="mono">&larr; Previous</span>
                <span className="svc__nav-name display">{previous.label}</span>
              </Link>

              <Link className="svc__back mono" to="/#idea">
                Back to Services
              </Link>

              <Link
                className="svc__nav-link svc__nav-link--next"
                to={`/services/${next.slug}`}
              >
                <span className="mono">Next &rarr;</span>
                <span className="svc__nav-name display">{next.label}</span>
              </Link>
            </nav>
          </div>
        </section>
      </main>

      <Footer />

      <ScheduleCall
        open={callOpen}
        service={service.label}
        onClose={() => setCallOpen(false)}
      />
    </>
  );
}
