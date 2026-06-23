"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logomark from "@/components/Logomark";
import OnlineCount from "@/components/OnlineCount";

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "border-hairline bg-paper/85"
          : "border-transparent bg-paper/60"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logomark className="h-8 w-8 text-[20px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6" />
          <span className="font-serif text-2xl font-medium tracking-tight text-ink">
            Ryker
          </span>
        </Link>
        <nav className="flex items-center gap-7">
          <OnlineCount />
        </nav>
      </div>
    </header>
  );
}
