/**
 * DomeViewer3D — scène Three.js interactive du dôme Greendome.
 *
 * Modes :
 *   - "orbit" : on tourne autour, on zoome, on place du mobilier
 *   - "walk"  : on rentre à hauteur d'œil, souris pour regarder, WASD pour
 *               se déplacer (desktop). Sur tactile : panorama orbital limité.
 *
 * Drag du mobilier — précision améliorée :
 *   1) au pointerdown sur une pièce, on capture le world-point cliqué (ThreeEvent.point)
 *   2) on calcule l'offset (objet.center - clickPoint) → ref de la scène
 *   3) chaque pointermove : raycast vers le plan du sol, ré-applique l'offset →
 *      la pièce ne saute plus au début du drag, le déplacement suit pile le curseur
 *   4) pendant le drag, OrbitControls.enabled = false (sinon le rotate caméra interfère)
 *   5) setPointerCapture sur le canvas pour ne pas perdre l'event en sortant
 */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  PointerLockControls,
} from "@react-three/drei";
import * as THREE from "three";
import Furniture3D from "./Furniture3D";
import ContainerShell from "./ContainerShells";
import type { PlacedFurniture } from "@/lib/furniture-catalog";
import type { ContainerKind, Footprint } from "@/lib/container-catalog";
import { findContainer, clampToFootprint } from "@/lib/container-catalog";

// ---------------------------------------------------------------
// DragManager — raycast pointer → sol pour bouger un meuble (avec offset précis)
// La contrainte de zone est appliquée via le footprint du contenant courant.
// ---------------------------------------------------------------
type DragManagerProps = {
  grabbedId: string | null;
  /** Offset (centre objet - clickPoint) au sol [x, z] — réappliqué à chaque move. */
  offsetRef: React.MutableRefObject<[number, number]>;
  footprint: Footprint;
  onMove: (id: string, pos: [number, number]) => void;
  onRelease: () => void;
};

const DragManager = ({ grabbedId, offsetRef, footprint, onMove, onRelease }: DragManagerProps) => {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const floor = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  useEffect(() => {
    if (!grabbedId) return;
    const dom = gl.domElement;
    let captureId: number | null = null;

    const handleMove = (e: PointerEvent) => {
      // Pointer capture pour ne pas perdre les events qui sortent du canvas
      if (captureId === null) {
        captureId = e.pointerId;
        try { dom.setPointerCapture(e.pointerId); } catch { /* noop */ }
      }
      const r = dom.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
      raycaster.current.setFromCamera(ndc, camera);
      const hit = new THREE.Vector3();
      const intersected = raycaster.current.ray.intersectPlane(floor.current, hit);
      if (!intersected) return;
      // Application de l'offset (la pièce ne saute pas au début du drag)
      const rawX = hit.x + offsetRef.current[0];
      const rawZ = hit.z + offsetRef.current[1];
      // Contrainte selon le footprint du contenant
      const [x, z] = clampToFootprint([rawX, rawZ], footprint);
      onMove(grabbedId, [x, z]);
    };

    const handleUp = () => {
      if (captureId !== null) {
        try { dom.releasePointerCapture(captureId); } catch { /* noop */ }
        captureId = null;
      }
      onRelease();
    };

    dom.addEventListener("pointermove", handleMove);
    dom.addEventListener("pointerup", handleUp);
    dom.addEventListener("pointercancel", handleUp);
    return () => {
      if (captureId !== null) {
        try { dom.releasePointerCapture(captureId); } catch { /* noop */ }
      }
      dom.removeEventListener("pointermove", handleMove);
      dom.removeEventListener("pointerup", handleUp);
      dom.removeEventListener("pointercancel", handleUp);
    };
  }, [grabbedId, camera, gl, onMove, onRelease, footprint, offsetRef]);

  return null;
};

// ---------------------------------------------------------------
// WalkControls — visite intérieure (desktop : PointerLock + WASD)
// La contrainte de marche est appliquée via le footprint du contenant.
// ---------------------------------------------------------------
type WalkProps = {
  footprint: Footprint;
  enabled: boolean;
};

const isTouchDevice = () => typeof window !== "undefined" && "ontouchstart" in window;

const WalkControls = ({ footprint, enabled }: WalkProps) => {
  const { camera } = useThree();
  const keys = useRef({ forward: false, back: false, left: false, right: false });
  const touch = useMemo(() => isTouchDevice(), []);

  useEffect(() => {
    if (!enabled) return;
    camera.position.set(0, 1.65, 0.1);
    camera.lookAt(0, 1.55, -2);

    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || e.key === "ArrowUp") keys.current.forward = true;
      if (k === "s" || e.key === "ArrowDown") keys.current.back = true;
      if (k === "a" || e.key === "ArrowLeft") keys.current.left = true;
      if (k === "d" || e.key === "ArrowRight") keys.current.right = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || e.key === "ArrowUp") keys.current.forward = false;
      if (k === "s" || e.key === "ArrowDown") keys.current.back = false;
      if (k === "a" || e.key === "ArrowLeft") keys.current.left = false;
      if (k === "d" || e.key === "ArrowRight") keys.current.right = false;
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
      // Au cas où on quitte la visite avec le pointer-lock encore actif
      try {
        if (typeof document !== "undefined" && document.pointerLockElement) {
          document.exitPointerLock();
        }
      } catch { /* noop */ }
    };
  }, [enabled, camera]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const speed = 1.7;
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    if (fwd.lengthSq() === 0) return;
    fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const move = new THREE.Vector3();
    if (keys.current.forward) move.add(fwd);
    if (keys.current.back) move.sub(fwd);
    if (keys.current.right) move.add(right);
    if (keys.current.left) move.sub(right);
    if (move.lengthSq() === 0) return;
    move.normalize().multiplyScalar(speed * delta);
    const next = camera.position.clone().add(move);
    // Contrainte selon le footprint du contenant — on rétrécit un peu pour rester dedans
    if (footprint.shape === "circle") {
      const r = Math.sqrt(next.x * next.x + next.z * next.z);
      const maxR = footprint.radius - 0.15;
      if (r > maxR) {
        const a = Math.atan2(next.z, next.x);
        next.x = Math.cos(a) * maxR;
        next.z = Math.sin(a) * maxR;
      }
    } else {
      const halfW = footprint.w / 2 - 0.15;
      const halfD = footprint.d / 2 - 0.15;
      next.x = Math.max(-halfW, Math.min(halfW, next.x));
      next.z = Math.max(-halfD, Math.min(halfD, next.z));
    }
    next.y = 1.65;
    camera.position.copy(next);
  });

  if (!enabled) return null;
  if (touch) {
    return (
      <OrbitControls
        target={[0, 1.65, -1]}
        enablePan={false}
        enableZoom={false}
        minDistance={1}
        maxDistance={1.01}
      />
    );
  }
  return <PointerLockControls />;
};

// ---------------------------------------------------------------
// Scene (à l'intérieur du Canvas)
// ---------------------------------------------------------------
type SceneProps = {
  containerKind: ContainerKind;
  size: number;
  furniture: PlacedFurniture[];
  selectedId: string | null;
  walking: boolean;
  onSelect: (id: string | null) => void;
  onMove: (id: string, pos: [number, number]) => void;
  onGrabChange?: (id: string | null) => void;
};

/** Échelle approximative pour les lumières / shadows / fog selon la coque */
const sceneScale = (size: number, footprint: Footprint): number => {
  if (footprint.shape === "circle") return Math.max(size, footprint.radius * 2);
  return Math.max(size, footprint.w, footprint.d);
};

/** Position caméra extérieure recommandée selon la coque */
const exteriorCameraPos = (size: number, footprint: Footprint): [number, number, number] => {
  const s = sceneScale(size, footprint);
  return [s * 1.2, s * 0.6, s * 1.4];
};

const Scene = ({
  containerKind,
  size,
  furniture,
  selectedId,
  walking,
  onSelect,
  onMove,
  onGrabChange,
}: SceneProps) => {
  const spec = useMemo(() => findContainer(containerKind), [containerKind]);
  const footprint: Footprint = useMemo(
    () => spec?.computeFootprint(size) ?? { shape: "circle", radius: size / 2 - 0.3 },
    [spec, size],
  );
  const sceneSize = sceneScale(size, footprint);
  const { camera } = useThree();
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  // Offset = (centre objet) - (clickPoint) au sol — réappliqué à chaque move
  const offsetRef = useRef<[number, number]>([0, 0]);

  // ---- Transition walk → orbit : reset propre de la caméra et exit pointer lock ----
  // Aussi : changement de container → reset caméra pour ne pas garder la position de l'ancienne coque.
  const prevWalking = useRef(walking);
  const prevKind = useRef(containerKind);
  useEffect(() => {
    const exitedWalk = prevWalking.current === true && walking === false;
    const containerChanged = prevKind.current !== containerKind;
    if (exitedWalk || containerChanged) {
      try {
        if (typeof document !== "undefined" && document.pointerLockElement) {
          document.exitPointerLock();
        }
      } catch { /* noop */ }
      const [cx, cy, cz] = exteriorCameraPos(size, footprint);
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0.5, 0);
      camera.updateProjectionMatrix();
    }
    prevWalking.current = walking;
    prevKind.current = containerKind;
  }, [walking, containerKind, camera, size, footprint]);

  const handleGrab = (id: string, hitPoint: THREE.Vector3) => {
    const item = furniture.find((f) => f.id === id);
    if (!item) return;
    offsetRef.current = [item.pos[0] - hitPoint.x, item.pos[1] - hitPoint.z];
    setGrabbedId(id);
    onGrabChange?.(id);
  };

  const handleRelease = () => {
    offsetRef.current = [0, 0];
    setGrabbedId(null);
    onGrabChange?.(null);
  };

  // Sol invisible pour désélection : sa forme suit le footprint
  const deselectSolGeom =
    footprint.shape === "circle" ? (
      <circleGeometry args={[footprint.radius + 0.4, 48]} />
    ) : (
      <planeGeometry args={[footprint.w + 0.6, footprint.d + 0.6]} />
    );

  return (
    <>
      <color attach="background" args={["#0d0c0a"]} />
      <fog attach="fog" args={["#0d0c0a", sceneSize * 4, sceneSize * 12]} />

      <ambientLight intensity={walking ? 0.55 : 0.45} />
      <directionalLight
        position={[sceneSize * 1.5, sceneSize * 1.8, sceneSize * 1.2]}
        intensity={1.6}
        color="#f5d29a"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={sceneSize * 8}
        shadow-camera-left={-sceneSize * 2}
        shadow-camera-right={sceneSize * 2}
        shadow-camera-top={sceneSize * 2}
        shadow-camera-bottom={-sceneSize * 2}
      />
      <directionalLight
        position={[-sceneSize * 1.5, sceneSize * 1.2, -sceneSize * 0.8]}
        intensity={0.6}
        color="#7da0c4"
      />

      <Suspense fallback={null}>
        <ContainerShell
          archetype={spec?.archetype ?? "dome-geodesic"}
          size={size}
          walking={walking}
          showInhabitants={!furniture.length}
        />
        <Environment preset="sunset" />
      </Suspense>

      {/* Sol invisible pour désélection au clic — épouse le footprint */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.0005, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect(null);
        }}
      >
        {deselectSolGeom}
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {furniture.map((p) => (
        <Furniture3D
          key={p.id}
          placed={p}
          selected={selectedId === p.id}
          onSelect={onSelect}
          onPointerDown={handleGrab}
        />
      ))}

      {!walking && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.55}
          scale={sceneSize * 4}
          blur={2.2}
          far={4}
          color="#000000"
        />
      )}

      <DragManager
        grabbedId={grabbedId}
        offsetRef={offsetRef}
        footprint={footprint}
        onMove={onMove}
        onRelease={handleRelease}
      />

      {/* Caméras / contrôles — désactivés pendant un drag */}
      {!walking && (
        <OrbitControls
          /* La key force le remount à chaque changement de container ou sortie de visite */
          key={`orbit-${containerKind}-${walking ? "walk" : "out"}`}
          enablePan={false}
          enabled={!grabbedId}
          minDistance={sceneSize * 0.6}
          maxDistance={sceneSize * 4}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 0.5, 0]}
          enableDamping
          dampingFactor={0.06}
          autoRotate={!grabbedId && !selectedId}
          autoRotateSpeed={0.3}
        />
      )}
      <WalkControls footprint={footprint} enabled={walking} />
    </>
  );
};

// ---------------------------------------------------------------
// Wrapper public
// ---------------------------------------------------------------
type Props = {
  /** Type de structure (dôme, pavillon, lodge safari, tipi, yourte) */
  containerKind: ContainerKind;
  /** Valeur du slider taille — interprétée par le container (m) */
  size: number;
  furniture?: PlacedFurniture[];
  selectedId?: string | null;
  walking?: boolean;
  onSelect?: (id: string | null) => void;
  onMove?: (id: string, pos: [number, number]) => void;
  /** Notifie le parent quand un drag commence/se termine (pour HUD, etc.) */
  onGrabChange?: (id: string | null) => void;
};

const DomeViewer3D = ({
  containerKind,
  size,
  furniture = [],
  selectedId = null,
  walking = false,
  onSelect = () => {},
  onMove = () => {},
  onGrabChange,
}: Props) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [size * 1.4, size * 0.7, size * 1.6], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          containerKind={containerKind}
          size={size}
          furniture={furniture}
          selectedId={selectedId}
          walking={walking}
          onSelect={onSelect}
          onMove={onMove}
          onGrabChange={onGrabChange}
        />
      </Canvas>
    </div>
  );
};

export default DomeViewer3D;
