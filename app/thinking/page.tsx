import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  artifactKindLabel,
  getThoughtModeLabel,
  getThoughtModes,
  getThinkingArtifacts,
  sampleArtifacts,
  type Artifact,
  type ThoughtMode,
} from "@/lib/marginalia";
import { prisma } from "@/lib/db";
import { thoughtRecordToArtifact } from "@/lib/thoughts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "短札 — Ryker",
  description: "还没长成文章的想法、提问、摘录、提示词和外部对象。",
};

const toneClasses: Record<Artifact["tone"], string> = {
  Paper: "border-[#d8cfbd] bg-[#fbf8ef]",
  Ink: "border-[#2b2824] bg-[#181512] text-paper",
  Ember: "border-[#bd6f50] bg-[#d9825d] text-[#21140f]",
  Blueprint: "border-[#a8bfbd] bg-[#dce8e6] text-[#172024]",
};

function isThoughtMode(value: string | undefined): value is ThoughtMode {
  return [
    "all",
    "note",
    "question",
    "quote",
    "prompt",
    "tool",
    "object",
  ].includes(value ?? "");
}

function formatChineseDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function ThinkingObject({ artifact }: { artifact: Artifact }) {
  if (!artifact.object) return null;

  return (
    <div className="mt-5 rounded-[6px] border border-current/15 bg-current/[0.04] p-4">
      <p className="font-mono text-[10px] uppercase tracking-label opacity-60">
        {artifact.object.label}
      </p>
      <h3 className="mt-2 font-serif text-2xl font-light leading-tight tracking-tight">
        {artifact.object.title}
      </h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-label opacity-55">
        {artifact.object.meta}
      </p>
      <p className="mt-3 text-sm leading-relaxed opacity-70">
        {artifact.object.description}
      </p>
    </div>
  );
}

function ThinkingEntry({ artifact }: { artifact: Artifact }) {
  const stats = artifact.stats ?? { views: 0, likes: 0, comments: 0 };

  return (
    <article className="mx-auto grid max-w-5xl gap-4 border-t border-hairline py-8 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-8 sm:py-10 lg:grid-cols-[8.5rem_minmax(0,44rem)]">
      <aside className="relative font-mono text-[10px] uppercase tracking-label text-ink-soft sm:pt-1 sm:text-[11px]">
        <span className="absolute -left-4 top-1 hidden h-2 w-2 rounded-full bg-accent sm:block" />
        <p>{formatChineseDate(artifact.createdAt)}</p>
        <p className="mt-2">{artifact.thread}</p>
      </aside>

      <div
        className={`mx-1 rounded-[8px] border px-6 py-6 shadow-[0_18px_50px_-36px_rgba(28,25,22,0.38)] transition-transform duration-500 hover:-translate-y-0.5 sm:mx-0 sm:px-8 sm:py-7 ${
          toneClasses[artifact.tone]
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-label opacity-65">
          <span>{artifactKindLabel(artifact.kind)}</span>
          <span>Ryker</span>
        </div>

        <h2 className="mt-5 max-w-xl font-serif text-[1.55rem] font-light leading-[1.12] sm:text-[2.15rem]">
          {artifact.title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-[1.85] opacity-75 sm:text-[15px]">
          {artifact.body}
        </p>

        {artifact.items?.length ? (
          <ul className="mt-5 grid gap-2 border-y border-current/15 py-4 font-mono text-[10px] uppercase tracking-label">
            {artifact.items.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-current/45" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <ThinkingObject artifact={artifact} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-current/15 pt-4 font-mono text-[10px] uppercase tracking-label opacity-60">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>{stats.views} 次阅读</span>
            <span>{stats.likes} 喜欢</span>
            <span>{stats.comments} 讨论</span>
          </div>
          {artifact.href ? (
            <a
              href={artifact.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-accent"
            >
              来源 -&gt;
            </a>
          ) : (
            <span>{artifact.source ?? "边注"}</span>
          )}
        </div>
      </div>
    </article>
  );
}

async function getPublicArtifacts() {
  const thoughts = await prisma.thought
    .findMany({
      where: { published: true },
      orderBy: [{ createdAt: "desc" }],
    })
    .catch(() => []);

  return thoughts.length
    ? [...thoughts.map(thoughtRecordToArtifact), ...sampleArtifacts]
    : sampleArtifacts;
}

export default async function ThinkingPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const artifacts = await getPublicArtifacts();
  const activeMode = isThoughtMode(searchParams.mode)
    ? searchParams.mode
    : "all";
  const modes = getThoughtModes(artifacts);
  const entries = getThinkingArtifacts(artifacts, activeMode);

  return (
    <div className="py-10 sm:py-16">
      <Reveal>
        <section className="border-b border-hairline pb-10 sm:pb-14">
          <p className="font-mono text-[10px] uppercase tracking-label text-ink-soft sm:text-[11px]">
            一闪而过
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-serif text-[3rem] font-light leading-[1.02] text-ink sm:text-7xl">
                还没长成文章的想法。
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                这里不是文章列表，而是公开的工作台：问题、摘录、提示词、链接对象，以及暂时还不值得写成长文的判断。
              </p>
            </div>
            <div className="rounded-[8px] border border-hairline bg-paper-dim/60 p-5 shadow-[0_18px_55px_-40px_rgba(28,25,22,0.35)]">
              <p className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                短札数量
              </p>
              <p className="mt-3 font-serif text-5xl font-light tracking-tight text-ink">
                {entries.length}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                首页只取精选，这里保留完整流。
              </p>
            </div>
          </div>

          <nav className="mt-8 border-y border-hairline py-3">
            <div className="no-scrollbar -mx-1 overflow-x-auto py-0.5">
              <div className="flex min-w-max items-center gap-2 px-1 sm:min-w-0 sm:flex-wrap sm:gap-x-3 sm:gap-y-2 lg:flex-nowrap lg:justify-between">
                {modes.map((mode) => {
                  const active = activeMode === mode.key;
                  return (
                    <Link
                      key={mode.key}
                      href={
                        mode.key === "all"
                          ? "/thinking"
                          : `/thinking?mode=${mode.key}`
                      }
                      scroll={false}
                      className={`group inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-[11px] ${
                        active
                          ? "bg-ink text-paper shadow-[0_10px_28px_-20px_rgba(0,0,0,0.55)]"
                          : "text-ink-soft hover:bg-paper-dim hover:text-ink"
                      }`}
                    >
                      <span>{mode.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                          active ? "bg-paper/15" : "bg-paper-dim text-ink-soft"
                        }`}
                      >
                        {mode.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-label text-ink-soft">
              当前：{getThoughtModeLabel(activeMode)}
            </p>
          </nav>
        </section>
      </Reveal>

      <section className="mt-2">
        {entries.map((artifact, index) => (
          <Reveal key={artifact.id} delay={Math.min(index * 60, 360)}>
            <ThinkingEntry artifact={artifact} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
