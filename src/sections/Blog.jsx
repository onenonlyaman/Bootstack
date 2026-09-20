import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import "./Blog.css";

const BLOG_URL =
  "https://thebootstack.blogspot.com/2026/09/digital-supplements-hidden-growth.html";

const BLOG_HOME_URL = "https://thebootstack.blogspot.com";

const ARTICLE = {
  category: "INSIGHT",
  date: "SEPTEMBER 19, 2026",
  readTime: "5 MIN READ",
  title: "Digital Supplements: The Hidden Growth System for Modern Businesses",
  excerpt:
    "Why modern businesses stall when scaling fragmented tools and how digital supplements create connected, automated systems that turn traffic into compounding growth.",
  tags: ["GROWTH SYSTEMS", "DIGITAL STRATEGY", "BUSINESS AUTOMATION"],
  url: BLOG_URL,
};

export default function Blog() {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const orbRef = useRef(null);

  // Subtle interactive 3D mouse parallax on desktop
  useEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card || prefersReducedMotion()) return undefined;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return undefined;

    const onMouseMove = (e) => {
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: -8 + x * 14,
        rotateX: 6 - y * 14,
        x: x * 16,
        y: y * 12,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (orbRef.current) {
        gsap.to(orbRef.current, {
          x: -x * 24,
          y: -y * 20,
          duration: 1.1,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotateY: -8,
        rotateX: 5,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
        overwrite: "auto",
      });

      if (orbRef.current) {
        gsap.to(orbRef.current, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    root.addEventListener("mousemove", onMouseMove);
    root.addEventListener("mouseleave", onMouseLeave);

    return () => {
      root.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="blog"
      className="journal band"
      data-bg="mist"
      aria-labelledby="journal-headline"
    >
      {/* Background ambient lighting and system telemetry */}
      <div className="journal__ambient-glow" aria-hidden="true" />
      <div className="journal__corner-note journal__corner-note--tr mono" aria-hidden="true">
        <span>FUELING BRANDS</span>
        <span>WITH IDEAS</span>
      </div>
      <div className="journal__corner-note journal__corner-note--br mono" aria-hidden="true">
        <span className="journal__dots-matrix">
          <i></i><i></i><i></i><i></i>
          <i></i><i></i><i></i><i></i>
          <i></i><i></i><i></i><i></i>
        </span>
        <span>MORE THAN MARKETING</span>
      </div>

      <div className="shell journal__shell">
        <div className="journal__layout">
          {/* ============================================================
              LEFT COLUMN: Editorial Heading & System Telemetry
              ============================================================ */}
          <div className="journal__col journal__col--left">
            <div className="journal__marker mono" data-reveal>
              <span className="journal__marker-dot" aria-hidden="true" />
              <span>BOOTSTACK JOURNAL</span>
            </div>

            <h2
              id="journal-headline"
              className="journal__headline display display--xl"
              data-reveal
              style={{ "--reveal-delay": "60ms" }}
            >
              Ideas that <br />
              <span className="section-gradient-heading">build.</span>
            </h2>

            <p
              className="journal__lead body"
              data-reveal
              style={{ "--reveal-delay": "120ms" }}
            >
              Insights, strategies and real-world perspectives to help modern
              businesses grow smarter.
            </p>

            <div
              className="journal__widget-wrap"
              data-reveal
              style={{ "--reveal-delay": "180ms" }}
            >
              <a
                href={ARTICLE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="journal__badge"
                aria-label="New insights every week"
              >
                <div className="journal__badge-bars" aria-hidden="true">
                  <span className="bar bar--1" />
                  <span className="bar bar--2" />
                  <span className="bar bar--3" />
                </div>
                <div className="journal__badge-text mono">
                  <span className="journal__badge-title">New insights</span>
                  <span className="journal__badge-sub">every week ↗</span>
                </div>
              </a>

              <div className="journal__sketch-arrow mono" aria-hidden="true">
                <span className="journal__sketch-text">From strategy to scale</span>
                <svg
                  className="journal__sketch-svg"
                  viewBox="0 0 54 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 6C16 28 34 32 46 14"
                    stroke="var(--fg-faint)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M38 12L46 14L48 22"
                    stroke="var(--fg-faint)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div
              className="journal__stepper mono"
              data-reveal
              style={{ "--reveal-delay": "240ms" }}
              aria-hidden="true"
            >
              <span className="journal__step journal__step--active">01</span>
              <span className="journal__step-line" />
              <span className="journal__step">02</span>
              <span className="journal__step">03</span>
            </div>
          </div>

          {/* ============================================================
              CENTER COLUMN: Interactive 3D Digital Editorial Book Stack
              ============================================================ */}
          <div className="journal__col journal__col--center">
            <div className="journal__scene">
              {/* Continuous 3D Orbital System around the article card */}
              <div className="journal__orbital-system" aria-hidden="true">
                <svg
                  className="journal__orbital-path-svg"
                  viewBox="0 0 520 420"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="260"
                    cy="210"
                    rx="230"
                    ry="140"
                    stroke="rgba(64, 168, 196, 0.26)"
                    strokeWidth="1.2"
                    strokeDasharray="4 5"
                    transform="rotate(-12 260 210)"
                  />
                </svg>

                <div className="journal__orbit-ball-wrap" ref={orbRef}>
                  <span className="journal__orb" />
                </div>
              </div>

              {/* 3D Editorial Cover Stack */}
              <div className="journal__stage" ref={cardRef}>
                {/* Secondary Background Layer 03 (Right Far) */}
                <div
                  className="journal__card-layer journal__card-layer--far-right"
                  aria-hidden="true"
                >
                  <div className="journal__layer-inner">
                    <span className="journal__layer-num mono">03</span>
                    <span className="journal__layer-grid" />
                  </div>
                </div>

                {/* Secondary Background Layer 02 (Left) */}
                <div
                  className="journal__card-layer journal__card-layer--left"
                  aria-hidden="true"
                >
                  <div className="journal__layer-inner">
                    <span className="journal__layer-num mono">02</span>
                    <span className="journal__layer-grid" />
                  </div>
                </div>

                {/* Secondary Background Layer 02 (Right) */}
                <div
                  className="journal__card-layer journal__card-layer--right"
                  aria-hidden="true"
                >
                  <div className="journal__layer-inner">
                    <span className="journal__layer-num mono">02</span>
                    <span className="journal__layer-grid" />
                  </div>
                </div>

                {/* HERO FEATURED ARTICLE COVER (MAIN) */}
                <a
                  href={ARTICLE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journal__cover"
                  aria-label={`Read article: ${ARTICLE.title}`}
                >
                  <div className="journal__cover-gloss" aria-hidden="true" />
                  <div className="journal__cover-spine" aria-hidden="true" />

                  {/* Cover Header */}
                  <div className="journal__cover-head">
                    <span className="journal__cover-logo mono">BOOTSTACK</span>
                    <span className="journal__cover-date mono">SEP 19, 2026</span>
                  </div>

                  {/* Cover Body / Layout */}
                  <div className="journal__cover-body">
                    {/* Left side: Editorial Typography */}
                    <div className="journal__cover-text">
                      <h4 className="journal__cover-title">
                        Digital <br />
                        Supplements:
                      </h4>

                      <div className="journal__cover-sub">
                        <span className="journal__sub-tag">THE HIDDEN</span>
                        <span className="journal__sub-highlight">GROWTH SYSTEM</span>
                        <span className="journal__sub-tag">FOR MODERN</span>
                        <span className="journal__sub-tag">BUSINESSES</span>
                      </div>
                    </div>

                    {/* Right side: 3D Isometric Growth System Stack */}
                    <div
                      className="journal__system-visual"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 200 240"
                        className="journal__iso-svg"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          {/* Gold Core Gradient */}
                          <linearGradient
                            id="gold-top"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#FFF2B2" />
                            <stop offset="40%" stopColor="#F7AA00" />
                            <stop offset="100%" stopColor="#C98400" />
                          </linearGradient>
                          <linearGradient
                            id="gold-left"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#E69900" />
                            <stop offset="100%" stopColor="#9E6300" />
                          </linearGradient>
                          <linearGradient
                            id="gold-right"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#FFAE1A" />
                            <stop offset="100%" stopColor="#B37400" />
                          </linearGradient>

                          {/* Glass Blue/Cyan Slabs */}
                          <linearGradient
                            id="cyan-slab-top"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#5CD3EE" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#1C668D" stopOpacity="0.7" />
                          </linearGradient>
                          <linearGradient
                            id="cyan-slab-left"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#1B5377" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#0B2A3F" stopOpacity="0.95" />
                          </linearGradient>
                          <linearGradient
                            id="cyan-slab-right"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#2F87B5" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#113B56" stopOpacity="0.9" />
                          </linearGradient>

                          {/* Core Glow Filter */}
                          <filter
                            id="glow-core"
                            x="-30%"
                            y="-30%"
                            width="160%"
                            height="160%"
                          >
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Central Energy Pillar Glow */}
                        <line
                          x1="100"
                          y1="40"
                          x2="100"
                          y2="210"
                          stroke="rgba(64, 168, 196, 0.4)"
                          strokeWidth="3"
                          strokeDasharray="4 3"
                        />
                        <circle
                          cx="100"
                          cy="48"
                          r="28"
                          fill="rgba(247, 170, 0, 0.25)"
                          filter="url(#glow-core)"
                        />

                        {/* ==============================================
                            TOP GOLDEN CORE MODULE: [B] BOOTSTACK
                            ============================================== */}
                        <g className="iso-layer iso-layer--gold" transform="translate(0, 8)">
                          {/* Top Face */}
                          <polygon
                            points="100,18 162,48 100,78 38,48"
                            fill="url(#gold-top)"
                            stroke="#FFF3C4"
                            strokeWidth="1.2"
                          />
                          {/* Left Face */}
                          <polygon
                            points="38,48 100,78 100,92 38,62"
                            fill="url(#gold-left)"
                          />
                          {/* Right Face */}
                          <polygon
                            points="100,78 162,48 162,62 100,92"
                            fill="url(#gold-right)"
                          />
                          {/* Logo mark B in center */}
                          <text
                            x="100"
                            y="52"
                            fill="#1A425F"
                            fontSize="14"
                            fontWeight="800"
                            fontFamily="var(--font-display)"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            B
                          </text>
                        </g>

                        {/* ==============================================
                            LAYER 1: AUTOMATION
                            ============================================== */}
                        <g className="iso-layer" transform="translate(0, 52)">
                          <polygon
                            points="100,18 158,45 100,72 42,45"
                            fill="url(#cyan-slab-top)"
                            stroke="rgba(92, 211, 238, 0.8)"
                            strokeWidth="1"
                          />
                          <polygon
                            points="42,45 100,72 100,82 42,55"
                            fill="url(#cyan-slab-left)"
                          />
                          <polygon
                            points="100,72 158,45 158,55 100,82"
                            fill="url(#cyan-slab-right)"
                          />
                          <text
                            x="70"
                            y="66"
                            fill="#EEF6F7"
                            fontSize="6.5"
                            fontFamily="var(--font-mono)"
                            letterSpacing="0.1em"
                            fontWeight="600"
                            transform="rotate(22, 70, 66)"
                          >
                            AUTOMATION
                          </text>
                        </g>

                        {/* ==============================================
                            LAYER 2: BRANDING
                            ============================================== */}
                        <g className="iso-layer" transform="translate(0, 88)">
                          <polygon
                            points="100,18 158,45 100,72 42,45"
                            fill="url(#cyan-slab-top)"
                            stroke="rgba(92, 211, 238, 0.8)"
                            strokeWidth="1"
                          />
                          <polygon
                            points="42,45 100,72 100,82 42,55"
                            fill="url(#cyan-slab-left)"
                          />
                          <polygon
                            points="100,72 158,45 158,55 100,82"
                            fill="url(#cyan-slab-right)"
                          />
                          <text
                            x="70"
                            y="66"
                            fill="#EEF6F7"
                            fontSize="6.5"
                            fontFamily="var(--font-mono)"
                            letterSpacing="0.1em"
                            fontWeight="600"
                            transform="rotate(22, 70, 66)"
                          >
                            BRANDING
                          </text>
                        </g>

                        {/* ==============================================
                            LAYER 3: PERFORMANCE
                            ============================================== */}
                        <g className="iso-layer" transform="translate(0, 124)">
                          <polygon
                            points="100,18 158,45 100,72 42,45"
                            fill="url(#cyan-slab-top)"
                            stroke="rgba(92, 211, 238, 0.8)"
                            strokeWidth="1"
                          />
                          <polygon
                            points="42,45 100,72 100,82 42,55"
                            fill="url(#cyan-slab-left)"
                          />
                          <polygon
                            points="100,72 158,45 158,55 100,82"
                            fill="url(#cyan-slab-right)"
                          />
                          <text
                            x="64"
                            y="66"
                            fill="#EEF6F7"
                            fontSize="6.2"
                            fontFamily="var(--font-mono)"
                            letterSpacing="0.08em"
                            fontWeight="600"
                            transform="rotate(22, 64, 66)"
                          >
                            PERFORMANCE
                          </text>
                        </g>

                        {/* ==============================================
                            LAYER 4: SCALING
                            ============================================== */}
                        <g className="iso-layer" transform="translate(0, 160)">
                          <polygon
                            points="100,18 158,45 100,72 42,45"
                            fill="url(#cyan-slab-top)"
                            stroke="rgba(92, 211, 238, 0.8)"
                            strokeWidth="1"
                          />
                          <polygon
                            points="42,45 100,72 100,82 42,55"
                            fill="url(#cyan-slab-left)"
                          />
                          <polygon
                            points="100,72 158,45 158,55 100,82"
                            fill="url(#cyan-slab-right)"
                          />
                          <text
                            x="74"
                            y="66"
                            fill="#EEF6F7"
                            fontSize="6.5"
                            fontFamily="var(--font-mono)"
                            letterSpacing="0.1em"
                            fontWeight="600"
                            transform="rotate(22, 74, 66)"
                          >
                            SCALING
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Cover Footer */}
                  <div className="journal__cover-foot">
                    <span className="journal__cover-tagline mono">
                      SMALL SUPPLEMENTS, BIG COMPOUNDING RESULTS.
                    </span>
                    <div className="journal__cover-brand">
                      <span className="journal__brand-name">BOOTSTACK</span>
                      <span className="journal__brand-sub">
                        Bootstrapping Your Brand to the Top.
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN: Article Information & Actions
              ============================================================ */}
          <div className="journal__col journal__col--right">
            <div className="journal__meta" data-reveal>
              <span className="journal__pill mono">{ARTICLE.category}</span>
              <span className="journal__meta-divider" aria-hidden="true">
                /
              </span>
              <span className="journal__meta-text mono">{ARTICLE.date}</span>
              <span className="journal__meta-divider" aria-hidden="true">
                /
              </span>
              <span className="journal__meta-text mono">{ARTICLE.readTime}</span>
            </div>

            <h3
              className="journal__article-title display"
              data-reveal
              style={{ "--reveal-delay": "60ms" }}
            >
              <a
                href={ARTICLE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="journal__title-link"
              >
                Digital Supplements: <br />
                The Hidden Growth System <br />
                for Modern Businesses
              </a>
            </h3>

            <p
              className="journal__excerpt body"
              data-reveal
              style={{ "--reveal-delay": "120ms" }}
            >
              {ARTICLE.excerpt}
            </p>

            <div
              className="journal__actions"
              data-reveal
              style={{ "--reveal-delay": "180ms" }}
            >
              <a
                href={ARTICLE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="journal__cta-primary"
              >
                <span className="journal__cta-text mono">READ FULL ARTICLE</span>
                <span className="journal__cta-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path
                      d="M2 14 L14 2 M6 2 h8 v8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
              </a>

              <a
                href={BLOG_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="journal__cta-ghost mono"
              >
                <span className="journal__ghost-dot" aria-hidden="true" />
                <span>EXPLORE MORE INSIGHTS</span>
              </a>
            </div>

            <div
              className="journal__tags"
              data-reveal
              style={{ "--reveal-delay": "240ms" }}
            >
              {ARTICLE.tags.map((tag) => (
                <span key={tag} className="journal__tag mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
