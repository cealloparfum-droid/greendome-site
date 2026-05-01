import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, MapPin, Download, Mic, MicOff, Sparkles, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useVoiceRecognition, readPitch, clearPitch, savePitch } from "@/lib/voice";
import { dispatch, toMailtoHref } from "@/lib/contact-mailer";

const profileOptions = [
  "Professionnel – Hôtel / Camping",
  "Professionnel – Restaurant",
  "Professionnel – Événementiel",
  "Particulier",
];

// Six contextes unifiés — alignés avec le visualiseur (cohérence site).
const projectOptions = [
  "Résidence privée",
  "Hôtel / Resort",
  "Glamping / Camping",
  "Restaurant / Réception",
  "Mariage / Événement",
  "Autre / À définir",
];

// Catalogue complet groupé par univers — couvre les 39 structures, le mobilier,
// les 8 jacuzzis et le décor. Pensé pour orienter sans noyer.
type ModelGroup = { label: string; options: string[] };
const modelGroups: ModelGroup[] = [
  {
    label: "Structures & Habitat",
    options: [
      "Pavillons & architecture (toiles tendues, vitrages)",
      "Safari & glamping (lodges, tentes safari, yourtes)",
      "Dômes & formes organiques (géodésique, bulle, cône)",
      "Tipis & tentes événementielles (mariages, réceptions)",
    ],
  },
  {
    label: "Mobilier d'extérieur",
    options: [
      "Canapés signature (bouclé, velours, courbe)",
      "Fauteuils & méridiennes",
      "Lits king & suites",
      "Tables, poufs & assises",
    ],
  },
  {
    label: "Spa & Jacuzzi",
    options: [
      "Jacuzzi carré (4-6 pers., jusqu'à 63 jets)",
      "Jacuzzi rond (4-5 pers., Ø 2,00 à 2,20 m)",
      "Jacuzzi octogonal (5-6 pers., 2,10 à 2,20 m)",
      "Jacuzzi sur-mesure / habillage signature",
    ],
  },
  {
    label: "Décor & Lumière",
    options: [
      "Tapis & textiles",
      "Lampadaires & luminaires",
      "Plantes & végétal d'intérieur",
    ],
  },
  {
    label: "Pack complet",
    options: [
      "Pack signature (structure + mobilier + spa)",
      "Conseil sur-mesure — j'hésite encore",
    ],
  },
];

const ContactPage = () => {
  usePageMeta({
    title: "Imaginons votre projet",
    description: "Racontez-nous votre vision, par écrit ou à la voix. Notre équipe revient vers vous avec une réponse pensée pour vous.",
    path: "/contact",
  });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile: "",
    project: "",
    model: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------------------------------------------------------
  // Dictée vocale — hook partagé useVoiceRecognition
  // ---------------------------------------------------------------
  const [voicePrefilled, setVoicePrefilled] = useState(false);
  const voice = useVoiceRecognition({
    onFinalize: (text) => savePitch(text),
  });

  // Synchronise la transcription en cours avec le champ message
  useEffect(() => {
    if (voice.isListening || voice.transcript) {
      setFormData((prev) => ({ ...prev, message: voice.transcript }));
    }
  }, [voice.transcript, voice.isListening]);

  // Au montage : si un pitch a été enregistré sur la home / le concierge, on le récupère
  useEffect(() => {
    const pitch = readPitch();
    if (pitch?.text) {
      setFormData((prev) => ({ ...prev, message: pitch.text }));
      setVoicePrefilled(true);
      // On nettoie pour ne pas re-pré-remplir lors d'une prochaine visite
      clearPitch();
    }
  }, []);

  const voiceSupported = voice.supported;
  const isListening = voice.isListening;

  const toggleVoice = () => {
    if (!voice.supported) {
      toast({
        title: "Dictée vocale indisponible",
        description: "Votre navigateur ne supporte pas encore la dictée. Essayez Chrome ou Safari.",
        variant: "destructive",
      });
      return;
    }
    if (voice.isListening) {
      voice.stop();
    } else {
      const ok = voice.start(formData.message);
      if (ok) {
        toast({ title: "À vous la parole", description: "Décrivez votre projet — nous transcrivons en direct." });
      }
    }
  };

  const [bookingOpen, setBookingOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastMailto, setLastMailto] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, profile, project, model, message } = formData;
    if (!name.trim() || !email.trim() || !profile || !message.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Email invalide", description: "Veuillez entrer une adresse email valide.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const subject = `[Greendome] Nouveau projet — ${name}`;
    const body = [
      `Bonjour,`,
      ``,
      `Voici les détails de mon projet :`,
      `• Nom : ${name}`,
      `• Email : ${email}`,
      `• Profil : ${profile}`,
      project ? `• Type de projet : ${project}` : null,
      model ? `• Modèle envisagé : ${model}` : null,
      ``,
      `Mon projet :`,
      message,
      ``,
      `Merci !`,
    ]
      .filter(Boolean)
      .join("\n");

    const item = await dispatch("contact-form", subject, body, {
      name,
      email,
      profile,
      project,
      model,
    });
    setLastMailto(toMailtoHref(item));
    setSubmitting(false);

    toast({ title: "Demande enregistrée !", description: "Notre équipe vous contactera dans les plus brefs délais." });
    setFormData({ name: "", email: "", profile: "", project: "", model: "", message: "" });
  };

  const selectClasses =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 md:py-28 pt-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="divider-gold mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Imaginons{" "}
              <span className="text-gradient-gold italic">votre projet</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/85 text-lg font-normal">
              Racontez-nous votre vision — par écrit ou simplement en parlant. Notre équipe revient vers vous avec une réponse pensée pour vous, jamais générique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Text + info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="divider-gold !mx-0 mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                Parlons de{" "}
                <span className="text-gradient-gold italic">votre projet</span>
              </h2>
              <p className="text-foreground/85 font-normal leading-relaxed mb-6">
                Que vous soyez un professionnel souhaitant créer un restaurant panoramique ou un village vacances, ou un particulier désirant sublimer sa villa, notre équipe est à votre disposition. Notre philosophie : concevoir avec soin, accompagner avec sincérité et écouter attentivement chacun de nos clients pour réaliser exactement ce dont vous avez besoin.
              </p>
              <p className="text-foreground/85 font-normal leading-relaxed mb-10">
                Nos experts reviennent vers vous rapidement pour vous accompagner, du choix du modèle jusqu'aux préconisations pour la dalle d'installation.
              </p>

              {/* Réservation de créneau — CTA premium */}
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="group w-full mb-8 flex items-center justify-between gap-3 px-5 py-4 rounded-sm border border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary/15 border border-primary/40 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] tracking-[0.22em] uppercase font-semibold text-primary">
                      Réserver un échange
                    </div>
                    <div className="text-[11px] text-foreground/65 mt-0.5">
                      30 minutes — gratuit, sans engagement
                    </div>
                  </div>
                </div>
                <span className="text-primary text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm surface-glass flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/80 text-sm">contact@dome.fr</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm surface-glass flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/80 text-sm">+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm surface-glass flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/80 text-sm">Paris, France</span>
                </div>
              </div>

              {/* Catalogues download */}
              <div className="mt-10 pt-8 border-t border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground tracking-wider uppercase">Catalogues 2026</span>
                </div>
                <p className="text-foreground/85 text-sm font-normal mb-5">
                  Téléchargez nos catalogues — dômes, jacuzzis et mobilier signature.
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Dômes", file: "/Greendome-Catalogue-Domes-2026.pdf" },
                    { label: "Jacuzzis", file: "/Greendome-Catalogue-Jacuzzis-2026.pdf" },
                    { label: "Mobilier", file: "/Greendome-Catalogue-Mobilier-2026.pdf" },
                  ].map((cat) => (
                    <Button key={cat.label} variant="outline" asChild className="gap-2 text-sm justify-start">
                      <a href={cat.file} download>
                        <Download className="w-4 h-4" />
                        Catalogue {cat.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatePresence>
                {voicePrefilled && (
                  <motion.div
                    key="prefill-banner"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5 flex items-start gap-3 px-4 py-3 rounded-sm border border-primary/40 bg-primary/10"
                  >
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 text-[12px] text-foreground/85 leading-relaxed">
                      <span className="font-semibold text-primary">Votre dictée a été récupérée.</span>{" "}
                      Vérifiez le résumé dans le champ « Votre projet », complétez vos coordonnées et envoyez.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, message: "" }));
                        setVoicePrefilled(false);
                      }}
                      className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 hover:text-primary transition-colors shrink-0"
                    >
                      Effacer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handleSubmit} className="surface-glass rounded-sm p-8 md:p-10 space-y-6">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom / Entreprise *</Label>
                    <Input id="name" name="name" placeholder="Votre nom ou entreprise" value={formData.name} onChange={handleChange} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} maxLength={255} />
                  </div>
                </div>

                {/* Profile */}
                <div className="space-y-2">
                  <Label htmlFor="profile">Votre profil *</Label>
                  <select id="profile" name="profile" value={formData.profile} onChange={handleChange} className={selectClasses}>
                    <option value="" disabled>Sélectionnez votre profil</option>
                    {profileOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Project type */}
                <div className="space-y-2">
                  <Label htmlFor="project">Type de projet</Label>
                  <select id="project" name="project" value={formData.project} onChange={handleChange} className={selectClasses}>
                    <option value="" disabled>Sélectionnez le type de projet</option>
                    {projectOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Model — groupé par univers, couvre tout le catalogue */}
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle envisagé</Label>
                  <select id="model" name="model" value={formData.model} onChange={handleChange} className={selectClasses}>
                    <option value="" disabled>Sélectionnez un modèle</option>
                    {modelGroups.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="text-[11px] text-foreground/55 leading-relaxed">
                    Tout notre catalogue est représenté — structures, mobilier, jacuzzis, décor.
                    Pas sûr·e ? Choisissez « Conseil sur-mesure », on vous guide.
                  </p>
                </div>

                {/* Message + dictée vocale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message">Votre projet *</Label>
                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={toggleVoice}
                        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[11px] font-semibold tracking-[0.2em] uppercase transition-all ${
                          isListening
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border/60 text-foreground/70 hover:border-primary/60 hover:text-primary"
                        }`}
                        aria-label={isListening ? "Arrêter la dictée" : "Démarrer la dictée vocale"}
                      >
                        <span className="relative inline-flex items-center justify-center w-4 h-4">
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          <AnimatePresence>
                            {isListening && (
                              <motion.span
                                key="pulse"
                                aria-hidden
                                initial={{ scale: 0.6, opacity: 0.7 }}
                                animate={{ scale: [0.6, 1.6, 0.6], opacity: [0.7, 0, 0.7] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full bg-primary/40"
                              />
                            )}
                          </AnimatePresence>
                        </span>
                        {isListening ? "Écoute en cours…" : "Dicter à voix"}
                      </button>
                    )}
                  </div>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Décrivez votre terrain, vos envies, votre calendrier — ou cliquez sur 'Dicter à voix'."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    maxLength={2000}
                  />
                  {voiceSupported && (
                    <p className="text-[11px] text-foreground/55 leading-relaxed">
                      Astuce — vous pouvez aussi nous parler&nbsp;: cliquez sur le micro et racontez votre projet à voix haute.
                      Nous le retranscrivons en direct dans le champ.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full gap-2 tracking-wider uppercase text-sm font-semibold disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Envoi…" : "Partager mon projet"}
                </Button>

                {/* Confirmation post-submit + relais mailto */}
                <AnimatePresence>
                  {lastMailto && (
                    <motion.div
                      key="post-submit"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex items-start gap-3 px-4 py-3 rounded-sm border border-primary/40 bg-primary/5 mt-4"
                    >
                      <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1 text-[12px] text-foreground/85 leading-relaxed">
                        <span className="font-semibold text-primary">Demande enregistrée.</span>{" "}
                        Pour confirmer immédiatement par email, cliquez ci-dessous.
                      </div>
                      <a
                        href={lastMailto}
                        className="text-[10px] tracking-[0.2em] uppercase text-primary hover:underline shrink-0 self-center"
                      >
                        Ouvrir le brouillon →
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modale agenda — partagée avec le Concierge */}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default ContactPage;
