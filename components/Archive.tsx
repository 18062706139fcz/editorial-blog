"use client";

import { useState } from "react";
import type { Post } from "@prisma/client";
import ArchiveList from "@/components/ArchiveList";

const CATEGORIES = ["All", "Prompting", "Essays", "News"];

export default function Archive({
  posts,
  initialCategory = "All",
}: {
  posts: Post[];
  initialCategory?: string;
}) {
  const [active, setActive] = useState(initialCategory);

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <div className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-serif text-[1.75rem] tracking-tight text-ink sm:text-3xl">
            The archive
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
            / 归档
          </span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors sm:px-4 sm:text-[11px] ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-paper-dim hover:text-ink"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-serif text-2xl italic text-ink-soft">
          No articles in this category yet.
        </p>
      ) : (
        <ArchiveList posts={filtered} />
      )}
    </>
  );
}
