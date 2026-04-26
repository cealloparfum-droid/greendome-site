import { motion } from "framer-motion";
import {
  Ruler,
  Users,
  Shield,
  Mountain,
  Snowflake,
  Leaf,
  Flame,
  Wrench,
  Hammer,
  Wind,
  CloudRain,
  Sparkles,
  Home,
  Trees,
  Palette,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";

import woodDomeSnow from "@/assets/kit-wood-dome-snow.jpg";
import whiteDomeMeadow from "@/assets/kit-white-dome-meadow.jpg";
import whiteDomeSki from "@/assets/kit-white-dome-ski.jpg";
import lodgeMountain from "@/assets/kit-lodge-mountain.jpg";

const series = [
  {
    tag: "Série Dôme",
    image: whiteDomeMeadow,
    title: "Dôme géodésique",
    subtitle: "La structure emblématique",
    description:
      "Des sphères géodésiques de 3 à 40 mètres de diamètre, personnalisables en dimensions, coloris et configuration. Parfaites pour l'hôtellerie de plein air, le glamping haut de gamme ou les résidences secondaires d'exception.",
    specs: [
      { label: "Diamètre", value: "3 à 40 m" },
      { label: "Surface utile", value: "Jusqu'à 1 250 m²" },
      { label: "Structure", value: "Acier galvanisé thermolaqué" },
      { label: "Toile", value: "Membrane PVC tendue 1050 g/m²" },
    ],
  },
  {
    tag: "Série Lodge",
    image: lodgeMountain,
    title: "Lodge & Pavillons",
    subtitle: "Le raffinement hôtelier",
    description:
      "Structures à toiture pyramidale ou polygonale, de 6 à 34 mètres. Idéales pour les suites de luxe, les restaurants panoramiques ou les espaces de réception. Douze modèles déclinables, tous personnalisables.",
    specs: [
      { label: "Dimensions", value: "6 × 6 m à 16,6 × 34,5 m" },
      { label: "Surface utile", value: "37 à 573 m²" },
      { label: "Hauteur intérieure", value: "2,5 à 3,1 m" },
      { label: "Matériaux", value: "PVC 1050 g + doublage 850 g" },
    ],
  },
  {
    tag: "Série Safari",
    image: whiteDomeSki,
    title: "Safari & Nomade",
    subtitle: "L'évasion authentique",
    description:
      "Tentes safari et structures nomades inspirées du glamping africain — toile toilée, bois brut, esthétique affirmée. Douze modèles conçus pour l'immersion en nature, sans compromis sur le confort.",
    specs: [
      { label: "Dimensions", value: "3 × 3,7 m à 5 × 7 m" },
      { label: "Surface utile", value: "Jusqu'à 45 m²" },
      { label: "Structure", value: "Acier galvanisé + bois traité" },
      { label: "Toile", value: "Toile 900D PEVA + PVC 850 g" },
    ],
  },
];

const materials = [
  {
    icon: Shield,
    title: "Membrane PVC haute résistance",
    text: "Toile tendue PVC 850 à 1050 g/m², plusieurs couches de revêtement imperméable. Transparente ou opaque, au choix.",
  },
  {
    icon: Trees,
    title: "Bois massif traité",
    text: "Bois rond anti-corrosion, haute résistance à la torsion et à la fissuration. Durée de vie dépassant 20 ans en extérieur.",
  },
  {
    icon: Hammer,
    title: "Acier galvanisé thermolaqué",
    text: "Tubes d'acier à paroi renforcée, galvanisation anti-rouille, finition peinture cuite. Tenue garantie au-delà de 10 ans.",
  },
  {
    icon: Leaf,
    title: "Toile technique 900D",
    text: "Tissu PEVA écologique résistant aux intempéries, aux déchirures, antibactérien et autonettoyant. Confort respirant.",
  },
];

const features = [
  { icon: Wind, label: "Résistance au vent" },
  { icon: CloudRain, label: "Étanchéité intégrale" },
  { icon: Flame, label: "Classement feu M1" },
  { icon: Sparkles, label: "Anti-UV longue durée" },
  { icon: Snowflake, label: "Charge neige renforcée" },
  { icon: Home, label: "Usage 4 saisons" },
];

const applications = [
  {
    title: "Hôtellerie de plein air",
    text: "Campings premium, resorts, villages vacances. Des unités modulaires pour multiplier votre offre d'hébergement sans permis lourd.",
  },
  {
    title: "Résidences d'exception",
    text: "Chalets de montagne, pool-houses, bureaux de jardin, suites indépendantes pour propriétés privées à fort caractère.",
  },
  {
    title: "Événementiel & restauration",
    text: "Restaurants panoramiques, salles de réception, pavillons de mariage, espaces VIP saisonniers pouvant accueillir jusqu'à 300 convives.",
  },
  {
    title: "Tourisme nature",
    text: "Éco-lodges, refuges, expériences glamping. Une empreinte minimale pour une expérience maximale.",
  },
];

const MaisonsEnKitPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={woodDomeSnow}
            alt="Dôme bois haut de gamme en montagne enneigée"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/25 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 container mx-auto px-6 text-center"
        >
          <div className="divider-gold mb-8" />
          <p className="text-xs md:text-sm text-primary tracking-[0.4em] uppercase mb-6 font-semibold">
            Nouvelle collection
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
            Habiter{" "}
            <span className="text-gradient-gold italic">la nature</span>
            <br />
            autrement
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/75 text-lg md:text-xl font-light leading-relaxed">
            Une gamme complète de structures modulaires haut de gamme —
            dômes géodésiques, lodges, tentes safari. Conçues pour durer,
            taillées pour émerveiller.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/60"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xs tracking-[0.3em] uppercase"
          >
            ↓ Découvrir
          </motion.div>
        </motion.div>
      </section>

      {/* Intro */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="divider-gold !mx-0 mb-6" />
              <p className="text-sm text-primary tracking-[0.3em] uppercase font-semibold mb-4">
                L'architecture nomade réinventée
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Des structures{" "}
                <span className="text-gradient-gold italic">
                  qui font rêver
                </span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg mb-6">
                Après dix ans d'expertise dans les dômes transparents,
                Greendome élargit son offre avec une gamme de maisons en kit
                haut de gamme. Cinq séries, plus de quarante modèles, toutes
                personnalisables en dimensions, matières et finitions.
              </p>
              <p className="text-foreground/70 font-light leading-relaxed text-lg">
                Chaque structure est pensée pour un montage rapide, une
                durabilité exceptionnelle et une intégration respectueuse de
                l'environnement naturel. Du pavillon intime de trois mètres
                au lodge de réception de cinq cents mètres carrés.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedImage
                src={whiteDomeMeadow}
                alt="Dôme géodésique dans une prairie alpine"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs ribbon */}
      <section className="py-16 md:py-20 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Home, label: "Séries", value: "5 collections" },
              { icon: Ruler, label: "Diamètre", value: "3 à 40 m" },
              { icon: Users, label: "Capacité", value: "2 à 300 pers." },
              { icon: Wrench, label: "Garantie", value: "10 à 20 ans" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <s.icon className="w-7 h-7 text-primary mb-3" />
                <p className="text-xs text-muted-foreground tracking-[0.25em] uppercase mb-2">
                  {s.label}
                </p>
                <p className="text-lg md:text-xl font-display text-foreground/90">
                  {s.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Series — alternating image/text */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="divider-gold mb-6" />
            <p className="text-sm text-primary tracking-[0.3em] uppercase font-semibold mb-4">
              Les trois collections phares
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Une gamme,{" "}
              <span className="text-gradient-gold italic">
                mille possibles
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
              De la sphère géodésique au lodge pyramidal, chaque structure
              signe une identité.
            </p>
          </motion.div>

          <div className="space-y-24 md:space-y-32">
            {series.map((s, i) => (
              <div
                key={s.title}
                className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
              >
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={i % 2 === 1 ? "md:order-2" : ""}
                >
                  <AnimatedImage src={s.image} alt={s.title} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={i % 2 === 1 ? "md:order-1" : ""}
                >
                  <div className="divider-gold !mx-0 mb-6" />
                  <p className="text-xs text-primary tracking-[0.3em] uppercase font-semibold mb-3">
                    {s.tag}
                  </p>
                  <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
                    {s.title}
                  </h3>
                  <p className="text-lg md:text-xl text-foreground/70 font-light italic mb-6">
                    {s.subtitle}
                  </p>
                  <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                    {s.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {s.specs.map((sp) => (
                      <div
                        key={sp.label}
                        className="surface-glass p-4 rounded-sm border border-border/40"
                      >
                        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-1">
                          {sp.label}
                        </p>
                        <p className="text-sm text-foreground/85 font-display">
                          {sp.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullwidth parallax */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <img
            src={whiteDomeSki}
            alt="Dôme en station de ski sous la neige"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/20" />
        </motion.div>
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-3xl text-center"
          >
            <p className="text-sm text-primary tracking-[0.4em] uppercase mb-6 font-semibold">
              Quatre saisons
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Conçues pour{" "}
              <span className="text-gradient-gold italic">tout climat</span>
            </h2>
            <p className="max-w-xl mx-auto text-foreground/75 text-lg font-light leading-relaxed italic">
              « De la canicule estivale aux tempêtes de neige alpines —
              nos structures traversent les saisons sans jamais s'altérer. »
            </p>
          </motion.div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-24 md:py-32 bg-card/20 border-y border-border/40">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="divider-gold mb-6" />
            <p className="text-sm text-primary tracking-[0.3em] uppercase font-semibold mb-4">
              Matériaux d'exception
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Une exigence{" "}
              <span className="text-gradient-gold italic">de durabilité</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
              Chaque composant est sélectionné pour son endurance, sa
              résistance aux éléments et son impact environnemental minimal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
            {materials.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="surface-glass p-7 rounded-sm border border-border/40 group"
              >
                <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3 leading-tight">
                  {m.title}
                </h3>
                <p className="text-foreground/60 font-light leading-relaxed text-sm">
                  {m.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Features chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-2 surface-glass px-5 py-3 rounded-sm border border-border/40"
              >
                <f.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/80 tracking-wide">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="divider-gold mb-6" />
            <p className="text-sm text-primary tracking-[0.3em] uppercase font-semibold mb-4">
              Tous les projets
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Quatre univers,{" "}
              <span className="text-gradient-gold italic">mille usages</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {applications.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.15 }}
                whileHover={{ y: -4 }}
                className="surface-glass p-8 md:p-10 rounded-sm border border-border/40"
              >
                <Mountain className="w-6 h-6 text-primary mb-5" />
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {a.title}
                </h3>
                <p className="text-foreground/65 font-light leading-relaxed text-base">
                  {a.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className="py-24 md:py-32 bg-card/20 border-y border-border/40">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AnimatedImage
                src={lodgeMountain}
                alt="Lodge pyramidal haut de gamme en montagne"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="divider-gold !mx-0 mb-6" />
              <p className="text-sm text-primary tracking-[0.3em] uppercase font-semibold mb-4">
                Sur-mesure intégral
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Votre projet,{" "}
                <span className="text-gradient-gold italic">
                  votre signature
                </span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-lg mb-8">
                Dimensions, toiles, menuiseries, coloris, aménagements
                intérieurs : tout se configure. Notre bureau d'études conçoit
                des modèles 3D avant production, pour valider votre vision
                avant le moindre coup de marteau.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Ruler className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Dimensions à la carte
                    </p>
                    <p className="text-sm text-foreground/60 font-light">
                      De 3 à 40 mètres, formes rondes, carrées, polygonales
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Palette className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Finitions personnalisées
                    </p>
                    <p className="text-sm text-foreground/60 font-light">
                      Toile opaque, transparente, colorée, bois naturel,
                      métal laqué
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Wrench className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Visualisation 3D avant production
                    </p>
                    <p className="text-sm text-foreground/60 font-light">
                      Rendus photoréalistes de votre projet, par nos
                      designers
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="divider-gold mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
              Donnons forme{" "}
              <span className="text-gradient-gold italic">à votre projet</span>
            </h2>
            <p className="text-foreground/70 font-light leading-relaxed text-lg mb-10">
              Parlez-nous de votre site, de votre usage, de vos envies.
              Notre équipe vous propose un modèle adapté, un chiffrage
              sur-mesure et un rendu 3D du projet fini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-10 py-4 rounded-sm bg-primary text-primary-foreground text-sm font-semibold tracking-[0.2em] uppercase hover:glow-gold transition-shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Demander un devis
              </motion.a>
              <motion.a
                href="/solutions"
                className="px-10 py-4 rounded-sm border border-primary/40 text-foreground/80 text-sm font-semibold tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Nos solutions →
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MaisonsEnKitPage;
