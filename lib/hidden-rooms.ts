export type HiddenRoomSlug = "lost" | "night" | "desk";

export type HiddenRoomObject = {
  label: string;
  title: string;
  body: string;
  meta: string;
};

export type HiddenRoomAction = {
  label: string;
  href: string;
};

export type HiddenRoom = {
  slug: HiddenRoomSlug;
  eyebrow: string;
  title: string;
  summary: string;
  coordinate: string;
  returnLabel: string;
  fragments: string[];
  objects: HiddenRoomObject[];
  actions: HiddenRoomAction[];
};

export const hiddenRooms: HiddenRoom[] = [
  {
    slug: "lost",
    eyebrow: "未列入站点地图",
    title: "你走到了一条没有命名的小路。",
    summary:
      "这里收留那些不像文章、也不像短札的句子。它们像被折起来的路标，只在有人误入时才展开。",
    coordinate: "37.404 / 旧链接尽头",
    returnLabel: "回到有光处",
    fragments: ["断开的锚点", "空白页背面", "未寄出的目录", "过期但不作废"],
    objects: [
      {
        label: "路牌",
        title: "不是 404",
        body: "只是有些页面不想站在大厅里。它们更适合被偶然打开。",
        meta: "found at /lost",
      },
      {
        label: "纸条",
        title: "如果你看见这句",
        body: "说明导航没有带你来这里。这个入口保持安静就好。",
        meta: "noindex / nofollow",
      },
      {
        label: "回声",
        title: "旧链接会记路",
        body: "一个站点最有趣的角落，通常不是菜单里的那几个词。",
        meta: "low traffic expected",
      },
    ],
    actions: [
      { label: "回首页", href: "/" },
      { label: "去短札", href: "/thinking" },
    ],
  },
  {
    slug: "night",
    eyebrow: "夜间值班",
    title: "凌晨的页面会小声说话。",
    summary:
      "今晚只开一盏小灯，放三首陈粒。唱片慢慢转，把白天没说完的话留给回声。",
    coordinate: "02:17 / 屏幕亮度 34%",
    returnLabel: "关掉台灯",
    fragments: ["低频噪声", "未保存草稿", "键盘回声", "窗口外的蓝黑色"],
    objects: [
      {
        label: "收音机",
        title: "FM 02.17",
        body: "频道里偶尔传来一句：明天再判断，今晚先不要优化。",
        meta: "signal weak",
      },
      {
        label: "值班单",
        title: "只处理三件事",
        body: "能睡前关掉的、会影响别人的、醒来一定忘记的。",
        meta: "night protocol",
      },
      {
        label: "暗格",
        title: "给疲劳留边界",
        body: "深夜最容易写出聪明但不必要的代码，所以这里保留慢一点的提醒。",
        meta: "soft limit",
      },
    ],
    actions: [
      { label: "回首页", href: "/" },
      { label: "读一篇文章", href: "/#articles" },
    ],
  },
  {
    slug: "desk",
    eyebrow: "书桌抽屉",
    title: "桌面上有几样东西还没收起来。",
    summary:
      "这不是作品集，也不是工具箱。只是把站主的桌面压缩成一页：杯口、便签、线缆和一些还没有归档的判断。",
    coordinate: "A4 / 左手边第二格",
    returnLabel: "合上抽屉",
    fragments: ["半杯冷咖啡", "一张便签", "线缆结", "没有标题的草稿"],
    objects: [
      {
        label: "便签",
        title: "今天别做大系统",
        body: "先把一个小交互做得像是真的有人用过，再考虑下一层结构。",
        meta: "sticky note",
      },
      {
        label: "杯子",
        title: "温度已经降下来了",
        body: "很多想法也是这样，先放一会儿，过半小时还热的才值得写。",
        meta: "desk object",
      },
      {
        label: "键盘",
        title: "空格键磨得更亮",
        body: "写作和写代码一样，删掉的部分通常比留下的部分更能决定气质。",
        meta: "daily wear",
      },
      {
        label: "线缆",
        title: "能用就先不要整理",
        body: "整洁是一种成本。只有当混乱开始索要利息时，才需要重新布线。",
        meta: "temporary order",
      },
    ],
    actions: [
      { label: "回首页", href: "/" },
      { label: "看短札", href: "/thinking" },
    ],
  },
];

export function getHiddenRoom(slug: HiddenRoomSlug) {
  const room = hiddenRooms.find((item) => item.slug === slug);
  if (!room) {
    throw new Error(`Unknown hidden room: ${slug}`);
  }
  return room;
}
