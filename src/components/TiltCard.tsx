import { useRef, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { useIsTouch } from "@/hooks/useIsTouch";
import { useDeviceTilt } from "@/hooks/useDeviceTilt";

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
 *
 *   • Desktop : tilt suit la souris.
 *   • Tactile : tilt 3D combiné — gyroscope (incline ton tél) + scroll
 *     (la carte se tourne en passant). Glare animé en sweep continu.
 *     Tilt 2× plus marqué qu'en desktop pour compenser l'absence de hover.
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
  const { x: gyroX, y: gyroY, supported: gyroSupported } = useDeviceTilt();

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

  // ─── Variante TACTILE : scroll + gyroscope ──────────────────────────────
  // Tilt mobile 2.5× plus marqué (compense l'absence de hover et donne
  // une vraie sensation 3D au scroll).
  const mobileTilt = maxTilt * 2.5;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Tilt vertical par scroll : carte qui se tourne en passant
  const scrollRotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [mobileTilt, 0, -mobileTilt]
  );
  // Tilt horizontal par gyroscope (si dispo)
  const gyroRotateY = useMotionValue(0);
  if (gyroSupported) gyroRotateY.set(gyroX * mobileTilt * 0.6);
  const gyroRotateXAdd = useMotionValue(0);
  if (gyroSupported) gyroRotateXAdd.set(gyroY * mobileTilt * 0.4);

  const touchRotateX = useSpring(
    useTransform(
      [scrollRotateX, gyroRotateXAdd] as never,
      ([s, g]: number[]) => s + g
    ),
    { damping: 28, stiffness: 110, mass: 0.5 }
  );
  const touchRotateY = useSpring(gyroRotateY, {
    damping: 28,
    stiffness: 110,
    mass: 0.5,
  });

  // Scale qui respire en continu sur tactile
  const touchScale = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.97, 1.03, 1.03, 0.97]
  );

  // Glare horizontal qui balaie en suivant le scroll
  const scrollGlarePos = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const touchGlareBg = useTransform(
    scrollGlarePos,
    (pos: number) =>
      `linear-gradient(110deg, transparent ${Math.max(0, pos - 25)}%, hsla(40, 85%, 70%, 0.30) ${pos}%, transparent ${Math.min(100, pos + 25)}%)`
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
      whileTap={isTouch ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
      style={{
        rotateX: isTouch ? touchRotateX : rotateX,
        rotateY: isTouch ? touchRotateY : rotateY,
        scale: isTouch ? touchScale : undefined,
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

      {/* Bordure dorée animée — tactile uniquement */}
      {isTouch && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-primary/40"
          animate={{
            borderColor: [
              "hsla(38, 75%, 60%, 0.25)",
              "hsla(38, 75%, 60%, 0.65)",
              "hsla(38, 75%, 60%, 0.25)",
            ],
            boxShadow: [
              "0 0 0px hsla(38, 75%, 60%, 0)",
              "0 0 24px hsla(38, 75%, 60%, 0.35)",
              "0 0 0px hsla(38, 75%, 60%, 0)",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
