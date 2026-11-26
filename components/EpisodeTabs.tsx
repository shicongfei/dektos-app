"use client";

import Link from "next/link";
import { useState } from "react";
import type { Chapter } from "@/lib/content";
import { PREVIEW_MODE } from "@/lib/access";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { Badge } from "./Badge";
import { T } from "./T";

export function EpisodeTabs({ chapter }: { chapter: Chapter }) {
  const [tab, setTab] = useState<"text" | "bible">("text");
  const { lang } = useLang();

  return (
    <div>
      <div role="tablist" className="sticky top-14 z-20 -mx-4 flex border-b border-line bg-paper px-4">
        {(
          [
            ["text", ui.textTab],
            ["bible", ui.bibleTab],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm transition-colors ${
              tab === key ? "border-seal font-medium text-ink" : "border-transparent text-ink-soft"
            }`}
          >
            <T t={label} />
            {key === "bible" && <Badge kind="advanced" />}
          </button>
        ))}
      </div>

      {tab === "text" ? (
        <div className="space-y-8 pt-6">
          <section>
            <h3 className="mb-3 text-xs tracking-widest text-seal">
              <T t={ui.original} />
            </h3>
            <div className="space-y-2 font-serif text-[19px] leading-[1.9] text-ink">
              {chapter.original.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
          <section>
            <h3 className="mb-3 text-xs tracking-widest text-seal">
              <T t={ui.translation} />
              <span className="ml-2 text-ink-soft">James Legge</span>
            </h3>
            {chapter.translation_en ? (
              <div className="space-y-2 font-serif text-base leading-relaxed text-ink">
                {chapter.translation_en.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-line p-4 text-sm text-ink-soft">
                <T t={ui.translationPending} />
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-5 pt-6">
          <div className="flex items-start gap-3 rounded-md border border-ink/80 bg-white/60 p-4">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-seal" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <rect x="5" y="11" width="14" height="10" rx="1.5" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <div className="flex-1 text-sm">
              <p className="font-medium text-ink">
                <T t={ui.advancedUnlock} />
              </p>
              {PREVIEW_MODE && (
                <p className="mt-1 text-ink-soft">
                  <T t={ui.previewNotice} />
                </p>
              )}
              <Link href="/membership" className="mt-2 inline-block text-seal underline underline-offset-4">
                <T t={ui.viewPlans} /> →
              </Link>
            </div>
          </div>

          {PREVIEW_MODE &&
            chapter.bible.map((b, i) => (
              <article key={i} className="rounded-md border border-line bg-white/50 p-4">
                <h4 className="mb-3 font-serif font-semibold text-ink">
                  <T zh={b.ref_zh} en={b.ref_en} />
                </h4>
                <div className={`flex flex-col gap-3 ${lang === "en" ? "flex-col-reverse" : ""}`}>
                  <div>
                    <div className="mb-1 text-[11px] tracking-widest text-seal">和合本 CUV</div>
                    <p className="font-serif text-[17px] leading-relaxed text-ink">{b.cuv}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] tracking-widest text-seal">KJV</div>
                    <p className="font-serif text-[15px] italic leading-relaxed text-ink">{b.kjv}</p>
                  </div>
                </div>
              </article>
            ))}

          {PREVIEW_MODE && (chapter.note_zh || chapter.note_en) && (
            <section className="border-l-2 border-seal pl-4">
              <h4 className="mb-2 text-xs tracking-widest text-seal">
                <T t={ui.readingNote} />
              </h4>
              <p className="text-[15px] leading-relaxed text-ink">
                <T zh={chapter.note_zh} en={chapter.note_en} />
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
