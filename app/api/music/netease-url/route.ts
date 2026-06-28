import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedTracks = new Set(["29357047", "30431370", "2749429518"]);

type NeteasePlayerResponse = {
  data?: Array<{
    id: number;
    url: string | null;
    code: number;
    fee: number;
    time: number;
    type: string | null;
  }>;
  code: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  if (!allowedTracks.has(id)) {
    return NextResponse.json({ error: "Track is not allowed." }, { status: 400 });
  }

  const apiUrl = new URL(
    "https://music.163.com/api/song/enhance/player/url",
  );
  apiUrl.searchParams.set("id", id);
  apiUrl.searchParams.set("ids", JSON.stringify([Number(id)]));
  apiUrl.searchParams.set("br", "320000");

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
      { error: "NetEase music request failed." },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as NeteasePlayerResponse;
  const track = payload.data?.[0];
  const url = track?.url?.replace(/^http:/, "https:");

  if (!track || track.code !== 200 || !url) {
    return NextResponse.json(
      { error: "This track is not playable right now." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      id,
      url,
      fee: track.fee,
      durationMs: track.time,
      type: track.type,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
