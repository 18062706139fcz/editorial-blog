import type { Metadata } from "next";
import A2UIRenderer from "@/components/features/desk/A2UIRenderer";
import type { DeskA2UI } from "@/lib/features/desk/types";

export const metadata: Metadata = {
  title: "Desk A2UI Lab — Ryker",
  description: "Hidden protocol walkthrough for the /desk A2UI toy.",
  robots: {
    index: false,
    follow: false,
  },
};

const sampleDeskA2UI: DeskA2UI = {
  type: "decisionMatrix",
  title: "要不要把 /desk 做成公开功能？",
  options: [
    {
      option: "继续隐藏",
      upside: "不破坏博客主页叙事，允许实验失败。",
      risk: "发现成本高，反馈少。",
      verdict: "适合当前阶段。",
    },
    {
      option: "公开入口",
      upside: "更容易被看到，也更像一个正式产品。",
      risk: "会把玩具变成承诺，A2UI 协议还不够稳。",
      verdict: "等 action loop 成熟再做。",
    },
  ],
  recommendation: "先保留 hidden room，把协议、渲染边界和操作回流做清楚。",
};

const protocolTrace = [
  {
    phase: "01",
    name: "surfaceUpdate",
    body: "Agent 不返回 HTML，而是声明一个 surface：组件类型、标题、字段、可执行 action。",
    payload: {
      surfaceId: "desk.plan.choice",
      component: "decisionMatrix",
      intent: "help_user_compare_options",
      actions: ["choose_option", "ask_follow_up"],
    },
  },
  {
    phase: "02",
    name: "dataModelUpdate",
    body: "Agent 更新数据模型；客户端只接受白名单字段，丢弃脚本、iframe 和未知组件。",
    payload: {
      options: ["继续隐藏", "公开入口"],
      recommendation: "先保留 hidden room",
      validation: "schema_whitelist",
    },
  },
  {
    phase: "03",
    name: "beginRendering",
    body: "客户端用可信 React 组件渲染 surface。模型只决定结构和数据，不决定 DOM 权限。",
    payload: {
      renderer: "A2UIRenderer",
      trustedComponents: ["note", "artifactList", "decisionMatrix", "commandHints"],
      htmlFromModel: false,
    },
  },
  {
    phase: "04",
    name: "userAction",
    body: "用户点击、选择、编辑后，客户端把 action event 回写给 agent，继续对话或更新 surface。",
    payload: {
      action: "choose_option",
      value: "继续隐藏",
      nextAgentStep: "explain_tradeoff_or_update_surface",
    },
  },
];

const gates = [
  {
    name: "action completeness",
    body: "界面给了按钮、选择或编辑入口，就必须定义对应 action、参数和回流结果。",
  },
  {
    name: "no_ui_chat",
    body: "如果任务不需要结构化操作，就不要硬渲染 UI；普通文本回答更好。",
  },
  {
    name: "schema safety",
    body: "模型输出只是一份 schema。渲染器必须验证组件类型、字段长度、链接协议和 action 名。",
  },
];

function ProtocolPayload({ payload }: { payload: Record<string, unknown> }) {
  return (
    <pre className="mt-3 overflow-x-auto text-[12px] leading-6 text-[#d6e2d6]/58">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}

export default function DeskLabPage() {
  return (
    <div className="relative left-1/2 min-h-[calc(100svh-4rem)] w-screen -translate-x-1/2 bg-[#080a0c] px-4 py-8 text-[#d6e2d6] sm:px-6">
      <main className="mx-auto w-full max-w-7xl font-mono">
        <div className="border-b border-white/10 pb-6">
          <p className="text-[10px] uppercase tracking-label text-[#82d99b]">
            /desk/lab
          </p>
          <h1 className="mt-3 text-3xl text-[#f4f7f1]">
            A2UI protocol lab
          </h1>
          <p className="mt-3 max-w-3xl text-[13px] leading-7 text-[#d6e2d6]/64">
            A2UI is an agent-to-user interface loop: the agent proposes a
            declarative surface, the client validates and renders trusted
            components, then user actions flow back as structured events. The
            interesting part is not the component gallery; it is the protocol
            boundary.
          </p>
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(26rem,0.95fr)]">
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-label text-[#d6e2d6]/42">
              <span className="text-[#82d99b]">trace</span>
              <span>model output {"->"} trusted surface {"->"} action event</span>
            </div>
            <div className="space-y-7">
              {protocolTrace.map((step) => (
                <article
                  key={step.name}
                  className="grid gap-3 sm:grid-cols-[3rem_minmax(0,1fr)]"
                >
                  <span className="text-[13px] text-[#82d99b]">
                    {step.phase}
                  </span>
                  <div className="border-l border-white/10 pl-4">
                    <h2 className="text-[15px] text-[#f4f7f1]">
                      {step.name}
                    </h2>
                    <p className="mt-2 text-[13px] leading-7 text-[#d6e2d6]/68">
                      {step.body}
                    </p>
                    <ProtocolPayload payload={step.payload} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="border-l border-white/10 pl-5">
            <p className="text-[10px] uppercase tracking-label text-[#e0b46a]">
              rendered trusted surface
            </p>
            <div className="mt-4">
              <A2UIRenderer ui={sampleDeskA2UI} />
            </div>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-label text-[#82d99b]">
                gates
              </p>
              <div className="mt-3 space-y-4">
                {gates.map((gate) => (
                  <div key={gate.name}>
                    <h3 className="text-[13px] text-[#f4f7f1]">
                      {gate.name}
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-[#d6e2d6]/62">
                      {gate.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
