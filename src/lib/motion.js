import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** True when the visitor has asked the OS to reduce motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Desktop-only breakpoint for the heavier, pinned choreography. */
export const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

/** Clamp helper used by the canvas fields. */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/** Linear interpolation. */
export const lerp = (a, b, t) => a + (b - a) * t;

export { gsap, ScrollTrigger };
