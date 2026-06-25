import Link from "next/link";
import { prisma } from "@/lib/db";
import Archive from "@/components/Archive";
import Timeline from "@/components/Timeline";
import RandomQuote from "@/components/RandomQuote";
import SocialLinks from "@/components/SocialLinks";
import LivingStatus from "@/components/LivingStatus";
import Reveal from "@/components/Reveal";
import HeroTitle from "@/components/HeroTitle";
import FeaturedArt from "@/components/FeaturedArt";
import { formatDate, countWords } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const initialCategory = searchParams.category ?? "全部";

  const featured = await prisma.post.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const lead = featured[0];
  const rest = featured.slice(1);

  // Hero stats, in the familiar "N 篇 · N 万字 · N 天" shape.
  const allPosts = await prisma.post.findMany({
    where: { published: true },
    select: { content: true, createdAt: true },
  });
  const totalPosts = allPosts.length;
  const totalWords = allPosts.reduce((sum, p) => sum + countWords(p.content), 0);
  const wordsLabel =
    totalWords >= 10000
      ? `${(totalWords / 10000).toFixed(1)} 万字`
      : `${totalWords} 字`;
  const firstDate = allPosts.reduce(
    (min, p) => (p.createdAt < min ? p.createdAt : min),
    allPosts[0]?.createdAt ?? new Date(),
  );
  const daysRunning = Math.max(
    1,
    Math.round((Date.now() - new Date(firstDate).getTime()) / 86400000),
  );

  // Recent posts for the top timeline.
  const recent = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="pb-4">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex flex-col justify-start pb-12 pt-10 sm:pb-16 sm:pt-12 lg:min-h-[calc(100svh-4rem)] lg:justify-center lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center lg:gap-12">
          <Reveal>
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mb-6">
                <LivingStatus />
              </div>
              <h1 className="sr-only">
                我是 Ryker，记录 AI、代理和带着判断力构建软件这件事。
              </h1>
              <div aria-hidden className="text-balance">
                <HeroTitle
                  words={[
                    "我",
                    "写",
                    "AI、",
                    "代理，",
                    "也",
                    "写",
                    "把",
                    "软件",
                    "做得",
                    "有判断。",
                  ]}
                  accentIndex={2}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.png"
              alt="Ryker"
              className="hidden h-32 w-32 justify-self-end rotate-3 rounded-2xl border border-hairline bg-paper-dim object-cover shadow-[0_20px_60px_-20px_rgba(28,25,22,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 hover:scale-105 lg:block lg:h-44 lg:w-44"
            />
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="mt-7 grid gap-6 border-t border-hairline pt-6 sm:mt-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8 lg:mt-10 lg:pt-7">
            <p className="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              关于提示词、代理系统和软件品味的文章与现场笔记，写在日常工作缝隙里。
            </p>
            <Link
              href="#articles"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-ink px-6 py-3 font-mono text-[10px] uppercase tracking-label text-paper transition-colors duration-300 hover:bg-accent sm:px-7 sm:py-3.5 sm:text-[11px]"
            >
              阅读文章
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                ↓
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <dl className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-label text-ink-soft sm:mt-8 sm:gap-x-8 sm:text-[11px]">
            <div className="flex items-baseline gap-2">
              <dt className="font-serif text-xl font-light tabular-nums text-ink sm:text-2xl">
                {totalPosts}
              </dt>
              <dd>篇</dd>
            </div>
            <span className="h-3 w-px bg-hairline" />
            <div className="flex items-baseline gap-2">
              <dt className="font-serif text-xl font-light tabular-nums text-ink sm:text-2xl">
                {wordsLabel.split(" ")[0]}
              </dt>
              <dd>{wordsLabel.split(" ")[1]}</dd>
            </div>
            <span className="h-3 w-px bg-hairline" />
            <div className="flex items-baseline gap-2">
              <dt className="font-serif text-xl font-light tabular-nums text-ink sm:text-2xl">
                {daysRunning}
              </dt>
              <dd>天笔耕</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      {/* ── Home afterglow ───────────────────────────────────── */}
      <Reveal delay={300}>
        <section className="border-t border-hairline py-10 sm:py-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
            <RandomQuote />
            <SocialLinks />
          </div>
        </section>
      </Reveal>

      {/* ── Recent writing timeline ──────────────────────────── */}
      <section className="border-t border-hairline py-14 sm:py-20">
        <div className="mb-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mb-10">
          <h2 className="font-serif text-[1.75rem] tracking-tight text-ink sm:text-3xl">
            最近写下
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
            / 新近
          </span>
        </div>
        <Timeline posts={recent} />
      </section>

      {/* ── Featured spotlight ───────────────────────────────── */}
      {lead && (
        <section className="py-14 sm:py-20">
          <div className="mb-8 flex flex-col gap-2 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-serif text-[1.75rem] tracking-tight text-ink sm:text-3xl">
                精选文章
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
                / 精选
              </span>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-label text-ink-soft">
              编辑选择
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <Link href={`/posts/${lead.slug}`} className="group block">
                <FeaturedArt label={lead.category} title={lead.title} />
                <h3 className="mt-6 max-w-2xl font-serif text-[2rem] font-light leading-[1.08] tracking-tight text-ink transition-colors group-hover:text-accent sm:mt-7 sm:text-5xl">
                  {lead.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:mt-5 sm:text-lg">
                  {lead.excerpt}
                </p>
                <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-label text-ink-soft sm:mt-6">
                  {lead.author} · {formatDate(lead.createdAt)}
                  <span className="inline-flex items-center gap-1.5 text-accent opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100">
                    阅读 <span>→</span>
                  </span>
                </p>
              </Link>
            </Reveal>

            <div className="flex flex-col">
              {rest.map((post, i) => (
                <Reveal key={post.id} delay={(i + 1) * 100}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group flex gap-4 border-t border-hairline py-6 first:border-t-0 first:pt-0 sm:gap-6 sm:py-7"
                  >
                    <span className="font-serif text-2xl font-light leading-none text-hairline sm:text-3xl">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                        {post.category}
                      </span>
                      <h4 className="mt-2 font-serif text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl">
                        {post.title}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">
                        {post.excerpt}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-label text-accent opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100">
                        阅读 <span>→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All articles ─────────────────────────────────────── */}
      <section
        id="articles"
        className="scroll-mt-24 border-t border-hairline py-14 sm:py-20"
      >
        <Reveal>
          <Archive posts={posts} initialCategory={initialCategory} />
        </Reveal>
      </section>
    </div>
  );
}
