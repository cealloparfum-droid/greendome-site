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
 *     - Tilt 3D piloté par le scroll (la photo "se tourne" vers nous
 *       quand elle passe sous nos yeux)
 *     - Glare doré qui balaie de gauche à droite avec le scroll
 *     - Bordure dorée révélée à l'entrée dans le viewport
 *     - Léger zoom continu (parallax interne) pour vivacité
 *
 *   Communs :
 *     - Lightbox au clic / tap
 *     - Animation d'apparition au scroll (fade + scale-in)
 */
const AnimatedImage = ({ src, alt, className = "" }: AnimatedImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

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

  // ─── Mobile : piloté par le scroll ───────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Tilt vertical : entre par en-dessous (+4°), passe à plat (0°), sort vers le haut (-4°)
  const scrollTilt = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]),
    { damping: 30, stiffness: 90, mass: 0.6 }
  );
  // Zoom interne sur l'image (effet parallax interne, plus vivant)
  const scrollImgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.12, 1.04, 1.12]
  );
  // Glare en sweep horizontal
  const scrollGlarePos = useTransform(scrollYProgress, [0, 1], [-10, 110]);
  const touchGlareBg = useTransform(
    scrollGlarePos,
    (pos: number) =>
      `radial-gradient(ellipse at ${pos}% 50%, hsla(40, 80%, 70%, 0.20), transparent 50%)`
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
          rotateX: isTouch ? scrollTilt : rotateX,
          rotateY: isTouch ? 0 : rotateY,
          transformPerspective: 1100,
          transformStyle: "preserve-3d",
        }}
        className={`relative overflow-hidden rounded-sm glow-gold cursor-pointer group ${className}`}
        whileHover={!isTouch ? { scale: 1.02 } : undefined}
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
          // Sur tactile, on remplace le hover-zoom par un parallax interne piloté
          // par scroll (la photo respire pendant qu'on défile la page)
          style={isTouch ? { scale: scrollImgScale } : undefined}
        />

        {/* Bordure dorée intérieure : visible au hover (desktop) ou en
            permanence subtile sur mobile (sinon l'image paraît plate) */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-2 rounded-sm border transition-all duration-500 ${
            isTouch
              ? "border-primary/30"
              : "border-primary/0 group-hover:border-primary/50"
          }`}
        />

        {/* Glare doré */}
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-sm transition-opacity duration-700 mix-blend-overlay ${
            isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ background: isTouch ? touchGlareBg : desktopGlareBg }}
        />
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
