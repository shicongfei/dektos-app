"use client";

import type { VideoInfo } from "@/lib/video";
import { useLang } from "./LangProvider";

function toEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?playsinline=1`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?playsinline=1`;
  return null;
}

/**
 * 视频播放器：按当前语言播放 video_zh / video_en（缺一种时用另一种）；
 * 两种都没有就什么也不显示。
 */
export function Video({ zh, en, title }: { zh: VideoInfo | null; en: VideoInfo | null; title: string }) {
  const { lang, ready } = useLang();
  const v = lang === "en" ? en ?? zh : zh ?? en;
  if (!v) return null;

  const embed = toEmbed(v.src);
  if (embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-md bg-ink">
        <iframe
          key={embed}
          src={embed}
          title={title}
          className="h-full w-full"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 竖屏视频在手机上限制高度，宽度按比例缩小并置中
  const ratio = v.width && v.height ? v.width / v.height : 16 / 9;
  return (
    <div
      className="mx-auto overflow-hidden rounded-md bg-ink"
      style={{ aspectRatio: String(ratio), width: `min(100%, calc(70vh * ${ratio.toFixed(4)}))` }}
    >
      {/* 读出语言之前先只显示封面，免得先加载另一种语言的视频 */}
      {!ready ? (
        v.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.poster} alt="" className="h-full w-full object-contain" />
        ) : null
      ) : (
      <video
        key={v.src} // 切换语言时换成另一个视频，并停止正在播放的
        src={v.src}
        poster={v.poster ?? undefined}
        title={title}
        controls
        playsInline
        {...{ "webkit-playsinline": "true" }}
        preload="metadata"
        className="h-full w-full bg-ink object-contain"
      />
      )}
    </div>
  );
}
