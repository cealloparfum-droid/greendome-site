/**
 * inspirations — scènes pré-composées affichées dans la colonne gauche
 * du visualiseur. Au clic, l'utilisateur charge la configuration complète :
 *   - kit house (`container` = ID stable comme "kit-12")
 *   - taille au slider
 *   - liste de mobilier déjà positionné (refs du catalogue)
 *
 * Chaque inspiration a été pensée comme un projet réel — typologie
 * cohérente avec le contenant, mobilier choisi pour l'usage
 * (suite, salon, spa, dîner, réception…).
 */

import type { ContainerKind } from "./container-catalog";
import type { PlacedFurniture } from "./furniture-catalog";
import { newPlacedId } from "./furniture-catalog";
import { findContainer } from "./container-catalog";

export type InspirationItem = {
  ref: string;
  /** position [x, z] au sol, mètres */
  pos: [number, number];
  /** rotation Y, radians */
  rotY?: number;
};

export type Inspiration = {
  id: string;
  title: string;
  /** Phrase d'accroche affichée en sous-titre */
  pitch: string;
  /** Photo de présentation — héritée du contenant si non précisée */
  thumbnail?: string;
  /** ID du contenant Greendome (ex: "kit-12") */
  container: ContainerKind;
  /** Valeur du slider taille pour cette inspiration */
  size: number;
  /** Tag d'usage (mariage, suite, salon, etc.) */
  tag: string;
  /** Mobilier pré-positionné — refs du catalogue */
  items: InspirationItem[];
};

/**
 * Construit les meubles placés à partir d'un template.
 * Génère un id unique pour chaque pièce, applique rotY=0 par défaut.
 */
export const materializeInspiration = (insp: Inspiration): PlacedFurniture[] =>
  insp.items.map((it) => ({
    id: newPlacedId(),
    ref: it.ref,
    pos: it.pos,
    rotY: it.rotY ?? 0,
  }));

/**
 * Renvoie la photo d'une inspiration — soit explicite, soit la photo du
 * contenant Greendome associé.
 */
export const inspirationThumbnail = (insp: Inspiration): string => {
  if (insp.thumbnail) return insp.thumbnail;
  const c = findContainer(insp.container);
  return c?.thumbnail ?? "";
};

// ======================================================================
// Catalogue d'inspirations — 12 scènes couvrant les 4 familles
// ======================================================================
export const INSPIRATIONS: Inspiration[] = [
  // ============== DÔMES ==============
  // 1. Suite Romance — dôme géodésique tropical (kit-12)
  {
    id: "insp-romance",
    title: "Suite Romance",
    pitch: "Lit king face à la voûte étoilée, deux tables de chevet, lampe d'ambiance.",
    container: "kit-12",
    size: 5.5,
    tag: "Suite chambre",
    items: [
      { ref: "GD-RUG-XL", pos: [0, 0.2] },
      { ref: "GD-LIT-37", pos: [0, -1.0], rotY: 0 },
      { ref: "GD-TAB-S01", pos: [-1.5, -0.85] },
      { ref: "GD-TAB-S01", pos: [1.5, -0.85] },
      { ref: "GD-LAMP-001", pos: [-1.7, 1.0] },
      { ref: "GD-DEC-PALM", pos: [1.7, 1.0] },
    ],
  },

  // 2. Wellness Duo — dôme bulle vitré (kit-3)
  {
    id: "insp-wellness",
    title: "Wellness Duo",
    pitch: "Jacuzzi rond Bali, deux fauteuils tropéziens en pendant, palmiers d'angle.",
    container: "kit-3",
    size: 6,
    tag: "Spa privé",
    items: [
      { ref: "GD-JAC-B1", pos: [0, -1.2], rotY: 0 },
      { ref: "GD-FAU-30", pos: [-1.7, 0.9], rotY: Math.PI / 4 },
      { ref: "GD-FAU-30", pos: [1.7, 0.9], rotY: -Math.PI / 4 },
      { ref: "GD-DEC-PALM", pos: [-2.0, -1.7] },
      { ref: "GD-DEC-PALM", pos: [2.0, -1.7] },
    ],
  },

  // 3. Lounge Géodésique — dôme bord de lac (kit-6)
  {
    id: "insp-lounge-geo",
    title: "Lounge Géodésique",
    pitch: "Deux canapés face à face, table basse travertin, lampadaire et olivier.",
    container: "kit-6",
    size: 5.5,
    tag: "Salon de réception",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0] },
      { ref: "GD-CAN-23", pos: [0, -1.4], rotY: 0 },
      { ref: "GD-CAN-19", pos: [0, 1.4], rotY: Math.PI },
      { ref: "GD-TAB-001", pos: [0, 0] },
      { ref: "GD-LAMP-001", pos: [-1.8, 0] },
      { ref: "GD-DEC-OLIVIER", pos: [1.8, -1.6] },
    ],
  },

  // 4. Refuge Cône — lodge cône blanc en forêt (kit-39)
  {
    id: "insp-cone-refuge",
    title: "Refuge Cône",
    pitch: "Lit signature, fauteuil de lecture, lampe et table de chevet.",
    container: "kit-39",
    size: 5.5,
    tag: "Suite cocoon",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0] },
      { ref: "GD-LIT-43", pos: [0, -1.3], rotY: 0 },
      { ref: "GD-FAU-18", pos: [1.4, 1.0], rotY: -Math.PI / 4 },
      { ref: "GD-TAB-S01", pos: [-1.4, -1.1] },
      { ref: "GD-LAMP-001", pos: [-1.6, 1.0] },
    ],
  },

  // ============== PAVILLONS ==============
  // 5. Réception Pavillon — pavilion arches (kit-1)
  {
    id: "insp-reception",
    title: "Réception Pavillon",
    pitch: "Trois canapés en U, table basse double, lampadaires et palmiers en flanc.",
    container: "kit-1",
    size: 9,
    tag: "Salon de réception",
    items: [
      { ref: "GD-RUG-XL", pos: [0, 0] },
      { ref: "GD-CAN-23", pos: [0, 2.0], rotY: Math.PI },
      { ref: "GD-CAN-19", pos: [-2.6, -0.6], rotY: Math.PI / 2 },
      { ref: "GD-CAN-25", pos: [2.6, -0.6], rotY: -Math.PI / 2 },
      { ref: "GD-TAB-001", pos: [-0.6, 0] },
      { ref: "GD-TAB-001", pos: [0.6, 0] },
      { ref: "GD-LAMP-001", pos: [-3.2, 2.2] },
      { ref: "GD-LAMP-001", pos: [3.2, 2.2] },
      { ref: "GD-DEC-PALM", pos: [3.4, -2.2] },
      { ref: "GD-DEC-PALM", pos: [-3.4, -2.2] },
    ],
  },

  // 6. Mariage Champêtre — grande tente scalloped (kit-10)
  {
    id: "insp-mariage",
    title: "Mariage Champêtre",
    pitch: "Cercle de poufs autour d'une table travertin XL, esprit dîner intime.",
    container: "kit-10",
    size: 9,
    tag: "Mariage & réception",
    items: [
      { ref: "GD-RUG-XL", pos: [0, 0] },
      { ref: "GD-TAB-002", pos: [0, 0] },
      { ref: "GD-POUF-A", pos: [-1.4, -1.4], rotY: Math.PI / 4 },
      { ref: "GD-POUF-B", pos: [1.4, -1.4], rotY: -Math.PI / 4 },
      { ref: "GD-POUF-A", pos: [1.4, 1.4], rotY: (3 * Math.PI) / 4 },
      { ref: "GD-POUF-B", pos: [-1.4, 1.4], rotY: -(3 * Math.PI) / 4 },
      { ref: "GD-LAMP-001", pos: [-2.6, -2.6] },
      { ref: "GD-LAMP-001", pos: [2.6, 2.6] },
      { ref: "GD-DEC-OLIVIER", pos: [2.8, -2.5] },
    ],
  },

  // 7. Parasol Lounge — pavillon parasol bois (kit-4)
  {
    id: "insp-parasol",
    title: "Parasol Lounge",
    pitch: "Canapé courbe sous le parasol, fauteuils tropéziens, table basse, palmiers.",
    container: "kit-4",
    size: 6,
    tag: "Lounge extérieur",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0.2] },
      { ref: "GD-CAN-24", pos: [0, -1.2], rotY: 0 },
      { ref: "GD-FAU-30", pos: [-1.6, 1.0], rotY: Math.PI / 4 },
      { ref: "GD-FAU-30", pos: [1.6, 1.0], rotY: -Math.PI / 4 },
      { ref: "GD-TAB-001", pos: [0, 0.5] },
      { ref: "GD-DEC-PALM", pos: [-2.1, -1.4] },
      { ref: "GD-DEC-PALM", pos: [2.1, -1.4] },
    ],
  },

  // ============== SAFARI & GLAMPING ==============
  // 8. Lodge Cocon Safari — lodge safari deluxe lac (kit-30)
  {
    id: "insp-lodge-cocon",
    title: "Lodge Cocon",
    pitch: "Suite glamping : lit king, chaise longue, lampe, olivier et table de chevet.",
    container: "kit-30",
    size: 6,
    tag: "Suite glamping",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0] },
      { ref: "GD-LIT-39", pos: [0, -2.0], rotY: 0 },
      { ref: "GD-FAU-38", pos: [1.5, 1.5], rotY: -Math.PI / 6 },
      { ref: "GD-LAMP-001", pos: [-1.8, -1.4] },
      { ref: "GD-DEC-OLIVIER", pos: [2.0, -2.6] },
      { ref: "GD-TAB-S01", pos: [-1.0, -2.6] },
    ],
  },

  // 9. Safari Pyramide — tente safari classique (kit-18)
  {
    id: "insp-safari-pyramide",
    title: "Safari Pyramide",
    pitch: "Lit safari, fauteuil bohème, lampe d'ambiance, olivier en angle.",
    container: "kit-18",
    size: 5,
    tag: "Tente safari",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0] },
      { ref: "GD-LIT-42", pos: [0, -1.4], rotY: 0 },
      { ref: "GD-FAU-26", pos: [1.5, 1.0], rotY: -Math.PI / 4 },
      { ref: "GD-LAMP-001", pos: [-1.6, 1.0] },
      { ref: "GD-DEC-OLIVIER", pos: [1.6, -1.6] },
    ],
  },

  // 10. Yourte Panorama — yourte vitrée (kit-38)
  {
    id: "insp-yurt-pano",
    title: "Yourte Panorama",
    pitch: "Canapé courbe et duo de fauteuils, table basse, vue circulaire.",
    container: "kit-38",
    size: 5.5,
    tag: "Salon panoramique",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0] },
      { ref: "GD-CAN-24", pos: [0, -1.1], rotY: 0 },
      { ref: "GD-FAU-18", pos: [-1.6, 0.9], rotY: Math.PI / 4 },
      { ref: "GD-FAU-34", pos: [1.6, 0.9], rotY: -Math.PI / 4 },
      { ref: "GD-TAB-001", pos: [0, 0.3] },
      { ref: "GD-DEC-OLIVIER", pos: [-1.8, -1.4] },
    ],
  },

  // ============== TIPIS & ÉVÉNEMENTIEL ==============
  // 11. Tipi Soirée — tipi moderne (kit-5)
  {
    id: "insp-tipi",
    title: "Tipi Soirée",
    pitch: "Cercle de poufs autour d'une table travertin, esprit feu de camp.",
    container: "kit-5",
    size: 5.5,
    tag: "Soirée intime",
    items: [
      { ref: "GD-RUG-M", pos: [0, 0] },
      { ref: "GD-TAB-002", pos: [0, 0] },
      { ref: "GD-POUF-A", pos: [-1.0, -1.0], rotY: Math.PI / 4 },
      { ref: "GD-POUF-B", pos: [1.0, -1.0], rotY: -Math.PI / 4 },
      { ref: "GD-POUF-A", pos: [1.0, 1.0], rotY: (3 * Math.PI) / 4 },
      { ref: "GD-POUF-B", pos: [-1.0, 1.0], rotY: -(3 * Math.PI) / 4 },
    ],
  },

  // 12. A-Frame Forest — tipi A-frame moderne (kit-24)
  {
    id: "insp-aframe",
    title: "A-Frame Forest",
    pitch: "Lit double face au pignon vitré, canapé d'appoint, lampe et table.",
    container: "kit-24",
    size: 5,
    tag: "Hébergement insolite",
    items: [
      { ref: "GD-RUG-M", pos: [0, 1.0] },
      { ref: "GD-LIT-39", pos: [0, 1.5], rotY: 0 },
      { ref: "GD-CAN-19", pos: [0, -1.6], rotY: Math.PI },
      { ref: "GD-TAB-001", pos: [0, -0.6] },
      { ref: "GD-LAMP-001", pos: [-1.6, -1.8] },
      { ref: "GD-DEC-OLIVIER", pos: [1.6, -2.2] },
    ],
  },
];
