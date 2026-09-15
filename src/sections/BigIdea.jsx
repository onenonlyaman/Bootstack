import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { useIsDesktop, useMediaQuery } from "../hooks/useMediaQuery";
import SectionMarker from "../components/SectionMarker.jsx";
import SystemScene from "../components/SystemScene.jsx";
import "./BigIdea.css";

/**
 * Each statement carries its own panel copy: `text` is the large line on the
 * left, `title` and `body` are what the right-hand column shows while that line
 * is the active one. Edit the copy here — nothing is repeated in the JSX.
 *
 * An entry marked `hidden` stays here but is left out of the section — the
 * scene, the index, the panel and the mobile bus all draw from SERVICES.
 * Remove the flag to bring it back.
 *
 * `slug` is each service's detail page (/services/:slug). The section does not
 * link there for now — the Explore links are off — but the slugs, routes and
 * pages all remain, ready to be linked again.
 */
const STATEMENT = [
  {
    text: "ERP Solutions",
    slug: "erp-solutions",
    title: "ERP Solutions",
    body: "Streamline your operations with custom ERP systems designed to manage sales, inventory, projects, finance, HR, and business workflows, all in one platform.",
  },
  {
    text: "Mobile App Development",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    body: "Build fast, secure, and user-friendly Android and iOS applications that deliver seamless customer experiences and support your business growth.",
  },
  {
    text: "High-Performing Website",
    slug: "high-performing-websites",
    title: "High-Performing Websites",
    body: "Create fast, responsive, and conversion-focused websites that showcase your brand, engage visitors, and generate more business.",
  },
  {
    text: "Lead Generation",
    slug: "lead-generation",
    title: "Lead Generation",
    body: "Attract high-quality leads through performance marketing, SEO, landing pages, and data-driven campaigns that turn prospects into customers.",
  },
  {
    text: "Brand Identity & Branding",
    slug: "brand-identity-branding",
    title: "Brand Identity & Branding",
    body: "Build a memorable brand with a strong identity, compelling messaging, and consistent visuals that inspire trust and leave a lasting impression.",
  },
];

/** The services the section shows, in order. */
const SERVICES = STATEMENT.filter((item) => !item.hidden);

/** The seven phases of the system coming online, and where each begins. */
const PHASES = [
  "Core active",
  "Capabilities entering",
  "Modules aligning",
  "Connections forming",
  "Pathways active",
  "Signal sync",
  "Connected system",
];
const PHASE_MARKS = [0, 1.3, 3.3, 4.9, 6.3, 7.5, 8.9];

/**
 * Phones and tablets run the same seven phases, closer together, and then walk
 * the panel through each capability in turn. Values are timeline seconds.
 */
const STAGE_MARKS = [0, 0.8, 2.3, 3.3, 4.3, 5.0, 5.8];
const STAGE_BUILT = 6.3; // connected; the capability walk-through begins
const STAGE_STEP = 1.4; // how long each capability holds the panel
const STAGE_END = STAGE_BUILT + STAGE_STEP * SERVICES.length;
const STAGE_SCROLL = 4.6; // the pinned run, in viewport heights

const pad = (n) => String(n).padStart(2, "0");
const LABELS = SERVICES.map((item, i) => ({ index: pad(i + 1), title: item.text }));

/**
 * Section 02 — inside the Bootstack system.
 *
 * The Hero dives through the core's window; this section opens on the same
 * ground and pulls back out to reveal the architecture inside. As the visitor
 * scrolls, the existing capabilities arrive as modules, dock around the core,
 * connect, and a signal runs through the whole system.
 *
 * Three compositions of the one story:
 * - scene (desktop): the section pins and scrubs the seven phases beside the copy.
 * - stage (phones and tablets): the copy leads, then the system pins in a
 *   portrait frame — the same phases, then each capability in turn in the panel
 *   beneath it. Numbered chips on the modules switch capability by tap.
 * - bus (short landscape screens, too low for that frame): a vertical system
 *   bus with every capability readable in full.
 *
 * Keeps the `idea` id: the service pages link back to /#idea.
 */
export default function BigIdea() {
  const rootRef = useRef(null);
  const meterRef = useRef(null);
  const busRef = useRef(null);
  const stageRef = useRef(null);
  const handoffRef = useRef(null);
  const lastAuto = useRef(-1);
  const isDesktop = useIsDesktop();
  const isTall = useMediaQuery("(min-height: 600px)");
  const mode = isDesktop ? "scene" : isTall ? "stage" : "bus";

  const [engine, setEngine] = useState(null);
  const [phase, setPhase] = useState(0);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const [busConnected, setBusConnected] = useState(false);

  const shown = hovered >= 0 ? hovered : active;
  const current = SERVICES[shown];

  const select = (index, how) => {
    if (how === "hover") setHovered(index);
    else if (index >= 0) setActive(index);
  };

  // ---- Desktop: the pinned system sequence ----
  useEffect(() => {
    if (!engine || !isDesktop) return undefined;

    const st = engine.state;
    const root = rootRef.current;

    const finish = () => {
      Object.assign(st.cam, { fx: 0.7, fy: 0.54, elev: 34, yaw: 45, zoom: 1.03, dive: 0 });
      Object.assign(st.core, { power: 1, ring: 1, emblem: 1, lift: 0 });
      Object.assign(st.board, { alpha: 1, sockets: 0.5, glow: 1 });
      Object.assign(st.traces, { base: 0.2, draw: 1, lit: 1 });
      Object.assign(st.flow, { alpha: 0.9, t: 0 });
      st.modules.forEach((m) => Object.assign(m, { p: 1, alpha: 1, lit: 1 }));
      Object.assign(st, { ambient: 0, ready: 1 });
    };

    if (prefersReducedMotion()) {
      finish();
      engine.render();
      setPhase(PHASES.length - 1);
      return undefined;
    }

    // Opening state: inside the core's window, nothing docked yet.
    Object.assign(st.cam, { fx: 0.7, fy: 0.54, elev: 38, yaw: 45, zoom: 1.3, dive: 1 });
    Object.assign(st.core, { power: 0.45, ring: 1, emblem: 1, lift: 0 });
    Object.assign(st.board, { alpha: 0, sockets: 0, glow: 0.3 });
    Object.assign(st.traces, { base: 0, draw: 0, lit: 0 });
    Object.assign(st.flow, { alpha: 0, t: 0 });
    Object.assign(st.sweep, { alpha: 0, t: 0 });
    st.modules.forEach((m) => Object.assign(m, { p: 0, alpha: 0, lit: 0 }));
    Object.assign(st, { ambient: 0, ready: 0 });
    engine.render();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // 1 · CORE ACTIVE — the section arrives still inside the core's window
      // (the frame the Hero ended on); the camera pulls back out and the core
      // powers up beneath it.
      tl.to(st.cam, { dive: 0, duration: 1.1, ease: "sine.out" }, 0)
        .to(st.cam, { zoom: 1, duration: 1.3, ease: "power1.inOut" }, 0.4)
        .to(st.core, { power: 1, duration: 1 }, 0.3)
        .to(st.core, { lift: 1, duration: 0.4, ease: "power2.out" }, 0.5)
        .to(st.core, { lift: 0, duration: 0.45, ease: "power2.in" }, 0.95)
        .to(st.board, { alpha: 1, glow: 0.6, duration: 0.9 }, 0.5)
        .to(st.board, { sockets: 0.5, duration: 0.8 }, 0.9)

        // 2 · CAPABILITIES ENTERING — each existing service arrives as a module.
        .to(st.modules, { alpha: 1, duration: 0.4, stagger: 0.38 }, 1.3)
        .to(st.modules, { p: 0.55, duration: 1.1, stagger: 0.38, ease: "power2.out" }, 1.3)

        // 3 · MODULES ALIGNING — they settle into their sockets.
        .to(st.modules, { p: 1, duration: 1, stagger: 0.3, ease: "power2.inOut" }, 3.3)

        // 4 · CONNECTIONS FORMING — pathways run from the core to every module.
        .to(st.traces, { base: 0.2, draw: 1, duration: 1.6 }, 4.9)

        // 5 · PATHWAYS ACTIVE
        .to(st.traces, { lit: 1, duration: 1 }, 6.3)
        .to(st.flow, { alpha: 0.9, duration: 0.6 }, 6.3)
        .to(st.flow, { t: 2.2, duration: 4 }, 6.3)
        .to(st.modules, { lit: 0.6, duration: 0.5, stagger: 0.15 }, 6.5)

        // 6 · SIGNAL SYNC — one signal runs out through the whole system.
        .to(st.sweep, { alpha: 1, duration: 0.2 }, 7.5)
        .to(st.sweep, { t: 1, duration: 1.4, ease: "power1.inOut" }, 7.5)
        .to(st.modules, { lit: 1, duration: 0.3 }, 8.5)
        .to(st.sweep, { alpha: 0, duration: 0.3 }, 8.7)

        // 7 · CONNECTED SYSTEM
        .to(st, { ready: 1, duration: 0.8 }, 8.9)
        .to(st.board, { glow: 1, duration: 0.8 }, 8.9)
        .to(st.cam, { elev: 34, zoom: 1.03, duration: 1.4, ease: "power1.inOut" }, 8.9)

        // HAND-OVER — the connected system settles and its signal leaves the core
        // for the About chapter that follows. The copy stays, so the two chapters
        // share a screen on the same mist ground.
        .to(".sys__hud", { autoAlpha: 0, duration: 0.6 }, 10.4)
        .to(st, { settle: 1, duration: 1.2, ease: "power1.inOut" }, 10.4)
        .to(st.cam, { zoom: 0.9, fy: 0.44, duration: 1.8, ease: "power1.inOut" }, 10.5)
        .to(st.flow, { alpha: 0.5, duration: 1 }, 10.8)
        .to(st, { tail: 1, duration: 1.1, ease: "power1.in" }, 11.3);

      ScrollTrigger.create({
        animation: tl,
        trigger: root,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const time = self.progress * tl.duration();
          let p = 0;
          PHASE_MARKS.forEach((mark, i) => {
            if (time >= mark) p = i;
          });
          setPhase(p);
          if (meterRef.current) {
            meterRef.current.style.transform = `scaleX(${Math.min(1, time / 9.7).toFixed(4)})`;
          }
          // While modules are arriving, the panel follows the one docking.
          const auto = Math.max(0, Math.min(SERVICES.length - 1, Math.floor((time - 1.3) / 0.8)));
          if (auto !== lastAuto.current) {
            lastAuto.current = auto;
            setActive(auto);
          }
        },
      });
    }, rootRef);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [engine, isDesktop]);

  // ---- Phones and tablets: the pinned portrait system ----
  useEffect(() => {
    if (!engine || mode !== "stage") return undefined;

    const st = engine.state;
    const stage = stageRef.current;
    const handoff = handoffRef.current;
    const count = SERVICES.length;
    lastAuto.current = -1;

    const finish = () => {
      Object.assign(st.cam, { fx: 0.5, fy: 0.5, elev: 40, yaw: 45, zoom: 1, dive: 0 });
      Object.assign(st.core, { power: 1, ring: 1, emblem: 1, lift: 0 });
      Object.assign(st.board, { alpha: 1, sockets: 0.5, glow: 1 });
      Object.assign(st.traces, { base: 0.2, draw: 1, lit: 1 });
      Object.assign(st.flow, { alpha: 0.9, t: 0 });
      st.modules.forEach((m) => Object.assign(m, { p: 1, alpha: 1, lit: 1 }));
      Object.assign(st, { ambient: 0, ready: 1, settle: 0, tail: 0 });
    };

    if (prefersReducedMotion()) {
      finish();
      engine.render();
      setPhase(PHASES.length - 1);
      if (meterRef.current) meterRef.current.style.transform = "none";
      if (handoff) handoff.querySelector("i").style.transform = "none";
      return undefined;
    }

    // Opening state: the core dim and close, the board faint, nothing docked.
    Object.assign(st.cam, { fx: 0.5, fy: 0.5, elev: 44, yaw: 45, zoom: 1.22, dive: 0 });
    Object.assign(st.core, { power: 0.35, ring: 0, emblem: 0.6, lift: 0 });
    Object.assign(st.board, { alpha: 0.35, sockets: 0, glow: 0.2 });
    Object.assign(st.traces, { base: 0, draw: 0, lit: 0 });
    Object.assign(st.flow, { alpha: 0, t: 0 });
    Object.assign(st.sweep, { alpha: 0, t: 0 });
    st.modules.forEach((m) => Object.assign(m, { p: 0, alpha: 0, lit: 0 }));
    Object.assign(st, { ambient: 0, ready: 0, settle: 0, tail: 0 });
    engine.render();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // 1 · CORE ACTIVE — the camera eases back and the core powers up.
      tl.to(st.cam, { zoom: 1, elev: 40, duration: 1.2, ease: "power1.inOut" }, 0)
        .to(st.core, { power: 1, duration: 0.9 }, 0)
        .to(st.core, { ring: 1, emblem: 1, duration: 0.9, ease: "power1.inOut" }, 0.1)
        .to(st.core, { lift: 1, duration: 0.35, ease: "power2.out" }, 0.25)
        .to(st.core, { lift: 0, duration: 0.4, ease: "power2.in" }, 0.6)
        .to(st.board, { alpha: 1, glow: 0.6, duration: 0.8 }, 0.1)
        .to(st.board, { sockets: 0.5, duration: 0.7 }, 0.5)

        // 2 · CAPABILITIES ENTERING
        .to(st.modules, { alpha: 1, duration: 0.35, stagger: 0.26 }, 0.8)
        .to(st.modules, { p: 0.55, duration: 0.9, stagger: 0.26, ease: "power2.out" }, 0.8)

        // 3 · MODULES ALIGNING
        .to(st.modules, { p: 1, duration: 0.8, stagger: 0.18, ease: "power2.inOut" }, 2.3)

        // 4 · CONNECTIONS FORMING
        .to(st.traces, { base: 0.2, draw: 1, duration: 1.1 }, 3.3)

        // 5 · PATHWAYS ACTIVE — the signals keep running for the rest of the run.
        .to(st.traces, { lit: 1, duration: 0.7 }, 4.3)
        .to(st.flow, { alpha: 0.9, duration: 0.5 }, 4.3)
        .to(st.flow, { t: 6, duration: STAGE_END - 4.3 }, 4.3)
        .to(st.modules, { lit: 0.6, duration: 0.4, stagger: 0.1 }, 4.4)

        // 6 · SIGNAL SYNC
        .to(st.sweep, { alpha: 1, duration: 0.15 }, 5.0)
        .to(st.sweep, { t: 1, duration: 0.9, ease: "power1.inOut" }, 5.0)
        .to(st.modules, { lit: 1, duration: 0.25 }, 5.6)
        .to(st.sweep, { alpha: 0, duration: 0.25 }, 5.75)

        // 7 · CONNECTED SYSTEM — then each capability holds the panel in turn.
        .to(st, { ready: 1, duration: 0.5 }, 5.8)
        .to(st.board, { glow: 1, duration: 0.5 }, 5.8)
        .to({}, { duration: STAGE_END - STAGE_BUILT }, STAGE_BUILT);

      ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * STAGE_SCROLL)}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const time = self.progress * tl.duration();
          let p = 0;
          STAGE_MARKS.forEach((mark, i) => {
            if (time >= mark) p = i;
          });
          setPhase(p);
          if (meterRef.current) {
            meterRef.current.style.transform = `scaleX(${Math.min(1, time / STAGE_BUILT).toFixed(4)})`;
          }
          const auto = time < STAGE_BUILT ? 0 : Math.min(count - 1, Math.floor((time - STAGE_BUILT) / STAGE_STEP));
          if (auto !== lastAuto.current) {
            lastAuto.current = auto;
            setActive(auto);
          }
        },
      });

      // Hand-over: past the pin, the signal carries on down into About.
      if (handoff) {
        gsap.fromTo(
          handoff.querySelector("i"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: handoff, start: "top 85%", end: "bottom 55%", scrub: 0.5 },
          },
        );
      }
    }, stage);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [engine, mode]);

  // ---- Short landscape screens: the system bus ----
  useEffect(() => {
    if (mode !== "bus") return undefined;
    const bus = busRef.current;
    if (!bus) return undefined;

    if (prefersReducedMotion()) {
      bus.querySelectorAll(".sysbus__module").forEach((el) => el.setAttribute("data-lit", "true"));
      bus.querySelectorAll(".sysbus__spine-fill, .sysbus__handoff-fill").forEach((el) => {
        el.style.transform = "none";
      });
      setBusConnected(true);
      return undefined;
    }

    const ctx = gsap.context(() => {
      // The spine fills, and its signal travels, exactly as far as the visitor has read.
      gsap.fromTo(
        ".sysbus__spine-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".sysbus__modules",
            start: "top 70%",
            end: "bottom 62%",
            scrub: 0.5,
            onUpdate: (self) => setBusConnected(self.progress > 0.985),
          },
        },
      );

      // Hand-over: the signal continues past the last module toward About.
      gsap.fromTo(
        ".sysbus__handoff-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".sysbus__handoff", start: "top 65%", end: "bottom 65%", scrub: 0.5 },
        },
      );

      gsap.utils.toArray(".sysbus__module").forEach((module) => {
        gsap.fromTo(
          module.querySelector(".sysbus__card"),
          { x: 26, opacity: 0.25 },
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: module, start: "top 92%", end: "top 66%", scrub: 0.5 },
          },
        );
        gsap.fromTo(
          module.querySelector(".sysbus__branch"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: module,
              start: "top 74%",
              end: "top 62%",
              scrub: 0.5,
              onUpdate: (self) => module.setAttribute("data-lit", self.progress > 0.95 ? "true" : "false"),
            },
          },
        );
      });
    }, bus);

    return () => ctx.revert();
  }, [mode]);

  return (
    <section
      ref={rootRef}
      id="idea"
      className={`sys sys--${mode}`}
      data-bg="mist"
      aria-labelledby="sys-title"
    >
      {mode === "scene" ? (
        <SystemScene
          variant="system"
          className="sys__scene"
          labels={LABELS}
          activeIndex={shown}
          onSelect={select}
          onEngine={setEngine}
          interactive
        >
          <div className="sys__hud" aria-hidden="true">
            <span className="sys__hud-row">
              <span className="sys__hud-label mono">
                Phase {pad(phase + 1)} / {pad(PHASES.length)}
              </span>
              <span className="sys__hud-state mono" data-phase={phase}>
                {PHASES[phase]}
              </span>
            </span>
            <span className="sys__hud-track">
              <i ref={meterRef} />
            </span>
          </div>
        </SystemScene>
      ) : null}

      <div className="shell sys__shell">
        <SectionMarker index="02" title="What We Build" />

        <div className="sys__copy">
          <h2 id="sys-title" className="sys__title display">
            EVERY GREAT BUSINESS RUNS ON A <span>SYSTEM.</span>
          </h2>

          <p className="sys__lead">
            The strongest brands do not grow through isolated ideas. They grow
            through connected systems where strategy, technology, experience and
            marketing work together.
          </p>

          {mode === "stage" ? null : mode === "scene" ? (
            <div className="sys__panel">
              <div className="sys__index" role="group" aria-label="Capabilities in the system">
                {SERVICES.map((item, i) => (
                  <button
                    type="button"
                    key={item.slug}
                    className="sys__index-item mono"
                    data-active={i === shown ? "true" : "false"}
                    aria-pressed={i === shown}
                    aria-label={item.title}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(-1)}
                  >
                    {pad(i + 1)}
                  </button>
                ))}
              </div>

              <div className="sys__detail" aria-live="polite">
                <p className="sys__detail-meta mono">Capability {pad(shown + 1)}</p>
                <h3 className="sys__detail-title">{current.title}</h3>
                <p className="sys__detail-body">{current.body}</p>
              </div>
            </div>
          ) : (
            <div className="sysbus" ref={busRef} data-connected={busConnected ? "true" : "false"}>
              <div className="sysbus__core" aria-hidden="true">
                <span className="sysbus__chip">
                  <b>B</b>
                  <i />
                </span>
                <span className="sysbus__status mono">
                  {busConnected ? "Connected system" : "Core active"}
                </span>
              </div>

              <div className="sysbus__body">
                <span className="sysbus__spine" aria-hidden="true">
                  <i className="sysbus__spine-fill" />
                </span>

                <ol className="sysbus__modules">
                  {SERVICES.map((item, i) => (
                    <li className="sysbus__module" key={item.slug} data-lit="false">
                      <span className="sysbus__branch" aria-hidden="true" />
                      <div className="sysbus__card">
                        <span className="sysbus__meta mono">
                          <span>{pad(i + 1)}</span>
                          <span className="sysbus__led" aria-hidden="true" />
                        </span>
                        <span className="sysbus__title">{item.text}</span>
                        <span className="sysbus__text">{item.body}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* The spine does not stop at the last module: it carries the
                  signal down into the About chapter, where the ground lightens. */}
              <span className="sysbus__handoff" aria-hidden="true">
                <i className="sysbus__handoff-fill" />
              </span>
            </div>
          )}
        </div>
      </div>

      {mode === "stage" ? (
        <>
          {/* The pinned frame: phase readout, the system, and the panel for
              the capability it is showing. */}
          <div className="sysm" ref={stageRef}>
            <div className="shell sysm__hud" aria-hidden="true">
              <div className="sys__hud">
                <span className="sys__hud-row">
                  <span className="sys__hud-label mono">
                    Phase {pad(phase + 1)} / {pad(PHASES.length)}
                  </span>
                  <span className="sys__hud-state mono" data-phase={phase}>
                    {PHASES[phase]}
                  </span>
                </span>
                <span className="sys__hud-track">
                  <i ref={meterRef} />
                </span>
              </div>
            </div>

            <SystemScene
              variant="system"
              compact
              className="sysm__scene"
              labels={LABELS}
              activeIndex={shown}
              onSelect={(index, how) => {
                // Taps select; the focus a tap leaves behind is not a hover.
                if (how === "click" && index >= 0) setActive(index);
              }}
              onEngine={setEngine}
            />

            <div className="shell sysm__panel">
              <div className="sys__panel">
                <div className="sys__index" role="group" aria-label="Capabilities in the system">
                  {SERVICES.map((item, i) => (
                    <button
                      type="button"
                      key={item.slug}
                      className="sys__index-item mono"
                      data-active={i === shown ? "true" : "false"}
                      aria-pressed={i === shown}
                      aria-label={item.title}
                      onClick={() => setActive(i)}
                    >
                      {pad(i + 1)}
                    </button>
                  ))}
                </div>

                {/* Every capability sits in the same cell, so the panel is
                    always as tall as the longest one and the system above it
                    never shifts as they change over. */}
                <div className="sysm__details" aria-live="polite">
                  {SERVICES.map((item, i) => (
                    <div
                      className="sysm__detail"
                      key={item.slug}
                      data-active={i === shown ? "true" : "false"}
                      aria-hidden={i === shown ? undefined : "true"}
                    >
                      <p className="sys__detail-meta mono">Capability {pad(i + 1)}</p>
                      <h3 className="sys__detail-title">{item.title}</h3>
                      <p className="sys__detail-body">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The signal carries on past the frame, down into About. */}
          <div className="shell sysm__after" aria-hidden="true">
            <span className="sysbus__handoff" ref={handoffRef}>
              <i className="sysbus__handoff-fill" />
            </span>
          </div>
        </>
      ) : null}
    </section>
  );
}
