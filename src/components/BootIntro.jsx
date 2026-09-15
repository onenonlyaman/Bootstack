import { useEffect, useRef } from "react";
import { gsap } from "../lib/motion";
import "./BootIntro.css";

/**
 * Bootstack is booting — the opening sequence before the homepage.
 *
 *   DOT → NETWORK → DIGITAL CORE → B → SYSTEM ONLINE → HERO
 *
 * A single point appears on a deep ground, reaches out to a ring of nodes, pulls
 * them in to form the core, and the B resolves inside its window. A pulse runs
 * the core, daylight spreads from it, and the finished core flies to the Hero's
 * own core and lands on it as the page is revealed — so the system that just
 * booted is the one the Hero is standing on.
 *
 * About three seconds. Played once per session (see `shouldPlayIntro`), never
 * under reduced motion, and any click or key skips ahead to the hand-over.
 */

const KEY = "bootstack:intro-played";

/** Whether this visit should open with the boot sequence. */
export function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const forced = new URLSearchParams(window.location.search).has("intro");
  if (forced) return true;
  // Arriving for a specific section (a hash, or back from a service page) goes
  // straight there rather than through the intro.
  if (window.location.hash) return false;
  try {
    if (sessionStorage.getItem("bootstack:from-service")) return false;
    if (sessionStorage.getItem(KEY)) return false;
  } catch {
    /* storage unavailable: play it */
  }
  return true;
}

// The network: eight nodes on a ring, each flying in to a point on the core.
const CENTER = 200;
const RADIUS = 122;
const CHIP = { x: 140, y: 140, size: 120 };
const NODES = Array.from({ length: 8 }, (_, i) => {
  const angle = (-90 + i * 45) * (Math.PI / 180);
  const r = i % 2 ? RADIUS * 0.84 : RADIUS;
  // Corners and edge midpoints of the core, clockwise from the top.
  const anchors = [
    [200, 140], [260, 140], [260, 200], [260, 260],
    [200, 260], [140, 260], [140, 200], [140, 140],
  ];
  return {
    x: CENTER + Math.cos(angle) * r,
    y: CENTER + Math.sin(angle) * r,
    to: anchors[i],
    accent: i === 1,
  };
});

/* A geometric B for the core window, with the brand's orange square. */
const B_PATH =
  "M42 36H62C71.5 36 77 40.5 77 47.5C77 52 74.5 55 70.5 56.3C75.8 57.6 79 61.5 79 67C79 76 72.5 84 62.5 84H42Z" +
  "M51 43.5V52.8H60.5C64.2 52.8 66.8 51 66.8 48.1C66.8 45.2 64.2 43.5 60.5 43.5Z" +
  "M51 60.2V76.5H61.5C66 76.5 69.2 74 69.2 68.3C69.2 63 66 60.2 61.5 60.2Z";

export default function BootIntro({ onReady, onDone }) {
  const rootRef = useRef(null);
  const statusRef = useRef(null);
  const callbacks = useRef({ onReady, onDone });
  callbacks.current = { onReady, onDone };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode */
    }

    // Begin — and hand over — at the very top of the page, whatever the
    // browser tried to restore.
    window.scrollTo(0, 0);

    let readied = false;
    const ready = () => {
      if (readied) return;
      readied = true;
      window.scrollTo(0, 0);
      callbacks.current.onReady?.();
    };
    const setStatus = (text) => {
      if (statusRef.current) statusRef.current.textContent = text;
    };

    const q = (sel) => root.querySelector(sel);
    const qa = (sel) => Array.from(root.querySelectorAll(sel));

    const ctx = gsap.context(() => {
      const nodes = qa(".boot__node");
      const lines = qa(".boot__line");
      const core = q(".boot__core");
      const coreInner = q(".boot__core-inner");

      gsap.set(".boot__dot", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(lines, { strokeDashoffset: 1 });
      // GSAP resolves an SVG element's transform origin against its own box, so
      // no CSS transform-box here — combining the two offsets the nodes.
      gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".boot__chip-edge, .boot__b-stroke", { strokeDashoffset: 1 });
      gsap.set(".boot__chip-fill, .boot__b-fill, .boot__b-dot", { opacity: 0 });
      gsap.set(".boot__window", { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
      gsap.set(".boot__pulse", { opacity: 0, attr: { r: 64 } });
      gsap.set(".boot__signal", { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => callbacks.current.onDone?.(),
      });

      // DOT
      tl.to(".boot__dot", { scale: 1, duration: 0.45 }, 0.1)
        .to(".boot__meter i", { scaleX: 0.22, duration: 0.6, ease: "power1.inOut" }, 0.1)
        .fromTo(
          ".boot__word, .boot__status",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          0.15,
        )

        // NETWORK — thin lines reach out and a ring of nodes switches on.
        .to(lines, { strokeDashoffset: 0, duration: 0.5, stagger: 0.035, ease: "power2.out" }, 0.4)
        .to(nodes, { scale: 1, duration: 0.4, stagger: 0.035, ease: "power2.out" }, 0.6)
        .call(setStatus, ["Connecting"], 0.7)
        .to(".boot__meter i", { scaleX: 0.5, duration: 0.5, ease: "power1.inOut" }, 0.7)

        // DIGITAL CORE — the nodes pull in and the core's edge is drawn between them.
        .to(nodes, {
          attr: { x: (i) => NODES[i].to[0] - 4.5, y: (i) => NODES[i].to[1] - 4.5 },
          duration: 0.55,
          stagger: 0.02,
          ease: "power3.inOut",
        }, 1.05)
        .to(lines, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.1)
        .to(".boot__chip-edge", { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, 1.1)
        .to(".boot__dot", { scale: 0, duration: 0.3, ease: "power2.in" }, 1.25)

        // B — the core fills, its window opens and the B draws, then solidifies.
        .to(".boot__chip-fill", { opacity: 1, duration: 0.35, ease: "power1.out" }, 1.5)
        .to(nodes, { opacity: 0, duration: 0.3 }, 1.55)
        .to(".boot__window", { opacity: 1, scale: 1, duration: 0.4 }, 1.55)
        .to(".boot__b-stroke", { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" }, 1.65)
        .to(".boot__b-fill", { opacity: 1, duration: 0.25 }, 1.95)
        .to(".boot__b-dot", { opacity: 1, duration: 0.2 }, 2.0)
        .to(".boot__meter i", { scaleX: 0.82, duration: 0.5, ease: "power1.inOut" }, 1.5)

        // SYSTEM ONLINE — a pulse runs the core, daylight spreads out from it.
        .call(setStatus, ["System online"], 2.0)
        .set(root, { attr: { "data-online": "true" } }, 2.12)
        .to(".boot__pulse", { opacity: 0.9, duration: 0.08, ease: "none" }, 2.0)
        .to(".boot__pulse", { attr: { r: 190 }, opacity: 0, duration: 0.75, ease: "power2.out" }, 2.02)
        .fromTo(
          ".boot__signal",
          { opacity: 1, "--p": 0 },
          { "--p": 1, duration: 0.55, ease: "power1.inOut", immediateRender: false },
          2.0,
        )
        .to(".boot__signal", { opacity: 0, duration: 0.15 }, 2.5)
        .to(root, { "--light": 115, duration: 0.7, ease: "power2.inOut" }, 2.0)
        .to(".boot__meter i", { scaleX: 1, duration: 0.35, ease: "power1.out" }, 2.1)

        // ENTER — the core flies to the Hero's core and lands on it as the page appears.
        .addLabel("enter", 2.55)
        .call(setStatus, ["Enter Bootstack"], "enter")
        .call(ready, [], "enter")
        .add(() => {
          const target = document.querySelector(".hero .ss-core .ss-tier:last-child .ss-face");
          const from = core.getBoundingClientRect();
          const to = target?.getBoundingClientRect();
          const landable = to && to.width > 8 && to.top + to.height / 2 < window.innerHeight;

          if (landable) {
            const k = to.width / (from.width * Math.SQRT2);
            gsap.to(core, {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top + to.height / 2 - (from.top + from.height / 2),
              scaleX: k,
              scaleY: (k * to.height) / to.width,
              duration: 0.75,
              ease: "power3.inOut",
            });
            // Rotate first, squash second (outer wrapper): the square becomes
            // the Hero core's isometric diamond, not a skewed rhombus.
            gsap.to(coreInner, { rotation: 45, duration: 0.75, ease: "power3.inOut" });
            gsap.to(core, { opacity: 0, duration: 0.3, delay: 0.72, ease: "power1.out" });
          } else {
            gsap.to(core, { y: -40, scale: 0.7, opacity: 0, duration: 0.6, ease: "power2.in" });
          }
        }, "enter")
        .to(".boot__word, .boot__status, .boot__meter", { opacity: 0, y: -10, duration: 0.3, ease: "power1.in" }, "enter")
        .to(".boot__stage-net", { opacity: 0, duration: 0.3 }, "enter")
        .to(".boot__ground", { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "enter+=0.15")
        .to({}, { duration: 0.35 }, "enter+=0.75");

      // Any click, tap or key hurries the sequence to its hand-over.
      const skip = () => {
        if (tl.time() < tl.labels.enter) tl.timeScale(4);
      };
      root.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", skip);
      return () => {
        root.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
      };
    }, root);

    // App keeps its own safety timer, so a torn-down intro can never leave the
    // page locked; calling `ready` here would fire during StrictMode's
    // mount-unmount-mount in development and reveal the page under the intro.
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="boot" data-online="false" role="status" aria-live="polite">
      <span className="visually-hidden">Bootstack is loading</span>

      <div className="boot__ground" aria-hidden="true">
        <span className="boot__dark" />
        <span className="boot__light" />
      </div>

      <div className="boot__stage" aria-hidden="true">
        <svg className="boot__stage-net" viewBox="0 0 400 400" focusable="false">
          {NODES.map((node, i) => (
            <line
              key={`line-${i}`}
              className="boot__line"
              x1={CENTER}
              y1={CENTER}
              x2={node.x}
              y2={node.y}
              pathLength="1"
            />
          ))}
          <circle className="boot__pulse" cx={CENTER} cy={CENTER} r="64" />
          {NODES.map((node, i) => (
            <rect
              key={`node-${i}`}
              className={`boot__node${node.accent ? " boot__node--accent" : ""}`}
              x={node.x - 4.5}
              y={node.y - 4.5}
              width="9"
              height="9"
              rx="2"
            />
          ))}
          <circle className="boot__dot" cx={CENTER} cy={CENTER} r="5" />
        </svg>

        {/* The core: a wrapper for position and squash, an inner for rotation. */}
        <div className="boot__core">
          <div className="boot__core-inner">
            <svg viewBox="0 0 120 120" focusable="false">
              <defs>
                <linearGradient id="boot-cap" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2f73a6" />
                  <stop offset="100%" stopColor="#235784" />
                </linearGradient>
              </defs>
              <rect className="boot__chip-fill" x="1" y="1" width="118" height="118" rx="16" fill="url(#boot-cap)" />
              <rect className="boot__chip-edge" x="1" y="1" width="118" height="118" rx="16" pathLength="1" />
              <rect className="boot__signal" x="1" y="1" width="118" height="118" rx="16" pathLength="1" />
              <rect className="boot__window" x="22" y="22" width="76" height="76" rx="9" />
              <path className="boot__b-fill" d={B_PATH} fillRule="evenodd" />
              <path className="boot__b-stroke" d={B_PATH} pathLength="1" />
              <rect className="boot__b-dot" x="35.5" y="77.5" width="5.5" height="5.5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="boot__caption" aria-hidden="true">
        <span className="boot__word">Bootstack</span>
        <span className="boot__status" ref={statusRef}>
          Initializing
        </span>
        <span className="boot__meter">
          <i />
        </span>
      </div>
    </div>
  );
}
