import Link from "next/link";
import type { Post } from "@prisma/client";
import { relativeTime, wordCountLabel } from "@/lib/utils/format";
import Reveal from "@/components/shared/Reveal";

export default function Timeline({ posts }: { posts: Post[] }) {
  return (
    <ol className="relative">
      {/* vertical axis line */}
      <span
        aria-hidden
        className="absolute left-[1rem] top-2 bottom-2 w-px bg-hairline sm:left-[1.4rem]"
      />
      {posts.map((post, i) => (
        <li key={post.id} className="relative">
          <Reveal delay={i * 90}>
            <Link
              href={`/posts/${post.slug}`}
              className="group flex items-start gap-4 py-5 sm:gap-7"
            >
              {/* index + node */}
              <div className="relative flex w-8 shrink-0 justify-center sm:w-11">
                <span className="relative z-10 mt-0.5 bg-paper px-1 font-mono text-[10px] tabular-nums tracking-label text-ink-soft transition-colors duration-300 group-hover:text-accent sm:text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="absolute left-1/2 top-2 z-20 h-1.5 w-1.5 -translate-x-1/2 translate-y-6 rounded-full bg-hairline ring-4 ring-paper transition-all duration-300 group-hover:scale-125 group-hover:bg-accent"
                />
              </div>

              {/* content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-label text-ink-soft sm:gap-x-2.5 sm:text-[10px]">
                  <span className="text-accent">{post.category}</span>
                  <span className="h-2.5 w-px bg-hairline" />
                  <span>{relativeTime(post.createdAt)}</span>
                  <span className="h-2.5 w-px bg-hairline" />
                  <span>{wordCountLabel(post.content)}</span>
                  <span className="h-2.5 w-px bg-hairline" />
                  <span>{post.views.toLocaleString()} 次阅读</span>
                </div>
                <h3 className="mt-2 font-serif text-[1.2rem] font-light leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-1.5 line-clamp-1 max-w-xl text-sm leading-relaxed text-ink-soft">
                  {post.excerpt}
                </p>
              </div>

              {/* arrow */}
              <span className="mt-1 hidden shrink-0 text-ink-soft opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100 sm:block">
                →
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
