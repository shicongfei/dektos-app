# 内容编辑说明

网站上的内容都在这个 `content` 文件夹里。改完后提交到 GitHub 的 `main` 分支，Netlify 会自动重新部署（约 2–3 分钟）。

```
content/
├── cards/                  对照卡片，每张卡片一个 JSON 文件
│   └── daodejing-01.json
├── series/                 三部经典的介绍（系列页上方的文字）
│   ├── daodejing/series.json
│   ├── yijing/series.json
│   └── huangdineijing/series.json
├── daily.json              首页「今日一句」（按日期轮换）
└── membership.json         会员方案、价格、权益
```

## 新增一张卡片

复制 `cards/daodejing-01.json`，改个文件名（例如 `daodejing-02.json`、`yijing-01.json`），再修改内容：

| 字段 | 说明 |
|---|---|
| `book` | `daodejing`（道德经）/ `yijing`（易经）/ `huangdineijing`（黄帝内经） |
| `chapter` | 章号，数字，不加引号 |
| `title_zh` / `title_en` | 卡片标题 |
| `original` | 原文 |
| `vernacular_zh` | 白话（中文界面显示） |
| `translation_en` | James Legge 英译（英文界面显示） |
| `scripture_zh` | 圣经和合本 |
| `scripture_en` | 圣经 KJV |
| `scripture_ref` | 出处，用英文书名，例如 `John 1:1-3`；中文界面会自动显示为「约翰福音 1:1-3」 |
| `insight_zh` / `insight_en` | 对照点睛。中文按「；」分行，英文按句号分行 |
| `video_zh` / `video_en` | 视频网址（YouTube、Vimeo 或 mp4），留空 `""` 显示占位 |

规则：
- 同一部经典里，**章号最大的那张 = 最新一张，标「免费」**；其余标「会员」。
- 系列页按「最新在前」排列。
- 文件名只是方便你自己找，网站只看文件里的 `book` 和 `chapter`。同一部经典不能有两张同章号的卡片。

JSON 格式注意：
- 每个字段的文字都要用英文双引号 `"..."` 括起来，字段之间用英文逗号 `,` 分开，最后一个字段后面**不要**加逗号。
- 文字里如果要用英文双引号，写成 `\"`。中文引号「」“”可以直接用。
- 填错时构建会失败，Netlify 的部署日志会写明是哪个文件、哪个字段有问题。

## 修改价格

编辑 `membership.json` 中每个方案的 `monthly`（月费，新币）。
年付价格自动按 `yearly_months`（10 个月）计算，早期会员折扣为 `early_bird_discount`（0.8 = 8 折）。
