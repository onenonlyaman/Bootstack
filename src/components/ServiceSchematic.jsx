import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import "./ServiceSchematic.css";

/**
 * The service module: the hero visual on every service page.
 *
 * One frame for all eight services — a Bootstack system panel with the
 * service's file label, its board grid and its three signals along the foot —
 * and inside it a composition that shows the work itself:
 *
 *   interface     Website Development   a page rebuilding across devices
 *   architecture  Software Development  requests running a service stack
 *   device        App Development       iOS and Android builds shipping
 *   workflow      Marketing Automation  a trigger fanning out to channels
 *   funnel        Performance Marketing ad channels feeding tracked leads
 *   calendar      Social Media          a content week filling in
 *   identity      Branding & UI/UX      a mark drawn on its construction
 *   roadmap       Brand Consultation    a position found, a roadmap walked
 *
 * Every label comes from the service's data: its hero readouts and the
 * deliverables Section 04 lists for it. Positions are percentages of the board,
 * so a composition scales with its frame. Wires are hairline segments and the
 * moving signals are dots stepped along them, which keeps every line crisp.
 */

/** Which composition each service gets; unknown slugs fall back on the data's theme. */
const VARIANT_BY_SLUG = {
  "website-development": "interface",
  "software-development": "architecture",
  "app-development": "device",
  "marketing-automation": "workflow",
  "performance-marketing": "funnel",
  "social-media": "calendar",
  "branding-uiux": "identity",
  "brand-consultation": "roadmap",
};

const VARIANT_BY_THEME = {
  interface: "interface",
  system: "architecture",
  automation: "workflow",
  campaign: "funnel",
  identity: "identity",
};

const pct = (n) => `${n}%`;

/** A positioned anchor; its child can move freely without losing the centring. */
function At({ x, y, w, className = "", children }) {
  return (
    <div
      className={`kx-at${className ? ` ${className}` : ""}`}
      style={{ left: pct(x), top: pct(y), width: w != null ? pct(w) : undefined }}
    >
      {children}
    </div>
  );
}

/** Hairline wire segments: horizontal from x for w, vertical from y for h. */
const H = ({ x, y, w }) => (
  <i className="kx-seg kx-seg--h" style={{ left: pct(x), top: pct(y), width: pct(w) }} />
);
const V = ({ x, y, h }) => (
  <i className="kx-seg kx-seg--v" style={{ left: pct(x), top: pct(y), height: pct(h) }} />
);

/** A readout: value over label, optionally with a status light. */
function Read({ r, led = false }) {
  if (!r) return null;
  return (
    <span className="kx-read">
      {led ? <i className="kx-led" /> : null}
      <span className="kx-read__text">
        <b>{r.value}</b>
        <small>{r.label}</small>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

function Interface({ readouts }) {
  return (
    <>
      <div className="kx-web-stage">
        <div className="kx-web">
          <div className="kx-web__nav">
            <i className="kx-web__logo" />
            <span className="kx-web__links">
              <i />
              <i />
              <i />
            </span>
            <span className="kx-web__burger">
              <i />
              <i />
            </span>
          </div>
          <div className="kx-web__hero">
            <i className="kx-web__h1" />
            <i className="kx-web__h1 kx-web__h1--short" />
            <i className="kx-web__sub" />
            <i className="kx-web__btn" />
          </div>
          <div className="kx-web__cards">
            <i />
            <i />
            <i />
          </div>
          <i className="kx-web__foot" />
        </div>
      </div>

      <div className="kx-web-side">
        <div className="kx-devices">
          <span className="kx-device kx-device--desk is-on" />
          <span className="kx-device kx-device--tab" />
          <span className="kx-device kx-device--phone" />
        </div>
        <ul className="kx-status">
          {readouts.map((r) => (
            <li key={`${r.value}-${r.label}`}>
              <Read r={r} led />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Architecture({ readouts, items }) {
  const [api, db, secure, live] = readouts;
  const xs = [20, 50, 80];
  return (
    <>
      {xs.map((x) => (
        <V key={x} x={x} y={16} h={18} />
      ))}
      <H x={20} y={34} w={60} />
      <V x={50} y={34} h={53} />
      <H x={50} y={57.5} w={22} />

      {items.slice(0, 3).map((item, i) => (
        <At key={item} x={xs[i]} y={16} w={26}>
          <div className="kx-plate kx-plate--chip">{item}</div>
        </At>
      ))}
      <At x={50} y={48} w={40}>
        <div className="kx-plate kx-plate--row">
          <i className="kx-glyph kx-glyph--api" />
          <Read r={api} />
        </div>
      </At>
      <At x={50} y={67} w={40}>
        <div className="kx-plate kx-plate--row">
          <i className="kx-glyph kx-glyph--db" />
          <Read r={db} />
        </div>
      </At>
      <At x={84} y={57.5} w={24}>
        <div className="kx-plate kx-plate--row kx-plate--quiet">
          <i className="kx-glyph kx-glyph--lock" />
          <Read r={secure} />
        </div>
      </At>
      <At x={50} y={87} w={60}>
        <div className="kx-plate kx-plate--row kx-plate--base">
          <Read r={live} led />
        </div>
      </At>

      <i className="kx-packet" />
      <i className="kx-packet kx-packet--cyan" />
    </>
  );
}

function Device({ readouts }) {
  const [ios, android, releases, live] = readouts;
  const screen = (k) => (
    <div className={`kx-screen kx-screen--${k}`} key={k}>
      <i className="kx-screen__head" />
      {k === 0 ? (
        <>
          <i className="kx-screen__hero" />
          <i className="kx-screen__row" />
          <i className="kx-screen__row kx-screen__row--short" />
          <i className="kx-screen__row" />
        </>
      ) : k === 1 ? (
        <>
          <span className="kx-screen__bars">
            <i />
            <i />
            <i />
            <i />
          </span>
          <i className="kx-screen__row" />
          <i className="kx-screen__row kx-screen__row--short" />
        </>
      ) : (
        <>
          <span className="kx-screen__grid">
            <i />
            <i />
            <i />
            <i />
          </span>
          <i className="kx-screen__btn" />
        </>
      )}
    </div>
  );

  return (
    <>
      <H x={40} y={51} w={35} />
      <V x={75} y={19} h={64} />

      <At x={27} y={50} w={25}>
        <div className="kx-plate kx-phone">
          <i className="kx-phone__notch" />
          <div className="kx-phone__view">
            <div className="kx-phone__track">{[0, 1, 2].map(screen)}</div>
          </div>
          <span className="kx-phone__tabs">
            <i />
            <i />
            <i />
          </span>
        </div>
      </At>

      {[ios, android].map((r, i) => (
        <At key={`${r.value}-${i}`} x={75} y={i ? 38 : 19} w={36}>
          <div className="kx-plate kx-plate--build">
            <Read r={r} />
            <span className="kx-meter">
              <i />
            </span>
          </div>
        </At>
      ))}
      <At x={75} y={62} w={36}>
        <div className="kx-plate kx-plate--row">
          <Read r={releases} led />
        </div>
      </At>
      <At x={75} y={83} w={36}>
        <div className="kx-plate kx-plate--row kx-plate--base">
          <i className="kx-glyph kx-glyph--store" />
          <Read r={live} led />
        </div>
      </At>

      <i className="kx-packet" />
      <i className="kx-packet kx-packet--cyan" />
    </>
  );
}

function Workflow({ readouts, items }) {
  const [automated, crm, email, whatsapp] = readouts;
  return (
    <>
      <V x={17} y={20} h={30} />
      <H x={17} y={50} w={50} />
      <V x={67} y={27} h={46} />
      <H x={67} y={27} w={15} />
      <H x={67} y={73} w={15} />
      <V x={46} y={50} h={32} />

      <At x={17} y={20} w={26}>
        <div className="kx-plate kx-plate--chip kx-plate--trigger">{items[1]}</div>
      </At>
      <At x={17} y={50} w={26}>
        <div className="kx-plate kx-plate--row">
          <i className="kx-glyph kx-glyph--db" />
          <Read r={crm} />
        </div>
      </At>
      <At x={46} y={50} w={26}>
        <div className="kx-plate kx-plate--row kx-plate--engine">
          <i className="kx-glyph kx-glyph--gear" />
          <Read r={automated} />
        </div>
      </At>
      <At x={82} y={27} w={28}>
        <div className="kx-plate kx-plate--row">
          <i className="kx-glyph kx-glyph--mail" />
          <Read r={email} />
        </div>
      </At>
      <At x={82} y={73} w={28}>
        <div className="kx-plate kx-plate--row">
          <i className="kx-glyph kx-glyph--chat" />
          <Read r={whatsapp} />
        </div>
      </At>
      <At x={46} y={82} w={32}>
        <div className="kx-plate kx-plate--chip kx-plate--quiet">{items[4]}</div>
      </At>

      <i className="kx-packet" />
      <i className="kx-packet kx-packet--cyan" />
      <i className="kx-packet" />
    </>
  );
}

function Funnel({ readouts, items }) {
  const [meta, google, leads, live] = readouts;
  return (
    <>
      <H x={15} y={24} w={21} />
      <H x={15} y={60} w={21} />
      <V x={36} y={24} h={36} />
      <H x={36} y={42} w={48} />
      <V x={58} y={42} h={42} />

      {[meta, google].map((r, i) => (
        <At key={`${r.value}-${i}`} x={15} y={i ? 60 : 24} w={22}>
          <div className="kx-plate kx-plate--row">
            <i className={`kx-glyph kx-glyph--${i ? "search" : "social"}`} />
            <Read r={r} />
          </div>
        </At>
      ))}
      <At x={58} y={42} w={21}>
        <div className="kx-plate kx-plate--page">
          <i className="kx-page__h" />
          <i className="kx-page__l" />
          <i className="kx-page__b" />
          <span className="kx-caption">{items[2]}</span>
        </div>
      </At>
      <At x={85} y={42} w={24}>
        <div className="kx-plate kx-plate--leads">
          <span className="kx-bars">
            <i style={{ "--h": 0.3 }} />
            <i style={{ "--h": 0.45 }} />
            <i style={{ "--h": 0.4 }} />
            <i style={{ "--h": 0.62 }} />
            <i style={{ "--h": 0.78 }} />
          </span>
          <Read r={leads} />
        </div>
      </At>
      <At x={58} y={84} w={52}>
        <div className="kx-plate kx-plate--row kx-plate--base">
          <Read r={live} led />
          <span className="kx-caption kx-caption--end">{items[4]}</span>
        </div>
      </At>

      <i className="kx-packet" />
      <i className="kx-packet kx-packet--cyan" />
    </>
  );
}

/* One content week: c = content, r = reel, m = community, l = live campaign. */
const WEEK = [
  "c", "", "r", "c", "", "l", "c",
  "", "c", "r", "", "c", "m", "",
  "r", "c", "", "m", "c", "", "r",
];
const WEEK_NEW = [4, 10, 19];

function Calendar({ readouts }) {
  const types = ["c", "r", "m", "l"];
  return (
    <>
      <At x={36} y={50} w={62}>
        <div className="kx-plate kx-cal">
          <span className="kx-cal__days">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <b key={i}>{d}</b>
            ))}
          </span>
          <span className="kx-cal__grid">
            {WEEK.map((t, i) => (
              <span className="kx-cal__cell" key={i}>
                {t ? <i className={`kx-tile kx-tile--${t}`} /> : null}
                {WEEK_NEW.includes(i) ? <i className="kx-tile kx-tile--c kx-tile--new" /> : null}
              </span>
            ))}
          </span>
        </div>
      </At>

      <At x={84} y={50} w={26}>
        <ul className="kx-legend">
          {readouts.map((r, i) => (
            <li key={`${r.value}-${i}`}>
              <i className={`kx-swatch kx-swatch--${types[i]}`} />
              <Read r={r} />
            </li>
          ))}
        </ul>
      </At>
    </>
  );
}

function Identity({ readouts }) {
  const [identity, visual, guidelines, assets] = readouts;
  return (
    <>
      <H x={54} y={50} w={2} />
      <V x={56} y={22} h={56} />
      <H x={56} y={22} w={3} />
      <H x={56} y={50} w={3} />
      <H x={56} y={78} w={3} />

      <At x={30} y={50} w={46}>
        <div className="kx-plate kx-canvas">
          <svg className="kx-canvas__svg" viewBox="0 0 200 200" aria-hidden="true">
            <path className="kx-guide kx-guide--grid" d="M50 0V200M100 0V200M150 0V200M0 50H200M0 100H200M0 150H200" />
            <rect className="kx-guide kx-draw" x="36" y="36" width="128" height="128" pathLength="1" />
            <circle className="kx-guide kx-draw" cx="100" cy="100" r="64" pathLength="1" />
            <circle className="kx-guide kx-draw" cx="100" cy="100" r="36" pathLength="1" />
            <path className="kx-guide kx-draw" d="M36 36L164 164M164 36L36 164" pathLength="1" />
            <g className="kx-mark">
              <rect x="64" y="64" width="72" height="72" rx="20" />
              <circle className="kx-mark__cut" cx="100" cy="100" r="16" />
            </g>
            <rect className="kx-mark__dot" x="122" y="122" width="14" height="14" rx="2" />
          </svg>
          <Read r={identity} />
        </div>
      </At>

      <At x={78} y={22} w={36}>
        <div className="kx-plate kx-plate--stack">
          <span className="kx-swatches">
            <i />
            <i />
            <i />
            <i />
          </span>
          <Read r={visual} />
        </div>
      </At>
      <At x={78} y={50} w={36}>
        <div className="kx-plate kx-plate--stack">
          <span className="kx-specimen">
            <b>Aa</b>
            <span>Aa</span>
          </span>
          <Read r={guidelines} />
        </div>
      </At>
      <At x={78} y={78} w={36}>
        <div className="kx-plate kx-plate--stack">
          <span className="kx-thumbs">
            <i />
            <i />
            <i />
          </span>
          <Read r={assets} />
        </div>
      </At>

      <i className="kx-packet" />
    </>
  );
}

const MILES = [14, 38, 62, 86];

function Roadmap({ readouts, items }) {
  const [strategy, audience, competitors, roadmap] = readouts;
  const order = [competitors, audience, strategy, roadmap];
  return (
    <>
      <H x={14} y={80} w={72} />

      <At x={27} y={38} w={42}>
        <div className="kx-plate kx-map">
          <span className="kx-map__field">
            <i className="kx-map__axis kx-map__axis--x" />
            <i className="kx-map__axis kx-map__axis--y" />
            {[
              [22, 62],
              [34, 70],
              [28, 48],
              [44, 60],
              [60, 76],
            ].map(([x, y], i) => (
              <i className="kx-map__dot" key={i} style={{ left: pct(x), top: pct(y) }} />
            ))}
            <i className="kx-map__target" />
            <i className="kx-map__you" />
          </span>
          <span className="kx-caption">{items[2]}</span>
        </div>
      </At>

      <At x={74} y={38} w={40}>
        <div className="kx-plate kx-doc">
          <i className="kx-doc__title" />
          {[0, 1, 2].map((k) => (
            <span className="kx-doc__row" key={k}>
              <i className="kx-doc__check" />
              <i className="kx-doc__line" style={{ "--w": [0.8, 0.62, 0.72][k] }} />
            </span>
          ))}
          <span className="kx-caption">{items[3]}</span>
        </div>
      </At>

      {order.map((r, i) => (
        <At key={`${r.value}-${i}`} x={MILES[i]} y={80} className="kx-mile">
          <i className="kx-mile__node" />
          <span className="kx-mile__label">
            <Read r={r} />
          </span>
        </At>
      ))}
      <At x={14} y={80} className="kx-pin-at">
        <i className="kx-pin" />
      </At>
    </>
  );
}

const COMPOSITIONS = {
  interface: Interface,
  architecture: Architecture,
  device: Device,
  workflow: Workflow,
  funnel: Funnel,
  calendar: Calendar,
  identity: Identity,
  roadmap: Roadmap,
};

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

const SPEED = 0.02; // seconds per percent of board travelled

/** Steps a signal dot along a route of [x, y] percentages, starting at `at`. */
function travel(tl, dot, points, at) {
  if (!dot) return at;
  const run = gsap.timeline();
  run.set(dot, { left: pct(points[0][0]), top: pct(points[0][1]), autoAlpha: 1 });
  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    run.to(dot, {
      left: pct(x1),
      top: pct(y1),
      duration: Math.hypot(x1 - x0, y1 - y0) * SPEED,
      ease: "none",
    });
  }
  run.to(dot, { autoAlpha: 0, duration: 0.2 });
  tl.add(run, at);
  return at + run.duration();
}

const lightAll = (els, on = true) => els.forEach((el) => el.classList.toggle("is-on", on));

/** The assembly, once, and the ambient loop that follows it. */
function choreograph(variant, q) {
  const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.9 });
  const leds = q(".kx-led");
  const packets = q(".kx-packet");

  // Not every composition has every part; only animate what is there.
  const from = (tl, targets, vars, at) => (targets.length ? tl.from(targets, vars, at) : tl);

  from(intro, q(".kx-plate"), { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.06 }, 0);
  from(intro, q(".kx-seg--h"), { scaleX: 0, duration: 0.55, stagger: 0.04, ease: "power2.out" }, 0.25);
  from(intro, q(".kx-seg--v"), { scaleY: 0, duration: 0.55, stagger: 0.04, ease: "power2.out" }, 0.25);
  intro.add(() => lightAll(leds), 0.9);

  switch (variant) {
    case "interface": {
      const web = q(".kx-web")[0];
      const devices = q(".kx-device");
      const device = (k) => devices.forEach((d, j) => d.classList.toggle("is-on", j === k));
      intro
        .from(q(".kx-web > *"), { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.08 }, 0.3)
        .from(q(".kx-status li"), { autoAlpha: 0, x: 10, duration: 0.5, stagger: 0.08 }, 0.45);
      loop
        .to({}, { duration: 1.4 })
        .add(() => device(1))
        .to(web, { width: "60%", duration: 0.9, ease: "power2.inOut" })
        .to({}, { duration: 1.3 })
        .add(() => device(2))
        .to(web, { width: "34%", duration: 0.9, ease: "power2.inOut" })
        .to({}, { duration: 1.3 })
        .add(() => device(0))
        .to(web, { width: "94%", duration: 1, ease: "power2.inOut" });
      break;
    }

    case "architecture": {
      const [request, response] = packets;
      [20, 80, 50].forEach((x, k) => {
        const at = k * 2.4;
        const back = x === 50 ? 80 : x;
        travel(loop, request, [[x, 16], [x, 34], [50, 34], [50, 48], [50, 67]], at);
        travel(loop, response, [[50, 67], [50, 34], [back, 34], [back, 16]], at + 1.35);
      });
      break;
    }

    case "device": {
      const [down, across] = packets;
      const track = q(".kx-phone__track")[0];
      const [releaseLed, liveLed] = leds;
      loop
        .add(() => lightAll([releaseLed, liveLed], false), 0)
        .set(track, { xPercent: 0 }, 0)
        .fromTo(q(".kx-meter i"), { scaleX: 0 }, { scaleX: 1, duration: 1.3, stagger: 0.35, ease: "power1.inOut" }, 0)
        .to(track, { xPercent: -33.3333, duration: 0.6, ease: "power2.inOut" }, 0.9);
      travel(loop, across, [[40, 51], [75, 51]], 0.6);
      const reached = travel(loop, down, [[75, 19], [75, 62]], 1.7);
      loop.add(() => releaseLed?.classList.add("is-on"), reached - 0.2);
      const shipped = travel(loop, down, [[75, 62], [75, 83]], reached + 0.1);
      loop
        .add(() => liveLed?.classList.add("is-on"), shipped - 0.2)
        .to(track, { xPercent: -66.6667, duration: 0.6, ease: "power2.inOut" }, 2.5)
        .to({}, { duration: 1.2 });
      break;
    }

    case "workflow": {
      const [lead, branch, conversion] = packets;
      travel(loop, lead, [[17, 20], [17, 50], [46, 50], [67, 50], [67, 27], [82, 27]], 0);
      travel(loop, branch, [[67, 50], [67, 73], [82, 73]], 1.6);
      travel(loop, conversion, [[46, 50], [46, 82]], 1.2);
      loop.fromTo(
        q(".kx-plate--engine"),
        { boxShadow: "0 0 0 0 rgba(247, 170, 0, 0)" },
        { boxShadow: "0 0 0 6px rgba(247, 170, 0, 0.18)", duration: 0.35, yoyo: true, repeat: 1 },
        1.1,
      );
      break;
    }

    case "funnel": {
      const [meta, google] = packets;
      const bars = q(".kx-bars i");
      const a = travel(loop, meta, [[15, 24], [36, 24], [36, 42], [58, 42], [85, 42]], 0);
      const b = travel(loop, google, [[15, 60], [36, 60], [36, 42], [58, 42], [85, 42]], 1.1);
      loop
        .fromTo(bars, { scaleY: 0.55 }, { scaleY: 0.8, duration: 0.4, stagger: 0.05, ease: "power2.out" }, a - 0.2)
        .to(bars, { scaleY: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }, b - 0.2)
        .to({}, { duration: 0.8 });
      break;
    }

    case "calendar": {
      const fresh = q(".kx-tile--new");
      intro.from(q(".kx-tile:not(.kx-tile--new)"), { scale: 0, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: "back.out(2)" }, 0.35);
      loop
        .set(fresh, { scale: 0, autoAlpha: 0 }, 0)
        .to(fresh, { scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.9, ease: "back.out(2)" }, 0.8)
        .to(fresh, { autoAlpha: 0, duration: 0.4, stagger: 0.1 }, 4.4);
      break;
    }

    case "identity": {
      const [dot] = packets;
      intro
        .fromTo(q(".kx-draw"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: "power2.inOut" }, 0.2)
        .from(q(".kx-mark"), { scale: 0.4, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(1.6)" }, 1)
        .from(q(".kx-mark__dot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(3)" }, 1.4)
        .from(q(".kx-swatches i"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.45, stagger: 0.07 }, 0.9)
        .from(q(".kx-thumbs i"), { autoAlpha: 0, y: 6, duration: 0.45, stagger: 0.08 }, 1.1);
      travel(loop, dot, [[54, 50], [56, 50], [56, 22], [59, 22]], 0.4);
      travel(loop, dot, [[54, 50], [59, 50]], 1.6);
      travel(loop, dot, [[54, 50], [56, 50], [56, 78], [59, 78]], 2.6);
      loop.to({}, { duration: 0.6 });
      break;
    }

    case "roadmap": {
      const pin = q(".kx-pin-at")[0];
      const miles = q(".kx-mile");
      const you = q(".kx-map__you")[0];
      intro
        .from(q(".kx-map__dot"), { scale: 0, duration: 0.35, stagger: 0.06, ease: "back.out(2)" }, 0.4)
        .from(q(".kx-doc__line"), { scaleX: 0, transformOrigin: "0 50%", duration: 0.5, stagger: 0.08 }, 0.5);
      loop
        .add(() => lightAll(miles, false), 0)
        .set(pin, { left: pct(MILES[0]) }, 0)
        .set(you, { left: "46%", top: "64%" }, 0)
        .add(() => lightAll(q(".kx-doc__check"), false), 0);
      MILES.forEach((x, i) => {
        const at = 0.3 + i * 1.1;
        if (i > 0) loop.to(pin, { left: pct(x), duration: 0.8, ease: "power2.inOut" }, at - 0.8);
        loop.add(() => miles[i]?.classList.add("is-on"), at);
      });
      loop
        .to(you, { left: "74%", top: "30%", duration: 1.6, ease: "power2.inOut" }, 1.2)
        .add(() => lightAll(q(".kx-doc__check")), 2.6)
        .to({}, { duration: 1.4 });
      break;
    }

    default:
      break;
  }

  return { intro, loop };
}

export default function ServiceSchematic({ service, items = [] }) {
  const rootRef = useRef(null);
  const variant = VARIANT_BY_SLUG[service.slug] || VARIANT_BY_THEME[service.hero.theme] || "interface";
  const Composition = COMPOSITIONS[variant];
  const { readouts, signals, label } = service.hero;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      // The finished picture, still: every light on, the roadmap walked.
      root.querySelectorAll(".kx-led, .kx-mile, .kx-doc__check").forEach((el) => el.classList.add("is-on"));
      return undefined;
    }

    let visible = true;
    let introDone = false;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const { intro, loop } = choreograph(variant, q);
      intro.eventCallback("onComplete", () => {
        introDone = true;
        if (visible) loop.play();
      });
      intro.delay(0.35).play();

      // The loop only runs while the module is on screen.
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
          if (!introDone) return;
          if (visible) loop.play();
          else loop.pause();
        },
      });
    }, root);

    return () => ctx.revert();
  }, [variant, service.slug]);

  return (
    <figure
      ref={rootRef}
      className={`ssx ssx--${variant}`}
      aria-label={`${service.title}: ${readouts.map((r) => `${r.value} ${r.label}`).join(", ")}`}
    >
      <div className="ssx__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="ssx__file">{label}</span>
        <span className="ssx__live" />
      </div>

      <div className="ssx__body" aria-hidden="true">
        <span className="ssx__grid" />
        <Composition readouts={readouts} items={items} />
      </div>

      <figcaption className="ssx__foot">
        {signals.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </figcaption>
    </figure>
  );
}
