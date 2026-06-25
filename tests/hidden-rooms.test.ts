import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const hiddenRoutes = ["lost", "night", "desk"] as const;

function source(path: string) {
  const url = new URL(path, import.meta.url);
  assert.equal(existsSync(url), true, `${path} should exist`);
  return readFileSync(url, "utf8");
}

test("hidden room routes exist and opt out of indexing", () => {
  for (const route of hiddenRoutes) {
    const page = source(`../app/${route}/page.tsx`);

    assert.match(page, /getHiddenRoom/);
    assert.match(page, /robots/);
    assert.match(page, /index:\s*false/);
    assert.match(page, /follow:\s*false/);
  }
});

test("lost remains a quiet hidden room while night and desk use dedicated experiences", () => {
  assert.match(source("../app/lost/page.tsx"), /HiddenRoom/);
  assert.match(source("../app/night/page.tsx"), /NightRadio/);
  assert.match(source("../app/desk/page.tsx"), /DeskRoom/);

  assert.equal(
    source("../app/night/page.tsx").includes('from "@/components/HiddenRoom"'),
    false,
  );
  assert.equal(
    source("../app/desk/page.tsx").includes('from "@/components/HiddenRoom"'),
    false,
  );
});

test("hidden rooms are not exposed through visible navigation surfaces", () => {
  const nav = source("../components/Nav.tsx");
  const footer = source("../components/Footer.tsx");

  for (const route of hiddenRoutes) {
    assert.equal(nav.includes(`href="/${route}"`), false);
    assert.equal(footer.includes(`href="/${route}"`), false);
  }
});

test("visible nav does not default unknown hidden routes to the articles tab", () => {
  const nav = source("../components/Nav.tsx");

  assert.equal(nav.includes("activeIndex < 0 ? 0 : activeIndex"), false);
  assert.match(nav, /activeIndex\s*>=\s*0/);
});

test("hidden room content is centralized in shared configuration", () => {
  const config = source("../lib/hidden-rooms.ts");

  for (const route of hiddenRoutes) {
    assert.match(config, new RegExp(`slug:\\s*"${route}"`));
  }

  assert.match(config, /export function getHiddenRoom/);
  assert.match(config, /objects/);
  assert.match(config, /actions/);
});

test("night radio uses a full-bleed dark stage with Chen Li tracks", () => {
  const nightRadio = source("../components/NightRadio.tsx");
  const config = source("../lib/hidden-rooms.ts");

  assert.match(nightRadio, /w-screen/);
  assert.match(nightRadio, /-translate-x-1\/2/);
  assert.match(nightRadio, /奇妙能力歌/);
  assert.match(nightRadio, /正趣果上果/);
  assert.match(nightRadio, /种种/);
  assert.match(nightRadio, /artist:\s*"陈粒"/);
  assert.match(nightRadio, /当前曲目：/);
  assert.match(config, /今晚只开一盏小灯/);
  assert.match(config, /放三首陈粒/);
  assert.equal(nightRadio.includes("世界正中"), false);
  assert.equal(config.includes("不是 dark mode"), false);
});

test("night radio uses real Chen Li music embeds instead of synthetic noise", () => {
  const nightRadio = source("../components/NightRadio.tsx");

  assert.match(nightRadio, /\/api\/music\/netease-url/);
  assert.match(nightRadio, /29357047/);
  assert.match(nightRadio, /30431370/);
  assert.match(nightRadio, /2749429518/);
  assert.match(nightRadio, /<audio/);
  assert.equal(nightRadio.includes("1465290031"), false);
  assert.equal(nightRadio.includes("AudioContext"), false);
  assert.equal(nightRadio.includes("createOscillator"), false);
  assert.equal(nightRadio.includes("frequencies"), false);
});

test("night radio record and play control have motion-oriented styling", () => {
  const nightRadio = source("../components/NightRadio.tsx");

  assert.match(nightRadio, /recordNeedle/);
  assert.match(nightRadio, /recordGlow/);
  assert.match(nightRadio, /coverUrl/);
  assert.match(nightRadio, /data-turntable/);
  assert.match(nightRadio, /data-tonearm/);
  assert.match(nightRadio, /data-lyric-panel/);
  assert.match(nightRadio, /captionCopy/);
  assert.match(nightRadio, /max-w-\[31rem\]/);
  assert.match(nightRadio, /motion-safe:animate-\[spin_11s_linear_infinite\]/);
  assert.match(nightRadio, /motion-safe:animate-\[record-sheen/);
  assert.match(nightRadio, /motion-safe:animate-\[equalizer/);
  assert.equal(nightRadio.includes("lg:-mr-24"), false);
  assert.equal(nightRadio.includes("absolute left-1/2 top-1/2 h-3 w-3"), false);
  assert.equal(nightRadio.includes("rounded-full bg-[#dd3f35] px-5"), false);
  assert.equal(nightRadio.includes("min-w-28"), false);
  assert.match(nightRadio, /aria-label=\{playing \? "暂停夜间音乐台" : "播放夜间音乐台"\}/);
});

test("night radio progress is driven by the real audio element", () => {
  const nightRadio = source("../components/NightRadio.tsx");

  assert.equal(nightRadio.includes("setInterval"), false);
  assert.match(nightRadio, /onTimeUpdate/);
  assert.match(nightRadio, /currentTime/);
  assert.match(nightRadio, /duration/);
  assert.match(nightRadio, /audioRef\.current\.play/);
});

test("netease music url API only proxies the approved Chen Li tracks", () => {
  const route = source("../app/api/music/netease-url/route.ts");

  assert.match(route, /29357047/);
  assert.match(route, /30431370/);
  assert.match(route, /2749429518/);
  assert.match(route, /allowedTracks/);
  assert.match(route, /music\.163\.com\/api\/song\/enhance\/player\/url/);
  assert.match(route, /replace\(\s*\/\^http:\/,\s*"https:"\s*\)/);
});

test("night route opts the global chrome into a dark surface", () => {
  const layout = source("../app/layout.tsx");
  const nav = source("../components/Nav.tsx");
  const routeTheme = source("../components/RouteTheme.tsx");
  const globals = source("../app/globals.css");

  assert.match(layout, /RouteTheme/);
  assert.match(nav, /isNightRoute/);
  assert.match(nav, /bg-\[#050506/);
  assert.match(routeTheme, /data-route-theme/);
  assert.match(routeTheme, /pathname\s*===\s*"\/night"/);
  assert.match(globals, /data-route-theme="night"/);
});
