import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, clamp } from "../lib/motion";
import { useIsDesktop, useMediaQuery, useReducedMotion } from "../hooks/useMediaQuery";
import { stages } from "../data/approach";
import "./HowWeWork.css";

/**
 * Section 06 — Our process: How We Work.
 *
 * The five stages are the `stages` array the site already owns, so the copy has
 * one source. They are shown as one build system rather than a row of cards:
 *
 *   Desktop  A single board holds every stage at once, as modules on a rising
 *            circuit pathway. The section pins and scroll moves the build
 *            through it — the active stage is lifted and lit, a signal travels
 *            the pathway to the next module, the next one takes over, and the
 *            readout swaps to its title and description. Stages already passed
 *            stay visible and quieter; stages ahead wait, visible, quieter still.
 *   Compact  Phones and tablets: the same board and the same build, recomposed
 *            for a narrow frame — the rising pathway as one strip across the
 *            top, each stage a small labelled node, the readout beneath it. It
 *            pins for a short run, so the whole story takes little scrolling.
 *   Journey  Reduced motion, or a screen too short for the compact frame: the
 *            stages on a vertical pathway, without the pin.
 *
 * Everything is derived from scroll progress, so scrolling back reverses it
 * exactly. Under reduced motion every stage is shown, fully, at once.
 */

/** Small line icons, keyed by the stage index in the data. */
const ICONS = {
  "01": (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 21 21" />
    </>
  ),
  "02": (
    <>
      <circle cx="7" cy="6" r="2.4" />
      <circle cx="17" cy="12.5" r="2.4" />
      <path d="M7 8.4V20" />
      <path d="M17 14.9v.6a4 4 0 0 1-4 4H7" />
    </>
  ),
  "03": (
    <>
      <path d="M9 8 4 12l5 4" />
      <path d="M15 8l5 4-5 4" />
    </>
  ),
  "04": (
    <>
      <path d="M12 3c3 2.2 4.8 5.6 4.8 9.2L12 16.4 7.2 12.2C7.2 8.6 9 5.2 12 3Z" />
      <circle cx="12" cy="10" r="1.5" />
      <path d="M9.4 16.2 7.6 20.4l2.7-1M14.6 16.2l1.8 4.2-2.7-1" />
    </>
  ),
  "05": (
    <>
      <path d="M4 17l6-6 3.5 3.5L20 8" />
      <path d="M15 8h5v5" />
    </>
  ),
};

const LAST = stages.length - 1;

/** The readout: each stage's title and description, one shown at a time. */
function Readout() {
  return (
    <div className="how__readout">
      {stages.map((stage, i) => (
        <article className="how__panel" key={stage.index}>
          <p className="how__panel-step mono">Step {stage.index}</p>
          <h3 className="how__panel-title display">{stage.title}</h3>
          <p className="how__panel-line">{stage.line}</p>
          <p className="how__panel-body">{stage.body}</p>
          {stages[i + 1] ? (
            <p className="how__panel-next mono">
              Next <span aria-hidden="true">&rarr;</span> {stages[i + 1].title}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

/*
 * Where each stage's node sits on the board (fractions of its width/height):
 * a staircase rising left to right — the build climbing toward growth. Every
 * module card hangs below and to the right of its node, clear of the pathway,
 * leaving the open upper-left corner for the readout.
 */
const LAYOUT = [
  { x: 0.06, y: 0.72 },
  { x: 0.25, y: 0.6 },
  { x: 0.44, y: 0.48 },
  { x: 0.63, y: 0.36 },
  { x: 0.82, y: 0.24 },
];

/*
 * The compact pathway: the same five-step climb, compressed into a strip (these
 * fractions are of the strip, not the board). Labels hang below the node for
 * stages 01, 03 and 05 and above it for 02 and 04, so neighbours never meet on
 * a narrow screen.
 */
const LAYOUT_COMPACT = [
  { x: 0.1, y: 0.65 },
  { x: 0.3, y: 0.55 },
  { x: 0.5, y: 0.45 },
  { x: 0.7, y: 0.35 },
  { x: 0.9, y: 0.25 },
];

/** The compact frame's pinned run, as a percentage of the viewport height. */
const COMPACT_SCROLL = 120;

/* Timeline beats: each stage holds, then hands over to the next. */
const HOLD = 0.5;
const PASS = 0.5;
const DURATION = LAST + HOLD + 0.1;

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/** A circuit route between two nodes: straight, a 45° bevel, straight. */
function route([x0, y0], [x1, y1]) {
  const dx = x1 - x0;
  const dy = Math.abs(y1 - y0);
  if (dx <= dy) return [[x0, y0], [x1, y1]];
  const run = (dx - dy) / 2;
  return [
    [x0, y0],
    [x0 + run, y0],
    [x0 + run + dy, y1],
    [x1, y1],
  ];
}

function pointAlong(points, t) {
  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  const target = lengths[lengths.length - 1] * clamp(t, 0, 1);
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < target) i += 1;
  const span = lengths[i] - lengths[i - 1] || 1;
  const f = (target - lengths[i - 1]) / span;
  return [lerp(points[i - 1][0], points[i][0], f), lerp(points[i - 1][1], points[i][1], f)];
}

export default function HowWeWork() {
  const rootRef = useRef(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const isTall = useMediaQuery("(min-height: 640px)");
  const mode = reduced ? "journey" : isDesktop ? "board" : isTall ? "compact" : "journey";
  const pinned = mode === "board";
  const compact = mode === "compact";

  // ---- Desktop and compact: one pinned build system, advanced by scroll ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "journey") return undefined;

    const layout = mode === "compact" ? LAYOUT_COMPACT : LAYOUT;
    // The surface the pathway is measured on: the whole board on desktop, the
    // strip at the top of the board in the compact frame.
    const board = root.querySelector(mode === "compact" ? ".how__track" : ".how__board");
    const svg = root.querySelector(".how__paths");
    const bases = Array.from(root.querySelectorAll(".how__path-base"));
    const lits = Array.from(root.querySelectorAll(".how__path-lit"));
    const signal = root.querySelector(".how__signal");
    const modules = Array.from(root.querySelectorAll(".how__module"));
    const cards = modules.map((m) => m.querySelector(".how__module-card"));
    const panels = Array.from(root.querySelectorAll(".how__panel"));
    const counter = root.querySelector(".how__count-track");

    let segments = [];
    let time = 0;

    // Pathway geometry, in the board's own pixels.
    const measure = () => {
      const { width, height } = board.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${width.toFixed(1)} ${height.toFixed(1)}`);
      const nodes = layout.map(({ x, y }) => [x * width, y * height]);
      segments = nodes.slice(0, -1).map((node, i) => route(node, nodes[i + 1]));
      segments.forEach((points, i) => {
        const d = points.map(([x, y], j) => `${j ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
        bases[i].setAttribute("d", d);
        lits[i].setAttribute("d", d);
      });
      // Compact labels sit one step's height off their node, so the pathway's
      // rise never runs beneath a label however tall the strip is.
      if (mode === "compact") {
        board.style.setProperty("--step", `${Math.abs(nodes[1][1] - nodes[0][1]).toFixed(1)}px`);
      }
    };

    // Everything on the board is a function of timeline time.
    const render = () => {
      const t = time;
      let active = 0;
      let rolled = 0;

      for (let k = 0; k <= LAST; k += 1) {
        const enter = k === 0 ? 1 : smooth(clamp((t - (k - 1 + HOLD) - PASS * 0.35) / (PASS * 0.65), 0, 1));
        const leave = k === LAST ? 0 : smooth(clamp((t - (k + HOLD)) / (PASS * 0.6), 0, 1));
        const on = enter * (1 - leave);
        if (enter > 0.5) active = k;

        // Active: full size and weight. Passed: quieter. Ahead: quieter still.
        const scale = lerp(0.92, 1, on);
        const opacity = 0.46 + 0.54 * on + 0.22 * leave * (1 - on);
        cards[k].style.transform = `scale(${scale.toFixed(4)})`;
        cards[k].style.opacity = opacity.toFixed(3);

        // Readout: the stage leaving clears before the next one rises.
        const panelIn = k === 0 ? 1 : clamp((enter - 0.15) / 0.85, 0, 1);
        const panelOut = clamp(leave / 0.5, 0, 1);
        const shown = Math.min(panelIn, 1 - panelOut);
        panels[k].style.opacity = shown.toFixed(3);
        panels[k].style.transform = `translateY(${((1 - panelIn) * 18 - panelOut * 18).toFixed(2)}px)`;
        panels[k].style.visibility = shown < 0.01 ? "hidden" : "visible";
      }

      modules.forEach((module, k) => {
        module.setAttribute("data-state", k < active ? "done" : k === active ? "active" : "idle");
      });

      // Pathway: each segment lights as the build travels it.
      let moving = -1;
      lits.forEach((lit, j) => {
        const p = clamp((t - (j + HOLD)) / PASS, 0, 1);
        lit.style.strokeDashoffset = (1 - p).toFixed(4);
        rolled += smooth(p);
        if (p > 0 && p < 1) moving = j;
      });

      // The signal: a point running the segment currently being travelled.
      if (moving >= 0 && segments[moving]) {
        const p = smooth(clamp((t - (moving + HOLD)) / PASS, 0, 1));
        const [x, y] = pointAlong(segments[moving], p);
        signal.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        signal.setAttribute("opacity", "1");
      } else {
        signal.setAttribute("opacity", "0");
      }

      if (counter) counter.style.transform = `translateY(${((-100 * rolled) / stages.length).toFixed(3)}%)`;
    };

    const ctx = gsap.context(() => {
      // Arrival, before the pin: the frame settles in as the section rises.
      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: root, start: "top 85%", end: "top top", scrub: 0.6 },
        })
        .fromTo(".how__head", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0)
        .fromTo(".how__board", { y: 60, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1 }, 0.1);

      // The timeline carries no tweens of its own: it is the scrubbed clock
      // the board is drawn from.
      const clock = { t: 0 };
      const tl = gsap.timeline().to(clock, {
        t: DURATION,
        duration: DURATION,
        ease: "none",
        onUpdate: () => {
          time = clock.t;
          render();
        },
      });

      ScrollTrigger.create({
        animation: tl,
        trigger: root,
        start: "top top",
        end: mode === "compact" ? `+=${COMPACT_SCROLL}%` : `+=${stages.length * 80}%`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      });
    }, root);

    measure();
    render();
    const ro = new ResizeObserver(() => {
      measure();
      render();
    });
    ro.observe(board);

    // The pin adds scroll length above every later trigger.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => {
      ro.disconnect();
      ctx.revert();
      [...cards, ...panels].forEach((el) => el.removeAttribute("style"));
    };
  }, [mode]);

  // ---- Reduced motion, or too short for the compact frame: the vertical pathway ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode !== "journey") return undefined;

    const steps = gsap.utils.toArray(".how__jstep", root);
    const line = root.querySelector(".how__journey-line");

    if (reduced) {
      steps.forEach((step) => step.setAttribute("data-state", "active"));
      return undefined;
    }

    // The stage nearest the reading line is active; earlier ones are done.
    const update = () => {
      const mark = window.innerHeight * 0.58;
      let active = 0;
      steps.forEach((step, i) => {
        if (step.getBoundingClientRect().top <= mark) active = i;
      });
      steps.forEach((step, i) =>
        step.setAttribute("data-state", i < active ? "done" : i === active ? "active" : "idle"),
      );
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { "--p": 0 },
        {
          "--p": 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".how__journey",
            start: "top 58%",
            end: "bottom 58%",
            scrub: 0.5,
            onUpdate: update,
            onRefresh: update,
          },
        },
      );
    }, root);

    update();
    return () => ctx.revert();
  }, [mode, reduced]);

  return (
    <section
      ref={rootRef}
      id="process"
      className={`how how--${pinned ? "pinned" : compact ? "compact" : "journey"}`}
      data-bg="mist"
      aria-labelledby="how-title"
    >
      <div className="shell how__frame">
        <header className="how__head">
          <div className="how__head-copy">
            <p className="how__eyebrow mono">
              <b>06</b> / Our process
            </p>
            <h2 id="how-title" className="how__title display">
              How We Work<span className="how__stop">.</span>
            </h2>
          </div>

          {pinned || compact ? (
            <p className="how__count mono" aria-hidden="true">
              <span>Step</span>
              <span className="how__count-window">
                <span className="how__count-track">
                  {stages.map((stage) => (
                    <span key={stage.index}>{stage.index}</span>
                  ))}
                </span>
              </span>
              <span className="how__count-total">/ {String(stages.length).padStart(2, "0")}</span>
            </p>
          ) : null}
        </header>

        {pinned ? (
          <div className="how__board">
            <span className="how__board-grid" aria-hidden="true" />

            {/* The pathway between the stages, and the signal that travels it. */}
            <svg className="how__paths" aria-hidden="true" focusable="false">
              {stages.slice(0, -1).map((stage) => (
                <g key={stage.index}>
                  <path className="how__path-base" />
                  <path className="how__path-lit" pathLength="1" />
                </g>
              ))}
              <g className="how__signal" opacity="0">
                <circle className="how__signal-glow" r="11" />
                <circle className="how__signal-dot" r="4.5" />
              </g>
            </svg>

            {/* The readout: the active stage's title and description. */}
            <Readout />

            {/* Every stage, present at once, as a module on the pathway. */}
            <ol className="how__modules" aria-hidden="true">
              {stages.map((stage, i) => (
                <li
                  className="how__module"
                  key={stage.index}
                  data-state={i === 0 ? "active" : "idle"}
                  style={{ left: `${LAYOUT[i].x * 100}%`, top: `${LAYOUT[i].y * 100}%` }}
                >
                  <span className="how__node" />
                  <div className="how__module-card">
                    <div className="how__module-top">
                      <span className="how__module-index mono">{stage.index}</span>
                      <svg className="how__module-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                        {ICONS[stage.index]}
                      </svg>
                    </div>
                    <span className="how__module-title">{stage.title}</span>
                    <span className="how__module-line">{stage.line}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : compact ? (
          <div className="how__board how__board--compact">
            <span className="how__board-grid" aria-hidden="true" />

            {/* The pathway strip: every stage as a labelled node on the climb,
                and the signal that carries the build from one to the next. */}
            <div className="how__track">
              <svg className="how__paths" aria-hidden="true" focusable="false">
                {stages.slice(0, -1).map((stage) => (
                  <g key={stage.index}>
                    <path className="how__path-base" />
                    <path className="how__path-lit" pathLength="1" />
                  </g>
                ))}
                <g className="how__signal" opacity="0">
                  <circle className="how__signal-glow" r="9" />
                  <circle className="how__signal-dot" r="3.8" />
                </g>
              </svg>

              <ol className="how__modules" aria-hidden="true">
                {stages.map((stage, i) => (
                  <li
                    className="how__module"
                    key={stage.index}
                    data-state={i === 0 ? "active" : "idle"}
                    data-side={i % 2 ? "above" : "below"}
                    style={{ left: `${LAYOUT_COMPACT[i].x * 100}%`, top: `${LAYOUT_COMPACT[i].y * 100}%` }}
                  >
                    <span className="how__node" />
                    <div className="how__module-card">
                      <span className="how__module-index mono">{stage.index}</span>
                      <span className="how__module-title">{stage.title}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Readout />
          </div>
        ) : (
          <div className="how__journey">
            <span className="how__journey-line" aria-hidden="true">
              <i className="how__journey-fill" />
              <i className="how__journey-signal" />
            </span>
            <ol className="how__jsteps">
              {stages.map((stage, i) => (
                <li className="how__jstep" key={stage.index} data-state={i === 0 ? "active" : "idle"}>
                  <span className="how__jnode" aria-hidden="true" />
                  <div className="how__jcard">
                    <div className="how__jmeta">
                      <span className="how__jindex mono">Step {stage.index}</span>
                      <span className="how__jicon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                          {ICONS[stage.index]}
                        </svg>
                      </span>
                    </div>
                    <h3 className="how__jtitle display">{stage.title}</h3>
                    <p className="how__jline">{stage.line}</p>
                    <p className="how__jbody">{stage.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
