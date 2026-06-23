import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory presence map: visitorId -> last-seen timestamp (ms).
// Anyone whose heartbeat landed within the window counts as "online".
const WINDOW_MS = 30_000;
const seen = new Map<string, number>();

function countOnline() {
  const now = Date.now();
  Array.from(seen.entries()).forEach(([id, ts]) => {
    if (now - ts > WINDOW_MS) seen.delete(id);
  });
  return seen.size;
}

export async function POST(request: Request) {
  let id = "";
  try {
    const body = await request.json();
    id = typeof body?.id === "string" ? body.id : "";
  } catch {
    // ignore malformed body
  }
  if (id) seen.set(id, Date.now());
  return NextResponse.json({ online: countOnline() });
}

export async function GET() {
  return NextResponse.json({ online: countOnline() });
}
