"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const suggestions = ["/help", "/show examples", "/show lab", "/clear"];

export default function DeskComposer({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (input: string) => void;
}) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestion = useMemo(() => {
    const input = value.trimStart().toLowerCase();
    if (!input) return "/help";
    return suggestions.find((item) => item.startsWith(input) && item !== input) ?? "";
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 128), 256)}px`;
  }, [value]);

  function commit(input: string) {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setHistory((current) =>
      current[current.length - 1] === trimmed ? current : [...current, trimmed],
    );
    setHistoryIndex(null);
    setValue("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commit(value);
  }

  function insertNewline() {
    const textarea = textareaRef.current;
    if (!textarea) {
      setValue((current) => `${current}\n`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setValue((current) => `${current.slice(0, start)}\n${current.slice(end)}`);
    requestAnimationFrame(() => {
      textarea.selectionStart = start + 1;
      textarea.selectionEnd = start + 1;
    });
  }

  function acceptSuggestion() {
    if (!suggestion) return false;
    setValue(suggestion);
    setHistoryIndex(null);
    return true;
  }

  function recallHistory(direction: -1 | 1) {
    if (!history.length) return;
    const nextIndex =
      historyIndex === null
        ? direction < 0
          ? history.length - 1
          : 0
        : Math.min(Math.max(historyIndex + direction, 0), history.length - 1);
    setHistoryIndex(nextIndex);
    setValue(history[nextIndex]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) {
        insertNewline();
        return;
      }
      if (value.endsWith("\\")) {
        setValue((current) => `${current.slice(0, -1)}\n`);
        return;
      }
      commit(value);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "j") {
      event.preventDefault();
      insertNewline();
      return;
    }

    if (event.key === "ArrowUp" && !value.includes("\n")) {
      event.preventDefault();
      recallHistory(-1);
      return;
    }

    if (event.key === "ArrowDown" && !value.includes("\n")) {
      event.preventDefault();
      recallHistory(1);
      return;
    }

    if ((event.key === "Tab" || event.key === "ArrowRight") && suggestion) {
      event.preventDefault();
      acceptSuggestion();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setValue("");
      setHistoryIndex(null);
    }
  }

  return (
    <form
      data-desk-zone="terminal-input"
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-[#16211d] bg-[#060809] px-4 py-4 font-mono sm:px-6 lg:px-8"
    >
      <label
        htmlFor="desk-composer"
        className="sr-only"
      >
        Desk input
      </label>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
        <span className="pt-3 text-[13px] text-[#82d99b]">
          ryker@desk %
        </span>
        <div className="relative">
          {!value && !loading ? (
            <span className="pointer-events-none absolute left-0 top-3 text-[15px] leading-7 text-[#d6e2d6]/28">
              输入任务、粘贴上下文，或 /help
            </span>
          ) : null}
          <textarea
            ref={textareaRef}
            id="desk-composer"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setHistoryIndex(null);
            }}
            onKeyDown={handleKeyDown}
            rows={4}
            spellCheck={false}
            aria-label="Desk terminal prompt"
            disabled={loading}
            className="relative z-10 block min-h-[8rem] max-h-[16rem] w-full resize-none overflow-hidden bg-transparent py-3 text-[15px] leading-7 text-[#f4f7f1] caret-[#82d99b] outline-none disabled:text-[#d6e2d6]/36"
          />
        </div>
      </div>
      <p className="mt-2 pl-0 text-[10px] uppercase tracking-label text-[#d6e2d6]/30 sm:pl-[8rem]">
        <span>enter submit / shift+enter newline / up-down history / tab complete</span>
        {suggestion ? <span>{` -> ${suggestion}`}</span> : null}
      </p>
      {!value && !loading ? (
        <div
          data-desk-input-placeholder
          className="mt-5 grid gap-2 pl-0 text-[11px] uppercase tracking-label text-[#d6e2d6]/22 sm:grid-cols-[8rem_minmax(0,1fr)] sm:pl-0"
        >
          <span className="text-[#82d99b]/44">session idle</span>
          <span>paste a thought, compare a choice, or ask for a small A2UI surface</span>
        </div>
      ) : null}
    </form>
  );
}
