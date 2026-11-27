// 视频路径与封面（服务器 / 构建时运行）
import fs from "node:fs";
import path from "node:path";

export type VideoInfo = {
  src: string;
  poster: string | null; // 同名 .jpg 封面
  width: number | null; // 封面宽高，用来预留播放器的比例
  height: number | null;
};

const PUBLIC = path.join(process.cwd(), "public");

/** 读 JPEG 的宽高（找 SOF 段） */
function jpegSize(file: string): { width: number; height: number } | null {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

/**
 * 卡片里的 video_zh / video_en → 播放器需要的信息。
 * 站内路径（/videos/xxx.mp4）会检查文件是否存在，写错时让构建失败。
 * 外部网址（YouTube、Vimeo 等）原样返回。
 */
export function resolveVideo(src: string, where: string): VideoInfo | null {
  if (!src) return null;
  if (!src.startsWith("/")) return { src, poster: null, width: null, height: null };

  const file = path.join(PUBLIC, decodeURIComponent(src));
  if (!fs.existsSync(file)) {
    throw new Error(`找不到视频文件：${where} 填的是 "${src}"，但 public${src} 不存在`);
  }
  const jpg = file.replace(/\.[^./]+$/, ".jpg");
  if (!fs.existsSync(jpg)) return { src, poster: null, width: null, height: null };
  const size = jpegSize(jpg);
  return {
    src,
    poster: src.replace(/\.[^./]+$/, ".jpg"),
    width: size?.width ?? null,
    height: size?.height ?? null,
  };
}
