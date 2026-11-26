import Link from "next/link";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { LangToggle } from "@/components/LangToggle";

export const metadata = { title: "我的 · 悦纳 Dektos" };

export default function MePage() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-2xl font-bold text-ink">
        <T t={ui.meTitle} />
      </h1>

      <section className="flex items-center gap-4 rounded-md border border-line bg-white/50 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-deep font-serif text-xl text-ink-soft">客</div>
        <div className="flex-1">
          <p className="font-medium text-ink">
            <T t={ui.guest} />
          </p>
          <p className="text-xs text-ink-soft">
            <T t={ui.guestSub} />
          </p>
        </div>
        <Link href="/login" className="rounded-md bg-ink px-4 py-2 text-sm text-paper">
          <T t={ui.login} />
        </Link>
      </section>

      <ul className="divide-y divide-line rounded-md border border-line bg-white/50">
        <li>
          <Link href="/membership" className="flex items-center justify-between p-4 text-sm text-ink">
            <T t={ui.myPlan} />
            <span className="text-ink-soft">
              <T t={ui.free} /> →
            </span>
          </Link>
        </li>
        <li className="flex items-center justify-between p-4 text-sm text-ink">
          <T t={ui.language} />
          <LangToggle />
        </li>
      </ul>

      <section className="rounded-md border border-line bg-white/50 p-4">
        <h2 className="mb-1 font-serif font-semibold text-ink">
          <T t={ui.about} />
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          <T t={ui.aboutText} />
        </p>
      </section>
    </div>
  );
}
