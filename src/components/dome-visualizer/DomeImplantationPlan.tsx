/**
 * DomeImplantationPlan — plan d'implantation interactif (vue de dessus).
 *
 * Surface SVG style "papier d'archi" sur laquelle l'utilisateur peut :
 *   - voir son dôme à l'échelle (cercle ouvert avec arêtes géodésiques internes)
 *   - placer des éléments contextuels (arbre, mur, entrée, mobilier extérieur)
 *   - les déplacer librement
 *   - cliquer-droit pour supprimer
 *
 * Le résultat est sauvegardable en localStorage et accompagne le pitch envoyé
 * à l'équipe — on sait où le client veut implanter, exposition, accès.
 */

import { useEffect, useRef, useState } from "react";
import { Trash2, TreePine, Square, DoorOpen, Armchair, Sun } from "lucide-react";

type ToolId = "tree" | "wall" | "door" | "lounge" | "sun";

type PlanItem = {
  id: string;
  tool: ToolId;
  x: number; // 0–100, % du viewBox
  y: number; // 0–100
};

type Props = {
  diameter: number; // mètres
};

const TOOLS: { id: ToolId; label: string; icon: React.ReactNode }[] = [
  { id: "tree", label: "Arbre", icon: <TreePine className="w-3.5 h-3.5" /> },
  { id: "wall", label: "Mur / haie", icon: <Square className="w-3.5 h-3.5" /> },
  { id: "door", label: "Entrée", icon: <DoorOpen className="w-3.5 h-3.5" /> },
  { id: "lounge", label: "Salon ext.", icon: <Armchair className="w-3.5 h-3.5" /> },
  { id: "sun", label: "Soleil", icon: <Sun className="w-3.5 h-3.5" /> },
];

const STORAGE_KEY = "greendome.implantation";

/** Représente le dôme + son contexte. La grille fait 14 m × 14 m. */
const FIELD_M = 14; // mètres représentés sur le plan

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const DomeImplantationPlan = ({ diameter }: Props) => {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ----- persistance localStorage -----
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* noop */ }
  }, [items]);

  // Calcule la position 0-100 d'un événement pointeur dans le viewBox du SVG.
  const eventToPercent = (ev: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 100;
    const y = ((ev.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
  };

  const handleSvgClick = (ev: React.PointerEvent<SVGSVGElement>) => {
    if (!activeTool) return;
    if (draggingId) return;
    // Si on a cliqué sur un item existant, son onPointerDown a déjà capturé
    const target = ev.target as Element;
    if (target.closest("[data-plan-item]")) return;

    const pos = eventToPercent(ev);
    if (!pos) return;
    setItems((prev) => [...prev, { id: newId(), tool: activeTool, x: pos.x, y: pos.y }]);
  };

  const startDrag = (id: string) => (ev: React.PointerEvent) => {
    ev.stopPropagation();
    setDraggingId(id);
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
  };
  const moveDrag = (ev: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingId) return;
    const pos = eventToPercent(ev);
    if (!pos) return;
    setItems((prev) =>
      prev.map((it) => (it.id === draggingId ? { ...it, x: pos.x, y: pos.y } : it)),
    );
  };
  const endDrag = () => setDraggingId(null);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearAll = () => setItems([]);

  // ----- géométrie du dôme dans le viewBox 0..100 -----
  const domePctRadius = (diameter / FIELD_M) * 50; // rayon en %
  const cx = 50;
  const cy = 50;

  return (
    <div className="grid md:grid-cols-[200px,1fr] gap-4 h-full">
      {/* ======================================================
          Palette d'outils
          ====================================================== */}
      <div className="space-y-2 surface-glass rounded-sm p-3 self-start">
        <div className="text-[10px] tracking-[0.22em] uppercase text-primary font-semibold mb-2 px-1">
          Annoter le plan
        </div>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(activeTool === t.id ? null : t.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-[12px] font-display transition-all ${
              activeTool === t.id
                ? "bg-primary text-primary-foreground"
                : "border border-border/40 text-foreground/75 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
        <div className="pt-2 mt-2 border-t border-border/40">
          <button
            onClick={clearAll}
            disabled={!items.length}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-[10px] tracking-[0.22em] uppercase font-semibold text-foreground/55 hover:text-primary disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Tout effacer
          </button>
        </div>

        <p className="text-[10px] text-foreground/55 leading-relaxed pt-2 mt-2 border-t border-border/40 px-1">
          Sélectionnez un outil puis cliquez sur le plan. Glissez pour déplacer.
          Clic droit pour supprimer.
        </p>
      </div>

      {/* ======================================================
          Plan SVG
          ====================================================== */}
      <div className="relative surface-glass rounded-sm overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full block ${activeTool ? "cursor-crosshair" : "cursor-default"}`}
          onPointerDown={handleSvgClick}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {/* --- Trame de fond papier d'architecte --- */}
          <defs>
            <pattern id="grid" width="3.57" height="3.57" patternUnits="userSpaceOnUse">
              <path d="M 3.57 0 L 0 0 0 3.57" fill="none" stroke="#3a3328" strokeWidth="0.08" />
            </pattern>
            <pattern id="grid-major" width="14.28" height="14.28" patternUnits="userSpaceOnUse">
              <path d="M 14.28 0 L 0 0 0 14.28" fill="none" stroke="#5a4f3d" strokeWidth="0.15" />
            </pattern>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5d29a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f5d29a" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100" height="100" fill="#191613" />
          <rect width="100" height="100" fill="url(#grid)" />
          <rect width="100" height="100" fill="url(#grid-major)" />

          {/* --- Trajectoire du soleil (E → S → O) --- */}
          <path
            d={`M 5 50 Q 50 ${50 - domePctRadius * 1.5} 95 50`}
            fill="none"
            stroke="url(#sun-glow)"
            strokeWidth="0.5"
            strokeDasharray="0.8 0.8"
            opacity="0.7"
          />

          {/* --- Halo lumineux côté sud --- */}
          <ellipse cx={cx} cy={cy + domePctRadius * 0.3} rx={domePctRadius * 1.4} ry={domePctRadius * 0.6} fill="url(#sun-glow)" opacity="0.25" />

          {/* --- Cercle dôme : ombre extérieure --- */}
          <circle
            cx={cx}
            cy={cy}
            r={domePctRadius}
            fill="rgba(212, 168, 97, 0.06)"
            stroke="#d4a861"
            strokeWidth="0.45"
          />
          {/* Cercle dôme : pointillé fin (épaisseur de coque) */}
          <circle
            cx={cx}
            cy={cy}
            r={domePctRadius - 0.6}
            fill="none"
            stroke="#d4a861"
            strokeWidth="0.18"
            strokeDasharray="0.7 0.7"
            opacity="0.7"
          />

          {/* --- Triangulation géodésique (vue du dessus) --- */}
          <g stroke="#d4a861" strokeWidth="0.12" opacity="0.55" fill="none">
            {Array.from({ length: 6 }).map((_, i) => {
              const a1 = (i / 6) * Math.PI * 2;
              const x1 = cx + Math.cos(a1) * domePctRadius;
              const y1 = cy + Math.sin(a1) * domePctRadius;
              return <line key={`r-${i}`} x1={cx} y1={cy} x2={x1} y2={y1} />;
            })}
            <circle cx={cx} cy={cy} r={domePctRadius * 0.55} />
            <circle cx={cx} cy={cy} r={domePctRadius * 0.28} />
          </g>

          {/* --- Cote diamètre --- */}
          <g stroke="#d4a861" strokeWidth="0.18" fill="none">
            <line x1={cx - domePctRadius} y1={cy + domePctRadius + 4} x2={cx + domePctRadius} y2={cy + domePctRadius + 4} />
            <line x1={cx - domePctRadius} y1={cy + domePctRadius + 3} x2={cx - domePctRadius} y2={cy + domePctRadius + 5} />
            <line x1={cx + domePctRadius} y1={cy + domePctRadius + 3} x2={cx + domePctRadius} y2={cy + domePctRadius + 5} />
          </g>
          <text
            x={cx}
            y={cy + domePctRadius + 6.5}
            textAnchor="middle"
            fontSize="2.3"
            fontFamily="serif"
            fill="#d4a861"
            letterSpacing="0.2"
          >
            Ø {diameter.toFixed(1)} m
          </text>

          {/* --- Points cardinaux --- */}
          <g fontFamily="serif" fontSize="2.4" fill="#a89878" letterSpacing="0.2" textAnchor="middle">
            <text x={50} y={4}>N</text>
            <text x={50} y={98}>S</text>
            <text x={97} y={51}>E</text>
            <text x={3} y={51}>O</text>
          </g>

          {/* --- Items utilisateur --- */}
          {items.map((it) => (
            <PlanMarker
              key={it.id}
              item={it}
              onPointerDown={startDrag(it.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                removeItem(it.id);
              }}
            />
          ))}
        </svg>

        {/* Légende capacité */}
        <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-sm bg-background/85 backdrop-blur border border-primary/30">
          <div className="text-[9px] tracking-[0.22em] uppercase text-primary font-semibold">
            Plan d'implantation
          </div>
          <div className="text-[10px] text-foreground/65 mt-0.5">
            Grille 1 m × 1 m · {FIELD_M} × {FIELD_M} m total
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Pictogramme par outil
// ----------------------------------------------------------------------
const PlanMarker = ({
  item,
  onPointerDown,
  onContextMenu,
}: {
  item: PlanItem;
  onPointerDown: (e: React.PointerEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) => {
  const common = {
    "data-plan-item": true,
    onPointerDown,
    onContextMenu,
    style: { cursor: "grab" },
  } as const;
  const x = item.x;
  const y = item.y;

  switch (item.tool) {
    case "tree":
      return (
        <g {...common} transform={`translate(${x}, ${y})`}>
          <circle r="2.5" fill="#3f6b3f" stroke="#5a8c5a" strokeWidth="0.18" />
          <circle r="1.4" fill="#5a8c5a" opacity="0.6" />
          <line x1="0" y1="2.2" x2="0" y2="3.8" stroke="#7a5a3a" strokeWidth="0.4" />
        </g>
      );
    case "wall":
      return (
        <g {...common} transform={`translate(${x}, ${y})`}>
          <rect x="-3" y="-0.5" width="6" height="1" fill="#3a3328" stroke="#a89878" strokeWidth="0.2" />
        </g>
      );
    case "door":
      return (
        <g {...common} transform={`translate(${x}, ${y})`}>
          <rect x="-1.4" y="-2.2" width="2.8" height="4.4" fill="none" stroke="#d4a861" strokeWidth="0.3" />
          <line x1="-1.4" y1="-2.2" x2="1.4" y2="2.2" stroke="#d4a861" strokeWidth="0.18" strokeDasharray="0.4 0.4" />
        </g>
      );
    case "lounge":
      return (
        <g {...common} transform={`translate(${x}, ${y})`}>
          <rect x="-2.2" y="-1.4" width="4.4" height="2.8" rx="0.4" fill="#5a4f3d" stroke="#a89878" strokeWidth="0.18" />
          <rect x="-2.2" y="-1.6" width="4.4" height="0.4" fill="#a89878" />
        </g>
      );
    case "sun":
      return (
        <g {...common} transform={`translate(${x}, ${y})`}>
          <circle r="1.6" fill="#f5d29a" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = Math.cos(a) * 2;
            const y1 = Math.sin(a) * 2;
            const x2 = Math.cos(a) * 2.8;
            const y2 = Math.sin(a) * 2.8;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f5d29a" strokeWidth="0.3" />;
          })}
        </g>
      );
  }
};

export default DomeImplantationPlan;
