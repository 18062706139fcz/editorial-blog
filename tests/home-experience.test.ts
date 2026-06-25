import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("home hero uses a compact tablet layout instead of centered full-screen spacing", () => {
  const page = source("../app/page.tsx");

  assert.equal(page.includes("sm:min-h-screen"), false);
  assert.equal(page.includes("justify-center py-12"), false);
  assert.match(page, /lg:min-h-\[calc\(100svh-4rem\)\]/);
  assert.match(page, /justify-start/);
  assert.match(page, /lg:grid-cols-\[/);
});

test("home quote and social links are not nested inside the hero section", () => {
  const page = source("../app/page.tsx");
  const heroStart = page.indexOf("{/* ── Hero");
  const afterglowStart = page.indexOf("{/* ── Home afterglow");
  const hero = page.slice(heroStart, afterglowStart);

  assert.equal(hero.includes("<RandomQuote />"), false);
  assert.equal(hero.includes("<SocialLinks />"), false);
  assert.match(page, /Home afterglow/);
});

test("weather status uses a custom permission entry before browser geolocation", () => {
  const statusBar = source("../components/StatusBar.tsx");

  assert.match(statusBar, /permission/);
  assert.match(statusBar, /onRequestLocation/);
  assert.match(statusBar, /aria-label="开启位置天气"/);
  assert.match(statusBar, /开启天气/);
});
