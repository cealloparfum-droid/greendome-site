import { useEffect, useState } from "react";

/**
 * useDeviceTilt — récupère l'inclinaison physique du téléphone (gyroscope).
 *
 * Renvoie `{ x, y }` normalisés dans [-1, 1] :
 *   • x : inclinaison gauche/droite (gamma, ±45°)
 *   • y : inclinaison avant/arrière (beta,  ±45°)
 *
 * iOS 13+ exige un consentement explicite via
 * `DeviceOrientationEvent.requestPermission()`. On tente une fois en
 * silence ; si l'API est verrouillée, on retourne `{ x: 0, y: 0 }` et
 * un autre système (scroll-driven) prend le relais sans bug.
 *
 * Android et iOS PWA installée : pas de prompt, ça marche d'office.
 */

type DeviceOrientationEventiOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export const useDeviceTilt = (): { x: number; y: number; supported: boolean } => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, supported: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof DeviceOrientationEvent === "undefined") return;

    let mounted = true;

    const handle = (e: DeviceOrientationEvent) => {
      if (!mounted) return;
      // gamma: -90..90 (gauche/droite)  |  beta: -180..180 (avant/arrière)
      const gx = e.gamma ?? 0;
      const gy = e.beta ?? 0;
      // Clamp + normalise sur ±25° (zone de jeu confortable au poignet)
      const nx = Math.max(-1, Math.min(1, gx / 25));
      const ny = Math.max(-1, Math.min(1, (gy - 30) / 25));
      setTilt({ x: nx, y: ny, supported: true });
    };

    const start = () => window.addEventListener("deviceorientation", handle);
    const ios = DeviceOrientationEvent as DeviceOrientationEventiOS;

    if (typeof ios.requestPermission === "function") {
      // iOS 13+ : on attend un geste utilisateur (sinon `denied` automatique).
      // On déclenche au premier touchstart, transparent pour l'utilisateur.
      const trigger = () => {
        ios
          .requestPermission!()
          .then((res) => {
            if (res === "granted") start();
          })
          .catch(() => {});
        window.removeEventListener("touchstart", trigger);
      };
      window.addEventListener("touchstart", trigger, { passive: true, once: true });
    } else {
      start();
    }

    return () => {
      mounted = false;
      window.removeEventListener("deviceorientation", handle);
    };
  }, []);

  return tilt;
};
