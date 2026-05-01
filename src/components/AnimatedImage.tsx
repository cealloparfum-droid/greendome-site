import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { X } from "lucide-react";
import { useIsTouch } from "@/hooks/useIsTouch";
import { useDeviceTilt } from "@/hooks/useDeviceTilt";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * AnimatedImage — image cinématographique avec :
 *
 *   Desktop :
 *     - Tilt 3D suivant le curseur (max 5°)
 *     - Bordure dorée qui se dessine au survol
 *     - Glare doré qui suit le pointeur
 *
 *   Mobile (tactile) :
 *     - Tilt 3D fort (jusqu'à 12°) : combine scroll + gyroscope du tél
 *     - Image en parallax interne (zoom respirant pendant le scroll)
 *     - Bordure dorée animée en permanence (pulsation)
 *     - Glare doré qui balaie horizontalement avec le scroll
 *     - Scale qui respire (0.96 → 1.04 → 0.96) pendant le scroll
 *     - Tap = scale-down feedback
 *
 *   Communs :
 *     - Lightbox au clic / tap
 *     - Animation d'apparition au scroll (fade + scale-in)
 */
const AnimatedImage = ({ src, alt, className = "" }: AnimatedImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const { x: gyroX, y: gyroY, supported: gyroSupported } = useDeviceTilt();

  // ─── Desktop : suit la souris ────────────────────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateY = useSpring(useTransform(x, [-1, 1], [-5, 5]), {
    damping: 22,
    stiffness: 220,
    mass: 0.4,
  });
  const rotateX = useSpring(useTransform(y, [-1, 1], [5, -5]), {
    damping: 22,
    stiffness: 220,
    mass: 0.4,
  });

  const glareX = useTransform(x, [-1, 1], [20, 80]);
  const glareY = useTransform(y, [-1, 1], [20, 80]);
  const desktopGlareBg = useTransform(
    [glareX, glareY] as never,
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, hsla(40, 80%, 70%, 0.15), transparent 55%)`
  );

  // ─── Mobile : scroll + gyroscope ─────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Tilt vertical fort piloté par scroll (-12° → 0° → +12°)
  const scrollTiltX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [12, 0, -12]
  );
  // Apport gyroscope (incline le tél → la photo bouge)
  const gyroTiltY = useMotionValue(0);
  const gyroTiltXAdd = useMotionValue(0);
  if (gyroSupported) {
    gyroTiltY.set(gyroX * 8); // ±8° max horizontal
    gyroTiltXAdd.set(gyroY * 4); // ±4° vertical (s'ajoute au scroll)
  }
  const touchRotateX = useSpring(
    useTransform(
      [scrollTiltX, gyroTiltXAdd] as never,
      ([s, g]: number[]) => s + g
    ),
    { damping: 26, stiffness: 100, mass: 0.5 }
  );
  const touchRotateY = useSpring(gyroTiltY, {
    damping: 26,
    stiffness: 100,
    mass: 0.5,
  });

  // Parallax interne sur l'image — zoom qui respire pendant le scroll
  const scrollImgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.18, 1.04, 1.18]
  );
  // Translation Y interne pour effet ken-burns
  const scrollImgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  // Scale du conteneur qui respire
  const containerScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.96, 1.03, 1.03, 0.96]
  );

  // Glare horizontal qui balaie avec le scroll
  const scrollGlarePos = useTransform(scrollYProgress, [0, 1], [-10, 110]);
  const touchGlareBg = useTransform(
    scrollGlarePos,
    (pos: number) =>
      `linear-gradient(110deg, transparent ${Math.max(0, pos - 20)}%, hsla(40, 85%, 70%, 0.32) ${pos}%, transparent ${Math.min(100, pos + 20)}%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || isTouch) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <>
      <motion.div
        ref={ref}
        onMouseMove={isTouch ? undefined : handleMove}
        onMouseLeave={isTouch ? undefined : reset}
        style={{
          rotateX: isTouch ? touchRotateX : rotateX,
          rotateY: isTouch ? touchRotateY : rotateY,
          scale: isTouch ? containerScale : undefined,
          transformPerspective: 1100,
          transformStyle: "preserve-3d",
        }}
        className={`relative overflow-hidden rounded-sm glow-gold cursor-pointer group ${className}`}
        whileHover={!isTouch ? { scale: 1.02 } : undefined}
        whileTap={isTouch ? { scale: 0.97 } : undefined}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={() => setIsOpen(true)}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-80 md:h-[28rem] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          initial={{ scale: 1.15, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          // Parallax interne sur tactile
          style={
            isTouch ? { scale: scrollImgScale, y: scrollImgY } : undefined
          }
        />

        {/* Bordure dorée :
            - Desktop : se révèle au hover
            - Mobile  : pulse en permanence (vivacité) */}
        {isTouch ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-sm border"
            animate={{
              borderColor: [
                "hsla(38, 75%, 60%, 0.30)",
                "hsla(38, 75%, 60%, 0.75)",
                "hsla(38, 75%, 60%, 0.30)",
              ],
              boxShadow: [
                "inset 0 0 0px hsla(38, 75%, 60%, 0)",
                "inset 0 0 24px hsla(38, 75%, 60%, 0.25)",
                "inset 0 0 0px hsla(38, 75%, 60%, 0)",
              ],
            }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-sm border border-primary/0 transition-all duration-500 group-hover:border-primary/50"
          />
        )}

        {/* Glare doré */}
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-sm transition-opacity duration-700 mix-blend-overlay ${
            isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ background: isTouch ? touchGlareBg : desktopGlareBg }}
        />

        {/* Indicateur "tap pour agrandir" — visible uniquement sur tactile */}
        {isTouch && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm text-[9px] tracking-[0.25em] uppercase text-[hsl(38,75%,70%)] font-display font-semibold border border-primary/30"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Tap
          </motion.div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 rounded-full surface-glass flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.img
              src={src}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-sm glow-gold"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedImage;
