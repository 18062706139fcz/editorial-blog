import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  // Keep authoring routes in the same app, but make them invisible to crawlers.
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/posts",
    "/api/posts/:path*",
    "/api/auth/:path*",
  ],
};
