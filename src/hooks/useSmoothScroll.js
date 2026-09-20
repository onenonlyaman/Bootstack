import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

/**
 * Boots Lenis smooth scrolling and keeps GSAP ScrollTrigger in sync with it.
 * Skipped entirely when the visitor prefers reduced motion — native scrolling
 * stays intact and every ScrollTrigger still fires.
 */
/**
 * The live instance, so callers that need to move the page (returning from a
 * service page, for example) go through Lenis instead of fighting it with a
 * raw window.scrollTo.
 */
let current = null;

/** Scrolls to an element through Lenis, or natively when Lenis is not running. */
export function scrollToElement(target, options = {}) {
  if (!target) return;
  if (current) {
    current.scrollTo(target, { immediate: true, ...options });
    return;
  }
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY,
    behavior: 'auto',
  });
}

/**
 * Holds / releases the page's smooth scrolling. Lenis drives the window on a
 * rAF loop and swallows wheel events; while a modal owns the screen it should
 * do neither.
 */
export function setSmoothScrollPaused(paused) {
  if (!current) return;
  if (paused) current.stop();
  else current.start();
}

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    });

    current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links go through Lenis so the easing is consistent.
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (current === lenis) current = null;
    };
  }, [enabled]);
}
