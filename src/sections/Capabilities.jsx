import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/motion";
import SectionMarker from "../components/SectionMarker.jsx";
import { capabilities } from "../data/capabilities";
import { useIsDesktop } from "../hooks/useMediaQuery";
import "./Capabilities.css";

/**
 * Section 03 — What Bootstack does.
 *
 * Desktop:
 * - Left: main positioning statement
 * - Right: connected service ecosystem
 * - Bottom: full service index
 *
 * Mobile:
 * - Statement stacks above the visual
 * - Visual remains compact
 * - Service list stays underneath
 */
export default function Capabilities() {
  const isDesktop = useIsDesktop();

  // Returning from /services/:slug should land on the service
  // that was previously opened.
  const [active, setActive] = useState(() => {
    try {
      const from = sessionStorage.getItem("bootstack:from-service");
      const i = from
        ? capabilities.findIndex((c) => c.id === from)
        : -1;

      return i === -1 ? 0 : i;
    } catch {
      return 0;
    }
  });

  const listRef = useRef(null);

  // Which discipline row is lit. -1 is the resting state; on a pointer device
  // hover claims it, and on scroll the ScrollTrigger below walks it down the
  // stack so a touch device sees the same relationship being drawn.

  // The service index and the discipline rows are the same eight records, so
  // the chips read their titles from here rather than restating them.


  /*
   * Keep the active row in sync with the rendered list.
   *
   * useReveal also adds `is-in` to these rows, so we intentionally
   * toggle `is-open` imperatively instead of putting it directly
   * inside React's className.
   */
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll(".cap__row");

    rows?.forEach((row, i) => {
      row.classList.toggle("is-open", i === active);
    });
  }, [active]);

  /*
   * The stack assembles as it is read: each discipline row draws its rail and
   * claims the lit state as it crosses the reading line, and hands it back on
   * the way up. Scoped to a gsap.context so every trigger is reverted with the
   * component — the same pattern the other sections use.
   */


  return (
    <section
      id="capabilities"
      className="cap band"
      data-bg="white"
    >
      <div className="shell">

        {/* ======================================================
            SECTION MARKER
            ====================================================== */}

        <SectionMarker
          index="03"
          title="What Bootstack does"
        />


        {/* ======================================================
            INTRO + CONNECTED SERVICE SYSTEM
            ====================================================== */}

        <div className="cap__intro">

          {/* ----------------------------------------------------
              STATEMENT
              ---------------------------------------------------- */}

          <div className="cap__head">
            <h2
              className="display display--xl section-gradient-heading"
              data-reveal
            >
              Everything a business needs to be seen, believed
              and bought kept under one roof.
            </h2>

            <p className="cap__lede body" data-reveal>
              Five disciplines, one team. Each one carries its own services, and
              the same people run all of them so the brand, the build and
              the campaign are never three different conversations.
            </p>
          </div>

          </div>




        {/* ======================================================
            SERVICE INDEX
            ====================================================== */}

        <div
          className="cap__list"
          ref={listRef}
          onMouseLeave={() =>
            isDesktop && setActive(-1)
          }
        >

          {capabilities.map((item, i) => (
            <article
              key={item.id}
              className={`cap__row cap__row--${item.tone}`}
              onMouseEnter={() =>
                isDesktop && setActive(i)
              }
              data-reveal
              style={{
                "--reveal-delay": `${i * 55}ms`,
              }}
            >

              {/* ==================================================
                  COMPLETE SERVICE ROW
                  ================================================== */}

              <Link
                className="cap__link"
                to={`/services/${item.id}`}
                aria-label={`${item.title} — open service`}
                onFocus={() => setActive(i)}
              >

                {/* ------------------------------------------------
                    MAIN TRIGGER
                    ------------------------------------------------ */}

                <span className="cap__trigger">

                  <span className="cap__index mono">
                    {item.index}
                  </span>

                  <span className="cap__title display">
                    {item.title}
                  </span>

                  <span className="cap__verb">
                    {item.verb}
                  </span>

                </span>


                {/* ------------------------------------------------
                    EXPLORE
                    ------------------------------------------------ */}

                <span className="cap__explore mono">
                  <span>
                    Explore
                  </span>

                  <span aria-hidden="true">
                    &rarr;
                  </span>
                </span>


                {/* ------------------------------------------------
                    EXPANDED PANEL
                    ------------------------------------------------ */}

                <span className="cap__panel">

                  <span className="cap__panel-inner">

                    <span className="cap__blurb">
                      {item.blurb}
                    </span>


                    <span className="cap__items">

                      {item.items.map((sub) => (
                        <span
                          className="cap__item"
                          key={sub}
                        >
                          <span className="mono">
                            {sub}
                          </span>
                        </span>
                      ))}

                    </span>

                  </span>

                </span>

              </Link>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}
