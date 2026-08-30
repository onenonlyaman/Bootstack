import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import Marquee from '../components/Marquee.jsx';
import SectionMarker from '../components/SectionMarker.jsx';
import './BigIdea.css';

/**
 * Each statement carries its own panel copy: `text` is the large line on the
 * left, `title` and `body` are what the right-hand column shows while that line
 * is the active one. Edit the copy here — nothing is repeated in the JSX.
 */
const STATEMENT = [
  {
    text: 'ERP Solutions',
    slug: 'erp-solutions',
    title: 'ERP Solutions',
    body: 'Streamline your operations with custom ERP systems designed to manage sales, inventory, projects, finance, HR, and business workflows, all in one platform.',
  },
  {
    text: 'Mobile App Development',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    body: 'Build fast, secure, and user-friendly Android and iOS applications that deliver seamless customer experiences and support your business growth.',
  },
  {
    text: 'High-Performing Website',
    slug: 'high-performing-websites',
    title: 'High-Performing Websites',
    body: 'Create fast, responsive, and conversion-focused websites that showcase your brand, engage visitors, and generate more business.',
  },
  {
    text: 'Lead Generation',
    slug: 'lead-generation',
    title: 'Lead Generation',
    body: 'Attract high-quality leads through performance marketing, SEO, landing pages, and data-driven campaigns that turn prospects into customers.',
  },
  {
    text: 'Brand Identity & Branding',
    slug: 'brand-identity-branding',
    title: 'Brand Identity & Branding',
    body: 'Build a memorable brand with a strong identity, compelling messaging, and consistent visuals that inspire trust and leave a lasting impression.',
  },
];

const LAYERS = [
  { label: 'Brand', width: '34%' },
  { label: 'Content', width: '48%' },
  { label: 'Marketing', width: '62%' },
  { label: 'Technology', width: '78%' },
  { label: 'Automation', width: '100%' },
];

/** Section 02 — the philosophy, revealed word by word as the page moves. */
export default function BigIdea() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each line owns a trigger that claims the right-hand panel as it passes
      // the reading line — the same pattern Selected Work uses. Created before
      // the reduced-motion branch so the panel still tracks without animation.
      gsap.utils.toArray('.idea__line').forEach((line, i) => {
        ScrollTrigger.create({
          trigger: line,
          start: 'top 62%',
          end: 'bottom 62%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      if (prefersReducedMotion()) {
        gsap.set('.idea__line-inner', { opacity: 1 });
        gsap.set('.idea__layer span', { scaleX: 1 });
        return;
      }

      // The gradient sits on .idea__line-inner so each name gets its own
      // blue-to-cyan sweep; that element therefore has to be the one that
      // fades, because a word with a transparent fill has nothing to fade.
      gsap.to('.idea__line-inner', {
        opacity: 1,
        duration: 1,
        ease: 'none',
        stagger: 1,
        scrollTrigger: {
          trigger: '.idea__statement',
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      });

      gsap.to('.idea__layer span', {
        scaleX: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.idea__stack', start: 'top 82%' },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // The panel content is already swapped by React; this just settles it in.
  useEffect(() => {
    if (!panelRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', overwrite: true },
    );
  }, [active]);

  return (
    <section ref={rootRef} id="idea" className="idea band" data-bg="mist">
      <div className="idea__seam">
        <Marquee
          items={['Brand', 'System', 'Growth']}
          size="lg"
          speed={30}
        />
      </div>

      <div className="shell">
        <SectionMarker index="02" title="What We Build" />

        <div className="idea__grid">
          <h2 className="idea__statement display display--xxl">
            {STATEMENT.map((line, index) => (
              <Link
                className={`idea__line${index === active ? ' is-active' : ''}${
                  index === hovered ? ' is-hovered' : ''
                }`}
                key={line.text}
                to={`/services/${line.slug}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(-1)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(-1)}
              >
                <span className="idea__line-inner">
                  {line.text.split(' ').map((word, i) => (
                    <span className="idea__word" key={`${word}-${i}`}>
                      {word}{' '}
                    </span>
                  ))}
                  <span className="idea__explore mono" aria-hidden="true">
                    Explore &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </h2>

          <div className="idea__aside">
            <div className="idea__service" ref={panelRef} aria-live="polite">
              <span className="idea__service-title mono">{STATEMENT[active].title}</span>
              <p className="body">{STATEMENT[active].body}</p>
            </div>

            <div className="idea__stack" aria-label="The Bootstack layers">
              {LAYERS.map((layer, i) => (
                <div className="idea__layer" key={layer.label}>
                  <span style={{ '--w': layer.width, '--i': i }} aria-hidden="true" />
                  <em className="mono">{layer.label}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
