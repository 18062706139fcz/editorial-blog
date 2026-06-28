import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { normalizeThoughtInput } from "@/lib/features/thoughts";

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  try {
    const thought = await prisma.thought.create({
      data: normalizeThoughtInput(body),
    });
    return NextResponse.json({ thought });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "短札保存失败，请检查输入。",
      },
      { status: 400 },
    );
  }
}
