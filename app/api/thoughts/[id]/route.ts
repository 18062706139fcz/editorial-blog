import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { normalizeThoughtInput } from "@/lib/features/thoughts";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  const body = await request.json().catch(() => null);
  if (!body || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  try {
    const thought = await prisma.thought.update({
      where: { id },
      data: normalizeThoughtInput(body),
    });
    return NextResponse.json({ thought });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "短札不存在或保存失败。",
      },
      { status: 404 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    await prisma.thought.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "短札不存在。" }, { status: 404 });
  }
}
