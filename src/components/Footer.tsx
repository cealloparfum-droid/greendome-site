import { motion } from "framer-motion";
import logo from "@/assets/logo-greendome.jpeg";

const footerLinks = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "À propos" },
  { href: "/technologie", label: "Technologie" },
  { href: "/solutions", label: "Solutions" },
  { href: "/particuliers", label: "Particuliers" },
  { href: "/jacuzzi", label: "Jacuzzi" },
  { href: "/maisons-en-kit", label: "Maisons en kit" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={logo} alt="GREENDOME" className="h-12 w-auto rounded-sm" />
          </motion.a>

          <nav className="flex flex-wrap justify-center gap-6 md:gap-8 text-[12px] text-muted-foreground tracking-[0.15em] uppercase">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-foreground transition-colors duration-300">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="divider-gold w-32" />

          <p className="text-xs text-muted-foreground tracking-wider">
            © 2026 GREENDOME. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
