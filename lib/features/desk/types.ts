export type DeskA2UI =
  | DeskNoteUI
  | DeskArtifactListUI
  | DeskDecisionMatrixUI
  | DeskCommandHintsUI;

export type DeskNoteUI = {
  type: "note";
  title: string;
  body: string;
  meta?: string;
  tags?: string[];
};

export type DeskArtifactListUI = {
  type: "artifactList";
  title: string;
  description?: string;
  items: DeskArtifactItem[];
};

export type DeskArtifactItem = {
  label: string;
  title: string;
  body: string;
  href?: string;
};

export type DeskDecisionMatrixUI = {
  type: "decisionMatrix";
  title: string;
  options: DeskDecisionOption[];
  recommendation?: string;
};

export type DeskDecisionOption = {
  option: string;
  upside: string;
  risk: string;
  verdict: string;
};

export type DeskCommandHintsUI = {
  type: "commandHints";
  title: string;
  hints: DeskCommandHint[];
};

export type DeskCommandHint = {
  command: string;
  description: string;
};

export type DeskAgentResponse = {
  message: string;
  ui?: DeskA2UI;
};

export type DeskAgentRequest = {
  input: string;
  history?: DeskHistoryMessage[];
  mode?: "chat" | "ui" | "critic" | "organize";
};

export type DeskHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type DeskBlockKind =
  | "system"
  | "user"
  | "assistant"
  | "command"
  | "ui"
  | "error";

export type DeskBlock = {
  id: string;
  kind: DeskBlockKind;
  title?: string;
  body: string;
  command?: string;
  ui?: DeskA2UI;
  meta?: string;
};

export type DeskCommandResult =
  | {
      kind: "clear";
    }
  | {
      kind: "blocks";
      blocks: DeskBlock[];
    };
