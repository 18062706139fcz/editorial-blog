import StatusBar from "@/components/layout/StatusBar";
import { getVisibleStatusItems, TODAY_STATUS_ITEMS } from "@/lib/features/living-site";

export default function LivingStatus() {
  const items = getVisibleStatusItems(TODAY_STATUS_ITEMS);

  return (
    <div className="flex max-w-full flex-wrap items-center gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-hairline bg-paper-dim/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-label text-ink-soft shadow-[0_10px_30px_-28px_rgba(28,25,22,0.35)] sm:shrink-0 sm:text-[11px]"
        >
          <span className="shrink-0 text-ink">{item.label}</span>
          <span className="min-w-0 truncate">{item.value}</span>
        </span>
      ))}
      <StatusBar />
    </div>
  );
}
