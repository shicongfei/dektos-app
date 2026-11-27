const DIGITS = "零一二三四五六七八九";

/** 1 → 一，21 → 二十一（1–99） */
export function cn(n: number): string {
  if (n < 10) return DIGITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return (t === 1 ? "" : DIGITS[t]) + "十" + (u ? DIGITS[u] : "");
}
