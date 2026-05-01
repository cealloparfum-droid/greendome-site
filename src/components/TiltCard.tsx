import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  /** Inclinaison maximum en degrés. Défaut 5 (subtil). 8+ pour effet plus marqué. */
  maxTilt?: number;
  /** Scale au hover. Défaut 1.02. Mettre 1 pour désactiver. */
  scale?: number;
  /** Glare/reflet doré qui suit la souris. Défaut true. */
  glare?: boolean;
  className?: string;
}

/**
 * TiltCard — inclinaison 3D du contenu selon la position du curseur.
 * Effet "tilt" magazine premium. À utiliser sur les images iconiques
 * (héros, images intro, parallaxes).
 *
 * <TiltCard><img src="..." /></TiltCard>
 */
const TiltCard = ({
  children,
  maxTilt = 5,
  scale = 1.02,
  glare = true,
  className,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Position normalisée [-1, 1] depuis le centre
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotation 3D (Y pour mouvement horizontal, X pour vertical, inversés)
  const rotateY = useSpring(useTransform(x, [-1, 1], [-maxTilt, maxTilt]), {
    damping: 22,
    stiffness: 220,
    mass: 0.4,
  });
  const rotateX = useSpring(useTransform(y, [-1, 1], [maxTilt, -maxTilt]), {
    damping: 22,
    stiffness: 220,
    mass: 0.4,
  });

  // Position du glare (en pourcentage)
  const glareX = useTransform(x, [-1, 1], [20, 80]);
  const glareY = useTransform(y, [-1, 1], [20, 80]);
  const glareBg = useTransform(
    [glareX, glareY] as never,
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, hsla(40, 80%, 70%, 0.18), transparent 55%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px * 2);
    y.set(py * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={scale !== 1 ? { scale } : undefined}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className ?? ""}`}
    >
      {children}

      {/* Glare doré qui suit le curseur */}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
