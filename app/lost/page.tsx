import type { Metadata } from "next";
import HiddenRoom from "@/components/HiddenRoom";
import { getHiddenRoom } from "@/lib/hidden-rooms";

const room = getHiddenRoom("lost");

export const metadata: Metadata = {
  title: "迷路 — Ryker",
  description: room.summary,
  robots: {
    index: false,
    follow: false,
  },
};

export default function LostPage() {
  return <HiddenRoom room={room} />;
}
