import { useEffect } from 'react';
import { gsap, ScrollTrigger, clamp, prefersReducedMotion } from '../lib/motion';

/**
 * Gives the page a little give. Elements marked `data-flex` skew slightly with
 * scroll velocity and spring back when it settles — the difference between a
 * page that slides and a page that feels like it has weight.
 */
export function useScrollFlex(enabled = true) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return undefined;

    const targets = gsap.utils.toArray('[data-flex]');
    if (!targets.length) return undefined;

    const setters = targets.map((el) => ({
      skew: gsap.quickTo(el, 'skewY', { duration: 0.75, ease: 'power3' }),
      scale: gsap.quickTo(el, 'scaleY', { duration: 0.75, ease: 'power3' }),
    }));

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const v = clamp(self.getVelocity() / 260, -5, 5);
        setters.forEach(({ skew, scale }) => {
          skew(v * 0.55);
          scale(1 + Math.abs(v) * 0.006);
        });
      },
    });

    return () => {
      trigger.kill();
      setters.forEach(({ skew, scale }) => {
        skew(0);
        scale(1);
      });
    };
  }, [enabled]);
}
