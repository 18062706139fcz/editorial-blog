import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  const baseSlug = body.slug ? slugify(body.slug) : slugify(body.title);
  let slug = baseSlug || `post-${Date.now()}`;
  let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const post = await prisma.post.create({
    data: {
      title: String(body.title),
      slug,
      excerpt: String(body.excerpt || ""),
      content: String(body.content),
      coverImage: body.coverImage ? String(body.coverImage) : null,
      author: String(body.author || "The Margin"),
      category: String(body.category || "Essays"),
      featured: Boolean(body.featured),
      published: body.published === undefined ? true : Boolean(body.published),
    },
  });

  return NextResponse.json({ post });
}
