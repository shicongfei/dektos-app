"use client";

import Image from "next/image";
import { useLogo } from "./Brand";

/** 印章 logo：size 是高度。有 public/logo-seal.svg / .png 时按原比例显示图片，否则用文字印章 */
export function Seal({ size = 40 }: { size?: number }) {
  const logo = useLogo();
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt=""
        aria-hidden
        width={Math.round((size * logo.width) / logo.height)}
        height={size}
        className="block shrink-0"
        style={{ height: size, width: "auto" }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[3px] bg-seal font-serif font-bold text-paper shadow-[inset_0_0_0_2px_rgba(243,236,224,0.35)]"
      style={{ width: size, height: size, fontSize: size * 0.36, lineHeight: 1 }}
    >
      <span style={{ writingMode: "vertical-rl", letterSpacing: "0.08em" }}>悦纳</span>
    </span>
  );
}
