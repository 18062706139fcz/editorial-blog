const GITHUB_URL = "https://github.com/ryker";

const LINKS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "GitHub",
    href: GITHUB_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
      </svg>
    ),
  },
  {
    label: "RSS",
    href: "/rss.xml",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M5 3a16 16 0 0 1 16 16h-3A13 13 0 0 0 5 6V3Zm0 7a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6v-3Zm1.5 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@ryker.dev",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3">
      {LINKS.map((link) => {
        const external = link.href.startsWith("http") || link.href.startsWith("mailto");
        return (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-soft transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper"
          >
            {link.icon}
          </a>
        );
      })}
    </div>
  );
}
