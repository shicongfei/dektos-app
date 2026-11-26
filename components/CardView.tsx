"use client";

import type { Card } from "@/lib/content";
import { refToZh } from "@/lib/bible-books";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { Seal } from "./Seal";
import { T } from "./T";

/** 点睛分行：中文按「；」，英文按句号 */
function insightLines(text: string, lang: "zh" | "en") {
  const parts = lang === "zh" ? text.split(/(?<=；)/) : text.split(/(?<=\.)\s+/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** 对照卡片：米色底、原文大字、圣经深蓝色块、最下方对照点睛 */
export function CardView({ card, bookZh, bookEn }: { card: Card; bookZh: string; bookEn: string }) {
  const { lang } = useLang();
  const en = lang === "en";

  const explanation = en ? card.translation_en : card.vernacular_zh;
  const scripture = en ? card.scripture_en || card.scripture_zh : card.scripture_zh || card.scripture_en;
  const ref = en ? `${card.scripture_ref} (KJV)` : `${refToZh(card.scripture_ref)}（和合本）`;
  const insight = en ? card.insight_en || card.insight_zh : card.insight_zh || card.insight_en;

  return (
    <article className="overflow-hidden rounded-md border border-line bg-paper shadow-[0_1px_0_rgba(28,26,23,0.04),0_12px_32px_-18px_rgba(28,26,23,0.35)]">
      {/* 卡片抬头 */}
      <header className="flex items-center justify-between px-5 pt-5 text-[11px] tracking-[0.2em] text-ink-soft">
        <span>
          {en ? `${bookEn.toUpperCase()} · ${card.chapter}` : `${bookZh} · 第${card.chapter}章`}
        </span>
        <span className="font-serif tracking-[0.3em]">DEKTOS</span>
      </header>

      {/* 原文 */}
      <section className="px-6 pb-6 pt-8 text-center">
        <p className="font-serif text-[28px] font-semibold leading-[1.7] tracking-wide text-ink">
          {card.original.split(/(?<=[；。])/).map((s, i) => (
            <span key={i} className="block">
              {s}
            </span>
          ))}
        </p>
        <div className="mx-auto my-5 h-px w-10 bg-seal" />
        {explanation ? (
          <p className={`text-[15px] leading-relaxed text-ink-soft ${en ? "font-serif italic" : ""}`}>{explanation}</p>
        ) : (
          <p className="text-sm text-ink-soft/70">
            <T t={en ? ui.translationPending : ui.vernacularPending} />
          </p>
        )}
        {en && card.translation_en && <p className="mt-2 text-[11px] tracking-widest text-ink-soft">— JAMES LEGGE</p>}
      </section>

      {/* 圣经：深蓝色块 */}
      {scripture && (
        <section className="bg-navy px-6 py-7 text-paper">
          <p className="mb-3 text-[11px] tracking-[0.25em] text-navy-soft">
            <T t={ui.scripture} />
          </p>
          <p className={`font-serif leading-[1.85] ${en ? "text-[16px] italic" : "text-[18px]"}`}>{scripture}</p>
          <p className="mt-4 text-right text-xs text-navy-soft">— {ref}</p>
        </section>
      )}

      {/* 对照点睛 */}
      {insight && (
        <section className="px-6 py-7">
          <p className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.25em] text-seal">
            <span className="inline-block h-2.5 w-2.5 bg-seal" />
            <T t={ui.insight} />
          </p>
          <div className="space-y-1.5 font-serif text-[19px] font-semibold leading-relaxed text-ink">
            {insightLines(insight, lang).map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </section>
      )}

      <footer className="flex items-center justify-end gap-2 border-t border-line/70 px-5 py-3">
        <span className="font-serif text-[11px] tracking-[0.3em] text-ink-soft">以经解经 · 东西对读</span>
        <Seal size={22} />
      </footer>
    </article>
  );
}
