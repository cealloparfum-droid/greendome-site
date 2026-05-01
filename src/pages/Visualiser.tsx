/**
 * /visualiser — la salle de visualisation Greendome.
 *
 * Modes principaux (toggle haut) :
 *   - "3d"   : on tourne autour du dôme, on l'aménage avec la collection signature
 *   - "plan" : schéma de plan d'implantation 2D, annotable
 *
 * En mode 3D, deux sous-modes :
 *   - "orbit" (défaut) : on regarde de l'extérieur, on place du mobilier
 *   - "walk"           : visite à hauteur d'œil — souris pour regarder, WASD pour
 *                        marcher (desktop). Sur tactile : panorama orbital.
 *
 * Palette « Aménager » : produits classés par famille (Canapés, Fauteuils,
 * Lits, Jacuzzis, Décor) avec vignette photo réelle. Au clic, la pièce est
 * ajoutée au centre — on la traîne ensuite à la souris.
 *
 * État conservé en localStorage : configuration mobilier, diamètre, etc.
 */

import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Map as MapIcon,
  Send,
  Calendar,
  Users,
  Maximize2,
  Footprints,
  Eye,
  Trash2,
  RotateCw,
  X,
  Sofa,
  Plus,
  Layers,
  Sparkles,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import DomeImplantationPlan from "@/components/dome-visualizer/DomeImplantationPlan";
import SendConfigDialog from "@/components/dome-visualizer/SendConfigDialog";
import {
  FURNITURE_CATALOG,
  FURNITURE_FAMILIES,
  findSpec,
  newPlacedId,
  type FurnitureFamily,
  type PlacedFurniture,
} from "@/lib/furniture-catalog";
import {
  CONTAINER_CATALOG,
  CONTAINER_FAMILIES,
  DEFAULT_CONTAINER_KIND,
  findContainer,
  clampToFootprint,
  isContainerKind,
  type ContainerKind,
  type ContainerFamily,
} from "@/lib/container-catalog";
import { INSPIRATIONS, materializeInspiration } from "@/lib/inspirations";
import { useToast } from "@/hooks/use-toast";

const DomeViewer3D = lazy(() => import("@/components/dome-visualizer/DomeViewer3D"));

type View = "3d" | "plan";

const computeCapacity = (size: number) => Math.max(2, Math.round((size * size) * 0.5));

const FURNITURE_KEY = "greendome.dome-furniture";
const DIAMETER_KEY = "greendome.dome-diameter";
const CONTAINER_KEY = "greendome.dome-container";

const Visualiser = () => {
  usePageMeta({
    title: "Visualiser votre dôme",
    description: "Configurez votre dôme en 3D : choisissez le modèle, ajoutez mobilier et jacuzzi, partagez votre projet en un clic.",
    path: "/visualiser",
  });
  const [view, setView] = useState<View>("3d");
  const [containerKind, setContainerKind] = useState<ContainerKind>(DEFAULT_CONTAINER_KIND);
  const [size, setSize] = useState(5);
  const [furniture, setFurniture] = useState<PlacedFurniture[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [grabbedId, setGrabbedId] = useState<string | null>(null);
  const [walking, setWalking] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeFamily, setActiveFamily] = useState<FurnitureFamily>(FURNITURE_FAMILIES[0]);
  const [activeContainerFamily, setActiveContainerFamily] = useState<ContainerFamily>("Dômes");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sendConfigOpen, setSendConfigOpen] = useState(false);

  const { toast } = useToast();

  const containerSpec = useMemo(() => findContainer(containerKind)!, [containerKind]);
  const sizeRange = containerSpec.sizeRange;
  const capacity = useMemo(() => computeCapacity(size), [size]);
  // Le label "Diamètre" / "Largeur" dépend de la forme du footprint
  const sizeLabel = containerSpec.computeFootprint(size).shape === "circle"
    ? "Diamètre"
    : "Largeur";

  // ---- Persistance (hydratation défensive : on filtre les refs inconnues) ----
  useEffect(() => {
    try {
      // Container avant tout (il fixe la plage de taille valide)
      const c = window.localStorage.getItem(CONTAINER_KEY);
      let initialKind: ContainerKind = DEFAULT_CONTAINER_KIND;
      if (c && isContainerKind(c)) {
        initialKind = c;
        setContainerKind(c);
      }
      const initialSpec = findContainer(initialKind);
      const range = initialSpec?.sizeRange ?? { min: 3.5, max: 7, step: 0.5, default: 5 };
      // Aligner l'onglet famille sur le container actif
      if (initialSpec) setActiveContainerFamily(initialSpec.family);

      const d = window.localStorage.getItem(DIAMETER_KEY);
      if (d) {
        const num = parseFloat(d);
        if (Number.isFinite(num) && num >= range.min && num <= range.max) setSize(num);
        else setSize(range.default);
      } else {
        setSize(range.default);
      }

      const f = window.localStorage.getItem(FURNITURE_KEY);
      if (f) {
        const parsed = JSON.parse(f);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (p: unknown): p is PlacedFurniture =>
              !!p &&
              typeof p === "object" &&
              "id" in p && typeof (p as PlacedFurniture).id === "string" &&
              "ref" in p && typeof (p as PlacedFurniture).ref === "string" &&
              "pos" in p && Array.isArray((p as PlacedFurniture).pos) &&
              (p as PlacedFurniture).pos.length === 2 &&
              !!findSpec((p as PlacedFurniture).ref)
          );
          setFurniture(valid);
        }
      }
    } catch {
      try { window.localStorage.removeItem(FURNITURE_KEY); } catch { /* noop */ }
    }
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem(FURNITURE_KEY, JSON.stringify(furniture)); } catch { /* noop */ }
  }, [furniture]);
  useEffect(() => {
    try { window.localStorage.setItem(DIAMETER_KEY, String(size)); } catch { /* noop */ }
  }, [size]);
  useEffect(() => {
    try { window.localStorage.setItem(CONTAINER_KEY, containerKind); } catch { /* noop */ }
  }, [containerKind]);

  // ---- Quand on change de container, on s'assure que la taille reste dans la plage
  // ET on reclamp les positions du mobilier dans le nouveau footprint.
  const changeContainer = (kind: ContainerKind) => {
    if (kind === containerKind) return;
    const spec = findContainer(kind);
    if (!spec) return;
    setContainerKind(kind);
    setActiveContainerFamily(spec.family);
    const r = spec.sizeRange;
    const nextSize = Math.max(r.min, Math.min(r.max, size));
    setSize(nextSize);
    const fp = spec.computeFootprint(nextSize);
    setFurniture((prev) =>
      prev.map((f) => ({ ...f, pos: clampToFootprint(f.pos, fp) })),
    );
  };

  // ---- Charger une inspiration ----
  const applyInspiration = (inspId: string) => {
    const insp = INSPIRATIONS.find((i) => i.id === inspId);
    if (!insp) return;
    setContainerKind(insp.container);
    const targetSpec = findContainer(insp.container);
    if (targetSpec) setActiveContainerFamily(targetSpec.family);
    setSize(insp.size);
    setFurniture(materializeInspiration(insp));
    setSelectedId(null);
    setWalking(false);
    toast({
      title: `Inspiration : ${insp.title}`,
      description: insp.pitch,
    });
  };

  // ---- Mobilier : actions ----
  const addFurniture = (ref: string) => {
    const spec = findSpec(ref);
    if (!spec) return;
    const id = newPlacedId();
    // Position de spawn : un léger offset depuis le centre pour ne pas empiler
    const angle = (furniture.length * Math.PI * 2) / 7;
    const r = furniture.length === 0 ? 0 : Math.min(size * 0.25, 1);
    const fp = containerSpec.computeFootprint(size);
    const rawPos: [number, number] = [Math.cos(angle) * r, Math.sin(angle) * r];
    const newItem: PlacedFurniture = {
      id,
      ref,
      pos: clampToFootprint(rawPos, fp),
      rotY: 0,
    };
    setFurniture((prev) => [...prev, newItem]);
    setSelectedId(id);
  };

  const moveFurniture = (id: string, pos: [number, number]) => {
    setFurniture((prev) => prev.map((f) => (f.id === id ? { ...f, pos } : f)));
  };

  const rotateFurniture = (id: string) => {
    setFurniture((prev) =>
      prev.map((f) => (f.id === id ? { ...f, rotY: f.rotY + Math.PI / 8 } : f)),
    );
  };

  // Rotation fine : valeur absolue en radians (slider)
  const setFurnitureRotation = (id: string, rotY: number) => {
    setFurniture((prev) =>
      prev.map((f) => (f.id === id ? { ...f, rotY } : f)),
    );
  };

  const removeFurniture = (id: string) => {
    setFurniture((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const clearFurniture = () => {
    setFurniture([]);
    setSelectedId(null);
  };

  // ---- Curseur natif sur /visualiser (précision pour le drag 3D) ----
  useEffect(() => {
    document.documentElement.classList.add("cursor-native");
    return () => {
      document.documentElement.classList.remove("cursor-native");
    };
  }, []);

  // ---- Touche DEL pour supprimer le sélectionné ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !walking) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        removeFurniture(selectedId);
      }
      if (e.key === "Escape") {
        if (walking) setWalking(false);
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, walking]);

  // ---- Filtrage par famille ----
  const filteredCatalog = FURNITURE_CATALOG.filter((s) => s.family === activeFamily);

  // Compteur par famille (badge sur les onglets)
  const familyCounts = useMemo(() => {
    const map = new Map<FurnitureFamily, number>();
    FURNITURE_FAMILIES.forEach((f) => map.set(f, 0));
    furniture.forEach((p) => {
      const spec = findSpec(p.ref);
      if (!spec) return;
      map.set(spec.family, (map.get(spec.family) ?? 0) + 1);
    });
    return map;
  }, [furniture]);

  const selectedSpec = selectedId
    ? findSpec(furniture.find((f) => f.id === selectedId)?.ref ?? "")
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-8">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="divider-gold mb-6" />
            <p className="text-xs md:text-sm text-primary tracking-[0.4em] uppercase font-semibold mb-3">
              Salle de visualisation
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
              Imaginez votre dôme,{" "}
              <span className="text-gradient-gold italic">aménagez-le, visitez-le</span>
            </h1>
            <p className="text-foreground/85 text-base md:text-lg font-normal max-w-2xl mx-auto">
              Faites varier le diamètre, déposez canapés, jacuzzis et pièces signature
              à l'intérieur, puis basculez en visite à hauteur d'œil. Le tout en un clic —
              et nous le recevons fidèlement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toolbar principale */}
      <section className="pb-5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between surface-glass rounded-sm p-4 md:p-5">
            <div className="inline-flex rounded-sm border border-border/40 p-1 bg-background/40">
              {(["3d", "plan"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    if (v === "plan") setWalking(false);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-[11px] tracking-[0.22em] uppercase font-semibold transition-all ${
                    view === v ? "bg-primary text-primary-foreground" : "text-foreground/65 hover:text-primary"
                  }`}
                >
                  {v === "3d" ? <Box className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
                  {v === "3d" ? "Vue 3D" : "Plan d'implantation"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-xl md:px-6">
              <span className="text-[10px] tracking-[0.22em] uppercase text-foreground/55 font-semibold whitespace-nowrap">
                {sizeLabel}
              </span>
              <input
                type="range"
                min={sizeRange.min}
                max={sizeRange.max}
                step={sizeRange.step}
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-display text-primary font-semibold whitespace-nowrap min-w-[60px] text-right">
                {size.toFixed(1)} m
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-primary/10 border border-primary/30 whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] tracking-[0.22em] uppercase text-primary font-semibold">
                ≈ {capacity} pers.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Viewport + palette */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[auto,1fr,auto] gap-4">
            {/* ============== Panneau gauche : Modèles + Inspirations ============== */}
            {view === "3d" && !walking && (
              <motion.aside
                initial={false}
                animate={{ width: leftPanelOpen ? 300 : 56 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="surface-glass rounded-sm overflow-hidden flex flex-col h-[65vh] min-h-[520px] order-2 lg:order-1"
              >
                {/* En-tête */}
                <button
                  onClick={() => setLeftPanelOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-3 border-b border-border/40 text-primary hover:bg-primary/5 transition-colors shrink-0"
                  title={leftPanelOpen ? "Réduire" : "Modèles & inspirations"}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  {leftPanelOpen && (
                    <span className="text-[10px] tracking-[0.22em] uppercase font-semibold whitespace-nowrap">
                      Modèles & inspirations
                    </span>
                  )}
                </button>

                {leftPanelOpen && (
                  <div className="flex-1 overflow-y-auto">
                    {/* ---- Onglets famille ---- */}
                    <div className="px-2 pt-2 pb-2 border-b border-border/40 sticky top-0 bg-background/85 backdrop-blur z-10">
                      <div className="flex flex-wrap gap-1">
                        {CONTAINER_FAMILIES.map((fam) => {
                          const active = fam === activeContainerFamily;
                          const count = CONTAINER_CATALOG.filter((c) => c.family === fam).length;
                          return (
                            <button
                              key={fam}
                              onClick={() => setActiveContainerFamily(fam)}
                              className={`relative text-[9px] tracking-[0.12em] uppercase font-semibold py-1.5 px-2 rounded-sm transition-all ${
                                active
                                  ? "bg-primary/90 text-primary-foreground"
                                  : "text-foreground/65 hover:text-primary"
                              }`}
                              title={`${count} modèle${count > 1 ? "s" : ""}`}
                            >
                              {fam.replace(" & Glamping", "").replace(" & Événementiel", "")}
                              <span className={`ml-1 text-[8px] ${active ? "text-primary-foreground/80" : "text-foreground/40"}`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ---- Section Modèles : grille de cartes pour la famille active ---- */}
                    <div className="px-3 pt-3 pb-2">
                      <div className="flex items-center gap-2 px-1 mb-2.5">
                        <span className="text-[9px] tracking-[0.22em] uppercase text-foreground/55 font-semibold">
                          {activeContainerFamily}
                        </span>
                        <span className="flex-1 h-px bg-border/40" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {CONTAINER_CATALOG.filter((c) => c.family === activeContainerFamily).map((c) => {
                          const active = c.kind === containerKind;
                          return (
                            <button
                              key={c.kind}
                              onClick={() => changeContainer(c.kind)}
                              className={`group flex flex-col rounded-sm border overflow-hidden text-left transition-all relative ${
                                active
                                  ? "border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.45)]"
                                  : "border-border/40 hover:border-primary/60 hover:bg-primary/5"
                              }`}
                              title={c.label}
                            >
                              <span className="block relative aspect-[4/3] overflow-hidden bg-card/40">
                                {c.thumbnail ? (
                                  <img
                                    src={c.thumbnail}
                                    alt=""
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                ) : null}
                                {active && (
                                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                  </span>
                                )}
                                <span className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                                <span className="absolute bottom-1 left-1.5 right-1.5 text-[8.5px] tracking-[0.15em] uppercase text-primary/85 font-semibold drop-shadow-md line-clamp-1">
                                  {c.context}
                                </span>
                              </span>
                              <span className="block px-2 py-1.5">
                                <span className={`block text-[10px] font-display leading-snug line-clamp-2 ${active ? "text-primary" : "text-foreground/90"}`}>
                                  {c.label}
                                </span>
                                <span className="block text-[8.5px] text-foreground/55 mt-1">
                                  ≈ {c.surfaceM2} m² · {c.capacity} pers.
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ---- Section Inspirations ---- */}
                    <div className="px-3 pt-3 pb-3 border-t border-border/40 mt-2">
                      <div className="flex items-center gap-2 px-1 mb-2.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[9px] tracking-[0.22em] uppercase text-foreground/55 font-semibold">
                          Inspirations meublées
                        </span>
                        <span className="flex-1 h-px bg-border/40" />
                      </div>
                      <div className="space-y-2.5">
                        {INSPIRATIONS.map((insp) => (
                          <button
                            key={insp.id}
                            onClick={() => applyInspiration(insp.id)}
                            className="group w-full flex flex-col rounded-sm border border-border/40 hover:border-primary/60 overflow-hidden transition-all text-left bg-card/30 hover:bg-card/50"
                            title={`Charger : ${insp.title}`}
                          >
                            {insp.thumbnail && (
                              <span className="block relative aspect-[16/10] overflow-hidden">
                                <img
                                  src={insp.thumbnail}
                                  alt=""
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className="absolute top-1.5 left-1.5 text-[8.5px] tracking-[0.18em] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-background/85 backdrop-blur text-primary border border-primary/30">
                                  {insp.tag}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                              </span>
                            )}
                            <span className="block px-2.5 py-2">
                              <span className="block text-[11px] font-display text-foreground/95 leading-snug">
                                {insp.title}
                              </span>
                              <span className="block text-[9.5px] text-foreground/60 mt-1 line-clamp-2 leading-snug">
                                {insp.pitch}
                              </span>
                              <span className="mt-1.5 inline-flex items-center gap-1 text-[8.5px] tracking-[0.2em] uppercase text-primary/80 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Charger →
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.aside>
            )}

            {/* ============== Viewport ============== */}
            <div className="relative h-[65vh] min-h-[520px] rounded-sm overflow-hidden border border-border/40 bg-card/20 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                {view === "3d" && (
                  <motion.div
                    key="view-3d"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Suspense
                      fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <div className="w-10 h-10 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                            <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/55">
                              Chargement de la scène 3D…
                            </p>
                          </div>
                        </div>
                      }
                    >
                      <DomeViewer3D
                        containerKind={containerKind}
                        size={size}
                        furniture={furniture}
                        selectedId={selectedId}
                        walking={walking}
                        onSelect={setSelectedId}
                        onMove={moveFurniture}
                        onGrabChange={setGrabbedId}
                      />
                    </Suspense>

                    {/* HUD haut : toggle visite */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <div className="inline-flex rounded-sm border border-border/40 bg-background/85 backdrop-blur p-1">
                        <button
                          onClick={() => setWalking(false)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] tracking-[0.22em] uppercase font-semibold transition-all ${
                            !walking ? "bg-primary text-primary-foreground" : "text-foreground/65"
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          Vue extérieure
                        </button>
                        <button
                          onClick={() => {
                            setWalking(true);
                            setSelectedId(null);
                            setPaletteOpen(false);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] tracking-[0.22em] uppercase font-semibold transition-all ${
                            walking ? "bg-primary text-primary-foreground" : "text-foreground/65"
                          }`}
                        >
                          <Footprints className="w-3 h-3" />
                          Visite intérieure
                        </button>
                      </div>
                    </div>

                    {/* HUD haut droit : indications */}
                    {!walking && (
                      <div className="absolute top-3 right-3 px-3 py-2 rounded-sm bg-background/85 backdrop-blur border border-border/40 text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold flex items-center gap-2">
                        <Maximize2 className="w-3 h-3 text-primary" />
                        <span className="hidden sm:inline">
                          {grabbedId ? "Glissez pour positionner" : "Glisser pour tourner · clic sur une pièce pour la déplacer"}
                        </span>
                        <span className="sm:hidden">Glissez · Pincer pour zoomer</span>
                      </div>
                    )}

                    {walking && (
                      <div className="absolute top-3 right-3 px-3.5 py-2 rounded-sm bg-primary/15 backdrop-blur border border-primary/40 flex items-center gap-3">
                        <Footprints className="w-3.5 h-3.5 text-primary" />
                        <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold leading-tight">
                          <div>Cliquez pour regarder · WASD pour marcher</div>
                          <div className="text-foreground/65 normal-case tracking-normal text-[10px]">
                            Échap pour sortir
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HUD bas : actions sur la sélection */}
                    {!walking && selectedId && selectedSpec && (() => {
                      const selectedItem = furniture.find((f) => f.id === selectedId);
                      const currentRot = selectedItem?.rotY ?? 0;
                      // Affichage en degrés, normalisé sur [-180, 180]
                      const degRaw = (currentRot * 180) / Math.PI;
                      const deg = ((((degRaw + 180) % 360) + 360) % 360) - 180;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 rounded-sm bg-background/95 backdrop-blur border border-primary/40 shadow-2xl max-w-[calc(100%-1.5rem)]"
                        >
                          {selectedSpec.image && (
                            <img
                              src={selectedSpec.image}
                              alt=""
                              className="w-9 h-9 object-cover rounded-sm border border-border/40 shrink-0"
                            />
                          )}
                          <div className="text-left min-w-0">
                            <div className="text-[11px] text-foreground/90 font-display max-w-[180px] truncate">
                              {selectedSpec.label}
                            </div>
                            <div className="text-[9px] tracking-[0.18em] uppercase text-foreground/50">
                              {selectedSpec.ref}
                            </div>
                          </div>

                          <span className="hidden sm:block w-px h-8 bg-border/50" />

                          {/* Bloc rotation : slider + boutons rapides */}
                          <div className="hidden sm:flex flex-col items-center gap-1 min-w-[180px]">
                            <div className="flex items-center gap-1.5 w-full">
                              <button
                                onClick={() => setFurnitureRotation(selectedId, currentRot - Math.PI / 12)}
                                className="w-6 h-6 rounded-sm border border-border/50 hover:border-primary/60 hover:text-primary text-foreground/70 transition-all flex items-center justify-center text-[10px]"
                                title="−15°"
                                aria-label="Tourner de moins 15 degrés"
                              >
                                ⟲
                              </button>
                              <input
                                type="range"
                                min={-180}
                                max={180}
                                step={1}
                                value={Math.round(deg)}
                                onChange={(e) =>
                                  setFurnitureRotation(
                                    selectedId,
                                    (parseFloat(e.target.value) * Math.PI) / 180,
                                  )
                                }
                                className="flex-1 accent-primary"
                                aria-label="Rotation"
                              />
                              <button
                                onClick={() => setFurnitureRotation(selectedId, currentRot + Math.PI / 12)}
                                className="w-6 h-6 rounded-sm border border-border/50 hover:border-primary/60 hover:text-primary text-foreground/70 transition-all flex items-center justify-center text-[10px]"
                                title="+15°"
                                aria-label="Tourner de plus 15 degrés"
                              >
                                ⟳
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] tracking-[0.15em] uppercase text-foreground/55 font-semibold">
                              <button
                                onClick={() => setFurnitureRotation(selectedId, 0)}
                                className="hover:text-primary transition-colors"
                              >
                                0°
                              </button>
                              <span>·</span>
                              <span className="text-primary tabular-nums">{Math.round(deg)}°</span>
                              <span>·</span>
                              <button
                                onClick={() => setFurnitureRotation(selectedId, Math.PI / 2)}
                                className="hover:text-primary transition-colors"
                              >
                                90°
                              </button>
                            </div>
                          </div>

                          {/* Mobile : juste le bouton tourner par incrément */}
                          <button
                            onClick={() => rotateFurniture(selectedId)}
                            className="sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-border/50 text-[10px] tracking-[0.18em] uppercase text-foreground/75 hover:text-primary hover:border-primary/50 transition-all"
                          >
                            <RotateCw className="w-3 h-3" />
                            Tourner
                          </button>

                          <span className="hidden sm:block w-px h-8 bg-border/50" />

                          <button
                            onClick={() => removeFurniture(selectedId)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-border/50 text-[10px] tracking-[0.18em] uppercase text-foreground/75 hover:text-red-400 hover:border-red-400/50 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Retirer</span>
                          </button>
                          <button
                            onClick={() => setSelectedId(null)}
                            className="w-6 h-6 rounded-sm flex items-center justify-center text-foreground/55 hover:text-foreground hover:bg-foreground/5 transition-all"
                            aria-label="Désélectionner"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      );
                    })()}
                  </motion.div>
                )}

                {view === "plan" && (
                  <motion.div
                    key="view-plan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 p-4 md:p-5"
                  >
                    <DomeImplantationPlan diameter={size} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ============== Palette « Aménager » ============== */}
            {view === "3d" && !walking && (
              <motion.aside
                initial={false}
                animate={{ width: paletteOpen ? 320 : 56 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="surface-glass rounded-sm overflow-hidden flex flex-col h-[65vh] min-h-[520px] order-3"
              >
                {/* En-tête */}
                <button
                  onClick={() => setPaletteOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-3 border-b border-border/40 text-primary hover:bg-primary/5 transition-colors"
                  title={paletteOpen ? "Réduire" : "Aménager"}
                >
                  <Sofa className="w-4 h-4 shrink-0" />
                  {paletteOpen && (
                    <span className="text-[10px] tracking-[0.22em] uppercase font-semibold whitespace-nowrap">
                      Aménager
                    </span>
                  )}
                  {paletteOpen && furniture.length > 0 && (
                    <span className="ml-auto text-[10px] tracking-[0.18em] uppercase text-primary font-semibold">
                      {furniture.length} placée{furniture.length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>

                {paletteOpen && (
                  <>
                    {/* Onglets famille */}
                    <div className="flex flex-wrap gap-1 px-2 py-2 border-b border-border/40">
                      {FURNITURE_FAMILIES.map((fam) => {
                        const count = familyCounts.get(fam) ?? 0;
                        return (
                          <button
                            key={fam}
                            onClick={() => setActiveFamily(fam)}
                            className={`relative text-[9px] tracking-[0.12em] uppercase font-semibold py-1.5 px-2 rounded-sm transition-all ${
                              activeFamily === fam
                                ? "bg-primary/90 text-primary-foreground"
                                : "text-foreground/65 hover:text-primary"
                            }`}
                          >
                            {fam}
                            {count > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Liste mobilier — vignettes photos */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                      {filteredCatalog.map((s) => (
                        <button
                          key={s.ref}
                          onClick={() => addFurniture(s.ref)}
                          className="group w-full flex items-center gap-3 p-2 rounded-sm border border-border/40 hover:border-primary/60 hover:bg-primary/5 transition-all text-left"
                        >
                          {/* Vignette : photo si dispo, sinon swatch couleur */}
                          {s.image ? (
                            <img
                              src={s.image}
                              alt=""
                              loading="lazy"
                              className="w-14 h-14 object-cover rounded-sm shrink-0 border border-border/40"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="w-14 h-14 rounded-sm shrink-0 border border-border/40 flex items-center justify-center"
                              style={{ backgroundColor: s.color }}
                            >
                              <Sofa className="w-5 h-5 opacity-30" />
                            </span>
                          )}
                          <span className="flex-1 min-w-0">
                            <span className="block text-[11px] font-display text-foreground/90 leading-snug line-clamp-2">
                              {s.label}
                            </span>
                            <span className="block text-[8.5px] tracking-[0.15em] uppercase text-foreground/45 mt-1">
                              {s.ref} · {s.size.w.toFixed(1)} × {s.size.d.toFixed(1)} m
                            </span>
                            {s.blurb && (
                              <span className="block text-[10px] text-foreground/55 mt-1 line-clamp-1">
                                {s.blurb}
                              </span>
                            )}
                          </span>
                          <Plus className="w-4 h-4 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>

                    {/* Footer palette */}
                    <div className="border-t border-border/40 px-3 py-2 flex items-center justify-between">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/55 font-semibold">
                        Cliquez pour ajouter, glissez pour positionner
                      </span>
                      <button
                        onClick={clearFurniture}
                        disabled={!furniture.length}
                        className="text-[9px] tracking-[0.2em] uppercase text-foreground/55 hover:text-red-400 disabled:opacity-30 transition-colors whitespace-nowrap"
                      >
                        Tout retirer
                      </button>
                    </div>
                  </>
                )}
              </motion.aside>
            )}
          </div>
        </div>
      </section>

      {/* CTA bar */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="surface-glass rounded-sm p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-5 items-center">
              <div className="md:col-span-2">
                <h3 className="text-xl md:text-2xl font-display font-semibold leading-tight mb-2">
                  Cette configuration vous{" "}
                  <span className="text-gradient-gold italic">parle ?</span>
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  Envoyez-la à notre équipe — la géométrie, les pièces choisies et leurs
                  positions sont conservées et nous parviennent. Ou réservez un échange
                  pour affiner ensemble.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setSendConfigOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.22em] uppercase hover:glow-gold transition-all"
                >
                  <Send className="w-4 h-4" />
                  Envoyer ma config
                </button>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm border border-primary/40 text-primary text-[11px] font-semibold tracking-[0.22em] uppercase hover:bg-primary/10 hover:border-primary/60 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Réserver un échange
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
      <SendConfigDialog
        open={sendConfigOpen}
        onOpenChange={setSendConfigOpen}
        containerLabel={containerSpec.label}
        sizeLabel={sizeLabel}
        size={size}
        capacity={capacity}
        furniture={furniture}
      />
    </div>
  );
};

export default Visualiser;
