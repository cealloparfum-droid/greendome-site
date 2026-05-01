/**
 * BookingDialog — modale de réservation de créneau (Concierge + Contact).
 *
 * Pas de backend pour l'instant. On affiche un calendrier maison sur 7 jours
 * (lun → dim), avec créneaux 30 min de 9h à 19h. À la sélection :
 *   - on enqueue dans la queue contact-mailer
 *   - on offre un fallback mailto:
 *
 * Style : surface-glass dorée, animations Framer Motion, pas d'iframe externe.
 * Le jour où tu connectes Cal.com, tu remplaces juste le `confirm()` ci-dessous.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, Check, Phone, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { dispatch, toMailtoHref } from "@/lib/contact-mailer";
import { readPitch } from "@/lib/voice";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Bouton trigger optionnel — si tu utilises Dialog en contrôlé, ignore. */
  trigger?: React.ReactNode;
};

const SLOTS = [
  "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const monthNames = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

const buildNextDays = (n: number) => {
  const out: Date[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
};

const fmtKey = (d: Date) =>
  `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;

const fmtLong = (d: Date) =>
  `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`;

const BookingDialog = ({ open, onOpenChange }: Props) => {
  const days = useMemo(() => buildNextDays(7), []);
  const [selectedDay, setSelectedDay] = useState<string>(fmtKey(days[1])); // demain par défaut
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"pick" | "details" | "done">("pick");
  const [submitting, setSubmitting] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  const reset = () => {
    setSelectedSlot(null);
    setName("");
    setPhone("");
    setEmail("");
    setStage("pick");
    setMailtoHref(null);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      // Reset au close pour la prochaine ouverture
      setTimeout(reset, 250);
    }
    onOpenChange(v);
  };

  const onSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setStage("details");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name.trim() || (!phone.trim() && !email.trim())) return;
    setSubmitting(true);
    const dayObj = days.find((d) => fmtKey(d) === selectedDay)!;
    const pitch = readPitch();
    const subject = `[Greendome] Demande de rendez-vous — ${fmtLong(dayObj)} à ${selectedSlot}`;
    const body = [
      `Bonjour,`,
      ``,
      `Je souhaite réserver un échange avec votre équipe :`,
      `• Date : ${fmtLong(dayObj)}`,
      `• Heure : ${selectedSlot}`,
      `• Nom : ${name}`,
      phone ? `• Téléphone : ${phone}` : null,
      email ? `• Email : ${email}` : null,
      ``,
      pitch?.text ? `Mon projet : ${pitch.text}` : null,
      ``,
      `Merci !`,
    ]
      .filter(Boolean)
      .join("\n");

    const item = await dispatch("booking-request", subject, body, {
      day: fmtKey(dayObj),
      slot: selectedSlot,
      name,
      phone,
      email,
    });
    setMailtoHref(toMailtoHref(item));
    setSubmitting(false);
    setStage("done");
  };

  const selectedDayObj = days.find((d) => fmtKey(d) === selectedDay)!;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[88vh] overflow-y-auto surface-glass border-primary/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-sm bg-primary/15 border border-primary/40 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display tracking-wide">
                Réserver un échange
              </DialogTitle>
              <DialogDescription className="text-[11px] tracking-[0.18em] uppercase text-foreground/55 mt-0.5">
                30 minutes — gratuit, sans engagement
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* ---------- ETAPE 1 — choisir un créneau ---------- */}
          {stage === "pick" && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Bandeau jours — 7 cartes compactes, scroll horizontal en sécurité */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
                {days.map((d) => {
                  const key = fmtKey(d);
                  const active = key === selectedDay;
                  const isToday = fmtKey(new Date()) === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDay(key)}
                      className={`shrink-0 snap-start flex-1 min-w-[60px] sm:min-w-0 sm:basis-0 py-2 px-1 rounded-sm text-center transition-all ${
                        active
                          ? "bg-primary/90 text-primary-foreground"
                          : "border border-border/50 text-foreground/70 hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <div className="text-[8px] tracking-[0.18em] uppercase opacity-80 leading-tight">
                        {isToday ? "Auj." : dayNames[d.getDay()]}
                      </div>
                      <div className="text-base font-display font-semibold leading-none mt-1">
                        {d.getDate()}
                      </div>
                      <div className="text-[8px] tracking-[0.16em] uppercase opacity-70 mt-0.5 leading-tight">
                        {monthNames[d.getMonth()]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Slots */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] tracking-[0.25em] uppercase text-primary font-semibold">
                    Créneaux — {fmtLong(selectedDayObj)}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => onSlotClick(slot)}
                      className="px-2 py-2 rounded-sm border border-border/50 text-[12px] font-display text-foreground/85 hover:border-primary/60 hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-foreground/55 leading-relaxed">
                Tous les créneaux sont indicatifs — l'équipe Greendome confirme par mail
                ou par téléphone dans la journée.
              </p>
            </motion.div>
          )}

          {/* ---------- ETAPE 2 — coordonnées ---------- */}
          {stage === "details" && (
            <motion.form
              key="details"
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="rounded-sm border border-primary/30 bg-primary/5 px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[12px] text-foreground/85">
                    {fmtLong(selectedDayObj)} — <span className="text-primary font-semibold">{selectedSlot}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStage("pick")}
                  className="text-[10px] tracking-[0.18em] uppercase text-foreground/55 hover:text-primary transition-colors"
                >
                  Modifier
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="bk-name" className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold">
                  Votre nom *
                </label>
                <input
                  id="bk-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  placeholder="Prénom Nom ou société"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="bk-phone" className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold">
                    Téléphone
                  </label>
                  <input
                    id="bk-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bk-email" className="text-[10px] tracking-[0.22em] uppercase text-foreground/65 font-semibold">
                    Email
                  </label>
                  <input
                    id="bk-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-border/50 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    placeholder="vous@email.com"
                  />
                </div>
              </div>

              <p className="text-[10px] text-foreground/55">
                Au moins un téléphone ou un email — pour la confirmation du rendez-vous.
              </p>

              <button
                type="submit"
                disabled={submitting || !name.trim() || (!phone.trim() && !email.trim())}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-sm hover:glow-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Envoi…" : (
                  <>
                    Confirmer le rendez-vous
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* ---------- ETAPE 3 — confirmation ---------- */}
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
                  Nous revenons vers vous pour confirmer le créneau du{" "}
                  <span className="text-primary font-semibold">
                    {fmtLong(selectedDayObj)} à {selectedSlot}
                  </span>
                  .
                </p>
              </div>

              {mailtoHref && (
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-primary/85 hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Envoyer aussi par email
                </a>
              )}

              <button
                onClick={() => handleClose(false)}
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

export default BookingDialog;
