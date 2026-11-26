// 找 public/ 里的 logo 文件（服务器 / 构建时运行）
import fs from "node:fs";
import path from "node:path";

/** 有 public/logo-seal.svg 或 .png 就用它，否则返回 null（显示文字印章） */
export function getLogoSrc(): string | null {
  for (const name of ["logo-seal.svg", "logo-seal.png"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", name))) return `/${name}`;
  }
  return null;
}
