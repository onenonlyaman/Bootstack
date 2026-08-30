import SectionMarker from '../components/SectionMarker.jsx';
import Counter from '../components/Counter.jsx';
import { impact } from '../data/approach';
import './Impact.css';

/**
 * Section 09 — Results, written as a ledger rather than a dashboard.
 * Values are placeholders; the shape matches what an API would return.
 */
export default function Impact() {
  return (
    <section className="impact band" data-bg="yellow">
      <div className="shell">
        <SectionMarker index="09" title="By the numbers" note="Capability, not claims — client results land here as engagements complete" />

        <h2 className="impact__title display display--xl" data-reveal>
          What we bring to the table.
        </h2>

        <ol className="impact__ledger">
          {impact.map((row, i) => (
            <li className="impact__row" key={row.label} data-reveal style={{ '--reveal-delay': `${i * 60}ms` }}>
              <span className="impact__value display">
                <Counter value={row.value} suffix={row.suffix} />
              </span>
              <span className="impact__label">{row.label}</span>
              <span className="impact__note">{row.note}</span>
            </li>
          ))}
        </ol>

        <p className="impact__foot mono" data-reveal>
          Client outcome figures get published here as engagements complete.
        </p>
      </div>
    </section>
  );
}
