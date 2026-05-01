import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import heroBg from "@/assets/dome-montagne.png";
import GoldParticles from "./GoldParticles";
import Magnetic from "./Magnetic";
import { useIsTouch } from "@/hooks/useIsTouch";
import { useDeviceTilt } from "@/hooks/useDeviceTilt";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const isTouch = useIsTouch();
  const { x: gyroX, y: gyroY, supported: gyroSupported } = useDeviceTilt();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax plus fort sur mobile (compense l'absence de hover et donne
  // une vraie sensation de profondeur en scrollant)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", isTouch ? "45%" : "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, isTouch ? 1.18 : 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Décalage léger du fond avec l'inclinaison du tél (parallax gyroscope)
  const gyroBgX = gyroSupported ? `${gyroX * 3}%` : "0%";
  const gyroBgYShift = gyroSupported ? `${gyroY * 2}%` : "0%";

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale, x: gyroBgX, translateY: gyroBgYShift }}
      >
        <img src={heroBg} alt="Dôme transparent dans la nature au coucher du soleil" className="w-full h-[120%] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
      </motion.div>

      {/* Poussière d'or — densité et opacité boostées sur mobile */}
      <GoldParticles
        density={isTouch ? 70 : 40}
        speed={isTouch ? -0.18 : -0.1}
        maxOpacity={isTouch ? 0.7 : 0.55}
      />

      <motion.div className="relative z-10 container mx-auto px-6 text-center pt-20" style={{ y: textY, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="divider-gold mb-8" />

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-8 tracking-tight">
            <motion.span
              className="block text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              L'art de recevoir,
            </motion.span>
            <motion.span
              className="block text-gradient-gold italic mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              autrement
            </motion.span>
          </h1>

          <motion.p
            className="max-w-xl mx-auto text-base md:text-lg text-foreground/85 font-normal leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Dômes transparents, jacuzzis et pavillons d'exception. Des lieux qui renouent avec la nature — pour vos clients, vos invités, ou simplement chez vous.
          </motion.p>

          <Magnetic strength={0.3} className="inline-block">
            <motion.a
              href="#decouvrir"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.15em] uppercase text-sm transition-shadow hover:glow-gold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Découvrir nos solutions
            </motion.a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
