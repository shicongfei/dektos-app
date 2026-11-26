"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui } from "@/lib/i18n";
import { T } from "./T";

const icons = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  courses: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 16V5m15 14v2H6",
  membership: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
  me: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
};

const items = [
  { key: "home", href: "/", match: (p: string) => p === "/" },
  { key: "courses", href: "/courses", match: (p: string) => p.startsWith("/courses") || p.startsWith("/series") },
  { key: "membership", href: "/membership", match: (p: string) => p.startsWith("/membership") },
  { key: "me", href: "/me", match: (p: string) => p === "/me" || p.startsWith("/login") },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid h-16 max-w-app grid-cols-4">
        {items.map((it) => {
          const active = it.match(pathname);
          return (
            <li key={it.key}>
              <Link
                href={it.href}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] ${
                  active ? "text-accent" : "text-ink-soft"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[22px] w-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2 : 1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={icons[it.key]} />
                </svg>
                <T t={ui.nav[it.key]} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
