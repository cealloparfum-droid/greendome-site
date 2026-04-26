import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Download, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import { Button } from "@/components/ui/button";
import locationImg from "@/assets/dome-event.png";
import locationImg2 from "@/assets/dome-restaurant.png";

const LocationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 md:py-28 pt-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="divider-gold mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Espace{" "}
              <span className="text-gradient-gold italic">Location</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
              Louez nos dômes pour vos événements, séjours éphémères ou occasions spéciales
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
                <CalendarDays className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary tracking-wider uppercase font-semibold">Location événementielle</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Un dôme pour chaque{" "}
                <span className="text-gradient-gold italic">occasion</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                Que ce soit pour un mariage sous les étoiles, un lancement de produit exclusif, un dîner gastronomique en plein air ou un week-end insolite, nos dômes sont disponibles à la location. Nous nous occupons de l'installation, de la livraison et du démontage pour que vous puissiez vous concentrer sur l'essentiel : créer des souvenirs inoubliables.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Location courte durée</span>
                </motion.div>
                <motion.div className="flex items-center gap-2 surface-glass px-4 py-2 rounded-sm" whileHover={{ scale: 1.05, y: -2 }}>
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Livraison & Installation</span>
                </motion.div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <AnimatedImage src={locationImg} alt="Dôme transparent disponible à la location pour événements" />
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
                <Download className="w-6 h-6 text-primary" />
                <span className="text-sm text-primary tracking-wider uppercase font-semibold">Catalogue</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                Téléchargez notre{" "}
                <span className="text-gradient-gold italic">catalogue</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                Découvrez l'ensemble de nos modèles, dimensions et configurations disponibles dans notre catalogue complet. De nos dômes ronds compacts aux vastes structures ovales, retrouvez toutes les spécifications techniques pour choisir la solution idéale pour votre projet.
              </p>
              <Button
                asChild
                className="gap-2 tracking-wider uppercase text-sm font-semibold"
              >
                <a href="/catalogue_greendome.pdf" download>
                  <Download className="w-4 h-4" />
                  Télécharger le catalogue
                </a>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:order-1">
              <AnimatedImage src={locationImg2} alt="Dôme luxueux sous les aurores boréales" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Intéressé par la <span className="text-gradient-gold italic">location</span> ?
            </h2>
            <p className="text-foreground/60 font-light mb-8 max-w-lg mx-auto">
              Contactez notre équipe pour obtenir un devis personnalisé adapté à votre événement.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.15em] uppercase text-sm transition-shadow hover:glow-gold"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone className="w-4 h-4" />
              Demander un devis
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationPage;
