import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorVariant = "default" | "link" | "image";

/**
 * Curseur signature Greendome — minimaliste.
 * Un seul point doré qui suit le pointeur (spring rapide).
 *   • default : petit point
 *   • link    : point légèrement agrandi + halo doux
 *   • image   : « voir » en lettrage doré
 * Désactivé sur tactile.
 */
const CustomCursor = () => {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Suit de très près
  const dotX = useSpring(cursorX, { damping: 26, stiffness: 700, mass: 0.4 });
  const dotY = useSpring(cursorY, { damping: 26, stiffness: 700, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      const isImage = t.closest("img, [data-cursor='image']");
      const isLink = t.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor='link']"
      );

      if (isImage && !isLink) setVariant("image");
      else if (isLink) setVariant("link");
      else setVariant("default");
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [cursorX, cursorY, visible]);

  if (!enabled) return null;

  return (
    <motion.div
      className="greendome-floating-cursor pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center"
      style={{ x: dotX, y: dotY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {variant === "image" ? (
          <motion.span
            key="text"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] tracking-[0.35em] uppercase font-display font-semibold text-[hsl(38,75%,60%)] -translate-x-1/2 -translate-y-1/2 select-none drop-shadow-[0_0_8px_hsl(38,70%,50%,0.6)]"
          >
            voir
          </motion.span>
        ) : (
          <motion.div
            key="dot"
            initial={{ scale: 0 }}
            animate={{ scale: variant === "link" ? 1.8 : 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 350 }}
            className="w-1.5 h-1.5 rounded-full bg-[hsl(38,75%,60%)] -translate-x-1/2 -translate-y-1/2"
            style={{
              boxShadow:
                variant === "link"
                  ? "0 0 14px hsla(38, 75%, 60%, 0.7)"
                  : "0 0 6px hsla(38, 75%, 60%, 0.4)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomCursor;
