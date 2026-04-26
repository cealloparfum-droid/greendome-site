import { motion } from "framer-motion";
import { BedDouble, Utensils, Ruler, Users, Lightbulb, Link } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import glampingImg from "@/assets/dome-plage.png";
import eventImg from "@/assets/dome-maldives.png";

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 md:py-28 pt-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="divider-gold mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos Solutions{" "}
              <span className="text-gradient-gold italic">Professionnelles</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
              Des dômes adaptés à chaque secteur d'activité
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="divider-gold !mx-0 mb-6" />
              <div className="flex items-center gap-3 mb-4">
                <BedDouble className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary tracking-wider uppercase font-semibold">Hôtellerie de plein air</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Réinventez la{" "}
                <span className="text-gradient-gold italic">chambre d'hôtes</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                Pour le secteur de l'hôtellerie de plein air, des campings et des villages vacances, nos dômes réinventent la chambre d'hôtes. Nous proposons des modèles allant jusqu'à 5,92 mètres de diamètre, ainsi que des systèmes combinés astucieux. Ces derniers relient une grande bulle principale, servant de chambre spacieuse, à une bulle secondaire dédiée à la salle de bain, créant ainsi une suite luxueuse et totalement autonome. C'est un moyen exclusif d'offrir à vos clients un refuge paisible pour échapper à l'agitation urbaine.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Ruler className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Jusqu'à 5,92 m ⌀</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Link className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Système combiné</span>
                </motion.div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <AnimatedImage src={glampingImg} alt="Suite glamping avec dômes combinés dans la nature" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="md:order-2">
              <div className="divider-gold !mx-0 mb-6" />
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary tracking-wider uppercase font-semibold">Événementiel & Restauration</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Créez{" "}
                <span className="text-gradient-gold italic">l'événement</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                Pour le monde de l'événementiel, des salons professionnels et de la restauration, nos structures créent l'événement. Nos grands modèles à toit ovale peuvent s'étendre jusqu'à 7,35 mètres de long et accueillir jusqu'à 32 convives confortablement. Équipés de bandes lumineuses LED dissimulées, ils se transforment à la nuit tombée en de magnifiques points de rassemblement lumineux. C'est la solution idéale pour concevoir un "Starlight Restaurant" ou un espace de réception VIP qui marquera les esprits.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Ruler className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Jusqu'à 7,35 m</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Jusqu'à 32 convives</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">LED intégrées</span>
                </motion.div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:order-1">
              <AnimatedImage src={eventImg} alt="Grand dôme événementiel illuminé de nuit avec tables de réception" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolutionsPage;
