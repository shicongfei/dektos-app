# 内容编辑说明

网站上的经文和课程内容都在这个 `content` 文件夹里。改完后提交到 GitHub，Netlify 会自动重新部署。

```
content/
├── daily.json              首页「今日一句」（按日期轮换）
├── membership.json         会员方案、价格、权益
└── series/
    ├── daodejing/
    │   ├── series.json     系列介绍
    │   └── chapters/
    │       ├── 01.md       每章一个文件
    │       └── ...
    ├── yijing/series.json
    └── huangdineiji/series.json
```

## 新增一章

复制 `series/daodejing/chapters/01.md`，改名为下一章（例如 `07.md`），然后修改里面的内容：

```yaml
---
chapter: 7                       # 章号（决定排序，前 2 章自动标「免费」）
title_zh: 第七章 · 天长地久
title_en: "Chapter 7 · Heaven Is Lasting"
video: ""                        # 视频链接：YouTube / Vimeo / mp4，留空显示占位
original: |                      # 原文：竖线后每行缩进两格，一句一行
  天长地久。
  ……
translation_en: |                # James Legge 英译，同样每行缩进两格；留空显示「即将补上」
  Heaven is long-enduring and earth continues long.
bible:                           # 圣经对读，可以有多段
  - ref_zh: 约翰福音 1:1
    ref_en: John 1:1
    cuv: 和合本经文
    kjv: King James Version 经文
note_zh: 中文对读要点
note_en: English reading note
---
```

注意事项：
- 两个 `---` 之间的格式是 YAML：冒号后要有一个空格，缩进只能用空格，不能用 Tab。
- 英文里如果有冒号 `:` 或以引号开头，整段要用双引号包起来（参考 02.md）。
- `translation_en` 目前留空 `""`；要补译文时，把 `""` 改成 `|`，再在下一行起逐行缩进两格写入。

## 新增系列的章节

`易经` 和 `黄帝内经` 目前只有 `series.json`，其中 `planned` 列出的章节会显示「即将上线」。
要正式上线某一章，在该系列文件夹下建立 `chapters/01.md`（格式同上）即可。

## 修改价格

编辑 `membership.json` 中每个方案的 `monthly`（月费，新币）。
年付价格自动按 `yearly_months`（10 个月）计算，早期会员折扣为 `early_bird_discount`（0.8 = 8 折）。
