"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="font-mono text-[11px] uppercase tracking-label text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
    >
      Sign out
    </button>
  );
}
