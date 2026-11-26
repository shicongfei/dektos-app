"use client";

import { useEffect, useState } from "react";
import type { DailyVerse } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { T } from "./T";

/** 按日期轮换「今日一句」 */
function dayIndex(len: number) {
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), 0, 0);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - start) / 86400000) % len;
}

export function DailyCard({ verses }: { verses: DailyVerse[] }) {
  const { lang } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => setI(dayIndex(verses.length)), [verses.length]);
  const v = verses[i];
  if (!v) return null;

  const date = new Date().toLocaleDateString(lang === "zh" ? "zh-CN" : "en-GB", {
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-md border border-line bg-white/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-ink">
          <span className="inline-block h-3 w-3 bg-accent" />
          <T t={ui.todayVerse} />
        </h2>
        <span className="text-xs text-ink-soft" suppressHydrationWarning>
          {date}
        </span>
      </div>

      <figure>
        <blockquote className="font-serif text-xl leading-relaxed text-ink">{v.classic_zh}</blockquote>
        {lang === "en" && v.classic_en && <p className="mt-1 text-sm italic text-ink-soft">{v.classic_en}</p>}
        <figcaption className="mt-2 text-xs text-ink-soft">
          — <T zh={v.classic_ref_zh} en={v.classic_ref_en} />
        </figcaption>
      </figure>

      <div className="my-4 flex items-center gap-3 text-accent">
        <span className="h-px flex-1 bg-line" />
        <span className="font-serif text-sm">对 读</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <figure>
        <blockquote className={`text-ink ${lang === "zh" ? "font-serif text-lg leading-relaxed" : "font-serif text-base italic leading-relaxed"}`}>
          {lang === "zh" ? v.bible_cuv : v.bible_kjv}
        </blockquote>
        <figcaption className="mt-2 text-xs text-ink-soft">
          — <T zh={`${v.bible_ref_zh}（和合本）`} en={`${v.bible_ref_en} (KJV)`} />
        </figcaption>
      </figure>
    </section>
  );
}
