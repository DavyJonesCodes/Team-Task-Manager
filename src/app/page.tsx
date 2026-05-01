import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: UsersRound,
    title: "Team management",
    description: "Add members and keep project roles clear.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Admins manage projects, Members update assigned tasks.",
  },
  {
    icon: LayoutDashboard,
    title: "Progress dashboard",
    description: "Track totals, status, and overdue tasks instantly.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f0]">
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
      <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-zinc-200/70 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-stone-300/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Team Task Manager
          </Link>

          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-full shadow-lg shadow-black/10">
              <Link href="/signup">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Full-stack task manager for teams
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
                Manage projects, tasks, and team progress beautifully.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                Create projects, assign work, track status, and keep Admin and Member permissions clear from one responsive dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
                <Link href="/signup">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/70 backdrop-blur transition hover:-translate-y-0.5">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-white/80 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border bg-zinc-950 p-4 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Dashboard</p>
                  <h2 className="text-xl font-semibold">Project overview</h2>
                </div>
                <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                  Live
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Projects", "8"],
                  ["Tasks", "42"],
                  ["Overdue", "3"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-zinc-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {[
                  ["Design new dashboard", "In progress"],
                  ["Invite team members", "Todo"],
                  ["Review overdue tasks", "Urgent"],
                ].map(([task, status]) => (
                  <div key={task} className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-medium">{task}</p>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-10 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon className="mb-5 h-6 w-6" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
