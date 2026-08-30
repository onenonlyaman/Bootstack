import './Marquee.css';

/**
 * Seam ticker. Used between chapters to carry a phrase across the join so the
 * page reads continuously instead of as stacked blocks.
 */
export default function Marquee({ items, speed = 38, reverse = false, size = 'lg' }) {
  const run = [...items, ...items];

  return (
    // data-flex sits on the wrapper, not the track: the track's transform
    // belongs to its CSS animation and must not be shared.
    <div className={`marquee marquee--${size}`} data-flex aria-hidden="true">
      <div
        className="marquee__track"
        style={{ '--speed': `${speed}s`, '--dir': reverse ? 'reverse' : 'normal' }}
      >
        {run.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
            <i className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
