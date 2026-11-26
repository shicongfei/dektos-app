import { getAllSeries, getDailyVerses } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { DailyCard } from "@/components/DailyCard";
import { SeriesCard } from "@/components/SeriesCard";

export default function HomePage() {
  const series = getAllSeries();
  const verses = getDailyVerses();

  return (
    <div className="space-y-8">
      <section className="pt-4 text-center">
        <h1 className="font-serif text-[30px] font-bold leading-tight tracking-wide text-ink">以经解经 · 东西对读</h1>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-accent">
          <T t={ui.tagline} />
        </p>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
          <T t={ui.heroSub} />
        </p>
      </section>

      <DailyCard verses={verses} />

      <section>
        <h2 className="mb-3 flex items-baseline justify-between">
          <span className="font-serif text-lg font-semibold text-ink">
            <T t={ui.series} />
          </span>
          <span className="text-xs text-ink-soft">I Ching · Tao Te Ching · Neijing</span>
        </h2>
        <div className="space-y-3">
          {series.map((s, i) => (
            <SeriesCard key={s.slug} series={s} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
