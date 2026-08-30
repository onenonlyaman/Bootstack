import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useIsDesktop } from "../hooks/useMediaQuery";
import "./ProcessTimeline.css";

/**
 * How we work, as a journey.
 *
 * Desktop draws a stepped SVG path climbing left to right with a node on each
 * turn; below 900px the same stages become a vertical run with a straight
 * spine. Both are real `pathLength` strokes drawn by scroll, and both are built
 * from the `stages` passed in — service.process — so the shape follows the data.
 */
export default function ProcessTimeline({ stages }) {
  const rootRef = useRef(null);
  const isDesktop = useIsDesktop();
  const count = stages.length;

  // Node coordinates in a 0-100 box: a staircase climbing as it advances.
  const point = (i) => ({
    x: count === 1 ? 50 : 6 + (i * 88) / (count - 1),
    y: count === 1 ? 50 : 76 - (i * 56) / (count - 1),
  });

  // Right, then up: the stepped route of the sketch rather than a diagonal.
  const steppedPath = stages
    .map((_, i) => {
      const here = point(i);
      if (i === 0) return `M ${here.x.toFixed(2)} ${here.y.toFixed(2)}`;
      const prev = point(i - 1);
      const mid = ((prev.x + here.x) / 2).toFixed(2);
      return `L ${mid} ${prev.y.toFixed(2)} L ${mid} ${here.y.toFixed(
        2,
      )} L ${here.x.toFixed(2)} ${here.y.toFixed(2)}`;
    })
    .join(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !count) return undefined;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".ptl__stage", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".ptl__draw", { strokeDashoffset: 0 });
        items.forEach((item) => item.classList.add("is-done"));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".ptl__draw",
          { strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 78%",
              end: "bottom 72%",
              scrub: 0.7,
            },
          },
        );

        items.forEach((item, i) => {
          gsap.from(item, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 80%" },
            delay: i * 0.09,
          });

          ScrollTrigger.create({
            trigger: root,
            start: `top ${74 - i * 6}%`,
            onEnter: () => item.classList.add("is-done"),
            onLeaveBack: () => item.classList.remove("is-done"),
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, [stages, count, isDesktop]);

  if (!count) return null;

  return (
    <div className="ptl" ref={rootRef} data-axis={isDesktop ? "x" : "y"}>
      <svg
        className="ptl__path"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {isDesktop ? (
          <>
            <path className="ptl__track" d={steppedPath} />
            <path className="ptl__draw" d={steppedPath} pathLength="100" />
          </>
        ) : (
          <>
            <path className="ptl__track" d="M 4 0 L 4 100" />
            <path className="ptl__draw" d="M 4 0 L 4 100" pathLength="100" />
          </>
        )}
      </svg>

      <ol className="ptl__stages">
        {stages.map((stage, i) => {
          const { x, y } = point(i);
          return (
            <li
              className="ptl__stage"
              key={stage}
              style={{ "--x": `${x}%`, "--y": `${y}%`, "--i": i }}
            >
              <span className="ptl__dot" aria-hidden="true" />
              <span className="ptl__num mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="ptl__label">{stage}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
