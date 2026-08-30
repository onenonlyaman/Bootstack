import './Wordmark.css';
import bootstackLogo from '../assets/bootstack_logo.png';

export default function Wordmark() {
  return (
    <span className="wordmark">
      <img
        src={bootstackLogo}
        alt="Bootstack"
        className="wordmark__logo"
      />
    </span>
  );
}