// 从 /content 文件夹读取经文与课程内容（仅在服务器 / 构建时运行）
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type BibleVerse = {
  ref_zh: string;
  ref_en: string;
  cuv: string; // 和合本
  kjv: string; // King James Version
};

export type Chapter = {
  chapter: number;
  title_zh: string;
  title_en: string;
  video: string;
  original: string;
  translation_en: string;
  bible: BibleVerse[];
  note_zh: string;
  note_en: string;
};

export type ChapterSummary = {
  chapter: number;
  title_zh: string;
  title_en: string;
  available: boolean; // 是否已有内容文件
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
  planned: { chapter: number; title_zh: string; title_en: string }[];
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

function chapterDir(slug: string) {
  return path.join(CONTENT_DIR, "series", slug, "chapters");
}

function normalize(data: Record<string, unknown>): Chapter {
  return {
    chapter: Number(data.chapter),
    title_zh: String(data.title_zh ?? ""),
    title_en: String(data.title_en ?? ""),
    video: String(data.video ?? ""),
    original: String(data.original ?? "").trim(),
    translation_en: String(data.translation_en ?? "").trim(),
    bible: (data.bible as BibleVerse[] | undefined) ?? [],
    note_zh: String(data.note_zh ?? ""),
    note_en: String(data.note_en ?? ""),
  };
}

export function getChapters(slug: string): Chapter[] {
  const dir = chapterDir(slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => normalize(matter(fs.readFileSync(path.join(dir, f), "utf8")).data))
    .sort((a, b) => a.chapter - b.chapter);
}

export function getChapter(slug: string, n: number): Chapter | null {
  return getChapters(slug).find((c) => c.chapter === n) ?? null;
}

/** 章节列表 = 已写好的章节文件 + series.json 里「planned」预告的章节 */
export function getChapterList(series: Series): ChapterSummary[] {
  const map = new Map<number, ChapterSummary>();
  for (const p of series.planned) map.set(p.chapter, { ...p, available: false });
  for (const c of getChapters(series.slug))
    map.set(c.chapter, { chapter: c.chapter, title_zh: c.title_zh, title_en: c.title_en, available: true });
  return [...map.values()].sort((a, b) => a.chapter - b.chapter);
}

export function getDailyVerses(): DailyVerse[] {
  return readJson<DailyVerse[]>("daily.json");
}

export function getMembership(): Membership {
  return readJson<Membership>("membership.json");
}
