// 从 /content 文件夹读取经文与课程内容（仅在服务器 / 构建时运行）
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const BOOKS = ["daodejing", "yijing", "huangdineijing"] as const;
export type Book = (typeof BOOKS)[number];

/** 对照卡片：/content/cards 里的一个 JSON 文件 */
export type Card = {
  book: Book;
  chapter: number;
  title_zh: string;
  title_en: string;
  original: string; // 原文
  vernacular_zh: string; // 白话
  translation_en: string; // James Legge 译文
  scripture_zh: string; // 和合本
  scripture_en: string; // KJV
  scripture_ref: string; // 例如 John 1:1-3
  insight_zh: string; // 对照点睛
  insight_en: string;
  video_zh: string;
  video_en: string;
};

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

const CARD_FIELDS = [
  "title_zh",
  "title_en",
  "original",
  "vernacular_zh",
  "translation_en",
  "scripture_zh",
  "scripture_en",
  "scripture_ref",
  "insight_zh",
  "insight_en",
  "video_zh",
  "video_en",
] as const;

/** 读取并检查一张卡片；格式有误时让构建失败，并指出是哪个文件、哪个字段 */
function parseCard(file: string): Card {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`卡片 JSON 格式错误：${file}\n${(e as Error).message}`);
  }
  const fail = (msg: string) => {
    throw new Error(`卡片内容有误：${path.relative(process.cwd(), file)} — ${msg}`);
  };
  if (!BOOKS.includes(data.book as Book)) fail(`book 必须是 ${BOOKS.join(" / ")}，现在是 "${data.book}"`);
  if (!Number.isInteger(data.chapter) || (data.chapter as number) < 1) fail(`chapter 必须是正整数`);
  const card = { book: data.book, chapter: data.chapter } as Card;
  for (const k of CARD_FIELDS) {
    const v = data[k] ?? "";
    if (typeof v !== "string") fail(`${k} 必须是文字（用双引号括起来）`);
    card[k] = (v as string).trim();
  }
  return card;
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
    const key = `${c.book}-${c.chapter}`;
    if (seen.has(key)) throw new Error(`有两张卡片都是 ${c.book} 第 ${c.chapter} 章，请删除或改掉其中一张`);
    seen.add(key);
  }
  cardCache = cards;
  return cards;
}

/** 某部经典的卡片，按章号排序 */
export function getCards(book: string): Card[] {
  return getAllCards()
    .filter((c) => c.book === book)
    .sort((a, b) => a.chapter - b.chapter);
}

export function getCard(book: string, chapter: number): Card | null {
  return getCards(book).find((c) => c.chapter === chapter) ?? null;
}

export function getDailyVerses(): DailyVerse[] {
  return readJson<DailyVerse[]>("daily.json");
}

export function getMembership(): Membership {
  return readJson<Membership>("membership.json");
}
