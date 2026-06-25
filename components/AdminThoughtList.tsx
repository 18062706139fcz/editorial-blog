"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Thought } from "@prisma/client";
import { artifactKindLabel } from "@/lib/marginalia";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(date));
}

export default function AdminThoughtList({ thoughts }: { thoughts: Thought[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function togglePublish(thought: Thought) {
    setBusyId(thought.id);
    await fetch(`/api/thoughts/${thought.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...thought, published: !thought.published }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(thought: Thought) {
    if (!confirm(`删除“${thought.title}”？这个操作不可恢复。`)) return;
    setBusyId(thought.id);
    await fetch(`/api/thoughts/${thought.id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (thoughts.length === 0) {
    return (
      <p className="py-16 text-center font-serif text-xl text-ink-soft">
        还没有短札，先发一条。
      </p>
    );
  }

  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {thoughts.map((thought) => (
        <li
          key={thought.id}
          className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                {artifactKindLabel(thought.kind as never)} · {thought.thread}
              </span>
              {thought.featured && (
                <span className="font-mono text-[10px] uppercase tracking-label text-accent">
                  首页
                </span>
              )}
              {!thought.published && (
                <span className="font-mono text-[10px] uppercase tracking-label text-red-700">
                  草稿
                </span>
              )}
            </div>
            <h3 className="mt-1 font-serif text-xl leading-snug text-ink sm:truncate">
              {thought.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-ink-soft">
              {thought.body}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-ink-soft">
              {formatDate(thought.createdAt)} · {thought.views} 次阅读 ·{" "}
              {thought.likes} 喜欢
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:gap-5">
            <button
              onClick={() => togglePublish(thought)}
              disabled={busyId === thought.id}
              className="border border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-label text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50 sm:border-0 sm:px-0 sm:py-0 sm:underline-offset-4 sm:hover:underline"
            >
              {thought.published ? "下线" : "发布"}
            </button>
            <Link
              href={`/admin/thoughts/${thought.id}`}
              className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper sm:border-0 sm:px-0 sm:py-0 sm:underline sm:decoration-hairline sm:underline-offset-4 sm:hover:bg-transparent sm:hover:text-ink sm:hover:decoration-ink"
            >
              编辑
            </Link>
            <button
              onClick={() => remove(thought)}
              disabled={busyId === thought.id}
              className="border border-red-700/25 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-red-700 transition-colors hover:border-red-700 disabled:opacity-50 sm:border-0 sm:px-0 sm:py-0 sm:underline-offset-4 sm:hover:underline"
            >
              删除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
