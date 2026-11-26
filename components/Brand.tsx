"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const LogoContext = createContext<string | null>(null);

/** 根据网址决定主题色：/series/<book>/… 用该书的颜色，其余页面用印章红 */
export function ThemeRoot({ logo, children }: { logo: string | null; children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const book = pathname.match(/^\/series\/([^/]+)/)?.[1];
  return (
    <LogoContext.Provider value={logo}>
      <div data-theme={book}>{children}</div>
    </LogoContext.Provider>
  );
}

export function useLogo() {
  return useContext(LogoContext);
}
