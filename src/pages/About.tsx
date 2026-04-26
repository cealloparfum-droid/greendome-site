import { motion } from "framer-motion";
import { Award, Shield, Leaf, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import PageTransition from "@/components/PageTransition";
import AnimatedCounter from "@/components/AnimatedCounter";
import teamImg from "@/assets/dome-foret.png";
import qualityImg from "@/assets/dome-lac.png";

const stats = [
  { icon: Clock, value: 10, suffix: "+", label: "Ans d'expérience" },
  { icon: Award, value: 4, suffix: "", label: "Certifications" },
  { icon: Shield, value: 0, suffix: "", label: "ISO9001", isText: true },
  { icon: Leaf, value: 100, suffix: "%", label: "Éco-responsable" },
];

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-20 md:py-28 pt-32">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="divider-gold mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Qui <span className="text-gradient-gold italic">sommes-nous</span> ?
              </h1>
              <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
                Une expertise unique au service de l'innovation architecturale
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <div className="divider-gold !mx-0 mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                  Plus de dix ans{" "}
                  <span className="text-gradient-gold italic">d'expertise</span>
                </h2>
                <p className="text-foreground/70 font-light leading-relaxed text-lg">
                  Derrière nos dômes transparents se trouve une équipe de développement forte de plus de dix ans d'expérience dans la technologie de thermoformage du polycarbonate. Notre démarche est née d'une volonté d'apporter une innovation majeure aux professionnels du tourisme et de l'événementiel, en proposant des architectures spectaculaires à un coût maîtrisé. Nous avons à cœur de concevoir avec soin, de produire une qualité irréprochable et d'offrir un service sincère à chacun de nos partenaires.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                <AnimatedImage src={teamImg} alt="Dômes transparents en forêt avec espace de travail" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }} className="text-center">
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                    <stat.icon className="w-7 h-7 text-primary mx-auto mb-4" />
                  </motion.div>
                  <div className="text-4xl font-display font-bold text-foreground mb-2">
                    {stat.isText ? (
                      <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>ISO9001</motion.span>
                    ) : (
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} className="text-4xl font-display font-bold" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground tracking-wider uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="md:order-2">
                <div className="divider-gold !mx-0 mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                  Qualité &{" "}
                  <span className="text-gradient-gold italic">certifications</span>
                </h2>
                <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                  L'excellence de nos espaces étoilés repose sur une sélection rigoureuse de nos fournisseurs. Nous insistons sur l'utilisation de matières premières respectueuses de l'environnement et de très haute qualité. Cette exigence nous a permis d'obtenir de multiples brevets ainsi que les certifications ISO9001, CE, SGS et PICC, garantissant à nos clients B2B des installations fiables, durables et conformes aux standards internationaux.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["ISO9001", "CE", "SGS", "PICC"].map((cert, i) => (
                    <motion.span
                      key={cert}
                      className="px-5 py-2.5 rounded-sm surface-glass text-sm font-semibold text-primary tracking-wider"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -3, boxShadow: "0 10px 30px -10px hsl(38 70% 55% / 0.3)" }}
                    >
                      {cert}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:order-1">
                <AnimatedImage src={qualityImg} alt="Dôme luxueux au bord d'un lac au crépuscule" />
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AboutPage;
