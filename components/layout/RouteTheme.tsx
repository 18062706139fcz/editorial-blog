"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const isNightRoute = pathname === "/night";
    const isDeskRoute = pathname === "/desk" || pathname.startsWith("/desk/");
    const theme = isNightRoute ? "night" : isDeskRoute ? "desk" : "default";
    document.documentElement.setAttribute("data-route-theme", theme);
    document.body.setAttribute("data-route-theme", theme);

    return () => {
      document.documentElement.removeAttribute("data-route-theme");
      document.body.removeAttribute("data-route-theme");
    };
  }, [pathname]);

  return null;
}
