import { useEffect, useRef } from "react";
import { clamp, lerp, prefersReducedMotion } from "../lib/motion";
import "./HeroField.css";

/**
 * The hero's ground layer: a field of short vectors on a canvas.
 *
 * At rest they drift on a slow wave. Near the pointer they swing to face it and
 * deepen toward brand blue — a system quietly reorganising itself around
 * attention, which is the argument the whole site is making. 2D canvas only:
 * no WebGL payload, and it degrades to a single static frame when the visitor
 * has asked for reduced motion.
 */
export default function HeroField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const reduced = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let cells = [];
    let raf = 0;
    let visible = true;
    let time = 0;

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = width < 640 ? 46 : width < 1280 ? 54 : 62;
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const offsetX = (width - (cols - 1) * gap) / 2;
      const offsetY = (height - (rows - 1) * gap) / 2;

      cells = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          cells.push({
            x: offsetX + c * gap,
            y: offsetY + r * gap,
            angle: Math.random() * Math.PI * 2,
            seed: (r * cols + c) * 0.35,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += reduced ? 0 : 0.0055;

      pointer.x = lerp(pointer.x, pointer.tx, 0.12);
      pointer.y = lerp(pointer.y, pointer.ty, 0.12);

      const radius = Math.min(width, height) * 0.42;
      const len = width < 640 ? 9 : 13;

      ctx.lineCap = "round";

      for (let i = 0; i < cells.length; i += 1) {
        const cell = cells[i];
        const dx = pointer.x - cell.x;
        const dy = pointer.y - cell.y;
        const dist = Math.hypot(dx, dy);
        const pull = pointer.active ? clamp(1 - dist / radius, 0, 1) : 0;

        // Ambient state: a slow diagonal wave rolling across the grid.
        const wave =
          Math.sin(cell.x * 0.006 + time * 1.6) +
          Math.cos(cell.y * 0.0065 - time * 1.2);
        const restAngle = wave * 0.9 + Math.PI * 0.25;
        const target = pull > 0.001 ? Math.atan2(dy, dx) : restAngle;

        // Shortest-path rotation so vectors never spin the long way round.
        let delta = target - cell.angle;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta));
        cell.angle += delta * (reduced ? 1 : 0.055 + pull * 0.16);

        const eased = pull * pull;
        const length = len * (0.62 + eased * 1.5);
        const alpha = 0.22 + eased * 0.7;

        ctx.strokeStyle =
          eased > 0.34
            ? `rgba(35, 87, 132, ${alpha})`
            : `rgba(64, 168, 196, ${alpha * 0.85})`;
        ctx.lineWidth = 1 + eased * 1.4;

        const hx = (Math.cos(cell.angle) * length) / 2;
        const hy = (Math.sin(cell.angle) * length) / 2;

        ctx.beginPath();
        ctx.moveTo(cell.x - hx, cell.y - hy);
        ctx.lineTo(cell.x + hx, cell.y + hy);
        ctx.stroke();

        if (eased > 0.62) {
          ctx.fillStyle = `rgba(247, 170, 0, ${eased * 0.9})`;
          ctx.beginPath();
          ctx.arc(cell.x + hx, cell.y + hy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      if (visible) draw();
      raf = window.requestAnimationFrame(loop);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.active = true;
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    build();

    if (reduced) {
      draw();
      return () => {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onResize = () => {
      build();
      draw();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
}
