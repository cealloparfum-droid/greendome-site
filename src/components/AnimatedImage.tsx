import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { X } from "lucide-react";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * AnimatedImage — image cinématographique avec :
 *   - Tilt 3D suivant le curseur (max 5°)
 *   - Bordure dorée qui se dessine au survol
 *   - Glare doré qui suit le pointeur
 *   - Lightbox au clic
 *   - Animation d'apparition au scroll
 */
const AnimatedImage = ({ src, alt, className = "" }: AnimatedImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Position normalisée [-1, 1]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tilt 3D
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

  // Glare doré qui suit le curseur
  const glareX = useTransform(x, [-1, 1], [20, 80]);
  const glareY = useTransform(y, [-1, 1], [20, 80]);
  const glareBg = useTransform(
    [glareX, glareY] as never,
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, hsla(40, 80%, 70%, 0.15), transparent 55%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
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
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1100,
          transformStyle: "preserve-3d",
        }}
        className={`relative overflow-hidden rounded-sm glow-gold cursor-pointer group ${className}`}
        whileHover={{ scale: 1.02 }}
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
        />

        {/* Bordure dorée intérieure qui se dessine au hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 rounded-sm border border-primary/0 transition-all duration-500 group-hover:border-primary/50"
        />

        {/* Glare doré qui suit le curseur (subtil) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay"
          style={{ background: glareBg }}
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
