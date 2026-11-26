import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getChapterList, getSeries } from "@/lib/content";
import { chapterLevel } from "@/lib/access";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { Badge } from "@/components/Badge";

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
  const chapters = getChapterList(series);
  const first = chapters.find((c) => c.available);

  return (
    <div className="space-y-6">
      <section className="flex gap-4 pt-2">
        <div className="flex h-32 w-20 shrink-0 items-center justify-center rounded-sm bg-ink font-serif font-bold text-paper">
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
          <p className="mt-1 text-xs text-seal">
            <T t={ui.chaptersCount} vars={{ n: series.total_chapters }} />
          </p>
        </div>
      </section>

      <p className="text-[15px] leading-relaxed text-ink">
        <T zh={series.intro_zh} en={series.intro_en} />
      </p>

      {first && (
        <Link
          href={`/series/${series.slug}/${first.chapter}`}
          className="block rounded-md bg-seal py-3 text-center text-sm font-medium text-paper"
        >
          <T t={ui.startReading} />
        </Link>
      )}

      <section>
        <h2 className="mb-2 border-b border-line pb-2 font-serif text-lg font-semibold text-ink">
          <T t={ui.chapters} />
        </h2>
        <ul className="divide-y divide-line">
          {chapters.map((c) => {
            const level = chapterLevel(c.chapter);
            const inner = (
              <>
                <span className="w-7 shrink-0 font-serif text-sm text-ink-soft">{String(c.chapter).padStart(2, "0")}</span>
                <span className={`min-w-0 flex-1 truncate ${c.available ? "text-ink" : "text-ink-soft"}`}>
                  <T zh={c.title_zh} en={c.title_en} />
                </span>
                <span className="flex shrink-0 gap-1">
                  {!c.available && <Badge kind="soon" />}
                  <Badge kind={level === "free" ? "free" : "basic"} />
                </span>
              </>
            );
            return (
              <li key={c.chapter}>
                {c.available ? (
                  <Link href={`/series/${series.slug}/${c.chapter}`} className="flex items-center gap-3 py-3.5 active:bg-paper-deep">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 py-3.5">{inner}</div>
                )}
              </li>
            );
          })}
          {chapters.length < series.total_chapters && (
            <li className="py-4 text-center text-xs text-ink-soft">
              <T
                zh={`其余 ${series.total_chapters - chapters.length} 章陆续更新`}
                en={`${series.total_chapters - chapters.length} more chapters on the way`}
              />
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
