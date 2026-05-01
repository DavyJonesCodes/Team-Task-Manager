import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f0]">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
      <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-zinc-200/70 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-stone-300/60 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_460px]">
        <section className="hidden space-y-8 lg:block">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Team Task Manager
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-zinc-950">
              Organise your team’s projects without the chaos.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600">
              Create projects, assign tasks, manage roles, and track progress from one clean dashboard.
            </p>
          </div>

          <div className="grid max-w-xl gap-3">
            {[
              "Role-based access for Admins and Members",
              "Task assignment with status and priority tracking",
              "Dashboard for progress, recent work, and overdue tasks",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <SignupForm />
        </section>
      </div>
    </main>
  );
}
