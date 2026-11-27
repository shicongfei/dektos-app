/** 卦象：六条横线，上爻在上。阳爻整条，阴爻中间断开 */
export function Bar({ yang, className = "bg-accent" }: { yang: boolean; className?: string }) {
  return yang ? (
    <span className={`block h-full w-full rounded-[1px] ${className}`} />
  ) : (
    <span className="flex h-full w-full gap-[20%]">
      <span className={`h-full flex-1 rounded-[1px] ${className}`} />
      <span className={`h-full flex-1 rounded-[1px] ${className}`} />
    </span>
  );
}

export function HexGlyph({ yang, highlight = [], label }: { yang: boolean[]; highlight?: number[]; label?: string }) {
  return (
    <div className="flex w-[68px] shrink-0 flex-col items-center gap-2">
      <div className="flex w-full flex-col gap-[5px]">
        {[...yang].reverse().map((y, i) => {
          const lineNo = 6 - i;
          return (
            <span key={i} className="block h-[7px]">
              <Bar yang={y} className={highlight.includes(lineNo) ? "bg-accent" : "bg-ink"} />
            </span>
          );
        })}
      </div>
      {label && <span className="text-center font-serif text-[11px] font-semibold leading-tight text-accent">{label}</span>}
    </div>
  );
}
