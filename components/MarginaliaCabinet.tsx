import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  artifactKindLabel,
  artifactSizeClass,
  getCabinetArtifacts,
  sampleArtifacts,
  type Artifact,
} from "@/lib/marginalia";

const toneClasses: Record<Artifact["tone"], string> = {
  Paper:
    "border-[#d8cfbd] bg-[#fbf8ef] text-ink shadow-[0_18px_45px_-32px_rgba(28,25,22,0.38)]",
  Ink:
    "border-[#2b2824] bg-[#181512] text-paper shadow-[0_20px_55px_-34px_rgba(0,0,0,0.65)]",
  Ember:
    "border-[#bd6f50] bg-[#d9825d] text-[#21140f] shadow-[0_18px_45px_-30px_rgba(178,83,48,0.5)]",
  Blueprint:
    "border-[#a8bfbd] bg-[#dce8e6] text-[#172024] shadow-[0_18px_45px_-32px_rgba(31,59,66,0.32)]",
};

const tiltClasses = [
  "md:-rotate-[0.45deg]",
  "md:rotate-[0.35deg]",
  "md:-rotate-[0.2deg]",
  "md:rotate-[0.5deg]",
];

const titleClasses: Record<Artifact["size"], string> = {
  Feature:
    "mt-7 max-w-[12ch] font-serif text-[2rem] font-light leading-[0.98] tracking-tight sm:text-[2.55rem]",
  Wide:
    "mt-6 max-w-[18ch] font-serif text-[1.7rem] font-light leading-[1.02] tracking-tight sm:text-[2.15rem]",
  Tall:
    "mt-8 max-w-[13ch] font-serif text-[1.85rem] font-light leading-[0.98] tracking-tight sm:text-[2.35rem]",
  Small:
    "mt-7 max-w-[16ch] font-serif text-[1.55rem] font-light leading-[1.05] tracking-tight sm:text-[1.9rem]",
};

function ArtifactBody({ artifact }: { artifact: Artifact }) {
  if (artifact.kind === "Quote") {
    return (
      <blockquote className="mt-5 border-l border-current/25 pl-4 font-serif text-[1.55rem] font-light leading-tight tracking-tight sm:text-[1.8rem]">
        &quot;{artifact.title}&quot;
      </blockquote>
    );
  }

  if (artifact.kind === "Rubric" && artifact.items?.length) {
    return (
      <div className="mt-6">
        <h3 className="max-w-[12ch] font-serif text-[2rem] font-light leading-[0.98] tracking-tight sm:text-[2.55rem]">
          {artifact.title}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-[0.72] sm:text-[15px]">
          {artifact.body}
        </p>
        <ul className="mt-5 grid gap-1.5 font-mono text-[10px] uppercase tracking-label">
          {artifact.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 border-t border-current/15 pt-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current/50" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <h3 className={titleClasses[artifact.size]}>{artifact.title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-[0.72] sm:text-[15px]">
        {artifact.body}
      </p>
    </>
  );
}

function ArtifactCard({
  artifact,
  index,
}: {
  artifact: Artifact;
  index: number;
}) {
  const content = (
    <article
      className={`${toneClasses[artifact.tone]} ${
        tiltClasses[index % tiltClasses.length]
      } group relative flex h-full flex-col overflow-hidden rounded-[6px] border p-5 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:rotate-0 sm:p-6`}
    >
      <span className="absolute left-5 top-0 h-1.5 w-16 rounded-b-full bg-current/10" />
      <div className="flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-label opacity-[0.68]">
        <span>{artifactKindLabel(artifact.kind)}</span>
        <span>{artifact.thread}</span>
      </div>

      <div className="flex flex-1 flex-col">
        <ArtifactBody artifact={artifact} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-current/15 pt-3 font-mono text-[10px] uppercase tracking-label opacity-[0.68]">
        <span>{artifact.source ?? artifact.createdAt}</span>
        {artifact.href && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            查看 -&gt;
          </span>
        )}
      </div>
    </article>
  );

  if (!artifact.href) return content;

  return (
    <Link
      href={artifact.href}
      className="block h-full"
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </Link>
  );
}

export default function MarginaliaCabinet({
  artifacts = sampleArtifacts,
}: {
  artifacts?: Artifact[];
}) {
  const cabinetArtifacts = getCabinetArtifacts(artifacts, 6);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-hairline bg-[#eee7d8] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="mb-10 grid gap-6 sm:mb-12 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <div>
              <h2 className="max-w-2xl font-serif text-[2.2rem] font-light leading-[1.02] text-ink sm:text-5xl">
                给想法留一个形状。
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                这里不是文章索引，而是写作边缘的摘录、提示词、问题和小规则。
              </p>
              <Link
                href="/thinking"
                className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:text-accent sm:text-[11px]"
              >
                查看全部短札
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[17rem]">
          {cabinetArtifacts.map((artifact, index) => (
            <Reveal
              key={artifact.id}
              delay={index * 70}
              className={`${artifactSizeClass(artifact.size)} h-full`}
            >
              <ArtifactCard artifact={artifact} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
