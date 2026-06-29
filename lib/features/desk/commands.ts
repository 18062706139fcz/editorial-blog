import type { DeskBlock, DeskCommandResult } from "./types";

function commandBlock(id: string, command: string, body: string): DeskBlock {
  return {
    id,
    kind: "command",
    command,
    body,
  };
}

export function createInitialDeskBlocks(): DeskBlock[] {
  return [
    {
      id: "boot",
      kind: "system",
      title: "desk.session",
      body: "A hidden A2UI scratchpad is awake. Nothing here runs real shell commands.",
      meta: "local",
    },
    {
      id: "welcome-ui",
      kind: "ui",
      title: "default note",
      body: "Rendered a note inline.",
      ui: {
        type: "note",
        title: "把想法临时变成界面",
        body: "在这里输入一个判断、计划或犹豫点。Desk 会尝试把它整理成一段终端里的结构化输出、一组对象或一个决策矩阵。",
        meta: "A2UI toy",
        tags: ["hidden", "desk"],
      },
    },
    {
      id: "help-hint",
      kind: "ui",
      title: "available commands",
      body: "Rendered command hints inline.",
      ui: {
        type: "commandHints",
        title: "试试这些命令",
        hints: [
          { command: "/help", description: "查看本地命令" },
          { command: "/show examples", description: "加载静态 A2UI 示例" },
          { command: "/show lab", description: "打开隐藏组件样板间" },
          { command: "/clear", description: "清空当前 session" },
        ],
      },
    },
  ];
}

export function resolveDeskCommand(input: string): DeskCommandResult | null {
  const rawCommand = input.trim().toLowerCase();
  const command = rawCommand.startsWith("/") ? rawCommand.slice(1) : rawCommand;

  if (!command) return null;
  if (command === "clear") return { kind: "clear" };

  if (command === "help") {
    return {
      kind: "blocks",
      blocks: [
        commandBlock("cmd-help", "help", "Local desk commands do not call DeepSeek."),
        {
          id: "cmd-help-ui",
          kind: "ui",
          title: "command hints",
          body: "Rendered local command hints.",
          ui: {
            type: "commandHints",
            title: "Local commands",
            hints: [
              { command: "/help", description: "Show this command list" },
              { command: "/show examples", description: "Render sample A2UI output" },
              { command: "/show lab", description: "Navigate to /desk/lab" },
              { command: "/clear", description: "Reset the current transcript" },
            ],
          },
        },
      ],
    };
  }

  if (command === "show examples") {
    return {
      kind: "blocks",
      blocks: [
        commandBlock("cmd-examples", "show examples", "Loaded static A2UI examples."),
        {
          id: "cmd-examples-ui",
          kind: "ui",
          title: "decision matrix",
          body: "Rendered a local decision matrix.",
          ui: {
            type: "decisionMatrix",
            title: "要不要把想法做成页面？",
            options: [
              {
                option: "只写成短札",
                upside: "最快，保持轻量。",
                risk: "结构感弱，读者很难继续探索。",
                verdict: "适合很小的判断。",
              },
              {
                option: "做成 A2UI 输出",
                upside: "有界面反馈，玩具感更强。",
                risk: "需要 schema 和渲染边界。",
                verdict: "适合 /desk。",
              },
            ],
            recommendation: "先用 A2UI 输出托住想法，不要做成公开功能。",
          },
        },
      ],
    };
  }

  if (command === "show lab") {
    return {
      kind: "blocks",
      blocks: [
        {
          id: "cmd-lab",
          kind: "command",
          command: "show lab",
          body: "Open /desk/lab to inspect every whitelisted A2UI component.",
          meta: "/desk/lab",
        },
      ],
    };
  }

  return null;
}
