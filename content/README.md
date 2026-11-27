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

## 卡片文件

每张卡片是 `cards/` 里的一个 JSON 文件。文件名只是方便你找，网站只看文件里的内容：

- 道德经：`daodejing-05.json`，网址 `/series/daodejing/5`（章号）
- 易经、黄帝内经：一卦 / 一篇有多张卡片，网址用「章号-张号」，例如 `yijing-01-04.json` → `/series/yijing/1-4`

### 一般卡片的字段

| 字段 | 说明 |
|---|---|
| `book` | `daodejing` / `yijing` / `huangdineijing` |
| `chapter` | 第几章 / 第几卦 / 第几篇 |
| `series_index` / `series_total` | 卡片右上角的「1 / 81」「04 / 10」。易经和黄帝内经**必填**（这一卦 / 这一篇的第几张、共几张） |
| `title_zh` / `title_en` | 卡片标题 |
| `source_zh` / `source_en` | 原文出处，显示在「原文 ·」后面，例如 `彖传`、`上古天真论 · 一、时世异耶`（可留空） |
| `original` | 原文，重点字用 `**双星号**` |
| `vernacular_zh` | 白话（中文界面） |
| `translation_en` | 英译（英文界面）。要换行就写 `\n` |
| `scripture` | 圣经经文，可放多节，见下方 |
| `insight_zh` / `insight_en` | 对照点睛。中文按「；」分行；英文在「人名:」前分行；要自己决定换行就写 `\n` |
| `note_zh` / `note_en` | 「注」框（可留空） |
| `point_zh` / `point_en` | 「对读点」小字（可留空） |
| `highlight_lines` | 易经：右侧卦象要标色的爻，例如 `[1, 5, 6]`（自下而上） |
| `lines_label_zh` / `lines_label_en` | 易经：卦象下的说明，例如 `初 · 五 · 上`（留空就显示卦名） |
| `video_zh` / `video_en` | 视频，见下方「视频」。留空 `""` 就不显示播放器 |

### 经文 `scripture`

每节一组 `{ }`。中文卡片和英文卡片引用的经节不一样时，没有的那种语言留空 `""`，网站在该语言下就不显示那一节：

```json
"scripture": [
  { "text_zh": "亚当共活了**九百三十**岁……", "text_en": "", "ref_zh": "创世记 5:5", "ref_en": "" },
  { "text_zh": "若因一人的过犯，死就因这一人**作了王**……",
    "text_en": "For if by one man's offence **death reigned** by one;\nmuch more they ...",
    "ref_zh": "罗马书 5:17", "ref_en": "Romans 5:17" }
]
```

圣经色块里的 `**重点字**`：黄帝内经显示为金色，道德经、易经显示为粗体白字。

### 易经：卦的总览卡

每一卦一张，`"type": "hexagram"`，`series_index` 为 1。参考 `cards/yijing-01-01.json`：

| 字段 | 说明 |
|---|---|
| `name_zh` | 卦名大字：`乾` |
| `title_zh` / `title_en` | `乾为天` / `Qian · Heaven` |
| `judgment_zh` / `judgment_en` | 卦辞：中文接在标题后（`元亨利贞`），英文在标题下以斜体显示 |
| `short_en` | 对读卡卦象下的英文名：`Qian · Heaven` |
| `upper_zh` / `lower_zh` | 上卦、下卦：`乾`（中文显示为「上乾下乾」）；`upper_en` / `lower_en` 目前不显示 |
| `summary_zh` / `summary_en` | `六爻 × 九张对读` |
| `lines` | 六爻，**自下而上**正好 6 个：`name_zh`、`name_en`、`text_zh`、`text_en`、`card`（对读卡的张号；对应多张时写 `[4, 8]`） |
| `see_also` | 另见：`label_zh`、`label_en`、`text_zh`、`text_en`、`card` |
| `note_zh` / `note_en` | 「注」 |

阴爻、阳爻由爻名自动判断：含「九」画成整条，含「六」画成中间断开。点编号会跳到同一卦里那一张对读卡；还没建立的编号显示为灰色。

## 视频

把 mp4 放进仓库的 `public/videos/`，卡片里填路径（以 `/videos/` 开头）：

```json
"video_zh": "/videos/ddj-01-zh.mp4",
"video_en": "/videos/ddj-01-en.mp4"
```

- 封面：同一个文件夹里放同名的 `.jpg`（例如 `ddj-01-zh.jpg`），会自动当作封面
- 竖屏视频在页面里会裁成 11:10（比正方形略宽），取景偏下（保住人像和字幕）；点全屏时看到完整画面。某张卡片要调整取景，加 `"video_focus": 60`（0 = 最上，100 = 最下，默认 66）
- 中文界面播放 `video_zh`，英文界面播放 `video_en`；只填一种时两种界面都播放那一个
- 也可以填 YouTube 或 Vimeo 网址
- 路径写错（文件不存在）时构建会失败，Netlify 部署日志会写明是哪张卡片
- 建议格式：H.264 + AAC 的 mp4（手机都能播）。GitHub 网页上传单个文件最大 25 MB

## 规则
- 同一部经典里，排在最后的那张（章号、张号最大）= 最新一张，标「免费」；其余标「会员」。
- 系列页按「最新在前」排列。

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
