import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (isAuthenticated()) redirect("/admin");

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12 sm:py-20">
      <div className="w-full max-w-sm">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-label text-ink-soft">
          Editor access
        </p>
        <h1 className="mb-8 font-serif text-[2rem] text-ink sm:mb-10 sm:text-4xl">
          Sign in
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
