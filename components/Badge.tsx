import { ui } from "@/lib/i18n";
import { T } from "./T";

type Kind = "free" | "member";

const styles: Record<Kind, string> = {
  free: "border-accent bg-accent text-paper",
  member: "border-ink/70 text-ink",
};

const labels = { free: ui.free, member: ui.member };

export function Badge({ kind }: { kind: Kind }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-sm border px-1.5 py-0.5 text-[11px] leading-none ${styles[kind]}`}>
      {kind === "member" && (
        <svg viewBox="0 0 24 24" className="mr-1 h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="5" y="11" width="14" height="10" rx="1.5" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      )}
      <T t={labels[kind]} />
    </span>
  );
}
