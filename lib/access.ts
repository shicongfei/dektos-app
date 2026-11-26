// 会员权限规则（第一版只用于显示标签，不做真正的拦截）
export const FREE_CHAPTERS = 2;

/** 预览模式：未接登录前，锁定内容也可以浏览，方便检查排版 */
export const PREVIEW_MODE = true;

export type Level = "free" | "basic" | "advanced" | "all";

export function chapterLevel(chapter: number): Level {
  return chapter <= FREE_CHAPTERS ? "free" : "basic";
}
