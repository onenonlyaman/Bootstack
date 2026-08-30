import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import ServiceRoute from './pages/ServiceRoute.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import './styles/tokens.css';
import './styles/base.css';

// A refresh part-way down the page restores the old scroll position before any
// ScrollTrigger has measured anything — pins and scrubs then initialise against
// a layout that no longer matches, and the page comes back in a broken state.
// The story is meant to start at the top anyway.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The homepage is App exactly as it was — untouched. */}
        <Route path="/" element={<App />} />
        <Route path="/services/:slug" element={<ServiceRoute />} />
      </Routes>

      {/* One instance for the whole site, outside the routes so it survives
          navigation. It is a corner panel, not an overlay. */}
      <CookieConsent />
    </BrowserRouter>
  </React.StrictMode>,
);
