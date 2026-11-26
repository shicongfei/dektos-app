# 悦纳 Dektos · 以经解经 · 东西对读

Next.js（App Router）+ TypeScript + Tailwind CSS 网页 App，第一版框架。

## 本地运行

```bash
npm install
npm run dev        # 打开 http://localhost:3000
npm run build      # 生产构建
```

## 目录

- `app/` 页面：首页、`/courses`、`/series/[slug]`、`/series/[slug]/[chapter]`、`/membership`、`/login`、`/me`
- `components/` 界面组件（印章、底部导航、语言切换等）
- `content/` **经文与课程内容**，编辑方法见 [`content/README.md`](content/README.md)
- `lib/i18n.ts` 界面中英文文字
- `lib/access.ts` 会员规则（免费章节数、预览模式）

## 尚未接入

登录、付款、数据库。目前 `lib/access.ts` 中 `PREVIEW_MODE = true`，
「圣经对读」等会员内容会标示解锁等级，但暂时开放浏览。

## 部署到 Netlify

见仓库中的 `netlify.toml`；在 Netlify 选择 “Import from Git” 并连接此 GitHub 仓库即可。
