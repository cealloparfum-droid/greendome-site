/**
 * Petit utilitaire — Web Speech API (dictée vocale)
 *
 * Centralise la création d'un SpeechRecognition fr-FR, le pont avec localStorage,
 * et expose un hook React `useVoiceRecognition` pour ne pas dupliquer la logique
 * entre Contact, Concierge et VoiceProjectPitch.
 */

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "greendome.projectPitch";

export type StoredPitch = {
  text: string;
  ts: number; // timestamp ms
};

export const savePitch = (text: string) => {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredPitch = { text: text.trim(), ts: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
};

export const readPitch = (): StoredPitch | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPitch;
    if (!parsed?.text) return null;
    // Expire au bout de 24 h pour ne pas pré-remplir un projet ancien
    if (Date.now() - parsed.ts > 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearPitch = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
};

// ---------------------------------------------------------------
// Hook React — useVoiceRecognition
// ---------------------------------------------------------------
type UseVoiceOpts = {
  onFinalize?: (text: string) => void;
};

export const useVoiceRecognition = (opts: UseVoiceOpts = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const baseRef = useRef("");
  const onFinalizeRef = useRef(opts.onFinalize);

  useEffect(() => {
    onFinalizeRef.current = opts.onFinalize;
  }, [opts.onFinalize]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);

    const rec = new SR();
    rec.lang = "fr-FR";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      const base = baseRef.current;
      const combined = (
        base +
        (base && (finalText || interimText) ? " " : "") +
        finalText +
        interimText
      ).trim();
      setTranscript(combined);
      if (finalText) {
        baseRef.current = (base + (base ? " " : "") + finalText).trim();
      }
    };

    rec.onend = () => {
      setIsListening(false);
      const finalText = baseRef.current.trim();
      if (finalText) onFinalizeRef.current?.(finalText);
    };
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch { /* noop */ }
    };
  }, []);

  const start = (initial: string = "") => {
    const rec = recognitionRef.current;
    if (!rec) return false;
    baseRef.current = initial;
    setTranscript(initial);
    try {
      rec.start();
      setIsListening(true);
      return true;
    } catch {
      return false;
    }
  };

  const stop = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try { rec.stop(); } catch { /* noop */ }
    setIsListening(false);
  };

  const reset = () => {
    baseRef.current = "";
    setTranscript("");
  };

  return { supported, isListening, transcript, start, stop, reset };
};
