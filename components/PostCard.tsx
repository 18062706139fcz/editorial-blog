import Link from "next/link";
import type { Post } from "@prisma/client";
import { formatDate } from "@/lib/format";

export default function PostCard({
  post,
  index,
}: {
  post: Post;
  index?: number;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
    >
      <div className="mb-5 flex items-center justify-between">
        {typeof index === "number" && (
          <span className="font-mono text-[11px] tabular-nums tracking-label text-ink-soft">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="rounded-full bg-paper-dim px-3 py-1 font-mono text-[10px] uppercase tracking-label text-ink-soft transition-colors duration-300 group-hover:bg-accent group-hover:text-paper">
          {post.category}
        </span>
      </div>
      <h3 className="font-serif text-[26px] font-light leading-[1.15] tracking-tight text-ink">
        <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px] group-hover:text-accent">
          {post.title}
        </span>
      </h3>
      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">
        {post.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
        <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
          {post.author}
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-ink-soft">
          {formatDate(post.createdAt)}
          <span className="text-ink opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
