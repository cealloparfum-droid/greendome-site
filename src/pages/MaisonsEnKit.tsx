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
  Crown,
  PartyPopper,
  Globe2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import GoldParticles from "@/components/GoldParticles";
import Marquee from "@/components/Marquee";
import Magnetic from "@/components/Magnetic";
import inventory from "@/data/maisons-kit-inventory.json";

/* ------------------------------------------------------------------
 * Image loader
 * Vite charge automatiquement toutes les images du dossier maisons-kit.
 * On peut ensuite les référencer par leur nom (ex: "1.jpeg").
 * ------------------------------------------------------------------ */
const imageModules = import.meta.glob(
  "@/assets/maisons-kit/*.jpeg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const getImg = (filename: string): string => {
  const entry = Object.entries(imageModules).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  return entry?.[1] ?? "";
};

/* ------------------------------------------------------------------
 * Données des 4 familles — basées sur l'inventaire JSON
 * Chaque famille = titre + description + image hero + galerie + specs
 * ------------------------------------------------------------------ */
const ICON_MAP = {
  Crown,
  Trees,
  Globe2,
  PartyPopper,
} as const;

type FamilyKey = keyof typeof inventory.families;

const familyConfig: Record<
  FamilyKey,
  {
    icon: keyof typeof ICON_MAP;
    heroImage: string;
    galleryImages: string[];
    specs: { label: string; value: string }[];
  }
> = {
  pavillons: {
    icon: "Crown",
    heroImage: "35.jpeg",
    galleryImages: ["1.jpeg", "20.jpeg", "32.jpeg", "36.jpeg", "4.jpeg", "8.jpeg"],
    specs: [
      { label: "Surface utile", value: "30 à 500 m²" },
      { label: "Hauteur", value: "Jusqu'à 6 m" },
      { label: "Structure", value: "Acier galvanisé + bois" },
      { label: "Toile", value: "PVC 1050 g/m² tendue" },
    ],
  },
  safari: {
    icon: "Trees",
    heroImage: "17.jpeg",
    galleryImages: [
      "30.jpeg",
      "13.jpeg",
      "19.jpeg",
      "31.jpeg",
      "27.jpeg",
      "34.jpeg",
    ],
    specs: [
      { label: "Surface utile", value: "20 à 80 m²" },
      { label: "Configurations", value: "1 à 3 chambres" },
      { label: "Structure", value: "Bois + acier galvanisé" },
      { label: "Toile", value: "Toile 900D + PVC 850 g" },
    ],
  },
  domes: {
    icon: "Globe2",
    heroImage: "12.jpeg",
    galleryImages: ["6.jpeg", "3.jpeg", "14.jpeg", "29.jpeg", "40.jpeg", "39.jpeg"],
    specs: [
      { label: "Diamètre", value: "3 à 40 m" },
      { label: "Surface utile", value: "Jusqu'à 1 250 m²" },
      { label: "Toile", value: "Membrane PVC 1050 g/m²" },
      { label: "Vitrages", value: "Façades verre trempé" },
    ],
  },
  evenementiel: {
    icon: "PartyPopper",
    heroImage: "9.jpeg",
    galleryImages: ["10.jpeg", "5.jpeg", "7.jpeg", "24.jpeg"],
    specs: [
      { label: "Capacité", value: "20 à 300 convives" },
      { label: "Dimensions", value: "6 × 6 m à 20 × 20 m" },
      { label: "Montage", value: "1 à 3 jours" },
      { label: "Usage", value: "Saisonnier ou permanent" },
    ],
  },
};

const families = (
  Object.keys(inventory.families) as FamilyKey[]
).map((key) => ({
  ...inventory.families[key],
  ...familyConfig[key],
}));

/* ------------------------------------------------------------------
 * Matériaux & features (inchangés — qualité Greendome)
 * ------------------------------------------------------------------ */
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
    title: "Jardins & résidences privées",
    text: "Pool-house, suite d'invités, bureau de jardin, atelier d'artiste. Une pièce supplémentaire qui devient la signature de votre lieu.",
  },
  {
    title: "Mariages & réceptions",
    text: "Pavillons de cérémonie, espaces lounge, dîners de prestige — pour vos moments rares, un cadre qui marque les esprits.",
  },
  {
    title: "Hôtellerie & glamping",
    text: "Campings premium, resorts, éco-lodges. Des unités modulaires pour multiplier votre offre d'hébergement sans permis lourd.",
  },
  {
    title: "Restauration & lieux d'accueil",
    text: "Restaurants panoramiques, terrasses couvertes, lounges saisonniers — jusqu'à 300 convives sous une toile d'exception.",
  },
];

/* ------------------------------------------------------------------
 * Page principale
 * ------------------------------------------------------------------ */
const MaisonsEnKitPage = () => {
  usePageMeta({
    title: "Maisons en kit",
    description: "39 modèles : pavillons, lodges safari, dômes géodésiques, tipis. De 2 à 32 personnes, livraison dans plus de 20 pays.",
    path: "/maisons-en-kit",
  });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ============== HERO ============== */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={getImg("35.jpeg")}
            alt="Pavillon double-pic vue mer méditerranée au coucher du soleil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/30" />
        </motion.div>

        {/* Poussière d'or — flottement subtil */}
        <GoldParticles density={35} speed={-0.1} maxOpacity={0.5} />

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
          <p className="max-w-2xl mx-auto text-foreground/75 text-lg md:text-xl font-normal leading-relaxed">
            Pavillons, lodges, dômes &amp; tentes d'exception.
            <br className="hidden md:block" />
            Pour votre jardin, votre domaine ou votre établissement.
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

      {/* ============== INTRO ============== */}
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
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-4">
                Quatre familles, plus de quarante modèles. Du pavillon intime
                au lodge de cinq cents mètres carrés — chaque structure se
                configure en dimensions, toiles et finitions.
              </p>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg">
                <span className="text-foreground/95">Pour les particuliers</span> qui veulent réinventer
                leur jardin, leur résidence secondaire ou leur lieu de réception privé.
                <span className="text-foreground/95"> Pour les professionnels</span> de l'hôtellerie,
                de la restauration et du tourisme qui cherchent une signature forte.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedImage
                src={getImg("25.jpeg")}
                alt="Dôme arche au bord d'un lac en prairie au coucher du soleil"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== SPECS RIBBON ============== */}
      <section className="py-16 md:py-20 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Home, label: "Familles", value: "4 collections" },
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

      {/* ============== MARQUEE SIGNATURE ============== */}
      <Marquee
        items={[
          "Architecture nomade",
          "Sur-mesure intégral",
          "Quatre saisons",
          "Depuis 2018",
          "Artisanat français",
          "Garantie 10–20 ans",
        ]}
        duration={50}
        variant="subtle"
      />

      {/* ============== 4 FAMILLES — alternating image/text + galerie ============== */}
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
              Les quatre collections
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Une gamme,{" "}
              <span className="text-gradient-gold italic">mille possibles</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              De la sphère géodésique au pavillon de réception, chaque famille
              signe une identité.
            </p>
          </motion.div>

          <div className="space-y-32 md:space-y-40">
            {families.map((f, i) => {
              const FamilyIcon = ICON_MAP[f.icon];
              return (
                <div key={f.id} className="space-y-12">
                  {/* hero image + texte alternés */}
                  <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className={i % 2 === 1 ? "md:order-2" : ""}
                    >
                      <AnimatedImage
                        src={getImg(f.heroImage)}
                        alt={f.title}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={i % 2 === 1 ? "md:order-1" : ""}
                    >
                      <div className="divider-gold !mx-0 mb-6" />
                      <div className="flex items-center gap-3 mb-3">
                        <FamilyIcon className="w-5 h-5 text-primary" />
                        <p className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
                          {f.tag}
                        </p>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
                        {f.title}
                      </h3>
                      <p className="text-lg md:text-xl text-foreground/85 font-light italic mb-6">
                        {f.subtitle}
                      </p>
                      <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                        {f.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {f.specs.map((sp) => (
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

                  {/* galerie complète — tous les modèles */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
                        Galerie complète — {f.count} modèles
                      </p>
                      <div className="hidden md:block flex-1 h-px bg-border/40 mx-6" />
                      <p className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
                        {f.tag}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
                    >
                      {f.images.map((imgData, j) => (
                        <motion.div
                          key={imgData.src}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: (j % 4) * 0.06 }}
                          whileHover={{ y: -4 }}
                          className="group relative overflow-hidden rounded-sm border border-border/30 aspect-[4/3]"
                        >
                          <img
                            src={getImg(imgData.src)}
                            alt={imgData.caption}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-[10px] md:text-xs text-primary tracking-[0.2em] uppercase mb-1 font-semibold">
                              {imgData.context}
                            </p>
                            <p className="text-xs md:text-sm text-foreground/90 font-normal leading-snug">
                              {imgData.caption}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== PARALLAXE PLEINE LARGEUR ============== */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <img
            src={getImg("33.jpeg")}
            alt="Tente safari pyramidale dans la savane au crépuscule"
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
            <p className="max-w-xl mx-auto text-foreground/75 text-lg font-normal leading-relaxed italic">
              « De la canicule estivale aux blizzards alpins —
              nos structures traversent les saisons sans jamais s'altérer. »
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== MATÉRIAUX ============== */}
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
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Endurance, résistance aux éléments, empreinte minimale.
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
                <p className="text-foreground/75 font-normal leading-relaxed text-sm">
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

      {/* ============== APPLICATIONS ============== */}
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
              Pour qui, pour quoi
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Particuliers{" "}
              <span className="text-gradient-gold italic">&amp; professionnels</span>
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
                <p className="text-foreground/80 font-normal leading-relaxed text-base">
                  {a.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PERSONNALISATION ============== */}
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
                src={getImg("28.jpeg")}
                alt="Lodge architectural minimaliste sur falaise"
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
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                Dimensions, toiles, menuiseries, coloris, aménagements —
                tout se configure. Notre bureau d'études modélise votre projet
                en 3D avant production. Vous validez, nous fabriquons.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Ruler className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Dimensions à la carte
                    </p>
                    <p className="text-sm text-foreground/85 font-normal">
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
                    <p className="text-sm text-foreground/85 font-normal">
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
                    <p className="text-sm text-foreground/85 font-normal">
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

      {/* ============== CTA ============== */}
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
            <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-10">
              Un jardin, un domaine, un établissement — racontez-nous votre lieu.
              Modèle adapté, chiffrage sur-mesure et rendu 3D avant production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Magnetic strength={0.3} className="inline-block">
                <motion.a
                  href="/contact"
                  className="inline-block px-10 py-4 rounded-sm bg-primary text-primary-foreground text-sm font-semibold tracking-[0.2em] uppercase hover:glow-gold transition-shadow"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Imaginons votre projet
                </motion.a>
              </Magnetic>
              <Magnetic strength={0.3} className="inline-block">
                <motion.a
                  href="/solutions"
                  className="inline-block px-10 py-4 rounded-sm border border-primary/40 text-foreground/80 text-sm font-semibold tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Nos solutions →
                </motion.a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MaisonsEnKitPage;
