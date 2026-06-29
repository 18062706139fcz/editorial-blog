# /desk A2UI Toy Design

## 方案结论

把 `/desk` 做成一个隐藏的 A2UI 玩具工作台：它保留 hidden room 的入口属性，不改主页、不改公开导航、不进入文章流。用户在 Claude Code 风格的终端界面里输入想法，系统用 DeepSeek 生成自然语言回复，并把部分回复转换成受控的 UI 组件。

第一版只做轻量实验室，不做完整 agent 平台：

- `/desk` 是主工作台。
- `/desk/lab` 是隐藏的 A2UI 组件样板间。
- DeepSeek 只通过服务端 API 调用。
- A2UI 只渲染白名单 schema，不渲染模型返回的 HTML。
- 不执行真实 shell，不读写文件系统，不保存长期会话。

## 背景

当前 `/desk` 是一个静态 hidden room 页面。页面由 `app/desk/page.tsx` 挂载 `DeskRoom`，内容来自 `lib/features/hidden-rooms.ts`。现有实现更像书桌摆件：便签、杯子、键盘、线缆和抽屉规则。

新方向不是把这个页面简单换成黑底终端，而是把“书桌抽屉”升级成一个隐藏的思考玩具：对话负责输入和解释，A2UI 负责把临时想法变成可看的结构。

## 目标

- 让 `/desk` 有一个独立、可玩的 agent workbench 体验。
- 让用户能通过自然语言触发结构化 UI，如卡片、列表、决策矩阵。
- 保持个人博客的隐秘角落气质，不影响主页和公开阅读体验。
- 为后续 A2UI 实验留下清晰 schema 和组件边界。

## 非目标

- 不把 `/desk` 暴露到首页、导航或 footer。
- 不做通用 ChatGPT 替代品。
- 不做真实 Claude Code：不执行命令、不编辑仓库、不读取本机文件。
- 不做账号、数据库、会话归档或共享链接。
- 不让模型生成任意 HTML、CSS 或脚本。

## 用户体验

### `/desk`

`/desk` 首屏是一个深色工作台，包含三块区域：

1. 顶部 session bar：展示 `desk.session`、状态、隐藏入口提示。
2. 主体 split view：左侧是 terminal transcript，右侧是 A2UI inspector。
3. 底部 composer：用户输入自然语言或轻命令。

默认提示符：

```text
ryker@desk ~/scratch %
```

页面启动时展示一组静态 block：

- 系统欢迎语。
- 可用命令提示。
- 一张默认 `NoteCard`，说明这是 A2UI 玩具而不是公开功能。

### `/desk/lab`

`/desk/lab` 是隐藏样板间，用静态数据展示所有 A2UI 组件。它用于调样式、做视觉回归和说明 schema 能力。它不调用 DeepSeek。

## 交互模型

输入分两类：

- 本地命令：`help`、`clear`、`show examples`、`show lab`。
- 模型请求：其他输入发送给 `/api/desk/agent`。

本地命令不触发网络请求。模型请求触发 DeepSeek，服务端返回一个 envelope：

```ts
type DeskAgentResponse = {
  message: string;
  ui?: DeskA2UI;
};
```

前端将一次请求渲染成一组 block：

- `user` block：用户输入。
- `assistant` block：自然语言回复。
- `ui` block：右侧 inspector 渲染的 A2UI，同时 transcript 中显示一行结构化摘要。
- `error` block：网络、配置或 schema 错误。

## A2UI Schema

第一版只支持四类 UI：

```ts
export type DeskA2UI =
  | NoteCardUI
  | ArtifactListUI
  | DecisionMatrixUI
  | CommandHintsUI;

export type NoteCardUI = {
  type: "note";
  title: string;
  body: string;
  meta?: string;
  tags?: string[];
};

export type ArtifactListUI = {
  type: "artifactList";
  title: string;
  description?: string;
  items: Array<{
    label: string;
    title: string;
    body: string;
    href?: string;
  }>;
};

export type DecisionMatrixUI = {
  type: "decisionMatrix";
  title: string;
  options: Array<{
    option: string;
    upside: string;
    risk: string;
    verdict: string;
  }>;
  recommendation?: string;
};

export type CommandHintsUI = {
  type: "commandHints";
  title: string;
  hints: Array<{
    command: string;
    description: string;
  }>;
};
```

校验规则：

- `type` 必须是白名单。
- 字符串字段必须是字符串，空值用默认文案替代或丢弃。
- 列表最多渲染 6 项。
- URL 只允许 `http:`、`https:` 或站内相对路径。
- 校验失败时丢弃 `ui`，保留 `message`。

## DeepSeek API 设计

新增 `app/api/desk/agent/route.ts`。

请求：

```ts
type DeskAgentRequest = {
  input: string;
  history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  mode?: "chat" | "ui" | "critic" | "organize";
};
```

服务端行为：

1. 检查 `DEEPSEEK_API_KEY`。
2. 限制输入长度和 history 长度。
3. 生成 system prompt。
4. 调用 DeepSeek Chat Completion API。
5. 从模型输出中解析 JSON envelope。
6. 校验 A2UI schema。
7. 返回规范化结果。

环境变量：

```env
DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-chat
```

第一版使用非流式响应。原因是 A2UI schema 要等完整 JSON 才能安全校验。后续可以让文本流式输出，UI 在结尾一次性落下。

## Prompt 原则

系统 prompt 约束：

- 你是 `/desk` 的 A2UI toy agent。
- 你的任务是把用户的想法压缩成临时界面。
- 不声称自己能执行命令或访问文件。
- 每次最多返回一个 `ui`。
- 输出必须是 JSON envelope，不要 Markdown 包裹。
- 如果用户只是闲聊，可以只返回 `message`。
- 如果用户要求整理、比较、计划、拆解，优先返回 A2UI。

## 前端组件边界

```text
components/features/desk/
  DeskRoom.tsx
  DeskShell.tsx
  DeskSessionBar.tsx
  TerminalTranscript.tsx
  DeskComposer.tsx
  A2UIRenderer.tsx
  a2ui/
    NoteCard.tsx
    ArtifactList.tsx
    DecisionMatrix.tsx
    CommandHints.tsx
```

```text
lib/features/desk/
  a2ui.ts
  commands.ts
  prompt.ts
  types.ts
```

职责：

- `DeskRoom`：保留 server-side 入口，传入 hidden room seed。
- `DeskShell`：client state、命令分发、API 调用。
- `TerminalTranscript`：只渲染 block，不关心 API。
- `DeskComposer`：输入、提交、禁用状态。
- `A2UIRenderer`：按 schema 分发组件。
- `commands.ts`：处理本地命令。
- `a2ui.ts`：schema 类型、校验、规范化。
- `prompt.ts`：构造系统 prompt 和请求消息。

## 路由主题

当前 `RouteTheme` 只识别 `/night`。新增 `desk` theme：

- `/desk` 和 `/desk/*` 设置 `data-route-theme="desk"`。
- nav/footer 保持存在，但使用深色低对比样式。
- 主页、文章、thinking、night 不受影响。

## 样式方向

视觉参考 Claude Code 和现代终端，但避免复古黑绿：

- 背景：`#080A0C`
- 面板：`#101418`
- 边框：`rgba(214, 226, 214, 0.12)`
- 正文：`#D6E2D6`
- 次要文字：`rgba(214, 226, 214, 0.58)`
- 状态绿：`#82D99B`
- 链接蓝：`#7AA2F7`
- 提醒黄：`#E0B46A`

布局要保证移动端可用：

- 桌面端：transcript 和 inspector 双栏。
- 移动端：先 transcript，再 inspector，composer 固定底部或自然跟随。

## 错误处理

| 场景 | 前端表现 | 后端行为 |
| ---- | -------- | -------- |
| 缺少 API key | 显示 `DEEPSEEK_API_KEY missing` error block | 返回 503 |
| DeepSeek 超时或失败 | 显示 network error block | 返回 502 |
| 模型不是合法 JSON | 保留文本降级或显示 parse error | 返回规范化 message |
| A2UI schema 不合法 | 不渲染 UI，只显示 message | 丢弃 `ui` |
| 用户输入为空 | 不提交 | 不请求 |

## 安全边界

- API key 只在服务端读取。
- 不把 `process.env` 暴露给 client component。
- 不执行用户输入。
- 不把模型输出当 HTML 注入。
- 不允许任意 URL scheme。
- 不存储长期会话。

## 测试计划

新增或扩展 `tests/hidden-rooms.test.ts`：

- `/desk` 仍然 `noindex`、`nofollow`。
- 公开 nav/footer 不包含 `/desk` 或 `/desk/lab`。
- `RouteTheme` 支持 `/desk` 和 `/desk/*`。
- client 组件不包含 `DEEPSEEK_API_KEY`。
- `DeskRoom` 使用 `DeskShell`，不再使用旧便签布局。
- `/desk/lab` 存在且不被公开导航引用。

新增 `tests/desk-a2ui.test.ts`：

- 合法 schema 通过校验。
- 非法 `type` 被拒绝。
- artifact list 超过 6 项会被裁剪。
- 非 HTTP URL 被移除。
- 本地命令 `help` 和 `clear` 不需要 API。

验证命令：

```bash
npm test
npm run build
```

## 实施阶段

### Phase 1：静态工作台

- 重写 `/desk` 为深色 workbench。
- 新增 shell、transcript、composer、A2UI renderer。
- 实现本地命令。
- 新增 `/desk/lab` 静态样板间。

### Phase 2：DeepSeek 接入

- 新增 `/api/desk/agent`。
- 添加 prompt 构造和 schema 校验。
- 前端接入非流式请求。
- 做错误态和 loading 态。

### Phase 3：打磨与验证

- 补测试。
- 确认主页和公开导航不变。
- 检查移动端布局。
- 跑构建。

## 取舍

| 选择 | 理由 | 代价 |
| ---- | ---- | ---- |
| 非流式优先 | schema 校验简单可靠 | 回复没有逐字输出 |
| 不保存会话 | 避免隐私、数据库和清理策略 | 刷新后丢失上下文 |
| 白名单 UI | 安全、可控、可测试 | A2UI 表达力受限 |
| `/desk/lab` 静态样板 | 方便开发和验证 | 多一个隐藏路由 |

## 验收标准

- 访问 `/desk` 能看到 Claude Code 风格的 A2UI workbench。
- 输入 `help` 能看到本地命令提示。
- 输入普通问题能请求 `/api/desk/agent` 并显示回复。
- 模型返回合法 A2UI 时，右侧 inspector 渲染对应组件。
- 主页、公开导航、文章页视觉不变。
- 缺少 DeepSeek key 时页面可用，并以 error block 告知配置缺失。
- 测试和构建通过。
