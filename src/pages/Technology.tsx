import { motion } from "framer-motion";
import { ShieldCheck, Sun, Wind, Thermometer, Weight, DoorOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import techImg from "@/assets/dome-logo.png";
import weatherImg from "@/assets/dome-aurore.png";

const specs = [
  { icon: ShieldCheck, label: "Résistance aux chocs", value: "Supérieure au verre trempé" },
  { icon: Sun, label: "Protection UV", value: "99,9 % bloqués" },
  { icon: Thermometer, label: "Plage thermique", value: "-40°C à +120°C" },
  { icon: Wind, label: "Étanchéité", value: "Vent & pluie" },
  { icon: Weight, label: "Poids", value: "2× plus léger que le verre" },
  { icon: DoorOpen, label: "Équipements", value: "Portes, serrures, ventilation" },
];

const TechnologyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 md:py-28 pt-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="divider-gold mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Technologie &{" "}
              <span className="text-gradient-gold italic">Matériaux</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
              L'ingénierie au service du confort et de la sécurité
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
                Polycarbonate{" "}
                <span className="text-gradient-gold italic">haute performance</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg">
                La sécurité et la durabilité sont au cœur de notre conception. Nos bulles sont fabriquées à partir de feuilles de polycarbonate (PC) d'ingénierie à haute performance, un matériau importé reconnu pour sa robustesse exceptionnelle. Sa résistance aux chocs dépasse de plusieurs fois celle du verre trempé ou de l'acrylique ; il s'agit de la même matière utilisée pour concevoir des vitres pare-balles ou des boucliers anti-émeute. Bien qu'il soit ultra-résistant, ce matériau est deux fois plus léger que le verre, ce qui facilite grandement le transport et l'installation sur vos sites.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <AnimatedImage src={techImg} alt="Structure en polycarbonate transparent d'un dôme" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 group"
              >
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <spec.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                </motion.div>
                <div className="text-sm text-muted-foreground tracking-wider uppercase mb-1">{spec.label}</div>
                <div className="text-lg font-display font-semibold text-foreground">{spec.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:order-2">
              <div className="divider-gold !mx-0 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Confort{" "}
                <span className="text-gradient-gold italic">toutes saisons</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg">
                Le confort de vos visiteurs est garanti par une conception thermique et protectrice de pointe. Le polycarbonate utilisé bloque 99,9 % des rayons UV, protégeant ainsi l'intérieur tout en conservant une transparence parfaite. Conçues pour résister aux intempéries, nos structures sont étanches au vent et à la pluie, et peuvent supporter des températures extrêmes allant de -40°C à 120°C. Enfin, chaque dôme est équipé d'une base en aluminium solide, de portes avec serrures et d'un système de circulation d'air frais intégré pour un bien-être absolu.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="md:order-1">
              <AnimatedImage src={weatherImg} alt="Dôme transparent résistant aux conditions hivernales" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnologyPage;
