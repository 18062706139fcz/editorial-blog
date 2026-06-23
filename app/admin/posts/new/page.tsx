import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import PostEditor from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  if (!isAuthenticated()) redirect("/admin/login");

  return (
    <div className="py-10 sm:py-16">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-label text-ink-soft">
        Editor
      </p>
      <h1 className="mb-9 font-serif text-[2rem] text-ink sm:mb-12 sm:text-4xl">
        New post
      </h1>
      <PostEditor />
    </div>
  );
}
