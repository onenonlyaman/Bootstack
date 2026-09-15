import { useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/motion";
import { useSmoothScroll, scrollToElement } from "./hooks/useSmoothScroll";
import { useReveal } from "./hooks/useReveal";
import { useScrollFlex } from "./hooks/useScrollFlex";

import Cursor from "./components/Cursor.jsx";
import BackgroundStage from "./components/BackgroundStage.jsx";
import Grain from "./components/Grain.jsx";
import Nav from "./components/Nav.jsx";
import BootIntro, { shouldPlayIntro } from "./components/BootIntro.jsx";

import Hero from "./sections/Hero.jsx";
import BigIdea from "./sections/BigIdea.jsx";
import Capabilities from "./sections/Capabilities.jsx";
import About from "./sections/About.jsx";
import WhyBootstack from "./sections/WhyBootstack.jsx";
import HowWeWork from "./sections/HowWeWork.jsx";
// SelectedWork.jsx (with data/work.js and WorkVisual) stays in the codebase:
// the Featured Work section is off the homepage until there are projects to
// show. Re-import it and render it after <HowWeWork /> to bring it back.
// TechStack.jsx (and its technology lists) stays in the codebase for reuse;
// it is no longer rendered as a standalone homepage section.
import Faq from "./sections/Faq.jsx";
import FinalCta from "./sections/FinalCta.jsx";
import Footer from "./sections/Footer.jsx";

export default function App() {
  // The boot intro opens the first visit of a session (see BootIntro). While it
  // runs the page is not `ready`: scrolling is locked and the nav and the Hero
  // copy hold their entrances. It flips `ready` at its hand-over, so the page
  // arrives underneath as the booted core flies to the Hero, then unmounts.
  const [introActive, setIntroActive] = useState(shouldPlayIntro);
  const [introPlayed] = useState(introActive);
  const [ready, setReady] = useState(!introActive);

  // A safety net: whatever happens to the intro, the page never stays locked.
  useEffect(() => {
    if (ready) return undefined;
    const id = window.setTimeout(() => setReady(true), 6000);
    return () => window.clearTimeout(id);
  }, [ready]);

  useSmoothScroll(ready);
  useReveal([ready]);
  useScrollFlex(ready);

  // Layout settles once webfonts land — recalculate every trigger once, rather
  // than fighting stale measurements later.
  useEffect(() => {
    if (!ready) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 220);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("load", refresh);
    };
  }, [ready]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", !ready);
  }, [ready]);

  // Arriving with a hash ("Back to Services" -> /#capabilities) or returning
  // from a service page should land on that section, not at the top. React
  // Router does not scroll to a hash on its own, and scrollRestoration is
  // manual, so nothing else would.
  //
  // A reload is the exception: it should always come back to the top of the
  // homepage, whatever hash the URL happens to be carrying. main.jsx scrolls to
  // 0 first, but the browser can still restore the old position once the page
  // loads — clamped to whatever height existed before the pins were added,
  // which left a reload stranded part-way through the Hero with later reveals
  // measured against the wrong scroll. So the top is re-asserted after load and
  // after the first ScrollTrigger refresh, and ScrollTrigger's own scroll
  // memory is cleared.
  useEffect(() => {
    const [navigation] = performance.getEntriesByType?.("navigation") ?? [];
    const isReload = navigation?.type === "reload";

    let marker = null;
    try {
      marker = sessionStorage.getItem("bootstack:from-service");
      if (marker) sessionStorage.removeItem("bootstack:from-service");
    } catch {
      /* private mode */
    }

    if (isReload) {
      // Drop the fragment too, so nothing can jump to it after paint.
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }

      ScrollTrigger.clearScrollMemory?.("manual");
      const toTop = () => window.scrollTo(0, 0);
      toTop();
      const frame = window.requestAnimationFrame(toTop);
      window.addEventListener("load", toTop, { once: true });
      // Just after the 220ms refresh above.
      const late = window.setTimeout(toTop, 320);

      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("load", toTop);
        window.clearTimeout(late);
      };
    }

    const id = window.location.hash.slice(1) || (marker ? "capabilities" : "");
    if (!id) return undefined;

    // After the 220ms ScrollTrigger.refresh above, so the target has settled —
    // and again once webfonts and the pinned sections have finished moving the
    // layout, since a section below the pins can shift after the first jump.
    const go = () => scrollToElement(document.getElementById(id));
    const jump = window.setTimeout(go, 300);
    const settle = window.setTimeout(go, 950);
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) window.setTimeout(() => live && go(), 150);
    });

    return () => {
      live = false;
      window.clearTimeout(jump);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <>
      {introActive ? (
        <BootIntro onReady={() => setReady(true)} onDone={() => setIntroActive(false)} />
      ) : null}

      <Cursor />
      <BackgroundStage />
      <Grain />
      <Nav ready={ready} />

      <main id="top">
        <Hero ready={ready} introHandoff={introPlayed} />
        <BigIdea />
        <About />
        <Capabilities />
        <WhyBootstack />
        <HowWeWork />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
