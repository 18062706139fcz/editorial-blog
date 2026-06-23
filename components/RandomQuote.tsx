"use client";

import { useEffect, useState } from "react";

type Quote = { text: string; source: string };

const FALLBACK: Quote = {
  text: "我们塑造工具，此后工具塑造我们。",
  source: "McLuhan",
};

export default function RandomQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://v1.hitokoto.cn/?c=d&c=i&c=k", {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: { hitokoto: string; from?: string; from_who?: string }) => {
        const source = [data.from_who, data.from]
          .filter(Boolean)
          .join("·");
        setQuote({ text: data.hitokoto, source: source || "一言" });
      })
      .catch((err) => {
        // Ignore aborts (e.g. React StrictMode's double-mount in dev).
        if (err?.name === "AbortError") return;
        setQuote(FALLBACK);
      });
    return () => controller.abort();
  }, []);

  return (
    <figure className="mx-auto flex min-h-[3rem] max-w-xl items-center justify-center text-center">
      {quote ? (
        <div key={quote.text} className="animate-fade-up">
          <blockquote className="font-serif text-sm italic leading-relaxed text-ink-soft sm:text-lg">
            「{quote.text}」
          </blockquote>
          <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-label text-ink-soft/70">
            — {quote.source}
          </figcaption>
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
