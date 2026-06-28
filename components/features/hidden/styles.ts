import type { HiddenRoom as HiddenRoomData } from "@/lib/features/hidden-rooms";

export type RoomStyle = {
  shell: string;
  eyebrow: string;
  panel: string;
  scene: string;
  line: string;
  object: string;
  action: string;
  quietAction: string;
};

export const styles: Record<HiddenRoomData["slug"], RoomStyle> = {
  lost: {
    shell: "bg-[#171411] text-[#f8f1e6]",
    eyebrow: "text-[#e8a07a]",
    panel: "border-[#5b4f42] bg-[#211c17]",
    scene: "border-[#5b4f42] bg-[#1d1814]",
    line: "bg-[#c8501e]",
    object: "border-[#5b4f42] bg-[#211c17] text-[#f8f1e6]",
    action: "bg-[#f8f1e6] text-[#171411] hover:bg-[#e8a07a]",
    quietAction: "border-[#5b4f42] text-[#d7c9b7] hover:border-[#e8a07a]",
  },
  night: {
    shell: "bg-[#101318] text-[#f4efe5]",
    eyebrow: "text-[#9ab3ad]",
    panel: "border-[#384147] bg-[#171c22]",
    scene: "border-[#384147] bg-[#121820]",
    line: "bg-[#d6b56d]",
    object: "border-[#384147] bg-[#171c22] text-[#f4efe5]",
    action: "bg-[#d6b56d] text-[#15130d] hover:bg-[#f0d995]",
    quietAction: "border-[#384147] text-[#b5c2bf] hover:border-[#d6b56d]",
  },
  desk: {
    shell: "bg-[#f5efe4] text-[#1c1916]",
    eyebrow: "text-accent",
    panel: "border-[#d8cfbd] bg-[#fffaf0]",
    scene: "border-[#d8cfbd] bg-[#ede2d1]",
    line: "bg-[#6f8f72]",
    object: "border-[#d8cfbd] bg-[#fffaf0] text-[#1c1916]",
    action: "bg-ink text-paper hover:bg-accent",
    quietAction: "border-[#d8cfbd] text-ink-soft hover:border-accent",
  },
};
