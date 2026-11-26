import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ThemeRoot } from "@/components/Brand";
import { getLogo } from "@/lib/logo";

export const metadata: Metadata = {
  title: "悦纳 Dektos · 以经解经 · 东西对读",
  description: "以中国经典与圣经互相映照：易经、道德经、黄帝内经逐章对读。",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  appleWebApp: { title: "悦纳 Dektos", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3ECE0",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <LangProvider>
          <ThemeRoot logo={getLogo()}>
            <Header />
            <main className="mx-auto max-w-app px-4 pb-28 pt-5">{children}</main>
            <BottomNav />
          </ThemeRoot>
        </LangProvider>
      </body>
    </html>
  );
}
