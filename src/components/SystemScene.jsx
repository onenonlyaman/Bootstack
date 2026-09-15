import { useEffect, useId, useMemo, useRef } from "react";
import { gsap, clamp, lerp, prefersReducedMotion } from "../lib/motion";
import "./SystemScene.css";

/**
 * The Bootstack system — a digital core on a circuit board, with modules that
 * dock into it and pathways that carry signals between them.
 *
 * One orthographic projection draws everything into a single SVG. Horizontal
 * surfaces (the board, every top face) are ordinary 2D groups placed with an
 * affine matrix, so circuit detail and the B mark sit *on* their surfaces for
 * free; only the vertical faces are computed as quads. Paint order is depth
 * order, so nothing needs a z-buffer.
 *
 * The component owns drawing and nothing else. It hands the parent section an
 * `engine` whose `state` is a plain object; the section's ScrollTriggers tween
 * that state, and a single ticker callback redraws when it changes. That keeps
 * the choreography — pins, phases, copy — in the section that owns the scroll.
 */

const DEG = Math.PI / 180;
/* The core window's colour — brand mist, so the Hero's dive through it lands on
   exactly the ground Section 02 opens on. */
export const SYSTEM_GROUND = "#eef6f7";

const TIERS = [
  { half: 130, thick: 18 },
  { half: 96, thick: 22 },
  { half: 70, thick: 16 },
];
const LIFT = 16; // how far each tier rises while the core unlocks
const APERTURE = 44; // the recessed window the camera dives through
const DIVE_ELEV = 64;
const MODULE_THICK = 16;

/** Module layouts. `at` is a screen-plan position (x across, y into depth). */
const LAYOUTS = {
  hero: [
    { at: [-250, 175], size: [54, 40], float: 110 },
    { at: [-140, -270], size: [46, 46], float: 220 },
    { at: [215, -300], size: [60, 44], float: 190 },
    { at: [335, -10], size: [48, 62], float: 240 },
    { at: [290, 270], size: [64, 46], float: 160 },
    { at: [-40, 345], size: [50, 50], float: 70 },
  ],
  heroCompact: [
    { at: [-300, -110], size: [48, 36], float: 150 },
    { at: [250, -270], size: [44, 44], float: 190 },
    { at: [330, 190], size: [52, 38], float: 160 },
    { at: [-170, 320], size: [44, 44], float: 200 },
  ],
  system: [
    { at: [-345, -86], size: [70, 50], float: 140 },
    { at: [-30, -345], size: [56, 62], float: 180 },
    { at: [325, -196], size: [72, 50], float: 160 },
    { at: [355, 196], size: [62, 50], float: 150 },
    { at: [-212, 292], size: [66, 54], float: 170 },
  ],
  // The same system with four services: one module per quarter, so no side of
  // the core is left empty.
  system4: [
    { at: [-325, -150], size: [70, 50], float: 140 },
    { at: [150, -345], size: [60, 58], float: 180 },
    { at: [370, 110], size: [70, 50], float: 160 },
    { at: [-150, 320], size: [66, 54], float: 170 },
  ],
  // Phones and tablets: the five services composed for a portrait frame —
  // two above the core, one either side, one below — instead of the wide ring.
  // Read clockwise from the top left, so the order still runs 01 → 05.
  systemCompact: [
    { at: [-235, -455], size: [62, 46], float: 120 },
    { at: [250, -400], size: [56, 52], float: 150 },
    { at: [315, 95], size: [62, 46], float: 130 },
    { at: [110, 480], size: [60, 48], float: 110 },
    { at: [-305, 250], size: [60, 48], float: 140 },
  ],
};

/**
 * The frame the compact system layout is fitted into: its extent in scene
 * units (modules docked, at the compact camera), plus the fixed pixel room the
 * number chips need above the top modules.
 */
const COMPACT_FRAME = { w: 820, h: 700, labelRoom: 66 };

/**
 * How far right a full-width scene nudges its core on narrower desktops, as a
 * fraction of the width. Exported so the section after the system can start
 * its signal line exactly under the core.
 */
export const focusShift = (width) => clamp((1320 - width) / 300, 0, 1) * 0.035;

const toWorld = ([xr, yr]) => [(xr + yr) * Math.SQRT1_2, (yr - xr) * Math.SQRT1_2];
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - (1 - t) ** 3;
const fmt = (n) => n.toFixed(1);

/** A circuit route from a module's socket to the core: straight, 45° bevel, straight. */
function route([mx, my], [hx, hy]) {
  const edge = TIERS[0].half + 4;
  const bevelPad = 22;
  const xDominant = Math.abs(mx) >= Math.abs(my);
  // Work in a frame where the long leg runs along `a`, so both cases share one path.
  const a = xDominant ? mx : my;
  const b = xDominant ? my : mx;
  const ha = xDominant ? hx : hy;
  const sa = Math.sign(a) || 1;
  const startA = a - sa * ha;
  let lane = clamp(b * 0.3, -86, 86);
  let drop = Math.abs(b - lane);
  if (Math.abs(startA) < edge + drop + bevelPad * 2) {
    lane = clamp(b, -86, 86);
    drop = Math.abs(b - lane);
  }
  const pts = [
    [startA, b],
    [sa * (edge + drop + bevelPad), b],
    [sa * (edge + bevelPad), lane],
    [sa * edge, lane],
  ];
  return xDominant ? pts : pts.map(([p, q]) => [q, p]);
}

function measure(points) {
  const lengths = [0];
  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    lengths.push(lengths[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }
  return { points, lengths, total: lengths[lengths.length - 1] };
}

/** The part of a polyline between two distances along it, as path data. */
function slice({ points, lengths, total }, from, to) {
  const a = clamp(Math.min(from, to), 0, total);
  const b = clamp(Math.max(from, to), 0, total);
  if (b - a < 0.5) return "";
  const at = (d) => {
    let i = 1;
    while (i < lengths.length - 1 && lengths[i] < d) i += 1;
    const seg = lengths[i] - lengths[i - 1] || 1;
    const t = (d - lengths[i - 1]) / seg;
    return [lerp(points[i - 1][0], points[i][0], t), lerp(points[i - 1][1], points[i][1], t)];
  };
  const start = at(a);
  let d = `M${fmt(start[0])} ${fmt(start[1])}`;
  for (let i = 1; i < points.length; i += 1) {
    if (lengths[i] > a && lengths[i] < b) d += `L${fmt(points[i][0])} ${fmt(points[i][1])}`;
  }
  const end = at(b);
  return `${d}L${fmt(end[0])} ${fmt(end[1])}`;
}

/** The fresh state a section starts from. Sections overwrite what they need. */
function createState(count) {
  return {
    cam: { yaw: 45, elev: 30, zoom: 1, fx: 0.5, fy: 0.5, dive: 0 },
    core: { power: 0.15, ring: 0, emblem: 0.45, lift: 0 },
    board: { alpha: 1, sockets: 0.35, glow: 0 },
    traces: { base: 0.14, draw: 0, lit: 0 },
    flow: { t: 0, alpha: 0 },
    sweep: { t: 0, alpha: 0 },
    ambient: 1,
    ready: 0,
    settle: 0, // 0-1: labels and pointer tilt step back as the system hands over
    tail: 0, // 0-1: a signal line leaving the core for the section below
    modules: Array.from({ length: count }, () => ({ p: 0.55, alpha: 1, lit: 0, active: 0 })),
  };
}

export default function SystemScene({
  variant = "hero",
  compact = false,
  labels = null,
  activeIndex = -1,
  onSelect,
  onEngine,
  interactive = false,
  className = "",
  children,
}) {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const labelsRef = useRef(null);
  const engineRef = useRef(null);
  const onEngineRef = useRef(onEngine);
  onEngineRef.current = onEngine;

  const uid = useId().replace(/:/g, "");
  // The system variant draws one module per label, from the layout for that count.
  const systemKey = labels && LAYOUTS[`system${labels.length}`] ? `system${labels.length}` : "system";
  const layoutKey =
    variant === "system" ? (compact ? "systemCompact" : systemKey) : compact ? "heroCompact" : "hero";
  // The hero's small stage drops the grid to stay quiet under its copy; the
  // compact system keeps it, since the board is the whole picture there.
  const showGrid = !(compact && variant === "hero");

  // Geometry that never changes after mount: seats, suspension points, routes.
  const scene = useMemo(() => {
    const modules = LAYOUTS[layoutKey].map((m, i) => {
      const seat = toWorld(m.at);
      const near = toWorld([m.at[0] * 1.2, m.at[1] * 1.2]);
      const far = toWorld([m.at[0] * 2.3, m.at[1] * 2.3]);
      return {
        i,
        seat,
        near,
        far,
        half: m.size,
        float: m.float,
        depth: m.at[1],
        route: measure(route(seat, m.size)),
      };
    });
    // Back to front: the core sits at depth 0 among its modules.
    const items = [{ kind: "core", depth: 0 }, ...modules.map((m) => ({ kind: "module", depth: m.depth, m }))].sort(
      (p, q) => p.depth - q.depth,
    );
    let grid = "";
    for (let v = -880; v <= 880; v += 80) grid += `M${v} -880V880M-880 ${v}H880`;
    return { modules, items, grid };
  }, [layoutKey]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return undefined;

    const reduced = prefersReducedMotion();
    const n = scene.modules.length;
    const st = createState(n);
    const q = (sel) => svg.querySelector(sel);
    const qa = (sel) => Array.from(svg.querySelectorAll(sel));

    const els = {
      board: q(".ss-board"),
      glow: q(".ss-glow"),
      grid: q(".ss-grid"),
      sockets: q(".ss-sockets"),
      traceBase: qa(".ss-trace-base"),
      traceLit: qa(".ss-trace-lit"),
      signal: qa(".ss-signal"),
      sweep: qa(".ss-sweep"),
      ports: qa(".ss-port"),
      tiers: qa(".ss-tier").map((g) => ({
        r: g.querySelector(".ss-side--r"),
        f: g.querySelector(".ss-side--f"),
        top: g.querySelector(".ss-top"),
      })),
      ring: q(".ss-ring"),
      tail: q(".ss-tail"),
      tailHead: q(".ss-tail-head"),
      emblem: q(".ss-emblem"),
      aperture: q(".ss-aperture"),
      // Groups sit in paint (depth) order in the DOM; geometry is indexed by
      // layout order. Re-sort so element i is always module i.
      modules: qa(".ss-module")
        .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
        .map((g) => ({
        g,
        tether: g.querySelector(".ss-tether"),
        r: g.querySelector(".ss-side--r"),
        f: g.querySelector(".ss-side--f"),
        top: g.querySelector(".ss-top"),
        face: g.querySelector(".ss-face"),
        led: g.querySelector(".ss-led"),
      })),
    };
    const labelEls = labelsRef.current ? Array.from(labelsRef.current.children) : [];

    const size = { w: 1, h: 1, kb: 1, fxShift: 0 };
    const pointer = { yaw: 0, elev: 0, ty: 0, te: 0 };
    const labelWidths = [];
    const labelHeights = [];
    let time = 0;

    const measureLabels = () => {
      labelEls.forEach((el, i) => {
        labelWidths[i] = el.offsetWidth;
        labelHeights[i] = el.offsetHeight;
      });
    };

    const resize = () => {
      measureLabels();
      const rect = root.getBoundingClientRect();
      size.w = Math.max(1, rect.width);
      size.h = Math.max(1, rect.height);
      if (variant === "system" && compact) {
        // Fit the portrait layout to the stage it is given, whichever side binds.
        size.kb = clamp(
          Math.min(size.w / COMPACT_FRAME.w, (size.h - COMPACT_FRAME.labelRoom) / COMPACT_FRAME.h),
          0.24,
          0.95,
        );
      } else if (variant === "system") size.kb = clamp(Math.min(size.w / 1440, size.h / 900), 0.62, 1.2) * 0.9;
      else if (compact) size.kb = clamp(size.w / 980, 0.3, 0.8);
      else size.kb = clamp(Math.min(size.w / 1440, size.h / 900), 0.66, 1.25);
      // Narrower desktops lend the copy column a little more room.
      size.fxShift = compact ? 0 : focusShift(size.w);
      svg.setAttribute("viewBox", `0 0 ${fmt(size.w)} ${fmt(size.h)}`);
    };

    const render = () => {
      const { cam } = st;
      const dive = cam.dive;
      const still = 1 - st.settle;
      const elev = lerp(cam.elev + pointer.elev * still, DIVE_ELEV, smooth(dive)) * DEG;
      const yaw = (cam.yaw + pointer.yaw * (1 - dive) * still) * DEG;
      const c = Math.cos(yaw);
      const s = Math.sin(yaw);
      const se = Math.sin(elev);
      const ce = Math.cos(elev);

      // Zoom needed for the aperture to cover the whole stage, reached exactly at dive = 1.
      const apDiag = APERTURE * Math.SQRT2;
      const need = ((size.w / 2 / apDiag + size.h / 2 / (apDiag * Math.sin(DIVE_ELEV * DEG))) * 1.12) / size.kb;
      const zoom = dive > 0 ? cam.zoom * Math.exp(dive * Math.log(need / cam.zoom)) : cam.zoom;
      const k = size.kb * zoom;

      const core = st.core;
      const lift = core.lift * LIFT;
      const zTop = TIERS[0].thick + TIERS[1].thick + TIERS[2].thick + lift * 2;
      const travel = smooth(Math.min(1, dive * 1.5));
      const ox = lerp(cam.fx + size.fxShift, 0.5, travel) * size.w;
      const oy = lerp(cam.fy, 0.5, travel) * size.h + k * zTop * ce;

      const px = (x, y, z) => [ox + k * (x * c - y * s), oy + k * ((x * s + y * c) * se - z * ce)];
      const P = (x, y, z) => {
        const [a, b] = px(x, y, z);
        return `${fmt(a)} ${fmt(b)}`;
      };
      const plane = (x0, y0, z) => {
        const [e, f] = px(x0, y0, z);
        return `matrix(${(k * c).toFixed(5)} ${(k * s * se).toFixed(5)} ${(-k * s).toFixed(5)} ${(k * c * se).toFixed(5)} ${fmt(e)} ${fmt(f)})`;
      };
      const sides = (bx, by, hx, hy, z0, z1, r, f) => {
        const B1 = P(bx + hx, by - hy, z1);
        const C1 = P(bx + hx, by + hy, z1);
        const D1 = P(bx - hx, by + hy, z1);
        const B0 = P(bx + hx, by - hy, z0);
        const C0 = P(bx + hx, by + hy, z0);
        const D0 = P(bx - hx, by + hy, z0);
        r.setAttribute("d", `M${B1}L${C1}L${C0}L${B0}Z`);
        f.setAttribute("d", `M${C1}L${D1}L${D0}L${C0}Z`);
      };

      // ---- Board ----
      const boardAlpha = st.board.alpha * (1 - smooth(clamp((dive - 0.35) / 0.4, 0, 1)));
      els.board.setAttribute("transform", plane(0, 0, 0));
      els.board.setAttribute("opacity", boardAlpha.toFixed(3));
      if (els.glow) els.glow.setAttribute("opacity", (0.2 + 0.8 * Math.max(core.power * 0.6, st.board.glow)).toFixed(3));
      if (els.sockets) els.sockets.setAttribute("opacity", st.board.sockets.toFixed(3));

      const drawStagger = 0.12;
      const drawSpan = 1 - drawStagger * (n - 1);
      scene.modules.forEach((m, i) => {
        const { total } = m.route;
        els.traceBase[i].setAttribute("opacity", (st.traces.base * st.modules[i].alpha).toFixed(3));
        const drawn = clamp((st.traces.draw - i * drawStagger) / drawSpan, 0, 1);
        // Pathways form from the core outward.
        els.traceLit[i].setAttribute("d", slice(m.route, total - drawn * total, total));
        els.traceLit[i].setAttribute("opacity", (0.35 + 0.65 * st.traces.lit).toFixed(3));
        els.ports[i].setAttribute("opacity", (0.25 + 0.75 * Math.max(drawn, st.modules[i].lit)).toFixed(3));

        // Signals ride inbound (module → core); the ambient drift keeps a dormant system breathing.
        const u = (((time * 0.06 + st.flow.t + i * 0.23) % 1) + 1) % 1;
        const head = u * total;
        const signalAlpha = Math.max(0.5 * st.ambient * (1 - st.traces.lit), st.flow.alpha);
        els.signal[i].setAttribute("d", signalAlpha > 0.01 ? slice(m.route, head, head + 34) : "");
        els.signal[i].setAttribute("opacity", signalAlpha.toFixed(3));

        // The sweep runs outbound, core → every module at once.
        const sw = st.sweep.t * (total + 60);
        els.sweep[i].setAttribute("d", st.sweep.alpha > 0.01 ? slice(m.route, total - sw, total - sw + 60) : "");
        els.sweep[i].setAttribute("opacity", st.sweep.alpha.toFixed(3));
      });

      // ---- Core ----
      let z = 0;
      TIERS.forEach((tier, t) => {
        const el = els.tiers[t];
        const z0 = z + (t > 0 ? lift : 0);
        const z1 = z0 + tier.thick;
        sides(0, 0, tier.half, tier.half, z0, z1, el.r, el.f);
        el.top.setAttribute("transform", plane(0, 0, z1));
        z = z1;
      });
      if (els.ring) {
        const len = APERTURE * 8 + 64; // perimeter of the ring square (half = APERTURE + 8)
        els.ring.style.strokeDashoffset = fmt(len * (1 - core.ring));
        els.ring.style.stroke = st.ready > 0.01 ? `rgba(247, 170, 0, ${(0.55 + 0.45 * st.ready).toFixed(3)})` : "";
      }
      if (els.emblem) {
        const fade = 1 - smooth(clamp((dive - 0.2) / 0.3, 0, 1));
        const a = core.emblem * (0.35 + 0.65 * core.power) * fade;
        els.emblem.setAttribute("opacity", a.toFixed(3));
        els.emblem.style.display = a < 0.01 ? "none" : "";
      }

      // ---- Modules ----
      scene.modules.forEach((m, i) => {
        const ms = st.modules[i];
        const el = els.modules[i];
        const p = ms.p;
        let x;
        let y;
        let zb;
        if (p < 0.55) {
          const t = easeOut(clamp(p / 0.55, 0, 1));
          x = lerp(m.far[0], m.near[0], t);
          y = lerp(m.far[1], m.near[1], t);
          zb = lerp(m.float * 1.9, m.float, t);
        } else {
          const t = smooth(clamp((p - 0.55) / 0.45, 0, 1));
          x = lerp(m.near[0], m.seat[0], t);
          y = lerp(m.near[1], m.seat[1], t);
          zb = lerp(m.float, 0, t);
        }
        const hover = 1 - clamp((p - 0.55) / 0.45, 0, 1);
        zb += Math.sin(time * 0.9 + i * 1.3) * 6 * hover;
        const [hx, hy] = m.half;

        el.g.setAttribute("opacity", ms.alpha.toFixed(3));
        el.g.style.display = ms.alpha < 0.01 ? "none" : "";
        if (ms.alpha < 0.01) {
          if (labelEls[i]) labelEls[i].style.visibility = "hidden";
          return;
        }
        sides(x, y, hx, hy, zb, zb + MODULE_THICK, el.r, el.f);
        el.top.setAttribute("transform", plane(x, y, zb + MODULE_THICK));
        el.tether.setAttribute("d", zb > 6 ? `M${P(x, y, zb)}L${P(x, y, 0)}` : "");
        el.tether.setAttribute("opacity", (0.4 * hover).toFixed(3));
        const lit = Math.max(ms.lit, st.ready);
        el.led.style.fill = `rgba(${Math.round(lerp(64, 247, lit))}, ${Math.round(lerp(168, 170, lit))}, ${Math.round(lerp(196, 0, lit))}, ${(0.45 + 0.55 * lit).toFixed(3)})`;
        el.face.style.stroke = ms.active > 0.01 ? `rgba(247, 170, 0, ${(0.35 + 0.65 * ms.active).toFixed(3)})` : "";

        if (labelEls[i]) {
          const [anchorX, ly] = px(x, y, zb + MODULE_THICK);
          // Keep the label on screen: widths are measured on resize, not per frame.
          const half = (labelWidths[i] || 0) / 2 + 12;
          const lx = half * 2 < size.w ? clamp(anchorX, half, size.w - half) : anchorX;
          const la = clamp((p - 0.62) / 0.3, 0, 1) * ms.alpha * (1 - dive) * still;
          // …and never above the top of the stage.
          const labelY = Math.max(ly - Math.max(hx, hy) * k * 0.55 - 14, (labelHeights[i] || 0) + 2);
          labelEls[i].style.transform = `translate3d(${fmt(lx)}px, ${fmt(labelY)}px, 0) translate(-50%, -100%)`;
          labelEls[i].style.opacity = la.toFixed(3);
          labelEls[i].style.visibility = la < 0.02 ? "hidden" : "visible";
        }
      });

      // ---- Handover: a signal line from the core's front corner to the stage's floor ----
      if (els.tail) {
        const [tx, ty] = px(TIERS[0].half, TIERS[0].half, 0);
        const end = lerp(ty, size.h + 2, st.tail);
        const on = st.tail > 0.001;
        els.tail.setAttribute("d", on ? `M${fmt(tx)} ${fmt(ty)}V${fmt(end)}` : "");
        els.tailHead.setAttribute("cx", fmt(tx));
        els.tailHead.setAttribute("cy", fmt(end));
        els.tailHead.setAttribute("opacity", on && st.tail < 0.995 ? "1" : "0");
      }
    };

    let signature = "";
    const draw = (force = false) => {
      let sig = `${size.w}|${size.h}|${time}|${pointer.yaw}|${pointer.elev}`;
      const push = (o) => {
        for (const key in o) sig += `|${o[key]}`;
      };
      push(st.cam);
      push(st.core);
      push(st.board);
      push(st.traces);
      push(st.flow);
      push(st.sweep);
      sig += `|${st.ambient}|${st.ready}|${st.settle}|${st.tail}`;
      st.modules.forEach(push);
      if (!force && sig === signature) return;
      signature = sig;
      render();
    };

    const engine = {
      state: st,
      count: n,
      size,
      render: () => draw(true),
      setActive(index) {
        gsap.to(st.modules, {
          active: (i) => (i === index ? 1 : 0),
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      },
    };
    engineRef.current = engine;

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(true);
    });
    ro.observe(root);
    // Label widths change once the webfonts land.
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (disposed) return;
      measureLabels();
      draw(true);
    });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);

    const tilt = interactive && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointer = (event) => {
      pointer.ty = (event.clientX / window.innerWidth - 0.5) * 7;
      pointer.te = (0.5 - event.clientY / window.innerHeight) * 3;
    };

    const tick = (_t, deltaMs) => {
      if (!visible) return;
      // Ambient time only runs while something ambient is on screen.
      if (st.ambient > 0.01 || st.modules.some((m) => m.p < 1)) time += Math.min(deltaMs, 50) / 1000;
      if (tilt) {
        pointer.yaw = lerp(pointer.yaw, pointer.ty, 0.05);
        pointer.elev = lerp(pointer.elev, pointer.te, 0.05);
        if (Math.abs(pointer.yaw - pointer.ty) < 0.001) pointer.yaw = pointer.ty;
        if (Math.abs(pointer.elev - pointer.te) < 0.001) pointer.elev = pointer.te;
      }
      draw();
    };

    onEngineRef.current?.(engine);
    draw(true);

    if (!reduced) {
      gsap.ticker.add(tick);
      if (tilt) window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      gsap.killTweensOf(st.modules);
      engineRef.current = null;
      onEngineRef.current?.(null);
    };
  }, [scene, variant, compact, interactive]);

  useEffect(() => {
    engineRef.current?.setActive(activeIndex);
  }, [activeIndex]);

  const topFill = `url(#${uid}-mod)`;
  const tierTop = [`url(#${uid}-base)`, `url(#${uid}-mid)`, `url(#${uid}-top)`];
  const ringHalf = APERTURE + 8;

  return (
    <div ref={rootRef} className={`ss ss--${variant}${compact ? " ss--compact" : ""}${className ? ` ${className}` : ""}`}>
      <svg ref={svgRef} className="ss__svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e6f2f5" />
          </linearGradient>
          <linearGradient id={`${uid}-mid`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#dceef2" />
          </linearGradient>
          <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2f73a6" />
            <stop offset="100%" stopColor="#235784" />
          </linearGradient>
          <linearGradient id={`${uid}-mod`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef6f7" />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="420">
            <stop offset="0%" stopColor="#40a8c4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#40a8c4" stopOpacity="0" />
          </radialGradient>
          {showGrid ? (
            <>
              <radialGradient id={`${uid}-fade`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="860">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#000" />
              </radialGradient>
              <mask id={`${uid}-mask`} maskUnits="userSpaceOnUse" x="-900" y="-900" width="1800" height="1800">
                <rect x="-900" y="-900" width="1800" height="1800" fill={`url(#${uid}-fade)`} />
              </mask>
            </>
          ) : null}
        </defs>

        {/* ---- The board: grid, sockets, pathways, signals ---- */}
        <g className="ss-board">
          <circle className="ss-glow" r="420" fill={`url(#${uid}-glow)`} />
          {showGrid ? <path className="ss-grid" d={scene.grid} mask={`url(#${uid}-mask)`} /> : null}
          <g className="ss-sockets">
            {scene.modules.map((m) => (
              <rect
                key={`socket-${m.i}`}
                x={fmt(m.seat[0] - m.half[0] - 6)}
                y={fmt(m.seat[1] - m.half[1] - 6)}
                width={fmt((m.half[0] + 6) * 2)}
                height={fmt((m.half[1] + 6) * 2)}
              />
            ))}
          </g>
          {scene.modules.map((m) => (
            <path key={`base-${m.i}`} className="ss-trace-base" d={slice(m.route, 0, m.route.total)} />
          ))}
          {scene.modules.map((m) => (
            <path key={`lit-${m.i}`} className="ss-trace-lit" />
          ))}
          {scene.modules.map((m) => {
            const [x, y] = m.route.points[m.route.points.length - 1];
            return <rect key={`port-${m.i}`} className="ss-port" x={fmt(x - 5)} y={fmt(y - 5)} width="10" height="10" />;
          })}
          {scene.modules.map((m) => (
            <path key={`signal-${m.i}`} className="ss-signal" />
          ))}
          {scene.modules.map((m) => (
            <path key={`sweep-${m.i}`} className="ss-sweep" />
          ))}
        </g>

        {/* ---- Core and modules, back to front ---- */}
        {scene.items.map((item) =>
          item.kind === "core" ? (
            <g className="ss-core" key="core">
              {TIERS.map((tier, t) => (
                <g className="ss-tier" key={`tier-${t}`}>
                  <path className="ss-side ss-side--r" />
                  <path className="ss-side ss-side--f" />
                  <g className="ss-top">
                    <rect
                      className="ss-face"
                      x={-tier.half}
                      y={-tier.half}
                      width={tier.half * 2}
                      height={tier.half * 2}
                      fill={tierTop[t]}
                    />
                    {t === 0 ? (
                      <path
                        className="ss-detail"
                        d={[-90, -54, -18, 18, 54, 90]
                          .map((v) => `M${v - 5} -118h10M${v - 5} 118h10M-118 ${v - 5}v10M118 ${v - 5}v10`)
                          .join("")}
                      />
                    ) : null}
                    {t === 1 ? <rect className="ss-detail" x="-80" y="-80" width="160" height="160" /> : null}
                    {t === 2 ? (
                      <>
                        <rect
                          className="ss-aperture"
                          x={-APERTURE}
                          y={-APERTURE}
                          width={APERTURE * 2}
                          height={APERTURE * 2}
                          fill={SYSTEM_GROUND}
                        />
                        <rect
                          className="ss-ring"
                          x={-ringHalf}
                          y={-ringHalf}
                          width={ringHalf * 2}
                          height={ringHalf * 2}
                          style={{ strokeDasharray: `${ringHalf * 8} ${ringHalf * 8}` }}
                        />
                        {/* The B, set into the core's window with the brand's yellow square. */}
                        <g className="ss-emblem">
                          <text className="ss-b" x="-2" y="20" textAnchor="middle">
                            B
                          </text>
                          <rect className="ss-b-dot" x="-19" y="12" width="8" height="8" />
                        </g>
                      </>
                    ) : null}
                  </g>
                </g>
              ))}
            </g>
          ) : (
            <g className="ss-module" key={`module-${item.m.i}`} data-index={item.m.i}>
              <path className="ss-tether" />
              <path className="ss-side ss-side--r" />
              <path className="ss-side ss-side--f" />
              <g className="ss-top">
                <rect
                  className="ss-face"
                  x={-item.m.half[0]}
                  y={-item.m.half[1]}
                  width={item.m.half[0] * 2}
                  height={item.m.half[1] * 2}
                  fill={topFill}
                />
                <rect
                  className="ss-detail"
                  x={-item.m.half[0] + 9}
                  y={-item.m.half[1] + 9}
                  width={item.m.half[0] * 2 - 18}
                  height={item.m.half[1] * 2 - 18}
                />
                <path
                  className="ss-detail ss-detail--bars"
                  d={`M${-item.m.half[0] + 18} ${-item.m.half[1] + 20}h${item.m.half[0] * 0.7}M${-item.m.half[0] + 18} ${-item.m.half[1] + 30}h${item.m.half[0] * 0.45}`}
                />
                <circle className="ss-led" cx={item.m.half[0] - 17} cy={item.m.half[1] - 17} r="4.5" />
              </g>
            </g>
          ),
        )}

        {variant === "system" ? (
          <g className="ss-handover">
            <path className="ss-tail" />
            <circle className="ss-tail-head" r="3.5" opacity="0" />
          </g>
        ) : null}
      </svg>

      {labels ? (
        <div className="ss__labels" ref={labelsRef}>
          {labels.map((label, i) => (
            <button
              type="button"
              key={label.title}
              className="ss__label"
              data-active={i === activeIndex ? "true" : "false"}
              aria-pressed={i === activeIndex}
              onMouseEnter={() => onSelect?.(i, "hover")}
              onMouseLeave={() => onSelect?.(-1, "hover")}
              onFocus={() => onSelect?.(i, "hover")}
              onBlur={() => onSelect?.(-1, "hover")}
              onClick={() => onSelect?.(i, "click")}
            >
              <span className="ss__label-num mono">{label.index}</span>
              <span className="ss__label-name">{label.title}</span>
            </button>
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}
