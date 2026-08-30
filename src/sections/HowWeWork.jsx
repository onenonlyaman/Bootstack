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
    const fill = root.querySelector(".how__line-fill");
    if (!steps.length || !marker || !fill) return undefined;

    const last = steps.length - 1;

    // Classes are toggled imperatively rather than rendered: useReveal adds
    // `is-in` to these same cards with classList.add(), and a React-owned
    // className would wipe it on the next render.
    const light = (index) =>
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === index);
        step.classList.toggle("is-done", i < index);
      });

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          wide: "(min-width: 700px) and (prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 699px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { wide, reduced } = context.conditions;

          if (reduced) {
            // The run is already complete: every stage reads as done, and
            // nothing moves.
            gsap.set(fill, { scaleX: 1, scaleY: 1 });
            gsap.set(marker, { xPercent: 100, yPercent: 0 });
            steps.forEach((step) => step.classList.add("is-done"));
            return undefined;
          }

          // The marker is a wrapper spanning the whole line, so a percentage
          // translate lands exactly on a stage on either axis — no pixel maths
          // to redo on resize.
          const axis = wide ? "xPercent" : "yPercent";
          const scaleAxis = wide ? "scaleX" : "scaleY";

          gsap.set(marker, { xPercent: 0, yPercent: 0 });
          gsap.set(fill, { scaleX: wide ? 0 : 1, scaleY: wide ? 1 : 0 });
          light(0);

          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.9,
            paused: true,
            onRepeat: () => light(0),
          });

          tl.to({}, { duration: 0.9 });

          for (let i = 1; i <= last; i += 1) {
            const progress = i / last;
            tl.to(marker, {
              [axis]: progress * 100,
              duration: 0.75,
              ease: "power2.inOut",
            })
              .to(
                fill,
                { [scaleAxis]: progress, duration: 0.75, ease: "power2.inOut" },
                "<",
              )
              .call(light, [i], ">-0.14")
              .to({}, { duration: 0.9 });
          }

          // Rewind quietly so the loop does not snap back.
          tl.to(marker, { [axis]: 0, duration: 0.55, ease: "power2.inOut" }).to(
            fill,
            { [scaleAxis]: 0, duration: 0.55, ease: "power2.inOut" },
            "<",
          );

          // Only runs while it is being looked at.
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 82%",
            end: "bottom 18%",
            onEnter: () => tl.play(),
            onEnterBack: () => tl.play(),
            onLeave: () => tl.pause(),
            onLeaveBack: () => tl.pause(),
          });

          return () => {
            trigger.kill();
            tl.kill();
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
