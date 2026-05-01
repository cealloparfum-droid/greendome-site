import { useEffect, useState } from "react";

/**
 * useIsTouch — détecte si l'utilisateur est sur un appareil tactile.
 *
 * On se base sur les media queries CSS plutôt que sur "ontouchstart" :
 *   - `(hover: none)`     → l'appareil ne supporte pas le survol
 *   - `(pointer: coarse)` → pointeur imprécis (doigt vs souris)
 *
 * Les deux ensemble = mobile / tablette tactile. C'est ce qu'utilise
 * Apple, Stripe, Linear, etc. Plus fiable que la détection user-agent.
 *
 * Réagit aux changements (ex: branchement d'une souris sur iPad).
 */
export const useIsTouch = (): boolean => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouch(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isTouch;
};
