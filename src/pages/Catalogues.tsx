import { motion } from "framer-motion";
import { Download, BookOpen, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import coverDome from "@/assets/catalogue-covers/cover-dome.jpg";
import coverJacuzzi from "@/assets/catalogue-covers/cover-jacuzzi.jpg";
import coverMobilier from "@/assets/catalogue-covers/cover-mobilier.jpg";

type Catalogue = {
  key: string;
  serie: string;
  title: string;
  italic: string;
  cover: string;
  pages: number;
  size: string;
  description: string;
  highlights: string[];
  file: string;
};

const catalogues: Catalogue[] = [
  {
    key: "dome",
    serie: "Architecture",
    title: "Catalogue",
    italic: "Dômes",
    cover: coverDome,
    pages: 22,
    size: "37 Mo",
    description:
      "Treize dômes transparents, des capsules signature aux compositions doubles. Diamètres, surfaces, capacités, lignées scénographiques — la grammaire complète de l'architecture Greendome.",
    highlights: ["13 modèles", "Lignées Stellaire / Atrium / Capsules", "Suites composées"],
    file: "/Greendome-Catalogue-Domes-2026.pdf",
  },
  {
    key: "jacuzzi",
    serie: "Bien-être",
    title: "Catalogue",
    italic: "Jacuzzis",
    cover: coverJacuzzi,
    pages: 24,
    size: "44 Mo",
    description:
      "Bains scénographiés, intégrations sur-mesure et finitions pierre, bois ou métal. Une sélection signature pensée pour villas, hôtels boutique et chalets d'altitude.",
    highlights: ["Modèles ronds & octogonaux", "Intégrations sur-mesure", "Finitions pierre / bois"],
    file: "/Greendome-Catalogue-Jacuzzis-2026.pdf",
  },
  {
    key: "mobilier",
    serie: "Intérieurs",
    title: "Catalogue",
    italic: "Mobilier",
    cover: coverMobilier,
    pages: 24,
    size: "18 Mo",
    description:
      "Quinze pièces, une grammaire. Dix canapés, un fauteuil sculpté, cinq lits — déclinés en velours côtelé, bouclette et lin lavé. Tissé serré, pensé pour durer.",
    highlights: ["10 canapés · 1 fauteuil · 5 lits", "Velours · bouclette · lin lavé", "14 coloris signature"],
    file: "/Greendome-Catalogue-Mobilier-2026.pdf",
  },
];

const CataloguesPage = () => {
  usePageMeta({
    title: "Catalogues 2026",
    description: "Téléchargez gratuitement nos catalogues 2026 : dômes, jacuzzis, mobilier signature.",
    path: "/catalogues",
  });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 md:py-28 pt-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="divider-gold mb-6" />
            <span className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
              Édition 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 mb-6">
              Nos{" "}
              <span className="text-gradient-gold italic">catalogues</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Trois ouvrages d'inspiration et de spécifications techniques. À feuilleter en ligne,
              à conserver, à partager — pour préparer chaque projet avec sérénité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grille des 3 catalogues */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-8">
            {catalogues.map((cat, i) => (
              <motion.article
                key={cat.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col"
              >
                {/* Couverture cliquable — ouvre le PDF dans un nouvel onglet */}
                <a
                  href={cat.file}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block overflow-hidden rounded-sm surface-glass shadow-2xl"
                  aria-label={`Feuilleter le catalogue ${cat.italic} en ligne`}
                >
                  <div className="aspect-[297/210] overflow-hidden">
                    <img
                      src={cat.cover}
                      alt={`Couverture du catalogue Greendome ${cat.italic} 2026`}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Halo doré au survol */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all duration-700"
                  />

                  {/* Sweep doré au survol */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] transition-all duration-1000"
                  />

                  {/* Overlay "Feuilleter" */}
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pb-6">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.25em] uppercase">
                      <BookOpen className="w-4 h-4" />
                      Feuilleter en ligne
                    </span>
                  </div>
                </a>

                {/* Contenu */}
                <div className="mt-7 flex flex-col flex-1">
                  <span className="text-xs text-primary tracking-[0.25em] uppercase font-semibold mb-3">
                    {cat.serie} · {cat.pages} pages
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                    {cat.title}{" "}
                    <span className="text-gradient-gold italic">{cat.italic}</span>
                  </h2>
                  <p className="text-foreground/80 font-normal leading-relaxed mb-5 flex-1">
                    {cat.description}
                  </p>

                  {/* Points-clés */}
                  <ul className="space-y-1.5 mb-7">
                    {cat.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2.5 text-sm text-foreground/75"
                      >
                        <span className="h-px w-4 bg-primary/70 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/40 mt-auto">
                    <Button asChild className="gap-2 tracking-wider uppercase text-xs font-semibold flex-1">
                      <a href={cat.file} download>
                        <Download className="w-4 h-4" />
                        Télécharger
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="gap-2 tracking-wider uppercase text-xs font-semibold flex-1"
                    >
                      <a href={cat.file} target="_blank" rel="noreferrer">
                        <BookOpen className="w-4 h-4" />
                        Feuilleter
                      </a>
                    </Button>
                  </div>
                  <span className="text-[10px] text-foreground/50 tracking-[0.2em] uppercase mt-4">
                    PDF · {cat.size}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bas — projet sur-mesure */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Une pièce, un dôme, un{" "}
              <span className="text-gradient-gold italic">univers</span> sur-mesure ?
            </h2>
            <p className="text-foreground/85 font-normal mb-8 max-w-xl mx-auto">
              Au-delà du catalogue, chaque projet Greendome se compose à la main.
              Partagez-nous votre vision — nous y répondrons avec la nôtre.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-sm transition-shadow hover:glow-gold"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Imaginons votre projet
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CataloguesPage;
