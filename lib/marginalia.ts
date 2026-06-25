export type ArtifactKind =
  | "Observation"
  | "Quote"
  | "Prompt"
  | "Link"
  | "Rubric"
  | "Question";

export type ArtifactThread = string;
export type ArtifactTone = "Paper" | "Ink" | "Ember" | "Blueprint";
export type ArtifactSize = "Feature" | "Wide" | "Tall" | "Small";
export type ThoughtMode =
  | "all"
  | "note"
  | "question"
  | "quote"
  | "prompt"
  | "tool"
  | "object";

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  body: string;
  thread: ArtifactThread;
  tone: ArtifactTone;
  size: ArtifactSize;
  pinned: boolean;
  visible: boolean;
  createdAt: string;
  source?: string;
  href?: string;
  items?: string[];
  tags?: string[];
  stats?: {
    views: number;
    likes: number;
    comments: number;
  };
  object?: {
    label: string;
    title: string;
    meta: string;
    description: string;
  };
};

const sizeRank: Record<ArtifactSize, number> = {
  Feature: 0,
  Wide: 1,
  Tall: 2,
  Small: 3,
};

const sizeClasses: Record<ArtifactSize, string> = {
  Feature: "md:col-span-2 md:row-span-2 min-h-[18rem]",
  Wide: "md:col-span-2 min-h-[12rem]",
  Tall: "md:row-span-2 min-h-[16rem]",
  Small: "min-h-[11rem]",
};

const kindLabels: Record<ArtifactKind, string> = {
  Observation: "随想",
  Quote: "摘录",
  Prompt: "提示词",
  Link: "对象",
  Rubric: "清单",
  Question: "提问",
};

const modeLabels: Record<ThoughtMode, string> = {
  all: "全部",
  note: "随想",
  question: "提问",
  quote: "摘录",
  prompt: "提示词",
  tool: "工具",
  object: "对象",
};

const modeDescriptions: Record<ThoughtMode, string> = {
  all: "所有短札",
  note: "刚出现的判断",
  question: "还没答案",
  quote: "值得留下的句子",
  prompt: "可复用的问法",
  tool: "清单和方法",
  object: "链接、书影音、项目",
};

export const sampleArtifacts: Artifact[] = [
  {
    id: "review-rubric",
    kind: "Rubric",
    title: "一次代理交付前，我会看这五件事",
    body: "不是为了显得严谨，而是为了避免把漂亮但不可用的东西交出去。",
    thread: "工具",
    tone: "Paper",
    size: "Feature",
    pinned: true,
    visible: true,
    createdAt: "2026-06-22",
    items: ["正确", "有边界", "能读懂", "可回退", "值得做"],
    tags: ["交付", "检查清单"],
    stats: { views: 246, likes: 22, comments: 4 },
  },
  {
    id: "prompt-slip",
    kind: "Prompt",
    title: "做一次品味审稿",
    body: "不要只判断正确性。指出它哪里太泛、哪里太满，以及这个界面是否真的应该存在。",
    thread: "提示词",
    tone: "Ink",
    size: "Wide",
    pinned: false,
    visible: true,
    createdAt: "2026-06-20",
    tags: ["提示词", "设计评审"],
    stats: { views: 158, likes: 16, comments: 2 },
  },
  {
    id: "context-note",
    kind: "Observation",
    title: "上下文本身就是界面。",
    body: "在代理产品里，最关键的交互经常不是用户看见的部分，而是模型看见的那一层。",
    thread: "随想",
    tone: "Ember",
    size: "Tall",
    pinned: false,
    visible: true,
    createdAt: "2026-06-18",
    tags: ["AI", "上下文"],
    stats: { views: 312, likes: 29, comments: 5 },
  },
  {
    id: "quote-compression",
    kind: "Quote",
    title: "品味是压缩。",
    body: "一句能解释很多小选择的话：当你删掉噪音，剩下的就是判断。",
    thread: "摘录",
    tone: "Paper",
    size: "Small",
    pinned: false,
    visible: true,
    createdAt: "2026-06-16",
    source: "边注",
    tags: ["品味"],
    stats: { views: 119, likes: 13, comments: 1 },
  },
  {
    id: "question-refusal",
    kind: "Question",
    title: "代理应该拒绝自动化什么？",
    body: "能力本身没有边界感。真正有意思的是：什么事情即使能做，也不该替人做。",
    thread: "提问",
    tone: "Blueprint",
    size: "Tall",
    pinned: false,
    visible: true,
    createdAt: "2026-06-14",
    tags: ["AI", "边界"],
    stats: { views: 204, likes: 18, comments: 6 },
  },
  {
    id: "bookmark-constraints",
    kind: "Link",
    title: "把约束当成设计材料",
    body: "留下这个链接，是因为约束比装饰更快暴露一个人的判断。",
    thread: "对象",
    tone: "Paper",
    size: "Wide",
    pinned: false,
    visible: true,
    createdAt: "2026-06-12",
    source: "参考",
    href: "https://linear.app/now",
    tags: ["约束", "产品"],
    stats: { views: 96, likes: 8, comments: 1 },
  },
  {
    id: "llm-workload",
    kind: "Observation",
    title: "AI 抬高的不是效率，是底线。",
    body: "工具省下来的时间，经常不会变成更多思考空间，而是变成别人对产出的更高期待。",
    thread: "随想",
    tone: "Blueprint",
    size: "Wide",
    pinned: false,
    visible: true,
    createdAt: "2026-06-10",
    tags: ["工作", "AI"],
    stats: { views: 184, likes: 17, comments: 3 },
  },
  {
    id: "review-question",
    kind: "Question",
    title: "怎样才能让它更容易被删除？",
    body: "评审原型、抽象和流程时，这个问题比“它还能加什么”更有用。",
    thread: "提问",
    tone: "Paper",
    size: "Small",
    pinned: false,
    visible: true,
    createdAt: "2026-06-08",
    tags: ["评审", "架构"],
    stats: { views: 73, likes: 6, comments: 0 },
  },
  {
    id: "movie-object",
    kind: "Link",
    title: "一个关于“模拟在场”的对象",
    body: "以后写 AI 伴侣时会用到：记忆、失去，以及技术给出的危险替身。",
    thread: "对象",
    tone: "Ink",
    size: "Wide",
    pinned: false,
    visible: true,
    createdAt: "2026-06-06",
    source: "TMDB",
    tags: ["影像", "记忆"],
    stats: { views: 128, likes: 12, comments: 2 },
    object: {
      label: "TV · 2018",
      title: "Steins;Gate 0",
      meta: "Sci-Fi & Fantasy / Animation",
      description: "一个人试图和失去共处，而技术给了他一个近似在场的危险替代品。",
    },
  },
  {
    id: "prompt-red-team",
    kind: "Prompt",
    title: "红队一下它的品味。",
    body: "找出界面里最像模板的部分，然后给出一个只可能属于这个产品的具体改法。",
    thread: "提示词",
    tone: "Paper",
    size: "Small",
    pinned: false,
    visible: true,
    createdAt: "2026-06-04",
    tags: ["提示词", "品味"],
    stats: { views: 61, likes: 5, comments: 0 },
  },
  {
    id: "quote-scope",
    kind: "Quote",
    title: "小范围也是一种设计材料。",
    body: "用来抵抗把每个边角功能都做成平台的冲动。",
    thread: "摘录",
    tone: "Ember",
    size: "Small",
    pinned: false,
    visible: true,
    createdAt: "2026-06-02",
    source: "工作台",
    tags: ["范围"],
    stats: { views: 88, likes: 9, comments: 1 },
  },
];

export function getCabinetArtifacts(artifacts: Artifact[], limit = 8) {
  return [...artifacts]
    .filter((artifact) => artifact.visible)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const bySize = sizeRank[a.size] - sizeRank[b.size];
      if (bySize !== 0) return bySize;
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    })
    .slice(0, limit);
}

export function artifactThoughtMode(artifact: Artifact): ThoughtMode {
  if (artifact.object || artifact.kind === "Link") return "object";
  if (artifact.kind === "Question") return "question";
  if (artifact.kind === "Quote") return "quote";
  if (artifact.kind === "Prompt") return "prompt";
  if (artifact.kind === "Rubric") return "tool";
  return "note";
}

export function getThinkingArtifacts(
  artifacts: Artifact[],
  mode: ThoughtMode = "all",
) {
  return [...artifacts]
    .filter((artifact) => artifact.visible)
    .filter((artifact) =>
      mode === "all" ? true : artifactThoughtMode(artifact) === mode,
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getArtifactThreads(artifacts: Artifact[]) {
  return getThinkingArtifacts(artifacts).reduce<ArtifactThread[]>(
    (threads, artifact) =>
      threads.includes(artifact.thread)
        ? threads
        : [...threads, artifact.thread],
    [],
  );
}

export function artifactSizeClass(size: ArtifactSize) {
  return sizeClasses[size];
}

export function artifactKindLabel(kind: ArtifactKind) {
  return kindLabels[kind];
}

export function getThoughtModeLabel(mode: ThoughtMode) {
  return modeLabels[mode];
}

export function getThoughtModeDescription(mode: ThoughtMode) {
  return modeDescriptions[mode];
}

export function getThoughtModes(artifacts: Artifact[]) {
  const visible = getThinkingArtifacts(artifacts);
  const counts = visible.reduce<Record<ThoughtMode, number>>(
    (acc, artifact) => {
      const mode = artifactThoughtMode(artifact);
      acc[mode] += 1;
      acc.all += 1;
      return acc;
    },
    {
      all: 0,
      note: 0,
      question: 0,
      quote: 0,
      prompt: 0,
      tool: 0,
      object: 0,
    },
  );

  const order: ThoughtMode[] = [
    "all",
    "note",
    "question",
    "quote",
    "prompt",
    "tool",
    "object",
  ];

  return order
    .filter((mode) => counts[mode] > 0)
    .map((mode) => ({
      key: mode,
      label: modeLabels[mode],
      description: modeDescriptions[mode],
      count: counts[mode],
    }));
}
