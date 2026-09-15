import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { useIsDesktop } from "../hooks/useMediaQuery";
import MagneticButton from "../components/MagneticButton.jsx";
import SystemScene from "../components/SystemScene.jsx";
import "./Hero.css";

const LINES = ["Technology That Builds", "Tomorrow's Brands."];

const CONSULTATION_SERVICES = [
  "Branding & UI/UX",
  "Website Development",
  "App Development",
  "Software Development",
  "Social Media Management",
  "Performance Marketing",
  "Brand Consultation",
  "Marketing Automation",
];

export default function Hero({ ready, introHandoff = false }) {
  const rootRef = useRef(null);
  const [showConsultation, setShowConsultation] = useState(false);
  const [engine, setEngine] = useState(null);
  const isDesktop = useIsDesktop();

  const handleServiceClick = (serviceName) => {
    const message = `Hello Bootstack Team,

I found your website and I'm interested in your ${serviceName} services.

I'd like to discuss my business requirements and explore how Bootstack can help achieve my goals.

Please let me know the next steps for scheduling a consultation.

Thank you.`;

    // WhatsApp number: country code + number.
    // Do NOT use +, spaces, brackets or hyphens.
    const whatsappNumber = "919975499956";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setShowConsultation(false);
  };

  // ---- Arrival: the copy settles in; the system is simply present ----
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ delay: 0.1 })
        .from(".hero__line > span", {
          yPercent: 118,
          duration: 1.25,
          ease: "expo.out",
          stagger: 0.09,
        })
        .from(
          [".hero__support", ".hero__ctas"],
          { y: 26, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08 },
          0.45,
        );

      // After the boot intro, its core lands on this one — the system must
      // already be there to receive it, so it is not faded in again.
      if (!introHandoff) {
        tl.from(
          ".hero__stage",
          { opacity: 0, duration: 1.6, ease: "power2.out" },
          0.2,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [ready, introHandoff]);

  // ---- The boot sequence, driven by scroll ----
  useEffect(() => {
    if (!engine) return undefined;

    const st = engine.state;
    const root = rootRef.current;

    // Dormant: present, dim, components suspended around a waiting core.
    Object.assign(
      st.cam,
      isDesktop
        ? { fx: 0.7, fy: 0.55, elev: 30, yaw: 45, zoom: 0.94, dive: 0 }
        : { fx: 0.5, fy: 0.46, elev: 30, yaw: 45, zoom: 1, dive: 0 },
    );

    if (prefersReducedMotion()) {
      // The finished state, without the journey.
      Object.assign(st.core, { power: 1, ring: 1, emblem: 1, lift: 0 });
      Object.assign(st.traces, { draw: 1, lit: 1, base: 0.22 });
      st.modules.forEach((m) => Object.assign(m, { p: 1, lit: 1 }));
      Object.assign(st, { ambient: 0, ready: 1 });
      st.board.glow = 1;
      engine.render();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // INITIALIZING — the core unlocks, its window lights, the B wakes.
      tl.to(st.core, { lift: 1, duration: 0.8, ease: "power2.out" }, 0.35)
        .to(st.core, { lift: 0, duration: 0.8, ease: "power2.in" }, 1.1)
        .to(st.core, { power: 0.6, emblem: 1, duration: 1.45 }, 0.35)
        .to(st.core, { ring: 1, duration: 1.3, ease: "power1.inOut" }, 0.5)
        .to(st.board, { glow: 0.5, duration: 1.45 }, 0.35)

        // CONNECTING — pathways form outward from the core; components move in.
        .to(st.traces, { draw: 1, base: 0.22, duration: 2.4 }, 1.8)
        .to(
          st.modules,
          { p: 0.86, duration: 2.2, stagger: 0.12, ease: "power1.inOut" },
          2,
        )
        .to(st.cam, { zoom: 1.04, elev: 33, duration: 2.7 }, 1.8)

        // POWERING UP — modules dock, signals run, the system brightens.
        .to(
          st.modules,
          { p: 1, duration: 1.4, stagger: 0.1, ease: "power2.inOut" },
          4.3,
        )
        .to(st.modules, { lit: 1, duration: 0.5, stagger: 0.18 }, 5)
        .to(st.traces, { lit: 1, duration: 1.2 }, 4.6)
        .to(st, { ambient: 0, duration: 1 }, 4.6)
        .to(st.flow, { alpha: 1, duration: 0.6 }, 4.6)
        .to(st.flow, { t: 2.5, duration: 3.4 }, 4.6)
        .to(st.core, { power: 1, duration: 2 }, 4.8)

        // SYSTEM READY
        .to(st, { ready: 1, duration: 0.8 }, 7)
        .to(st.board, { glow: 1, duration: 0.8 }, 7);

      if (isDesktop) {
        // Enter the system: the copy steps back and the camera dives through the
        // core's window until it fills the screen — the ground Section 02 opens on.
        tl.to(
          ".hero__content",
          { autoAlpha: 0, y: -60, duration: 1.1, ease: "power1.in" },
          7.5,
        )
          .to(st.flow, { alpha: 0, duration: 1 }, 8.3)
          .to(st.cam, { yaw: 45, dive: 1, duration: 3, ease: "sine.in" }, 8.3);
      } else {
        tl.to({}, { duration: 0.6 });
      }

      ScrollTrigger.create(
        isDesktop
          ? {
              animation: tl,
              trigger: root,
              start: "top top",
              end: "+=165%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            }
          : {
              animation: tl,
              trigger: root,
              start: "top top",
              endTrigger: root.querySelector(".hero__stage"),
              end: "bottom 40%",
              scrub: 0.6,
            },
      );
    }, rootRef);

    // The pin adds scroll length above every later trigger; re-order and
    // re-measure so the sections below start where they now are.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [engine, isDesktop]);

  return (
    <section
      ref={rootRef}
      className="hero band band--flush"
      data-bg="mist"
      aria-labelledby="hero-title"
    >
      <div className="hero__inner shell">
        {/* ============================================================
            MAIN HERO CONTENT
            ============================================================ */}
        <div className="hero__content">
          {/* Main heading */}
          <h1 id="hero-title" className="hero__type display display--mega">
            {LINES.map((line, i) => (
              <span className={`hero__line hero__line--${i + 1}`} key={line}>
                {/* The closing full stop carries the headline's orange accent. */}
                <span>
                  {line.endsWith(".") ? (
                    <>
                      {line.slice(0, -1)}
                      <span className="hero__stop">.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          {/* Supporting content */}
          <div className="hero__aside">
            {/* Description */}
            <div className="hero__support">
              <p className="lead">
                We build brands, websites, software, AI automation and marketing
                systems that help ambitious businesses grow, scale and lead with
                confidence.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="hero__ctas">
              <MagneticButton
                href="#consultation"
                variant="solid"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConsultation(true);
                }}
              >
                Book Consultation Call
              </MagneticButton>

              <MagneticButton href="#idea" variant="ghost">
                EXPLORE SERVICES
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* ============================================================
            THE BOOTSTACK SYSTEM
            Dormant on arrival; the visitor's scroll boots it.
            ============================================================ */}
        <div className="hero__stage">
          <SystemScene
            variant="hero"
            compact={!isDesktop}
            interactive={isDesktop}
            onEngine={setEngine}
          />
        </div>
      </div>

      {/* ============================================================
          CONSULTATION POPUP
          ============================================================ */}
      {showConsultation && (
        <div
          className="hero__consultation-overlay"
          onClick={() => setShowConsultation(false)}
        >
          <div
            className="hero__consultation-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="hero__consultation-close"
              onClick={() => setShowConsultation(false)}
              aria-label="Close consultation"
            >
              ×
            </button>

            {/* Popup label */}
            <p className="mono">BOOK A CONSULTATION</p>

            {/* Popup heading */}
            <h2>What can we help you build?</h2>

            {/* Popup description */}
            <p className="hero__consultation-description">
              Choose a service and we'll continue the conversation with you on
              WhatsApp.
            </p>

            {/* Consultation services */}
            <div className="hero__consultation-services">
              {CONSULTATION_SERVICES.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceClick(service)}
                >
                  <span>{service}</span>

                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
