import Link from "next/link";
import { Seal } from "./Seal";
import { LangToggle } from "./LangToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-app items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Dektos 悦纳">
          <Seal size={40} />
          <span className="font-serif text-[15px] font-semibold tracking-[0.28em] text-ink">DEKTOS</span>
        </Link>
        <LangToggle />
      </div>
    </header>
  );
}
