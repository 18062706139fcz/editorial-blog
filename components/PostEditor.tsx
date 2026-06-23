"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type { Post } from "@prisma/client";
import Markdown from "@/components/Markdown";

const labelClass =
  "mb-3 block font-mono text-[10px] uppercase tracking-label text-ink-soft";
const inputClass =
  "w-full border-0 border-b border-hairline bg-transparent pb-2 font-serif text-base text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none sm:text-lg";

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? "Essays",
    author: post?.author ?? "The Margin",
    coverImage: post?.coverImage ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    featured: post?.featured ?? false,
    published: post?.published ?? true,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/posts/${post!.id}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 sm:space-y-10">
      <div>
        <label className={labelClass}>标题 *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="一个有意图的标题"
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <label className={labelClass}>Slug {isEdit ? "" : "（可选）"}</label>
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="留空则自动从标题生成"
            disabled={isEdit}
          />
        </div>
        <div>
          <label className={labelClass}>分类</label>
          <input
            className={inputClass}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>作者</label>
          <input
            className={inputClass}
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>封面图链接</label>
          <input
            className={inputClass}
            value={form.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>摘要</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
        />
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className={`${labelClass} mb-0`}>正文 *（支持 Markdown）</label>
          <div className="grid grid-cols-2 gap-1 border border-hairline p-1 font-mono text-[10px] uppercase tracking-label sm:flex sm:border-0 sm:p-0">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={`px-3 py-2 transition-colors sm:py-1 ${
                !preview ? "bg-ink text-paper sm:bg-transparent sm:text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={`px-3 py-2 transition-colors sm:py-1 ${
                preview ? "bg-ink text-paper sm:bg-transparent sm:text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              预览
            </button>
          </div>
        </div>
        {preview ? (
          <div className="min-h-[16rem] rounded-lg border border-hairline bg-paper-dim/40 p-4 sm:min-h-[20rem] sm:p-6">
            {form.content ? (
              <Markdown content={form.content} />
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
                暂无内容可预览
              </p>
            )}
          </div>
        ) : (
          <textarea
            className={`${inputClass} min-h-[18rem] resize-y font-mono text-sm leading-relaxed sm:min-h-[28rem]`}
            rows={18}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder={"## 这是标题\n\n这是一段正文，可以用 **加粗**、*斜体*、[链接](https://…)。\n\n- 列表项一\n- 列表项二\n\n> 这是引用\n\n```js\nconsole.log('代码块');\n```"}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <label className="flex cursor-pointer items-center gap-3 font-mono text-[11px] uppercase tracking-label text-ink-soft">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          精选
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
          {loading ? "保存中…" : isEdit ? "保存修改" : "创建文章"}
        </button>
        <Link
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-label text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline sm:text-[11px]"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
