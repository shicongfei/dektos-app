import Link from "next/link";
import type { Series } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { T } from "./T";

export function SeriesCard({ series, index }: { series: Series; index: number }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      data-theme={series.slug}
      className="group flex items-center gap-4 rounded-md border border-line bg-white/50 p-4 transition-colors active:bg-paper-deep"
    >
      <div className="flex h-20 w-12 shrink-0 items-center justify-center rounded-sm bg-accent font-serif font-bold text-paper">
        <span
          style={{
            writingMode: "vertical-rl",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
            fontSize: series.title_zh.length > 3 ? 14 : 17,
          }}
        >
          {series.title_zh}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] tracking-widest text-accent">{String(index + 1).padStart(2, "0")}</div>
        <h3 className="font-serif text-lg font-semibold text-ink">
          <T zh={series.title_zh} en={series.title_en} />
        </h3>
        <p className="line-clamp-2 text-sm leading-snug text-ink-soft">
          <T zh={series.subtitle_zh} en={series.subtitle_en} />
        </p>
      </div>
      <div className="text-right text-xs text-ink-soft">
        <T t={ui.chaptersCount} vars={{ n: series.total_chapters }} />
        <div className="mt-1 text-accent transition-transform group-hover:translate-x-0.5">→</div>
      </div>
    </Link>
  );
}
