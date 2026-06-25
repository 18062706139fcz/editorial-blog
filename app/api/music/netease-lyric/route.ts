import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedTracks = new Set(["29357047", "30431370", "2749429518"]);

type NeteaseLyricResponse = {
  code: number;
  lrc?: {
    lyric?: string;
  };
};

type LyricLine = {
  time: number;
  text: string;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  if (!allowedTracks.has(id)) {
    return NextResponse.json({ error: "Track is not allowed." }, { status: 400 });
  }

  const apiUrl = new URL("https://music.163.com/api/song/lyric");
  apiUrl.searchParams.set("id", id);
  apiUrl.searchParams.set("lv", "1");
  apiUrl.searchParams.set("kv", "1");
  apiUrl.searchParams.set("tv", "-1");

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
  const lyric = payload.lrc?.lyric ?? "";
  const lines = parseLrc(lyric);

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
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
