import { motion } from "framer-motion";

interface MarqueeProps {
  /** Items à faire défiler. Chaque item est un mot ou une phrase courte. */
  items: string[];
  /** Durée d'une boucle complète en secondes. Défaut 40 (lent et élégant). */
  duration?: number;
  /** Inverse la direction (par défaut: gauche). */
  reverse?: boolean;
  /** Variante visuelle. */
  variant?: "default" | "subtle" | "accent";
  className?: string;
}

/**
 * Marquee — bandeau horizontal défilant en boucle.
 * Pour les phrases signature, valeurs de marque, statements brefs.
 *
 * <Marquee items={["GREENDOME", "SUR-MESURE", "DEPUIS 2018"]} />
 */
const Marquee = ({
  items,
  duration = 40,
  reverse = false,
  variant = "default",
  className = "",
}: MarqueeProps) => {
  // Duplication pour boucle sans couture (animation de 0 à -50%)
  const looped = [...items, ...items];

  const variants = {
    default: "border-y border-border/40 bg-card/10 py-5",
    subtle: "py-4",
    accent: "border-y border-primary/20 bg-primary/5 py-5",
  };

  const textColor = {
    default: "text-foreground/55",
    subtle: "text-foreground/40",
    accent: "text-primary/80",
  };

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${variants[variant]} ${className}`}
    >
      {/* Masques de bords pour fondu élégant */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex shrink-0 whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {looped.map((item, i) => (
          <span
            key={i}
            className={`flex items-center gap-10 md:gap-14 px-5 md:px-7 text-[11px] md:text-xs tracking-[0.4em] uppercase font-display font-semibold ${textColor[variant]}`}
          >
            <span>{item}</span>
            <span className="text-primary/70 text-[6px] md:text-[7px]">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
