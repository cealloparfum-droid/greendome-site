import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-greendome.jpeg";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/technologie", label: "Technologie" },
  { href: "/solutions", label: "Solutions Pro" },
  { href: "/particuliers", label: "Particuliers" },
  { href: "/jacuzzi", label: "Jacuzzi" },
  { href: "/maisons-en-kit", label: "Maisons en kit" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-xl bg-background/60"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="GREENDOME" className="h-10 w-auto rounded-sm" />
          </a>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] xl:text-[12px] font-display font-semibold tracking-[0.2em] uppercase text-foreground/60">
            {links.map((link, idx) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="group relative whitespace-nowrap py-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -1 }}
              >
                <span className="relative inline-block transition-[color,letter-spacing] duration-500 ease-out group-hover:text-primary group-hover:tracking-[0.26em]">
                  {link.label}
                </span>
                <span className="pointer-events-none absolute left-1/2 -bottom-0.5 h-px w-[70%] -translate-x-1/2 origin-center scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
                <span className="pointer-events-none absolute left-1/2 -bottom-2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.a
              href="/contact"
              className="group relative hidden md:inline-flex items-center overflow-hidden px-7 py-2.5 rounded-sm border border-primary/70 bg-primary/90 text-primary-foreground text-[11px] font-display font-semibold tracking-[0.3em] uppercase hover:glow-gold transition-all"
              whileHover={{ scale: 1.04, letterSpacing: "0.36em" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="relative z-10">Devis</span>
              <motion.span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                initial={{ x: "-100%" }}
                whileHover={{ x: "350%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </motion.a>

            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground/70"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-foreground/70"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <img src={logo} alt="GREENDOME" className="h-14 rounded-sm mb-4" />
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-lg tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="/contact"
              className="mt-4 px-8 py-3 rounded-sm bg-primary text-primary-foreground text-sm font-semibold tracking-wider uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setMobileOpen(false)}
            >
              Demander un devis
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
