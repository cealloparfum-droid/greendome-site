/**
 * Furniture3D — chaque pièce dessinée dans le dôme.
 *
 * Stratégie de rendu (robuste, sans dépendances fragiles) :
 *   - Items avec photo : un socle 3D coloré au sol matérialise l'emprise
 *     (RoundedBox), un panneau billboard (mesh qui regarde la caméra à chaque frame
 *     via useFrame) montre la photo réelle du produit.
 *   - Jacuzzis : géométrie procédurale (cuve carrée / ronde / octogonale)
 *     avec un miroir d'eau translucide.
 *   - Décor & lumière (tables, plantes, lampadaire, tapis) : 100% procédural.
 *
 * On évite Billboard de drei (incompatibilités de version) et toute API canvas-2D
 * non standard (letterSpacing) — un mesh + lookAt suffit.
 */

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { FurnitureSpec, PlacedFurniture } from "@/lib/furniture-catalog";
import { findSpec } from "@/lib/furniture-catalog";

type Props = {
  placed: PlacedFurniture;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onPointerDown?: (id: string, hitPoint: THREE.Vector3) => void;
};

/** Cache de textures par URL pour éviter les re-loads. */
const textureCache = new Map<string, THREE.Texture>();
const getTexture = (url: string): THREE.Texture => {
  const cached = textureCache.get(url);
  if (cached) return cached;
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.set(url, tex);
  return tex;
};

/**
 * Plaquette code produit — texture canvas 2D simple, sans API exotique
 * (pas de letterSpacing). On dessine un fond sombre avec liseré laiton + le ref
 * en majuscules et chiffres, espacés à la main caractère par caractère.
 */
const labelCache = new Map<string, THREE.CanvasTexture>();
const makeLabelTexture = (text: string): THREE.CanvasTexture | null => {
  const cached = labelCache.get(text);
  if (cached) return cached;
  if (typeof document === "undefined") return null;
  const W = 512;
  const H = 96;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Fond sombre arrondi
  const r = 14;
  ctx.fillStyle = "rgba(13, 12, 10, 0.95)";
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(W - r, 0);
  ctx.quadraticCurveTo(W, 0, W, r);
  ctx.lineTo(W, H - r);
  ctx.quadraticCurveTo(W, H, W - r, H);
  ctx.lineTo(r, H);
  ctx.quadraticCurveTo(0, H, 0, H - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Liseré laiton
  ctx.strokeStyle = "#c89758";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Texte : tracking large, on l'écrit caractère par caractère
  const upper = text.toUpperCase();
  const fontSize = 38;
  ctx.font = `600 ${fontSize}px "Cormorant Garamond", "Playfair Display", Georgia, serif`;
  ctx.fillStyle = "#e6ad4d";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  // Mesure la largeur totale avec espacement manuel
  const trackingPx = 6;
  let totalW = 0;
  for (const ch of upper) totalW += ctx.measureText(ch).width + trackingPx;
  totalW -= trackingPx;
  let x = (W - totalW) / 2;
  const y = H / 2;
  for (const ch of upper) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + trackingPx;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  labelCache.set(text, tex);
  return tex;
};

const Furniture3D = ({ placed, selected, onSelect, onPointerDown }: Props) => {
  const spec = useMemo(() => findSpec(placed.ref), [placed.ref]);
  if (!spec) return null;

  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelect?.(placed.id);
    onPointerDown?.(placed.id, e.point.clone());
  };

  const haloRadius = Math.max(spec.size.w, spec.size.d) / 2;

  return (
    <group
      position={[placed.pos[0], 0, placed.pos[1]]}
      rotation={[0, placed.rotY, 0]}
      onPointerDown={handleDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {renderShape(spec)}

      {/* Petite flèche sol indiquant l'orientation (visible seulement si sélectionné) */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[haloRadius + 0.05, 0.006, 0]}>
          <circleGeometry args={[0.08, 3]} />
          <meshBasicMaterial color="#d4a861" />
        </mesh>
      )}

      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[haloRadius + 0.05, haloRadius + 0.22, 56]} />
          <meshBasicMaterial color="#d4a861" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// ----------------------------------------------------------------------
// Dispatcher
// ----------------------------------------------------------------------
const renderShape = (spec: FurnitureSpec) => {
  const { kind } = spec;

  // Mobilier avec photo → socle + carte photo qui regarde la caméra
  const isPhotoMobilier =
    kind === "sofa-3" ||
    kind === "sofa-corner" ||
    kind === "sofa-curved" ||
    kind === "daybed" ||
    kind === "armchair" ||
    kind === "bed-king";

  if (isPhotoMobilier && spec.image) {
    return <PhotoProduct spec={spec} />;
  }
  if (isPhotoMobilier) {
    // Pas de photo : on rend juste un socle générique
    return <PlinthOnly spec={spec} />;
  }

  switch (kind) {
    case "jacuzzi-square":
      return <JacuzziSquare spec={spec} />;
    case "jacuzzi-round":
      return <JacuzziRound spec={spec} />;
    case "jacuzzi-octagon":
      return <JacuzziOctagon spec={spec} />;
    case "pouf":
      return <Pouf spec={spec} />;
    case "coffee-table":
      return <CoffeeTable spec={spec} />;
    case "side-table":
      return <SideTable spec={spec} />;
    case "rug-round":
      return <Rug spec={spec} />;
    case "floor-lamp":
      return <FloorLamp spec={spec} />;
    case "plant":
      return <Plant spec={spec} />;
    default:
      return <PlinthOnly spec={spec} />;
  }
};

// =====================================================================
// LookAtCamera — fait que ce groupe tourne en permanence vers la caméra
// =====================================================================
const LookAtCamera = ({
  position,
  children,
}: {
  position: [number, number, number];
  children: React.ReactNode;
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (!ref.current) return;
    // Position en world : on récupère la position monde du groupe
    const worldPos = new THREE.Vector3();
    ref.current.getWorldPosition(worldPos);
    // On veut faire face à la caméra (en gardant l'axe Y vertical)
    const camPos = camera.position.clone();
    camPos.y = worldPos.y; // on neutralise l'inclinaison verticale
    ref.current.lookAt(camPos);
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
};

// =====================================================================
// PhotoProduct — socle + carte photo billboard
// =====================================================================
const PhotoProduct = ({ spec }: { spec: FurnitureSpec }) => {
  const { size, color, accent, image, ref } = spec;
  const { w, d, h } = size;

  const plinthH = Math.min(h * 0.45, 0.55);
  const cardW = Math.min(w, 2.0);
  const cardH = Math.max(h * 1.05, 0.9);
  const cardY = plinthH + cardH / 2 + 0.05;

  const texture = useMemo(() => (image ? getTexture(image) : null), [image]);
  const labelTex = useMemo(() => makeLabelTexture(ref), [ref]);
  const ringRadius = Math.max(w, d) / 2;

  // Petite plaquette code, juste sous la photo
  const labelW = Math.min(cardW * 0.8, 1.1);
  const labelH = labelW * (96 / 512); // ratio canvas

  return (
    <group>
      {/* Socle = silhouette colorée au sol, signale l'emprise */}
      <RoundedBox
        args={[w, plinthH, d]}
        radius={Math.min(0.08, plinthH * 0.4)}
        smoothness={4}
        position={[0, plinthH / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
      </RoundedBox>

      {/* Liseré laiton à la base (signature Greendome) */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ringRadius * 0.9, ringRadius, 48]} />
        <meshStandardMaterial
          color={accent ?? "#c89758"}
          roughness={0.3}
          metalness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Carte photo qui regarde la caméra en permanence */}
      {texture && (
        <LookAtCamera position={[0, cardY, 0]}>
          {/* Cadre laiton derrière la photo */}
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[cardW + 0.06, cardH + 0.06]} />
            <meshBasicMaterial color={accent ?? "#c89758"} />
          </mesh>
          {/* Photo */}
          <mesh>
            <planeGeometry args={[cardW, cardH]} />
            <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          {/* Plaquette code produit, sous la photo */}
          {labelTex && (
            <mesh position={[0, -cardH / 2 - labelH / 2 - 0.04, 0.001]}>
              <planeGeometry args={[labelW, labelH]} />
              <meshBasicMaterial map={labelTex} transparent toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          )}
        </LookAtCamera>
      )}
      {/* Si pas de photo : on affiche quand même la plaquette code au-dessus du socle */}
      {!texture && labelTex && (
        <LookAtCamera position={[0, plinthH + 0.25, 0]}>
          <mesh>
            <planeGeometry args={[labelW, labelH]} />
            <meshBasicMaterial map={labelTex} transparent toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </LookAtCamera>
      )}
    </group>
  );
};

// Socle seul, sans photo (fallback)
const PlinthOnly = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, d, h } = spec.size;
  const plinthH = Math.min(h * 0.55, 0.7);
  return (
    <RoundedBox
      args={[w, plinthH, d]}
      radius={0.05}
      smoothness={4}
      position={[0, plinthH / 2, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={spec.color} roughness={0.85} metalness={0.05} />
    </RoundedBox>
  );
};

// =====================================================================
// Jacuzzis — géométries procédurales + miroir d'eau + photo billboard
// =====================================================================

const Water = ({ size, shape }: { size: number; shape: "circle" | "square" | "octagon" }) => {
  const geom = useMemo(() => {
    if (shape === "circle") return new THREE.CircleGeometry(size / 2 - 0.05, 48);
    if (shape === "octagon") return new THREE.CircleGeometry(size / 2 - 0.05, 8);
    return new THREE.PlaneGeometry(size - 0.1, size - 0.1);
  }, [size, shape]);

  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.78, 0]}>
      <meshPhysicalMaterial
        color="#3a8aa8"
        transmission={0.55}
        thickness={0.3}
        ior={1.33}
        roughness={0.05}
        metalness={0}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const JacuzziPhoto = ({ spec }: { spec: FurnitureSpec }) => {
  const texture = useMemo(
    () => (spec.image ? getTexture(spec.image) : null),
    [spec.image]
  );
  const labelTex = useMemo(() => makeLabelTexture(spec.ref), [spec.ref]);
  if (!texture) return null;
  const cardW = Math.min(spec.size.w, 1.6);
  const cardH = cardW * 0.66;
  const labelW = Math.min(cardW * 0.85, 1.0);
  const labelH = labelW * (96 / 512);
  return (
    <LookAtCamera position={[0, spec.size.h + cardH / 2 + 0.4, 0]}>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[cardW + 0.05, cardH + 0.05]} />
        <meshBasicMaterial color={spec.accent ?? "#c89758"} />
      </mesh>
      <mesh>
        <planeGeometry args={[cardW, cardH]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {labelTex && (
        <mesh position={[0, -cardH / 2 - labelH / 2 - 0.03, 0.001]}>
          <planeGeometry args={[labelW, labelH]} />
          <meshBasicMaterial map={labelTex} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      )}
    </LookAtCamera>
  );
};

const JacuzziSquare = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, d, h } = spec.size;
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.08} smoothness={4} position={[0, h / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={spec.color} roughness={0.4} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[w + 0.04, 0.04, d + 0.04]} radius={0.02} smoothness={3} position={[0, h + 0.02, 0]}>
        <meshStandardMaterial color={spec.accent ?? "#c89758"} metalness={0.85} roughness={0.25} />
      </RoundedBox>
      <Water size={w} shape="square" />
      <JacuzziPhoto spec={spec} />
    </group>
  );
};

const JacuzziRound = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w / 2, (w / 2) * 0.95, h, 48]} />
        <meshStandardMaterial color={spec.color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, h + 0.02, 0]}>
        <torusGeometry args={[w / 2 + 0.01, 0.025, 12, 48]} />
        <meshStandardMaterial color={spec.accent ?? "#c89758"} metalness={0.9} roughness={0.2} />
      </mesh>
      <Water size={w} shape="circle" />
      <JacuzziPhoto spec={spec} />
    </group>
  );
};

const JacuzziOctagon = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <group>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w / 2, w / 2, h, 8]} />
        <meshStandardMaterial color={spec.color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, h + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[w / 2 - 0.01, w / 2 + 0.04, 8]} />
        <meshStandardMaterial color={spec.accent ?? "#c89758"} metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <Water size={w} shape="octagon" />
      <JacuzziPhoto spec={spec} />
    </group>
  );
};

// =====================================================================
// Décor & lumière (procédural pur)
// =====================================================================

const Pouf = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[w / 2, (w / 2) * 0.95, h, 24]} />
      <meshStandardMaterial color={spec.color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
};

const CoffeeTable = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <group>
      <mesh position={[0, h - 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w / 2, w / 2, 0.05, 32]} />
        <meshStandardMaterial color={spec.color} roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, (h - 0.05) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, h - 0.05, 16]} />
        <meshStandardMaterial color={spec.accent ?? "#3a342c"} metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[w * 0.3, w * 0.32, 0.03, 24]} />
        <meshStandardMaterial color={spec.accent ?? "#3a342c"} metalness={0.5} roughness={0.45} />
      </mesh>
    </group>
  );
};

const SideTable = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <group>
      <mesh position={[0, h - 0.02, 0]} castShadow>
        <cylinderGeometry args={[w / 2, w / 2, 0.04, 24]} />
        <meshStandardMaterial color={spec.color} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, (h - 0.04) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, h - 0.04, 12]} />
        <meshStandardMaterial color={spec.accent ?? "#c89758"} metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
};

const Rug = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, h / 2 + 0.001, 0]} receiveShadow>
      <circleGeometry args={[w / 2, 64]} />
      <meshStandardMaterial color={spec.color} roughness={1} metalness={0} />
    </mesh>
  );
};

const FloorLamp = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[w / 2, w / 2, 0.04, 24]} />
        <meshStandardMaterial color={spec.accent ?? "#3a342c"} metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, h - 0.4, 12]} />
        <meshStandardMaterial color={spec.accent ?? "#3a342c"} metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, h - 0.18, 0]} castShadow>
        <cylinderGeometry args={[(w / 2) * 0.85, (w / 2) * 0.6, 0.36, 24, 1, true]} />
        <meshStandardMaterial color={spec.color} roughness={0.85} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, h - 0.2, 0]} intensity={0.4} distance={3} color="#f5d29a" />
    </group>
  );
};

const Plant = ({ spec }: { spec: FurnitureSpec }) => {
  const { w, h } = spec.size;
  const potH = 0.35;
  return (
    <group>
      <mesh position={[0, potH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[(w / 2) * 0.55, (w / 2) * 0.45, potH, 24]} />
        <meshStandardMaterial color={spec.accent ?? "#7a5a3a"} roughness={0.85} />
      </mesh>
      <mesh position={[0, potH + (h - potH) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, h - potH, 12]} />
        <meshStandardMaterial color="#5a4630" roughness={0.85} />
      </mesh>
      <mesh position={[0, h - 0.25, 0]} castShadow>
        <sphereGeometry args={[w * 0.42, 16, 12]} />
        <meshStandardMaterial color={spec.color} roughness={0.85} />
      </mesh>
      <mesh position={[w * 0.18, h - 0.4, w * 0.12]} castShadow>
        <sphereGeometry args={[w * 0.28, 12, 10]} />
        <meshStandardMaterial color={spec.color} roughness={0.85} />
      </mesh>
      <mesh position={[-w * 0.2, h - 0.45, -w * 0.1]} castShadow>
        <sphereGeometry args={[w * 0.3, 12, 10]} />
        <meshStandardMaterial color={spec.color} roughness={0.85} />
      </mesh>
    </group>
  );
};

export default Furniture3D;
