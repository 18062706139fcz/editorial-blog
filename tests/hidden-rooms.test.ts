import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const hiddenRoutes = ["lost", "night", "desk"] as const;

function source(path: string) {
  const url = new URL(path, import.meta.url);
  assert.equal(existsSync(url), true, `${path} should exist`);
  const text = readFileSync(url, "utf8");
  if (path.endsWith(".css")) {
    return text.replace(/@import\s+"([^"]+)";?/g, (_, rel) => {
      const importedUrl = new URL(rel, url);
      return existsSync(importedUrl) ? readFileSync(importedUrl, "utf8") : "";
    });
  }
  if (path.endsWith(".tsx") || path.endsWith(".ts")) {
    return text.replace(/from\s+"(\.\/[^"]+)"/g, (match, rel) => {
      for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
        const candidate = new URL(rel + ext, url);
        if (existsSync(candidate)) {
          return `${match}\n/* inlined */ ${readFileSync(candidate, "utf8")}`;
        }
      }
      return match;
    });
  }
  return text;
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
    source("../app/night/page.tsx").includes('from "@/components/features/hidden/HiddenRoom"'),
    false,
  );
  assert.equal(
    source("../app/desk/page.tsx").includes('from "@/components/features/hidden/HiddenRoom"'),
    false,
  );
});

test("desk route renders the A2UI shell instead of the old object surface", () => {
  const deskRoom = source("../components/features/desk/DeskRoom.tsx");

  assert.match(deskRoom, /DeskShell/);
  assert.equal(deskRoom.includes("deskObjects"), false);
  assert.equal(deskRoom.includes("work surface"), false);
});

test("desk route uses one terminal transcript instead of dashboard cards", () => {
  const deskShell = source("../components/features/desk/DeskShell.tsx");
  const transcript = source("../components/features/desk/TerminalTranscript.tsx");
  const composer = source("../components/features/desk/DeskComposer.tsx");
  const prompt = source("../lib/features/desk/prompt.ts");
  const nav = source("../components/layout/Nav.tsx");
  const footer = source("../components/layout/Footer.tsx");
  const readingProgress = source("../components/layout/ReadingProgress.tsx");

  assert.match(deskShell, /TerminalTranscript/);
  assert.match(deskShell, /min-h-screen/);
  assert.match(deskShell, /deepseek\.call/);
  assert.match(deskShell, /a2ui\.protocol/);
  assert.match(deskShell, /A2UI schema received/);
  assert.match(deskShell, /\/api\/desk\/agent/);
  assert.match(deskShell, /data-desk-zone="intro"/);
  assert.match(deskShell, /min-h-0/);
  assert.match(transcript, /Claude Code-style terminal/);
  assert.match(transcript, /data-desk-zone="terminal-output"/);
  assert.match(transcript, /const seedBlocks = blocks\.filter\(isSeedBlock\)/);
  assert.match(transcript, /const liveBlocks = blocks\.filter\(\(block\) => !isSeedBlock\(block\)\)/);
  assert.match(transcript, /data-desk-transcript-section="seed"/);
  assert.match(transcript, /data-desk-transcript-section="live"/);
  assert.match(transcript, /SYSTEM SEED/);
  assert.match(transcript, /USER SESSION/);
  assert.match(transcript, /border-y-2/);
  assert.match(transcript, /scrollIntoView/);
  assert.match(transcript, /blocks\.length,\s*loading/);
  assert.match(nav, /if\s*\(isDeskRoute\)\s*return null/);
  assert.match(footer, /if\s*\(isDeskRoute\)\s*return null/);
  assert.match(readingProgress, /if\s*\(isDeskRoute\)\s*return null/);
  assert.equal(deskShell.includes("a2ui.inspector"), false);
  assert.equal(deskShell.includes("<aside"), false);
  assert.equal(deskShell.includes("lg:grid-cols"), false);
  assert.equal(transcript.includes("rounded-[6px] border p-4"), false);
  assert.equal(composer.includes("rounded-[8px] border"), false);
  assert.match(composer, /onKeyDown/);
  assert.match(composer, /event\.key === "Enter"/);
  assert.match(composer, /event\.shiftKey/);
  assert.match(composer, /event\.ctrlKey/);
  assert.match(composer, /event\.key === "ArrowUp"/);
  assert.match(composer, /event\.key === "ArrowDown"/);
  assert.match(composer, /textareaRef\.current\?\.focus/);
  assert.match(composer, /data-desk-zone="terminal-input"/);
  assert.match(composer, /border-t-2/);
  assert.match(composer, /rows=\{4\}/);
  assert.match(composer, /min-h-\[8rem\]/);
  assert.match(composer, /max-h-\[16rem\]/);
  assert.equal(composer.includes("<button"), false);
  assert.equal(composer.includes('data-desk-zone="shortcuts"'), false);
  assert.match(prompt, /agent-to-user interface/);
  assert.match(prompt, /surfaceUpdate/);
  assert.match(prompt, /A2UI schema/);

  assert.match(deskShell, /useRouter/);
  assert.match(deskShell, /router\.push\(command\.href\)/);
  assert.match(deskShell, /command\?\.kind === "navigate"/);
});

test("desk lab is a hidden static A2UI component room", () => {
  const lab = source("../app/desk/lab/page.tsx");

  assert.match(lab, /robots/);
  assert.match(lab, /index:\s*false/);
  assert.match(lab, /follow:\s*false/);
  assert.match(lab, /A2UIRenderer/);
  assert.match(lab, /sampleDeskA2UI/);
  assert.match(lab, /A2UI protocol lab/);
  assert.match(lab, /surfaceUpdate/);
  assert.match(lab, /dataModelUpdate/);
  assert.match(lab, /beginRendering/);
  assert.match(lab, /userAction/);
  assert.match(lab, /action completeness/);
  assert.match(lab, /no_ui_chat/);
});

test("hidden rooms are not exposed through visible navigation surfaces", () => {
  const nav = source("../components/layout/Nav.tsx");
  const footer = source("../components/layout/Footer.tsx");

  for (const route of hiddenRoutes) {
    assert.equal(nav.includes(`href="/${route}"`), false);
    assert.equal(footer.includes(`href="/${route}"`), false);
  }

  assert.equal(nav.includes('href="/desk/lab"'), false);
  assert.equal(footer.includes('href="/desk/lab"'), false);
});

test("visible nav does not default unknown hidden routes to the articles tab", () => {
  const nav = source("../components/layout/Nav.tsx");

  assert.equal(nav.includes("activeIndex < 0 ? 0 : activeIndex"), false);
  assert.match(nav, /activeIndex\s*>=\s*0/);
});

test("hidden room content is centralized in shared configuration", () => {
  const config = source("../lib/features/hidden-rooms.ts");

  for (const route of hiddenRoutes) {
    assert.match(config, new RegExp(`slug:\\s*"${route}"`));
  }

  assert.match(config, /export function getHiddenRoom/);
  assert.match(config, /objects/);
  assert.match(config, /actions/);
});

test("night radio uses a full-bleed dark stage with Chen Li tracks", () => {
  const nightRadio = source("../components/features/night/NightRadio.tsx");
  const config = source("../lib/features/hidden-rooms.ts");

  assert.match(nightRadio, /w-screen/);
  assert.match(nightRadio, /-translate-x-1\/2/);
  assert.match(nightRadio, /奇妙能力歌/);
  assert.match(nightRadio, /正趣果上果/);
  assert.match(nightRadio, /种种/);
  assert.match(nightRadio, /artist:\s*"陈粒"/);
  assert.match(nightRadio, /当前曲目：/);
  assert.match(config, /夜里只开一盏小灯/);
  assert.match(config, /沙、月亮和火光/);
  assert.equal(nightRadio.includes("世界正中"), false);
  assert.equal(config.includes("不是 dark mode"), false);
});

test("night radio uses real Chen Li music embeds instead of synthetic noise", () => {
  const nightRadio = source("../components/features/night/NightRadio.tsx");

  assert.match(nightRadio, /\/api\/music\/netease-url/);
  assert.match(nightRadio, /\/api\/music\/netease-lyric/);
  assert.match(nightRadio, /\/api\/music\/netease-comments/);
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
  const nightRadio = source("../components/features/night/NightRadio.tsx");

  assert.match(nightRadio, /recordNeedle/);
  assert.match(nightRadio, /recordGlow/);
  assert.match(nightRadio, /coverUrl/);
  assert.match(nightRadio, /data-turntable/);
  assert.match(nightRadio, /data-tonearm/);
  assert.match(nightRadio, /data-lyric-panel/);
  assert.match(nightRadio, /data-lyric-idle/);
  assert.match(nightRadio, /currentLyric/);
  assert.match(nightRadio, /getLyricLineProgress/);
  assert.match(nightRadio, /lyricLineProgress/);
  assert.match(nightRadio, /requestAnimationFrame/);
  assert.match(nightRadio, /TimedLyricLine/);
  assert.match(nightRadio, /karaoke-line/);
  assert.match(nightRadio, /lineProgress/);
  assert.match(nightRadio, /lyric-line-progress/);
  assert.match(nightRadio, /karaoke-line__active/);
  assert.match(nightRadio, /clipPath/);
  assert.match(nightRadio, /lyric-word/);
  assert.match(nightRadio, /lyric-rail/);
  assert.match(nightRadio, /lyric-row/);
  assert.match(nightRadio, /lyric-viewport mt-3 h-\[12rem\] overflow-hidden/);
  assert.match(nightRadio, /lyric-token/);
  assert.match(nightRadio, /specialLyricTerms/);
  assert.match(nightRadio, /长生殿/);
  assert.match(nightRadio, /lyric-token--literary/);
  assert.match(nightRadio, /max-w-\[31rem\]/);
  assert.match(nightRadio, /motion-safe:animate-\[spin_18s_linear_infinite\]/);
  assert.match(nightRadio, /animationPlayState/);
  assert.match(nightRadio, /motion-safe:animate-\[record-sheen/);
  assert.match(nightRadio, /热门评论/);
  assert.match(nightRadio, /data-lights-out/);
  assert.equal(nightRadio.includes("lg:-mr-24"), false);
  assert.equal(nightRadio.includes("absolute left-1/2 top-1/2 h-3 w-3"), false);
  assert.equal(nightRadio.includes("rounded-full bg-[#dd3f35] px-5"), false);
  assert.equal(nightRadio.includes("signal-dot"), false);
  assert.equal(nightRadio.includes("lrc sync"), false);
  assert.equal(nightRadio.includes("border border-white/8 bg-white/[0.025]"), false);
  assert.equal(nightRadio.includes("按下播放，歌词会跟着时间浮上来。"), false);
  assert.equal(nightRadio.includes("遇见很多奇迹"), false);
  assert.equal(nightRadio.includes("min-w-28"), false);
  assert.equal(nightRadio.includes("currentLyricProgress"), false);
  assert.equal(nightRadio.includes("karaoke-line__fill"), false);
  assert.equal(nightRadio.includes("time + 0.2"), false);
  assert.match(nightRadio, /aria-label=\{playing \? "暂停夜间音乐台" : "播放夜间音乐台"\}/);
});

test("night radio progress is driven by the real audio element", () => {
  const nightRadio = source("../components/features/night/NightRadio.tsx");

  assert.equal(nightRadio.includes("setInterval"), false);
  assert.match(nightRadio, /onTimeUpdate/);
  assert.match(nightRadio, /requestAnimationFrame/);
  assert.match(nightRadio, /cancelAnimationFrame/);
  assert.match(nightRadio, /currentTime/);
  assert.match(nightRadio, /duration/);
  assert.match(nightRadio, /type="range"/);
  assert.match(nightRadio, /aria-label="拖动播放进度"/);
  assert.match(nightRadio, /audioRef\.current\.play/);
});

test("night radio uses quieter palette variables and no decorative signal panel", () => {
  const nightRadio = source("../components/features/night/NightRadio.tsx");
  const globals = source("../app/styles/night-radio.css");
  const keyframes = source("../app/styles/keyframes.css");

  assert.match(nightRadio, /--night-accent/);
  assert.match(nightRadio, /accentSoft/);
  assert.match(globals, /var\(--night-accent\)/);
  assert.match(globals, /night-range:focus/);
  assert.match(globals, /lyric-line-progress/);
  assert.match(globals, /karaoke-line--line-progress/);
  assert.match(globals, /karaoke-line__active/);
  assert.match(globals, /will-change:\s*clip-path/);
  assert.match(globals, /lyric-rail/);
  assert.match(globals, /--lyric-row-height:\s*4rem/);
  assert.match(globals, /height:\s*calc\(var\(--lyric-row-height\) \* 3\)/);
  assert.match(globals, /white-space:\s*normal/);
  assert.match(globals, /lyric-token/);
  assert.match(globals, /lyric-token--literary/);
  assert.match(globals, /lyric-word/);
  assert.match(globals, /is-active/);
  assert.match(globals, /hot-comment-text/);
  assert.match(keyframes, /lights-out/);
  assert.match(globals, /karaoke-line/);
  assert.equal(nightRadio.includes("#dd3f35"), false);
  assert.equal(globals.includes("#dd3f35"), false);
  assert.equal(nightRadio.includes("signal"), false);
  assert.equal(globals.includes("karaoke-line__fill"), false);
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

test("netease lyric API parses timed lyrics for the approved Chen Li tracks", () => {
  const route = source("../app/api/music/netease-lyric/route.ts");

  assert.match(route, /29357047/);
  assert.match(route, /30431370/);
  assert.match(route, /2749429518/);
  assert.match(route, /allowedTracks/);
  assert.match(route, /music\.163\.com\/api\/song\/lyric\/v1/);
  assert.match(route, /parseLrc/);
  assert.match(route, /parseYrc/);
  assert.match(route, /yrc/);
  assert.match(route, /words/);
  assert.match(route, /source/);
  assert.match(route, /creditPattern/);
});

test("netease comments API returns hot comments for approved Chen Li tracks", () => {
  const route = source("../app/api/music/netease-comments/route.ts");

  assert.match(route, /29357047/);
  assert.match(route, /30431370/);
  assert.match(route, /2749429518/);
  assert.match(route, /allowedTracks/);
  assert.match(route, /music\.163\.com\/api\/v1\/resource\/comments/);
  assert.match(route, /hotComments/);
  assert.match(route, /normalizeComment/);
});

test("night route opts the global chrome into a dark surface", () => {
  const layout = source("../app/layout.tsx");
  const nav = source("../components/layout/Nav.tsx");
  const routeTheme = source("../components/layout/RouteTheme.tsx");
  const globals = source("../app/globals.css");

  assert.match(layout, /RouteTheme/);
  assert.match(nav, /isNightRoute/);
  assert.match(nav, /bg-\[#050506/);
  assert.match(routeTheme, /data-route-theme/);
  assert.match(routeTheme, /pathname\s*===\s*"\/night"/);
  assert.match(globals, /data-route-theme="night"/);
});

test("desk routes opt the global chrome into a contained dark shell", () => {
  const nav = source("../components/layout/Nav.tsx");
  const routeTheme = source("../components/layout/RouteTheme.tsx");
  const deskShell = source("../components/features/desk/DeskShell.tsx");

  assert.match(routeTheme, /pathname\.startsWith\("\/desk\/"\)/);
  assert.match(routeTheme, /"desk"/);
  assert.match(nav, /isDeskRoute/);
  assert.equal(deskShell.includes("DEEPSEEK_API_KEY"), false);
});

test("desk agent API keeps DeepSeek access on the server", () => {
  const route = source("../app/api/desk/agent/route.ts");
  const deskShell = source("../components/features/desk/DeskShell.tsx");

  assert.match(route, /process\.env\.DEEPSEEK_API_KEY/);
  assert.match(route, /process\.env\.DEEPSEEK_MODEL/);
  assert.match(route, /https:\/\/api\.deepseek\.com\/chat\/completions/);
  assert.match(route, /buildDeskMessages/);
  assert.match(route, /parseDeskAgentResponse/);
  assert.match(route, /normalizeDeskInput/);
  assert.match(route, /NextResponse\.json/);
  assert.equal(deskShell.includes("api.deepseek.com"), false);
  assert.equal(deskShell.includes("DEEPSEEK_API_KEY"), false);
});
