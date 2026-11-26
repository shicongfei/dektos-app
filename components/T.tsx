"use client";

import { useLang } from "./LangProvider";
import { fmt, type Bi } from "@/lib/i18n";

/** 根据当前语言显示文字：<T t={ui.free} /> 或 <T zh="中文" en="English" /> */
export function T({
  t,
  zh,
  en,
  vars,
}: {
  t?: Bi;
  zh?: string;
  en?: string;
  vars?: Record<string, string | number>;
}) {
  const { lang } = useLang();
  const pair = t ?? { zh: zh ?? "", en: en ?? "" };
  // 英文暂缺时回退到中文
  const s = (lang === "en" ? pair.en || pair.zh : pair.zh || pair.en) ?? "";
  return <>{vars ? fmt(s, vars) : s}</>;
}
