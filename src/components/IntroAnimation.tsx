import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import LogoMark from "./LogoMark";

/**
 * IntroAnimation — séquence d'ouverture cinématique Greendome.
 *
 * Pensée comme l'ouverture d'un film de luxe :
 *   1) Fondu noir absolu, particules dorées qui s'élèvent
 *   2) Deux lignes dorées se dessinent depuis le centre (haut + bas)
 *   3) Mots-clés signature qui apparaissent et s'effacent
 *   4) Le logo se révèle au centre avec halo doré pulsé
 *   5) Sweep horizontal doré + flash subtil
 *   6) Le voile noir se lève, le site est là
 *
 * S'auto-désactive si :
 *   • prefers-reduced-motion
 *   • déjà joué dans la session (sessionStorage)
 *   • bouton "Passer" pressé
 */

const STORAGE_KEY = "greendome-intro-played";

const Particles = ({ count = 60 }: { count?: number }) => {
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 4,
    size: 1 + Math.random() * 2.5,
    drift: -20 + Math.random() * 40,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: "hsl(38, 80%, 65%)",
            boxShadow: "0 0 6px hsla(38,80%,65%,0.7)",
            mixBlendMode: "screen",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -window.innerHeight * 1.1,
            x: p.drift,
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            times: [0, 0.15, 0.85, 1],
          }}
        />
      ))}
    </div>
  );
};

const IntroAnimation = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"idle" | "playing" | "leaving">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setShow(true);
    setPhase("playing");

    // Sécurité : on s'auto-termine après 5s même si rien n'a été cliqué
    const t = window.setTimeout(() => leave(), 4800);
    timers.current.push(t);

    return () => {
      timers.current.forEach((id) => clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const leave = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("leaving");
    const t = window.setTimeout(() => setShow(false), 1200);
    timers.current.push(t);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Voiles montants noirs (rideau qui se lève en 2 morceaux) */}
          {phase === "leaving" && (
            <>
              <motion.div
                className="absolute top-0 left-0 right-0 bg-black z-[10]"
                initial={{ height: "50%" }}
                animate={{ height: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-black z-[10]"
                initial={{ height: "50%" }}
                animate={{ height: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              />
            </>
          )}

          {/* Vignette dorée pulsée en arrière-plan */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, hsla(38,75%,55%,0.18) 0%, transparent 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1, 0.8] }}
            transition={{ duration: 4.2, times: [0, 0.25, 0.5, 0.75, 1] }}
          />

          {/* Particules dorées */}
          <Particles count={70} />

          {/* Lignes dorées qui se dessinent */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-[hsl(38,75%,55%)] to-transparent"
            style={{ width: "min(70vw, 900px)", marginTop: "-180px" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0.6] }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 0.8, 1] }}
          />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-[hsl(38,75%,55%)] to-transparent"
            style={{ width: "min(70vw, 900px)", marginTop: "180px" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0.6] }}
            transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 0.8, 1] }}
          />

          {/* Sweep horizontal doré (un grand flash qui balaie l'écran) */}
          <motion.div
            aria-hidden
            className="absolute top-0 bottom-0 w-[40vw]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsla(38,80%,65%,0.18) 35%, hsla(38,80%,65%,0.35) 50%, hsla(38,80%,65%,0.18) 65%, transparent 100%)",
              filter: "blur(20px)",
              mixBlendMode: "screen",
            }}
            initial={{ x: "-60vw" }}
            animate={{ x: "120vw" }}
            transition={{ duration: 2.4, delay: 1.4, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Logo central */}
          <motion.div
            className="relative z-[20] flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Halo derrière le logo, gros et pulsé */}
            <motion.div
              aria-hidden
              className="absolute inset-0 -m-24 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, hsla(38,80%,55%,0.45) 0%, hsla(38,80%,55%,0.15) 40%, transparent 70%)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 1.15, 1, 1.1],
                opacity: [0, 0.8, 0.6, 0.7],
              }}
              transition={{
                duration: 3.2,
                delay: 0.8,
                ease: "easeOut",
                times: [0, 0.3, 0.6, 1],
              }}
            />

            {/* Le logo détouré — il flotte sur l'écran noir, halo doré tout autour */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, filter: "blur(20px)" }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 1.6,
                delay: 1.0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <LogoMark
                className="relative w-[min(72vw,560px)] h-auto select-none"
                blendFallback={true}
              />
            </motion.div>

            {/* Sous-tagline */}
            <motion.p
              className="mt-6 text-[10px] md:text-xs tracking-[0.5em] uppercase text-[hsl(38,75%,60%)] font-display font-semibold"
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: [0, 1, 1, 0.85], letterSpacing: "0.5em" }}
              transition={{
                duration: 2.4,
                delay: 2.0,
                times: [0, 0.3, 0.85, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Architecture nomade — depuis 2010
            </motion.p>
          </motion.div>

          {/* Bouton "Passer" subtle */}
          <button
            onClick={leave}
            className="absolute bottom-6 right-6 z-[30] text-[10px] tracking-[0.35em] uppercase text-foreground/40 hover:text-[hsl(38,75%,60%)] transition-colors duration-300 font-display"
            aria-label="Passer l'intro"
          >
            Passer →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
