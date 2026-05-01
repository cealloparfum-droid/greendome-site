/**
 * furniture-catalog — catalogue des produits affichables dans le visualiseur 3D.
 *
 * Chaque pièce expose :
 *   - une référence stable (ref) — identifiant interne, affiché dans l'UI
 *   - une famille pour le filtrage
 *   - des dimensions réalistes en mètres (footprint au sol)
 *   - une photo produit (vrai cliché du catalogue) qu'on affiche en billboard 3D
 *   - une silhouette procédurale (kind) pour l'empreinte au sol
 *
 * Trois grandes catégories :
 *   - Mobilier (canapés, fauteuils, lits) — photos /assets/mobilier/N.jpeg
 *   - Jacuzzis — photos /assets/jacuzzi-*.jpg, avec géométrie procédurale
 *   - Décor & Lumière — pièces purement procédurales (plantes, lampadaire, tapis)
 *
 * Le client peut ainsi déposer un canapé bouclé crème ou un jacuzzi octogonal
 * dans son dôme, voir la photo réelle de la pièce, la déplacer, la pivoter.
 */

// -----------------------------------------------------------------
// Image loaders — Vite glob pour /assets/mobilier + imports directs jacuzzi
// -----------------------------------------------------------------
const mobilierImages = import.meta.glob(
  "@/assets/mobilier/*.jpeg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const getMobilier = (filename: string): string => {
  const entry = Object.entries(mobilierImages).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  return entry?.[1] ?? "";
};

// Jacuzzi : noms fixes, on importe statiquement
import jacAlps from "@/assets/jacuzzi-alps.jpg";
import jacRoundSea from "@/assets/jacuzzi-round-sea.jpg";
import jacOctagonSea from "@/assets/jacuzzi-octagon-sea.jpg";
import jacSquareChalet from "@/assets/jacuzzi-square-chalet.jpg";
import jacChaletOctagon from "@/assets/jacuzzi-chalet-octagon.jpg";
import jacVineyardRound from "@/assets/jacuzzi-vineyard-round.jpg";
import jacTuscany from "@/assets/jacuzzi-tuscany.jpg";
import jacBali from "@/assets/jacuzzi-bali.jpg";

// -----------------------------------------------------------------
// Types
// -----------------------------------------------------------------
export type FurnitureKind =
  | "sofa-3"
  | "sofa-corner"
  | "sofa-curved"
  | "daybed"
  | "armchair"
  | "pouf"
  | "bed-king"
  | "coffee-table"
  | "rug-round"
  | "floor-lamp"
  | "side-table"
  | "plant"
  | "jacuzzi-square"
  | "jacuzzi-round"
  | "jacuzzi-octagon";

export type FurnitureFamily =
  | "Canapés"
  | "Fauteuils & Méridiennes"
  | "Lits"
  | "Jacuzzis"
  | "Décor & Lumière";

export type FurnitureSpec = {
  kind: FurnitureKind;
  /** Référence catalogue ou slug interne — affiché dans l'UI */
  ref: string;
  label: string;
  family: FurnitureFamily;
  /** Dimensions externes en mètres : largeur / profondeur / hauteur */
  size: { w: number; d: number; h: number };
  /** Couleur principale (silhouette / footprint) */
  color: string;
  /** Couleur secondaire (coussins, structure, lampe…) */
  accent?: string;
  /** Photo produit affichée en billboard 3D + en miniature dans la palette */
  image?: string;
  /** Description courte affichée sur la card */
  blurb?: string;
};

// -----------------------------------------------------------------
// Catalogue
// -----------------------------------------------------------------
export const FURNITURE_CATALOG: FurnitureSpec[] = [
  // ============== Canapés ==============
  {
    kind: "sofa-3",
    ref: "GD-CAN-12",
    label: "Trio Bubble — velours sarcelle, citron & olive",
    family: "Canapés",
    size: { w: 2.4, d: 1.0, h: 0.85 },
    color: "#3a5e6b",
    accent: "#c89758",
    image: getMobilier("12.jpeg"),
    blurb: "Pièce signature, ligne organique, lounge ou suite.",
  },
  {
    kind: "sofa-3",
    ref: "GD-CAN-23",
    label: "Canapé courbe organique — bouclé crème",
    family: "Canapés",
    size: { w: 2.6, d: 1.2, h: 0.85 },
    color: "#efe7d5",
    accent: "#bca987",
    image: getMobilier("23.jpeg"),
    blurb: "Bouclé moelleux, courbe enveloppante.",
  },
  {
    kind: "sofa-3",
    ref: "GD-CAN-15",
    label: "Canapé XL — velours côtelé vert sapin",
    family: "Canapés",
    size: { w: 2.6, d: 1.0, h: 0.9 },
    color: "#3f5c3f",
    accent: "#a89878",
    image: getMobilier("15.jpeg"),
    blurb: "Velours côtelé, esprit manoir.",
  },
  {
    kind: "sofa-corner",
    ref: "GD-CAN-19",
    label: "Canapé d'angle — vert sapin avec méridienne",
    family: "Canapés",
    size: { w: 2.8, d: 1.9, h: 0.85 },
    color: "#3f5c3f",
    accent: "#c89758",
    image: getMobilier("19.jpeg"),
    blurb: "Angle gauche, méridienne intégrée.",
  },
  {
    kind: "sofa-corner",
    ref: "GD-CAN-25",
    label: "Canapé d'angle — côtelé gris ardoise",
    family: "Canapés",
    size: { w: 2.8, d: 1.9, h: 0.85 },
    color: "#5a5a60",
    accent: "#a89878",
    image: getMobilier("25.jpeg"),
    blurb: "Côtelé gris ardoise, lignes contemporaines.",
  },
  {
    kind: "sofa-3",
    ref: "GD-CAN-22",
    label: "Canapé XL — velours capitonné moutarde",
    family: "Canapés",
    size: { w: 2.6, d: 1.05, h: 0.9 },
    color: "#c8841f",
    accent: "#3a342c",
    image: getMobilier("22.jpeg"),
    blurb: "Capitonné, réception haut de gamme.",
  },
  {
    kind: "sofa-curved",
    ref: "GD-CAN-24",
    label: "Canapé courbe — bouclé bleu nuit",
    family: "Canapés",
    size: { w: 2.5, d: 1.2, h: 0.85 },
    color: "#2c3650",
    accent: "#efe7d5",
    image: getMobilier("24.jpeg"),
    blurb: "Bouclé sculptural, galerie résidentielle.",
  },
  {
    kind: "sofa-3",
    ref: "GD-CAN-11",
    label: "Canapé d'angle — bouclé terracotta",
    family: "Canapés",
    size: { w: 2.6, d: 1.7, h: 0.85 },
    color: "#a85a3a",
    accent: "#efe7d5",
    image: getMobilier("11.jpeg"),
    blurb: "Bouclé chaleureux, salon d'hiver.",
  },
  {
    kind: "daybed",
    ref: "GD-CAN-13",
    label: "Daybed — velours côtelé vert sapin",
    family: "Canapés",
    size: { w: 2.1, d: 1.0, h: 0.7 },
    color: "#3f5c3f",
    accent: "#c89758",
    image: getMobilier("13.jpeg"),
    blurb: "Méridienne lecture, bibliothèque.",
  },

  // ============== Fauteuils & Méridiennes ==============
  {
    kind: "armchair",
    ref: "GD-FAU-26",
    label: "Duo fauteuils — velours moutarde & rouille",
    family: "Fauteuils & Méridiennes",
    size: { w: 1.7, d: 0.95, h: 0.85 },
    color: "#c8841f",
    accent: "#3a342c",
    image: getMobilier("26.jpeg"),
    blurb: "Lounge sculpté, paire iconique.",
  },
  {
    kind: "armchair",
    ref: "GD-FAU-2",
    label: "Fauteuil bouclé olive + ottomans",
    family: "Fauteuils & Méridiennes",
    size: { w: 1.0, d: 1.0, h: 0.85 },
    color: "#7a8259",
    accent: "#efe7d5",
    image: getMobilier("2.jpeg"),
    blurb: "Coin lecture lumineux.",
  },
  {
    kind: "armchair",
    ref: "GD-FAU-34",
    label: "Fauteuil tufté crème à oreilles",
    family: "Fauteuils & Méridiennes",
    size: { w: 0.95, d: 0.95, h: 1.05 },
    color: "#efe7d5",
    accent: "#bca987",
    image: getMobilier("34.jpeg"),
    blurb: "Tête haute, suite hôtelière.",
  },
  {
    kind: "armchair",
    ref: "GD-FAU-18",
    label: "Fauteuil iconique rayé bleu & sable",
    family: "Fauteuils & Méridiennes",
    size: { w: 0.95, d: 0.95, h: 0.9 },
    color: "#2c3650",
    accent: "#bca987",
    image: getMobilier("18.jpeg"),
    blurb: "Galerie design, signature.",
  },
  {
    kind: "daybed",
    ref: "GD-FAU-30",
    label: "Méridiennes côtelé crème tufté",
    family: "Fauteuils & Méridiennes",
    size: { w: 1.9, d: 0.85, h: 0.8 },
    color: "#efe7d5",
    accent: "#bca987",
    image: getMobilier("30.jpeg"),
    blurb: "Suite glamping cocooning.",
  },
  {
    kind: "daybed",
    ref: "GD-FAU-38",
    label: "Chaise longue corduroy terracotta",
    family: "Fauteuils & Méridiennes",
    size: { w: 1.7, d: 0.85, h: 0.85 },
    color: "#a85a3a",
    accent: "#3a342c",
    image: getMobilier("38.jpeg"),
    blurb: "Coin lecture jardin d'hiver.",
  },
  {
    kind: "pouf",
    ref: "GD-POUF-A",
    label: "Pouf rond — bouclé crème",
    family: "Fauteuils & Méridiennes",
    size: { w: 0.55, d: 0.55, h: 0.45 },
    color: "#efe7d5",
  },
  {
    kind: "pouf",
    ref: "GD-POUF-B",
    label: "Pouf rond — terracotta",
    family: "Fauteuils & Méridiennes",
    size: { w: 0.55, d: 0.55, h: 0.45 },
    color: "#a85a3a",
  },

  // ============== Lits ==============
  {
    kind: "bed-king",
    ref: "GD-LIT-39",
    label: "Lit king — velours côtelé vert sapin",
    family: "Lits",
    size: { w: 2.1, d: 2.3, h: 0.55 },
    color: "#3f5c3f",
    accent: "#efe7d5",
    image: getMobilier("39.jpeg"),
    blurb: "180 × 200 cm, tête capitonnée.",
  },
  {
    kind: "bed-king",
    ref: "GD-LIT-37",
    label: "Lit king — velours bleu acier sculpté",
    family: "Lits",
    size: { w: 2.1, d: 2.3, h: 0.55 },
    color: "#2c3650",
    accent: "#c89758",
    image: getMobilier("37.jpeg"),
    blurb: "Suite d'auteur, tête sculptée.",
  },
  {
    kind: "bed-king",
    ref: "GD-LIT-42",
    label: "Lit king — bouclé crème tufté",
    family: "Lits",
    size: { w: 2.1, d: 2.3, h: 0.55 },
    color: "#efe7d5",
    accent: "#bca987",
    image: getMobilier("42.jpeg"),
    blurb: "Cocooning, chambre haussmannienne.",
  },
  {
    kind: "bed-king",
    ref: "GD-LIT-43",
    label: "Lit cabriolet — crème nuage",
    family: "Lits",
    size: { w: 2.2, d: 2.4, h: 0.6 },
    color: "#f4eddc",
    accent: "#bca987",
    image: getMobilier("43.jpeg"),
    blurb: "Cabriolet, suite d'exception.",
  },
  {
    kind: "bed-king",
    ref: "GD-LIT-47",
    label: "Lit king — velours chocolat capitonné",
    family: "Lits",
    size: { w: 2.1, d: 2.3, h: 0.55 },
    color: "#3a2820",
    accent: "#c89758",
    image: getMobilier("47.jpeg"),
    blurb: "Suite parentale, profondeur enveloppante.",
  },
  {
    kind: "bed-king",
    ref: "GD-LIT-52",
    label: "Lit king — velours côtelé bleu nuit",
    family: "Lits",
    size: { w: 2.1, d: 2.3, h: 0.55 },
    color: "#1a2540",
    accent: "#c89758",
    image: getMobilier("52.jpeg"),
    blurb: "Suite raffinée, profondeur de nuit.",
  },

  // ============== Jacuzzis ==============
  {
    kind: "jacuzzi-square",
    ref: "GD-JAC-S1",
    label: "Signature Carré 2,00 × 2,00 m",
    family: "Jacuzzis",
    size: { w: 2.0, d: 2.0, h: 0.9 },
    color: "#1a2530",
    accent: "#c89758",
    image: jacSquareChalet,
    blurb: "4 à 6 personnes · jusqu'à 63 jets.",
  },
  {
    kind: "jacuzzi-square",
    ref: "GD-JAC-S2",
    label: "Signature Carré 2,16 × 2,16 m",
    family: "Jacuzzis",
    size: { w: 2.16, d: 2.16, h: 0.9 },
    color: "#22272e",
    accent: "#c89758",
    image: jacAlps,
    blurb: "Format familial XL, vue panoramique.",
  },
  {
    kind: "jacuzzi-round",
    ref: "GD-JAC-R1",
    label: "Signature Rond Ø 2,00 m",
    family: "Jacuzzis",
    size: { w: 2.0, d: 2.0, h: 0.9 },
    color: "#1a2530",
    accent: "#c89758",
    image: jacRoundSea,
    blurb: "4 à 5 personnes · pureté du cercle.",
  },
  {
    kind: "jacuzzi-round",
    ref: "GD-JAC-R2",
    label: "Signature Rond Ø 2,20 m",
    family: "Jacuzzis",
    size: { w: 2.2, d: 2.2, h: 0.9 },
    color: "#22272e",
    accent: "#c89758",
    image: jacVineyardRound,
    blurb: "Format intime, espaces contemplatifs.",
  },
  {
    kind: "jacuzzi-octagon",
    ref: "GD-JAC-O1",
    label: "Signature Octogonal 2,10 × 2,10 m",
    family: "Jacuzzis",
    size: { w: 2.1, d: 2.1, h: 0.9 },
    color: "#1a2530",
    accent: "#c89758",
    image: jacOctagonSea,
    blurb: "5 à 6 personnes · harmonie architecturale.",
  },
  {
    kind: "jacuzzi-octagon",
    ref: "GD-JAC-O2",
    label: "Signature Octogonal 2,20 × 2,20 m",
    family: "Jacuzzis",
    size: { w: 2.2, d: 2.2, h: 0.9 },
    color: "#22272e",
    accent: "#c89758",
    image: jacChaletOctagon,
    blurb: "Pièce sculpturale, jusqu'à 52 jets.",
  },
  {
    kind: "jacuzzi-square",
    ref: "GD-JAC-T1",
    label: "Jacuzzi Toscane — intégration vignobles",
    family: "Jacuzzis",
    size: { w: 2.1, d: 2.1, h: 0.9 },
    color: "#2a2018",
    accent: "#c89758",
    image: jacTuscany,
    blurb: "Inspiration toscane, finition cuivrée.",
  },
  {
    kind: "jacuzzi-round",
    ref: "GD-JAC-B1",
    label: "Jacuzzi Bali — bois exotique",
    family: "Jacuzzis",
    size: { w: 2.2, d: 2.2, h: 0.9 },
    color: "#3a2820",
    accent: "#c89758",
    image: jacBali,
    blurb: "Habillage bois, ambiance tropicale.",
  },

  // ============== Décor & Lumière ==============
  {
    kind: "coffee-table",
    ref: "GD-TAB-001",
    label: "Table basse ovale — chêne huilé",
    family: "Décor & Lumière",
    size: { w: 1.2, d: 0.6, h: 0.4 },
    color: "#7a5a3a",
    accent: "#3a342c",
  },
  {
    kind: "coffee-table",
    ref: "GD-TAB-002",
    label: "Table basse — pierre travertin",
    family: "Décor & Lumière",
    size: { w: 1.0, d: 0.6, h: 0.38 },
    color: "#bca987",
    accent: "#8e8276",
  },
  {
    kind: "side-table",
    ref: "GD-TAB-S01",
    label: "Bout de canapé — laiton & verre",
    family: "Décor & Lumière",
    size: { w: 0.45, d: 0.45, h: 0.55 },
    color: "#c89758",
    accent: "#e8f0f5",
  },
  {
    kind: "rug-round",
    ref: "GD-RUG-XL",
    label: "Tapis rond XL — laine sable",
    family: "Décor & Lumière",
    size: { w: 3.0, d: 3.0, h: 0.02 },
    color: "#c5b59a",
  },
  {
    kind: "rug-round",
    ref: "GD-RUG-M",
    label: "Tapis rond — laine taupe",
    family: "Décor & Lumière",
    size: { w: 2.4, d: 2.4, h: 0.02 },
    color: "#8e8276",
  },
  {
    kind: "floor-lamp",
    ref: "GD-LAMP-001",
    label: "Lampadaire — abat-jour lin écru",
    family: "Décor & Lumière",
    size: { w: 0.45, d: 0.45, h: 1.7 },
    color: "#efe7d5",
    accent: "#3a342c",
    blurb: "Lumière chaude, point d'ambiance.",
  },
  {
    kind: "plant",
    ref: "GD-DEC-PALM",
    label: "Palmier d'intérieur — pot terre",
    family: "Décor & Lumière",
    size: { w: 0.9, d: 0.9, h: 2.1 },
    color: "#3f6b3f",
    accent: "#7a5a3a",
  },
  {
    kind: "plant",
    ref: "GD-DEC-OLIVIER",
    label: "Olivier d'intérieur",
    family: "Décor & Lumière",
    size: { w: 1.1, d: 1.1, h: 2.4 },
    color: "#5a8c5a",
    accent: "#a89878",
  },
];

export const FURNITURE_FAMILIES: FurnitureFamily[] = [
  "Canapés",
  "Fauteuils & Méridiennes",
  "Lits",
  "Jacuzzis",
  "Décor & Lumière",
];

// ---------------------------------------------------------------
// Type des meubles placés dans la scène (avec position & rotation)
// ---------------------------------------------------------------
export type PlacedFurniture = {
  /** id unique de l'instance posée — pas le ref catalogue */
  id: string;
  ref: string;
  /** position au sol [x, z] en mètres (y dérivé de la hauteur) */
  pos: [number, number];
  /** rotation autour de Y, en radians */
  rotY: number;
};

export const findSpec = (ref: string): FurnitureSpec | undefined =>
  FURNITURE_CATALOG.find((s) => s.ref === ref);

export const newPlacedId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
