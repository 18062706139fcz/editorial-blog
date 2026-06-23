"use client";

import { useEffect, useState } from "react";

// A live "people reading right now" pill. Sends a heartbeat every 15s and
// reads back the current online count from the in-memory presence endpoint.
export default function OnlineCount() {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let id = "";
    try {
      id = sessionStorage.getItem("visitor-id") ?? "";
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem("visitor-id", id);
      }
    } catch {
      id = Math.random().toString(36).slice(2);
    }

    let cancelled = false;
    const beat = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!cancelled) setOnline(data.online);
      } catch {
        // presence is a nicety; stay silent on failure
      }
    };

    beat();
    const timer = setInterval(beat, 15_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (online == null) return null;

  return (
    <span
      className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-label text-ink-soft sm:inline-flex"
      title={`${online} reading now`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {online} online
    </span>
  );
}
