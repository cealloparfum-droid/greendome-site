/**
 * ConciergeCallback — mini-formulaire "On vous rappelle" dans le panneau Concierge.
 *
 * S'affiche quand la conversation arrive à un step `end: true`, ou quand
 * l'utilisateur clique sur "Demander à être rappelé". Trois champs courts —
 * prénom, téléphone, créneau préféré (matin / après-midi / soir).
 *
 * Soumission via lib/contact-mailer (queue localStorage + mailto fallback).
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Check, ArrowRight } from "lucide-react";
import { dispatch, toMailtoHref } from "@/lib/contact-mailer";
import { readPitch } from "@/lib/voice";

const SLOTS = [
  { id: "morning", label: "Matin" },
  { id: "afternoon", label: "Après-midi" },
  { id: "evening", label: "Soir" },
] as const;

type Props = {
  /** Permet à un parent de réagir à la fermeture / réinitialisation. */
  onClose?: () => void;
};

const ConciergeCallback = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<typeof SLOTS[number]["id"]>("afternoon");
  const [stage, setStage] = useState<"form" | "done">("form");
  const [submitting, setSubmitting] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  const slotLabel = (id: string) => SLOTS.find((s) => s.id === id)?.label ?? id;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    const pitch = readPitch();
    const subject = `[Greendome] Demande de rappel — ${name}`;
    const body = [
      `Bonjour,`,
      ``,
      `Je souhaite être rappelé(e) par votre équipe :`,
      `• Nom : ${name}`,
      `• Téléphone : ${phone}`,
      `• Créneau préféré : ${slotLabel(slot)}`,
      ``,
      pitch?.text ? `Mon projet : ${pitch.text}` : null,
      ``,
      `Merci !`,
    ]
      .filter(Boolean)
      .join("\n");

    const item = await dispatch("concierge-callback", subject, body, {
      name,
      phone,
      slot,
    });
    setMailtoHref(toMailtoHref(item));
    setSubmitting(false);
    setStage("done");
  };

  return (
    <div className="rounded-sm border border-primary/30 bg-primary/[0.04] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Phone className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] tracking-[0.22em] uppercase text-primary font-semibold">
          On vous rappelle
        </span>
      </div>

      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.form
            key="cb-form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              className="w-full px-3 py-2 rounded-sm border border-border/50 bg-background/70 text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre téléphone"
              className="w-full px-3 py-2 rounded-sm border border-border/50 bg-background/70 text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
            <div className="flex gap-1.5">
              {SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlot(s.id)}
                  className={`flex-1 text-[10px] tracking-[0.18em] uppercase font-semibold py-2 rounded-sm transition-all ${
                    slot === s.id
                      ? "bg-primary/90 text-primary-foreground"
                      : "border border-border/50 text-foreground/65 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !phone.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.2em] uppercase hover:glow-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Envoi…" : (
                <>
                  Demander un rappel
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </motion.form>
        )}

        {stage === "done" && (
          <motion.div
            key="cb-done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="text-center py-2 space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/50 flex items-center justify-center mx-auto">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[12px] text-foreground/85 leading-relaxed">
              Nous vous rappelons{" "}
              <span className="text-primary font-semibold">{slotLabel(slot).toLowerCase()}</span>.
            </p>
            {mailtoHref && (
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-primary/85 hover:text-primary transition-colors"
              >
                Confirmer aussi par mail
              </a>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="block w-full text-[10px] tracking-[0.22em] uppercase text-foreground/55 hover:text-primary transition-colors"
              >
                Revenir au début
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConciergeCallback;
