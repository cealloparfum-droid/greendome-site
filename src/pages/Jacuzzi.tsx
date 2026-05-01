import { motion } from "framer-motion";
import {
  Droplets,
  Flame,
  Music,
  Sparkles,
  Users,
  Ruler,
  Waves,
  Shield,
  Leaf,
  Zap,
  Lightbulb,
  Mountain,
  Palmtree,
  Sun,
  Snowflake,
  Building2,
  Grape,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";

import heroImg from "@/assets/jacuzzi-hero-paris.jpg";
import introImg from "@/assets/jacuzzi-intro-sea.jpg";
import squareImg from "@/assets/jacuzzi-square-chalet.jpg";
import roundImg from "@/assets/jacuzzi-round-sea.jpg";
import octagonImg from "@/assets/jacuzzi-octagon-sea.jpg";
import tuscanyImg from "@/assets/jacuzzi-tuscany.jpg";
import mediterraneanImg from "@/assets/jacuzzi-mediterranean.jpg";
import alpsImg from "@/assets/jacuzzi-alps.jpg";
import jungleImg from "@/assets/jacuzzi-jungle.jpg";
import integrationImg from "@/assets/jacuzzi-integration.jpg";
import yachtsImg from "@/assets/jacuzzi-yachts.jpg";
import baliImg from "@/assets/jacuzzi-bali.jpg";
import fullwidthImg from "@/assets/jacuzzi-fullwidth.jpg";
import vineyardRoundImg from "@/assets/jacuzzi-vineyard-round.jpg";
import chaletOctagonImg from "@/assets/jacuzzi-chalet-octagon.jpg";

const collections = [
  {
    name: "Signature Carré",
    subtitle: "L'élégance géométrique",
    image: squareImg,
    description:
      "Une silhouette affirmée qui s'intègre aux terrasses contemporaines comme aux chalets de montagne. Le modèle le plus polyvalent, taillé pour la vie de famille et les grandes tablées.",
    sizes: ["1,85 × 1,85 m", "2,00 × 2,00 m", "2,10 × 2,10 m", "2,16 × 2,16 m"],
    capacity: "4 à 6 personnes",
    jets: "Jusqu'à 63 jets",
  },
  {
    name: "Signature Rond",
    subtitle: "La pureté du cercle",
    image: roundImg,
    description:
      "Une bulle d'intimité absolue. Le format circulaire partage le même horizon entre tous les invités. Idéal pour les espaces contemplatifs où l'esthétique prime.",
    sizes: ["Ø 2,00 m", "Ø 2,20 m"],
    capacity: "4 à 5 personnes",
    jets: "Jusqu'à 38 jets",
  },
  {
    name: "Signature Octogonal",
    subtitle: "L'harmonie architecturale",
    image: octagonImg,
    description:
      "Entre rigueur et fluidité, la forme octogonale offre un équilibre rare. Chaque facette épouse une assise, maximisant le confort tout en signant une présence sculpturale.",
    sizes: ["2,10 × 2,10 m", "2,20 × 2,20 m"],
    capacity: "5 à 6 personnes",
    jets: "Jusqu'à 52 jets",
  },
];

const features = [
  {
    icon: Shield,
    title: "Acrylique Aristech USA",
    text: "Coque acrylique 3,2 mm renforcée fibre de verre 8-10 mm. Durabilité exceptionnelle, surface douce qui traverse les années.",
  },
  {
    icon: Zap,
    title: "Technologie Balboa",
    text: "Panneau de contrôle Balboa importé des USA. Régulation thermique de précision, programmation intuitive, diagnostic complet.",
  },
  {
    icon: Waves,
    title: "Hydromassage sur-mesure",
    text: "Jets 2\", 3,5\" et 4,5\" répartis sur assises et positions allongées. Pompes LP300 double vitesse, expérience spa professionnelle.",
  },
  {
    icon: Flame,
    title: "Chauffage permanent",
    text: "Système de chauffe à température constante avec isolation renforcée 20-30 mm. Votre bain, prêt à toute heure.",
  },
  {
    icon: Sparkles,
    title: "Désinfection ozone",
    text: "Quatre sorties ozone et filtration continue. Une eau pure, limpide, traitée sans produits chimiques agressifs.",
  },
  {
    icon: Lightbulb,
    title: "Ambiance LED & Bluetooth",
    text: "Éclairage sept couleurs, deux enceintes Bluetooth étanches, cascade lumineuse et jeux de lumière programmables.",
  },
];

const specs = [
  { icon: Users, label: "Capacité", value: "Jusqu'à 6 places" },
  { icon: Droplets, label: "Volume d'eau", value: "795 à 1 435 L" },
  { icon: Ruler, label: "Dimensions", value: "1,82 à 2,16 m" },
  { icon: Flame, label: "Chauffage", value: "Constant 1500 W" },
];

const settings = [
  {
    icon: Grape,
    image: tuscanyImg,
    location: "Toscane",
    title: "Au cœur des vignobles",
    description:
      "Le soleil couchant sur les collines italiennes. Une invitation au ralenti, à la contemplation.",
  },
  {
    icon: Sun,
    image: mediterraneanImg,
    location: "Côte d'Azur",
    title: "Face à la Méditerranée",
    description:
      "Horizon infini et brise marine. Le luxe d'un instant suspendu entre ciel et mer.",
  },
  {
    icon: Snowflake,
    image: alpsImg,
    location: "Alpes",
    title: "Sommet enneigé",
    description:
      "La vapeur qui s'élève dans l'air glacé. Une expérience sensorielle d'une puissance rare.",
  },
  {
    icon: Palmtree,
    image: jungleImg,
    location: "Jungle tropicale",
    title: "Évasion exotique",
    description:
      "Végétation luxuriante et sculptures de pierre. L'immersion totale dans un ailleurs hors du temps.",
  },
];

const JacuzziPage = () => {
  usePageMeta({
    title: "Jacuzzis signature",
    description: "8 modèles signature : carrés, ronds, octogonaux. Jusqu'à 63 jets, intégration sur-mesure dans votre lieu.",
    path: "/jacuzzi",
  });
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
            src={heroImg}
            alt="Jacuzzi face à la Tour Eiffel à Paris"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
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
            Nouvelle Collection
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
            L'art du{" "}
            <span className="text-gradient-gold italic">bien-être</span>
            <br />
            en extérieur
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/75 text-lg md:text-xl font-normal leading-relaxed">
            Des spas d'exception taillés pour prolonger l'expérience Greendome.
            Quand la nature rencontre l'ingénierie, le rituel devient souvenir.
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
                Le prolongement du rêve
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Là où l'eau{" "}
                <span className="text-gradient-gold italic">
                  devient rituel
                </span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-6">
                Après le dôme, le spa. Nous avons sélectionné une collection de
                jacuzzis haut de gamme pour sublimer les installations
                Greendome et offrir à vos clients — ou à vous-même — un second
                acte : celui de la détente absolue.
              </p>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg">
                Chaque modèle répond à une exigence unique : celle d'un objet
                conçu pour durer, fabriqué avec des matériaux nobles et pensé
                pour s'inscrire naturellement dans les décors les plus
                raffinés.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedImage
                src={introImg}
                alt="Jacuzzi face à la mer au coucher du soleil"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs ribbon */}
      <section className="py-16 md:py-20 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {specs.map((s, i) => (
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

      {/* Collections */}
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
              Les trois signatures
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Trois silhouettes,{" "}
              <span className="text-gradient-gold italic">un idéal</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Carré, rond ou octogonal — chaque forme répond à un art de vivre.
            </p>
          </motion.div>

          <div className="space-y-20 md:space-y-28">
            {collections.map((c, i) => (
              <motion.article
                key={c.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
              >
                <motion.div
                  className={`relative overflow-hidden rounded-sm ${i % 2 === 1 ? "md:order-2" : ""}`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-[380px] md:h-[520px] object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>

                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="divider-gold !mx-0 mb-6" />
                  <p className="text-xs text-primary tracking-[0.3em] uppercase mb-3 font-semibold">
                    {c.subtitle}
                  </p>
                  <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                    {c.name}
                  </h3>
                  <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 border-t border-border/40">
                    <div className="flex items-start gap-3">
                      <Ruler className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-1">
                          Dimensions
                        </p>
                        <p className="text-sm text-foreground/80">
                          {c.sizes.join(" · ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-1">
                          Capacité
                        </p>
                        <p className="text-sm text-foreground/80">
                          {c.capacity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Waves className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-1">
                          Hydromassage
                        </p>
                        <p className="text-sm text-foreground/80">{c.jets}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
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
            src={fullwidthImg}
            alt="Jacuzzi panoramique face à la mer"
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
              Une expérience
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Plus qu'un spa,{" "}
              <span className="text-gradient-gold italic">
                un horizon
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-foreground/75 text-lg font-normal leading-relaxed italic">
              « L'objet s'efface au profit du paysage. C'est là, précisément,
              que naît l'émotion. »
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
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
              L'excellence dans chaque détail
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Une{" "}
              <span className="text-gradient-gold italic">ingénierie</span> de
              précision
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Matériaux nobles, contrôle professionnel, durabilité éprouvée.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="surface-glass p-8 rounded-sm border border-border/40 group"
              >
                <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-foreground/75 font-normal leading-relaxed text-sm">
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Settings showcase */}
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
              L'art de vivre Greendome
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Des cadres{" "}
              <span className="text-gradient-gold italic">d'exception</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Partout où se pose un jacuzzi Greendome, le décor change. Le
              rituel, lui, reste le même.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {settings.map((s, i) => (
              <motion.article
                key={s.location}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.15 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <motion.img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.9 }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <div className="flex items-center gap-2 mb-3">
                    <s.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
                      {s.location}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {s.title}
                  </h3>
                  <p className="text-foreground/75 font-normal leading-relaxed text-sm md:text-base max-w-md">
                    {s.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Integration section */}
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
                src={integrationImg}
                alt="Jacuzzi encastré dans une terrasse en bois"
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
                Intégration paysagère
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Posé, encastré ou{" "}
                <span className="text-gradient-gold italic">semi-enterré</span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                Chaque projet est pensé en dialogue avec son environnement.
                Notre équipe étudie l'implantation, les accès techniques, le
                raccordement et le traitement des abords pour que le spa
                s'inscrive naturellement dans le décor — plutôt que de s'y
                poser.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="surface-glass p-5 rounded-sm border border-border/40"
                  whileHover={{ y: -3 }}
                >
                  <Building2 className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm font-semibold text-foreground/90 mb-1">
                    Étude technique
                  </p>
                  <p className="text-xs text-foreground/85 font-normal">
                    Fondation, évacuations, accès
                  </p>
                </motion.div>
                <motion.div
                  className="surface-glass p-5 rounded-sm border border-border/40"
                  whileHover={{ y: -3 }}
                >
                  <Leaf className="w-5 h-5 text-primary mb-3" />
                  <p className="text-sm font-semibold text-foreground/90 mb-1">
                    Habillage
                  </p>
                  <p className="text-xs text-foreground/85 font-normal">
                    Bois composite, pierre, terrasse
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Triptych gallery */}
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
              Galerie
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Inspirations{" "}
              <span className="text-gradient-gold italic">de projets</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { src: yachtsImg, alt: "Vue yachts Méditerranée" },
              { src: baliImg, alt: "Jardin tropical Bali" },
              { src: vineyardRoundImg, alt: "Vignoble toscan" },
              { src: chaletOctagonImg, alt: "Chalet alpin octogonal" },
              { src: squareImg, alt: "Terrasse enneigée" },
              { src: mediterraneanImg, alt: "Vue mer infinie" },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-sm group aspect-[4/3]"
              >
                <motion.img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/40">
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
              Un projet,{" "}
              <span className="text-gradient-gold italic">
                une configuration
              </span>
            </h2>
            <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-10">
              Chaque installation est étudiée sur-mesure : dimensions,
              coloris de coque, finitions des jupes en composite bois,
              configuration des jets. Parlons de votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-10 py-4 rounded-sm bg-primary text-primary-foreground text-sm font-semibold tracking-[0.2em] uppercase hover:glow-gold transition-shadow flex items-center gap-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Music className="w-4 h-4" />
                Imaginons votre projet
              </motion.a>
              <motion.a
                href="/solutions"
                className="px-10 py-4 rounded-sm border border-primary/40 text-foreground/80 text-sm font-semibold tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Nos dômes →
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JacuzziPage;
