import Link from "next/link";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-serif text-5xl text-seal">404</p>
      <p className="mt-3 text-ink">
        <T t={ui.notFound} />
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-seal underline underline-offset-4">
        <T t={ui.backHome} />
      </Link>
    </div>
  );
}
