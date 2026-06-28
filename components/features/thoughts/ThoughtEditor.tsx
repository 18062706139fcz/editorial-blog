"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Thought } from "@prisma/client";
import { kindOptions, sizeOptions, toneOptions } from "./options";
import { inputClass, labelClass, listToText } from "./form-utils";

export default function ThoughtEditor({ thought }: { thought?: Thought }) {
  const router = useRouter();
  const isEdit = Boolean(thought);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: thought?.title ?? "",
    body: thought?.body ?? "",
    kind: thought?.kind ?? "Observation",
    thread: thought?.thread ?? "随想",
    tone: thought?.tone ?? "Paper",
    size: thought?.size ?? "Small",
    source: thought?.source ?? "",
    href: thought?.href ?? "",
    items: listToText(thought?.items),
    tags: listToText(thought?.tags),
    objectLabel: thought?.objectLabel ?? "",
    objectTitle: thought?.objectTitle ?? "",
    objectMeta: thought?.objectMeta ?? "",
    objectDescription: thought?.objectDescription ?? "",
    pinned: thought?.pinned ?? false,
    featured: thought?.featured ?? false,
    published: thought?.published ?? true,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateKind(kind: string) {
    const option = kindOptions.find((item) => item.value === kind);
    setForm((current) => ({
      ...current,
      kind,
      thread: option?.thread ?? current.thread,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.body) {
      setError("标题和正文不能为空。");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(isEdit ? `/api/thoughts/${thought!.id}` : "/api/thoughts", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/thoughts");
      router.refresh();
      return;
    }

    const body = await res.json().catch(() => ({}));
    setError(body.error || "保存失败。");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 sm:space-y-10">
      <div>
        <label className={labelClass}>标题 *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="一句还没长成文章的话"
        />
      </div>

      <div>
        <label className={labelClass}>正文 *</label>
        <textarea
          className={`${inputClass} min-h-[9rem] resize-y leading-relaxed`}
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          placeholder="写下想法、问题、摘录或对象说明。"
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <label className={labelClass}>类型</label>
          <select
            className={`${inputClass} font-sans`}
            value={form.kind}
            onChange={(e) => updateKind(e.target.value)}
          >
            {kindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>频道</label>
          <input
            className={inputClass}
            value={form.thread}
            onChange={(e) => update("thread", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>卡片语气</label>
          <select
            className={`${inputClass} font-sans`}
            value={form.tone}
            onChange={(e) => update("tone", e.target.value)}
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>首页尺寸</label>
          <select
            className={`${inputClass} font-sans`}
            value={form.size}
            onChange={(e) => update("size", e.target.value)}
          >
            {sizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <label className={labelClass}>来源名</label>
          <input
            className={inputClass}
            value={form.source}
            onChange={(e) => update("source", e.target.value)}
            placeholder="边注 / 豆瓣 / GitHub"
          />
        </div>
        <div>
          <label className={labelClass}>来源链接</label>
          <input
            className={inputClass}
            value={form.href}
            onChange={(e) => update("href", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <label className={labelClass}>清单项（一行一个）</label>
          <textarea
            className={`${inputClass} min-h-[7rem] resize-y font-mono text-sm leading-relaxed`}
            value={form.items}
            onChange={(e) => update("items", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>标签（一行一个或逗号分隔）</label>
          <textarea
            className={`${inputClass} min-h-[7rem] resize-y font-mono text-sm leading-relaxed`}
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-[8px] border border-hairline bg-paper-dim/45 p-5">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-label text-ink-soft">
          外部对象卡（可选）
        </p>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          <div>
            <label className={labelClass}>对象类型</label>
            <input
              className={inputClass}
              value={form.objectLabel}
              onChange={(e) => update("objectLabel", e.target.value)}
              placeholder="电影 / 书 / 项目"
            />
          </div>
          <div>
            <label className={labelClass}>对象标题</label>
            <input
              className={inputClass}
              value={form.objectTitle}
              onChange={(e) => update("objectTitle", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>对象信息</label>
            <input
              className={inputClass}
              value={form.objectMeta}
              onChange={(e) => update("objectMeta", e.target.value)}
              placeholder="2000 / 王家卫"
            />
          </div>
          <div>
            <label className={labelClass}>对象说明</label>
            <input
              className={inputClass}
              value={form.objectDescription}
              onChange={(e) => update("objectDescription", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <label className="flex cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-label text-ink-soft">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          放入首页边注柜
        </label>
        <label className="flex cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-label text-ink-soft">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(e) => update("pinned", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          首页置顶
        </label>
        <label className="flex cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-label text-ink-soft">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          发布
        </label>
      </div>

      {error && (
        <p className="font-mono text-[11px] uppercase tracking-label text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4 border-t border-hairline pt-7 sm:flex-row sm:items-center sm:gap-6 sm:pt-8">
        <button
          type="submit"
          disabled={loading}
          className="border border-ink px-6 py-3 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 sm:text-[11px]"
        >
          {loading ? "保存中…" : isEdit ? "保存修改" : "发布短札"}
        </button>
        <Link
          href="/admin/thoughts"
          className="font-mono text-[10px] uppercase tracking-label text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline sm:text-[11px]"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
