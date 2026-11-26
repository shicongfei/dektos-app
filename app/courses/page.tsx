import { getAllSeries } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { SeriesCard } from "@/components/SeriesCard";

export const metadata = { title: "课程 · 悦纳 Dektos" };

export default function CoursesPage() {
  const series = getAllSeries();
  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl font-bold text-ink">
        <T t={ui.series} />
      </h1>
      <div className="space-y-3">
        {series.map((s, i) => (
          <SeriesCard key={s.slug} series={s} index={i} />
        ))}
      </div>
    </div>
  );
}
