import { getMembership } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { Pricing } from "@/components/Pricing";

export const metadata = { title: "会员 · 悦纳 Dektos" };

export default function MembershipPage() {
  return (
    <div>
      <header className="mb-6 pt-2 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink">
          <T t={ui.membershipTitle} />
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          <T t={ui.membershipSub} />
        </p>
      </header>
      <Pricing data={getMembership()} />
    </div>
  );
}
