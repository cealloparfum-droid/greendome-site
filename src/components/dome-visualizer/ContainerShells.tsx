/**
 * ContainerShells — coques 3D procédurales pour chaque type de structure
 * du visualiseur (dôme, pavillon, lodge safari, tipi, yourte).
 *
 * Chaque coque expose la même interface :
 *   - prend un `size` (slider value, mètres)
 *   - prend un flag `walking` pour réduire l'opacité en mode visite
 *   - dessine sa coque + sol intérieur + sol extérieur + petit halo doré
 *
 * Le footprint d'aménagement n'est pas dessiné ici : il est calculé dans
 * container-catalog.ts et utilisé par DomeViewer3D pour borner le drag.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { ContainerArchetype } from "@/lib/container-catalog";

// =====================================================================
// Inhabitants — petites silhouettes pour donner l'échelle
// =====================================================================
const Inhabitant = ({
  position,
  height = 1.7,
}: {
  position: [number, number, number];
  height?: number;
}) => (
  <group position={position}>
    <mesh position={[0, height - 0.1, 0]} castShadow>
      <sphereGeometry args={[0.12, 16, 12]} />
      <meshStandardMaterial color="#3a342c" roughness={0.85} />
    </mesh>
    <mesh position={[0, height / 2 - 0.05, 0]} castShadow>
      <capsuleGeometry args={[0.12, height - 0.4, 6, 12]} />
      <meshStandardMaterial color="#2c2823" roughness={0.85} />
    </mesh>
  </group>
);

// =====================================================================
// 1) DOME GEODESIC — coque transparente, signature Greendome
// =====================================================================
const DomeShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || walking) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.015;
  });

  const geodesic = useMemo(() => {
    // Sphère 5/8 : on coupe à hauteur ~0.4 * radius pour une silhouette
    // de dôme géodésique réaliste (un peu plus que la moitié)
    const ico = new THREE.IcosahedronGeometry(radius, 2);
    const pos = ico.attributes.position;
    const arr = pos.array as Float32Array;
    const cutY = -radius * 0.25;
    for (let i = 0; i < arr.length; i += 3) {
      if (arr[i + 1] < cutY) arr[i + 1] = cutY;
    }
    // Translation pour que la base touche y=0
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] -= cutY;
    }
    pos.needsUpdate = true;
    ico.computeVertexNormals();
    return ico;
  }, [radius]);

  return (
    <group ref={groupRef}>
      <ExteriorFloor radius={radius * 1.6} />
      <InteriorCircleFloor radius={radius} />
      <FootprintRing radius={radius} />

      <mesh geometry={geodesic} castShadow>
        <meshPhysicalMaterial
          transmission={0.85}
          thickness={0.4}
          roughness={0.08}
          ior={1.45}
          color="#e8f0f5"
          attenuationColor="#cfd8df"
          attenuationDistance={4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0}
          envMapIntensity={1.4}
          transparent
          opacity={walking ? 0.35 : 0.55}
          side={THREE.DoubleSide}
        />
        <Edges threshold={1} color="#d4a861" />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.45, 0, radius * 0.2]} height={1.7} />
          <Inhabitant position={[-radius * 0.35, 0, -radius * 0.3]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 2) PAVILION ARCHES — toiles tendues blanches sur arches métalliques
// =====================================================================
const PavilionShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  // Pavilion : largeur = size, profondeur = ratio 0.7
  const w = size;
  const d = size * 0.7;
  const h = 3.6;
  const peakH = 4.5;

  // Arches : 4 arches le long de la profondeur
  const archCount = 4;
  const arches = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < archCount; i++) {
      out.push(-d / 2 + (d / (archCount - 1)) * i);
    }
    return out;
  }, [d, archCount]);

  // Géométrie de la toile : surface en arc de cercle, par tranches d'arch à arch
  const canopyGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const segs = 16;
    const positions: number[] = [];
    const indices: number[] = [];
    let vi = 0;
    for (let a = 0; a < arches.length - 1; a++) {
      const z1 = arches[a];
      const z2 = arches[a + 1];
      // À chaque arche, l'arc va de -w/2 à w/2 en passant par peakH au sommet
      for (let s = 0; s <= segs; s++) {
        const t = s / segs;
        const x = -w / 2 + w * t;
        // Profil arc : sinusoïde
        const y = h + (peakH - h) * Math.sin(Math.PI * t);
        positions.push(x, y, z1);
        positions.push(x, y, z2);
      }
      // Indices des deux triangles par segment
      for (let s = 0; s < segs; s++) {
        const base = vi + s * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
      vi += (segs + 1) * 2;
    }
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [arches, w, h, peakH]);

  return (
    <group>
      <ExteriorFloor radius={Math.max(w, d) * 0.85} />
      <InteriorRectFloor w={w - 0.3} d={d - 0.3} />
      <FootprintRectRing w={w - 0.6} d={d - 0.6} />

      {/* Arches métalliques (laiton oxydé) */}
      {arches.map((z, i) => (
        <ArchTube key={i} w={w} h={h} peakH={peakH} z={z} />
      ))}

      {/* Toile blanche tendue */}
      <mesh geometry={canopyGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#f7f5f0"
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.92}
          clearcoat={0.4}
        />
      </mesh>

      {/* Faîtage doré */}
      <mesh position={[0, peakH + 0.02, 0]}>
        <boxGeometry args={[0.04, 0.04, d]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[w * 0.25, 0, d * 0.15]} height={1.7} />
          <Inhabitant position={[-w * 0.2, 0, -d * 0.2]} height={1.65} />
        </>
      )}
    </group>
  );
};

// Tube en arc de cercle pour les arches du pavillon
const ArchTube = ({
  w,
  h,
  peakH,
  z,
}: {
  w: number;
  h: number;
  peakH: number;
  z: number;
}) => {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segs = 24;
    for (let s = 0; s <= segs; s++) {
      const t = s / segs;
      const x = -w / 2 + w * t;
      const y = h + (peakH - h) * Math.sin(Math.PI * t);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, [w, h, peakH, z]);

  const geom = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.04, 8, false), [curve]);

  return (
    <mesh geometry={geom} castShadow>
      <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
    </mesh>
  );
};

// =====================================================================
// 3) SAFARI LODGE — toile beige, voûte en demi-tunnel
// =====================================================================
const SafariShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const w = size;
  const d = size * 1.15;
  const wallH = 1.2;
  const peakH = 3.0;

  // Toile : extrusion d'un demi-cercle le long de la profondeur (forme "Quonset")
  const canopyGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const segs = 24;
    const positions: number[] = [];
    const indices: number[] = [];
    // Sur chaque pas de profondeur, on construit l'arc
    const dSegs = 1; // un seul segment en profondeur, on dupliquera
    for (let s = 0; s <= segs; s++) {
      const t = s / segs;
      const angle = Math.PI * t;
      const x = -w / 2 * Math.cos(angle);
      const y = wallH + (peakH - wallH) * Math.sin(angle);
      positions.push(x, y, -d / 2);
      positions.push(x, y, d / 2);
    }
    void dSegs;
    for (let s = 0; s < segs; s++) {
      const base = s * 2;
      indices.push(base, base + 1, base + 2);
      indices.push(base + 1, base + 3, base + 2);
    }
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [w, d, wallH, peakH]);

  return (
    <group>
      <ExteriorFloor radius={Math.max(w, d) * 0.85} />
      {/* Terrasse bois autour */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[w + 1.0, d + 1.0]} />
        <meshStandardMaterial color="#5a4630" roughness={0.85} metalness={0.05} />
      </mesh>
      <InteriorRectFloor w={w - 0.3} d={d - 0.3} color="#26221c" />
      <FootprintRectRing w={w - 0.5} d={d - 0.5} />

      {/* Murs bas (toile) */}
      <mesh position={[w / 2, wallH / 2, 0]}>
        <boxGeometry args={[0.05, wallH, d]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.85} side={THREE.DoubleSide} transparent opacity={walking ? 0.4 : 0.85} />
      </mesh>
      <mesh position={[-w / 2, wallH / 2, 0]}>
        <boxGeometry args={[0.05, wallH, d]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.85} side={THREE.DoubleSide} transparent opacity={walking ? 0.4 : 0.85} />
      </mesh>

      {/* Voûte */}
      <mesh geometry={canopyGeom} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#d4c4a0"
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.92}
          clearcoat={0.3}
        />
      </mesh>

      {/* Pignons triangulaires aux extrémités */}
      <GablePanel z={-d / 2} w={w} wallH={wallH} peakH={peakH} walking={walking} />
      <GablePanel z={d / 2} w={w} wallH={wallH} peakH={peakH} walking={walking} />

      {/* Faîtage cuivre */}
      <mesh position={[0, peakH + 0.02, 0]}>
        <boxGeometry args={[0.04, 0.04, d]} />
        <meshStandardMaterial color="#a86a3a" metalness={0.85} roughness={0.3} />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[w * 0.2, 0, d * 0.15]} height={1.7} />
          <Inhabitant position={[-w * 0.15, 0, -d * 0.25]} height={1.65} />
        </>
      )}
    </group>
  );
};

const GablePanel = ({
  z,
  w,
  wallH,
  peakH,
  walking,
}: {
  z: number;
  w: number;
  wallH: number;
  peakH: number;
  walking: boolean;
}) => {
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    const segs = 16;
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(w / 2, wallH);
    for (let s = 0; s <= segs; s++) {
      const t = s / segs;
      const angle = Math.PI * t;
      const x = (w / 2) * Math.cos(angle);
      const y = wallH + (peakH - wallH) * Math.sin(angle);
      shape.lineTo(x, y);
    }
    shape.lineTo(-w / 2, wallH);
    shape.lineTo(-w / 2, 0);
    return new THREE.ShapeGeometry(shape);
  }, [w, wallH, peakH]);

  return (
    <mesh geometry={geom} position={[0, 0, z]}>
      <meshPhysicalMaterial
        color="#d4c4a0"
        roughness={0.85}
        metalness={0}
        side={THREE.DoubleSide}
        transparent
        opacity={walking ? 0.5 : 0.9}
      />
    </mesh>
  );
};

// =====================================================================
// 4) TIPI MODERNE — cône, structure bois apparente
// =====================================================================
const TipiShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  // Vrai tipi : nettement plus haut que large (ratio ~1.4)
  const height = size * 1.35;

  // Mâts de bois (8 mâts visibles)
  const masts = useMemo(() => {
    const out: Array<{ pos: [number, number, number]; rotZ: number; rotY: number; len: number }> = [];
    const N = 8;
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const len = Math.sqrt(radius * radius + height * height);
      // Position au sol
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      out.push({
        pos: [x / 2, height / 2, z / 2],
        rotZ: -Math.atan2(radius, height),
        rotY: -angle + Math.PI / 2,
        len,
      });
    }
    return out;
  }, [radius, height]);

  return (
    <group>
      <ExteriorFloor radius={radius * 1.6} />
      <InteriorCircleFloor radius={radius} color="#3a2820" />
      <FootprintRing radius={radius} />

      {/* Toile conique */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <coneGeometry args={[radius, height, 8, 1, true]} />
        <meshPhysicalMaterial
          color="#e8d8b8"
          roughness={0.9}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.5 : 0.9}
          clearcoat={0.2}
        />
      </mesh>

      {/* Mâts apparents (extérieur dépassant du sommet) */}
      {masts.map((m, i) => (
        <group key={i} position={m.pos} rotation={[0, m.rotY, m.rotZ]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, m.len + 0.6, 8]} />
            <meshStandardMaterial color="#7a5a3a" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Couronne sommitale */}
      <mesh position={[0, height + 0.05, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 16]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Foyer central simulé */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 0.1, 24]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.95} />
      </mesh>
      <pointLight position={[0, 0.4, 0]} intensity={walking ? 0.8 : 0.4} distance={4} color="#ff8a4a" />

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.4, 0, radius * 0.15]} height={1.7} />
          <Inhabitant position={[-radius * 0.3, 0, -radius * 0.35]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 5) YURT GLASS — cylindre vitré + couronne conique
// =====================================================================
const YurtShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  // Yourte : mur cylindrique haut, couronne conique BASSE et plate
  const wallH = 2.4;
  const roofH = size * 0.28;

  return (
    <group>
      <ExteriorFloor radius={radius * 1.6} />
      <InteriorCircleFloor radius={radius} color="#26221c" />
      <FootprintRing radius={radius} />

      {/* Cylindre vitré */}
      <mesh position={[0, wallH / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, wallH, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e8f0f5"
          roughness={0.05}
          metalness={0}
          transmission={0.85}
          thickness={0.3}
          ior={1.45}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.35 : 0.55}
          clearcoat={1}
          attenuationColor="#cfd8df"
          attenuationDistance={4}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Anneau supérieur */}
      <mesh position={[0, wallH, 0]}>
        <torusGeometry args={[radius, 0.03, 8, 32]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Anneau inférieur */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[radius, 0.03, 8, 32]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Couronne conique */}
      <mesh position={[0, wallH + roofH / 2, 0]} castShadow>
        <coneGeometry args={[radius, roofH, 32]} />
        <meshPhysicalMaterial
          color="#f0e6d0"
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.92}
        />
      </mesh>

      {/* Couronne sommitale */}
      <mesh position={[0, wallH + roofH + 0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Lattes verticales (8 lattes laiton) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, wallH / 2, Math.sin(angle) * radius]}
          >
            <boxGeometry args={[0.03, wallH, 0.03]} />
            <meshStandardMaterial color="#c89758" metalness={0.85} roughness={0.3} />
          </mesh>
        );
      })}

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.4, 0, radius * 0.2]} height={1.7} />
          <Inhabitant position={[-radius * 0.35, 0, -radius * 0.3]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// Helpers : sols et anneaux communs
// =====================================================================
const ExteriorFloor = ({ radius }: { radius: number }) => (
  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
    <circleGeometry args={[radius, 64]} />
    <meshStandardMaterial color="#1a1814" roughness={0.95} metalness={0.05} />
  </mesh>
);

const InteriorCircleFloor = ({
  radius,
  color = "#26221c",
}: {
  radius: number;
  color?: string;
}) => (
  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
    <circleGeometry args={[radius, 64]} />
    <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
  </mesh>
);

const InteriorRectFloor = ({
  w,
  d,
  color = "#26221c",
}: {
  w: number;
  d: number;
  color?: string;
}) => (
  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
    <planeGeometry args={[w, d]} />
    <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
  </mesh>
);

const FootprintRing = ({ radius }: { radius: number }) => (
  <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
    <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
    <meshStandardMaterial color="#c89758" metalness={0.95} roughness={0.25} side={THREE.DoubleSide} />
  </mesh>
);

const FootprintRectRing = ({ w, d }: { w: number; d: number }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, -d / 2);
    s.lineTo(w / 2, -d / 2);
    s.lineTo(w / 2, d / 2);
    s.lineTo(-w / 2, d / 2);
    s.lineTo(-w / 2, -d / 2);
    const hole = new THREE.Path();
    const inset = 0.04;
    hole.moveTo(-w / 2 + inset, -d / 2 + inset);
    hole.lineTo(w / 2 - inset, -d / 2 + inset);
    hole.lineTo(w / 2 - inset, d / 2 - inset);
    hole.lineTo(-w / 2 + inset, d / 2 - inset);
    hole.lineTo(-w / 2 + inset, -d / 2 + inset);
    s.holes.push(hole);
    return s;
  }, [w, d]);

  const geom = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);

  return (
    <mesh geometry={geom} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <meshStandardMaterial color="#c89758" metalness={0.95} roughness={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
};

// =====================================================================
// 6) DOME BUBBLE-ARCH — bulle organique légèrement étirée + porche d'entrée
// =====================================================================
const DomeBubbleArchShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  const height = radius * 1.05; // légèrement étiré, organique
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || walking) return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.012;
  });

  // Coupole : sphère ovoïde (étirée verticalement)
  const bubbleGeom = useMemo(() => {
    const s = new THREE.SphereGeometry(radius, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    // Étirer légèrement en Y
    const arr = s.attributes.position.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] *= height / radius;
    }
    s.attributes.position.needsUpdate = true;
    s.computeVertexNormals();
    return s;
  }, [radius, height]);

  // Porche : un mini-tunnel cylindrique sortant à l'avant
  const porchLen = radius * 0.45;
  const porchR = radius * 0.42;
  const porchH = porchR * 1.1;

  return (
    <group ref={groupRef}>
      <ExteriorFloor radius={radius * 1.7} />
      <InteriorCircleFloor radius={radius} />
      <FootprintRing radius={radius} />

      {/* Bulle */}
      <mesh geometry={bubbleGeom} castShadow>
        <meshPhysicalMaterial
          color="#eef3f8"
          roughness={0.06}
          metalness={0}
          transmission={0.92}
          thickness={0.4}
          ior={1.45}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.32 : 0.5}
          clearcoat={1}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Anneau de base laiton */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[radius, 0.025, 8, 48]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Porche d'entrée — demi-cylindre vitré sortant à l'avant */}
      <group position={[0, 0, radius - 0.1]}>
        {/* toit du porche : demi-cylindre couché */}
        <mesh
          position={[0, porchH / 2, porchLen / 2]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[porchR, porchR, porchLen, 24, 1, true, 0, Math.PI]}
          />
          <meshPhysicalMaterial
            color="#eef3f8"
            roughness={0.06}
            metalness={0}
            transmission={0.9}
            thickness={0.3}
            ior={1.45}
            side={THREE.DoubleSide}
            transparent
            opacity={walking ? 0.3 : 0.5}
            clearcoat={1}
          />
        </mesh>
        {/* Vitre frontale du porche */}
        <mesh position={[0, porchH * 0.5, porchLen]}>
          <circleGeometry args={[porchR, 24, 0, Math.PI]} />
          <meshPhysicalMaterial
            color="#dde6ec"
            roughness={0.05}
            transmission={0.85}
            thickness={0.2}
            side={THREE.DoubleSide}
            transparent
            opacity={walking ? 0.3 : 0.5}
          />
        </mesh>
        {/* Cadre porche laiton (bord avant) */}
        <mesh position={[0, porchH / 2, porchLen]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[porchR, 0.025, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.4, 0, radius * 0.1]} height={1.7} />
          <Inhabitant position={[-radius * 0.3, 0, -radius * 0.3]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 6bis) PAVILION MULTIPIC — tente avec plusieurs pics pointus (étoile)
// =====================================================================
const PavilionMultipicShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  const wallH = 1.5;
  const peakH = size * 0.85;
  // Nombre de pics : selon la taille (3 → 6)
  const pics = Math.max(3, Math.min(6, Math.round(size / 1.7)));

  // Géométrie : pour chaque pic, un cône fait de 2 triangles (fan depuis le centre)
  const tentGeom = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    const segs = pics; // un sommet par pic
    // Centre haut (point le plus haut, au-dessus du centre)
    positions.push(0, peakH * 0.55, 0); // 0 — centre intérieur
    // Pour chaque pic, deux sommets : un POINT haut au-dessus de la corniche, et un POINT BAS sur la couronne
    // Chaque pic est positionné à un angle.
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      // Sommet pointu (haut)
      positions.push(Math.cos(a) * radius * 0.3, peakH, Math.sin(a) * radius * 0.3);
      // Sommet bas du pic, au bord (extérieur)
      positions.push(Math.cos(a) * radius, wallH, Math.sin(a) * radius);
    }
    // Triangles : pour chaque pic i :
    //   pic_top(i) — base_corner(i) — base_corner(i+1)
    //   centre(0) — pic_top(i) — pic_top(i+1)
    for (let i = 0; i < segs; i++) {
      const next = (i + 1) % segs;
      const piTop = 1 + i * 2;
      const piBase = piTop + 1;
      const niTop = 1 + next * 2;
      const niBase = niTop + 1;
      // Triangle de toile entre 2 pics : piTop, piBase, niBase, piTop, niBase, niTop
      indices.push(piTop, piBase, niBase);
      indices.push(piTop, niBase, niTop);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [radius, peakH, wallH, pics]);

  return (
    <group>
      <ExteriorFloor radius={radius * 1.7} />
      <InteriorCircleFloor radius={radius} color="#3a2f23" />
      <FootprintRing radius={radius - 0.2} />

      {/* Toile multi-pic */}
      <mesh geometry={tentGeom} castShadow>
        <meshPhysicalMaterial
          color="#f7f5f0"
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.92}
          clearcoat={0.4}
        />
      </mesh>

      {/* Pointes laiton sur chaque pic */}
      {Array.from({ length: pics }).map((_, i) => {
        const a = (i / pics) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius * 0.3, peakH + 0.15, Math.sin(a) * radius * 0.3]}
          >
            <coneGeometry args={[0.07, 0.3, 8]} />
            <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
          </mesh>
        );
      })}

      {/* Anneau de couronne (relier tous les bas-de-pic) */}
      <mesh position={[0, wallH, 0]}>
        <torusGeometry args={[radius, 0.03, 8, 48]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.3} />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.45, 0, radius * 0.15]} height={1.7} />
          <Inhabitant position={[-radius * 0.3, 0, -radius * 0.4]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 7) PAVILION PARASOL — un mât central, toile en ombrelle
// =====================================================================
const PavilionParasolShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  const mastH = 4.2;
  const ringH = 3.0;

  // Toile en cône lissé (point haut, base évasée)
  const canopyGeom = useMemo(() => {
    const segs = 32;
    const positions: number[] = [];
    const indices: number[] = [];
    // Sommet
    positions.push(0, mastH, 0);
    // Couronne
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      // Ondulation pour effet "scalloped"
      const r = radius * (1 + Math.sin(a * 8) * 0.04);
      positions.push(Math.cos(a) * r, ringH, Math.sin(a) * r);
    }
    for (let i = 0; i < segs; i++) {
      indices.push(0, i + 1, i + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [radius, mastH, ringH]);

  return (
    <group>
      <ExteriorFloor radius={radius * 1.6} />
      <InteriorCircleFloor radius={radius * 0.95} color="#3a2f23" />
      <FootprintRing radius={radius - 0.2} />

      {/* Mât central */}
      <mesh position={[0, mastH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, mastH, 12]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.7} />
      </mesh>

      {/* Toile parasol */}
      <mesh geometry={canopyGeom} castShadow>
        <meshPhysicalMaterial
          color="#f7f5f0"
          roughness={0.85}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.92}
          clearcoat={0.4}
        />
      </mesh>

      {/* Couronne sommitale dorée */}
      <mesh position={[0, mastH + 0.1, 0]}>
        <coneGeometry args={[0.12, 0.3, 12]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.45, 0, radius * 0.15]} height={1.7} />
          <Inhabitant position={[-radius * 0.3, 0, -radius * 0.4]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 8) SAFARI PYRAMID — tente safari classique, toit en pyramide
// =====================================================================
const SafariPyramidShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const w = size;
  const d = size * 0.95;
  // Tente safari classique : murs bas, pic franc et haut
  const wallH = 1.4;
  const peakH = size * 0.95;

  // 4 panneaux de toit (pyramide)
  const roofGeom = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    // 4 coins de la base + 1 sommet
    const corners = [
      [-w / 2, wallH, -d / 2],
      [w / 2, wallH, -d / 2],
      [w / 2, wallH, d / 2],
      [-w / 2, wallH, d / 2],
    ];
    const peak = [0, peakH, 0];
    corners.forEach((c) => positions.push(c[0], c[1], c[2]));
    positions.push(peak[0], peak[1], peak[2]); // index 4 = peak
    // 4 triangles (chaque côté)
    for (let i = 0; i < 4; i++) {
      indices.push(i, (i + 1) % 4, 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [w, d, wallH, peakH]);

  return (
    <group>
      <ExteriorFloor radius={Math.max(w, d) * 0.85} />
      <InteriorRectFloor w={w - 0.3} d={d - 0.3} color="#3a2820" />
      <FootprintRectRing w={w - 0.5} d={d - 0.5} />

      {/* Murs bas (4 côtés) */}
      {[
        { pos: [0, wallH / 2, -d / 2] as [number, number, number], args: [w, wallH, 0.05] as [number, number, number] },
        { pos: [0, wallH / 2, d / 2] as [number, number, number], args: [w, wallH, 0.05] as [number, number, number] },
        { pos: [-w / 2, wallH / 2, 0] as [number, number, number], args: [0.05, wallH, d] as [number, number, number] },
        { pos: [w / 2, wallH / 2, 0] as [number, number, number], args: [0.05, wallH, d] as [number, number, number] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos}>
          <boxGeometry args={wall.args} />
          <meshStandardMaterial
            color="#dac9a7"
            roughness={0.85}
            side={THREE.DoubleSide}
            transparent
            opacity={walking ? 0.4 : 0.85}
          />
        </mesh>
      ))}

      {/* Toit pyramide */}
      <mesh geometry={roofGeom} castShadow>
        <meshPhysicalMaterial
          color="#dac9a7"
          roughness={0.85}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.92}
          clearcoat={0.3}
        />
      </mesh>

      {/* Mât sommital */}
      <mesh position={[0, peakH + 0.15, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
        <meshStandardMaterial color="#a86a3a" metalness={0.85} roughness={0.3} />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[w * 0.2, 0, d * 0.15]} height={1.7} />
          <Inhabitant position={[-w * 0.15, 0, -d * 0.25]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 9) TIPI A-FRAME — triangle isocèle en bois & vitres
// =====================================================================
const TipiAFrameShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const w = size;
  const d = size * 1.4;
  const peakH = size * 0.95;

  // 2 panneaux de toit triangulaires-rectangles (gauche et droit)
  const roofGeom = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    // Côté gauche — rectangle sloped : [-w/2, 0, -d/2] [-w/2, 0, d/2] [0, peakH, d/2] [0, peakH, -d/2]
    positions.push(-w / 2, 0, -d / 2); // 0
    positions.push(-w / 2, 0, d / 2);  // 1
    positions.push(0, peakH, d / 2);   // 2
    positions.push(0, peakH, -d / 2);  // 3
    // Côté droit
    positions.push(w / 2, 0, -d / 2);  // 4
    positions.push(w / 2, 0, d / 2);   // 5
    positions.push(0, peakH, d / 2);   // 6 (= 2 mais doublé pour normales)
    positions.push(0, peakH, -d / 2);  // 7
    indices.push(0, 1, 2);
    indices.push(0, 2, 3);
    indices.push(4, 6, 5);
    indices.push(4, 7, 6);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [w, d, peakH]);

  // Pignon vitré (forme triangle)
  const gableShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, peakH);
    s.lineTo(-w / 2, 0);
    return s;
  }, [w, peakH]);
  const gableGeom = useMemo(() => new THREE.ShapeGeometry(gableShape), [gableShape]);

  return (
    <group>
      <ExteriorFloor radius={Math.max(w, d) * 0.85} />
      <InteriorRectFloor w={w - 0.3} d={d - 0.3} color="#3a2820" />
      <FootprintRectRing w={w - 0.5} d={d - 0.5} />

      {/* Toit (2 pans bois) */}
      <mesh geometry={roofGeom} castShadow>
        <meshPhysicalMaterial
          color="#7a5a3a"
          roughness={0.75}
          metalness={0.05}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.55 : 0.95}
          clearcoat={0.2}
        />
      </mesh>

      {/* Pignons vitrés (avant + arrière) */}
      <mesh geometry={gableGeom} position={[0, 0, d / 2 + 0.001]}>
        <meshPhysicalMaterial
          color="#dde6ec"
          roughness={0.05}
          transmission={0.85}
          thickness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.3 : 0.5}
        />
      </mesh>
      <mesh geometry={gableGeom} position={[0, 0, -d / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial
          color="#dde6ec"
          roughness={0.05}
          transmission={0.85}
          thickness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.3 : 0.5}
        />
      </mesh>

      {/* Faîtage bois */}
      <mesh position={[0, peakH, 0]}>
        <boxGeometry args={[0.06, 0.06, d]} />
        <meshStandardMaterial color="#5a4028" roughness={0.7} />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[w * 0.18, 0, d * 0.15]} height={1.7} />
          <Inhabitant position={[-w * 0.15, 0, -d * 0.2]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// 10) LODGE CONE — cône blanc & bois fermé (yourte-cône)
// =====================================================================
const LodgeConeShell = ({
  size,
  walking,
  showInhabitants,
}: {
  size: number;
  walking: boolean;
  showInhabitants: boolean;
}) => {
  const radius = size / 2;
  // Cône effilé : socle bas, cône TRÈS haut et pointu (ratio ~1.4 hauteur:diamètre)
  const baseH = 0.8;
  const coneH = size * 1.35;

  return (
    <group>
      <ExteriorFloor radius={radius * 1.6} />
      <InteriorCircleFloor radius={radius} color="#3a2820" />
      <FootprintRing radius={radius - 0.1} />

      {/* Socle bois (court cylindre bas) */}
      <mesh position={[0, baseH / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, baseH, 32, 1, true]} />
        <meshStandardMaterial
          color="#7a5a3a"
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cône blanc */}
      <mesh position={[0, baseH + coneH / 2, 0]} castShadow>
        <coneGeometry args={[radius, coneH, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#f5f1e8"
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.6 : 0.95}
          clearcoat={0.3}
        />
      </mesh>

      {/* Anneau base laiton */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[radius, 0.03, 8, 48]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Anneau jonction socle/toit */}
      <mesh position={[0, baseH, 0]}>
        <torusGeometry args={[radius, 0.025, 8, 48]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Couronne sommitale */}
      <mesh position={[0, baseH + coneH + 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
        <meshStandardMaterial color="#c89758" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Vitrage avant (porte sur le socle) */}
      <mesh position={[0, baseH * 0.55, radius - 0.001]}>
        <planeGeometry args={[radius * 0.7, baseH * 0.85]} />
        <meshPhysicalMaterial
          color="#dde6ec"
          roughness={0.05}
          transmission={0.85}
          thickness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={walking ? 0.3 : 0.5}
        />
      </mesh>

      {showInhabitants && !walking && (
        <>
          <Inhabitant position={[radius * 0.4, 0, radius * 0.15]} height={1.7} />
          <Inhabitant position={[-radius * 0.3, 0, -radius * 0.3]} height={1.65} />
        </>
      )}
    </group>
  );
};

// =====================================================================
// Dispatcher public — par archétype 3D
// =====================================================================
type Props = {
  archetype: ContainerArchetype;
  size: number;
  walking: boolean;
  showInhabitants: boolean;
};

const ContainerShell = ({ archetype, size, walking, showInhabitants }: Props) => {
  switch (archetype) {
    case "dome-geodesic":
      return <DomeShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "dome-bubble-arch":
      return <DomeBubbleArchShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "pavilion-arches":
      return <PavilionShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "pavilion-multipic":
      return <PavilionMultipicShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "pavilion-parasol":
      return <PavilionParasolShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "safari-lodge":
      return <SafariShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "safari-pyramid":
      return <SafariPyramidShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "tipi-cone":
      return <TipiShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "tipi-aframe":
      return <TipiAFrameShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "yurt-glass":
      return <YurtShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    case "lodge-cone":
      return <LodgeConeShell size={size} walking={walking} showInhabitants={showInhabitants} />;
    default:
      return <DomeShell size={size} walking={walking} showInhabitants={showInhabitants} />;
  }
};

export default ContainerShell;
