export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Relative time in Chinese, e.g. "3 天前" / "刚刚" — borrowed from innei.in
export function relativeTime(date: Date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.max(0, now - then);

  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < min) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < month) return `${Math.floor(diff / day)} 天前`;
  if (diff < year) return `${Math.floor(diff / month)} 个月前`;
  return `${Math.floor(diff / year)} 年前`;
}

// Count words: CJK characters counted individually + latin words.
export function countWords(content: string) {
  const text = content
    .replace(/[#>*`_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const latin = (text.match(/[a-zA-Z0-9]+/g) || []).length;
  return cjk + latin;
}

// Estimated reading time in minutes (~400 cjk wpm reading speed).
export function readingTime(content: string) {
  const words = countWords(content);
  return Math.max(1, Math.round(words / 400));
}

// Compact word count label, e.g. "1.3 千字" / "320 字"
export function wordCountLabel(content: string) {
  const n = countWords(content);
  if (n >= 1000) return `${(n / 1000).toFixed(1)} 千字`;
  return `${n} 字`;
}
