"use client";

import { FormEvent, useState } from "react";

export default function DeskComposer({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (input: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = value.trim();
    if (!input || loading) return;
    onSubmit(input);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[8px] border border-white/10 bg-[#101418] p-3 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.9)]"
    >
      <label
        htmlFor="desk-composer"
        className="sr-only"
      >
        Desk input
      </label>
      <div className="flex items-end gap-3">
        <span className="hidden pb-3 font-mono text-[12px] text-[#82d99b] sm:inline">
          ryker@desk %
        </span>
        <textarea
          id="desk-composer"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={2}
          placeholder="Ask for a note, list, decision matrix, or type help..."
          className="min-h-12 flex-1 resize-none bg-transparent font-mono text-sm leading-relaxed text-[#f4f7f1] outline-none placeholder:text-[#d6e2d6]/32"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="min-h-11 rounded-[6px] border border-[#82d99b]/30 bg-[#82d99b]/10 px-4 font-mono text-[10px] uppercase tracking-label text-[#d6e2d6] transition-colors hover:bg-[#82d99b]/18 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "wait" : "send"}
        </button>
      </div>
    </form>
  );
}
