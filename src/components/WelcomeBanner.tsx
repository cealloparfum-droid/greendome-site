import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import logo from "@/assets/logo-greendome.jpeg";

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("banner-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("banner-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={dismiss} />

          {/* Banner */}
          <motion.div
            className="relative surface-glass rounded-sm max-w-lg w-full p-10 text-center border border-primary/20"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.button
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={dismiss}
            >
              <X className="w-4 h-4" />
            </motion.button>

            <motion.img
              src={logo}
              alt="GREENDOME"
              className="w-40 mx-auto mb-6 rounded-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            />

            <div className="divider-gold mb-5" />

            <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Bienvenue chez{" "}
              <span className="text-gradient-gold">GREENDOME</span>
            </h3>

            <p className="text-foreground/85 font-normal text-sm leading-relaxed mb-6">
              Découvrez nos dômes transparents haut de gamme et transformez vos espaces en expériences inoubliables.
            </p>

            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-primary text-primary-foreground font-semibold tracking-wider uppercase text-sm hover:glow-gold transition-shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={dismiss}
            >
              Imaginons votre projet
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBanner;
