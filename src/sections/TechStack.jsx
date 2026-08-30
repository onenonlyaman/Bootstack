import SectionMarker from '../components/SectionMarker.jsx';
import Marquee from '../components/Marquee.jsx';
import './TechStack.css';

/**
 * The technology flow. Every label below is one of the sixteen technologies the
 * studio builds on, split across two rows that run against each other.
 *
 * The Marquee lays its track out as [copy][copy] and slides it exactly -50% --
 * one whole copy -- so the loop closes on itself with no jump. That only reads
 * as continuous while a single copy is at least as wide as the viewport, so each
 * row is handed to it pre-repeated: eight labels alone measure ~2000px and would
 * trail blank ground on any desktop, three passes measure ~6000px and clear 4K.
 * Durations are scaled with the track so the pace stays ~50px/s.
 */
const FLOW_TOP = [
  'React',
  'Node.js',
  'PostgreSQL',
  'AWS',
  'Docker',
  'GraphQL',
  'Express.js',
  'MongoDB',
];

const FLOW_BOTTOM = [
  'Cloudflare',
  'Firebase',
  'Supabase',
  'Next.js',
  'TypeScript',
  'REST APIs',
  'Tailwind CSS',
  'GitHub',
];

/** Three passes of a row, so one copy of the Marquee's track outruns any viewport. */
const runs = (row) => [...row, ...row, ...row];

/**
 * Section 07 — the technology side, stated as a claim and then carried across
 * the full width by two counter-running tickers. Bootstack is the studio that
 * also builds the plumbing.
 */
export default function TechStack() {
  return (
    <section className="tech band" data-bg="white">
      <div className="shell">
        <SectionMarker index="07" title="Our Technology Stack" note="Engineering core" />

        <div className="tech__lede">
          <h2 className="display display--xl section-gradient-heading" data-reveal>
  <span className="techstack__first-line">
    Our Technology Stack.
  </span>
  <br />
  Modern Frameworks. Infinite
  <br />
  Scale.
</h2>
          <p className="body" data-reveal style={{ '--reveal-delay': '80ms' }}>
            We code using languages designed for absolute security, rapid speed and dynamic
            animations. No visual website builder constraints,  which is why our marketing
            and our engineering never blame each other.
          </p>
        </div>
      </div>

      <div className="tech__flow">
        {/* Top row reads left → right: the track runs -50% → 0%. */}
        <Marquee items={runs(FLOW_TOP)} size="md" speed={126} reverse />
        {/* Bottom row reads right → left: the track runs 0% → -50%. */}
        <Marquee items={runs(FLOW_BOTTOM)} size="md" speed={144} />
      </div>
    </section>
  );
}
