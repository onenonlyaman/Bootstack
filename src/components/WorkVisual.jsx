import './WorkVisual.css';

/**
 * Generated case-study artwork.
 *
 * Each project gets a distinct constructed composition drawn from the brand
 * palette rather than stock photography — so the section stays original, weighs
 * almost nothing, and scales to any viewport without art-directing crops.
 * Replace an entry with a real image later by swapping the returned markup.
 */

const range = (n) => Array.from({ length: n }, (_, i) => i);

function Strata() {
  const bands = [
    { y: 6, h: 9, w: 52, fill: 'var(--cyan)' },
    { y: 19, h: 22, w: 88, fill: 'var(--blue)' },
    { y: 45, h: 6, w: 34, fill: 'var(--yellow)' },
    { y: 55, h: 14, w: 70, fill: 'rgba(238,246,247,0.12)' },
    { y: 73, h: 20, w: 100, fill: 'var(--yellow)' },
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="art__svg">
      <rect width="100" height="100" fill="var(--ink-2)" />
      {bands.map((b, i) => (
        <rect
          key={b.y}
          className="art__band"
          x={i % 2 ? 100 - b.w : 0}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={b.fill}
          style={{ '--i': i }}
        />
      ))}
      {range(26).map((i) => (
        <line
          key={i}
          x1={i * 4}
          y1="0"
          x2={i * 4}
          y2="100"
          stroke="rgba(8,22,31,0.16)"
          strokeWidth="0.4"
        />
      ))}
    </svg>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="art__svg">
      <rect width="100" height="100" fill="var(--navy)" />
      {range(7).map((i) => (
        <circle
          key={i}
          className="art__ring"
          cx="50"
          cy="52"
          r={8 + i * 7}
          fill="none"
          stroke={i === 4 ? 'var(--yellow)' : 'rgba(64,168,196,0.35)'}
          strokeWidth={i === 4 ? 0.9 : 0.4}
          style={{ '--i': i }}
        />
      ))}
      <circle cx="50" cy="52" r="5" fill="var(--yellow)" />
      <g className="art__orbiter">
        <circle cx="50" cy="16" r="2.4" fill="var(--mist)" />
      </g>
    </svg>
  );
}

function GridArt() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="art__svg">
      <rect width="100" height="100" fill="var(--ink)" />
      {range(12).map((row) =>
        range(12).map((col) => {
          const density = (row + col) / 22;
          const on = (row * 7 + col * 5) % 11 < density * 11 + 2;
          if (!on) return null;
          const accent = row === col || row + col === 11;
          return (
            <rect
              key={`${row}-${col}`}
              className="art__cell"
              x={col * 8.3 + 0.6}
              y={row * 8.3 + 0.6}
              width={7.1}
              height={7.1}
              fill={accent ? 'var(--yellow)' : 'var(--blue)'}
              opacity={accent ? 1 : 0.25 + density * 0.6}
              style={{ '--i': (row + col) % 8 }}
            />
          );
        }),
      )}
    </svg>
  );
}

function Wave() {
  const lines = range(16).map((i) => {
    const y = 12 + i * 5.2;
    const amp = 3 + Math.sin(i * 0.6) * 5;
    const d = range(21)
      .map((s) => {
        const x = s * 5;
        const yy = y + Math.sin(s * 0.55 + i * 0.42) * amp;
        return `${s === 0 ? 'M' : 'L'} ${x} ${yy.toFixed(2)}`;
      })
      .join(' ');
    return { d, i };
  });

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="art__svg">
      <rect width="100" height="100" fill="var(--ink-2)" />
      {lines.map(({ d, i }) => (
        <path
          key={i}
          className="art__wave"
          d={d}
          fill="none"
          stroke={i === 8 ? 'var(--yellow)' : 'rgba(64,168,196,0.45)'}
          strokeWidth={i === 8 ? 1.1 : 0.5}
          style={{ '--i': i }}
        />
      ))}
    </svg>
  );
}

function Signal() {
  const bars = range(34).map((i) => {
    const h = 8 + Math.abs(Math.sin(i * 0.7)) * 52 + (i > 22 ? i - 22 : 0) * 1.4;
    return { i, h: Math.min(h, 86) };
  });

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="art__svg">
      <rect width="100" height="100" fill="var(--ink)" />
      <line x1="0" y1="92" x2="100" y2="92" stroke="rgba(238,246,247,0.2)" strokeWidth="0.4" />
      {bars.map(({ i, h }) => (
        <rect
          key={i}
          className="art__bar"
          x={i * 2.94 + 0.7}
          y={92 - h}
          width={1.9}
          height={h}
          fill={i > 25 ? 'var(--yellow)' : 'var(--cyan)'}
          opacity={i > 25 ? 1 : 0.32 + (i / 34) * 0.5}
          style={{ '--i': i % 10 }}
        />
      ))}
    </svg>
  );
}

const ART = {
  strata: Strata,
  orbit: Orbit,
  grid: GridArt,
  wave: Wave,
  signal: Signal,
};

export default function WorkVisual({ art }) {
  const Composition = ART[art] || Strata;
  return (
    <div className="art" aria-hidden="true">
      <Composition />
    </div>
  );
}
