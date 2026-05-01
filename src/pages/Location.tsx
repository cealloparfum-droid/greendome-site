import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Download, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import { Button } from "@/components/ui/button";
import locationImg from "@/assets/dome-event.png";

const LocationPage = () => {
  usePageMeta({
    title: "Location",
    description: "Louez un dôme Greendome pour mariage, séminaire ou événement privé. Livraison, installation, démontage clé en main.",
    path: "/location",
  });
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
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Louez nos dômes pour vos événements, escapades insolites ou occasions spéciales
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
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                Mariage sous les étoiles, lancement de produit, dîner gastronomique en plein air ou week-end insolite : nos dômes sont disponibles à la location. Nous prenons en charge la livraison, l'installation et le démontage — vous vous concentrez sur l'essentiel : créer des souvenirs inoubliables.
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <div className="divider-gold mb-6" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Download className="w-6 h-6 text-primary" />
              <span className="text-sm text-primary tracking-wider uppercase font-semibold">Catalogues 2026</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              Téléchargez nos{" "}
              <span className="text-gradient-gold italic">catalogues</span>
            </h2>
            <p className="text-foreground/85 font-normal leading-relaxed text-lg">
              Trois catalogues d'inspiration et de spécifications techniques&nbsp;: dômes transparents, jacuzzis signature et mobilier d'auteur. Chaque pièce documentée, chaque dimension précisée — pour préparer votre projet en toute sérénité.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Dômes",
                subtitle: "Lignées, capsules, suites",
                description: "22 pages — 13 modèles de dômes transparents, des compositions doubles aux capsules signature.",
                file: "/Greendome-Catalogue-Domes-2026.pdf",
                size: "37 Mo",
              },
              {
                title: "Jacuzzis",
                subtitle: "Bains scénographiés",
                description: "Notre sélection de jacuzzis signature, intégrations sur-mesure et finitions pierre, bois, métal.",
                file: "/Greendome-Catalogue-Jacuzzis-2026.pdf",
                size: "44 Mo",
              },
              {
                title: "Mobilier",
                subtitle: "Quinze pièces, une grammaire",
                description: "24 pages — 10 canapés, 1 fauteuil et 5 lits déclinés en velours côtelé, bouclette et lin lavé.",
                file: "/Greendome-Catalogue-Mobilier-2026.pdf",
                size: "18 Mo",
              },
            ].map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="surface-glass p-8 md:p-10 rounded-sm flex flex-col"
              >
                <div className="divider-gold !mx-0 mb-5" />
                <span className="text-xs text-primary tracking-[0.18em] uppercase font-semibold mb-2">{cat.subtitle}</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Catalogue <span className="text-gradient-gold italic">{cat.title}</span>
                </h3>
                <p className="text-foreground/80 font-normal leading-relaxed mb-8 flex-1">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <Button asChild className="gap-2 tracking-wider uppercase text-sm font-semibold">
                    <a href={cat.file} download>
                      <Download className="w-4 h-4" />
                      Télécharger
                    </a>
                  </Button>
                  <span className="text-xs text-foreground/55 tracking-wider uppercase">PDF · {cat.size}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Intéressé par la <span className="text-gradient-gold italic">location</span> ?
            </h2>
            <p className="text-foreground/85 font-normal mb-8 max-w-lg mx-auto">
              Contactez notre équipe pour composer une expérience sur-mesure adaptée à votre événement.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.15em] uppercase text-sm transition-shadow hover:glow-gold"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Phone className="w-4 h-4" />
              Imaginons votre projet
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationPage;
