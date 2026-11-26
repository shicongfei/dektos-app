"use client";

import Link from "next/link";
import type { HexagramCard, Series } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { CardFooter, CardHeader, cardShell } from "./CardChrome";
import { Rich } from "./Rich";
import { T } from "./T";

/** 一爻的横线：阳爻一整条，阴爻中间断开 */
function Bar({ yang }: { yang: boolean }) {
  return yang ? (
    <span className="block h-3 w-full rounded-[1px] bg-accent" />
  ) : (
    <span className="flex h-3 w-full gap-[18%]">
      <span className="h-full flex-1 rounded-[1px] bg-accent" />
      <span className="h-full flex-1 rounded-[1px] bg-accent" />
    </span>
  );
}

/** 易经总览卡：卦名、卦辞、上下卦、六爻（可点）、另见 */
export function HexagramView({
  card,
  series,
  available,
}: {
  card: HexagramCard;
  series: Series;
  available: number[];
}) {
  const { lang } = useLang();
  const en = lang === "en";
  const href = (no: number | null) => (no && available.includes(no) ? `/series/${card.book}/${no}` : null);
  const topDown = [...card.lines].reverse(); // 画的时候上爻在上

  return (
    <article className={cardShell}>
      <CardHeader card={card} series={series} />

      {/* 卦名 */}
      <section className="px-6 pb-2 pt-7 text-center">
        <h2 className="font-serif text-[56px] font-bold leading-none text-accent">{card.name_zh}</h2>
        {card.name_en && <p className="mt-2 text-xs tracking-[0.2em] text-ink-soft">{card.name_en.toUpperCase()}</p>}
      </section>

      {/* 上下卦 */}
      <dl className="mx-6 mt-5 grid grid-cols-2 divide-x divide-line border-y border-line text-center">
        {(
          [
            [ui.upperTrigram, en ? card.upper_en || card.upper_zh : card.upper_zh],
            [ui.lowerTrigram, en ? card.lower_en || card.lower_zh : card.lower_zh],
          ] as const
        ).map(([label, value], i) => (
          <div key={i} className="py-2.5">
            <dt className="text-[11px] tracking-[0.2em] text-ink-soft">
              <T t={label} />
            </dt>
            <dd className="mt-0.5 font-serif text-[15px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {/* 卦辞：注释框 */}
      <section className="mx-5 my-6 rounded-sm bg-note px-5 py-4">
        <p className="mb-2 text-[11px] tracking-[0.25em] text-accent">
          <T t={ui.judgment} />
        </p>
        <p className="font-serif text-[20px] leading-relaxed text-ink">
          <Rich text={card.judgment_zh} />
        </p>
        {en &&
          (card.judgment_en ? (
            <p className="mt-2 font-serif text-[15px] italic leading-relaxed text-ink">
              <Rich text={card.judgment_en} />
            </p>
          ) : (
            <p className="mt-2 text-xs text-ink-soft">
              <T t={ui.translationPending} />
            </p>
          ))}
      </section>

      {/* 六爻 */}
      <section className="px-5 pb-6">
        <p className="mb-3 flex items-baseline justify-between px-1 text-[11px] tracking-[0.25em] text-accent">
          <T t={ui.sixLines} />
          <span className="tracking-normal text-ink-soft">
            <T t={ui.tapLine} />
          </span>
        </p>
        <ol className="space-y-1">
          {topDown.map((l, i) => {
            const target = href(l.card);
            const body = (
              <>
                <span className="w-16 shrink-0">
                  <Bar yang={l.yang} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mr-2 font-serif text-[15px] font-semibold text-accent">{en ? l.name_en || l.name_zh : l.name_zh}</span>
                  <span className="font-serif text-[15px] text-ink">
                    <Rich text={l.text_zh} />
                  </span>
                  {en && l.text_en && (
                    <span className="mt-0.5 block font-serif text-[13px] italic text-ink-soft">
                      <Rich text={l.text_en} />
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-ink-soft">{target ? "→" : <T t={ui.comingSoonShort} />}</span>
              </>
            );
            return (
              <li key={i}>
                {target ? (
                  <Link href={target} className="flex items-center gap-3 rounded-sm px-1 py-2.5 active:bg-note">
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-1 py-2.5">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* 另见 */}
      {card.see_also.length > 0 && (
        <section className="border-t border-line/70 px-6 py-5">
          <p className="mb-3 text-[11px] tracking-[0.25em] text-accent">
            <T t={ui.seeAlso} />
          </p>
          <div className="flex flex-wrap gap-2">
            {card.see_also.map((s, i) => {
              const target = href(s.card);
              const label = en ? s.label_en || s.label_zh : s.label_zh;
              return target ? (
                <Link key={i} href={target} className="rounded-sm border border-accent px-3 py-1.5 text-sm text-accent active:bg-note">
                  {label}
                </Link>
              ) : (
                <span key={i} className="rounded-sm border border-line px-3 py-1.5 text-sm text-ink-soft">
                  {label}
                </span>
              );
            })}
          </div>
        </section>
      )}

      <CardFooter series={series} />
    </article>
  );
}
