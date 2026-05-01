import { motion } from "framer-motion";
import { Home, Star, Users, TreePine, Moon, Coffee } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import gardenImg from "@/assets/dome-desert.png";
import starsImg from "@/assets/dome-etoiles.png";

const ParticuliersPage = () => {
  usePageMeta({
    title: "Particuliers",
    description: "Sublimez votre jardin avec un dôme transparent ou un jacuzzi signature. Conseil sur-mesure pour résidences privées.",
    path: "/particuliers",
  });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 md:py-28 pt-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="divider-gold mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Solutions pour les{" "}
              <span className="text-gradient-gold italic">Particuliers</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Votre sanctuaire privé, directement chez vous
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
                <Home className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary tracking-wider uppercase font-semibold">Résidentiel</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Votre{" "}
                <span className="text-gradient-gold italic">sanctuaire privé</span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                Transformez votre extérieur en un véritable sanctuaire privé. Nos maisons-dômes transparentes ne sont pas réservées aux professionnels : elles s'intègrent parfaitement dans les jardins, les villas, les fermes rénovées ou sur les grandes terrasses. La solution idéale pour créer un havre de paix, à l'écart de l'agitation, et retrouver la sérénité chez soi.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <TreePine className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Jardins & Terrasses</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Home className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Villas & Fermes</span>
                </motion.div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <AnimatedImage src={gardenImg} alt="Dôme transparent installé dans un jardin privé au crépuscule" />
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
                <Star className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary tracking-wider uppercase font-semibold">Vie sous les étoiles</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Dormez sous{" "}
                <span className="text-gradient-gold italic">les étoiles</span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                Imaginez une pièce de vie supplémentaire où l'on regarde les nuages défiler le jour, puis les étoiles et la lune la nuit. Nos modèles compacts, conçus pour 2 à 6 personnes, sont parfaits pour aménager un salon de thé extérieur, un jardin d'hiver ou une chambre d'amis atypique — pour s'endormir sous un morceau de ciel étoilé. Une façon unique de réinventer votre lieu de vie, en renouant un lien profond avec la nature.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">2 à 6 personnes</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Coffee className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Salon de thé</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Moon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Jardin d'hiver</span>
                </motion.div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:order-1">
              <AnimatedImage src={starsImg} alt="Couple observant les étoiles depuis un dôme transparent dans un jardin" />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ParticuliersPage;
