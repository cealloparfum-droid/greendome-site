import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  /** Durée de l'animation en secondes. Défaut 2.2. */
  duration?: number;
  /** Décimales à afficher. Défaut 0. */
  decimals?: number;
  className?: string;
}

/**
 * Compteur animé avec easing easeOutCubic — décélère naturellement
 * en arrivant sur la valeur cible. Lance une seule fois au scroll.
 */
const AnimatedCounter = ({
  target,
  suffix = "",
  prefix = "",
  duration = 2.2,
  decimals = 0,
  className = "",
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic — décélération douce
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setCount(decimals > 0 ? +current.toFixed(decimals) : Math.floor(current));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration, decimals]);

  const display =
    decimals > 0
      ? count.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.floor(count).toLocaleString("fr-FR");

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
