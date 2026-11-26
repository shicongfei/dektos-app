"use client";

import type { Series, TextCard } from "@/lib/content";
import { refToZh } from "@/lib/bible-books";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { CardFooter, CardHeader, cardShell } from "./CardChrome";
import { Rich } from "./Rich";
import { T } from "./T";

/** 点睛分行：中文按「；」，英文按句号 */
function insightLines(text: string, lang: "zh" | "en") {
  const parts = lang === "zh" ? text.split(/(?<=；)/) : text.split(/(?<=\.)\s+/);
  return parts.map((s) => s.trim()).filter(Boolean);
}

/** 对照卡片：原文大字、注释框、圣经主题色块、最下方对照点睛 */
export function CardView({ card, series }: { card: TextCard; series: Series }) {
  const { lang } = useLang();
  const en = lang === "en";

  const explanation = en ? card.translation_en : card.vernacular_zh;
  const insight = en ? card.insight_en || card.insight_zh : card.insight_zh || card.insight_en;

  return (
    <article className={cardShell}>
      <CardHeader card={card} series={series} />

      {/* 原文 */}
      <section className="px-6 pb-6 pt-8 text-center">
        <p className="font-serif text-[28px] font-semibold leading-[1.7] tracking-wide text-ink">
          {card.original.split(/(?<=[；。！？])/).map((s, i) => (
            <span key={i} className="block">
              <Rich text={s} />
            </span>
          ))}
        </p>
      </section>

      {/* 注释框：白话 / Legge */}
      <section className="mx-5 mb-6 rounded-sm bg-note px-5 py-4">
        {explanation ? (
          <p className={`text-[15px] leading-relaxed text-ink ${en ? "font-serif italic" : ""}`}>
            <Rich text={explanation} />
          </p>
        ) : (
          <p className="text-sm text-ink-soft">
            <T t={en ? ui.translationPending : ui.vernacularPending} />
          </p>
        )}
        {en && card.translation_en && <p className="mt-2 text-right text-[11px] tracking-widest text-ink-soft">— JAMES LEGGE</p>}
      </section>

      {/* 圣经：主题色块，可放多节 */}
      {card.scripture.length > 0 && (
        <section className="bg-accent px-6 py-7 text-paper">
          <p className="mb-4 text-[11px] tracking-[0.25em] text-paper/70">
            <T t={ui.scripture} />
          </p>
          <div className="space-y-5">
            {card.scripture.map((v, i) => {
              const text = en ? v.text_en || v.text_zh : v.text_zh || v.text_en;
              const ref = en ? v.ref_en : v.ref_zh || refToZh(v.ref_en);
              return (
                <figure key={i}>
                  <blockquote className={`font-serif leading-[1.85] ${en ? "text-[16px] italic" : "text-[18px]"}`}>
                    <Rich text={text} emph="text-block-emph not-italic" />
                  </blockquote>
                  {ref && <figcaption className="mt-2 text-right text-xs text-paper/75">— {ref}</figcaption>}
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {/* 对照点睛 */}
      {insight && (
        <section className="px-6 py-7">
          <p className="mb-3 flex items-center gap-2 text-[11px] tracking-[0.25em] text-accent">
            <span className="inline-block h-2.5 w-2.5 bg-accent" />
            <T t={ui.insight} />
          </p>
          <div className="space-y-1.5 font-serif text-[19px] font-semibold leading-relaxed text-ink">
            {insightLines(insight, lang).map((l, i) => (
              <p key={i}>
                <Rich text={l} />
              </p>
            ))}
          </div>
        </section>
      )}

      <CardFooter series={series} />
    </article>
  );
}
