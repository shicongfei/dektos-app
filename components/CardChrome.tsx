"use client";

import type { Card, HexagramCard, Series } from "@/lib/content";
import { cn } from "@/lib/numerals";
import { useLang } from "./LangProvider";
import { Seal } from "./Seal";

function headerLabel(card: Card, series: Series, hex: HexagramCard | null, en: boolean) {
  const n = card.chapter;
  switch (card.book) {
    case "yijing":
      if (card.type === "hexagram") return en ? "I CHING × THE BIBLE" : "易经 × 圣经";
      if (hex) return en ? `I CHING · ${hex.short_en.split(" · ")[0].toUpperCase()}` : `易经 · ${hex.name_zh}卦`;
      return en ? `I CHING · HEXAGRAM ${n}` : `易经 · 第${cn(n)}卦`;
    case "huangdineijing":
      return en ? `HUANGDI NEIJING · SUWEN · CH. ${n}` : `黄帝内经 · 素问 · 第${cn(n)}篇`;
    default:
      return en ? `${series.title_en.toUpperCase()} · CHAPTER ${n}` : `${series.title_zh} · 第${cn(n)}${series.unit_zh}`;
  }
}

/** 卡片抬头：书名 · 第几章，右边「1 / 81」 */
export function CardHeader({ card, series, hexagram }: { card: Card; series: Series; hexagram?: HexagramCard | null }) {
  const { lang } = useLang();
  const en = lang === "en";
  const pad = (x: number) => (card.book === "yijing" ? String(x).padStart(2, "0") : String(x));
  let right: string | null = null;
  if (card.type === "hexagram" && card.series_total) right = en ? `${card.series_total} CARDS` : `共 ${card.series_total} 张`;
  else if (card.series_index && card.series_total) right = `${pad(card.series_index)} / ${pad(card.series_total)}`;

  return (
    <header className="flex items-center justify-between gap-3 px-5 pt-5 text-[11px] tracking-[0.2em] text-ink-soft">
      <span>{headerLabel(card, series, hexagram ?? null, en)}</span>
      {right && <span className="shrink-0 font-serif text-xs tracking-[0.15em] text-accent">{right}</span>}
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

/** 注释框（注 / Note） */
export function NoteBox({ zh, en }: { zh: string; en: string }) {
  const { lang } = useLang();
  const text = lang === "en" ? en || zh : zh || en;
  if (!text) return null;
  return (
    <p className="rounded-sm bg-note px-4 py-3 text-[14px] leading-relaxed text-ink">
      <span className="mr-1 font-semibold text-accent">{lang === "en" ? "Note:" : "注："}</span>
      {text}
    </p>
  );
}

export const cardShell =
  "overflow-hidden rounded-md border border-line bg-paper shadow-[0_1px_0_rgba(31,36,48,0.04),0_12px_32px_-18px_rgba(31,36,48,0.35)]";
