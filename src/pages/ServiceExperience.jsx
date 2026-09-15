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
import ServiceSchematic from "../components/ServiceSchematic.jsx";
import Footer from "../sections/Footer.jsx";

import {
  serviceExperienceBySlug,
  serviceExperiences,
  serviceNeighbours,
} from "../data/serviceExperiences";
import { capabilities } from "../data/capabilities";
import { contact } from "../data/site";
import "./ServiceExperience.css";

/**
 * /services/:slug — the page each Section 04 service opens.
 *
 * One system for all eight services, read from data/serviceExperiences.js (and,
 * for the deliverables and the one-line promise, the same record Section 04
 * shows in data/capabilities.js — read here, never changed):
 *
 *   Hero      the service, what it promises, the two actions — beside the
 *             service module, a live composition of the work itself.
 *   Overview  what it is and why it matters, against what is included.
 *   Impact    where it moves the business: the reasons, and the weighting.
 *   Process   the consultation stages on one connected track.
 *   Close     start the project, or move to another service.
 *
 * Every chapter is a `.band` with a `data-bg`, so BackgroundStage carries the
 * ground from one to the next exactly as it does on the homepage.
 */

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

const pad = (n) => String(n).padStart(2, "0");

export default function ServiceExperience() {
  const { slug } = useParams();
  const service = serviceExperienceBySlug[slug];
  const capability = capabilities.find((c) => c.id === slug);
  const rootRef = useRef(null);
  const [callOpen, setCallOpen] = useState(false);

  const metrics = useMemo(
    () =>
      (service?.businessImpact.metrics ?? []).map((m) => ({
        ...m,
        ...splitMetric(m.value),
      })),
    [service],
  );

  const { previous, next } = serviceNeighbours(slug);

  useSmoothScroll(true);
  useReveal([slug]);

  // A service link from another service page must start at the top, and the
  // triggers below must be rebuilt against the new content.
  useEffect(() => {
    window.scrollTo(0, 0);
    // Leave a marker so a Back navigation lands on this service's card in
    // Section 04 rather than at the top of the homepage. App clears it.
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

  // Layout settles once webfonts land; re-measure every trigger against it.
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
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero: the name rises out of its mask, then the promise and actions.
        gsap
          .timeline({ delay: 0.1 })
          .from(".sv-hero__word > span", {
            yPercent: 112,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            // The title is gradient text; leaving a transform on a word can drop
            // the clipped background, so the words settle back to none.
            clearProps: "transform",
          })
          .from(
            ".sv-hero__verb, .sv-hero__lead, .sv-hero__actions",
            {
              y: 18,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
            },
            0.35,
          );

        // Overview: the included list is wired up as it is read.
        const kit = root.querySelector(".sv-kit__list");
        const kitItems = gsap.utils.toArray(".sv-kit__item", root);
        if (kit) {
          gsap.fromTo(
            kit,
            { "--p": 0 },
            {
              "--p": 1,
              ease: "none",
              scrollTrigger: {
                trigger: kit,
                start: "top 78%",
                end: "bottom 62%",
                scrub: 0.5,
                onUpdate: (self) => {
                  kitItems.forEach((item, i) => {
                    item.classList.toggle(
                      "is-lit",
                      self.progress >= (i + 0.35) / kitItems.length,
                    );
                  });
                },
              },
            },
          );
        }

        // Impact: the weighting unrolls, and the reasons step in.
        gsap.from(".sv-ratio__seg", {
          scaleX: 0,
          transformOrigin: "0 50%",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".sv-ratio", start: "top 85%" },
        });

        gsap.from(".sv-gain", {
          y: 14,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".sv-gains", start: "top 82%" },
        });

        // Process: the track fills with the reader, lighting each stage it
        // reaches; the latest one is the live stage.
        const stages = gsap.utils.toArray(".sv-stage", root);
        const run = root.querySelector(".sv-stages");
        if (run && stages.length) {
          gsap.fromTo(
            run,
            { "--p": 0 },
            {
              "--p": 1,
              ease: "none",
              scrollTrigger: {
                trigger: run,
                start: "top 72%",
                end: "bottom 58%",
                scrub: 0.5,
                onUpdate: (self) => {
                  const reached = self.progress * (stages.length - 1) + 0.02;
                  stages.forEach((stage, i) => {
                    stage.setAttribute(
                      "data-state",
                      i > reached
                        ? "idle"
                        : i > reached - 1 && i <= reached
                          ? "live"
                          : "done",
                    );
                  });
                },
              },
            },
          );
        }
      });

      // Reduced motion: nothing scrubs and nothing waits to appear.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root
          .querySelectorAll(".sv-kit__list, .sv-stages")
          .forEach((el) => el.style.setProperty("--p", "1"));
        root
          .querySelectorAll(".sv-kit__item")
          .forEach((el) => el.classList.add("is-lit"));
        root
          .querySelectorAll(".sv-stage")
          .forEach((el) => el.setAttribute("data-state", "done"));
      });
    }, root);

    return () => ctx.revert();
  }, [service, slug]);

  if (!service) {
    return (
      <>
        <Cursor />
        <BackgroundStage />
        <Grain />
        <Nav ready />
        <main className="sv sv--missing">
          <section className="band sv-missing" data-bg="mist">
            <div className="shell">
              <p className="sv-label mono">Not found</p>
              <h1 className="sv-missing__title">
                That service page does not exist.
              </h1>
              <p className="sv-missing__lead">
                Choose one of Bootstack’s services instead:
              </p>
              <ul className="sv-missing__links">
                {serviceExperiences.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`}>
                      <span className="mono">{s.number}</span> {s.title}
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

  const items = capability?.items ?? [];
  const tone = capability?.tone ?? service.tone ?? "cyan";
  const phone = `tel:${contact.phone.replace(/\s+/g, "")}`;

  return (
    <>
      <Cursor />
      <BackgroundStage />
      <Grain />
      <Nav ready />

      <main ref={rootRef} className={`sv sv--${tone}`} id="top" key={slug}>
        {/* ---------- Hero ---------- */}
        <section
          className="sv-hero band"
          data-bg="mist"
          aria-labelledby="sv-title"
        >
          <div className="shell sv-hero__inner">
            <div className="sv-hero__copy">
              <nav className="sv-crumb mono" aria-label="Breadcrumb">
                <Link to="/#capabilities">What Bootstack does</Link>
                <span aria-hidden="true">/</span>
                <span>{service.category}</span>
              </nav>

              <p className="sv-hero__index mono">
                <span>
                  Service <b>{service.number}</b> of{" "}
                  {pad(serviceExperiences.length)}
                </span>
              </p>

              <h1 id="sv-title" className="sv-hero__title">
                {service.title.split(" ").map((word, i) => (
                  <span className="sv-hero__word" key={`${word}-${i}`}>
                    <span>{word}</span>
                  </span>
                ))}
              </h1>

              {capability?.verb ? (
                <p className="sv-hero__verb">{capability.verb}</p>
              ) : null}
              <p className="sv-hero__lead">{service.description}</p>
            </div>

            <ServiceSchematic service={service} items={items} />
          </div>
        </section>

        {/* ---------- Overview: what it is, why it matters, what is included ---------- */}
        <section
          className="sv-brief band"
          data-bg="white"
          aria-label="Overview"
        >
          <div className="shell sv-brief__grid">
            <div className="sv-brief__main">
              <p className="sv-label mono" data-reveal>
                {service.whatItIs.title}
              </p>
              <p className="sv-brief__statement" data-reveal>
                {service.whatItIs.description}
              </p>

              <div className="sv-brief__why" data-reveal>
                <p className="sv-brief__why-label mono">
                  {service.whyItMatters.title}
                </p>
                <p className="sv-brief__why-text">
                  {service.whyItMatters.description}
                </p>
              </div>
            </div>

            {items.length ? (
              <div className="sv-kit" data-reveal>
                <span className="sv-kit__grid" aria-hidden="true" />
                <p className="sv-label mono">What’s included</p>
                <ul className="sv-kit__list">
                  <span className="sv-kit__trace" aria-hidden="true">
                    <i />
                  </span>
                  {items.map((item) => (
                    <li className="sv-kit__item" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        {/* ---------- Impact: the reasons, and the weighting ---------- */}
        <section
          className="sv-impact band"
          data-bg="cyan"
          aria-label={service.businessImpact.title}
        >
          <div className="shell sv-impact__grid">
            <div className="sv-impact__reasons">
              <p className="sv-label mono" data-reveal>
                {service.importance.title}
              </p>
              <ul className="sv-gains">
                {service.importance.points.map((point) => (
                  <li className="sv-gain" key={point}>
                    <span className="sv-gain__mark" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sv-weigh" data-reveal>
              <p className="sv-label mono">{service.businessImpact.title}</p>
              <p className="sv-weigh__statement">
                {service.businessImpact.statement}
              </p>

              <div
                className="sv-ratio"
                role="img"
                aria-label={metrics
                  .map((m) => `${m.value}${m.suffix} ${m.label}`)
                  .join(", ")}
              >
                {metrics.map((m, i) => (
                  <span
                    className="sv-ratio__seg"
                    key={m.label}
                    style={{ flexGrow: m.weight, "--i": i }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <dl className="sv-ratio__legend">
                {metrics.map((m, i) => (
                  <div
                    className="sv-ratio__item"
                    key={m.label}
                    style={{ "--i": i }}
                  >
                    <dt className="sv-ratio__label mono">
                      <i aria-hidden="true" />
                      {m.label}
                    </dt>
                    <dd className="sv-ratio__value">
                      <Counter value={m.value} suffix={m.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section
          className="sv-process band"
          data-bg="mist"
          aria-labelledby="sv-process-title"
        >
          <div className="shell">
            <header className="sv-process__head">
              <h2
                id="sv-process-title"
                className="sv-process__title"
                data-reveal
              >
                Our consultation process
              </h2>
              <p className="sv-process__count mono" data-reveal>
                <b>{pad(service.consultationProcess.length)}</b> stages
              </p>
            </header>

            <ol
              className="sv-stages"
              style={{ "--count": service.consultationProcess.length }}
            >
              <span className="sv-stages__track" aria-hidden="true">
                <i className="sv-stages__fill" />
                <i className="sv-stages__pulse" />
              </span>

              {service.consultationProcess.map((stage, i) => (
                <li
                  className="sv-stage"
                  key={stage.number}
                  data-state={i === 0 ? "live" : "idle"}
                >
                  <span className="sv-stage__node" aria-hidden="true" />
                  <span className="sv-stage__num mono">{stage.number}</span>
                  <h3 className="sv-stage__title">{stage.title}</h3>
                  <p className="sv-stage__text">{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Close ---------- */}
        <section
          className="sv-close band"
          data-bg="white"
          aria-labelledby="sv-close-title"
        >
          <div className="shell">
            <div className="sv-close__plate">
              <span className="sv-close__grid" aria-hidden="true" />
              <div className="sv-close__copy">
                <p className="sv-close__label mono">Start your project</p>
                <h2 id="sv-close-title" className="sv-close__title">
                  Let’s put {service.title.toLowerCase()} to work for your
                  business.
                </h2>
              </div>
              <div className="sv-close__actions">
                <MagneticButton
                  as="button"
                  type="button"
                  variant="solid"
                  onClick={() => setCallOpen(true)}
                >
                  Start your project
                </MagneticButton>
                <MagneticButton href={phone} variant="ghost">
                  Book a consultation call
                </MagneticButton>
              </div>
            </div>

            <nav className="sv-switch" aria-label="Services">
              <Link
                className="sv-switch__step"
                to={`/services/${previous.slug}`}
              >
                <span className="mono">&larr; Previous</span>
                <span className="sv-switch__name">{previous.title}</span>
              </Link>

              <div className="sv-switch__middle">
                <Link className="sv-switch__back mono" to="/#capabilities">
                  Back to services
                </Link>
              </div>

              <Link
                className="sv-switch__step sv-switch__step--next"
                to={`/services/${next.slug}`}
              >
                <span className="mono">Next &rarr;</span>
                <span className="sv-switch__name">{next.title}</span>
              </Link>
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
