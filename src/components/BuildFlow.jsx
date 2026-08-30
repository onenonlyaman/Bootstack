import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import "./BuildFlow.css";

/**
 * What we build, as a connected path.
 *
 * An SVG spine runs the length of the list and draws itself as the list is
 * scrolled — a real `pathLength` stroke, not a CSS border. Each deliverable
 * takes over as it reaches the reading line, and the ones behind it keep a
 * completed mark, so the list reads as a route rather than bullets.
 *
 * Node count comes entirely from the `items` passed in, which is service.build.
 */
export default function BuildFlow({ items }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !items.length) return undefined;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".bflow__item", root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".bflow__draw", { strokeDashoffset: 0 });
        rows.forEach((row) => row.classList.add("is-done"));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The spine draws in step with the scroll through the list.
        gsap.fromTo(
          ".bflow__draw",
          { strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.6,
            },
          },
        );

        rows.forEach((row, i) => {
          // Arrival.
          gsap.from(row, {
            opacity: 0,
            x: -18,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 88%" },
          });

          // Live while it holds the reading line; marked done once passed.
          ScrollTrigger.create({
            trigger: row,
            start: "top 66%",
            end: "bottom 66%",
            onToggle: (self) => row.classList.toggle("is-live", self.isActive),
            onEnter: () => row.classList.add("is-done"),
            onLeaveBack: () => {
              if (i > 0) row.classList.remove("is-done");
            },
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="bflow" ref={rootRef}>
      {/* The spine. A straight vertical path stretched to the list's height,
          so it fits however tall the deliverables happen to run. */}
      <svg
        className="bflow__spine"
        viewBox="0 0 4 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="bflow__track" d="M 2 0 L 2 100" />
        <path className="bflow__draw" d="M 2 0 L 2 100" pathLength="100" />
      </svg>

      <ol className="bflow__list">
        {items.map((item, i) => (
          <li className="bflow__item" key={item}>
            <span className="bflow__node" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle className="bflow__ring" cx="12" cy="12" r="9" />
                <path
                  className="bflow__tick"
                  d="M8 12.4l2.6 2.6L16.5 9"
                  pathLength="100"
                />
              </svg>
            </span>

            <span className="bflow__num mono">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="bflow__label display">{item}</span>

            <span className="bflow__rule" aria-hidden="true" />
            <span className="bflow__arrow" aria-hidden="true">
              &rarr;
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
