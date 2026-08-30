import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';
import SectionMarker from '../components/SectionMarker.jsx';
import WorkVisual from '../components/WorkVisual.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import { work } from '../data/work';
import { useIsDesktop } from '../hooks/useMediaQuery';
import './SelectedWork.css';

/**
 * Section 06 — Selected Work.
 *
 * On desktop the artwork column holds still while the case studies move past
 * it, swapping underneath: the visuals feel like one continuous surface rather
 * than five separate cards. On smaller screens each study becomes a full-bleed
 * block with its own visual.
 */
export default function SelectedWork() {
  const rootRef = useRef(null);
  const isDesktop = useIsDesktop();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isDesktop) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.work__study').forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 62%',
          end: 'bottom 62%',
          onEnter: () => setCurrent(i),
          onEnterBack: () => setCurrent(i),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section ref={rootRef} id="work" className="work band" data-bg="white">
      <div className="shell">
        <SectionMarker index="06" title="Selected Work" />

        <div className="work__head">
          <h2 className="display display--xxl section-gradient-heading" data-reveal>
            Selected
            <br />
            <span className="work__head-accent">Work</span>
          </h2>
          <p className="body" data-reveal style={{ '--reveal-delay': '80ms' }}>
            Bootstack is just getting started. Every project on this page will be a real,
            measurable growth story written up only once the numbers exist.
          </p>
        </div>
      </div>

      <div className="work__body shell">
        {isDesktop && (
          <div className="work__viewport" aria-hidden="true">
            <div className="work__frame">
              {work.map((item, i) => (
                <div
                  key={item.id}
                  className={`work__art${current === i ? ' is-current' : ''}`}
                >
                  <WorkVisual art={item.art} />
                </div>
              ))}

              <div className="work__counter mono">
                <span className="work__counter-now">{work[current]?.index}</span>
                <span className="work__counter-sep" />
                <span>{String(work.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        )}

        <ol className="work__studies">
          {work.map((item) => (
            <li key={item.id} className={`work__study work__study--${item.tone}`}>
              {!isDesktop && (
                <div className="work__art-inline">
                  <WorkVisual art={item.art} />
                </div>
              )}

              <div className="work__meta mono" data-reveal>
                <span className="work__idx">{item.index}</span>
                <span>{item.industry}</span>
              </div>

              <h3 className="work__client display" data-reveal>
                {item.client}
              </h3>

              <ul className="work__scope" data-reveal>
                {item.scope.map((s) => (
                  <li key={s} className="mono">
                    {s}
                  </li>
                ))}
              </ul>

              <p className="work__summary lead" data-reveal>
                {item.summary}
              </p>

              <div className="work__outcome" data-reveal>
                <span className="work__value display">{item.outcome.value}</span>
                <span className="work__label">{item.outcome.label}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="shell work__foot">
      </div>
    </section>
  );
}
