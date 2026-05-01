/**
 * Concierge — assistant flottant Greendome.
 *
 * Bulle dorée en bas à droite, toujours présente.
 * Trois modes :
 *   1. choix guidés (arborescence) — aiguille vers la bonne page
 *   2. "Parler en direct" — dictée vocale (Web Speech API)
 *   3. fallback — envoi vers /contact avec le pitch pré-rempli
 *
 * 100 % frontend, scripté en arborescence — aucune API externe pour l'instant.
 * Conçu pour être branché ultérieurement à un LLM (OpenAI / Claude).
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Mic, MicOff, Send, Phone, Calendar } from "lucide-react";
import { useVoiceRecognition, savePitch } from "@/lib/voice";
import BookingDialog from "@/components/BookingDialog";
import ConciergeCallback from "@/components/ConciergeCallback";

// ----------------------------------------------------------------------
// Types & arbre de conversation
// ----------------------------------------------------------------------
type Choice = { label: string; next: string };
type Step = {
  id: string;
  text: string | string[];
  choices?: Choice[];
  cta?: { label: string; href: string };
  end?: boolean;
};

const STEPS: Record<string, Step> = {
  start: {
    id: "start",
    text: [
      "Bonsoir, je suis le concierge Greendome.",
      "Dites-moi simplement ce que vous cherchez — je vous guide. Vous pouvez aussi cliquer sur le micro et me parler directement.",
    ],
    choices: [
      { label: "Un dôme transparent", next: "dome" },
      { label: "Visualiser un dôme en 3D", next: "visualiser" },
      { label: "Un jacuzzi signature", next: "jacuzzi" },
      { label: "Du mobilier d'auteur", next: "mobilier" },
      { label: "Louer un dôme pour un événement", next: "location" },
      { label: "Une maison en kit", next: "maison" },
      { label: "Parler directement à un humain", next: "humain" },
    ],
  },

  visualiser: {
    id: "visualiser",
    text: [
      "Excellente idée. La salle de visualisation vous laisse tourner autour d'un dôme grandeur nature, faire varier le diamètre, et tracer un plan d'implantation à la souris — arbres, murs, exposition.",
      "C'est ouvert, sans inscription. Vous pouvez nous envoyer votre configuration en un clic depuis la page.",
    ],
    cta: { label: "Ouvrir la salle de visualisation", href: "/visualiser" },
    choices: [{ label: "Revenir au début", next: "start" }],
    end: true,
  },

  dome: {
    id: "dome",
    text: "Parfait. Êtes-vous plutôt particulier ou professionnel (hôtellerie, restauration, événementiel) ?",
    choices: [
      { label: "Particulier — pour ma maison / mon jardin", next: "domeParticulier" },
      { label: "Professionnel — hôtel, glamping, restaurant", next: "domePro" },
      { label: "Je ne sais pas encore", next: "domeDecouverte" },
    ],
  },
  domeParticulier: {
    id: "domeParticulier",
    text: [
      "Excellent. Notre gamme particuliers couvre les jardins, terrasses et toits-terrasses — diamètres de 3,5 à 7 m, capacités de 2 à 22 personnes.",
      "Vous pouvez tout voir sur la page Particuliers, ou télécharger directement le catalogue Dômes 2026.",
    ],
    cta: { label: "Voir l'univers Particuliers", href: "/particuliers" },
    choices: [
      { label: "Télécharger le catalogue Dômes", next: "downloadDome" },
      { label: "Imaginer mon projet avec un humain", next: "humain" },
    ],
  },
  domePro: {
    id: "domePro",
    text: [
      "Hôtels, restaurants, parcs, glamping — nos solutions Pro intègrent des dômes ronds (jusqu'à 22 personnes) et ovales (jusqu'à 32) avec accompagnement clé-en-main.",
      "Notre équipe livre, installe et conseille sur la dalle d'implantation.",
    ],
    cta: { label: "Voir Solutions Pro", href: "/solutions" },
    choices: [
      { label: "Télécharger le catalogue Dômes", next: "downloadDome" },
      { label: "Demander un accompagnement projet", next: "humain" },
    ],
  },
  domeDecouverte: {
    id: "domeDecouverte",
    text: "Aucun souci. Commencez par feuilleter le catalogue — il regroupe les 13 modèles avec dimensions, capacités et inspirations scénographiques.",
    cta: { label: "Voir tous les catalogues", href: "/catalogues" },
    choices: [
      { label: "Comprendre la technologie Greendome", next: "tech" },
      { label: "Parler à un humain", next: "humain" },
    ],
  },
  downloadDome: {
    id: "downloadDome",
    text: "Le catalogue Dômes 2026 est prêt — 22 pages, treize modèles, toutes les spécifications.",
    cta: { label: "Télécharger maintenant", href: "/Greendome-Catalogue-Domes-2026.pdf" },
    choices: [{ label: "Revenir au début", next: "start" }],
    end: true,
  },

  jacuzzi: {
    id: "jacuzzi",
    text: [
      "Nos jacuzzis signature s'intègrent en villa, en chalet, sur yacht ou en hôtel boutique.",
      "Modèles ronds, octogonaux, carrés — finitions pierre, bois, métal.",
    ],
    cta: { label: "Voir l'univers Jacuzzi", href: "/jacuzzi" },
    choices: [
      { label: "Télécharger le catalogue Jacuzzis", next: "downloadJacuzzi" },
      { label: "Demander une intégration sur-mesure", next: "humain" },
    ],
  },
  downloadJacuzzi: {
    id: "downloadJacuzzi",
    text: "Catalogue Jacuzzis 2026 — sélection signature, intégrations sur-mesure.",
    cta: { label: "Télécharger maintenant", href: "/Greendome-Catalogue-Jacuzzis-2026.pdf" },
    choices: [{ label: "Revenir au début", next: "start" }],
    end: true,
  },

  mobilier: {
    id: "mobilier",
    text: [
      "Quinze pièces, une grammaire — dix canapés, un fauteuil sculpté, cinq lits.",
      "Velours côtelé, bouclette, lin lavé. Tissé serré, pensé pour durer.",
    ],
    cta: { label: "Voir l'univers Mobilier", href: "/mobilier" },
    choices: [
      { label: "Télécharger le catalogue Mobilier", next: "downloadMobilier" },
      { label: "Demander une déclinaison sur-mesure", next: "humain" },
    ],
  },
  downloadMobilier: {
    id: "downloadMobilier",
    text: "Catalogue Mobilier 2026 — 24 pages, 15 pièces, 14 coloris signature.",
    cta: { label: "Télécharger maintenant", href: "/Greendome-Catalogue-Mobilier-2026.pdf" },
    choices: [{ label: "Revenir au début", next: "start" }],
    end: true,
  },

  location: {
    id: "location",
    text: [
      "Mariage sous les étoiles, lancement de produit, dîner gastronomique en plein air…",
      "Nous prenons en charge la livraison, l'installation et le démontage.",
    ],
    cta: { label: "Voir la page Location", href: "/location" },
    choices: [{ label: "Échanger avec notre équipe", next: "humain" }],
  },

  maison: {
    id: "maison",
    text: "Nos maisons en kit — habitats légers, modulaires, livrés prêts à monter. Idéales pour résidences secondaires, gîtes ou habitats d'auteur.",
    cta: { label: "Voir Maisons en kit", href: "/maisons-en-kit" },
    choices: [{ label: "Imaginer mon projet", next: "humain" }],
  },

  tech: {
    id: "tech",
    text: "La technologie Greendome — structure, transparence, isolation, durabilité. Tout est documenté.",
    cta: { label: "Voir la Technologie", href: "/technologie" },
    choices: [{ label: "Revenir au début", next: "start" }],
  },

  humain: {
    id: "humain",
    text: [
      "Avec plaisir.",
      "La page Contact vous propose un formulaire écrit ou la dictée vocale — dites-nous votre projet en parlant, on s'occupe du reste.",
    ],
    cta: { label: "Imaginons votre projet", href: "/contact" },
    choices: [{ label: "Revenir au début", next: "start" }],
    end: true,
  },
};

// ----------------------------------------------------------------------
// Composant
// ----------------------------------------------------------------------
type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
};

type Mode = "choices" | "voice" | "callback";

const Concierge = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("choices");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [stepId, setStepId] = useState<string>("start");
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voix — partagée avec /contact via lib/voice
  const voice = useVoiceRecognition({
    onFinalize: (text) => {
      // Le pitch finalisé est conservé pour pré-remplir /contact
      savePitch(text);
    },
  });

  // Scroll auto vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, stepId, open, mode, voice.transcript]);

  // Au premier ouverture, on injecte le step "start"
  useEffect(() => {
    if (open && !hasOpenedOnce) {
      const step = STEPS.start;
      pushBotStep(step);
      setHasOpenedOnce(true);
    }
  }, [open, hasOpenedOnce]);

  // À la fermeture, on stoppe la dictée si en cours
  useEffect(() => {
    if (!open && voice.isListening) voice.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pushBotStep = (step: Step) => {
    const lines = Array.isArray(step.text) ? step.text : [step.text];
    setMessages((prev) => {
      const base = prev.length;
      const news: Msg[] = lines.map((t, i) => ({
        id: Date.now() + base + i,
        from: "bot" as const,
        text: t,
      }));
      return [...prev, ...news];
    });
  };

  const onChoice = (c: Choice) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: c.label },
    ]);
    const nextStep = STEPS[c.next];
    setTimeout(() => {
      setStepId(c.next);
      if (nextStep) pushBotStep(nextStep);
    }, 320);
  };

  const restart = () => {
    setMessages([]);
    setStepId("start");
    setMode("choices");
    setTimeout(() => pushBotStep(STEPS.start), 100);
  };

  const switchToVoice = () => {
    setMode("voice");
    voice.reset();
  };

  const switchToCallback = () => {
    if (voice.isListening) voice.stop();
    setMode("callback");
  };

  const sendVoiceToContact = () => {
    const text = voice.transcript.trim();
    if (!text) return;
    savePitch(text);
    if (voice.isListening) voice.stop();
    window.location.href = "/contact";
  };

  const currentStep = STEPS[stepId];

  return (
    <>
      {/* ======================================================
          Bouton flottant (état fermé)
          ====================================================== */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="concierge-button"
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[200] group"
            aria-label="Ouvrir le concierge Greendome"
          >
            {/* Halo doré pulsant */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
              animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0.1, 0.45] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl border border-primary/40 group-hover:glow-gold transition-all">
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline text-[11px] font-semibold tracking-[0.22em] uppercase">
                Concierge
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ======================================================
          Panneau de conversation (état ouvert)
          ====================================================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="concierge-panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[200] w-[min(400px,calc(100vw-2rem))] max-h-[min(680px,calc(100vh-3rem))] flex flex-col rounded-md overflow-hidden border border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl"
          >
            {/* ---------- Header ---------- */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/40 bg-gradient-to-b from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.22em] uppercase font-semibold text-primary">
                    Concierge Greendome
                  </div>
                  <div className="text-[10px] text-foreground/55">
                    Disponible · répond en quelques secondes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBookingOpen(true)}
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Réserver un créneau"
                  title="Réserver un créneau"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={switchToCallback}
                  className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors ${
                    mode === "callback"
                      ? "text-primary bg-primary/15"
                      : "text-foreground/60 hover:text-primary hover:bg-primary/10"
                  }`}
                  aria-label="Demander un rappel"
                  title="Demander un rappel"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ---------- Switch mode (Guidé / Voix) ---------- */}
            <div className="px-5 pt-3 pb-1 flex items-center gap-2">
              <button
                onClick={() => setMode("choices")}
                className={`flex-1 text-[10px] tracking-[0.2em] uppercase font-semibold py-2 rounded-sm transition-all ${
                  mode === "choices"
                    ? "bg-primary/90 text-primary-foreground"
                    : "border border-border/50 text-foreground/65 hover:border-primary/50 hover:text-primary"
                }`}
              >
                Guidé
              </button>
              <button
                onClick={switchToVoice}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold py-2 rounded-sm transition-all ${
                  mode === "voice"
                    ? "bg-primary/90 text-primary-foreground"
                    : "border border-border/50 text-foreground/65 hover:border-primary/50 hover:text-primary"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                Voix
              </button>
            </div>

            {/* ---------- Messages (mode choices) ou zone voix ---------- */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth"
            >
              {mode === "choices" &&
                messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`max-w-[85%] text-[13px] leading-relaxed px-3.5 py-2.5 rounded-md ${
                      m.from === "bot"
                        ? "bg-foreground/[0.04] border border-border/40 text-foreground/85"
                        : "ml-auto bg-primary/15 border border-primary/30 text-foreground"
                    }`}
                  >
                    {m.text}
                  </motion.div>
                ))}

              {mode === "callback" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-[12px] text-foreground/75 leading-relaxed">
                    Laissez-nous votre numéro et un créneau préféré — nous vous rappelons
                    rapidement, sans formulaire.
                  </p>
                  <ConciergeCallback onClose={() => setMode("choices")} />
                </motion.div>
              )}

              {mode === "voice" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-[12px] text-foreground/75 leading-relaxed">
                    Cliquez sur le micro et racontez votre projet à voix haute —
                    terrain, ambiance, calendrier, capacité… On se charge du reste.
                  </div>

                  {/* Gros bouton micro central */}
                  <div className="flex flex-col items-center py-2">
                    <button
                      onClick={() =>
                        voice.isListening
                          ? voice.stop()
                          : voice.start(voice.transcript)
                      }
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        voice.isListening
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/15 border border-primary/50 text-primary hover:bg-primary/25"
                      }`}
                      aria-label={
                        voice.isListening ? "Arrêter la dictée" : "Démarrer la dictée"
                      }
                      disabled={!voice.supported}
                    >
                      {voice.isListening ? (
                        <MicOff className="w-7 h-7 relative z-10" />
                      ) : (
                        <Mic className="w-7 h-7 relative z-10" />
                      )}
                      <AnimatePresence>
                        {voice.isListening && (
                          <>
                            <motion.span
                              key="pulse-1"
                              aria-hidden
                              initial={{ scale: 1, opacity: 0.7 }}
                              animate={{ scale: 1.6, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              className="absolute inset-0 rounded-full bg-primary/50"
                            />
                            <motion.span
                              key="pulse-2"
                              aria-hidden
                              initial={{ scale: 1, opacity: 0.5 }}
                              animate={{ scale: 2.2, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: 0.3,
                              }}
                              className="absolute inset-0 rounded-full bg-primary/30"
                            />
                          </>
                        )}
                      </AnimatePresence>
                    </button>
                    <span className="mt-3 text-[10px] tracking-[0.2em] uppercase text-foreground/55">
                      {!voice.supported
                        ? "Indisponible sur ce navigateur"
                        : voice.isListening
                        ? "Écoute en cours…"
                        : voice.transcript
                        ? "Reprendre"
                        : "Démarrer la dictée"}
                    </span>
                  </div>

                  {/* Transcription */}
                  <div className="rounded-md border border-border/40 bg-foreground/[0.04] p-3 min-h-[80px] text-[13px] text-foreground/85 leading-relaxed">
                    {voice.transcript || (
                      <span className="text-foreground/40 italic">
                        Votre projet apparaîtra ici en direct…
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ---------- Choices / CTA en bas ---------- */}
            {mode !== "callback" && (
            <div className="border-t border-border/40 px-5 py-4 space-y-2 bg-card/30">
              {mode === "choices" && (
                <>
                  {currentStep?.cta && (
                    <motion.a
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      href={currentStep.cta.href}
                      target={currentStep.cta.href.endsWith(".pdf") ? "_blank" : undefined}
                      rel={currentStep.cta.href.endsWith(".pdf") ? "noreferrer" : undefined}
                      download={currentStep.cta.href.endsWith(".pdf") ? "" : undefined}
                      className="flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.2em] uppercase hover:glow-gold transition-shadow"
                    >
                      <span>{currentStep.cta.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>
                  )}
                  {currentStep?.choices?.map((c, i) => (
                    <motion.button
                      key={`${currentStep.id}-${i}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => onChoice(c)}
                      className="block w-full text-left text-[12px] px-3.5 py-2 rounded-sm border border-border/50 text-foreground/80 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      {c.label}
                    </motion.button>
                  ))}
                  {currentStep?.end && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/40">
                        <button
                          onClick={() => setBookingOpen(true)}
                          className="inline-flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold py-2 rounded-sm border border-primary/40 text-primary hover:bg-primary/10 transition-all"
                        >
                          <Calendar className="w-3 h-3" />
                          Créneau
                        </button>
                        <button
                          onClick={switchToCallback}
                          className="inline-flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold py-2 rounded-sm border border-primary/40 text-primary hover:bg-primary/10 transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          Rappel
                        </button>
                      </div>
                      <button
                        onClick={restart}
                        className="block w-full text-center text-[10px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors mt-2"
                      >
                        Recommencer la conversation
                      </button>
                    </>
                  )}
                </>
              )}

              {mode === "voice" && (
                <>
                  <button
                    onClick={sendVoiceToContact}
                    disabled={!voice.transcript.trim()}
                    className="flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.2em] uppercase hover:glow-gold transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Envoyer mon projet
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={voice.reset}
                    disabled={!voice.transcript}
                    className="block w-full text-center text-[10px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors mt-1 disabled:opacity-40"
                  >
                    Effacer
                  </button>
                </>
              )}
            </div>
            )}

            {/* ---------- Footer signature ---------- */}
            <div className="px-5 py-2.5 text-center border-t border-border/30 bg-background/60">
              <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/40">
                Greendome · concierge digital
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale agenda — partagée Concierge + Contact */}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </>
  );
};

export default Concierge;
