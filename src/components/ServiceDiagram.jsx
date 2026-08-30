import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import "./ServiceDiagram.css";

/**
 * The service, drawn as a system.
 *
 * Inline SVG carries the edges — real paths with `pathLength="100"`, drawn by
 * animating strokeDashoffset, with a short travelling dash riding each one as a
 * pulse. The nodes are HTML positioned by percentage over the same coordinate
 * space, so their labels stay selectable, scalable and legible at any size.
 *
 * The model comes from data/serviceDiagrams.js, so a different service produces
 * a different system without a line of per-service code here.
 */

/** Percentage coordinates for either model, plus the edges that join them. */
function layout(model) {
  if (model.kind === "hub") {
    const branches = model.branches;
    const last = branches.length - 1;

    const nodes = [
      { id: "source", label: model.source, x: 8, y: 50, role: "in" },
      { id: "hub", label: model.hub, x: 33, y: 50, role: "hub" },
      ...branches.map((label, i) => ({
        id: `branch-${i}`,
        label,
        x: 65,
        y: last === 0 ? 50 : 12 + (i * 76) / last,
        role: "branch",
      })),
      { id: "sink", label: model.sink, x: 92, y: 50, role: "out" },
    ];

    const hubIndex = 1;
    const sinkIndex = nodes.length - 1;
    const edges = [
      [0, hubIndex],
      ...branches.map((_, i) => [hubIndex, 2 + i]),
      ...branches.map((_, i) => [2 + i, sinkIndex]),
    ];

    return { nodes, edges };
  }

  const labels = model.nodes;
  const last = labels.length - 1;
  const nodes = labels.map((label, i) => ({
    id: `step-${i}`,
    label,
    x: 8 + (i * 84) / last,
    // Climbing left to right: the journey gains ground as it goes.
    y: 78 - (i * 58) / last,
    role: "step",
  }));
  const edges = labels.slice(1).map((_, i) => [i, i + 1]);

  return { nodes, edges };
}

export default function ServiceDiagram({ model, label }) {
  const rootRef = useRef(null);
  const { nodes, edges } = useMemo(() => layout(model), [model]);

  const path = ([a, b]) =>
    `M ${nodes[a].x.toFixed(2)} ${nodes[a].y.toFixed(2)} L ${nodes[b].x.toFixed(
      2,
    )} ${nodes[b].y.toFixed(2)}`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Drawn, settled, and still.
        gsap.set(".sdg__line", { strokeDashoffset: 0 });
        gsap.set(".sdg__node", { opacity: 1, scale: 1 });
        gsap.set(".sdg__pulse", { opacity: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".sdg__line", { strokeDashoffset: 100 });
        gsap.set(".sdg__node", { opacity: 0, scale: 0.82 });

        // The system assembles once, when it is first looked at: edges draw,
        // then the nodes land on them.
        const build = gsap
          .timeline({
            paused: true,
            defaults: { ease: "power2.out" },
          })
          .to(".sdg__line", {
            strokeDashoffset: 0,
            duration: 0.9,
            stagger: 0.07,
          })
          .to(
            ".sdg__node",
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06 },
            0.25,
          );

        // Then the pulses run: a short dash travelling each edge, forever.
        const pulse = gsap.to(".sdg__pulse", {
          strokeDashoffset: -100,
          duration: 2.4,
          ease: "none",
          repeat: -1,
          stagger: { each: 0.18, repeat: -1 },
          paused: true,
        });

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: () => {
            build.play();
            pulse.play();
          },
          onEnterBack: () => pulse.play(),
          onLeave: () => pulse.pause(),
          onLeaveBack: () => pulse.pause(),
        });

        return () => {
          trigger.kill();
          build.kill();
          pulse.kill();
        };
      });
    }, root);

    return () => ctx.revert();
  }, [model]);

  return (
    <div
      className="sdg"
      data-kind={model.kind}
      ref={rootRef}
      role="img"
      aria-label={`${label}: ${nodes.map((n) => n.label).join(" to ")}`}
    >
      <span className="sdg__grid" aria-hidden="true" />

      <svg
        className="sdg__wires"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {edges.map((edge, i) => {
          const d = path(edge);
          return (
            <g key={`${edge[0]}-${edge[1]}`}>
              <path className="sdg__ghost" d={d} />
              <path className="sdg__line" d={d} pathLength="100" />
              <path
                className="sdg__pulse"
                d={d}
                pathLength="100"
                style={{ "--i": i }}
              />
            </g>
          );
        })}
      </svg>

      <ul className="sdg__nodes">
        {nodes.map((node) => (
          <li
            className="sdg__node"
            key={node.id}
            data-role={node.role}
            style={{ "--x": `${node.x}%`, "--y": `${node.y}%` }}
          >
            <span className="sdg__dot" aria-hidden="true" />
            <span className="sdg__label">{node.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
