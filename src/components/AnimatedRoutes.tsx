import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Index from "@/pages/Index";
import About from "@/pages/About";
import Technology from "@/pages/Technology";
import Solutions from "@/pages/Solutions";
import Particuliers from "@/pages/Particuliers";
import Contact from "@/pages/Contact";
import Location from "@/pages/Location";
import Jacuzzi from "@/pages/Jacuzzi";
import MaisonsEnKit from "@/pages/MaisonsEnKit";
import MobilierAmenagement from "@/pages/MobilierAmenagement";
import Catalogues from "@/pages/Catalogues";
import Visualiser from "@/pages/Visualiser";
import NotFound from "@/pages/NotFound";

/**
 * Sweep doré qui balaie l'écran au changement de route.
 * Effet cinématographique signature.
 */
const RouteSweep = ({ pathKey }: { pathKey: string }) => (
  <motion.div
    key={`sweep-${pathKey}`}
    className="fixed inset-x-0 top-1/2 -translate-y-1/2 h-px z-[150] pointer-events-none"
    initial={{ scaleX: 0, opacity: 0, transformOrigin: "left center" }}
    animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0], transformOrigin: ["left center", "left center", "right center", "right center"] }}
    transition={{ duration: 1.1, times: [0, 0.45, 0.55, 1], ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent" />
  </motion.div>
);

/**
 * Scroll automatique en haut au changement de route.
 */
const ScrollToTop = ({ pathname }: { pathname: string }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const [sweepKey, setSweepKey] = useState(location.pathname);

  // Re-trigger le sweep à chaque changement de route
  useEffect(() => {
    setSweepKey(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop pathname={location.pathname} />
      <RouteSweep pathKey={sweepKey} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/qui-sommes-nous" element={<About />} />
            <Route path="/technologie" element={<Technology />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/particuliers" element={<Particuliers />} />
            <Route path="/location" element={<Location />} />
            <Route path="/jacuzzi" element={<Jacuzzi />} />
            <Route path="/maisons-en-kit" element={<MaisonsEnKit />} />
            <Route path="/mobilier" element={<MobilierAmenagement />} />
            <Route path="/catalogues" element={<Catalogues />} />
            <Route path="/visualiser" element={<Visualiser />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
