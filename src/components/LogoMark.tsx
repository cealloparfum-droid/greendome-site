import { useEffect, useRef, useState } from "react";
import logoSrc from "@/assets/logo-greendome.jpeg";

/**
 * LogoMark — affiche le logo Greendome avec son fond noir détouré
 * (alpha 0 sur les pixels sombres) via Canvas API au runtime.
 *
 * Le résultat est caché côté module (data URL) et mémorisé entre tous
 * les usages, donc le détourage n'a lieu qu'une seule fois par session.
 *
 * Pendant le bref calcul initial, on affiche le JPEG d'origine — ainsi
 * le layout ne bouge pas. Dès que le PNG transparent est prêt, swap.
 */

let cachedURL: string | null = null;
let cachedPromise: Promise<string> | null = null;

const buildTransparentLogo = (): Promise<string> => {
  if (cachedURL) return Promise.resolve(cachedURL);
  if (cachedPromise) return cachedPromise;

  cachedPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("no window"));
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no 2d context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = data.data;

        // Détourage par distance euclidienne au noir.
        // - d < LOW : pixel considéré « fond » → alpha 0
        // - LOW <= d < HIGH : transition linéaire (anti-aliasing doux)
        // - d >= HIGH : pixel conservé tel quel
        const LOW = 30;
        const HIGH = 75;
        const RANGE = HIGH - LOW;

        for (let i = 0; i < px.length; i += 4) {
          const r = px[i];
          const g = px[i + 1];
          const b = px[i + 2];
          const d = Math.sqrt(r * r + g * g + b * b);
          if (d < LOW) {
            px[i + 3] = 0;
          } else if (d < HIGH) {
            px[i + 3] = Math.round(((d - LOW) / RANGE) * 255);
          }
          // sinon on garde alpha = 255 (déjà la valeur par défaut)
        }
        ctx.putImageData(data, 0, 0);
        const url = canvas.toDataURL("image/png");
        cachedURL = url;
        resolve(url);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("logo load failure"));
    img.src = logoSrc;
  });

  return cachedPromise;
};

// Lance le détourage dès l'import du module — le résultat sera prêt
// avant le premier render qui utilise le logo
if (typeof window !== "undefined") {
  // microtask pour ne pas bloquer le module init
  Promise.resolve().then(() => {
    void buildTransparentLogo().catch(() => {
      /* on retombera sur le JPEG brut */
    });
  });
}

interface LogoMarkProps {
  className?: string;
  alt?: string;
  /**
   * Si true, applique mix-blend-mode: screen sur le fallback JPEG
   * (utile sur fond sombre pendant le bref load initial).
   */
  blendFallback?: boolean;
  draggable?: boolean;
}

const LogoMark = ({
  className,
  alt = "GREENDOME",
  blendFallback = true,
  draggable = false,
}: LogoMarkProps) => {
  const [src, setSrc] = useState<string>(() => cachedURL || logoSrc);
  const isTransparent = useRef<boolean>(!!cachedURL);

  useEffect(() => {
    if (cachedURL) {
      if (src !== cachedURL) setSrc(cachedURL);
      isTransparent.current = true;
      return;
    }
    let cancelled = false;
    buildTransparentLogo()
      .then((url) => {
        if (cancelled) return;
        setSrc(url);
        isTransparent.current = true;
      })
      .catch(() => {
        // garde le JPEG brut
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usingFallback = !isTransparent.current && src === logoSrc;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      draggable={draggable}
      style={
        usingFallback && blendFallback
          ? { mixBlendMode: "screen" }
          : undefined
      }
    />
  );
};

export default LogoMark;
