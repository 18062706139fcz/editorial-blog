import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedTracks = new Set(["29357047", "30431370", "2749429518"]);

type NeteaseLyricResponse = {
  code: number;
  lrc?: {
    lyric?: string;
  };
  yrc?: {
    lyric?: string;
  };
};

type LyricWord = {
  time: number;
  duration: number;
  text: string;
};

type LyricLine = {
  time: number;
  text: string;
  words?: LyricWord[];
};

const creditPattern = /^(作词|作曲|编曲|制作人|出品|发行|OP|SP)\s*[:：]/i;

function parseTimestamp(raw: string) {
  const [minuteText, secondText] = raw.split(":");
  const minutes = Number(minuteText);
  const seconds = Number(secondText);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
  return minutes * 60 + seconds;
}

function parseLrc(lyric: string) {
  const lines: LyricLine[] = [];

  for (const rawLine of lyric.split(/\r?\n/)) {
    const timestamps: string[] = [];
    const timestampPattern = /\[(\d{2,}:\d{2}(?:\.\d{1,3})?)\]/g;
    let match = timestampPattern.exec(rawLine);
    while (match) {
      timestamps.push(match[1]);
      match = timestampPattern.exec(rawLine);
    }
    const text = rawLine.replace(/\[[^\]]+\]/g, "").trim();

    if (timestamps.length === 0 || !text || creditPattern.test(text)) continue;

    for (const timestamp of timestamps) {
      const time = parseTimestamp(timestamp);
      if (time === null) continue;
      lines.push({ time, text });
    }
  }

  return lines.sort((a, b) => a.time - b.time);
}

function parseYrc(lyric: string) {
  const lines: LyricLine[] = [];

  for (const rawLine of lyric.split(/\r?\n/)) {
    const lineMatch = rawLine.match(/^\[(\d+),(\d+)\](.*)$/);
    if (!lineMatch) continue;

    const lineStartMs = Number(lineMatch[1]);
    const wordsRaw = lineMatch[3];
    if (!Number.isFinite(lineStartMs) || !wordsRaw) continue;

    const words: LyricWord[] = [];
    const wordPattern = /\((\d+),(\d+),\d+\)([^()]*)/g;
    let wordMatch = wordPattern.exec(wordsRaw);

    while (wordMatch) {
      const wordStartMs = Number(wordMatch[1]);
      const wordDurationMs = Number(wordMatch[2]);
      const text = wordMatch[3];

      if (Number.isFinite(wordStartMs) && Number.isFinite(wordDurationMs) && text) {
        words.push({
          time: wordStartMs / 1000,
          duration: wordDurationMs / 1000,
          text,
        });
      }

      wordMatch = wordPattern.exec(wordsRaw);
    }

    const text = words.map((word) => word.text).join("").trim();
    if (!text || creditPattern.test(text) || words.length === 0) continue;

    lines.push({
      time: lineStartMs / 1000,
      text,
      words,
    });
  }

  return lines.sort((a, b) => a.time - b.time);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  if (!allowedTracks.has(id)) {
    return NextResponse.json({ error: "Track is not allowed." }, { status: 400 });
  }

  const apiUrl = new URL("https://music.163.com/api/song/lyric/v1");
  apiUrl.searchParams.set("id", id);
  apiUrl.searchParams.set("cp", "false");
  apiUrl.searchParams.set("tv", "0");
  apiUrl.searchParams.set("lv", "0");
  apiUrl.searchParams.set("rv", "0");
  apiUrl.searchParams.set("kv", "0");
  apiUrl.searchParams.set("yv", "0");
  apiUrl.searchParams.set("ytv", "0");
  apiUrl.searchParams.set("yrv", "0");

  const response = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Referer: "https://music.163.com/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "NetEase lyric request failed." },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as NeteaseLyricResponse;
  const yrcLines = parseYrc(payload.yrc?.lyric ?? "");
  const lines = yrcLines.length > 0 ? yrcLines : parseLrc(payload.lrc?.lyric ?? "");
  const source = yrcLines.length > 0 ? "yrc" : "lrc";

  if (payload.code !== 200 || lines.length === 0) {
    return NextResponse.json(
      { error: "Lyrics are not available right now." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      id,
      lines,
      source,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
