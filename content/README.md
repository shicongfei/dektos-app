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

## 新增一张对照卡片

复制 `cards/daodejing-01.json`，改个文件名（例如 `daodejing-02.json`），再修改内容：

| 字段 | 说明 |
|---|---|
| `book` | `daodejing`（道德经）/ `yijing`（易经）/ `huangdineijing`（黄帝内经） |
| `chapter` | 第几章 / 第几卦 / 第几篇，数字，不加引号 |
| `no` | 卡片编号（可省略，省略时等于 `chapter`）。同一部经典里不能重复，网址就是 `/series/书名/编号`。易经一卦有多张卡片时必须填 |
| `series_index` / `series_total` | 显示在卡片右上角的「1 / 81」「1 / 7」，可省略 |
| `title_zh` / `title_en` | 卡片标题 |
| `original` | 原文，重点字用 `**双星号**` 标出 |
| `vernacular_zh` | 白话（中文界面，显示在注释框里） |
| `translation_en` | James Legge 英译（英文界面） |
| `scripture` | 圣经经文，可放多节，见下方 |
| `insight_zh` / `insight_en` | 对照点睛，重点字用 `**双星号**`。中文按「；」分行，英文按句号分行 |
| `video_zh` / `video_en` | 视频网址（YouTube、Vimeo 或 mp4），留空 `""` 显示占位 |

`scripture` 的写法（每节一组 `{ }`，组与组之间用逗号）：

```json
"scripture": [
  {
    "text_zh": "你们的身子就是**圣灵的殿**。",
    "text_en": "Your body is the **temple of the Holy Ghost**.",
    "ref_zh": "哥林多前书 6:19",
    "ref_en": "1 Corinthians 6:19"
  },
  {
    "text_zh": "当守安息日，守为圣日。",
    "text_en": "Remember the sabbath day, to keep it holy.",
    "ref_zh": "出埃及记 20:8",
    "ref_en": "Exodus 20:8"
  }
]
```

圣经色块里的 `**重点字**`：黄帝内经显示为金色，道德经和易经显示为粗体白字。

## 易经：卦的总览卡

每一卦一张总览卡，`"type": "hexagram"`，参考 `cards/yijing-01-qian.json`：

| 字段 | 说明 |
|---|---|
| `type` | 固定写 `"hexagram"` |
| `chapter` / `no` | 第几卦 / 这张总览卡的编号 |
| `name_zh` / `name_en` | 卦名 |
| `judgment_zh` / `judgment_en` | 卦辞（`judgment_en` 放 Legge 译文） |
| `upper_zh` / `upper_en`、`lower_zh` / `lower_en` | 上卦、下卦，例如 `"乾 ☰ 天"` |
| `lines` | 六爻，**自下而上**正好 6 个：`name_zh`（初九、六二……）、`name_en`、`text_zh`（爻辞）、`text_en`、`card`（对应对读卡的编号） |
| `see_also` | 另见：`label_zh`、`label_en`、`card`（例如用九、彖传、大象、说卦） |

- 阴爻、阳爻由爻名自动判断：含「九」画成阳爻（整条），含「六」画成阴爻（中间断开）。
- 点一爻或「另见」会跳到对应编号的卡片；那张卡片还没建立时，显示「待上线」，不能点。
- 乾卦的总览卡已经建好作为示范。英文字段都还空着；六爻指向的编号 2–7、另见指向的 8–11，只是我先暂定的，可以改。

## 规则
- 同一部经典里，**编号最大的那张 = 最新一张，标「免费」**；其余标「会员」。
- 系列页按「最新在前」排列。
- 文件名只是方便你自己找，网站只看文件里的 `book` 和编号。

## JSON 格式注意
- 每个字段的文字都要用英文双引号 `"..."` 括起来，字段之间用英文逗号 `,` 分开，最后一项后面**不要**加逗号。
- 文字里如果要用英文双引号，写成 `\"`。中文引号「」“”可以直接用。
- 填错时构建会失败，Netlify 的部署日志会写明是哪个文件、哪个字段有问题。

## Logo 与颜色
- Logo 和图标都放在仓库的 `public/` 文件夹（不是根目录）：
  - `logo-seal.png`（或 `.svg`）：页首、卡片底部的印章，按原比例显示
  - `logo-full.png`：印章加 DEKTOS，用在登录页
  - `favicon-32.png`、`apple-touch-icon.png`、`icon-192.png`、`icon-512.png`：浏览器标签图标和「加到主屏幕」图标
  - 要换图时，用同样的文件名上传到 `public/` 覆盖即可
- 各书的子品牌名称在 `series/<书名>/series.json` 的 `brand_zh` / `brand_en`；颜色在 `app/globals.css` 开头。

## 修改价格

编辑 `membership.json` 中每个方案的 `monthly`（月费，新币）。
年付价格自动按 `yearly_months`（10 个月）计算，早期会员折扣为 `early_bird_discount`（0.8 = 8 折）。
