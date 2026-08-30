import SectionMarker from '../components/SectionMarker.jsx';
import { testimonials } from '../data/approach';
import './Voices.css';

const [lead, ...rest] = testimonials;

/**
 * Section 05 — social proof set as an editorial spread. The first quote carries
 * the section at display size; the other two sit beneath it as supporting
 * columns. No carousel, nothing hidden behind a control.
 */
export default function Voices() {
  return (
    <section className="voices band" data-bg="mist">
      <div className="shell">
        <SectionMarker index="05" title="On the record" note="Client quotes land here as engagements complete" />

        <figure className="voices__lead" data-reveal>
          <span className="voices__quote-mark display" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="voices__lead-text display">{lead.quote}</blockquote>
          <figcaption className="voices__meta">
            <span className="voices__name">{lead.name}</span>
            <span className="voices__role mono">
              {lead.role}, {lead.company}
            </span>
            <span className="voices__industry mono">{lead.industry}</span>
          </figcaption>
        </figure>

        <div className="voices__pair">
          {rest.map((item, i) => (
            <figure
              className="voices__item"
              key={item.id}
              data-reveal
              style={{ '--reveal-delay': `${i * 90}ms` }}
            >
              <blockquote className="voices__text">{item.quote}</blockquote>
              <figcaption className="voices__meta">
                <span className="voices__name">{item.name}</span>
                <span className="voices__role mono">
                  {item.role}, {item.company}
                </span>
                <span className="voices__industry mono">{item.industry}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
