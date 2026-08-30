import { useState } from "react";
import { faqs } from "../data/faq";
import "./Faq.css";

/**
 * FAQs — an accordion, one panel open at a time, closed to begin with.
 *
 * The open state is carried on a `data-open` attribute rather than in the
 * className: useReveal adds `is-in` to these same rows with classList.add(), and
 * a React-owned className would rewrite it on every toggle and drop the row back
 * to [data-reveal]'s opacity: 0. Same reason Section 03 does it this way.
 *
 * The expand itself is the site's existing accordion mechanism — a grid row
 * animating 0fr to 1fr — so it opens exactly like the capabilities rows.
 */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((current) => (current === i ? null : i));

  return (
    <section id="faq" className="faq band" data-bg="cyan">
      <div className="shell faq__inner">
        <h2 className="faq__heading display display--xl section-gradient-heading" data-reveal>
          FAQs
        </h2>

        <ul className="faq__list">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                className="faq__item"
                key={item.id}
                data-open={isOpen}
                data-reveal
                style={{ "--reveal-delay": `${Math.min(i, 5) * 55}ms` }}
              >
                <h3 className="faq__q">
                  <button
                    type="button"
                    className="faq__question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    id={`faq-button-${item.id}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="faq__text">{item.question}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <i className="faq__bar" />
                      <i className="faq__bar faq__bar--v" />
                    </span>
                  </button>
                </h3>

                <div
                  className="faq__answer"
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-button-${item.id}`}
                >
                  <div className="faq__answer-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
