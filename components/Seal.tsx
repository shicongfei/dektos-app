"use client";

import { useLogo } from "./Brand";

/** 印章 logo：有 public/logo-seal.svg / .png 时用图片，否则用文字印章 */
export function Seal({ size = 40 }: { size?: number }) {
  const logo = useLogo();
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" aria-hidden width={size} height={size} className="block object-contain" style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-[3px] bg-seal font-serif font-bold text-paper shadow-[inset_0_0_0_2px_rgba(243,236,224,0.35)]"
      style={{ width: size, height: size, fontSize: size * 0.36, lineHeight: 1 }}
    >
      <span style={{ writingMode: "vertical-rl", letterSpacing: "0.08em" }}>悦纳</span>
    </span>
  );
}
