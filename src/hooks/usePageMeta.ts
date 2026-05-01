import { useEffect } from "react";

/**
 * usePageMeta — hook léger pour SEO par page (sans dépendance externe).
 *
 * Met à jour `document.title`, la meta description, og:title, og:description
 * et og:url à chaque navigation. Aucune lib (react-helmet ajoute ~5 KB gz),
 * et l'effet est synchrone côté client — Google indexe parfaitement les SPA
 * modernes via le rendu Chromium.
 *
 * Pour le rendu social (LinkedIn, WhatsApp, Twitter) il faut malgré tout
 * que les meta de base soient dans `index.html` — ce hook les surcharge à
 * chaud pour les utilisateurs et les moteurs qui exécutent JS (Google, Bing).
 */

const SITE_NAME = "GREENDOME";
const SITE_ORIGIN = "https://greendome.com";

type PageMeta = {
  /** Titre de l'onglet (sans le suffixe " — GREENDOME") */
  title: string;
  /** Description ≤ 160 caractères, optimisée pour les SERP */
  description: string;
  /** Chemin canonique (ex: "/contact") */
  path: string;
};

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = selector.match(/meta\[(\w+)="(.+?)"\]/) ?? [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export const usePageMeta = ({ title, description, path }: PageMeta) => {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const url = `${SITE_ORIGIN}${path.startsWith("/") ? path : "/" + path}`;

    document.title = fullTitle;

    setMeta(`meta[name="description"]`, "content", description);
    setMeta(`meta[property="og:title"]`, "content", fullTitle);
    setMeta(`meta[property="og:description"]`, "content", description);
    setMeta(`meta[property="og:url"]`, "content", url);
    setMeta(`meta[name="twitter:title"]`, "content", fullTitle);
    setMeta(`meta[name="twitter:description"]`, "content", description);
    setLink("canonical", url);
  }, [title, description, path]);
};
