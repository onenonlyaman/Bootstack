import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import SectionMarker from '../components/SectionMarker.jsx';
import { growthChain } from '../data/capabilities';
import './GrowthEngine.css';

const COUNT = growthChain.length;

/** Node coordinates in a 0–100 viewBox: a staircase climbing left to right. */
const point = (i) => ({
  x: 6 + (i * 88) / (COUNT - 1),
  y: 84 - (i * 66) / (COUNT - 1),
});

const PATH = growthChain
  .map((_, i) => {
    const { x, y } = point(i);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  })
  .join(' ');

/**
 * Section 04 — the capabilities are not a menu, they are a sequence. The spine
 * draws itself as the pinned section is scrubbed and each stage lands on it.
 */
export default function GrowthEngine() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, reduced } = context.conditions;

          if (reduced) {
            // Note: never tween transforms on .engine__node — its translateX(-50%)
            // is layout, not decoration, and GSAP would bake it to pixels.
            gsap.set('.engine__node', { opacity: 1 });
            gsap.set('.engine__stage', { opacity: 1, y: 0 });
            gsap.set('.engine__path', { strokeDashoffset: 0 });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: desktop ? 'top top' : 'top 72%',
              end: desktop ? '+=140%' : 'bottom 60%',
              scrub: 0.7,
              pin: desktop,
              anticipatePin: 1,
            },
          });

          tl.to('.engine__path', { strokeDashoffset: 0, ease: 'none', duration: COUNT })
            .to(
              '.engine__node',
              { opacity: 1, ease: 'power2.out', stagger: 1, duration: 0.6 },
              0.25,
            )
            .to(
              '.engine__stage',
              { opacity: 1, y: 0, ease: 'power2.out', stagger: 1, duration: 0.6 },
              0.35,
            );
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="engine band" data-bg="cyan">
      <div className="shell engine__shell">
        <SectionMarker index="04" title="How it fits together" note="One partner, multiple engines" />

        <div className="engine__head">
          <h2 className="display display--xxl" data-reveal>
            One partner.
            <br />
            <span className="accent">Multiple growth engines.</span>
          </h2>
          <p className="body" data-reveal style={{ '--reveal-delay': '90ms' }}>
            Nothing here operates in isolation. Each stage hands something specific to the
            next, which is why the results compound instead of resetting every quarter.
          </p>
        </div>

        <div className="engine__chart">
          <svg
            className="engine__svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="engine__ghost" d={PATH} pathLength="100" />
            <path className="engine__path" d={PATH} pathLength="100" />
          </svg>

          <ol className="engine__nodes">
            {growthChain.map((stage, i) => {
              const { x, y } = point(i);
              const last = i === COUNT - 1;
              return (
                <li
                  key={stage.id}
                  className={`engine__node${last ? ' engine__node--last' : ''}`}
                  style={{ '--x': `${x}%`, '--y': `${y}%`, '--i': i }}
                >
                  <span className="engine__dot" aria-hidden="true" />
                  <div className="engine__stage">
                    <span className="engine__num mono">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="engine__label">{stage.label}</h3>
                    <p className="engine__note">{stage.note}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
