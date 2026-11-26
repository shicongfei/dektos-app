// 界面文字（中 / 英）。经文和课程内容在 /content 文件夹。
export type Lang = "zh" | "en";

export const ui = {
  tagline: { zh: "Scripture Interprets Scripture", en: "East & West in Dialogue" },
  heroSub: {
    zh: "以中国经典与圣经互相映照，逐章细读，体会东西方智慧的相遇。",
    en: "Chinese classics and the Bible, read side by side, chapter by chapter.",
  },
  todayVerse: { zh: "今日一句", en: "Today's Verse" },
  series: { zh: "经典系列", en: "Classic Series" },
  chapters: { zh: "章节", en: "Chapters" },
  chaptersCount: { zh: "共 {n} 章", en: "{n} chapters" },
  comingSoon: { zh: "即将上线", en: "Coming soon" },
  free: { zh: "免费", en: "Free" },
  basic: { zh: "基础会员", en: "Basic" },
  advanced: { zh: "进阶会员", en: "Advanced" },
  advancedUnlock: { zh: "进阶会员解锁", en: "Advanced members" },
  nav: {
    home: { zh: "首页", en: "Home" },
    courses: { zh: "课程", en: "Courses" },
    membership: { zh: "会员", en: "Membership" },
    me: { zh: "我的", en: "Me" },
  },
  original: { zh: "原文", en: "Original" },
  translation: { zh: "英文译文", en: "English Translation" },
  translationPending: {
    zh: "英文译文（James Legge 译本）即将补上。",
    en: "James Legge's translation will be added soon.",
  },
  textTab: { zh: "原文与译文", en: "Text" },
  bibleTab: { zh: "圣经对读", en: "Bible Parallel" },
  readingNote: { zh: "对读要点", en: "Reading Notes" },
  videoPending: { zh: "课程视频即将上线", en: "Video coming soon" },
  previewNotice: {
    zh: "预览版：会员功能尚未开通，内容暂时开放浏览。",
    en: "Preview: memberships are not live yet, so this content is open for now.",
  },
  viewPlans: { zh: "查看会员方案", en: "View plans" },
  prev: { zh: "上一章", en: "Previous" },
  next: { zh: "下一章", en: "Next" },
  backToSeries: { zh: "返回目录", en: "Back to contents" },
  startReading: { zh: "开始阅读", en: "Start reading" },
  monthly: { zh: "月付", en: "Monthly" },
  yearly: { zh: "年付", en: "Yearly" },
  perMonth: { zh: "/月", en: "/mo" },
  perYear: { zh: "/年", en: "/yr" },
  yearlySave: { zh: "年付只需 10 个月价格", en: "Pay 10 months, get 12" },
  earlyBird: { zh: "早期会员 · 首年 8 折", en: "Early member · 20% off first year" },
  earlyBirdPrice: { zh: "首年", en: "First year" },
  choosePlan: { zh: "选择此方案", en: "Choose plan" },
  currentPlan: { zh: "当前方案", en: "Current plan" },
  paymentSoon: { zh: "付款功能即将开通", en: "Payments coming soon" },
  membershipTitle: { zh: "会员方案", en: "Membership" },
  membershipSub: {
    zh: "选择适合你的方案，与我们一同细读经典。",
    en: "Choose a plan and read the classics with us.",
  },
  login: { zh: "登录", en: "Log in" },
  loginTitle: { zh: "登录悦纳", en: "Log in to Dektos" },
  email: { zh: "电子邮箱", en: "Email" },
  password: { zh: "密码", en: "Password" },
  forgot: { zh: "忘记密码？", en: "Forgot password?" },
  noAccount: { zh: "还没有账号？", en: "No account yet?" },
  signup: { zh: "注册", en: "Sign up" },
  orContinue: { zh: "或使用以下方式", en: "or continue with" },
  loginSoon: { zh: "登录功能即将开通，目前仅为界面预览。", en: "Login is not live yet — this is a preview." },
  meTitle: { zh: "我的", en: "Me" },
  guest: { zh: "访客", en: "Guest" },
  guestSub: { zh: "登录后可同步学习进度", en: "Log in to sync your progress" },
  language: { zh: "语言", en: "Language" },
  myPlan: { zh: "我的会员", en: "My plan" },
  about: { zh: "关于悦纳", en: "About Dektos" },
  aboutText: {
    zh: "悦纳（Dektos）致力于把中国经典与圣经放在一起阅读，在对照中彼此照亮。",
    en: "Dektos reads the Chinese classics and the Bible side by side, letting each shed light on the other.",
  },
  notFound: { zh: "找不到这个页面", en: "Page not found" },
  backHome: { zh: "回到首页", en: "Back to home" },
} as const;

export type Bi = { zh: string; en: string };

export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
