/** 把 **重点字** 显示成强调色；其他文字原样显示 */
export function Rich({ text, emph = "text-accent" }: { text: string; emph?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className={`font-bold ${emph}`}>
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** 去掉 ** 标记（用在列表预览等纯文字场合） */
export function plain(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
