import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const key of [
    "title",
    "excerpt",
    "content",
    "coverImage",
    "author",
    "category",
  ] as const) {
    if (body[key] !== undefined) data[key] = body[key] === "" ? null : body[key];
  }
  if (body.featured !== undefined) data.featured = Boolean(body.featured);
  if (body.published !== undefined) data.published = Boolean(body.published);

  try {
    const post = await prisma.post.update({ where: { id }, data });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
}
