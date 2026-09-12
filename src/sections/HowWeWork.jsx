import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { stages } from "../data/approach";
import "./HowWeWork.css";

/**
 * Our process — the five stages as one connected horizontal run.
 *
 * The stage list is the same `stages` array the site already owns, so the copy
 * has one source. The flow itself is the feature: a marker travels the line,
 * the fill follows it, and each card takes over as the marker arrives. It runs
 * only while the section is on screen, and not at all under reduced motion.
 *
 * Below 700px the same timeline drives a vertical run instead — the axis is the
 * only thing that changes, because the marker is a wrapper spanning the line and
 * the fill is a scale, so both work on either axis.
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

export default function HowWeWork() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const steps = gsap.utils.toArray(".how__step", root);
    const marker = root.querySelector(".how__marker");
    if (!steps.length || !marker) return undefined;

    const last = steps.length - 1;

    /* The reference advances a stage every 1.5s and lights exactly one card at
       a time — a spotlight that travels, not a progress bar that fills in
       behind itself. Measured off the live site. */
    const STEP = 1.5;

    // Classes are toggled imperatively rather than rendered: useReveal adds
    // `is-in` to these same cards with classList.add(), and a React-owned
    // className would wipe it on the next render.
    const light = (index) =>
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === index);
        // No accumulating trail: the reference clears the stage it leaves.
        step.classList.remove("is-done");
      });

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions;

          if (reduced) {
            // Nothing moves: the first stage simply reads as the current one.
            gsap.set(marker, { xPercent: 0, yPercent: 0, opacity: 1 });
            light(0);
            return undefined;
          }

          // The marker is a wrapper spanning the whole line, so a percentage
          // translate lands exactly on a stage — no pixel maths to redo on
          // resize. The run is horizontal at every width now, so the axis no
          // longer switches with the breakpoint.
          const axis = "xPercent";

          gsap.set(marker, { xPercent: 0, yPercent: 0, opacity: 1 });
          light(0);

          const tl = gsap.timeline({ repeat: -1, paused: true });

          for (let i = 1; i <= last; i += 1) {
            const at = (i - 1) * STEP;

            tl.call(light, [i], at + STEP * 0.62).to(
              marker,
              {
                [axis]: (i / last) * 100,
                duration: STEP * 0.62,
                ease: "power2.inOut",
              },
              at + STEP * 0.38,
            );
          }

          /* The loop closes the way the reference's does: the last stage holds
             its beat, then the marker fades out, returns to the start while it
             is invisible and fades back in. The old rewind slid it all the way
             back down the line, which read as the animation restarting rather
             than continuing. */
          const tail = last * STEP;

          tl.to(marker, { opacity: 0, duration: 0.28, ease: "power2.in" }, tail)
            .set(marker, { [axis]: 0 })
            .call(light, [0])
            .to(marker, { opacity: 1, duration: 0.28, ease: "power2.out" })
            .to({}, { duration: STEP * 0.5 });

          // Only runs while it is being looked at. The class gates the CSS
          // sweep on the connector line at the same time.
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 82%",
            end: "bottom 18%",
            onEnter: () => {
              root.classList.add("is-running");
              tl.play();
            },
            onEnterBack: () => {
              root.classList.add("is-running");
              tl.play();
            },
            onLeave: () => {
              root.classList.remove("is-running");
              tl.pause();
            },
            onLeaveBack: () => {
              root.classList.remove("is-running");
              tl.pause();
            },
          });

          return () => {
            trigger.kill();
            tl.kill();
            root.classList.remove("is-running");
          };
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="how band" data-bg="mist">
      <div className="shell how__inner">
        <p className="how__eyebrow mono" data-reveal>
          Our process
        </p>

        <h2 className="how__title display section-gradient-heading" data-reveal>
          How We Work<span className="how__stop"></span>
        </h2>

        <div className="how__track">
          <div className="how__line" aria-hidden="true">
            <span className="how__line-fill" />
            <span className="how__marker">
              <i />
            </span>
          </div>

          {/* The travelling signal. A sibling rather than a child of
              .how__line because that element is clipped to the 2px hairline,
              which would flatten the dots into slivers. */}
          <div className="how__flow" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ol className="how__steps">
            {stages.map((stage, i) => (
              <li
                className="how__step"
                key={stage.index}
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` }}
              >
                <span className="how__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                    {ICONS[stage.index]}
                  </svg>
                </span>
                <span className="how__index mono">{stage.index}</span>
                <span className="how__label">{stage.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
