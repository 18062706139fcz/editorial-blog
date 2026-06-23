"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
      <div>
        <label
          htmlFor="password"
          className="mb-3 block font-mono text-[10px] uppercase tracking-label text-ink-soft"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-0 border-b border-hairline bg-transparent pb-2 font-serif text-base text-ink focus:border-ink focus:outline-none sm:text-lg"
          autoFocus
        />
      </div>
      {error && (
        <p className="font-mono text-[11px] uppercase tracking-label text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full border border-ink px-6 py-3 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 sm:text-[11px]"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
