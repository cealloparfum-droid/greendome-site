import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Footer from "@/components/Footer";
import WelcomeBanner from "@/components/WelcomeBanner";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import AnimatedImage from "@/components/AnimatedImage";
import AnimatedCounter from "@/components/AnimatedCounter";
import Marquee from "@/components/Marquee";
import Magnetic from "@/components/Magnetic";
import VoiceProjectPitch from "@/components/VoiceProjectPitch";
import domeMaldives from "@/assets/dome-maldives.png";
import domeMontagne from "@/assets/dome-montagne.png";
import domeLac from "@/assets/dome-lac.png";
import domeAurore from "@/assets/dome-aurore.png";

const keyFigures = [
  { value: 200, suffix: "+", label: "Projets réalisés" },
  { value: 15, suffix: " ans", label: "D'expertise" },
  { value: 53, suffix: "", label: "Pièces signature" },
  { value: 4, suffix: "", label: "Saisons garanties" },
];

const galleryImages = [
  { src: domeMaldives, alt: "Village de dômes sur pilotis aux Maldives" },
  { src: domeMontagne, alt: "Dôme luxueux en montagne avec vue panoramique" },
  { src: domeLac, alt: "Dôme romantique au bord du lac" },
  { src: domeAurore, alt: "Dôme sous les aurores boréales en Scandinavie" },
];

const Index = () => {
  usePageMeta({
    title: "Accueil",
    description: "Dômes transparents haut de gamme, jacuzzis signature et maisons en kit. Architecture nomade pour résidences, hôtels, glamping et événementiel.",
    path: "/",
  });
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Introduction />

        {/* Marquee signature */}
        <Marquee
          items={[
            "Dômes transparents",
            "Mobilier signature",
            "Maisons en kit",
            "Architecture nomade",
            "Sur-mesure",
            "Depuis 2018",
          ]}
          duration={55}
          variant="subtle"
        />

        {/* Chiffres clés */}
        <section className="py-20 md:py-28 bg-card/20 border-y border-border/40">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-14"
            >
              <div className="divider-gold mb-6" />
              <p className="text-xs md:text-sm text-primary tracking-[0.4em] uppercase font-semibold">
                La maison Greendome en chiffres
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
              {keyFigures.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl md:text-7xl font-display font-bold text-gradient-gold leading-none mb-3">
                    <AnimatedCounter target={kpi.value} suffix={kpi.suffix} duration={2.4} />
                  </div>
                  <div className="text-[10px] md:text-xs text-foreground/65 tracking-[0.3em] uppercase font-display">
                    {kpi.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery showcase */}
        <section className="py-24 md:py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="divider-gold mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Nos <span className="text-gradient-gold italic">réalisations</span>
              </h2>
              <p className="text-foreground/85 font-normal max-w-lg mx-auto">
                Des installations spectaculaires à travers le monde
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {galleryImages.map((img, i) => (
                <motion.div
                  key={img.alt}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={i % 3 === 0 ? "md:row-span-1" : ""}
                >
                  <AnimatedImage src={img.src} alt={img.alt} className="h-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bloc dictée vocale — racontez votre projet */}
        <VoiceProjectPitch />

        {/* CTA band */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(600px circle at 0% 50%, hsl(38 70% 55% / 0.08), transparent 60%)",
                "radial-gradient(600px circle at 100% 50%, hsl(38 70% 55% / 0.08), transparent 60%)",
                "radial-gradient(600px circle at 0% 50%, hsl(38 70% 55% / 0.08), transparent 60%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Prêt à <span className="text-gradient-gold italic">innover</span> ?
              </h2>
              <p className="text-foreground/85 font-normal mb-10 max-w-lg mx-auto text-lg">
                De 2 à 32 personnes, nous avons le dôme parfait pour votre projet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.3} className="inline-block">
                  <motion.a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.15em] uppercase text-sm transition-shadow hover:glow-gold"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Imaginons votre projet
                  </motion.a>
                </Magnetic>
                <Magnetic strength={0.3} className="inline-block">
                  <motion.a
                    href="/solutions"
                    className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm border border-primary/30 text-foreground font-semibold tracking-[0.15em] uppercase text-sm transition-all hover:border-primary/60 hover:bg-primary/5"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Découvrir nos solutions
                  </motion.a>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
        <WelcomeBanner />
      </div>
    </PageTransition>
  );
};

export default Index;
