"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "dektos-lang";

type Ctx = { lang: Lang; ready: boolean; setLang: (l: Lang) => void; toggle: () => void };
const LangContext = createContext<Ctx>({ lang: "zh", ready: false, setLang: () => {}, toggle: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");
  const [ready, setReady] = useState(false); // 已读出用户选的语言

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "zh" || saved === "en") setLangState(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(() => setLang(lang === "zh" ? "en" : "zh"), [lang, setLang]);

  return <LangContext.Provider value={{ lang, ready, setLang, toggle }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
