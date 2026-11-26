"use client";

import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { T } from "./T";

function toEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/** 视频区：按当前语言选 video_zh / video_en；没有时显示占位 */
export function Video({ zh, en, title }: { zh: string; en: string; title: string }) {
  const { lang } = useLang();
  const src = lang === "en" ? en || zh : zh || en;

  if (src) {
    const embed = toEmbed(src);
    return (
      <div className="aspect-video w-full overflow-hidden rounded-md bg-ink">
        {embed ? (
          <iframe
            key={embed}
            src={embed}
            title={title}
            className="h-full w-full"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video key={src} src={src} controls playsInline className="h-full w-full" />
        )}
      </div>
    );
  }
  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-md bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(90deg,#F7F3EC_0_1px,transparent_1px_28px)]" />
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-paper/40">
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
      </span>
      <span className="text-sm text-paper/80">
        <T t={ui.videoPending} />
      </span>
    </div>
  );
}
