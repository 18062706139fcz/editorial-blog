import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import PostEditor from "@/components/features/posts/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAuthenticated()) redirect("/admin/login");

  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
  });
  if (!post) notFound();

  return (
    <div className="py-10 sm:py-16">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-label text-ink-soft">
        后台
      </p>
      <h1 className="mb-9 font-serif text-[2rem] text-ink sm:mb-12 sm:text-4xl">
        编辑文章
      </h1>
      <PostEditor post={post} />
    </div>
  );
}
