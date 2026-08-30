import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './MagneticButton.css';

/**
 * A CTA that leans toward the pointer. `variant` picks the fill:
 * solid (yellow), ghost (outlined) or bare (underlined text link).
 */
export default function MagneticButton({
  as: Tag = 'a',
  href,
  children,
  variant = 'solid',
  strength = 0.32,
  ...rest
}) {
  const ref = useRef(null);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover) return undefined;

    const label = el.querySelector('.mag__label');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const lx = gsap.quickTo(label, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    const ly = gsap.quickTo(label, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' });

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      xTo(x * strength);
      yTo(y * strength);
      lx(x * strength * 0.4);
      ly(y * strength * 0.4);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      lx(0);
      ly(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [canHover, strength]);

  return (
    <Tag ref={ref} href={href} className={`mag mag--${variant}`} {...rest}>
      <span className="mag__label">
        <span className="mag__text">{children}</span>
        <span className="mag__arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path
              d="M2 14 L14 2 M6 2 h8 v8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </span>
      </span>
    </Tag>
  );
}
