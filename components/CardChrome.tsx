"use client";

import type { Card, Series } from "@/lib/content";
import { useLang } from "./LangProvider";
import { Seal } from "./Seal";

/** 卡片抬头：书名 · 第几章，右边「1 / 81」 */
export function CardHeader({ card, series }: { card: Card; series: Series }) {
  const { lang } = useLang();
  const label =
    lang === "en"
      ? `${series.title_en.toUpperCase()} · ${series.unit_en.toUpperCase()} ${card.chapter}`
      : `${series.title_zh} · 第${card.chapter}${series.unit_zh}`;
  return (
    <header className="flex items-center justify-between px-5 pt-5 text-[11px] tracking-[0.2em] text-ink-soft">
      <span>{label}</span>
      {card.series_index && card.series_total ? (
        <span className="font-serif text-xs tracking-[0.15em] text-accent">
          {card.series_index} / {card.series_total}
        </span>
      ) : null}
    </header>
  );
}

/** 卡片底部：logo + 子品牌 + dektos.org */
export function CardFooter({ series }: { series: Series }) {
  const { lang } = useLang();
  return (
    <footer className="flex items-center gap-2.5 border-t border-line/70 px-5 py-3.5">
      <Seal size={34} />
      <span className="font-serif text-[13px] font-semibold tracking-[0.12em] text-ink">
        {lang === "en" ? series.brand_en : series.brand_zh}
      </span>
      <span className="ml-auto text-[11px] tracking-[0.15em] text-ink-soft">dektos.org</span>
    </footer>
  );
}

export const cardShell =
  "overflow-hidden rounded-md border border-line bg-paper shadow-[0_1px_0_rgba(31,36,48,0.04),0_12px_32px_-18px_rgba(31,36,48,0.35)]";
