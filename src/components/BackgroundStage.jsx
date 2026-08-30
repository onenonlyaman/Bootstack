import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';
import './BackgroundStage.css';

/**
 * A single fixed colour plane behind the whole document.
 *
 * Every section declares the ground it wants with `data-bg="ink|navy|mist|yellow"`.
 * As the page scrolls, this plane tweens between those grounds, so the site reads
 * as one continuous surface that changes state rather than a stack of coloured
 * rectangles. Sections themselves stay transparent.
 */

const GROUNDS = {
  white: '#ffffff',
  mist: '#eef6f7',
  cyan: '#dceef2',
  cyandeep: '#cbe6ed',
  yellow: '#f7aa00',
};

export default function BackgroundStage() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const sections = gsap.utils.toArray('[data-bg]');
    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const color = GROUNDS[section.dataset.bg] || GROUNDS.ink;

        const setColor = () =>
          gsap.to(stage, {
            backgroundColor: color,
            duration: 0.65,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });

        ScrollTrigger.create({
          trigger: section,
          start: 'top 52%',
          end: 'bottom 52%',
          onEnter: setColor,
          onEnterBack: setColor,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return <div ref={stageRef} className="stage" aria-hidden="true" />;
}
