import type { HiddenRoom } from "@/lib/features/hidden-rooms";
import DeskShell from "./DeskShell";

export default function DeskRoom({ room }: { room: HiddenRoom }) {
  return (
    <div className="relative left-1/2 min-h-[calc(100svh-4rem)] w-screen -translate-x-1/2 bg-[#080a0c] text-[#d6e2d6]">
      <DeskShell room={room} />
    </div>
  );
}
