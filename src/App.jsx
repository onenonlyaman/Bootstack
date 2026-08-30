import { useEffect } from "react";
import { ScrollTrigger } from "./lib/motion";
import { useSmoothScroll, scrollToElement } from "./hooks/useSmoothScroll";
import { useReveal } from "./hooks/useReveal";
import { useScrollFlex } from "./hooks/useScrollFlex";

import Cursor from "./components/Cursor.jsx";
import BackgroundStage from "./components/BackgroundStage.jsx";
import Grain from "./components/Grain.jsx";
import Nav from "./components/Nav.jsx";

import Hero from "./sections/Hero.jsx";
import BigIdea from "./sections/BigIdea.jsx";
import Capabilities from "./sections/Capabilities.jsx";
import About from "./sections/About.jsx";
import WhyBootstack from "./sections/WhyBootstack.jsx";
import HowWeWork from "./sections/HowWeWork.jsx";
import SelectedWork from "./sections/SelectedWork.jsx";
import TechStack from "./sections/TechStack.jsx";
import Faq from "./sections/Faq.jsx";
import FinalCta from "./sections/FinalCta.jsx";
import Footer from "./sections/Footer.jsx";

export default function App() {
  // There is no opening curtain any more: the app is ready on first paint, so
  // every hook and section that used to wait for the loader starts immediately.
  // Kept as a named value because Nav and Hero still take it as a prop.
  const ready = true;

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
  // homepage, whatever hash the URL happens to be carrying. main.jsx has
  // already scrolled to 0, so this only has to decline to move.
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
      return undefined;
    }

    const id = window.location.hash.slice(1) || (marker ? "capabilities" : "");
    if (!id) return undefined;

    // After the 220ms ScrollTrigger.refresh above, so the target has settled.
    const jump = window.setTimeout(() => {
      scrollToElement(document.getElementById(id));
    }, 300);

    return () => window.clearTimeout(jump);
  }, []);

  return (
    <>
      <Cursor />
      <BackgroundStage />
      <Grain />
      <Nav ready={ready} />

      <main id="top">
        <Hero ready={ready} />
        <BigIdea />
        <Capabilities />
        <About />
        <WhyBootstack />
        <HowWeWork />
        <SelectedWork />
        <TechStack />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
