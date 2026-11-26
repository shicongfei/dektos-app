import type { MetadataRoute } from "next";

// 「加到主屏幕」时使用的名称与图标
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "悦纳 Dektos · 以经解经 · 东西对读",
    short_name: "悦纳 Dektos",
    start_url: "/",
    display: "standalone",
    background_color: "#F3ECE0",
    theme_color: "#F3ECE0",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
