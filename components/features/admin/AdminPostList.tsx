"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Post } from "@prisma/client";
import { formatDate } from "@/lib/utils/format";

export default function AdminPostList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function togglePublish(post: Post) {
    setBusyId(post.id);
    await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(post: Post) {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setBusyId(post.id);
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (posts.length === 0) {
    return (
      <p className="py-16 text-center font-serif text-xl text-ink-soft">
        No posts yet. Create your first one.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {posts.map((post) => (
        <li
          key={post.id}
          className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                {post.category}
              </span>
              {!post.published && (
                <span className="font-mono text-[10px] uppercase tracking-label text-red-700">
                  Draft
                </span>
              )}
            </div>
            <h3 className="mt-1 font-serif text-xl leading-snug text-ink sm:truncate">
              {post.title}
            </h3>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-label text-ink-soft">
              {post.author} · {formatDate(post.createdAt)}
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:gap-5">
            <button
              onClick={() => togglePublish(post)}
              disabled={busyId === post.id}
              className="border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50 sm:border-0 sm:px-0 sm:py-0 sm:underline-offset-4 sm:hover:underline"
            >
              {post.published ? "Unpublish" : "Publish"}
            </button>
            <Link
              href={`/admin/posts/${post.id}`}
              className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper sm:border-0 sm:px-0 sm:py-0 sm:underline sm:decoration-hairline sm:underline-offset-4 sm:hover:bg-transparent sm:hover:text-ink sm:hover:decoration-ink"
            >
              Edit
            </Link>
            <button
              onClick={() => remove(post)}
              disabled={busyId === post.id}
              className="border border-red-700/25 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-red-700 transition-colors hover:border-red-700 disabled:opacity-50 sm:border-0 sm:px-0 sm:py-0 sm:underline-offset-4 sm:hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
