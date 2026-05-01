/**
 * VoiceProjectPitch — bloc immersif "Racontez-nous votre projet en 30 secondes"
 *
 * S'intègre sur la homepage. Un gros bouton micro central, une transcription en
 * direct, et un CTA qui pré-remplit le formulaire Contact via localStorage.
 *
 * Pas de backend — la transcription reste locale (Web Speech API).
 */

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceRecognition, savePitch } from "@/lib/voice";

const VoiceProjectPitch = () => {
  const navigate = useNavigate();
  const voice = useVoiceRecognition({
    onFinalize: (text) => savePitch(text),
  });

  const handleSend = () => {
    const text = voice.transcript.trim();
    if (!text) return;
    savePitch(text);
    if (voice.isListening) voice.stop();
    navigate("/contact");
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden border-t border-border/40">
      {/* Halo doré derrière la section */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[900px] aspect-square rounded-full bg-primary/[0.07] blur-3xl"
      />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs text-primary tracking-[0.3em] uppercase font-semibold">
              Racontez-nous
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-5 mb-5 leading-tight">
              Décrivez votre projet en{" "}
              <span className="text-gradient-gold italic">trente secondes</span>
            </h2>
            <p className="text-foreground/85 text-base md:text-lg font-normal leading-relaxed mb-12 max-w-xl mx-auto">
              Pas de formulaire à remplir. Cliquez sur le micro et parlez —
              terrain, ambiance, capacité, calendrier. On vous rappelle avec
              une réponse pensée pour vous.
            </p>
          </motion.div>

          {/* ----- Bouton micro ----- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <button
              onClick={() =>
                voice.isListening ? voice.stop() : voice.start(voice.transcript)
              }
              disabled={!voice.supported}
              aria-label={
                voice.isListening ? "Arrêter la dictée" : "Démarrer la dictée"
              }
              className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all ${
                voice.isListening
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/15 border border-primary/50 text-primary hover:bg-primary/25 hover:scale-[1.04]"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {/* Halo permanent */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
              />
              {voice.isListening ? (
                <MicOff className="w-12 h-12 md:w-14 md:h-14 relative z-10" />
              ) : (
                <Mic className="w-12 h-12 md:w-14 md:h-14 relative z-10" />
              )}
              {/* Ondes pulsantes en écoute */}
              <AnimatePresence>
                {voice.isListening && (
                  <>
                    <motion.span
                      key="ring-1"
                      aria-hidden
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.7, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                    />
                    <motion.span
                      key="ring-2"
                      aria-hidden
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.4,
                      }}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                    />
                  </>
                )}
              </AnimatePresence>
            </button>
            <span className="mt-5 text-[11px] tracking-[0.3em] uppercase text-foreground/65 font-semibold">
              {!voice.supported
                ? "Dictée indisponible — utilisez Chrome ou Safari"
                : voice.isListening
                ? "Écoute en cours…"
                : voice.transcript
                ? "Cliquez pour reprendre"
                : "Cliquez et parlez"}
            </span>
          </motion.div>

          {/* ----- Transcription ----- */}
          <AnimatePresence>
            {(voice.transcript || voice.isListening) && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 12, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-10 overflow-hidden"
              >
                <div className="surface-glass rounded-md p-6 md:p-7 max-w-2xl mx-auto text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-primary font-semibold">
                      {voice.isListening ? "Transcription en direct" : "Votre projet"}
                    </span>
                  </div>
                  <p className="text-foreground/85 text-sm md:text-base leading-relaxed">
                    {voice.transcript ||
                      "Parlez librement, je transcris au fur et à mesure…"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ----- CTA d'envoi ----- */}
          <AnimatePresence>
            {voice.transcript.trim() && !voice.isListening && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={handleSend}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-sm hover:glow-gold transition-all"
                >
                  <Send className="w-4 h-4" />
                  Envoyer mon projet
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={voice.reset}
                  className="text-[11px] tracking-[0.25em] uppercase text-foreground/55 hover:text-primary transition-colors"
                >
                  Recommencer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default VoiceProjectPitch;
