import { renderLyricPieces } from "./helpers";
import type { LyricLine, LyricRailStyle } from "./types";

function LyricIdleDoodle({ copy }: { copy: string }) {
  return (
    <div
      data-lyric-idle
      className="mt-3 flex h-[12rem] flex-col justify-center px-1 py-2"
    >
      <div className="relative h-16 overflow-hidden rounded-[6px] bg-[radial-gradient(circle_at_35%_45%,var(--night-accent-soft),transparent_58%)] text-[var(--night-accent-tail)]">
        <svg
          aria-hidden
          viewBox="0 0 220 72"
          className="absolute inset-0 h-full w-full opacity-60"
        >
          <path
            d="M19 45 C48 15 76 59 105 31 S160 24 198 51"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
          <circle cx="183" cy="23" r="10" fill="none" stroke="currentColor" />
          <path
            d="M65 51 L82 19 L94 49 M77 36 H90"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.4"
          />
        </svg>
        <span className="absolute left-5 top-4 font-serif text-2xl text-white/62">
          沙
        </span>
        <span className="absolute left-[48%] top-7 font-mono text-[10px] uppercase tracking-label text-white/32">
          wind / lamp / echo
        </span>
        <span className="absolute bottom-3 right-6 font-serif text-xl text-white/52">
          月
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/46">{copy}</p>
    </div>
  );
}

function TimedLyricLine({
  currentTime,
  line,
  lineProgress,
}: {
  currentTime: number;
  line: LyricLine;
  lineProgress: number;
}) {
  const progressPercent = Math.max(0, Math.min(100, lineProgress * 100));

  if (!line.words?.length) {
    return (
      <span className="karaoke-line karaoke-line--line-progress">
        <span className="karaoke-line__text">{renderLyricPieces(line.text)}</span>
        <span
          aria-hidden
          className="karaoke-line__active"
          style={{ clipPath: `inset(0 ${100 - progressPercent}% 0 0)` }}
        >
          {renderLyricPieces(line.text)}
        </span>
        <span aria-hidden className="lyric-line-progress">
          <span style={{ transform: `scaleX(${lineProgress})` }} />
        </span>
      </span>
    );
  }

  return (
    <span
      aria-label={line.text}
      className="karaoke-line karaoke-line--timed"
    >
      {line.words.map((word, index) => {
        const wordStart = word.time;
        const wordEnd = word.time + Math.max(0.05, word.duration);
        const isSung = currentTime >= wordEnd;
        const isActive = currentTime >= wordStart && currentTime < wordEnd;

        return (
          <span
            aria-hidden
            key={`${word.time}-${word.text}-${index}`}
            className={`lyric-word ${isSung ? "is-sung" : ""} ${
              isActive ? "is-active" : ""
            }`}
          >
            {word.text}
          </span>
        );
      })}
    </span>
  );
}

export function LyricDisplay({
  currentIndex,
  currentTime,
  lineProgress,
  lines,
}: {
  currentIndex: number;
  currentTime: number;
  lineProgress: number;
  lines: LyricLine[];
}) {
  return (
    <div className="lyric-viewport mt-3 h-[12rem] overflow-hidden">
      <div
        className="lyric-rail"
        style={
          {
            "--current-lyric-index": currentIndex,
          } as LyricRailStyle
        }
      >
        {lines.map((line, index) => {
          const isCurrent = index === currentIndex;
          const distance = Math.abs(index - currentIndex);
          return (
            <p
              key={`${line.time}-${line.text}`}
              className={`lyric-row ${
                isCurrent ? "is-current" : distance <= 1 ? "is-near" : ""
              }`}
            >
              {isCurrent ? (
                <TimedLyricLine
                  currentTime={currentTime}
                  line={line}
                  lineProgress={lineProgress}
                />
              ) : (
                <span>{renderLyricPieces(line.text)}</span>
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export { LyricIdleDoodle, TimedLyricLine };
