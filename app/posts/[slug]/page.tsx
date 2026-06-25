import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Reveal from "@/components/Reveal";
import Markdown from "@/components/Markdown";
import { formatDate, wordCountLabel, readingTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  // Count this read (innei/cosine-style PV). Best-effort, non-blocking.
  const views = await prisma.post
    .update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
      select: { views: true },
    })
    .then((r) => r.views)
    .catch(() => post.views);

  return (
    <article className="py-10 sm:py-16">
      <Link
        href="/"
        className="font-mono text-[10px] uppercase tracking-label text-ink-soft underline-offset-4 transition-colors hover:text-accent hover:underline sm:text-[11px]"
      >
        ← 返回全部文章
      </Link>

      <Reveal className="mx-auto mt-9 max-w-3xl text-left sm:mt-12 sm:text-center">
        <p className="mb-6 inline-block rounded-full bg-paper-dim px-3 py-1 font-mono text-[10px] uppercase tracking-label text-ink-soft">
          {post.category}
        </p>
        <h1 className="font-serif text-[2.35rem] font-light leading-[1.06] tracking-tight text-ink text-balance sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-label text-ink-soft sm:mt-7 sm:block sm:text-[11px]">
          {post.author} · {formatDate(post.createdAt)} · {wordCountLabel(post.content)} · {readingTime(post.content)} 分钟 · {views.toLocaleString()} 次阅读
        </p>
      </Reveal>

      <div className="mx-auto mt-10 max-w-2xl border-t border-hairline pt-9 sm:mt-14 sm:pt-12">
        <Markdown content={post.content} />
      </div>

      <div className="mx-auto mt-12 max-w-2xl border-t border-hairline pt-8 text-center sm:mt-16 sm:pt-10">
        <a
          href="https://github.com/ryker"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-ink px-6 py-3 font-mono text-[10px] uppercase tracking-label text-paper transition-colors hover:bg-accent sm:px-7 sm:py-3.5 sm:text-[11px]"
        >
          去 GitHub 看看 →
        </a>
      </div>
    </article>
  );
}
