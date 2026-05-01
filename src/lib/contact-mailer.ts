/**
 * contact-mailer — couche d'abstraction pour les "envois" formulaires.
 *
 * Tant qu'aucun backend n'est branché, on simule l'envoi côté frontend :
 *   1. On ajoute le payload dans une queue localStorage (auditable + récupérable).
 *   2. On expose un fallback `mailto:` qui ouvre la messagerie native du
 *      visiteur, pré-remplie — fonctionne partout, ne nécessite aucun secret.
 *
 * Quand l'adresse mail définitive sera créée, il suffira de changer
 * `CONTACT_EMAIL` ci-dessous, ou de remplacer `dispatch()` par un fetch
 * vers Resend / Formspree / l'API maison.
 */

const QUEUE_KEY = "greendome.outbox";

/**
 * Adresse de dépannage. Le `?` final est intentionnel : tant qu'aucune adresse
 * n'a été fournie, le `mailto:` ouvrira un brouillon SANS destinataire — le
 * visiteur peut alors saisir/coller la bonne adresse, ou simplement copier le
 * contenu. Aucune fuite, aucun envoi accidentel à un tiers.
 */
export const CONTACT_EMAIL = "";

export type Channel =
  | "contact-form"
  | "concierge-callback"
  | "concierge-pitch"
  | "booking-request";

export type OutboxItem = {
  id: string;
  ts: number;
  channel: Channel;
  subject: string;
  body: string;
  meta?: Record<string, string | undefined>;
};

const safeWindow = () => (typeof window === "undefined" ? null : window);

const readQueue = (): OutboxItem[] => {
  const w = safeWindow();
  if (!w) return [];
  try {
    const raw = w.localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeQueue = (items: OutboxItem[]) => {
  const w = safeWindow();
  if (!w) return;
  try {
    // Cap à 50 entrées pour ne pas saturer le localStorage
    const trimmed = items.slice(-50);
    w.localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
  } catch {
    /* noop */
  }
};

/** Enfile un envoi dans la queue locale. Retourne l'item créé. */
export const enqueueOutbox = (
  channel: Channel,
  subject: string,
  body: string,
  meta?: OutboxItem["meta"],
): OutboxItem => {
  const item: OutboxItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    channel,
    subject,
    body,
    meta,
  };
  const q = readQueue();
  q.push(item);
  writeQueue(q);
  return item;
};

export const listOutbox = (): OutboxItem[] => readQueue();

export const clearOutbox = () => writeQueue([]);

/**
 * Construit une URL `mailto:` valide à partir d'un OutboxItem.
 * Si CONTACT_EMAIL est vide, le `to:` est laissé vide — l'utilisateur saisit
 * lui-même l'adresse dans son client mail. Pratique pour le mode dépannage.
 */
export const toMailtoHref = (item: OutboxItem): string => {
  const params = new URLSearchParams({
    subject: item.subject,
    body: item.body,
  });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
};

/**
 * Envoi "officiel" (pour l'instant : enqueue + retourne item).
 * À terme : fetch vers /api/contact ou Resend.
 */
export const dispatch = async (
  channel: Channel,
  subject: string,
  body: string,
  meta?: OutboxItem["meta"],
): Promise<OutboxItem> => {
  // Petite latence simulée pour que la transition UI semble crédible.
  await new Promise((r) => setTimeout(r, 450));
  return enqueueOutbox(channel, subject, body, meta);
};
