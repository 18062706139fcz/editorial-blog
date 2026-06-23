"use client";

import { useEffect, useState } from "react";

/**
 * Hero headline that reveals word-by-word on mount with a staggered
 * mask-up motion. Accepts plain words; the `accent` word renders italic.
 */
export default function HeroTitle({
  words,
  accentIndex,
}: {
  words: string[];
  accentIndex: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="max-w-2xl font-serif text-[2.15rem] font-light leading-[1.08] tracking-tight text-ink sm:text-[3.5rem]">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <span
            className={`inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            } ${i === accentIndex ? "italic text-accent" : ""}`}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </div>
  );
}
