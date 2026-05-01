import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  /** Intensité de l'attraction (0–1). Défaut 0.25 — discret mais perceptible. */
  strength?: number;
  /** Distance d'activation en px. Au-delà, le bouton ne bouge pas. */
  radius?: number;
  className?: string;
  as?: "div" | "span";
}

/**
 * Magnetic — wrapper qui attire son contenu vers le curseur quand on s'en approche.
 * À utiliser autour des CTA, boutons primaires et liens importants.
 *
 * <Magnetic><a href="...">Devis</a></Magnetic>
 */
const Magnetic = ({
  children,
  strength = 0.25,
  radius = 80,
  className,
  as = "div",
}: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring soyeux mais réactif
  const springX = useSpring(x, { damping: 18, stiffness: 250, mass: 0.4 });
  const springY = useSpring(y, { damping: 18, stiffness: 250, mass: 0.4 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Au-delà du rayon d'activation, ne rien faire (sécurité)
    if (distance > radius * 2) return;

    x.set(dx * strength);
    y.set(dy * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Wrapper = as === "span" ? motion.span : motion.div;

  return (
    <Wrapper
      ref={ref as never}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, display: as === "span" ? "inline-block" : undefined }}
      className={className}
    >
      {children}
    </Wrapper>
  );
};

export default Magnetic;
