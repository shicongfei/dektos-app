"use client";

import type { HexagramCard, Series, TextCard, Verse } from "@/lib/content";
import { refToZh } from "@/lib/bible-books";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { CardFooter, CardHeader, NoteBox, cardShell } from "./CardChrome";
import { HexGlyph } from "./HexLines";
import { Rich } from "./Rich";
import { T } from "./T";

/** 点睛分行：有换行就按换行；否则中文按「；？！」，英文在「人名：」前分行 */
function insightLines(text: string, lang: "zh" | "en") {
  const parts = text.includes("\n")
    ? text.split("\n")
    : lang === "zh"
      ? text.split(/(?<=[；？！])/)
      : text.split(/(?<=[.;?!](?:\*\*)?)\s+(?=(?:\*\*)?[A-Z][A-Za-z' ]{0,24}:)/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** 当前语言要显示的经文：英文卡片和中文卡片引用的经节可能不同 */
function versesFor(verses: Verse[], en: boolean) {
  const mine = verses.filter((v) => (en ? v.text_en : v.text_zh));
  const list = mine.length ? mine : verses;
  return list.map((v) => ({
    text: en ? v.text_en || v.text_zh : v.text_zh || v.text_en,
    ref: en ? v.ref_en || v.ref_zh : v.ref_zh || refToZh(v.ref_en),
  }));
}

/** 对照卡片：原文大字、注释框、圣经主题色块、对照点睛 */
export function CardView({ card, series, hexagram }: { card: TextCard; series: Series; hexagram?: HexagramCard | null }) {
  const { lang } = useLang();
  const en = lang === "en";

  const explanation = en ? card.translation_en : card.vernacular_zh;
  const insight = en ? card.insight_en || card.insight_zh : card.insight_zh || card.insight_en;
  const source = en ? card.source_en || card.source_zh : card.source_zh || card.source_en;
  const point = en ? card.point_en || card.point_zh : card.point_zh || card.point_en;
  const verses = versesFor(card.scripture, en);
  const glyphLabel = hexagram
    ? en
      ? card.lines_label_en || hexagram.short_en
      : card.lines_label_zh || hexagram.title_zh
    : "";

  return (
    <article className={cardShell}>
      <CardHeader card={card} series={series} hexagram={hexagram} />

      {/* 原文 */}
      <section className="flex gap-4 px-5 pb-5 pt-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] tracking-[0.2em] text-ink-soft">
            {en ? "ORIGINAL" : "原文"}
            {source && <span className={en ? "" : ""}> · {source}</span>}
          </p>
          <p className={`font-serif font-semibold leading-[1.6] tracking-wide text-ink ${card.original.length > 40 ? "text-[21px]" : hexagram ? "text-[24px]" : "text-[27px]"}`}>
            {card.original.split(/(?<=[；。！？])/).map((s, i) => (
              <span key={i} className="block">
                <Rich text={s} />
              </span>
            ))}
          </p>
        </div>
        {hexagram && (
          <HexGlyph yang={hexagram.lines.map((l) => l.yang)} highlight={card.highlight_lines} label={glyphLabel} />
        )}
      </section>

      {/* 白话 / 英译 */}
      <section className="mx-5 mb-5 border-t border-line pt-4">
        <p className="mb-1.5 text-[11px] tracking-[0.2em] text-ink-soft">
          {en ? (card.book === "huangdineijing" ? "TRANSLATION" : "TRANSLATION · JAMES LEGGE") : "白话"}
        </p>
        {explanation ? (
          <p className={`whitespace-pre-line text-[15px] leading-relaxed text-ink ${en && card.book !== "huangdineijing" ? "font-serif italic" : ""}`}>
            <Rich text={explanation} />
          </p>
        ) : (
          <p className="text-sm text-ink-soft">
            <T t={en ? ui.translationPending : ui.vernacularPending} />
          </p>
        )}
      </section>

      {/* 圣经：主题色块，可放多节 */}
      {verses.length > 0 && (
        <section className="bg-accent px-6 py-6 text-paper">
          <p className="mb-3 text-[11px] tracking-[0.25em] text-paper/70">
            <T t={ui.scripture} />
          </p>
          <div className={verses.length > 1 ? "space-y-2.5" : ""}>
            {verses.map((v, i) =>
              verses.length > 1 ? (
                <div key={i} className="flex items-baseline justify-between gap-3">
                  <p className={`whitespace-pre-line font-serif font-semibold leading-relaxed ${en ? "text-[15px]" : "text-[16px]"}`}>
                    <Rich text={v.text} emph="text-block-emph" />
                  </p>
                  {v.ref && <span className="shrink-0 text-[11px] text-paper/75">— {v.ref}</span>}
                </div>
              ) : (
                <figure key={i}>
                  <blockquote className={`whitespace-pre-line font-serif font-semibold leading-[1.8] ${en ? "text-[16px]" : "text-[18px]"}`}>
                    <Rich text={v.text} emph="text-block-emph" />
                  </blockquote>
                  {v.ref && <figcaption className="mt-2 text-right text-xs text-paper/75">— {v.ref}</figcaption>}
                </figure>
              ),
            )}
          </div>
        </section>
      )}

      {/* 对照点睛 */}
      {insight && (
        <section className="px-5 pb-2 pt-5">
          <p className="mb-2 text-[11px] tracking-[0.25em] text-ink-soft">
            <T t={ui.insight} />
          </p>
          <div className="space-y-1 font-serif text-[18px] font-semibold leading-relaxed text-ink">
            {insightLines(insight, lang).map((l, i) => (
              <p key={i}>
                <Rich text={l} />
              </p>
            ))}
          </div>
          {point && (
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {en ? "Key point: " : "对读点："}
              {point}
            </p>
          )}
        </section>
      )}

      {(card.note_zh || card.note_en) && (
        <div className="px-5 pt-3">
          <NoteBox zh={card.note_zh} en={card.note_en} />
        </div>
      )}

      <div className="h-5" />
      <CardFooter series={series} />
    </article>
  );
}
