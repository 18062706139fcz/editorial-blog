import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminPostList from "@/components/AdminPostList";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isAuthenticated()) redirect("/admin/login");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-10 sm:py-16">
      <div className="mb-9 flex flex-col gap-5 border-b border-hairline pb-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-label text-ink-soft">
            Editor
          </p>
          <h1 className="font-serif text-[2rem] text-ink sm:text-4xl">
            All posts
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href="/admin/posts/new"
            className="border border-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper sm:px-5 sm:text-[11px]"
          >
            New post
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AdminPostList posts={posts} />
    </div>
  );
}
