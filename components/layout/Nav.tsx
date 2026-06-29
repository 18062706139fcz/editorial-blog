"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logomark from "@/components/shared/Logomark";
import OnlineCount from "@/components/features/presence/OnlineCount";

const navItems = [
  { href: "/", label: "文章" },
  { href: "/thinking", label: "短札" },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
  const hasActiveItem = activeIndex >= 0;
  const isNightRoute = pathname === "/night";
  const isDeskRoute = pathname === "/desk" || pathname.startsWith("/desk/");
  const isDarkRoute = isNightRoute || isDeskRoute;

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // hide when scrolling down past the hero, show when scrolling up
      if (y > lastY && y > 160) setHidden(true);
      else setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isDeskRoute) return null;

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? isDarkRoute
            ? "border-white/10 bg-[#050506]/92"
            : "border-hairline bg-paper/85"
          : isDarkRoute
            ? "border-white/10 bg-[#050506]/88"
            : "border-transparent bg-paper/60"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logomark className="h-8 w-8 text-[20px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6" />
          <span
            className={`font-serif text-2xl font-medium tracking-tight ${
              isDarkRoute ? "text-[#f7f0e8]" : "text-ink"
            }`}
          >
            Ryker
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <div
            className={`relative grid grid-cols-2 rounded-full border p-1 shadow-[0_10px_30px_-24px_rgba(28,25,22,0.35)] ${
              isDarkRoute
                ? "border-white/12 bg-white/[0.03]"
                : "border-hairline bg-paper/70"
            }`}
          >
            {hasActiveItem ? (
              <span
                aria-hidden
                className="absolute bottom-1 left-1 top-1 rounded-full bg-ink shadow-[0_8px_22px_-16px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: "calc(50% - 0.25rem)",
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
            ) : null}
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                className={`relative z-10 min-w-[3.65rem] rounded-full px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-label transition-colors duration-200 sm:px-3.5 sm:text-[11px] ${
                  active
                    ? "text-paper delay-100"
                    : isDarkRoute
                      ? "text-white/48 hover:text-white"
                      : "text-ink-soft hover:text-ink"
                }`}
              >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <OnlineCount tone={isDarkRoute ? "dark" : "light"} />
        </nav>
      </div>
    </header>
  );
}
