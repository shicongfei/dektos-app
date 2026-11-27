import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getCard, getCards, getHexagram, getSeries } from "@/lib/content";
import { isFreeCard, PREVIEW_MODE } from "@/lib/access";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { Badge } from "@/components/Badge";
import { Video } from "@/components/Video";
import { CardView } from "@/components/CardView";
import { HexagramView } from "@/components/HexagramView";

type Params = Promise<{ slug: string; chapter: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().flatMap((s) => getCards(s.slug).map((c) => ({ slug: s.slug, chapter: c.slug })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug, chapter } = await params;
  const s = getSeries(slug);
  const c = getCard(slug, chapter);
  return { title: s && c ? `${s.title_zh} ${c.title_zh} · 悦纳 Dektos` : "悦纳 Dektos" };
}

export default async function CardPage({ params }: { params: Params }) {
  const { slug, chapter: chapterParam } = await params;
  const series = getSeries(slug);
  const card = getCard(slug, chapterParam);
  if (!series || !card) notFound();

  const all = getCards(slug);
  const idx = all.findIndex((c) => c.slug === card.slug);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const free = isFreeCard(card, all);

  return (
    <div className="space-y-5">
      <Link href={`/series/${slug}`} className="inline-flex items-center gap-1 text-sm text-ink-soft">
        ← <T zh={series.title_zh} en={series.title_en} /> · <T t={ui.backToSeries} />
      </Link>

      <Video zh={card.video_zh} en={card.video_en} title={card.title_en} />

      <header className="flex items-start justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold leading-snug text-ink">
          <T zh={card.title_zh} en={card.title_en} />
        </h1>
        <span className="mt-1.5">
          <Badge kind={free ? "free" : "member"} />
        </span>
      </header>

      {!free && PREVIEW_MODE && (
        <p className="flex items-center justify-between gap-3 rounded-md bg-paper-deep px-4 py-3 text-xs text-ink-soft">
          <T t={ui.memberNotice} />
          <Link href="/membership" className="shrink-0 text-accent underline underline-offset-4">
            <T t={ui.viewPlans} />
          </Link>
        </p>
      )}

      {card.type === "hexagram" ? (
        <HexagramView card={card} series={series} available={all.map((c) => c.slug)} />
      ) : (
        <CardView card={card} series={series} hexagram={slug === "yijing" ? getHexagram(card.chapter) : null} />
      )}

      <nav className="grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
        {prev ? (
          <Link href={`/series/${slug}/${prev.slug}`} className="rounded-md border border-line p-3 text-ink">
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
          <Link href={`/series/${slug}/${next.slug}`} className="rounded-md border border-line p-3 text-right text-ink">
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
