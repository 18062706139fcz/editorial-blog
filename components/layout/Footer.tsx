"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logomark from "@/components/shared/Logomark";

const GITHUB_URL = "https://github.com/ryker";

export default function Footer() {
  const pathname = usePathname();
  const isNightRoute = pathname === "/night";
  const isDeskRoute = pathname === "/desk" || pathname.startsWith("/desk/");

  if (isDeskRoute) return null;

  return (
    <footer
      className={`bg-ink text-paper ${
        isNightRoute
          ? "mt-0 border-t border-white/10 bg-[#171411]"
          : "mt-28"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logomark className="h-10 w-10 text-[26px] bg-paper [&>span:first-child]:text-ink" />
              <p className="font-serif text-4xl tracking-tight">Ryker</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
              关于 AI 工程、提示词和软件品味的文章与短札。
            </p>
          </div>
          <div className="flex flex-wrap gap-8">
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-label text-paper/60 transition-colors hover:text-paper"
            >
              文章
            </Link>
            <Link
              href="/thinking"
              className="font-mono text-[11px] uppercase tracking-label text-paper/60 transition-colors hover:text-paper"
            >
              短札
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-label text-paper/60 transition-colors hover:text-paper"
            >
              GitHub
            </a>
            <Link
              href="/admin"
              className="font-mono text-[11px] uppercase tracking-label text-paper/60 transition-colors hover:text-paper"
            >
              后台
            </Link>
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between border-t border-paper/15 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-label text-paper/40">
            © {new Date().getFullYear()} Ryker
          </p>
          <p className="font-mono text-[11px] uppercase tracking-label text-paper/40">
            保持判断
          </p>
        </div>
      </div>
    </footer>
  );
}
