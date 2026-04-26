import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const profileOptions = [
  "Professionnel – Hôtel / Camping",
  "Professionnel – Restaurant",
  "Professionnel – Événementiel",
  "Particulier",
];

const projectOptions = [
  "Hébergement (B&B / Glamping)",
  "Espace repas",
  "Espace détente / Bien-être",
];

const modelOptions = [
  "Dôme rond (2 à 22 personnes)",
  "Dôme ovale (jusqu'à 32 personnes)",
  "Système combiné (Suite)",
];

const ContactPage = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, profile, message } = formData;
    if (!name.trim() || !email.trim() || !profile || !message.trim()) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Email invalide", description: "Veuillez entrer une adresse email valide.", variant: "destructive" });
      return;
    }

    toast({ title: "Demande envoyée !", description: "Notre équipe vous contactera dans les plus brefs délais." });
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
              Contact &{" "}
              <span className="text-gradient-gold italic">Demande de Devis</span>
            </h1>
            <p className="max-w-2xl mx-auto text-foreground/60 text-lg font-light">
              Prêt à briser les frontières architecturales traditionnelles et à donner vie à votre projet ?
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
              <p className="text-foreground/70 font-light leading-relaxed mb-6">
                Que vous soyez un professionnel souhaitant créer un restaurant panoramique, un village vacances, ou un particulier désirant sublimer sa villa, notre équipe est à votre disposition. Nous avons pour philosophie de concevoir avec soin, de fournir un service sincère et d'écouter attentivement la voix de chaque client pour créer exactement ce dont vous avez besoin.
              </p>
              <p className="text-foreground/70 font-light leading-relaxed mb-10">
                Nos experts reviendront vers vous rapidement pour vous accompagner, du choix du modèle jusqu'aux recommandations pour la plateforme d'installation.
              </p>

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

              {/* Catalogue download */}
              <div className="mt-10 pt-8 border-t border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground tracking-wider uppercase">Catalogue</span>
                </div>
                <p className="text-foreground/60 text-sm font-light mb-4">
                  Téléchargez notre catalogue complet avec tous nos modèles et spécifications.
                </p>
                <Button variant="outline" asChild className="gap-2 text-sm">
                  <a href="/catalogue_greendome.pdf" download>
                    <Download className="w-4 h-4" />
                    Télécharger le catalogue
                  </a>
                </Button>
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

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle envisagé</Label>
                  <select id="model" name="model" value={formData.model} onChange={handleChange} className={selectClasses}>
                    <option value="" disabled>Sélectionnez un modèle</option>
                    {modelOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" placeholder="Décrivez votre terrain et vos envies..." value={formData.message} onChange={handleChange} rows={5} maxLength={2000} />
                </div>

                <Button type="submit" className="w-full gap-2 tracking-wider uppercase text-sm font-semibold">
                  <Send className="w-4 h-4" />
                  Envoyer ma demande
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
