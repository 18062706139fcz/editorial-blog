import assert from "node:assert/strict";
import test from "node:test";
import {
  routeTransitionKey,
  shouldStartRouteTransition,
} from "../lib/route-transition";

test("routeTransitionKey ignores query-only changes", () => {
  assert.equal(routeTransitionKey("/thinking", "mode=note"), "/thinking");
});

test("shouldStartRouteTransition skips same-page query filter changes", () => {
  assert.equal(
    shouldStartRouteTransition({
      href: "/thinking?mode=note",
      currentPathname: "/thinking",
      currentSearch: "",
    }),
    false,
  );
});

test("shouldStartRouteTransition runs for real route changes", () => {
  assert.equal(
    shouldStartRouteTransition({
      href: "/posts/the-antidote-is-soul",
      currentPathname: "/thinking",
      currentSearch: "mode=note",
    }),
    true,
  );
});

test("shouldStartRouteTransition skips inert or external links", () => {
  assert.equal(
    shouldStartRouteTransition({
      href: "#articles",
      currentPathname: "/",
      currentSearch: "",
    }),
    false,
  );
  assert.equal(
    shouldStartRouteTransition({
      href: "https://example.com",
      currentPathname: "/",
      currentSearch: "",
    }),
    false,
  );
});
