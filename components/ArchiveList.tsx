import Link from "next/link";
import type { Post } from "@prisma/client";
import {
  formatDate,
  relativeTime,
  wordCountLabel,
  readingTime,
} from "@/lib/format";

export default function ArchiveList({ posts }: { posts: Post[] }) {
  return (
    <ul className="border-t border-hairline">
      {posts.map((post, i) => (
        <li key={post.id}>
          <Link
            href={`/posts/${post.slug}`}
            className="group grid grid-cols-[2rem_1fr] items-start gap-4 border-b border-hairline py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-8 sm:py-7"
          >
            {/* Index */}
            <span className="pt-1 font-mono text-[10px] tabular-nums tracking-label text-ink-soft transition-colors duration-300 group-hover:text-accent sm:pt-0 sm:text-[11px]">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Title block */}
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                {post.category}
              </span>
              <h3 className="mt-1.5 font-serif text-[20px] font-light leading-[1.18] tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-[26px]">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-1 max-w-xl text-sm leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
              {/* meta: relative time · words · reading time */}
              <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[9px] uppercase tracking-label text-ink-soft sm:gap-x-3 sm:text-[10px]">
                <span className="sm:hidden">{formatDate(post.createdAt)}</span>
                <span className="hidden text-ink-soft/70 sm:inline">
                  {relativeTime(post.createdAt)}
                </span>
                <span className="hidden h-2.5 w-px bg-hairline sm:inline-block" />
                <span>{wordCountLabel(post.content)}</span>
                <span className="h-2.5 w-px bg-hairline" />
                <span>{readingTime(post.content)} 分钟</span>
                <span className="h-2.5 w-px bg-hairline" />
                <span>{post.views.toLocaleString()} 次阅读</span>
              </div>
            </div>

            {/* Right: date + thumbnail */}
            <div className="hidden items-center gap-6 sm:flex">
              <span className="font-mono text-[10px] uppercase tracking-label tabular-nums text-ink-soft">
                {formatDate(post.createdAt)}
              </span>
              <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-paper-dim transition-colors duration-500 group-hover:bg-ink">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-soft/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative font-serif text-2xl leading-none text-ink/15 transition-colors duration-500 group-hover:text-paper">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-1 right-1.5 text-accent opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:opacity-100">
                  →
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
