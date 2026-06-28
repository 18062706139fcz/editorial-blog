import type { Metadata } from "next";
import DeskRoom from "@/components/features/desk/DeskRoom";
import { getHiddenRoom } from "@/lib/features/hidden-rooms";

const room = getHiddenRoom("desk");

export const metadata: Metadata = {
  title: "书桌 — Ryker",
  description: room.summary,
  robots: {
    index: false,
    follow: false,
  },
};

export default function DeskPage() {
  return <DeskRoom room={room} />;
}
