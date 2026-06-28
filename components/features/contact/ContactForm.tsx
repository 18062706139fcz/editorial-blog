"use client";

import { useState } from "react";

const inputClass =
  "w-full border-0 border-b border-hairline bg-transparent pb-2 font-serif text-lg text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none";
const labelClass =
  "mb-3 block font-mono text-[10px] uppercase tracking-label text-ink-soft";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.email) {
      setStatus("error");
      setError("姓名和邮箱不能为空。");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "发送失败，请稍后再试。");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "发送失败，请稍后再试。");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-start justify-center">
        <p className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
          已收到
        </p>
        <p className="mt-4 font-serif text-3xl leading-snug text-ink">
          消息已经送达。
          <br />
          我会尽快回复。
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 font-mono text-[11px] uppercase tracking-label text-ink underline decoration-hairline underline-offset-4 transition-colors hover:decoration-ink"
        >
          再写一条
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            姓名*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="你的名字"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            公司
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="公司或团队"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            电话
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (234) 567-8900"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            邮箱*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane.doe@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
            补充信息
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="想聊的事情、背景或链接"
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="font-mono text-[11px] uppercase tracking-label text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-ink px-6 py-3 font-mono text-[11px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "发送中…" : "发送消息"}
      </button>
    </form>
  );
}
