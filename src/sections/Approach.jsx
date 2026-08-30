import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import SectionMarker from '../components/SectionMarker.jsx';
import { stages } from '../data/approach';
import './Approach.css';

/**
 * Section 06 — From idea to impact.
 *
 * The six stages run sideways: on desktop the section pins and the track is
 * scrubbed horizontally by vertical scroll, so the process literally travels.
 * Below 1024px it becomes an ordinary readable column.
 */
export default function Approach() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.35}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.to('.approach__progress span', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.35}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="approach band" data-bg="mist">
      <div className="approach__inner">
        <div className="shell">
          <SectionMarker index="06" title="How We Work" note="Five stages" />

          <div className="approach__head">
            <h2 className="display display--xxl" data-reveal>
              From idea
              <br />
              to <span className="accent">impact.</span>
            </h2>
            <p className="body" data-reveal style={{ '--reveal-delay': '80ms' }}>
              The same route every time, whether we are naming a company, building an ERP or
              rebuilding a funnel. It is what keeps the work honest.
            </p>
          </div>
        </div>

        <div className="approach__rail">
          <ol className="approach__track" ref={trackRef}>
            {stages.map((stage, i) => (
              <li
                className="approach__stage"
                key={stage.index}
                data-reveal
                style={{ '--reveal-delay': `${i * 60}ms` }}
              >
                <span className="approach__num display">{stage.index}</span>
                <div className="approach__stage-body">
                  <h3 className="approach__title display">{stage.title}</h3>
                  <p className="approach__line">{stage.line}</p>
                  <p className="approach__text">{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="shell">
          <div className="approach__progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
