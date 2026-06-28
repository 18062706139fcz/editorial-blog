"use client";

import { useEffect, useState } from "react";
import {
  HITOKOTO_ENDPOINT,
  normalizeHitokotoQuote,
  type Quote,
} from "@/lib/features/living-site";

export default function RandomQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuote() {
      try {
        const response = await fetch(HITOKOTO_ENDPOINT, {
          signal: controller.signal,
        });
        const data = await response.json();
        setQuote(normalizeHitokotoQuote(data));
      } catch {
        if (!controller.signal.aborted) {
          setQuote(
            normalizeHitokotoQuote({
              hitokoto: "我们塑造工具，此后工具塑造我们。",
              from_who: "McLuhan",
            }),
          );
        }
      }
    }

    loadQuote();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <figure className="mx-auto flex min-h-[5rem] max-w-xl items-center justify-center text-center">
      {quote ? (
        <div
          key={quote.text}
          className="animate-fade-up rounded-[8px] border border-hairline bg-paper-dim/70 px-5 py-4 shadow-[0_24px_70px_-48px_rgba(28,25,22,0.55)]"
        >
          <figcaption className="font-mono text-[10px] uppercase tracking-label text-accent">
            一言
          </figcaption>
          <blockquote className="mt-2 font-serif text-sm italic leading-relaxed text-ink-soft sm:text-lg">
            「{quote.text}」
          </blockquote>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-ink-soft/70">
            {quote.source}
          </p>
        </div>
      ) : (
        <span
          aria-hidden
          className="h-px w-10 animate-pulse bg-hairline"
        />
      )}
    </figure>
  );
}
