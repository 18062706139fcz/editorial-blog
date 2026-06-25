"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import type { HiddenRoom } from "@/lib/hidden-rooms";

type TrackSource = {
  url: string;
  fee: number;
  durationMs: number;
  type: string | null;
};

const tracks = [
  {
    title: "奇妙能力歌",
    artist: "陈粒",
    bpm: "72 bpm",
    duration: "04:13",
    durationSeconds: 253,
    neteaseId: "29357047",
    coverUrl:
      "https://p2.music.126.net/cpoUinrExafBHL5Nv5iDHQ==/109951166361218466.jpg",
    accent: "#d9473f",
    note: "网易云可免费播放的陈粒曲目，走真实音频源。",
  },
  {
    title: "正趣果上果",
    artist: "陈粒",
    bpm: "76 bpm",
    duration: "03:42",
    durationSeconds: 222,
    neteaseId: "30431370",
    coverUrl:
      "https://p2.music.126.net/VuJFMbXzpAProbJPoXLv7g==/7721870161993398.jpg",
    accent: "#c8501e",
    note: "来自《如也》的《正趣果上果》，用当前可用音频 URL 播放。",
  },
  {
    title: "种种",
    artist: "陈粒",
    bpm: "64 bpm",
    duration: "03:11",
    durationSeconds: 191,
    neteaseId: "2749429518",
    coverUrl:
      "https://p1.music.126.net/jeWHIkiTkBglJKxte7p6JA==/109951172059186762.jpg",
    accent: "#dd3f35",
    note: "使用《十年自选》里的可播放版本。",
  },
];

const visualizerBars = [35, 62, 48, 78, 54, 70, 42, 86, 50, 66, 40, 74];

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function NightRadio({ room }: { room: HiddenRoom }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [source, setSource] = useState<TrackSource | null>(null);
  const [loadingSource, setLoadingSource] = useState(true);
  const [sourceError, setSourceError] = useState("");
  const [playbackError, setPlaybackError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(tracks[0].durationSeconds);
  const activeTrack = tracks[activeIndex];
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const recordGlow = playing ? "opacity-100" : "opacity-25";
  const recordNeedle = playing ? "rotate-[7deg]" : "-rotate-[9deg]";
  const currentMusicCopy = `当前曲目：${activeTrack.artist}《${activeTrack.title}》`;

  useEffect(() => {
    let cancelled = false;

    setPlaying(false);
    setCurrentTime(0);
    setDuration(activeTrack.durationSeconds);
    setLoadingSource(true);
    setSourceError("");
    setPlaybackError("");
    setSource(null);
    audioRef.current?.pause();

    fetch(`/api/music/netease-url?id=${activeTrack.neteaseId}`)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "音频源暂时不可用");
        }
        return payload as TrackSource;
      })
      .then((payload) => {
        if (cancelled) return;
        setSource(payload);
        if (payload.durationMs > 0) setDuration(payload.durationMs / 1000);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setSourceError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingSource(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTrack.durationSeconds, activeTrack.neteaseId]);

  async function togglePlayback() {
    if (!audioRef.current || !source || loadingSource) return;
    setPlaybackError("");

    if (playing) {
      audioRef.current.pause();
      return;
    }

    try {
      await audioRef.current.play();
    } catch {
      setPlaying(false);
      setPlaybackError("浏览器没有启动音频，再点一次播放试试。");
    }
  }

  function selectTrack(index: number) {
    setActiveIndex(index);
  }

  function seekTo(event: MouseEvent<HTMLButtonElement>) {
    const audio = audioRef.current;
    if (!audio || duration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const nextTime = Math.max(0, Math.min(duration, duration * ratio));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <div
      data-night-stage
      className="relative left-1/2 min-h-[calc(100svh-4rem)] w-screen -translate-x-1/2 overflow-hidden bg-[#050506] text-[#f7f0e8]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(221,63,53,0.14),transparent_30%),linear-gradient(180deg,#09090b_0%,#050506_58%,#050506_100%)]" />
      <div className="relative mx-auto grid w-full max-w-[74rem] gap-8 px-6 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <section className="rounded-[8px] border border-[#2a2528] bg-[#151214]/95 p-5 shadow-[0_30px_90px_-58px_rgba(0,0,0,0.95)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-label text-white/45">
            <span>{room.eyebrow}</span>
            <span>{room.coordinate}</span>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-center">
            <div className="flex min-h-full flex-col justify-between gap-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-label text-[#dd3f35]">
                  now playing
                </p>
                <h1 className="mt-4 whitespace-nowrap font-serif text-5xl font-light leading-none tracking-normal sm:text-6xl">
                  夜间音乐台
                </h1>
                <p className="mt-5 max-w-[17rem] text-sm leading-7 text-white/64 sm:text-base">
                  {room.summary}
                </p>
              </div>

              <div className="overflow-hidden rounded-[8px] border border-white/10 bg-[#09090b] p-4">
                <audio
                  ref={audioRef}
                  src={source?.url}
                  preload="metadata"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                  onTimeUpdate={(event) => {
                    setCurrentTime(event.currentTarget.currentTime);
                  }}
                  onLoadedMetadata={(event) => {
                    const nextDuration = event.currentTarget.duration;
                    if (Number.isFinite(nextDuration)) setDuration(nextDuration);
                  }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-label text-white/38">
                      {activeTrack.artist} / {activeTrack.bpm} /{" "}
                      {activeTrack.duration}
                    </p>
                    <h2 className="mt-2 truncate font-serif text-2xl font-light leading-tight">
                      {activeTrack.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {currentMusicCopy}
                    </p>
                    {(sourceError || playbackError) && (
                      <p className="mt-2 text-xs leading-relaxed text-[#ff766d]/85">
                        {sourceError || playbackError}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={playing ? "暂停夜间音乐台" : "播放夜间音乐台"}
                    disabled={loadingSource || !source}
                    onClick={togglePlayback}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/14 bg-[#f7f0e8] text-[#151214] shadow-[0_16px_36px_-22px_rgba(0,0,0,1)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dd3f35] text-white">
                      {playing ? (
                        <span className="flex gap-0.5">
                          <span className="h-3 w-1 rounded-full bg-current" />
                          <span className="h-3 w-1 rounded-full bg-current" />
                        </span>
                      ) : (
                        <span className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
                      )}
                    </span>
                  </button>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    aria-label="跳转播放进度"
                    onClick={seekTo}
                    className="block h-1.5 w-full overflow-hidden rounded-full bg-white/10 text-left"
                  >
                    <span
                      className="block h-full rounded-full bg-[linear-gradient(90deg,#dd3f35,#ff766d)] transition-[width] duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </button>
                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-label text-white/35">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="mt-4 flex h-8 items-end gap-1">
                  {visualizerBars.map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className={`w-full rounded-t-[3px] bg-[#dd3f35] ${
                        playing
                          ? "opacity-80 motion-safe:animate-[equalizer_0.9s_ease-in-out_infinite]"
                          : "opacity-24"
                      }`}
                      style={{
                        height: `${height}%`,
                        animationDelay: `${index * 55}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative rounded-[8px] border border-white/10 bg-[linear-gradient(145deg,#1b1719_0%,#0b0b0d_100%)] px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div
                data-turntable
                className="relative mx-auto aspect-square w-full max-w-[31rem]"
              >
                <span
                  aria-hidden
                  className={`absolute inset-[14%] rounded-full bg-[#dd3f35]/24 blur-3xl transition-opacity duration-700 ${recordGlow}`}
                />
                <span
                  aria-hidden
                  className="absolute inset-[5%] rounded-full border border-white/8 bg-[#292b2f] shadow-[inset_0_0_36px_rgba(255,255,255,0.05),0_28px_80px_-48px_rgba(221,63,53,0.9)]"
                />
                <div
                  data-record-disc
                  className={`absolute inset-[9%] overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,#1b1718_0_18%,#080808_19%_100%)] shadow-[0_0_0_10px_rgba(255,255,255,0.03),0_22px_64px_-34px_rgba(0,0,0,1)] ${
                    playing
                      ? "motion-safe:animate-[spin_11s_linear_infinite]"
                      : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0_1px,transparent_1px_5px)] opacity-[0.16]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[17%] rounded-full border border-white/[0.07]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[28%] rounded-full border border-white/[0.08]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[39%] rounded-full border border-white/[0.07]"
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_0deg,rgba(255,255,255,0.13)_20deg,transparent_45deg,transparent_184deg,rgba(255,255,255,0.06)_214deg,transparent_242deg,transparent_360deg)] transition-opacity duration-500 ${
                      playing ? "opacity-80" : "opacity-25"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-full bg-[linear-gradient(115deg,transparent_0%,transparent_39%,rgba(255,255,255,0.22)_49%,transparent_59%,transparent_100%)] opacity-0 ${
                      playing
                        ? "motion-safe:animate-[record-sheen_2.8s_ease-in-out_infinite]"
                        : ""
                    }`}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-[30%] rounded-full border border-white/35 bg-cover bg-center shadow-[0_0_0_9px_rgba(0,0,0,0.35),inset_0_0_22px_rgba(0,0,0,0.38)]"
                    style={{ backgroundImage: `url(${activeTrack.coverUrl})` }}
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f0e8] shadow-[0_0_0_4px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <svg
                  data-tonearm
                  aria-hidden
                  viewBox="0 0 190 250"
                  className={`absolute right-[7%] top-[2%] h-[50%] w-[34%] overflow-visible drop-shadow-[0_14px_18px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${recordNeedle}`}
                  style={{ transformOrigin: "68% 17%" }}
                >
                  <circle cx="128" cy="43" r="32" fill="#f7f0e8" />
                  <circle cx="128" cy="43" r="13" fill="#e6e1d8" />
                  <circle
                    cx="128"
                    cy="43"
                    r="26"
                    fill="none"
                    stroke="rgba(0,0,0,0.16)"
                  />
                  <path
                    d="M128 68 C137 105 148 143 166 171 C173 182 173 191 166 200"
                    fill="none"
                    stroke="#f7f0e8"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                  <path
                    d="M128 68 C137 105 148 143 166 171"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                  <rect
                    x="155"
                    y="185"
                    width="21"
                    height="38"
                    rx="5"
                    fill="#f7f0e8"
                    transform="rotate(39 165 204)"
                  />
                  <rect
                    x="164"
                    y="189"
                    width="4"
                    height="22"
                    rx="2"
                    fill="#c9c0b7"
                    transform="rotate(39 166 201)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <aside className="grid gap-4">
          <div className="rounded-[8px] border border-[#2a2528] bg-[#151214] p-5">
            <p className="font-mono text-[10px] uppercase tracking-label text-[#dd3f35]">
              playlist
            </p>
            <div className="mt-4 grid gap-2">
              {tracks.map((track, index) => (
                <button
                  key={track.neteaseId}
                  type="button"
                  onClick={() => selectTrack(index)}
                  className={`rounded-[8px] border px-4 py-3 text-left transition-colors ${
                    index === activeIndex
                      ? "border-[#dd3f35] bg-[#dd3f35]/12"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-label text-white/35">
                    {String(index + 1).padStart(2, "0")} / {track.bpm}
                  </span>
                  <span className="mt-1 block font-serif text-xl font-light">
                    {track.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-[#2a2528] bg-[#151214] p-5">
            <p className="font-mono text-[10px] uppercase tracking-label text-white/40">
              signal
            </p>
            <div className="mt-4 flex h-20 items-end gap-1.5">
              {[32, 58, 44, 78, 52, 68, 38, 84, 46, 62, 36, 70].map(
                (height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className={`w-full rounded-t-[3px] bg-[#dd3f35] ${
                      playing ? "opacity-80 motion-safe:animate-pulse" : "opacity-35"
                    }`}
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 70}ms`,
                    }}
                  />
                ),
              )}
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-white/12 px-5 font-mono text-[10px] uppercase tracking-label text-white/55 transition-colors hover:border-[#dd3f35] hover:text-white"
          >
            关掉台灯
          </Link>
        </aside>
      </div>
    </div>
  );
}
