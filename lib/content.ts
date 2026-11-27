// 从 /content 文件夹读取经文与课程内容（仅在服务器 / 构建时运行）
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const BOOKS = ["daodejing", "yijing", "huangdineijing"] as const;
export type Book = (typeof BOOKS)[number];

/** 一节经文（中英文可以只有一种：英文卡片和中文卡片引用的经节不一定相同） */
export type Verse = {
  text_zh: string; // 和合本
  text_en: string; // KJV
  ref_zh: string; // 约翰福音 1:1-3
  ref_en: string; // John 1:1-3
};

type BaseCard = {
  book: Book;
  chapter: number; // 第几章 / 第几卦 / 第几篇
  series_index: number | null; // 「1 / 81」里的 1
  series_total: number | null; // 「1 / 81」里的 81
  slug: string; // 网址里的编号：道德经 = 章号；易经、内经 = 章号-张号（例如 1-4）
  title_zh: string;
  title_en: string;
  video_zh: string;
  video_en: string;
  video_focus: number | null; // 竖屏视频裁成 1:1 时的取景位置（0 = 最上，100 = 最下），留空用默认 66
};

/** 一般的对照卡片 */
export type TextCard = BaseCard & {
  type: "card";
  source_zh: string; // 原文出处，例如「彖传」「上古天真论 · 一、时世异耶」
  source_en: string;
  highlight_lines: number[]; // 易经：卦象里要标红的爻（1–6，自下而上）
  lines_label_zh: string; // 易经：卦象下的说明，例如「初 · 五 · 上」
  lines_label_en: string;
  original: string; // 原文，可用 **重点字**
  vernacular_zh: string; // 白话
  translation_en: string; // 英译
  scripture: Verse[];
  insight_zh: string; // 对照点睛
  insight_en: string;
  note_zh: string; // 注
  note_en: string;
  point_zh: string; // 对读点
  point_en: string;
};

export type HexLine = {
  name_zh: string; // 初九、六二……（九 = 阳爻，六 = 阴爻）
  name_en: string;
  text_zh: string; // 爻辞
  text_en: string;
  yang: boolean;
  cards: number[]; // 对应的对读卡（同一卦里的张号）
};

export type SeeAlso = { label_zh: string; label_en: string; text_zh: string; text_en: string; cards: number[] };

/** 易经每一卦的总览卡 */
export type HexagramCard = BaseCard & {
  type: "hexagram";
  name_zh: string; // 卦名大字：乾
  short_en: string; // 卦象下的英文名：Qian · Heaven
  judgment_zh: string; // 标题后的卦辞：元亨利贞
  judgment_en: string;
  upper_zh: string; // 上卦：乾
  upper_en: string; // Heaven
  lower_zh: string;
  lower_en: string;
  summary_zh: string; // 六爻 × 九张对读
  summary_en: string;
  lines: HexLine[]; // 六爻，自下而上
  see_also: SeeAlso[]; // 另见：用九、彖传、大象、说卦……
  note_zh: string;
  note_en: string;
};

export type Card = TextCard | HexagramCard;

export type Series = {
  slug: string;
  order: number;
  title_zh: string;
  title_en: string;
  subtitle_zh: string;
  subtitle_en: string;
  intro_zh: string;
  intro_en: string;
  total_chapters: number;
  unit_zh: string; // 章 / 卦 / 篇
  unit_en: string; // Chapter / Hexagram
  brand_zh: string; // 子品牌：悦纳哲学
  brand_en: string; // Dektos Philosophy
};

export type DailyVerse = {
  classic_zh: string;
  classic_en: string;
  classic_ref_zh: string;
  classic_ref_en: string;
  bible_cuv: string;
  bible_kjv: string;
  bible_ref_zh: string;
  bible_ref_en: string;
};

export type Tier = {
  id: string;
  name_zh: string;
  name_en: string;
  monthly: number;
  highlight?: boolean;
  features_zh: string[];
  features_en: string[];
};

export type Membership = {
  currency: string;
  yearly_months: number;
  early_bird_discount: number;
  tiers: Tier[];
};

function readJson<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, ...parts), "utf8")) as T;
}

export function getAllSeries(): Series[] {
  const dir = path.join(CONTENT_DIR, "series");
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "series.json")))
    .map((d) => readJson<Series>("series", d.name, "series.json"))
    .sort((a, b) => a.order - b.order);
}

export function getSeries(slug: string): Series | null {
  return getAllSeries().find((s) => s.slug === slug) ?? null;
}

class CardError extends Error {}

/** 有多张卡片组成一卦 / 一篇的经典：网址用「章号-张号」 */
const GROUPED: Book[] = ["yijing", "huangdineijing"];

/** 读取并检查一张卡片；格式有误时让构建失败，并指出是哪个文件、哪个字段 */
function parseCard(file: string): Card {
  const rel = path.relative(process.cwd(), file);
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new CardError(`卡片 JSON 格式错误：${rel}\n${(e as Error).message}`);
  }
  const fail = (msg: string): never => {
    throw new CardError(`卡片内容有误：${rel} — ${msg}`);
  };
  const str = (obj: Record<string, unknown>, k: string, where = "") => {
    const v = obj[k] ?? "";
    if (typeof v !== "string") fail(`${where}${k} 必须是文字（用双引号括起来）`);
    return (v as string).trim();
  };
  const int = (obj: Record<string, unknown>, k: string, where = ""): number | null => {
    const v = obj[k];
    if (v === undefined || v === null || v === "") return null;
    if (!Number.isInteger(v) || (v as number) < 1) fail(`${where}${k} 必须是正整数（不加引号）`);
    return v as number;
  };
  const ints = (obj: Record<string, unknown>, k: string, where = ""): number[] => {
    const v = obj[k];
    if (v === undefined || v === null || v === "") return [];
    const list = Array.isArray(v) ? v : [v];
    if (!list.every((x) => Number.isInteger(x) && x >= 1)) fail(`${where}${k} 必须是正整数，或用 [ ] 括起来的多个正整数`);
    return list as number[];
  };
  const arr = (k: string) => {
    const v = data[k] ?? [];
    if (!Array.isArray(v)) fail(`${k} 必须是列表，用 [ ] 括起来`);
    return v as Record<string, unknown>[];
  };

  if (!BOOKS.includes(data.book as Book)) fail(`book 必须是 ${BOOKS.join(" / ")}，现在是 "${data.book}"`);
  const book = data.book as Book;
  const type = data.type ?? "card";
  if (type !== "card" && type !== "hexagram") fail(`type 只能是 "card" 或 "hexagram"`);
  const chapter = int(data, "chapter") ?? fail("chapter 不能留空");
  const series_index = int(data, "series_index");
  if (GROUPED.includes(book) && !series_index) fail("易经和黄帝内经的卡片必须填 series_index（这一卦 / 这一篇的第几张）");

  const base: BaseCard = {
    book,
    chapter,
    series_index,
    series_total: int(data, "series_total"),
    slug: GROUPED.includes(book) ? `${chapter}-${series_index}` : String(chapter),
    title_zh: str(data, "title_zh"),
    title_en: str(data, "title_en"),
    video_zh: str(data, "video_zh"),
    video_en: str(data, "video_en"),
    video_focus: (() => {
      const v = data.video_focus;
      if (v === undefined || v === null || v === "") return null;
      if (typeof v !== "number" || v < 0 || v > 100) fail("video_focus 必须是 0–100 的数字");
      return v as number;
    })(),
  };

  if (type === "hexagram") {
    if (book !== "yijing") fail(`type "hexagram" 只能用于易经（book: "yijing"）`);
    const lines = arr("lines").map((l, i) => {
      const where = `lines 第 ${i + 1} 爻的 `;
      const name_zh = str(l, "name_zh", where);
      const yang =
        typeof l.yang === "boolean"
          ? l.yang
          : name_zh.includes("九")
            ? true
            : name_zh.includes("六")
              ? false
              : fail(`${where}name_zh 要含「九」或「六」，或另填 yang: true / false`);
      return {
        name_zh,
        name_en: str(l, "name_en", where),
        text_zh: str(l, "text_zh", where),
        text_en: str(l, "text_en", where),
        yang: yang as boolean,
        cards: ints(l, "card", where),
      };
    });
    if (lines.length !== 6) fail(`lines 必须正好有 6 爻（自下而上），现在有 ${lines.length} 个`);
    return {
      ...base,
      type: "hexagram",
      name_zh: str(data, "name_zh"),
      short_en: str(data, "short_en"),
      judgment_zh: str(data, "judgment_zh"),
      judgment_en: str(data, "judgment_en"),
      upper_zh: str(data, "upper_zh"),
      upper_en: str(data, "upper_en"),
      lower_zh: str(data, "lower_zh"),
      lower_en: str(data, "lower_en"),
      summary_zh: str(data, "summary_zh"),
      summary_en: str(data, "summary_en"),
      lines,
      see_also: arr("see_also").map((x, i) => {
        const where = `see_also 第 ${i + 1} 项的 `;
        return {
          label_zh: str(x, "label_zh", where),
          label_en: str(x, "label_en", where),
          text_zh: str(x, "text_zh", where),
          text_en: str(x, "text_en", where),
          cards: ints(x, "card", where),
        };
      }),
      note_zh: str(data, "note_zh"),
      note_en: str(data, "note_en"),
    };
  }

  const highlight_lines = ints(data, "highlight_lines");
  if (highlight_lines.some((n) => n > 6)) fail("highlight_lines 只能是 1–6");
  return {
    ...base,
    type: "card",
    source_zh: str(data, "source_zh"),
    source_en: str(data, "source_en"),
    highlight_lines,
    lines_label_zh: str(data, "lines_label_zh"),
    lines_label_en: str(data, "lines_label_en"),
    original: str(data, "original"),
    vernacular_zh: str(data, "vernacular_zh"),
    translation_en: str(data, "translation_en"),
    scripture: arr("scripture").map((v, i) => {
      const where = `scripture 第 ${i + 1} 节的 `;
      return {
        text_zh: str(v, "text_zh", where),
        text_en: str(v, "text_en", where),
        ref_zh: str(v, "ref_zh", where),
        ref_en: str(v, "ref_en", where),
      };
    }),
    insight_zh: str(data, "insight_zh"),
    insight_en: str(data, "insight_en"),
    note_zh: str(data, "note_zh"),
    note_en: str(data, "note_en"),
    point_zh: str(data, "point_zh"),
    point_en: str(data, "point_en"),
  };
}

let cardCache: Card[] | null = null;

export function getAllCards(): Card[] {
  if (cardCache && process.env.NODE_ENV === "production") return cardCache;
  const dir = path.join(CONTENT_DIR, "cards");
  const cards = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => parseCard(path.join(dir, f)))
    : [];
  const seen = new Set<string>();
  for (const c of cards) {
    const key = `${c.book}/${c.slug}`;
    if (seen.has(key)) throw new CardError(`有两张卡片都是 ${c.book} ${c.slug}（章号${c.series_index ? "和张号" : ""}重复），请改掉其中一张`);
    seen.add(key);
  }
  cardCache = cards;
  return cards;
}

/** 某部经典的卡片，按章号、张号排序 */
export function getCards(book: string): Card[] {
  return getAllCards()
    .filter((c) => c.book === book)
    .sort((a, b) => a.chapter - b.chapter || (a.series_index ?? 0) - (b.series_index ?? 0));
}

export function getCard(book: string, slug: string): Card | null {
  return getCards(book).find((c) => c.slug === slug) ?? null;
}

/** 易经：某一卦的总览卡 */
export function getHexagram(chapter: number): HexagramCard | null {
  const c = getCards("yijing").find((x) => x.chapter === chapter && x.type === "hexagram");
  return (c as HexagramCard) ?? null;
}

export function getDailyVerses(): DailyVerse[] {
  return readJson<DailyVerse[]>("daily.json");
}

export function getMembership(): Membership {
  return readJson<Membership>("membership.json");
}
