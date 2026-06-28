"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  routeTransitionKey,
  shouldStartRouteTransition,
} from "@/lib/utils/route-transition";

export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationKey = routeTransitionKey(pathname, searchParams.toString());
  const [loading, setLoading] = useState(false);
  const prevKey = useRef(locationKey);

  // Show the bouncing-ball loader when an internal navigation starts.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        anchor.target === "_blank" ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        e.metaKey ||
        e.ctrlKey
      )
        return;
      if (
        !shouldStartRouteTransition({
          href,
          currentPathname: pathname,
          currentSearch: searchParams.toString(),
        })
      ) {
        return;
      }
      setLoading(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, searchParams]);

  // When the location actually changes, the new page has rendered → hide loader.
  useEffect(() => {
    if (prevKey.current !== locationKey) {
      prevKey.current = locationKey;
      const t = setTimeout(() => setLoading(false), 280);
      return () => clearTimeout(t);
    }
  }, [locationKey]);

  return (
    <>
      {/* Page content — replays the enter animation only on pathname changes. */}
      <div key={locationKey} className="animate-enter">
        {children}
      </div>

      {/* Bouncing-ball transition overlay */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-paper/80 backdrop-blur-sm transition-opacity duration-300 ${
          loading ? "animate-overlay-in opacity-100" : "opacity-0"
        }`}
        style={{ visibility: loading ? "visible" : "hidden" }}
      >
        <div className="flex flex-col items-center">
          <div className="flex h-10 items-end justify-center">
            <span className="block h-5 w-5 animate-ball-bounce rounded-full bg-ink shadow-[0_0_0_3px_rgba(200,80,30,0.18)]" />
          </div>
          <span className="mt-1 block h-1 w-6 animate-ball-shadow rounded-full bg-ink/30 blur-[1px]" />
        </div>
      </div>
    </>
  );
}
