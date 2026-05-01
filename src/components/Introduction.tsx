import { motion } from "framer-motion";
import AnimatedImage from "@/components/AnimatedImage";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Users, Globe, Star } from "lucide-react";
import domeNight from "@/assets/dome-etoiles.png";
import domeRestaurant from "@/assets/dome-restaurant.png";

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } },
};

const Introduction = () => {
  return (
    <section id="decouvrir" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* First block */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div>
            <div className="divider-gold !mx-0 mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Des bulles haut de gamme pour{" "}
              <span className="text-gradient-gold italic">transformer</span>{" "}
              vos espaces
            </h2>
            <p className="text-foreground/85 font-normal leading-relaxed text-lg">
              Nous proposons aux professionnels des bulles transparentes haut de gamme, conçues pour transformer n'importe quel environnement extérieur en un espace de vie spectaculaire. Que vous gériez un village vacances, organisiez des salons ou teniez un restaurant, nos dômes vous offrent une solution unique pour vous démarquer.
            </p>
          </div>

          <AnimatedImage src={domeRestaurant} alt="Dôme transparent utilisé comme restaurant en plein air" />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-3 gap-6 mb-24 md:mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { icon: Users, value: 32, suffix: "", label: "Capacité max. personnes", prefix: "Jusqu'à " },
            { icon: Globe, value: 20, suffix: "+", label: "Pays livrés" },
            { icon: Star, value: 500, suffix: "+", label: "Dômes installés" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="text-center surface-glass rounded-sm p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px -15px hsl(38 70% 55% / 0.2)" }}
            >
              <item.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                <AnimatedCounter target={item.value} suffix={item.suffix} prefix={item.prefix} />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground tracking-wider uppercase">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Second block */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <div className="relative md:order-2">
            <AnimatedImage src={domeNight} alt="Dôme transparent sous un ciel étoilé" />
          </div>

          <div className="md:order-1">
            <div className="divider-gold !mx-0 mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Dîner sous les{" "}
              <span className="text-gradient-gold italic">étoiles</span>
            </h2>
            <p className="text-foreground/85 font-normal leading-relaxed text-lg">
              Fini les espaces clos et bruyants. Avec nos structures panoramiques, offrez à vos clients la possibilité de dîner sous un vaste ciel étoilé ou de s'endormir en pleine nature avec tout le confort moderne. Nos solutions sont rapides à déployer, extrêmement résistantes et pensées pour maximiser la rentabilité de vos espaces extérieurs tout au long de l'année.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;
