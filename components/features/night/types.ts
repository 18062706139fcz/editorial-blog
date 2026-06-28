import type { CSSProperties } from "react";

export type NightStyle = CSSProperties & {
  "--night-accent": string;
  "--night-accent-soft": string;
  "--night-accent-tail": string;
};

export type RangeStyle = CSSProperties & {
  "--progress": string;
};

export type LyricRailStyle = CSSProperties & {
  "--current-lyric-index": number;
};

export type TrackSource = {
  url: string;
  fee: number;
  durationMs: number;
  type: string | null;
};

export type HotComment = {
  content: string;
  likedCount: number;
  nickname: string;
};

export type LyricWord = {
  time: number;
  duration: number;
  text: string;
};

export type LyricLine = {
  time: number;
  text: string;
  words?: LyricWord[];
};

export type NightTrack = {
  title: string;
  artist: string;
  bpm: string;
  duration: string;
  durationSeconds: number;
  neteaseId: string;
  coverUrl: string;
  accent: string;
  accentSoft: string;
  accentTail: string;
  note: string;
};
