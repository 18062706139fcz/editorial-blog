import type { Metadata } from "next";
import NightRadio from "@/components/NightRadio";
import { getHiddenRoom } from "@/lib/hidden-rooms";

const room = getHiddenRoom("night");

export const metadata: Metadata = {
  title: "夜间 — Ryker",
  description: room.summary,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NightPage() {
  return <NightRadio room={room} />;
}
