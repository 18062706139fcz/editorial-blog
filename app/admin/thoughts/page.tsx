import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminThoughtList from "@/components/features/admin/AdminThoughtList";
import LogoutButton from "@/components/features/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminThoughtsPage() {
  if (!isAuthenticated()) redirect("/admin/login");

  const thoughts = await prisma.thought.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-10 sm:py-16">
      <div className="mb-9 flex flex-col gap-5 border-b border-hairline pb-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-label text-ink-soft">
            后台
          </p>
          <h1 className="font-serif text-[2rem] text-ink sm:text-4xl">
            短札
          </h1>
          <nav className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-label sm:text-[11px]">
            <Link href="/admin" className="text-ink-soft hover:text-ink">
              文章
            </Link>
            <span className="text-ink">短札</span>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href="/admin/thoughts/new"
            className="border border-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper sm:px-5 sm:text-[11px]"
          >
            新短札
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AdminThoughtList thoughts={thoughts} />
    </div>
  );
}
