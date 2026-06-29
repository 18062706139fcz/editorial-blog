import type { DeskA2UI } from "@/lib/features/desk/types";
import ArtifactList from "./a2ui/ArtifactList";
import CommandHints from "./a2ui/CommandHints";
import DecisionMatrix from "./a2ui/DecisionMatrix";
import NoteCard from "./a2ui/NoteCard";

export default function A2UIRenderer({ ui }: { ui: DeskA2UI }) {
  switch (ui.type) {
    case "artifactList":
      return <ArtifactList ui={ui} />;
    case "commandHints":
      return <CommandHints ui={ui} />;
    case "decisionMatrix":
      return <DecisionMatrix ui={ui} />;
    case "note":
      return <NoteCard ui={ui} />;
    default:
      return null;
  }
}
