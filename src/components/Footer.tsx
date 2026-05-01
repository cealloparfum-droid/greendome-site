import { motion } from "framer-motion";
import logo from "@/assets/logo-greendome.jpeg";

const sections = [
  {
    title: "Solutions",
    links: [
      { href: "/jacuzzi", label: "Jacuzzi" },
      { href: "/maisons-en-kit", label: "Maisons en kit" },
      { href: "/mobilier", label: "Mobilier" },
      { href: "/location", label: "Location" },
    ],
  },
  {
    title: "Maison",
    links: [
      { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
      { href: "/technologie", label: "Technologie" },
      { href: "/solutions", label: "Solutions Pro" },
      { href: "/particuliers", label: "Particuliers" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "/contact", label: "Imaginons votre projet" },
      { href: "/catalogues", label: "Catalogues 2026" },
      { href: "mailto:contact@greendome.com", label: "contact@greendome.com" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-border/40 overflow-hidden bg-card/10">
      {/* Watermark GREENDOME */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-8 md:-bottom-16 lg:-bottom-24 select-none text-[22vw] md:text-[18vw] lg:text-[16vw] font-display font-bold tracking-tight leading-[0.85] text-center text-gradient-gold opacity-[0.06]"
        style={{ whiteSpace: "nowrap" }}
      >
        GREENDOME
      </div>

      {/* Ligne dorée animée en haut */}
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="container mx-auto px-6 relative z-10 py-20 md:py-28">
        {/* Tagline cinématographique */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <div className="divider-gold mb-8" />
          <p className="text-[10px] md:text-xs text-primary tracking-[0.4em] uppercase mb-6 font-semibold">
            La maison Greendome
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              Vous racontez votre lieu.
            </motion.span>
            <motion.span
              className="block text-gradient-gold italic mt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              Nous lui donnons forme.
            </motion.span>
          </h2>
        </motion.div>

        {/* Grid 4 colonnes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-10 mb-16 md:mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <a href="/" className="group relative inline-flex w-fit" aria-label="Greendome — Accueil">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -m-4 rounded-md bg-primary/0 group-hover:bg-primary/15 blur-2xl transition-all duration-700"
              />
              {/* Plaque encadrée signature */}
              <span className="relative inline-flex items-center justify-center h-16 px-4 rounded-[3px] bg-black overflow-hidden">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[3px]"
                  style={{
                    padding: "1px",
                    background:
                      "linear-gradient(135deg, hsla(38,75%,55%,0.85) 0%, hsla(38,60%,40%,0.4) 35%, hsla(38,75%,55%,0.85) 65%, hsla(38,60%,40%,0.4) 100%)",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, hsla(38,80%,70%,0.18), transparent)",
                    transform: "skewX(-20deg)",
                  }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "500%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                />
                <img
                  src={logo}
                  alt="GREENDOME"
                  className="relative h-12 w-auto select-none transition-transform duration-500 group-hover:scale-[1.04]"
                  draggable={false}
                />
              </span>
            </a>
            <p className="text-sm text-foreground/65 leading-relaxed font-normal max-w-xs">
              Architecture nomade, dômes transparents et mobilier signature
              pour vos projets d'exception.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <p className="text-[10px] text-primary tracking-[0.35em] uppercase font-display font-semibold mb-5">
                {section.title}
              </p>
              <ul className="space-y-3 text-sm text-foreground/70 font-normal">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 hover:text-primary transition-colors duration-300"
                    >
                      <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-500 ease-out" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-foreground/50 tracking-[0.15em]">
            © 2026 GREENDOME · Tous droits réservés
          </p>
          <p className="text-[10px] text-foreground/40 tracking-[0.35em] uppercase font-display">
            Conçu avec soin
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
