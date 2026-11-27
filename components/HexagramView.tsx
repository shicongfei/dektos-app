"use client";

import Link from "next/link";
import type { HexagramCard, Series } from "@/lib/content";
import { cn } from "@/lib/numerals";
import { useLang } from "./LangProvider";
import { CardFooter, CardHeader, NoteBox, cardShell } from "./CardChrome";
import { Bar } from "./HexLines";
import { Rich } from "./Rich";

/** 太极图 */
function Taiji() {
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14 shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="48" fill="#F3ECE0" stroke="#1F2430" strokeWidth="3" />
      <path d="M50 2a48 48 0 0 1 0 96a24 24 0 0 1 0-48a24 24 0 0 0 0-48z" fill="#1F2430" />
      <circle cx="50" cy="26" r="7" fill="#F3ECE0" />
      <circle cx="50" cy="74" r="7" fill="#1F2430" />
    </svg>
  );
}

/** 「→ 04 · 08」：可点的对读卡编号；卡片还没建立时显示为灰色 */
function CardLinks({ cards, chapter, available }: { cards: number[]; chapter: number; available: string[] }) {
  if (!cards.length) return null;
  return (
    <span className="flex shrink-0 items-center gap-1 font-serif text-[13px] text-ink-soft">
      →
      {cards.map((n, i) => {
        const slug = `${chapter}-${n}`;
        const label = String(n).padStart(2, "0");
        return (
          <span key={n} className="flex items-center gap-1">
            {i > 0 && <span>·</span>}
            {available.includes(slug) ? (
              <Link href={`/series/yijing/${slug}`} className="text-accent underline decoration-accent/40 underline-offset-2">
                {label}
              </Link>
            ) : (
              <span className="opacity-60">{label}</span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** 易经总览卡：卦名、上下卦、六爻（点编号跳到对读卡）、另见、注 */
export function HexagramView({ card, series, available }: { card: HexagramCard; series: Series; available: string[] }) {
  const { lang } = useLang();
  const en = lang === "en";
  const topDown = [...card.lines].reverse();
  const firstLink = (cards: number[]) => {
    const n = cards.find((x) => available.includes(`${card.chapter}-${x}`));
    return n ? `/series/yijing/${card.chapter}-${n}` : null;
  };

  return (
    <article className={cardShell}>
      <CardHeader card={card} series={series} />

      {/* 卦名 */}
      <section className="flex items-center gap-4 px-5 pt-4">
        <span className="font-serif text-[64px] font-bold leading-none text-ink">{card.name_zh}</span>
        <div className="min-w-0 flex-1">
          {en ? (
            <>
              <p className="font-serif text-[17px] font-bold leading-snug text-ink">{card.title_en}</p>
              {card.judgment_en && (
                <p className="mt-0.5 font-serif text-[13px] italic leading-snug text-ink-soft">{card.judgment_en}</p>
              )}
              <p className="mt-0.5 text-[13px] text-ink-soft">
                Hexagram {card.chapter}
                {card.summary_en ? ` · ${card.summary_en}` : ""}
              </p>
            </>
          ) : (
            <>
              <p className="font-serif text-[17px] font-bold leading-snug text-ink">
                {card.title_zh}
                {card.judgment_zh ? ` · ${card.judgment_zh}` : ""}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-soft">
                第{cn(card.chapter)}卦 · 上{card.upper_zh}下{card.lower_zh}
              </p>
              <p className="text-[13px] text-ink-soft">{card.summary_zh}</p>
            </>
          )}
        </div>
        <Taiji />
      </section>

      {/* 六爻 */}
      <section className="px-5 pt-5">
        <p className="mb-1 text-[11px] tracking-[0.2em] text-ink-soft">
          {en ? "THE SIX LINES · TR. JAMES LEGGE (1882)" : `六爻 · 自下而上（${card.lines[0]?.name_zh}在下）`}
        </p>
        <ol className="divide-y divide-line/70">
          {topDown.map((l, i) => {
            const href = firstLink(l.cards);
            const row = (
              <>
                <span className="block h-[9px] w-12 shrink-0">
                  <Bar yang={l.yang} />
                </span>
                <span className="w-12 shrink-0 font-serif text-[14px] font-bold text-accent">{en ? l.name_en || l.name_zh : l.name_zh}</span>
                <span className="min-w-0 flex-1 font-serif text-[14px] font-semibold leading-snug text-ink">
                  <Rich text={en ? l.text_en || l.text_zh : l.text_zh} />
                </span>
              </>
            );
            return (
              <li key={i} className="flex items-center gap-2 py-2.5">
                {href ? (
                  <Link href={href} className="flex min-w-0 flex-1 items-center gap-2">
                    {row}
                  </Link>
                ) : (
                  <span className="flex min-w-0 flex-1 items-center gap-2">{row}</span>
                )}
                <CardLinks cards={l.cards} chapter={card.chapter} available={available} />
              </li>
            );
          })}
        </ol>
      </section>

      {/* 另见 */}
      {card.see_also.length > 0 && (
        <section className="px-5 pt-4">
          <p className="mb-1.5 text-[11px] tracking-[0.2em] text-ink-soft">{en ? "ALSO IN THIS SERIES" : "另见"}</p>
          <ul className="space-y-1.5">
            {card.see_also.map((s, i) => {
              const href = firstLink(s.cards);
              const body = (
                <>
                  <span className="w-[4.5rem] shrink-0 font-serif text-[13px] font-bold text-accent">{en ? s.label_en || s.label_zh : s.label_zh}</span>
                  <span className="min-w-0 flex-1 text-[13px] leading-snug text-ink">{en ? s.text_en || s.text_zh : s.text_zh}</span>
                </>
              );
              return (
                <li key={i} className="flex items-start gap-2">
                  {href ? (
                    <Link href={href} className="flex min-w-0 flex-1 items-start gap-2">
                      {body}
                    </Link>
                  ) : (
                    <span className="flex min-w-0 flex-1 items-start gap-2">{body}</span>
                  )}
                  <CardLinks cards={s.cards} chapter={card.chapter} available={available} />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="px-5 pb-5 pt-4">
        <NoteBox zh={card.note_zh} en={card.note_en} />
      </div>

      <CardFooter series={series} />
    </article>
  );
}
