import { motion } from "framer-motion";
import {
  Sofa,
  Armchair,
  BedDouble,
  Sparkles,
  Leaf,
  Palette,
  Ruler,
  Award,
  Home,
  Hotel,
  Heart,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import GoldParticles from "@/components/GoldParticles";
import Marquee from "@/components/Marquee";
import Magnetic from "@/components/Magnetic";
import inventory from "@/data/mobilier-inventory.json";

/* ------------------------------------------------------------------
 * Image loader — Vite glob pour tout /assets/mobilier
 * ------------------------------------------------------------------ */
const imageModules = import.meta.glob(
  "@/assets/mobilier/*.jpeg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const getImg = (filename: string): string => {
  const entry = Object.entries(imageModules).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  return entry?.[1] ?? "";
};

/* ------------------------------------------------------------------
 * Données des 3 collections — basées sur l'inventaire JSON
 * ------------------------------------------------------------------ */
const ICON_MAP = {
  Sofa,
  Armchair,
  BedDouble,
} as const;

type CollectionKey = keyof typeof inventory.collections;

const collectionConfig: Record<
  CollectionKey,
  {
    icon: keyof typeof ICON_MAP;
    heroImage: string;
    galleryImages: string[];
    specs: { label: string; value: string }[];
  }
> = {
  canapes: {
    icon: "Sofa",
    heroImage: "12.jpeg",
    galleryImages: [
      "8.jpeg",
      "11.jpeg",
      "15.jpeg",
      "22.jpeg",
      "23.jpeg",
      "24.jpeg",
    ],
    specs: [
      { label: "Tissus", value: "Velours, bouclé, lin" },
      { label: "Configurations", value: "2 à 5 places, modulaires" },
      { label: "Personnalisation", value: "Coloris & dimensions" },
      { label: "Garantie", value: "5 ans structure" },
    ],
  },
  fauteuils: {
    icon: "Armchair",
    heroImage: "26.jpeg",
    galleryImages: [
      "2.jpeg",
      "6.jpeg",
      "18.jpeg",
      "30.jpeg",
      "33.jpeg",
      "38.jpeg",
    ],
    specs: [
      { label: "Styles", value: "Iconiques & contemporains" },
      { label: "Coloris", value: "Plus de 30 teintes" },
      { label: "Format", value: "Standard ou XL" },
      { label: "Confort", value: "Mousse haute résilience" },
    ],
  },
  lits: {
    icon: "BedDouble",
    heroImage: "53.jpeg",
    galleryImages: [
      "39.jpeg",
      "42.jpeg",
      "43.jpeg",
      "47.jpeg",
      "48.jpeg",
      "52.jpeg",
    ],
    specs: [
      { label: "Dimensions", value: "140 à 200 cm" },
      { label: "Matelas", value: "Inclus, haute densité" },
      { label: "Têtes de lit", value: "Capitonnée ou sculptée" },
      { label: "Coffre", value: "Rangement intégré" },
    ],
  },
};

const collections = (
  Object.keys(inventory.collections) as CollectionKey[]
).map((key) => ({
  ...inventory.collections[key],
  ...collectionConfig[key],
}));

/* ------------------------------------------------------------------
 * Matériaux & savoir-faire
 * ------------------------------------------------------------------ */
const materials = [
  {
    icon: Leaf,
    title: "Velours côtelé naturel",
    text: "Coton brossé tissé serré, toucher chaleureux et matière éco-responsable. Un classique italien revisité, intemporel et durable.",
  },
  {
    icon: Sparkles,
    title: "Bouclé moelleux",
    text: "Maille frisée fine, douceur enveloppante. Idéal pour habiller une suite cocon ou un salon de réception feutré.",
  },
  {
    icon: Award,
    title: "Mousses haute densité",
    text: "Garnissage HR 35 kg/m³ multicouche. Maintien parfait sur la durée, mémoire de forme certifiée — un confort qui ne s'affaisse pas.",
  },
  {
    icon: Wrench,
    title: "Structure bois massif",
    text: "Hêtre & sapin séchés, assemblage tourillonné. Une carcasse qui traverse les générations, garantie 5 ans sur l'ossature.",
  },
];

/* ------------------------------------------------------------------
 * Palette de coloris — 14 teintes inspirées du nuancier catalogue
 * Velours côtelé, bouclé, lin lavé — déclinés sur les trois collections
 * ------------------------------------------------------------------ */
const palette = [
  { name: "Crème", hex: "#EEE5D8", family: "Naturels" },
  { name: "Ivoire", hex: "#EFE7D5", family: "Naturels" },
  { name: "Blanc nacré", hex: "#F4EDDC", family: "Naturels" },
  { name: "Sable", hex: "#BCA987", family: "Naturels" },
  { name: "Gris perle", hex: "#C5C0B8", family: "Gris & Pierres" },
  { name: "Gris colombe", hex: "#ADADA8", family: "Gris & Pierres" },
  { name: "Champignon", hex: "#968D80", family: "Gris & Pierres" },
  { name: "Taupe", hex: "#8E8276", family: "Gris & Pierres" },
  { name: "Anthracite", hex: "#383C40", family: "Gris & Pierres" },
  { name: "Noir velours", hex: "#1F2024", family: "Profonds" },
  { name: "Bleu nuit", hex: "#2C3650", family: "Profonds" },
  { name: "Vert sauge", hex: "#5C6242", family: "Profonds" },
  { name: "Safran", hex: "#C8841F", family: "Couleurs" },
  { name: "Rose poudré", hex: "#DBB5B0", family: "Couleurs" },
];

const usages = [
  {
    icon: Home,
    title: "Particuliers",
    text: "Salons, suites parentales, dressings d'invités. Pour redessiner votre intérieur avec des pièces qui ont une âme — sans les délais et le prix d'une grande maison parisienne.",
  },
  {
    icon: Hotel,
    title: "Hôtellerie & glamping",
    text: "Aménager vos chambres, suites, lobbies, lounges. Compositions complètes — du canapé au lit, du fauteuil signature à la méridienne — pour signer une expérience d'exception.",
  },
  {
    icon: Heart,
    title: "Restauration & lounge",
    text: "Banquettes, fauteuils, méridiennes pour vos espaces de réception, terrasses couvertes ou bars d'hôtel. Tissus traités feu sur demande.",
  },
];

/* ------------------------------------------------------------------
 * Page principale
 * ------------------------------------------------------------------ */
const MobilierAmenagementPage = () => {
  usePageMeta({
    title: "Mobilier signature",
    description: "Canapés bouclé, fauteuils velours, lits king, tables travertin. Mobilier d'exception pour vos espaces premium.",
    path: "/mobilier",
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
            src={getImg("23.jpeg")}
            alt="Canapé courbe organique bouclé cream dans salon contemporain"
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
            Mobilier & Aménagement
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
            Habiter,{" "}
            <span className="text-gradient-gold italic">recevoir,</span>
            <br />
            se reposer
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/85 text-lg md:text-xl font-normal leading-relaxed">
            Canapés, fauteuils & lits d'exception.
            <br className="hidden md:block" />
            Pour vos suites, vos salons ou simplement chez vous.
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
                Une collection complète
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Le mobilier{" "}
                <span className="text-gradient-gold italic">
                  qui prolonge la nature
                </span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-4">
                Aux dômes, jacuzzis et pavillons Greendome, nous ajoutons aujourd'hui
                ce qui les habite : du mobilier choisi avec la même exigence —
                matières nobles, lignes intemporelles, confort sans compromis.
              </p>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg">
                <span className="text-foreground/95">Pour les particuliers</span>{" "}
                qui rêvent d'un intérieur signature sans les délais d'une commande sur-mesure.{" "}
                <span className="text-foreground/95">Pour les professionnels</span>{" "}
                qui équipent suites, lounges et espaces de réception en toute cohérence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedImage
                src={getImg("8.jpeg")}
                alt="Grand canapé d'angle modulaire velours brossé cream"
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
              { icon: Sofa, label: "Collections", value: "3 univers" },
              { icon: Sparkles, label: "Modèles", value: "53 références" },
              { icon: Palette, label: "Coloris", value: "30+ teintes" },
              { icon: Award, label: "Garantie", value: "5 ans" },
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
          "Velours côtelés",
          "Bouclés moelleux",
          "Lignes organiques",
          "53 pièces signature",
          "Sur-mesure",
          "Tissus haut de gamme",
        ]}
        duration={50}
        variant="subtle"
        reverse
      />

      {/* ============== 3 COLLECTIONS ============== */}
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
              Les trois univers
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Trois collections,{" "}
              <span className="text-gradient-gold italic">une signature</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Du canapé d'auteur au lit d'exception — une cohérence d'esthétique
              et d'exigence, du salon à la chambre.
            </p>
          </motion.div>

          <div className="space-y-32 md:space-y-40">
            {collections.map((c, i) => {
              const CollectionIcon = ICON_MAP[c.icon];
              return (
                <div key={c.id} className="space-y-12">
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
                        src={getImg(c.heroImage)}
                        alt={c.title}
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
                        <CollectionIcon className="w-5 h-5 text-primary" />
                        <p className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
                          {c.tag}
                        </p>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
                        {c.title}
                      </h3>
                      <p className="text-lg md:text-xl text-foreground/85 font-light italic mb-6">
                        {c.subtitle}
                      </p>
                      <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                        {c.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {c.specs.map((sp) => (
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
                        Galerie complète — {c.count} modèles
                      </p>
                      <div className="hidden md:block flex-1 h-px bg-border/40 mx-6" />
                      <p className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
                        {c.tag}
                      </p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
                    >
                      {c.images.map((imgData, j) => (
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
            src={getImg("46.jpeg")}
            alt="Lit velours côtelé gris avec sculpture art contemporain"
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
              Esthétique & Confort
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Un même{" "}
              <span className="text-gradient-gold italic">souci du détail</span>
            </h2>
            <p className="max-w-xl mx-auto text-foreground/85 text-lg font-normal leading-relaxed italic">
              «&nbsp;Habiter avec exigence, recevoir avec élégance,
              dormir comme dans un nuage. Trois engagements, une seule signature.&nbsp;»
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
              Matières & Savoir-faire
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Un confort{" "}
              <span className="text-gradient-gold italic">qui dure</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Tissus européens, mousses certifiées, structures en bois massif —
              chaque pièce est conçue pour durer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
        </div>
      </section>

      {/* ============== PALETTE DE COLORIS ============== */}
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
              Tissus & Coloris
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Quatorze teintes,{" "}
              <span className="text-gradient-gold italic">une infinité d'ambiances</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Chaque modèle de notre collection se décline dans la même palette de
              velours côtelés et bouclés. Composez votre univers — du naturel
              minéral aux profondeurs feutrées.
            </p>
          </motion.div>

          {/* Palette principale — grille de 14 swatches */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-5 mb-12"
          >
            {palette.map((color, i) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -6, scale: 1.04 }}
                className="group flex flex-col items-center"
              >
                <div
                  className="w-full aspect-square rounded-sm border border-border/40 shadow-lg group-hover:shadow-2xl transition-shadow relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* effet velours côtelé : rayures subtiles */}
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 2px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 5px)",
                    }}
                  />
                  {/* reflet doux */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />
                </div>
                <p className="mt-3 text-xs md:text-sm text-foreground/90 font-display tracking-wide text-center">
                  {color.name}
                </p>
                <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mt-0.5">
                  {color.family}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Note tissus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center surface-glass p-6 md:p-8 rounded-sm border border-border/40"
          >
            <p className="text-foreground/85 font-normal leading-relaxed text-base md:text-lg">
              <span className="text-foreground/95 font-semibold">14 coloris standards</span> —
              déclinables sur l'ensemble de la collection. Sur demande, plus de
              <span className="text-foreground/95"> 30 teintes additionnelles</span> : lin lavé,
              chenille, bouclé moelleux, chevron, velours satin. Échantillons
              expédiés sur simple demande.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============== USAGES ============== */}
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

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {usages.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="surface-glass p-8 md:p-10 rounded-sm border border-border/40"
              >
                <u.icon className="w-6 h-6 text-primary mb-5" />
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {u.title}
                </h3>
                <p className="text-foreground/80 font-normal leading-relaxed text-base">
                  {u.text}
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
                src={getImg("43.jpeg")}
                alt="Lit cabriolet cream design nuage moelleux"
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
                Sur-mesure & Coordination
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Composer{" "}
                <span className="text-gradient-gold italic">votre univers</span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-8">
                Notre bureau d'études vous accompagne dans la composition complète
                de votre lieu — du choix des coloris à l'agencement, en passant
                par les rendus 3D. Une cohérence d'ensemble, pour un résultat
                immédiatement signature.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Palette className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Coloris & matières au choix
                    </p>
                    <p className="text-sm text-foreground/85 font-normal">
                      Plus de 30 teintes, du velours côtelé au bouclé, échantillons sur demande
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Ruler className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Dimensions adaptables
                    </p>
                    <p className="text-sm text-foreground/85 font-normal">
                      Versions standard, XL ou modulaires selon votre espace
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Wrench className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      Composition & rendu 3D
                    </p>
                    <p className="text-sm text-foreground/85 font-normal">
                      Visualisez votre projet avant commande — accompagnement décoration
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
              Aménager{" "}
              <span className="text-gradient-gold italic">avec exigence</span>
            </h2>
            <p className="text-foreground/85 font-normal leading-relaxed text-lg mb-10">
              Un salon, une suite, un lieu de réception — racontez-nous votre projet.
              Nous composons une sélection adaptée, avec rendus 3D et chiffrage personnalisé.
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
                  href="/maisons-en-kit"
                  className="inline-block px-10 py-4 rounded-sm border border-primary/40 text-foreground/80 text-sm font-semibold tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Nos maisons en kit →
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

export default MobilierAmenagementPage;
