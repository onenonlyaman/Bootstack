import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import HeroField from "../components/HeroField.jsx";
import MagneticButton from "../components/MagneticButton.jsx";
import { brand } from "../data/site";
import heroVideo from "../assets/hero-background.mp4";
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

export default function Hero({ ready }) {
  const rootRef = useRef(null);
  const [showConsultation, setShowConsultation] = useState(false);

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

  useEffect(() => {
    if (!ready) return undefined;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        const tl = gsap.timeline({ delay: 0.1 });

        tl.from(".hero__eyebrow > *", {
          yPercent: 130,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
        })
          .from(
            ".hero__line > span",
            {
              yPercent: 118,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.09,
            },
            0.1,
          )
          .from(
            [".hero__support", ".hero__ctas", ".hero__values", ".hero__scroll"],
            {
              y: 26,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.08,
            },
            0.55,
          )
          .from(
            ".field",
            {
              opacity: 0,
              duration: 1.6,
              ease: "power2.out",
            },
            0,
          );
      }

      // Departure: the headline lifts and thins out as the next chapter arrives.
      gsap.to(".hero__type", {
        yPercent: -18,
        opacity: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      // The cue leaves with the supporting column rather than riding on alone
      // while everything around it fades.
      gsap.to([".hero__aside", ".hero__scroll"], {
        y: -70,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "60% top",
          scrub: 0.4,
        },
      });

      gsap.to(".field", {
        opacity: 0.08,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="hero band band--flush"
      data-bg="mist"
      aria-labelledby="hero-title"
    >
      <video
        className="hero__video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      <div className="hero__video-overlay" aria-hidden="true" />

      <HeroField />

      <div className="hero__inner shell">
        {/* ============================================================
            MAIN HERO CONTENT
            ============================================================ */}
        <div className="hero__content">
          {/* Eyebrow */}
          <p className="hero__eyebrow mono">
            <span>{brand.positioning}</span>
          </p>

          {/* Main heading */}
          <h1 id="hero-title" className="hero__type display display--mega">
            {LINES.map((line, i) => (
              <span className={`hero__line hero__line--${i + 1}`} key={line}>
                <span>{line}</span>
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

              <MagneticButton href="#capabilities" variant="ghost">
                Explore Services
              </MagneticButton>
            </div>

            {/* Value points */}
            <div className="hero__values">
              <span>
                <b>✓</b> Innovation First
              </span>

              <span>
                <b>✓</b> Results Focused
              </span>

              <span>
                <b>✓</b> Business Growth
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            SCROLL CUE
            ============================================================ */}
        <div className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-dot">
            <i />
          </span>

          <span className="hero__scroll-label mono">Scroll to explore</span>
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
