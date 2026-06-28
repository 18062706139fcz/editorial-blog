import Link from "next/link";
import type { HiddenRoom as HiddenRoomData } from "@/lib/features/hidden-rooms";
import { styles, type RoomStyle } from "./styles";

function LostScene({ style }: { style: RoomStyle }) {
  return (
    <div
      aria-hidden
      className={`relative min-h-[20rem] overflow-hidden rounded-[8px] border ${style.scene}`}
    >
      <div className="absolute left-8 top-14 h-px w-[72%] rotate-[-8deg] bg-[#8f7a62]" />
      <div className="absolute bottom-16 left-16 h-px w-[78%] rotate-[12deg] bg-[#4a4036]" />
      <div className="absolute left-[18%] top-[30%] h-32 w-px rotate-[16deg] bg-[#7a6754]" />
      <div className="absolute right-[22%] top-[22%] h-40 w-px rotate-[-14deg] bg-[#7a6754]" />
      {["旧链接", "空页", "背面"].map((label, index) => (
        <span
          key={label}
          className={`absolute rounded-[6px] border border-[#6a5a49] bg-[#2b241d] px-4 py-2 font-mono text-[10px] uppercase tracking-label text-[#ead9c6] shadow-[0_18px_42px_-30px_rgba(0,0,0,0.75)] ${
            index === 0
              ? "left-[12%] top-[22%] rotate-[-5deg]"
              : index === 1
                ? "right-[18%] top-[42%] rotate-[4deg]"
                : "bottom-[18%] left-[42%] rotate-[-2deg]"
          }`}
        >
          {label}
        </span>
      ))}
      <div className="absolute bottom-8 left-8 right-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-label text-[#a89682]">
        <span className={`h-1.5 w-10 rounded-full ${style.line}`} />
        <span>route not listed</span>
      </div>
    </div>
  );
}

function NightScene({ style }: { style: RoomStyle }) {
  const bars = [32, 58, 44, 78, 52, 68, 38, 84, 46, 62, 36, 70];

  return (
    <div
      aria-hidden
      className={`relative min-h-[20rem] overflow-hidden rounded-[8px] border ${style.scene}`}
    >
      <div className="absolute inset-x-8 top-9 flex items-center justify-between border-b border-[#384147] pb-4 font-mono text-[10px] uppercase tracking-label text-[#b5c2bf]">
        <span>fm 02.17</span>
        <span>signal weak</span>
      </div>
      <div className="absolute left-8 right-8 top-28 flex h-32 items-end gap-2">
        {bars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={`w-full rounded-t-[4px] ${style.line} opacity-70`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="absolute bottom-8 left-8 right-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <p className="max-w-sm font-serif text-2xl font-light leading-tight text-[#f4efe5]">
          白天太亮的判断，夜里会自己降噪。
        </p>
        <span className="rounded-[6px] border border-[#384147] px-4 py-2 font-mono text-[10px] uppercase tracking-label text-[#b5c2bf]">
          do not optimize after midnight
        </span>
      </div>
    </div>
  );
}

function DeskScene({ style }: { style: RoomStyle }) {
  const objects = [
    ["便签", "left-[9%] top-[18%] rotate-[-5deg] bg-[#fff6b8]"],
    ["杯口", "right-[14%] top-[22%] rotate-[3deg] bg-[#d9e6dc]"],
    ["键盘", "bottom-[17%] left-[18%] rotate-[1deg] bg-[#1c1916] text-paper"],
    ["线缆", "bottom-[22%] right-[18%] rotate-[-4deg] bg-[#e7d3c2]"],
  ];

  return (
    <div
      aria-hidden
      className={`relative min-h-[20rem] overflow-hidden rounded-[8px] border ${style.scene}`}
    >
      <div className="absolute inset-x-8 top-8 h-px bg-[#d0c2ae]" />
      <div className="absolute bottom-8 left-8 right-8 h-px bg-[#d0c2ae]" />
      {objects.map(([label, className]) => (
        <span
          key={label}
          className={`absolute rounded-[6px] border border-[#cabcaa] px-5 py-4 font-mono text-[10px] uppercase tracking-label shadow-[0_18px_48px_-34px_rgba(28,25,22,0.45)] ${className}`}
        >
          {label}
        </span>
      ))}
      <p className="absolute bottom-14 left-10 max-w-[15rem] font-serif text-2xl font-light leading-tight text-ink">
        不是整理完成，只是暂时能继续工作。
      </p>
    </div>
  );
}

function HiddenRoomScene({
  room,
  style,
}: {
  room: HiddenRoomData;
  style: RoomStyle;
}) {
  if (room.slug === "lost") return <LostScene style={style} />;
  if (room.slug === "night") return <NightScene style={style} />;
  return <DeskScene style={style} />;
}

export default function HiddenRoom({ room }: { room: HiddenRoomData }) {
  const style = styles[room.slug];

  return (
    <div className={`-mx-6 min-h-[calc(100svh-4rem)] ${style.shell}`}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,0.8fr)] lg:items-start">
        <section className="min-w-0">
          <p
            className={`font-mono text-[10px] uppercase tracking-label sm:text-[11px] ${style.eyebrow}`}
          >
            {room.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-[2.6rem] font-light leading-[1.04] tracking-tight text-balance sm:text-6xl">
            {room.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed opacity-[0.72] sm:text-lg">
            {room.summary}
          </p>

          <div
            className={`mt-8 rounded-[8px] border p-4 sm:p-5 ${style.panel}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/15 pb-4 font-mono text-[10px] uppercase tracking-label opacity-70">
              <span>{room.coordinate}</span>
              <span>{room.returnLabel}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {room.fragments.map((fragment) => (
                <span
                  key={fragment}
                  className="rounded-full border border-current/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-label opacity-[0.72]"
                >
                  {fragment}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {room.actions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className={`inline-flex min-h-11 items-center rounded-full px-5 py-3 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 sm:text-[11px] ${
                  index === 0 ? style.action : style.quietAction
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="min-w-0">
          <HiddenRoomScene room={room} style={style} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {room.objects.map((object) => (
              <article
                key={object.title}
                className={`rounded-[8px] border p-5 shadow-[0_18px_52px_-40px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-0.5 ${style.object}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-label opacity-[0.62]">
                  <span>{object.label}</span>
                  <span>{object.meta}</span>
                </div>
                <h2 className="mt-4 font-serif text-2xl font-light leading-tight">
                  {object.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed opacity-[0.72]">
                  {object.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
