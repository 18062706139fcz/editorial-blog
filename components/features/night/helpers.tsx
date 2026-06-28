import type { ReactNode } from "react";
import { specialLyricTerms } from "./tracks";
import type { LyricLine } from "./types";

export function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function selectLyricIndex(lines: LyricLine[], time: number) {
  if (lines.length === 0) return -1;

  let selected = 0;
  for (let index = 0; index < lines.length; index += 1) {
    if (time >= lines[index].time) selected = index;
  }
  return selected;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getLyricLineProgress(
  lines: LyricLine[],
  index: number,
  time: number,
  duration: number,
) {
  const line = lines[index];
  if (!line) return 0;

  const nextLine = lines[index + 1];
  const endTime = nextLine?.time ?? duration;
  const lineDuration = Math.max(0.4, endTime - line.time);

  return clamp((time - line.time) / lineDuration, 0, 1);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function renderLyricPieces(text: string): ReactNode {
  const specialPattern = new RegExp(
    `(${specialLyricTerms.map(escapeRegExp).join("|")})`,
    "g",
  );

  return text.split(/(【[^】]+】)/g).flatMap((part, index) => {
    if (!part) return null;
    if (/^【[^】]+】$/.test(part)) {
      return (
        <span
          key={`${part}-${index}`}
          className="lyric-token lyric-token--bracket"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return part.split(specialPattern).map((segment, segmentIndex) => {
      if (!segment) return null;
      if (specialLyricTerms.includes(segment)) {
        return (
          <span
            key={`${segment}-${index}-${segmentIndex}`}
            className="lyric-token lyric-token--literary"
          >
            {segment}
          </span>
        );
      }
      return <span key={`${segment}-${index}-${segmentIndex}`}>{segment}</span>;
    });
  });
}
