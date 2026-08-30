/** Consistent numbered rule that opens each chapter of the page. */
export default function SectionMarker({ index, title, note }) {
  return (
    <div className="marker mono" data-reveal>
      <span className="marker__num">{index}</span>
      <span className="marker__title">{title}</span>
      <span className="marker__spacer" />
      {note ? <span className="marker__note">{note}</span> : null}
    </div>
  );
}
