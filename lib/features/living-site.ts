export type StatusItem = {
  label: string;
  value: string;
};

export type Quote = {
  text: string;
  source: string;
};

export type PostEasterEgg = {
  title: string;
  items: Array<{
    label: string;
    value: string;
  }>;
};

export const TODAY_STATUS_ITEMS: StatusItem[] = [];

export const HITOKOTO_ENDPOINT = "https://v1.hitokoto.cn/?c=d&c=i&c=k";

const POST_EASTER_EGGS: PostEasterEgg[] = [
  {
    title: "写作边角",
    items: [
      { label: "写这篇时", value: "桌上有一杯快凉掉的咖啡" },
      { label: "背景声", value: "循环播放的轻音乐" },
      { label: "卡在", value: "删掉那些听起来正确但没有用的句子" },
    ],
  },
  {
    title: "写作边角",
    items: [
      { label: "写这篇时", value: "浏览器开了太多标签页" },
      { label: "背景声", value: "雨声、风扇和偶尔的通知" },
      { label: "卡在", value: "给一个复杂想法找到短句子" },
    ],
  },
  {
    title: "写作边角",
    items: [
      { label: "写这篇时", value: "先写了结论，再把路铺回来" },
      { label: "背景声", value: "深夜的房间很安静" },
      { label: "卡在", value: "判断这是不是值得公开的一段" },
    ],
  },
];

export function getVisibleStatusItems(items = TODAY_STATUS_ITEMS) {
  return items
    .map((item) => ({ ...item, value: item.value.trim() }))
    .filter((item) => item.value.length > 0);
}

export function normalizeHitokotoQuote(data: {
  hitokoto?: string | null;
  from?: string | null;
  from_who?: string | null;
}): Quote {
  const source = [data.from_who, data.from].filter(Boolean).join("·");

  return {
    text: data.hitokoto?.trim() || "我们塑造工具，此后工具塑造我们。",
    source: source || "一言",
  };
}

export function selectPostEasterEgg(slug: string) {
  const index = hashString(slug) % POST_EASTER_EGGS.length;
  return POST_EASTER_EGGS[index];
}

export function buildPresenceCopy(online: number) {
  if (online <= 0) return "此刻页面很安静";
  if (online === 1) return "你正在翻页";
  return `你和 ${online - 1} 个人正在翻页`;
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
