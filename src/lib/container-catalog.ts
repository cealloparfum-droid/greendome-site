/**
 * container-catalog — le catalogue exhaustif des 39 modèles Greendome
 * que l'utilisateur peut sélectionner dans le visualiseur.
 *
 * Chaque entrée du catalogue (`ContainerSpec`) représente un modèle réel
 * de la collection (issu de `maisons-kit-inventory.json`) avec sa photo,
 * son nom, sa famille, et — surtout — un `archetype` 3D qui dicte la
 * forme procédurale rendue dans la scène.
 *
 * 10 archétypes 3D couvrent l'ensemble du catalogue :
 *   - dome-geodesic        : dôme géodésique transparent (signature)
 *   - dome-bubble-arch     : bulle vitrée avec arche d'entrée
 *   - pavilion-arches      : pavillon multi-arches (toiles tendues)
 *   - pavilion-parasol     : parasol mât central, toile en ombrelle
 *   - safari-lodge         : lodge en demi-tunnel + terrasse bois
 *   - safari-pyramid       : tente safari classique, toit pyramide
 *   - tipi-cone            : cône bois & toile (foyer central)
 *   - tipi-aframe          : A-frame triangulaire bois + vitrages
 *   - yurt-glass           : yourte vitrée (cylindre + couronne)
 *   - lodge-cone           : cône blanc & bois fermé (yourte-cône)
 *
 * Le `kind` est un identifiant stable au format "kit-{n}" issu du nom
 * de fichier de l'image. Il sert d'ID dans les URL, le localStorage et
 * les inspirations.
 */

import inventory from "@/data/maisons-kit-inventory.json";

// -----------------------------------------------------------------
// Image loaders
// -----------------------------------------------------------------
const kitImages = import.meta.glob(
  "@/assets/maisons-kit/*.jpeg",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const getKitImg = (filename: string): string => {
  const entry = Object.entries(kitImages).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  return entry?.[1] ?? "";
};

// -----------------------------------------------------------------
// Types
// -----------------------------------------------------------------
export type ContainerArchetype =
  | "dome-geodesic"
  | "dome-bubble-arch"
  | "pavilion-arches"
  | "pavilion-multipic"
  | "pavilion-parasol"
  | "safari-lodge"
  | "safari-pyramid"
  | "tipi-cone"
  | "tipi-aframe"
  | "yurt-glass"
  | "lodge-cone";

/** Identifiant stable d'un modèle (ex: "kit-1", "kit-12"). */
export type ContainerKind = string;

export type ContainerFamily =
  | "Pavillons"
  | "Safari & Glamping"
  | "Dômes"
  | "Tipis & Événementiel";

export type Footprint =
  | { shape: "circle"; radius: number }
  | { shape: "rect"; w: number; d: number };

export type ContainerSpec = {
  /** ID stable (ex: "kit-1") */
  kind: ContainerKind;
  /** Archétype 3D rendu dans la scène */
  archetype: ContainerArchetype;
  /** Nom court affiché dans la carte */
  label: string;
  /** Famille (onglet de filtrage) */
  family: ContainerFamily;
  /** Phrase d'accroche (caption photo) */
  blurb: string;
  /** Tag d'usage (context) */
  context: string;
  /** Photo réelle */
  thumbnail: string;
  /** Surface intérieure approx. en m² */
  surfaceM2: number;
  /** Capacité estimée */
  capacity: number;
  /** Plage du slider (m, diamètre ou largeur selon archétype) */
  sizeRange: { min: number; max: number; step: number; default: number };
  /** Calcule le footprint d'aménagement à partir du slider */
  computeFootprint: (sliderValue: number) => Footprint;
  /** Hauteur intérieure approximative pour dimensionner les meubles verticaux */
  computeHeight: (sliderValue: number) => number;
};

// -----------------------------------------------------------------
// Profils par archétype : footprint, hauteur, plage du slider, surface, etc.
// -----------------------------------------------------------------
type ArchetypeProfile = {
  family: ContainerFamily;
  sizeRange: { min: number; max: number; step: number; default: number };
  computeFootprint: (v: number) => Footprint;
  computeHeight: (v: number) => number;
  surfaceFn: (v: number) => number;
  capacityFn: (v: number) => number;
};

const ARCHETYPE_PROFILES: Record<ContainerArchetype, ArchetypeProfile> = {
  "dome-geodesic": {
    family: "Dômes",
    sizeRange: { min: 3.5, max: 12, step: 0.5, default: 5 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.3 }),
    computeHeight: (d) => d * 0.85,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(2, Math.round((d * d) * 0.5)),
  },
  "dome-bubble-arch": {
    family: "Dômes",
    sizeRange: { min: 4, max: 9, step: 0.5, default: 5.5 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.3 }),
    computeHeight: (d) => d * 0.6,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(2, Math.round((d * d) * 0.45)),
  },
  "pavilion-arches": {
    family: "Pavillons",
    sizeRange: { min: 5, max: 14, step: 0.5, default: 8 },
    computeFootprint: (w) => ({ shape: "rect", w: w - 0.6, d: w * 0.7 - 0.6 }),
    computeHeight: () => 4.2,
    surfaceFn: (w) => Math.round(w * w * 0.7),
    capacityFn: (w) => Math.max(4, Math.round(w * w * 0.35)),
  },
  "pavilion-multipic": {
    family: "Pavillons",
    sizeRange: { min: 5, max: 14, step: 0.5, default: 8 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.4 }),
    computeHeight: (d) => d * 0.85,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(6, Math.round((d * d) * 0.5)),
  },
  "pavilion-parasol": {
    family: "Pavillons",
    sizeRange: { min: 4, max: 9, step: 0.5, default: 6 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.3 }),
    computeHeight: () => 3.5,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(3, Math.round((d * d) * 0.45)),
  },
  "safari-lodge": {
    family: "Safari & Glamping",
    sizeRange: { min: 4.5, max: 10, step: 0.5, default: 6 },
    computeFootprint: (w) => ({ shape: "rect", w: w - 0.5, d: w * 1.15 - 0.5 }),
    computeHeight: () => 2.8,
    surfaceFn: (w) => Math.round(w * w * 1.1),
    capacityFn: (w) => Math.max(2, Math.round(w * 1.2)),
  },
  "safari-pyramid": {
    family: "Safari & Glamping",
    sizeRange: { min: 4, max: 8, step: 0.5, default: 5.5 },
    computeFootprint: (w) => ({ shape: "rect", w: w - 0.5, d: w * 0.95 - 0.5 }),
    computeHeight: () => 3.2,
    surfaceFn: (w) => Math.round(w * w * 0.9),
    capacityFn: (w) => Math.max(2, Math.round(w * 1.0)),
  },
  "tipi-cone": {
    family: "Tipis & Événementiel",
    sizeRange: { min: 4, max: 8, step: 0.5, default: 5.5 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.4 }),
    computeHeight: (d) => d * 0.95,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(3, Math.round((d * d) * 0.4)),
  },
  "tipi-aframe": {
    family: "Tipis & Événementiel",
    sizeRange: { min: 3.5, max: 7, step: 0.5, default: 4.5 },
    computeFootprint: (w) => ({ shape: "rect", w: w - 0.4, d: w * 1.4 - 0.4 }),
    computeHeight: (w) => w * 0.95,
    surfaceFn: (w) => Math.round(w * w * 1.4),
    capacityFn: (w) => Math.max(2, Math.round(w * 0.9)),
  },
  "yurt-glass": {
    family: "Safari & Glamping",
    sizeRange: { min: 4, max: 8, step: 0.5, default: 5.5 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.35 }),
    computeHeight: (d) => d * 0.7 + 0.8,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(2, Math.round((d * d) * 0.45)),
  },
  "lodge-cone": {
    family: "Dômes",
    sizeRange: { min: 4, max: 9, step: 0.5, default: 5.5 },
    computeFootprint: (d) => ({ shape: "circle", radius: d / 2 - 0.3 }),
    computeHeight: (d) => d * 0.95 + 1.0,
    surfaceFn: (d) => Math.round(Math.PI * (d / 2) ** 2),
    capacityFn: (d) => Math.max(2, Math.round((d * d) * 0.45)),
  },
};

// -----------------------------------------------------------------
// Mapping image (numéro de fichier) → archétype 3D
// Issu de l'inspection visuelle des photos du catalogue.
// -----------------------------------------------------------------
const IMG_TO_ARCHETYPE: Record<string, ContainerArchetype> = {
  // ---- Pavillons ----
  "1.jpeg": "pavilion-arches",
  "4.jpeg": "pavilion-parasol",
  "8.jpeg": "pavilion-parasol",
  "20.jpeg": "pavilion-arches",
  "32.jpeg": "pavilion-multipic", // multi-pic vitré jardin/piscine
  "35.jpeg": "pavilion-multipic", // double-pic vue mer
  "36.jpeg": "pavilion-arches",   // ovale

  // ---- Safari & Glamping ----
  "2.jpeg": "safari-lodge",
  "11.jpeg": "safari-lodge", // tunnel
  "13.jpeg": "safari-lodge",
  "15.jpeg": "safari-pyramid",
  "16.jpeg": "safari-lodge",
  "17.jpeg": "safari-lodge",
  "18.jpeg": "safari-pyramid",
  "19.jpeg": "safari-lodge",
  "21.jpeg": "safari-lodge",
  "22.jpeg": "safari-pyramid",
  "26.jpeg": "safari-pyramid",
  "27.jpeg": "safari-lodge",
  "28.jpeg": "safari-lodge",
  "30.jpeg": "safari-lodge",
  "31.jpeg": "safari-lodge", // tunnel vitré
  "33.jpeg": "safari-pyramid",
  "34.jpeg": "safari-pyramid",
  "37.jpeg": "safari-lodge",
  "38.jpeg": "yurt-glass",

  // ---- Dômes ----
  "3.jpeg": "dome-bubble-arch",
  "6.jpeg": "dome-geodesic",
  "12.jpeg": "dome-geodesic",
  "14.jpeg": "dome-bubble-arch",
  "25.jpeg": "dome-bubble-arch",
  "29.jpeg": "lodge-cone", // yourte cône vitrée
  "39.jpeg": "lodge-cone",
  "40.jpeg": "lodge-cone",

  // ---- Événementiel ----
  "5.jpeg": "tipi-cone",
  "7.jpeg": "tipi-cone",
  "9.jpeg": "pavilion-multipic",  // tente étoile double — multi-pic franc
  "10.jpeg": "pavilion-multipic", // grande tente scalloped — multi-pic
  "24.jpeg": "tipi-aframe",
};

// Mapping famille de l'inventaire JSON → famille du visualiseur
const FAMILY_MAP: Record<string, ContainerFamily> = {
  pavillons: "Pavillons",
  safari: "Safari & Glamping",
  domes: "Dômes",
  evenementiel: "Tipis & Événementiel",
};

// -----------------------------------------------------------------
// Génération du catalogue à partir de l'inventaire JSON
// -----------------------------------------------------------------
type InventoryImage = { src: string; caption: string; context: string };
type InventoryFamily = {
  id: string;
  title: string;
  images: InventoryImage[];
};
type Inventory = {
  families: Record<string, InventoryFamily>;
};

const inv = inventory as unknown as Inventory;

const buildCatalog = (): ContainerSpec[] => {
  const out: ContainerSpec[] = [];
  for (const familyKey of Object.keys(inv.families)) {
    const fam = inv.families[familyKey];
    const familyLabel = FAMILY_MAP[familyKey] ?? "Pavillons";
    for (const img of fam.images) {
      const archetype = IMG_TO_ARCHETYPE[img.src] ?? "dome-geodesic";
      const profile = ARCHETYPE_PROFILES[archetype];
      const id = `kit-${img.src.replace(".jpeg", "")}`;
      const defaultSize = profile.sizeRange.default;
      out.push({
        kind: id,
        archetype,
        label: img.caption,
        family: familyLabel,
        blurb: img.caption,
        context: img.context,
        thumbnail: getKitImg(img.src),
        surfaceM2: profile.surfaceFn(defaultSize),
        capacity: profile.capacityFn(defaultSize),
        sizeRange: profile.sizeRange,
        computeFootprint: profile.computeFootprint,
        computeHeight: profile.computeHeight,
      });
    }
  }
  return out;
};

export const CONTAINER_CATALOG: ContainerSpec[] = buildCatalog();

export const CONTAINER_FAMILIES: ContainerFamily[] = [
  "Pavillons",
  "Safari & Glamping",
  "Dômes",
  "Tipis & Événementiel",
];

/** ID par défaut au premier chargement */
export const DEFAULT_CONTAINER_KIND: ContainerKind =
  CONTAINER_CATALOG.find((c) => c.kind === "kit-12")?.kind ??
  CONTAINER_CATALOG[0]?.kind ??
  "kit-12";

export const findContainer = (kind: ContainerKind): ContainerSpec | undefined =>
  CONTAINER_CATALOG.find((c) => c.kind === kind);

export const isContainerKind = (s: string): s is ContainerKind =>
  CONTAINER_CATALOG.some((c) => c.kind === s);

/** Borne (clamp) une position [x, z] à l'intérieur d'un footprint. */
export const clampToFootprint = (
  pos: [number, number],
  fp: Footprint,
): [number, number] => {
  const [x, z] = pos;
  if (fp.shape === "circle") {
    const r = Math.sqrt(x * x + z * z);
    if (r <= fp.radius) return [x, z];
    const a = Math.atan2(z, x);
    return [Math.cos(a) * fp.radius, Math.sin(a) * fp.radius];
  }
  const halfW = fp.w / 2;
  const halfD = fp.d / 2;
  return [
    Math.max(-halfW, Math.min(halfW, x)),
    Math.max(-halfD, Math.min(halfD, z)),
  ];
};
