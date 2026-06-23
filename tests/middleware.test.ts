import assert from "node:assert/strict";
import test from "node:test";
import { middleware } from "../middleware";

test("admin routes remain available in production and are marked noindex", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  try {
    const response = middleware();

    assert.notEqual(response.status, 404);
    assert.equal(
      response.headers.get("X-Robots-Tag"),
      "noindex, nofollow, noarchive",
    );
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
  }
});
