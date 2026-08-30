import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { ADVANTAGE, ADVANTAGE_RESULT } from "../data/servicePanels";
import "./ServiceVisuals.css";

/**
 * The service page's visual system.
 *
 * Five compositions, each one an abstract interface rather than a diagram:
 * a layered panel, a field of keywords, a blueprint of modules, a process
 * board, and the studio's advantage stack. Every label inside them is read
 * from the service's own data, so the same code produces a different object
 * for every service.
 *
 * Each piece owns its motion in a gsap.context with a reduced-motion branch.
 */

/* ------------------------------------------------------------------ utils */

/** Deterministic 0.55–1 fraction from a string. Rhythm for the bars, never a
 *  statistic — no number is ever shown next to them. */
const weight = (text) => {
  let n = 0;
  for (let i = 0; i < text.length; i += 1) n = (n * 31 + text.charCodeAt(i)) % 997;
  return 0.55 + (n % 45) / 100;
};

function useAssemble(ref, deps = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-piece]", { opacity: 1, y: 0, scaleX: 1 });
        gsap.set("[data-stroke]", { strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 78%" },
          defaults: { ease: "power3.out" },
        });

        tl.from("[data-piece]", {
          opacity: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.07,
        });

        if (root.querySelector("[data-bar]")) {
          tl.from(
            "[data-bar]",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.8,
              stagger: 0.06,
            },
            0.2,
          );
        }

        if (root.querySelector("[data-stroke]")) {
          tl.fromTo(
            "[data-stroke]",
            { strokeDashoffset: 100 },
            { strokeDashoffset: 0, duration: 0.9, stagger: 0.1 },
            0.25,
          );
        }

        // A slow drift so the composition is never quite still.
        gsap.to("[data-float]", {
          y: -8,
          duration: 3.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.5, from: "random" },
        });
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ------------------------------------------------- 1 · the service object */

export function ServicePanel({ kind, caption, labels, modules }) {
  const ref = useRef(null);
  useAssemble(ref, [kind, labels.join()]);

  const rows = labels.slice(0, 4);
  const chips = modules.slice(0, 3);

  return (
    <div className={`vpanel vpanel--${kind}`} ref={ref} aria-hidden="true">
      <span className="vpanel__grid" />

      {/* Two plates behind the surface, for depth. */}
      <span className="vpanel__plate vpanel__plate--far" data-piece />
      <span className="vpanel__plate vpanel__plate--near" data-piece />

      <div className="vpanel__surface" data-piece>
        <div className="vpanel__bar">
          <i />
          <i />
          <i />
          <span className="vpanel__caption mono">{caption}</span>
          <span className="vpanel__live" />
        </div>

        <div className="vpanel__body">
          {rows.map((label) => (
            <div className="vpanel__row" key={label}>
              <span className="vpanel__label mono">{label}</span>
              <span className="vpanel__meter">
                <i data-bar style={{ "--w": `${Math.round(weight(label) * 100)}%` }} />
              </span>
            </div>
          ))}
        </div>

        <svg className="vpanel__trace" viewBox="0 0 100 26" preserveAspectRatio="none">
          <path
            data-stroke
            pathLength="100"
            d="M0 20 L14 20 L20 8 L30 8 L36 22 L50 22 L56 12 L70 12 L76 19 L100 19"
          />
        </svg>
      </div>

      {/* Floating modules, named by the service's own deliverables. */}
      {chips.map((chip, i) => (
        <span
          className={`vpanel__chip vpanel__chip--${i + 1} mono`}
          key={chip}
          data-piece
          data-float
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------- 2 · keywords in space */

export function KeywordField({ words }) {
  const ref = useRef(null);
  useAssemble(ref, [words.join()]);

  const shown = words.slice(0, 4);

  return (
    <div className="vkeys" ref={ref} aria-hidden="true">
      <svg className="vkeys__path" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          data-stroke
          pathLength="100"
          d="M12 78 C 34 70, 26 40, 48 34 S 76 40, 88 16"
        />
      </svg>

      {shown.map((word, i) => (
        <span
          className={`vkeys__word vkeys__word--${i + 1} display`}
          key={word}
          data-piece
          data-float
        >
          {word}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------- 3 · the blueprint */

export function BuildBlueprint({ items }) {
  const ref = useRef(null);
  useAssemble(ref, [items.join()]);

  return (
    <div className="vblue" ref={ref}>
      <span className="vblue__grid" aria-hidden="true" />

      <ol className="vblue__modules">
        {items.map((item, i) => (
          <li
            className="vblue__module"
            key={item}
            data-piece
            style={{ "--i": i }}
          >
            <span className="vblue__num mono">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="vblue__label display">{item}</span>
            <span className="vblue__edge" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ----------------------------------------------------- 4 · the process board */

export function ProcessBoard({ stages }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".vboard__stage", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () =>
        items.forEach((item) => item.classList.add("is-on")),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        items.forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            x: -22,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          });
          ScrollTrigger.create({
            trigger: item,
            start: "top 72%",
            onEnter: () => item.classList.add("is-on"),
            onLeaveBack: () => item.classList.remove("is-on"),
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, [stages]);

  return (
    <ol className="vboard" ref={ref}>
      {stages.map((stage, i) => (
        <li className="vboard__stage" key={stage} style={{ "--i": i }}>
          <span className="vboard__num display">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="vboard__rule" aria-hidden="true" />
          <span className="vboard__label">{stage}</span>
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------- 4b · the engagement, as a cycle */

/**
 * The same stages read as a loop rather than a list - the engagement is a
 * cycle, not a one-way run. The ring turns with the scroll, so the section has
 * something visibly in motion, and the number in the middle is a real count:
 * stages.length.
 */
export function ProcessOrbit({ stages }) {
  const ref = useRef(null);
  const count = stages.length;
  const RADIUS = 34;

  const nodes = stages.map((stage, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      stage,
      x: 50 + Math.cos(angle) * RADIUS,
      y: 50 + Math.sin(angle) * RADIUS,
    };
  });

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".vorbit__arc", { strokeDashoffset: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The arc closes as the section is read.
        gsap.fromTo(
          ".vorbit__arc",
          { strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "bottom 55%",
              scrub: 0.7,
            },
          },
        );

        // And the whole ring turns while the section passes.
        gsap.to(".vorbit__spin", {
          rotation: 120,
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.from(".vorbit__node", {
          scale: 0,
          transformOrigin: "center",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 80%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [stages, count]);

  return (
    <div className="vorbit" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <g className="vorbit__spin">
          <circle className="vorbit__ring" cx="50" cy="50" r={RADIUS} />
          <circle
            className="vorbit__arc"
            cx="50"
            cy="50"
            r={RADIUS}
            pathLength="100"
          />
          {nodes.map((node) => (
            <circle
              className="vorbit__node"
              key={node.stage}
              cx={node.x}
              cy={node.y}
              r="3"
            />
          ))}
        </g>
      </svg>

      <span className="vorbit__centre">
        <span className="vorbit__count display">
          {String(count).padStart(2, "0")}
        </span>
        <span className="vorbit__caption mono">Stages</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------- 5 · the advantage stack */

export function AdvantageStack() {
  const ref = useRef(null);
  useAssemble(ref, []);

  return (
    <div className="vstack" ref={ref} aria-hidden="true">
      {ADVANTAGE.map((term, i) => (
        <span className="vstack__row" key={term} data-piece>
          <span className="vstack__term display">{term}</span>
          {i < ADVANTAGE.length - 1 ? (
            <span className="vstack__op mono">+</span>
          ) : null}
        </span>
      ))}

      <span className="vstack__bar" data-piece />

      <span className="vstack__row vstack__row--sum" data-piece>
        <span className="vstack__op vstack__op--eq mono">=</span>
        <span className="vstack__term vstack__term--sum display">
          {ADVANTAGE_RESULT}
        </span>
      </span>
    </div>
  );
}
