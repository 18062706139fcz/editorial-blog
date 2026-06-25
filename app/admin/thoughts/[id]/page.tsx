import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import ThoughtEditor from "@/components/ThoughtEditor";

export const dynamic = "force-dynamic";

export default async function EditThoughtPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAuthenticated()) redirect("/admin/login");

  const thought = await prisma.thought.findUnique({
    where: { id: Number(params.id) },
  });
  if (!thought) notFound();

  return (
    <div className="py-10 sm:py-16">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-label text-ink-soft">
        后台
      </p>
      <h1 className="mb-9 font-serif text-[2rem] text-ink sm:mb-12 sm:text-4xl">
        编辑短札
      </h1>
      <ThoughtEditor thought={thought} />
    </div>
  );
}
