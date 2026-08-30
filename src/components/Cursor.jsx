import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './Cursor.css';

/**
 * Desktop pointer. A hard dot tracks exactly; a soft ring trails behind it and
 * swells over anything carrying `data-cursor` — with that attribute's value used
 * as the ring label ("view", "drag", …).
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    if (!canHover) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

    const onMove = (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      dx(event.clientX);
      dy(event.clientY);
    };

    const onOver = (event) => {
      const target = event.target.closest('[data-cursor], a, button');
      if (!target) {
        setLabel('');
        ring.classList.remove('is-active');
        return;
      }
      setLabel(target.dataset.cursor || '');
      ring.classList.add('is-active');
      ring.classList.toggle('is-labelled', Boolean(target.dataset.cursor));
    };

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, [canHover]);

  if (!canHover) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span className="mono">{label}</span>
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
