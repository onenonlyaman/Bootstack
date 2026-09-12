import WorkVisual from "../components/WorkVisual.jsx";
import { work } from "../data/work";
import "./SelectedWork.css";

/**
 * Section 06 — Selected Work.
 *
 * A full-width run of open slots: generated artwork over the brief, the scope
 * it would cover and the slot's status. The card grid and its staggered reveal
 * are the flow the previous site used for Featured Work; the artwork, mono
 * labels and rules are this site's own language.
 *
 * It replaces a sticky gallery in which each study reserved a full screen —
 * three screens of height, most of it empty, for three placeholders that have
 * no case study to tell yet. Nothing in `data/work.js` was changed: the same
 * three records drive the same copy, so a real study drops straight in.
 */
export default function SelectedWork() {
  return (
    <section id="work" className="work band" data-bg="white">
      <div className="shell">
        <div className="work__head">
          <span className="work__eyebrow mono" data-reveal>
            Featured Work
          </span>

          <h2
            className="work__heading display section-gradient-heading"
            data-reveal
            style={{ "--reveal-delay": "60ms" }}
          >
            Selected Work.
          </h2>

          <p
            className="work__description"
            data-reveal
            style={{ "--reveal-delay": "120ms" }}
          >
            Bootstack is just getting started. Every project here will be a
            real, measurable growth story.
          </p>
        </div>

        <ol className="work__grid">
          {work.map((item, i) => (
            <li
              key={item.id}
              className={`work__card work__card--${item.tone}`}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` }}
            >
              <div className="work__art">
                <WorkVisual art={item.art} />

                <span className="work__idx mono">{item.index}</span>
              </div>

              <div className="work__body">
                <span className="work__industry mono">{item.industry}</span>

                <h3 className="work__client display">{item.client}</h3>

                <p className="work__summary">{item.summary}</p>

                <ul className="work__scope">
                  {item.scope.map((s) => (
                    <li key={s} className="mono">
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="work__outcome">
                  <span className="work__value display">
                    {item.outcome.value}
                  </span>
                  <span className="work__label">{item.outcome.label}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
