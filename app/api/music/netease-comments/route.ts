import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedTracks = new Set(["29357047", "30431370", "2749429518"]);

type NeteaseComment = {
  content?: string;
  likedCount?: number;
  user?: {
    nickname?: string;
  };
};

type NeteaseCommentResponse = {
  code: number;
  hotComments?: NeteaseComment[];
};

function normalizeComment(content: string) {
  return content
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsableComment(content: string) {
  if (content.length < 8) return false;
  if (/^[\d\s[:：，。,.!?！？、]+$/.test(content)) return false;
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";

  if (!allowedTracks.has(id)) {
    return NextResponse.json({ error: "Track is not allowed." }, { status: 400 });
  }

  const apiUrl = new URL(
    `https://music.163.com/api/v1/resource/comments/R_SO_4_${id}`,
  );
  apiUrl.searchParams.set("limit", "12");
  apiUrl.searchParams.set("offset", "0");

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
      { error: "NetEase comment request failed." },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as NeteaseCommentResponse;
  const comment = payload.hotComments
    ?.map((item) => ({
      content: normalizeComment(item.content ?? ""),
      likedCount: item.likedCount ?? 0,
      nickname: item.user?.nickname ?? "网易云用户",
    }))
    .find((item) => isUsableComment(item.content));

  if (payload.code !== 200 || !comment) {
    return NextResponse.json(
      { error: "Hot comments are not available right now." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      id,
      comment,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
