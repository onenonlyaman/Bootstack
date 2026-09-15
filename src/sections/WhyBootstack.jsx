import SectionMarker from "../components/SectionMarker.jsx";
import { differences } from "../data/approach";
import "./WhyBootstack.css";

/** Section 05 — the four reasons, stated plainly and set large. */
export default function WhyBootstack() {
  return (
    <section className="why band" data-bg="cyan">
      <div className="shell why__grid">
        <div className="why__aside">
          <SectionMarker index="05" title="Why Bootstack" />
          <h2
            className="display display--xl section-gradient-heading"
            data-reveal
          >
            Four things that
            <br />
            change the outcome
          </h2>
          <p className="body" data-reveal style={{ "--reveal-delay": "80ms" }}>
            None of these are unusual claims. Very few agencies are actually set
            up to deliver all four at once.
          </p>
        </div>

        <ol className="why__list">
          {differences.map((item) => (
            <li className="why__item" key={item.index} data-reveal>
              <span className="why__num display">{item.index}</span>
              <div className="why__body">
                <h3 className="why__title display">{item.title}</h3>
                <p className="why__text">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
