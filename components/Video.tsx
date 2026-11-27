"use client";

import { useRef, useState } from "react";
import type { VideoInfo } from "@/lib/video";
import { useLang } from "./LangProvider";

/** 竖屏视频在页面里裁成 11:10（参照 dektos.org 合成视频里人像框的比例），取景偏下（0 = 最上，100 = 最下），保住人像和字幕 */
const PORTRAIT_RATIO = 1.1;
const PORTRAIT_FOCUS = 66;

function toEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?playsinline=1`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?playsinline=1`;
  return null;
}

function Player({ v, title, focus, portraitRatio }: { v: VideoInfo; title: string; focus: number; portraitRatio: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const portrait = !!(v.width && v.height && v.height > v.width);
  const ratio = portrait ? portraitRatio : v.width && v.height ? v.width / v.height : 16 / 9;
  const fit = portrait ? "object-cover" : "object-contain";
  const position = portrait ? `50% ${focus}%` : "50% 50%";

  const start = () => {
    setStarted(true);
    ref.current?.play().catch(() => {});
  };

  return (
    <div className="relative w-full overflow-hidden rounded-md bg-ink" style={{ aspectRatio: String(ratio) }}>
      <video
        ref={ref}
        src={v.src}
        title={title}
        controls={started || !v.poster}
        playsInline
        {...{ "webkit-playsinline": "true" }}
        preload="metadata"
        onPlay={() => setStarted(true)}
        className={`h-full w-full bg-ink ${fit}`}
        style={{ objectPosition: position }}
      />
      {/* 封面：用自己的图片层，确保各家浏览器都按同样的方式裁切 */}
      {v.poster && !started && (
        <button
          type="button"
          onClick={start}
          aria-label="播放 Play"
          className="group absolute inset-0 flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.poster} alt="" className={`absolute inset-0 h-full w-full ${fit}`} style={{ objectPosition: position }} />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ink/55 text-paper ring-1 ring-paper/50 backdrop-blur-sm transition-transform group-active:scale-95">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l12-7.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * 视频播放器：按当前语言播放 video_zh / video_en（缺一种时用另一种）；
 * 两种都没有就什么也不显示。
 */
export function Video({
  zh,
  en,
  title,
  focus = PORTRAIT_FOCUS,
  ratio: portraitRatio = PORTRAIT_RATIO,
}: {
  zh: VideoInfo | null;
  en: VideoInfo | null;
  title: string;
  focus?: number;
  ratio?: number;
}) {
  const { lang, ready } = useLang();
  const v = lang === "en" ? en ?? zh : zh ?? en;
  if (!v) return null;

  const embed = toEmbed(v.src);
  if (embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-md bg-ink">
        <iframe key={embed} src={embed} title={title} className="h-full w-full" allow="fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );
  }

  // 读出语言之前先只占位，免得先加载另一种语言的视频
  if (!ready) {
    const portrait = !!(v.width && v.height && v.height > v.width);
    const ratio = portrait ? portraitRatio : v.width && v.height ? v.width / v.height : 16 / 9;
    return <div className="w-full rounded-md bg-ink" style={{ aspectRatio: String(ratio) }} />;
  }

  // key：切换语言时换成新的播放器，原来的视频随之停止
  return <Player key={v.src} v={v} title={title} focus={focus} portraitRatio={portraitRatio} />;
}
