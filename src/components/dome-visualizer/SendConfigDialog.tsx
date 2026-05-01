/**
 * SendConfigDialog — modale d'envoi de la configuration du visualiseur.
 *
 * Avant d'envoyer la demande, on collecte le contexte pour que l'équipe
 * Greendome reçoive un mail compréhensible et exploitable :
 *   - Type de projet (résidence, hôtel, glamping, mariage, restaurant…)
 *   - Univers Greendome qui intéressent le visiteur (multi-sélection :
 *     structure, mobilier, spa/jacuzzi, décor & lumière). Pré-cochage
 *     intelligent depuis la config visualisée — le dôme placé pré-coche
 *     "Structure", des meubles placés pré-cochent "Mobilier".
 *   - Coordonnées (nom, email, téléphone, localisation)
 *   - Précisions libres
 *
 * Le mail final intègre la configuration complète : structure, dimensions,
 * capacité, ainsi que CHAQUE pièce de mobilier avec sa position (m) et son
 * orientation (°), pour que la composition soit reproductible côté équipe.
 *
 * Stages : "form" → "done".
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ArrowRight, Check, Mail, X, Sparkles,
  Home, Sofa, Droplets, Lamp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { dispatch, toMailtoHref } from "@/lib/contact-mailer";
import { savePitch } from "@/lib/voice";
import { findSpec, type PlacedFurniture } from "@/lib/furniture-catalog";

type ProjectType =
  | "residence"
  | "hotel"
  | "glamping"
  | "restaurant"
  | "evenement"
  | "autre";

const PROJECT_OPTIONS: { value: ProjectType; label: string; hint: string }[] = [
  { value: "residence",  label: "Résidence privée",          hint: "Maison, jardin, propriété" },
  { value: "hotel",      label: "Hôtel / Resort",            hint: "Hôtellerie, suite extérieure" },
  { value: "glamping",   label: "Glamping / Camping",        hint: "Hébergement insolite" },
  { value: "restaurant", label: "Restaurant / Réception",    hint: "Salle, terrasse, bar" },
  { value: "evenement",  label: "Mariage / Événement",       hint: "Cérémonie, soirée, séminaire" },
  { value: "autre",      label: "Autre",                     hint: "Décrivez en quelques mots" },
];

/**
 * Univers Greendome — chaque chip représente une famille de produits du site.
 * On demande au visiteur de cocher tout ce qui l'intéresse, même au-delà de
 * ce qu'il a déjà placé sur le visualiseur. Cela permet à l'équipe Greendome
 * d'apporter une réponse globale (devis multi-univers) plutôt que limitée
 * au seul dôme configuré.
 */
type Universe = "structure" | "mobilier" | "spa" | "decor";

const UNIVERSE_OPTIONS: {
  value: Universe;
  label: string;
  hint: string;
  Icon: typeof Home;
}[] = [
  {
    value: "structure",
    label: "Structure & habitat",
    hint: "Dômes, pavillons, safari, tipis — 39 modèles",
    Icon: Home,
  },
  {
    value: "mobilier",
    label: "Mobilier d'extérieur",
    hint: "Canapés, fauteuils, lits, méridiennes",
    Icon: Sofa,
  },
  {
    value: "spa",
    label: "Spa & jacuzzi",
    hint: "Carré, rond, octagonal, signature",
    Icon: Droplets,
  },
  {
    value: "decor",
    label: "Décor & lumière",
    hint: "Tables, plantes, luminaires, tapis",
    Icon: Lamp,
  },
];

const UNIVERSE_LABELS: Record<Universe, string> = UNIVERSE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.value]: o.label }),
  {} as Record<Universe, string>,
);

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  /** Label du modèle sélectionné — ex: "Dôme Géodésique Signature" */
  containerLabel: string;
  /** Label de la dimension principale — "Diamètre" ou "Largeur" */
  sizeLabel: string;
  /** Valeur de la dimension principale (m) */
  size: number;
  /** Capacité estimée (personnes) */
  capacity: number;
  /** Pièces placées dans la scène, telles quelles (avec pos + rotY) */
  furniture: PlacedFurniture[];
};

const fmtMeters = (n: number) => `${n.toFixed(2)} m`;
const fmtDegrees = (rad: number) => {
  const deg = (rad * 180) / Math.PI;
  // Normalise sur (-180, 180]
  const norm = ((((deg + 180) % 360) + 360) % 360) - 180;
  return `${Math.round(norm)}°`;
};

const SendConfigDialog = ({
  open,
  onOpenChange,
  containerLabel,
  sizeLabel,
  size,
  capacity,
  furniture,
}: Props) => {
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [interests, setInterests] = useState<Set<Universe>>(new Set());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState<"form" | "done">("form");
  const [submitting, setSubmitting] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  /**
   * Pré-cochage intelligent dès l'ouverture :
   *  - "Structure" est cochée d'emblée (le visiteur a forcément un dôme/abri
   *    à l'écran puisqu'on est sur le visualiseur).
   *  - "Mobilier" se coche s'il a déjà placé au moins une pièce.
   * Le visiteur reste libre de décocher et d'ajouter Spa ou Décor d'un clic.
   */
  useEffect(() => {
    if (open) {
      const seed = new Set<Universe>(["structure"]);
      if (furniture.length > 0) seed.add("mobilier");
      setInterests(seed);
    }
  }, [open, furniture.length]);

  // Reset à la fermeture (avec léger delay pour ne pas voir le flash)
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setProjectType(null);
        setInterests(new Set());
        setName("");
        setEmail("");
        setPhone("");
        setLocation("");
        setNotes("");
        setStage("form");
        setSubmitting(false);
        setMailtoHref(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const toggleInterest = (u: Universe) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });
  };

  const canSubmit =
    !!projectType &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    const projectLabel =
      PROJECT_OPTIONS.find((o) => o.value === projectType)?.label ?? "Autre";

    // ---- Bloc mobilier détaillé : ref + label + position + rotation ----
    const pieces = furniture
      .map((f) => {
        const spec = findSpec(f.ref);
        if (!spec) return null;
        return `  · ${spec.label} (${spec.ref}) — pos [${f.pos[0].toFixed(2)}, ${f.pos[1].toFixed(2)}] m, orientation ${fmtDegrees(f.rotY)}`;
      })
      .filter(Boolean) as string[];

    // ---- Univers d'intérêt : on les ordonne pour avoir une lecture stable ----
    const interestOrder: Universe[] = ["structure", "mobilier", "spa", "decor"];
    const selectedUniverses = interestOrder.filter((u) => interests.has(u));
    const universesLabel =
      selectedUniverses.length > 0
        ? selectedUniverses.map((u) => UNIVERSE_LABELS[u]).join(", ")
        : "(aucun univers sélectionné)";

    const summary = `Configuration ${containerLabel} ${size.toFixed(1)} m, ${capacity} pers., ${furniture.length} pièces — ${projectLabel}.`;
    savePitch(summary);

    const subject = `[Greendome] ${projectLabel} — ${containerLabel} ${size.toFixed(1)} m`;
    const body = [
      `Bonjour,`,
      ``,
      `Je viens de composer une configuration sur le visualiseur Greendome et`,
      `souhaite vous la transmettre pour échanger avec votre équipe.`,
      ``,
      `═══ Mon projet ═══`,
      `• Type de projet : ${projectLabel}`,
      `• Univers d'intérêt : ${universesLabel}`,
      location.trim() ? `• Localisation : ${location.trim()}` : null,
      ``,
      `═══ Mes coordonnées ═══`,
      `• Nom : ${name.trim()}`,
      `• Email : ${email.trim()}`,
      phone.trim() ? `• Téléphone : ${phone.trim()}` : null,
      ``,
      `═══ Configuration visualisée ═══`,
      `• Structure : ${containerLabel}`,
      `• ${sizeLabel} : ${fmtMeters(size)}`,
      `• Capacité estimée : ${capacity} personnes`,
      `• Pièces placées : ${furniture.length}`,
      ``,
      pieces.length > 0
        ? `Détail des pièces :\n${pieces.join("\n")}`
        : `(Aucune pièce de mobilier placée pour l'instant.)`,
      ``,
      notes.trim() ? `═══ Précisions ═══\n${notes.trim()}` : null,
      ``,
      `Au plaisir d'échanger,`,
      name.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");

    const item = await dispatch("contact-form", subject, body, {
      project: projectLabel,
      universes: selectedUniverses.join(",") || undefined,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      location: location.trim() || undefined,
      container: containerLabel,
      size: String(size),
      capacity: String(capacity),
      pieces: String(furniture.length),
    });

    setMailtoHref(toMailtoHref(item));
    setSubmitting(false);
    setStage("done");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[88vh] overflow-y-auto surface-glass border-primary/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-sm bg-primary/15 border border-primary/40 flex items-center justify-center">
              <Send className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display tracking-wide">
                Envoyer ma configuration
              </DialogTitle>
              <DialogDescription className="text-[11px] tracking-[0.18em] uppercase text-foreground/55 mt-0.5">
                Quelques précisions pour vous répondre justement
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* ---------- ETAPE 1 — formulaire ---------- */}
          {stage === "form" && (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Récap config en haut, pour rappel */}
              <div className="rounded-sm border border-primary/30 bg-primary/5 px-3.5 py-2.5">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-foreground/85 leading-snug">
                      <span className="font-semibold text-primary">{containerLabel}</span>
                      {" — "}
                      <span className="text-foreground/85">
                        {size.toFixed(1)} m · {capacity} pers. · {furniture.length} pièce
                        {furniture.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-[10px] tracking-[0.18em] uppercase text-foreground/55 mt-0.5">
                      Configuration jointe à la demande
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* IMAGINONS VOTRE PROJET                                       */}
              {/* Bloc 1/2 : type de projet (contexte d'usage) — required.    */}
              {/* Bloc 2/2 : univers Greendome qui intéressent (multi).        */}
              {/* ============================================================ */}
              <div className="space-y-4 rounded-sm border border-primary/20 bg-primary/[0.02] px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[10px] tracking-[0.28em] uppercase text-primary font-semibold">
                    Imaginons votre projet
                  </span>
                  <span className="text-[9px] tracking-[0.18em] uppercase text-foreground/45">
                    Étape 1 / 1
                  </span>
                </div>

                {/* ---- Type de projet ---- */}
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold">
                    Type de projet *
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PROJECT_OPTIONS.map((opt) => {
                      const active = projectType === opt.value;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setProjectType(opt.value)}
                          className={`text-left px-3 py-2 rounded-sm border transition-all ${
                            active
                              ? "border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.45)]"
                              : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <span
                            className={`block text-[11px] font-display leading-tight ${
                              active ? "text-primary" : "text-foreground/90"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="block text-[9px] text-foreground/55 mt-0.5">
                            {opt.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ---- Univers Greendome (multi-select) ---- */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold">
                      Mon projet inclut
                    </span>
                    <span className="text-[9px] text-foreground/50 italic">
                      Plusieurs choix possibles
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {UNIVERSE_OPTIONS.map((opt) => {
                      const active = interests.has(opt.value);
                      const Icon = opt.Icon;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => toggleInterest(opt.value)}
                          aria-pressed={active}
                          className={`relative text-left px-3 py-2 rounded-sm border transition-all ${
                            active
                              ? "border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.45)]"
                              : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon
                              className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                                active ? "text-primary" : "text-foreground/55"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <span
                                className={`block text-[11px] font-display leading-tight ${
                                  active ? "text-primary" : "text-foreground/90"
                                }`}
                              >
                                {opt.label}
                              </span>
                              <span className="block text-[9px] text-foreground/55 mt-0.5">
                                {opt.hint}
                              </span>
                            </div>
                            {active && (
                              <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-foreground/50 leading-relaxed pt-0.5">
                    Pré-cochés selon votre composition au visualiseur. Ajoutez les
                    autres univers Greendome qui vous intéressent — nous adaptons
                    notre proposition en conséquence.
                  </p>
                </div>
              </div>

              {/* ---- Coordonnées ---- */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label
                    htmlFor="sc-name"
                    className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold"
                  >
                    Votre nom *
                  </label>
                  <input
                    id="sc-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    placeholder="Prénom Nom"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="sc-email"
                    className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold"
                  >
                    Email *
                  </label>
                  <input
                    id="sc-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    placeholder="vous@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label
                    htmlFor="sc-phone"
                    className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold"
                  >
                    Téléphone
                  </label>
                  <input
                    id="sc-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="sc-location"
                    className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold"
                  >
                    Localisation
                  </label>
                  <input
                    id="sc-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    placeholder="Région, ville…"
                  />
                </div>
              </div>

              {/* ---- Notes ---- */}
              <div className="space-y-2">
                <label
                  htmlFor="sc-notes"
                  className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold"
                >
                  Précisions sur le projet
                </label>
                <textarea
                  id="sc-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
                  placeholder="Échéance, contraintes, usage particulier…"
                />
              </div>

              <p className="text-[10px] text-foreground/55 leading-relaxed">
                Vos coordonnées ne sont utilisées que pour vous répondre. La configuration
                complète (modèle, dimensions, mobilier et positions) est jointe automatiquement.
              </p>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-sm hover:glow-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  "Envoi…"
                ) : (
                  <>
                    Envoyer la demande
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* ---------- ETAPE 2 — confirmation ---------- */}
          {stage === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="text-center py-6 space-y-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-primary/15 border border-primary/50 flex items-center justify-center mx-auto"
              >
                <Check className="w-7 h-7 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  Demande enregistrée
                </h3>
                <p className="text-sm text-foreground/75 leading-relaxed max-w-sm mx-auto">
                  Nous revenons vers vous très vite avec une proposition adaptée à
                  votre projet.
                </p>
              </div>

              {mailtoHref && (
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-primary/85 hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Envoyer aussi par mail
                </a>
              )}

              <button
                onClick={() => onOpenChange(false)}
                className="block w-full text-[10px] tracking-[0.22em] uppercase text-foreground/55 hover:text-primary transition-colors mt-4"
              >
                <X className="w-3 h-3 inline-block mr-1" />
                Fermer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SendConfigDialog;
