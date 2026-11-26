import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getChapter, getChapters, getSeries } from "@/lib/content";
import { chapterLevel } from "@/lib/access";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { Badge } from "@/components/Badge";
import { Video } from "@/components/Video";
import { EpisodeTabs } from "@/components/EpisodeTabs";

type Params = Promise<{ slug: string; chapter: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().flatMap((s) => getChapters(s.slug).map((c) => ({ slug: s.slug, chapter: String(c.chapter) })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, chapter } = await params;
  const s = getSeries(slug);
  const c = getChapter(slug, Number(chapter));
  return { title: s && c ? `${s.title_zh} ${c.title_zh} · 悦纳 Dektos` : "悦纳 Dektos" };
}

export default async function EpisodePage({ params }: { params: Params }) {
  const { slug, chapter: chapterParam } = await params;
  const series = getSeries(slug);
  const chapter = getChapter(slug, Number(chapterParam));
  if (!series || !chapter) notFound();

  const all = getChapters(slug);
  const idx = all.findIndex((c) => c.chapter === chapter.chapter);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const level = chapterLevel(chapter.chapter);

  return (
    <div className="space-y-5">
      <Link href={`/series/${slug}`} className="inline-flex items-center gap-1 text-sm text-ink-soft">
        ← <T zh={series.title_zh} en={series.title_en} /> · <T t={ui.backToSeries} />
      </Link>

      <Video src={chapter.video} title={chapter.title_en} />

      <header>
        <div className="mb-1.5 flex items-center gap-2">
          <Badge kind={level === "free" ? "free" : "basic"} />
        </div>
        <h1 className="font-serif text-2xl font-bold leading-snug text-ink">
          <T zh={chapter.title_zh} en={chapter.title_en} />
        </h1>
      </header>

      <EpisodeTabs chapter={chapter} />

      <nav className="grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
        {prev ? (
          <Link href={`/series/${slug}/${prev.chapter}`} className="rounded-md border border-line p-3 text-ink">
            <div className="text-xs text-ink-soft">
              ← <T t={ui.prev} />
            </div>
            <div className="truncate">
              <T zh={prev.title_zh} en={prev.title_en} />
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/series/${slug}/${next.chapter}`} className="rounded-md border border-line p-3 text-right text-ink">
            <div className="text-xs text-ink-soft">
              <T t={ui.next} /> →
            </div>
            <div className="truncate">
              <T zh={next.title_zh} en={next.title_en} />
            </div>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
