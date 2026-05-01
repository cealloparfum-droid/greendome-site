import { useEffect, useRef } from "react";

interface GoldParticlesProps {
  /** Densité — nombre de particules. Défaut 30 (subtil). 50+ pour effet plus marqué. */
  density?: number;
  /** Vitesse du drift vertical (négatif = vers le haut). Défaut -0.12. */
  speed?: number;
  /** Opacité maximum d'une particule. Défaut 0.55. */
  maxOpacity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinkle: number;
}

/**
 * GoldParticles — particules dorées flottant lentement vers le haut.
 * Effet "poussière d'or" dans les hero sections.
 * Canvas 2D (performant), respecte prefers-reduced-motion.
 */
const GoldParticles = ({
  density = 30,
  speed = -0.12,
  maxOpacity = 0.55,
  className = "",
}: GoldParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect des préférences de réduction de mouvement
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { offsetWidth, offsetHeight } = canvas;
      canvas.width = offsetWidth * dpr;
      canvas.height = offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const init = () => {
      const { offsetWidth, offsetHeight } = canvas;
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * offsetWidth,
          y: Math.random() * offsetHeight,
          vx: (Math.random() - 0.5) * 0.08,
          vy: speed + (Math.random() - 0.5) * 0.05,
          size: Math.random() * 1.4 + 0.4,
          opacity: Math.random() * maxOpacity * 0.6 + maxOpacity * 0.2,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      const { offsetWidth, offsetHeight } = canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Mouvement
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.02;

        // Wrap
        if (p.y < -10) {
          p.y = offsetHeight + 10;
          p.x = Math.random() * offsetWidth;
        }
        if (p.x < -10) p.x = offsetWidth + 10;
        if (p.x > offsetWidth + 10) p.x = -10;

        // Effet de scintillement subtil
        const flicker = (Math.sin(p.twinkle) + 1) * 0.5;
        const finalOpacity = p.opacity * (0.5 + flicker * 0.5);

        // Halo doux (glow)
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glow.addColorStop(0, `hsla(40, 75%, 65%, ${finalOpacity * 0.4})`);
        glow.addColorStop(1, "hsla(40, 75%, 65%, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Cœur de la particule
        ctx.fillStyle = `hsla(40, 80%, 70%, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density, speed, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default GoldParticles;
