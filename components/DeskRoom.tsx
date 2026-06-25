import Link from "next/link";
import type { HiddenRoom } from "@/lib/hidden-rooms";

const deskObjects = [
  {
    label: "sticky",
    title: "今天别做大系统",
    body: "先把一个小交互做得像是真的有人用过，再考虑下一层结构。",
    className: "bg-[#fff1a8] rotate-[-3deg] lg:col-span-2",
  },
  {
    label: "cup",
    title: "冷掉也没关系",
    body: "半小时后还热的想法，才值得写进文章。",
    className: "bg-[#dbe8df] rotate-[2deg]",
  },
  {
    label: "keycap",
    title: "空格键更亮",
    body: "删掉的部分决定气质。",
    className: "bg-[#1c1916] text-paper rotate-[-1deg]",
  },
  {
    label: "cable",
    title: "暂时不要整理",
    body: "只有混乱开始索要利息时，才重新布线。",
    className: "bg-[#ead5c3] rotate-[2deg] lg:col-span-2",
  },
];

export default function DeskRoom({ room }: { room: HiddenRoom }) {
  return (
    <div className="-mx-6 min-h-[calc(100svh-4rem)] bg-[#f4eadc] text-ink">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(25rem,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[10px] uppercase tracking-label text-accent">
              {room.eyebrow}
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-[2.65rem] font-light leading-[1.03] tracking-tight sm:text-6xl">
              书桌抽屉。
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {room.summary}
            </p>

            <div className="mt-7 rounded-[8px] border border-[#d4c5ad] bg-[#fff8ea] p-5 shadow-[0_24px_70px_-50px_rgba(28,25,22,0.28)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#e0d2bd] pb-4 font-mono text-[10px] uppercase tracking-label text-ink-soft">
                <span>{room.coordinate}</span>
                <span>{room.returnLabel}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {room.fragments.map((fragment) => (
                  <span
                    key={fragment}
                    className="rounded-[6px] border border-[#e0d2bd] bg-paper px-3 py-2 font-mono text-[10px] uppercase tracking-label text-ink-soft"
                  >
                    {fragment}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {room.actions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`inline-flex min-h-11 items-center rounded-full px-5 font-mono text-[10px] uppercase tracking-label transition-colors ${
                    index === 0
                      ? "bg-ink text-paper hover:bg-accent"
                      : "border border-[#d4c5ad] text-ink-soft hover:border-accent hover:text-ink"
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative rounded-[10px] border border-[#cab89d] bg-[#e6d6bd] p-4 shadow-[0_36px_100px_-70px_rgba(28,25,22,0.45)] sm:p-6">
            <div className="absolute inset-x-6 top-6 h-px bg-[#c7b392]" />
            <div className="absolute bottom-6 left-6 top-6 w-px bg-[#c7b392]" />
            <div className="grid min-h-[32rem] gap-4 lg:grid-cols-3">
              <div className="rounded-[8px] border border-[#bfa988] bg-[#f8efd8] p-4 shadow-inner lg:col-span-2">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-label text-ink-soft">
                  <span>work surface</span>
                  <span>not archived</span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {deskObjects.map((object) => (
                    <article
                      key={object.title}
                      className={`min-h-36 rounded-[8px] border border-black/10 p-5 shadow-[0_18px_40px_-32px_rgba(28,25,22,0.45)] transition-transform duration-300 hover:-translate-y-1 ${object.className}`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-label opacity-55">
                        {object.label}
                      </p>
                      <h2 className="mt-3 font-serif text-2xl font-light leading-tight">
                        {object.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed opacity-70">
                        {object.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="grid gap-4">
                <div className="rounded-[8px] border border-[#bfa988] bg-[#fff8ea] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-label text-accent">
                    inbox
                  </p>
                  <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-ink-soft">
                    <li className="border-b border-[#e0d2bd] pb-3">
                      一个还没写完的判断
                    </li>
                    <li className="border-b border-[#e0d2bd] pb-3">
                      两个可删可留的段落
                    </li>
                    <li>三条明天再看的链接</li>
                  </ul>
                </div>

                <div className="rounded-[8px] border border-[#bfa988] bg-[#1c1916] p-5 text-paper">
                  <p className="font-mono text-[10px] uppercase tracking-label text-paper/45">
                    drawer rule
                  </p>
                  <p className="mt-4 font-serif text-2xl font-light leading-tight">
                    整洁不是目的，能继续判断才是。
                  </p>
                </div>

                <div className="rounded-[8px] border border-[#bfa988] bg-[#fff8ea] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                    surface map
                  </p>
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-8 rounded-[4px] border border-[#e0d2bd] ${
                          index % 5 === 0
                            ? "bg-accent/20"
                            : index % 3 === 0
                              ? "bg-[#dbe8df]"
                              : "bg-paper"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
