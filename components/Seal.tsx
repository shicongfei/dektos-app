/** 红色方形印章，竖排「悦纳」 */
export function Seal({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-[3px] bg-seal font-serif font-bold text-paper shadow-[inset_0_0_0_2px_rgba(247,243,236,0.35)]"
      style={{ width: size, height: size, fontSize: size * 0.36, lineHeight: 1 }}
    >
      <span style={{ writingMode: "vertical-rl", letterSpacing: "0.08em" }}>悦纳</span>
    </span>
  );
}
