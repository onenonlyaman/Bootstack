import { useEffect, useRef } from "react";
import WorkVisual from "../components/WorkVisual.jsx";
import { gsap, ScrollTrigger } from "../lib/motion";
import { useIsDesktop, useReducedMotion } from "../hooks/useMediaQuery";
import { work } from "../data/work";
import "./SelectedWork.css";

/**
 * Section 07 — Selected Work.
 *
 * The same three records from `data/work.js`, told as a journey rather than a
 * grid: each project is a chapter of its own. Its artwork opens out of a
 * clipped window, its details rise beside it, and as the next project arrives
 * it slides over the one before, which steps back and settles.
 *
 * Desktop stacks the chapters with CSS sticky (no pin, so nothing is taken out
 * of the page flow) and scrubs the reveals and the hand-over with GSAP. Below
 * 1024px the chapters run one after another with the same reveals. Nothing in
 * the data changed, so a real case study still drops straight in.
 */
export default function SelectedWork() {
  const rootRef = useRef(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;

    const chapters = gsap.utils.toArray(".work__chapter", root);

    const ctx = gsap.context(() => {
      chapters.forEach((chapter, i) => {
        const panel = chapter.querySelector(".work__panel");
        const art = chapter.querySelector(".work__art");
        const media = chapter.querySelector(".work__art-media");
        const rises = chapter.querySelectorAll(".work__rise");

        // The artwork opens out of a clipped window and settles into scale.
        gsap.fromTo(
          art,
          { clipPath: "inset(16% 12% 16% 12% round 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 88%", end: "top 30%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          media,
          { scale: 1.28 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: chapter, start: "top 88%", end: "top 20%", scrub: 0.6 },
          },
        );

        // The project's details rise one after another beside it.
        gsap.fromTo(
          rises,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: chapter, start: "top 78%", end: "top 32%", scrub: 0.6 },
          },
        );

        // The hand-over: as the next project slides over, this one steps back
        // under a light veil. The panel itself stays opaque, so nothing from the
        // chapter behind can show through the one in front.
        const next = chapters[i + 1];
        if (next && isDesktop) {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: next, start: "top 70%", end: "top 14%", scrub: 0.6 },
            })
            .to(panel, { scale: 0.93, yPercent: -2 }, 0)
            .to(chapter.querySelector(".work__veil"), { opacity: 0.6 }, 0);
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef} id="work" className={`work band${isDesktop && !reduced ? " work--reel" : ""}`} data-bg="white">
      <div className="shell">
        <div className="work__head">
          <span className="work__eyebrow mono" data-reveal>
            <b>07</b> / Featured Work
          </span>

          <h2
            className="work__heading display section-gradient-heading"
            data-reveal
            style={{ "--reveal-delay": "60ms" }}
          >
            Selected Work.
          </h2>

          <p
            className="work__description"
            data-reveal
            style={{ "--reveal-delay": "120ms" }}
          >
            Bootstack is just getting started. Every project here will be a
            real, measurable growth story.
          </p>
        </div>

        <ol className="work__reel">
          {work.map((item, i) => (
            <li
              key={item.id}
              className={`work__chapter work__chapter--${item.tone}${i % 2 ? " work__chapter--flip" : ""}`}
              style={{ "--i": i }}
            >
              <article className="work__panel">
                <div className="work__art">
                  <div className="work__art-media">
                    <WorkVisual art={item.art} />
                  </div>

                  <span className="work__idx mono">{item.index}</span>
                </div>

                <div className="work__body">
                  <span className="work__num display work__rise" aria-hidden="true">
                    {item.index}
                  </span>

                  <span className="work__industry mono work__rise">{item.industry}</span>

                  <h3 className="work__client display work__rise">{item.client}</h3>

                  <p className="work__summary work__rise">{item.summary}</p>

                  <ul className="work__scope work__rise">
                    {item.scope.map((s) => (
                      <li key={s} className="mono">
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="work__outcome work__rise">
                    <span className="work__value display">{item.outcome.value}</span>
                    <span className="work__label">{item.outcome.label}</span>
                  </div>
                </div>

                <span className="work__veil" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
