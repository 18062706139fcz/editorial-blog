import type { Metadata } from "next";
import A2UIRenderer from "@/components/features/desk/A2UIRenderer";
import type { DeskA2UI } from "@/lib/features/desk/types";

export const metadata: Metadata = {
  title: "Desk A2UI Lab — Ryker",
  description: "Hidden static samples for the /desk A2UI toy.",
  robots: {
    index: false,
    follow: false,
  },
};

const sampleDeskA2UI: DeskA2UI[] = [
  {
    type: "note",
    title: "组件只接 schema",
    body: "这里展示的是白名单 A2UI，不渲染模型返回的 HTML。",
    meta: "lab sample",
    tags: ["safe", "schema"],
  },
  {
    type: "artifactList",
    title: "可被临时托住的对象",
    description: "把模糊想法拆成几个可继续判断的对象。",
    items: [
      {
        label: "note",
        title: "一句判断",
        body: "先让它具体，而不是先让它完整。",
      },
      {
        label: "link",
        title: "回到短札",
        body: "需要公开阅读时再离开 /desk。",
        href: "/thinking",
      },
    ],
  },
  {
    type: "decisionMatrix",
    title: "玩具还是产品？",
    options: [
      {
        option: "留在 /desk",
        upside: "不打扰主页气质。",
        risk: "发现成本高。",
        verdict: "符合 hidden room。",
      },
      {
        option: "做成公开入口",
        upside: "更容易被看到。",
        risk: "会改变博客叙事。",
        verdict: "第一版不做。",
      },
    ],
    recommendation: "先做隐藏玩具，等形态稳定后再判断是否公开。",
  },
  {
    type: "commandHints",
    title: "Local commands",
    hints: [
      { command: "/help", description: "查看命令列表" },
      { command: "/show examples", description: "渲染本地样例" },
      { command: "/clear", description: "重置当前 session" },
    ],
  },
];

export default function DeskLabPage() {
  return (
    <div className="relative left-1/2 min-h-[calc(100svh-4rem)] w-screen -translate-x-1/2 bg-[#080a0c] px-4 py-8 text-[#d6e2d6] sm:px-6">
      <main className="mx-auto w-full max-w-6xl">
        <div className="border-b border-white/10 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-label text-[#82d99b]">
            /desk/lab
          </p>
          <h1 className="mt-3 font-mono text-3xl text-[#f4f7f1]">
            A2UI component room
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#d6e2d6]/62">
            Static hidden samples for the schema components used by the desk
            toy. This route does not call DeepSeek.
          </p>
        </div>
        <div className="mt-6 space-y-8 font-mono">
          {sampleDeskA2UI.map((ui) => (
            <div
              key={`${ui.type}-${"title" in ui ? ui.title : "sample"}`}
              className="border-l border-white/10 pl-4"
            >
              <A2UIRenderer ui={ui} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
