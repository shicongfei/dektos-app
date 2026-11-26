// 找 public/ 里的 logo 文件（服务器 / 构建时运行）
import fs from "node:fs";
import path from "node:path";

export type Logo = { src: string; width: number; height: number };

/** 读出 PNG / SVG 的宽高，用来保持原比例 */
function size(file: string): { width: number; height: number } {
  const buf = fs.readFileSync(file);
  if (file.endsWith(".png")) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  const svg = buf.toString("utf8");
  const vb = svg.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
  return vb ? { width: Number(vb[1]), height: Number(vb[2]) } : { width: 1, height: 1 };
}

/** 有 public/logo-seal.svg 或 .png 就用它，否则返回 null（显示文字印章） */
export function getLogo(): Logo | null {
  for (const name of ["logo-seal.svg", "logo-seal.png"]) {
    const file = path.join(process.cwd(), "public", name);
    if (fs.existsSync(file)) return { src: `/${name}`, ...size(file) };
  }
  return null;
}
