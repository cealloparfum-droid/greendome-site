import { useRef, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { useIsTouch } from "@/hooks/useIsTouch";

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
 *   • Desktop : tilt suit le mouvement de souris
 *   • Tactile : tilt piloté par la position de scroll de la carte dans
 *     le viewport — la carte s'incline légèrement vers nous quand elle
 *     passe sous nos yeux. Glare animé en sweep gauche→droite.
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
  const isTouch = useIsTouch();

  // ─── Variante DESKTOP : tilt suit la souris ─────────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

  const glareX = useTransform(x, [-1, 1], [20, 80]);
  const glareY = useTransform(y, [-1, 1], [20, 80]);
  const desktopGlareBg = useTransform(
    [glareX, glareY] as never,
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, hsla(40, 80%, 70%, 0.18), transparent 55%)`
  );

  // ─── Variante TACTILE : tilt piloté par le scroll ───────────────────────
  // scrollYProgress sur l'élément lui-même : 0 = vient d'apparaître en bas
  // de l'écran, 1 = sort par le haut. On mappe sur une oscillation douce.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Léger tilt vertical : la carte "lève la tête" en entrant, puis "se baisse"
  // en sortant, comme si elle se tournait pour nous regarder.
  const scrollTiltX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [maxTilt * 0.8, 0, -maxTilt * 0.8]),
    { damping: 30, stiffness: 90, mass: 0.6 }
  );
  // Glare qui balaie de gauche à droite avec le scroll (effet vitre)
  const scrollGlarePos = useTransform(scrollYProgress, [0, 1], [10, 90]);
  const touchGlareBg = useTransform(
    scrollGlarePos,
    (pos: number) =>
      `radial-gradient(ellipse at ${pos}% 50%, hsla(40, 80%, 70%, 0.22), transparent 55%)`
  );

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || isTouch) return;
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
      onMouseMove={isTouch ? undefined : handleMove}
      onMouseLeave={isTouch ? undefined : reset}
      whileHover={!isTouch && scale !== 1 ? { scale } : undefined}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
      style={{
        rotateX: isTouch ? scrollTiltX : rotateX,
        rotateY: isTouch ? 0 : rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className ?? ""}`}
    >
      {children}

      {/* Glare doré */}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: isTouch ? touchGlareBg : desktopGlareBg }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
