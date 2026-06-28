export const labelClass =
  "mb-3 block font-mono text-[10px] uppercase tracking-label text-ink-soft";

export const inputClass =
  "w-full border-0 border-b border-hairline bg-transparent pb-2 font-serif text-base text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none sm:text-lg";

export function listToText(value?: string | null) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join("\n") : "";
  } catch {
    return "";
  }
}
