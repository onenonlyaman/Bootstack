import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
   * Use the existing capability data for the visual system.
   *
   * This means if you change:
   *
   * capabilities[0]
   * capabilities[1]
   * ...
   *
   * the visual nodes automatically follow the same service data.
   *
   * We use a maximum of six nodes because the visual is designed
   * around six territories.
   */
  const visualCapabilities = capabilities.slice(0, 6);

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
              LEFT SIDE
              ---------------------------------------------------- */}

          <div className="cap__head">
            <h2
              className="display display--xl section-gradient-heading"
              data-reveal
            >
              Everything a business needs to be seen, believed
              and bought kept under one roof.
            </h2>
          </div>


          {/* ----------------------------------------------------
              RIGHT SIDE
              ---------------------------------------------------- */}

          <div
            className="cap__visual"
            aria-label="Bootstack service ecosystem"
          >

            {/* ==================================================
                CONNECTING LINES
                ================================================== */}

            <svg
              className="cap__connections"
              viewBox="0 0 600 420"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* 01 → centre */}
              <path
                d="M 80 75 C 180 75, 210 170, 300 210"
              />

              {/* 02 → centre */}
              <path
                d="M 300 75 C 300 130, 300 160, 300 210"
              />

              {/* 03 → centre */}
              <path
                d="M 520 75 C 420 75, 390 170, 300 210"
              />

              {/* centre → 04 */}
              <path
                d="M 300 210 C 210 250, 180 345, 80 345"
              />

              {/* centre → 05 */}
              <path
                d="M 300 210 C 300 270, 300 300, 300 345"
              />

              {/* centre → 06 */}
              <path
                d="M 300 210 C 390 250, 420 345, 520 345"
              />
            </svg>


            {/* ==================================================
                CENTRE NODE
                ================================================== */}

            <div className="cap__center">
              <span className="mono">
                BOOTSTACK
              </span>

              <strong>
                One roof<span></span>
              </strong>
            </div>


            {/* ==================================================
                SIX SERVICE NODES
                ================================================== */}

            {visualCapabilities.map((item, i) => (
              <Link
                key={item.id}
                to={`/services/${item.id}`}
                className={`cap__node cap__node--${i + 1}`}
                aria-label={`Explore ${item.title}`}
              >
                <span className="cap__node-index mono">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="cap__node-title">
                  {getVisualTitle(item.title)}
                </span>

                <span
                  className="cap__node-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            ))}

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


/* ==============================================================
   VISUAL NODE TITLES
   ==============================================================

   The visual is intentionally shorter than the actual service
   names.

   Example:

   "Branding & UI/UX"       → "Branding"
   "Website Development"    → "Websites"
   "Performance Marketing"  → "Marketing"
   "Software Development"   → "Software"
   "Marketing Automation"   → "Automation"

   If your capability title is already short, it simply uses
   the original title.
   ============================================================== */

function getVisualTitle(title = "") {
  const value = title.toLowerCase();

  if (
    value.includes("branding") ||
    value.includes("ui/ux")
  ) {
    return "Branding";
  }

  if (
    value.includes("website") ||
    value.includes("web development")
  ) {
    return "Websites";
  }

  if (
    value.includes("performance") ||
    value.includes("marketing")
  ) {
    return "Marketing";
  }

  if (
    value.includes("software") ||
    value.includes("app development")
  ) {
    return "Software";
  }

  if (
    value.includes("automation")
  ) {
    return "Automation";
  }

  if (
    value.includes("content")
  ) {
    return "Content";
  }

  return title;
}