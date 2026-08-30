import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import './Loader.css';

/**
 * A short opening beat: three brand bars stack up while a counter runs, then the
 * whole plate lifts away. Deliberately under two seconds — it should feel like a
 * curtain, not a wait.
 */
export default function Loader({ onDone }) {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const doneRef = useRef(onDone);
  const [gone, setGone] = useState(false);

  doneRef.current = onDone;

  useEffect(() => {
    const finish = () => doneRef.current?.();

    if (prefersReducedMotion()) {
      setGone(true);
      finish();
      return undefined;
    }

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true);
          finish();
        },
      });

      tl.to(counter, {
        value: 100,
        duration: 1.15,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
          }
        },
      })
        .from(
          '.loader__bar span',
          { scaleX: 0, duration: 1.15, ease: 'power3.inOut', stagger: 0.09 },
          0,
        )
        .from('.loader__word', { yPercent: 110, duration: 0.9, ease: 'expo.out' }, 0.15)
        .to('.loader__inner', { opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.12')
        .to('.loader__plate', {
          yPercent: -101,
          duration: 0.95,
          ease: 'expo.inOut',
          stagger: 0.06,
        }, '<0.1');
    }, rootRef);

    // Runs exactly once — the callback is read through a ref so a re-rendered
    // parent cannot restart the opening sequence.
    return () => ctx.revert();
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading Bootstack">
      <div className="loader__plates" aria-hidden="true">
        <div className="loader__plate" />
        <div className="loader__plate" />
        <div className="loader__plate" />
      </div>

      <div className="loader__inner">
        <div className="loader__wordwrap">
          <span className="loader__word display">BOOTSTACK</span>
        </div>

        <div className="loader__bars" aria-hidden="true">
          <div className="loader__bar"><span style={{ background: 'var(--blue)' }} /></div>
          <div className="loader__bar"><span style={{ background: 'var(--cyan)' }} /></div>
          <div className="loader__bar"><span style={{ background: 'var(--yellow)' }} /></div>
        </div>

        <div className="loader__meta mono">
          <span>Bootstrapping</span>
          <span ref={countRef}>000</span>
        </div>
      </div>
    </div>
  );
}
