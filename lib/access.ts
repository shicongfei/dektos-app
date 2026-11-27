// 会员规则（第一版只用于显示标签，不做真正的拦截）
import type { Card } from "./content";

/** 预览模式：未接登录前，会员卡片也可以浏览，方便检查排版 */
export const PREVIEW_MODE = true;

/** 每部经典里排在最后的那张卡片（章号、张号最大）= 最新一张，免费开放；其余为会员内容 */
export function isFreeCard(card: Card, cardsOfBook: Card[]): boolean {
  return cardsOfBook[cardsOfBook.length - 1] === card;
}
