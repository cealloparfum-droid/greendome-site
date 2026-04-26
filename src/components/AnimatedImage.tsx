import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const AnimatedImage = ({ src, alt, className = "" }: AnimatedImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={`overflow-hidden rounded-sm glow-gold cursor-pointer group ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={() => setIsOpen(true)}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-80 md:h-[28rem] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          initial={{ scale: 1.15, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 rounded-full surface-glass flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.img
              src={src}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-sm glow-gold"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedImage;
