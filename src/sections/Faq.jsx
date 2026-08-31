import { useState } from "react";
import { faqs } from "../data/faq";
import "./Faq.css";

/**
 * FAQs — an accordion, one panel open at a time, closed to begin with.
 */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((current) => (current === i ? null : i));

  return (
    <section id="faq" className="faq band" data-bg="cyan">
      <div className="shell faq__inner">
        {/* FAQ HEADING */}
        <div className="faq__heading-wrap" data-reveal>
          <span className="faq__eyebrow mono">Frequently Asked Questions</span>

          <h2 className="faq__heading display display--xl section-gradient-heading">
            FAQs
          </h2>
        </div>

        {/* FAQ ACCORDION */}
        <ul className="faq__list">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <li
                className="faq__item"
                key={item.id}
                data-open={isOpen}
                data-reveal
                style={{
                  "--reveal-delay": `${Math.min(i, 5) * 55}ms`,
                }}
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
