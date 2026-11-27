import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getCards, getSeries } from "@/lib/content";
import { isFreeCard } from "@/lib/access";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { Badge } from "@/components/Badge";
import { plain } from "@/components/Rich";
import { cn } from "@/lib/numerals";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = getSeries((await params).slug);
  return { title: s ? `${s.title_zh} ${s.title_en} · 悦纳 Dektos` : "悦纳 Dektos" };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();
  const cards = getCards(slug);
  const newestFirst = [...cards].reverse();

  return (
    <div className="space-y-6">
      <section className="flex gap-4 pt-2">
        <div className="flex h-32 w-20 shrink-0 items-center justify-center rounded-sm bg-accent font-serif font-bold text-paper">
          <span
            style={{
              writingMode: "vertical-rl",
              letterSpacing: "0.15em",
              whiteSpace: "nowrap",
              fontSize: series.title_zh.length > 3 ? 20 : 24,
            }}
          >
            {series.title_zh}
          </span>
        </div>
        <div className="flex min-w-0 flex-col justify-end">
          <h1 className="font-serif text-2xl font-bold text-ink">
            <T zh={series.title_zh} en={series.title_en} />
          </h1>
          <p className="text-sm text-ink-soft">
            <T zh={series.subtitle_zh} en={series.subtitle_en} />
          </p>
          <p className="mt-1 text-xs text-accent">
            <T t={ui.cardsCount} vars={{ n: cards.length }} />
          </p>
        </div>
      </section>

      <p className="text-[15px] leading-relaxed text-ink">
        <T zh={series.intro_zh} en={series.intro_en} />
      </p>

      <section>
        <h2 className="mb-3 flex items-baseline justify-between border-b border-line pb-2">
          <span className="font-serif text-lg font-semibold text-ink">
            <T t={ui.cards} />
          </span>
          {cards.length > 1 && (
            <span className="text-xs text-ink-soft">
              <T t={ui.latestFirst} />
            </span>
          )}
        </h2>

        {cards.length === 0 ? (
          <p className="rounded-md border border-dashed border-line p-6 text-center text-sm text-ink-soft">
            <T t={ui.noCards} />
          </p>
        ) : (
          <ul className="space-y-3">
            {newestFirst.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/series/${slug}/${c.slug}`}
                  className="block overflow-hidden rounded-md border border-line bg-white/50 active:bg-paper-deep"
                >
                  <div className="flex items-center justify-between gap-3 px-4 pt-3">
                    <span className="truncate text-sm font-medium text-ink">
                      {c.series_index ? (
                        <T
                          zh={`第${cn(c.chapter)}${series.unit_zh} · ${c.title_zh}`}
                          en={`${series.unit_en} ${c.chapter} · ${c.title_en}`}
                        />
                      ) : (
                        <T zh={c.title_zh} en={c.title_en} />
                      )}
                      {c.series_index && c.series_total ? (
                        <span className="ml-2 font-serif text-xs text-accent">
                          {c.series_index} / {c.series_total}
                        </span>
                      ) : null}
                    </span>
                    <Badge kind={isFreeCard(c, cards) ? "free" : "member"} />
                  </div>
                  <p className="truncate px-4 pb-3 pt-2 font-serif text-lg text-ink">
                    {c.type === "hexagram" ? `${c.title_zh}${c.judgment_zh ? ` · ${c.judgment_zh}` : ""}` : plain(c.original)}
                  </p>
                  <div className="h-1.5 bg-accent" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
