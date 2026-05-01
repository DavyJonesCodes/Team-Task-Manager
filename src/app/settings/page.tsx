import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import {
  CheckCircle2,
  Clock3,
  Database,
  FolderKanban,
  KeyRound,
  ListTodo,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers, tasks } from "@/db/schema";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const memberships = await db.query.projectMembers.findMany({
    where: eq(projectMembers.userId, session.user.id),
    with: {
      project: true,
    },
  });

  const projectIds = memberships.map((membership) => membership.projectId);

  const userTasks =
    projectIds.length > 0
      ? await db.query.tasks.findMany({
          where: inArray(tasks.projectId, projectIds),
          with: {
            project: true,
            assignedTo: true,
          },
        })
      : [];

  const assignedTasks = userTasks.filter(
    (task) => task.assignedToId === session.user.id
  );

  const completedAssignedTasks = assignedTasks.filter(
    (task) => task.status === "done"
  );

  const adminProjects = memberships.filter(
    (membership) => membership.role === "admin"
  );

  const memberProjects = memberships.filter(
    (membership) => membership.role === "member"
  );

  const completionRate =
    assignedTasks.length === 0
      ? 0
      : Math.round((completedAssignedTasks.length / assignedTasks.length) * 100);

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Account control centre
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Settings
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Manage your profile, review your access, and check your personal
              project and task summary.
            </p>
          </div>

          <Badge className="w-fit rounded-full px-4 py-2">
            Better Auth account
          </Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <FolderKanban className="mb-4 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Projects</p>
            <p className="mt-2 text-3xl font-semibold">{memberships.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Projects you can access
            </p>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <ShieldCheck className="mb-4 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Admin role</p>
            <p className="mt-2 text-3xl font-semibold">{adminProjects.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Projects you manage
            </p>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <ListTodo className="mb-4 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Assigned tasks</p>
            <p className="mt-2 text-3xl font-semibold">{assignedTasks.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tasks assigned to you
            </p>
          </div>

          <div className="rounded-3xl border bg-zinc-950 p-6 text-white shadow-xl shadow-black/10">
            <CheckCircle2 className="mb-4 h-6 w-6" />
            <p className="text-sm text-zinc-400">Completion</p>
            <p className="mt-2 text-3xl font-semibold">{completionRate}%</p>
            <p className="mt-2 text-sm text-zinc-400">
              Assigned tasks completed
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Profile settings</h2>
                <p className="text-sm text-muted-foreground">
                  Update the name shown across the app.
                </p>
              </div>
            </div>

            <ProfileSettingsForm
              name={session.user.name}
              email={session.user.email}
            />
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                <KeyRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Access summary</h2>
                <p className="text-sm text-muted-foreground">
                  Your current project roles.
                </p>
              </div>
            </div>

            {memberships.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-white p-6 text-center">
                <p className="font-medium">No project access yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create or join a project to see access details here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {membership.project.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {membership.role === "admin"
                          ? "You can manage this project"
                          : "You can view and update assigned tasks"}
                      </p>
                    </div>

                    <Badge
                      variant={
                        membership.role === "admin" ? "default" : "outline"
                      }
                      className="rounded-full"
                    >
                      {membership.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border bg-zinc-950 p-6 text-white shadow-xl shadow-black/10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Database className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">System details</h2>
                <p className="text-sm text-zinc-400">
                  Useful for your assessment explanation.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-zinc-400">Authentication</p>
                <p className="mt-1 font-medium">Better Auth</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-zinc-400">Database</p>
                <p className="mt-1 font-medium">Neon PostgreSQL</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-zinc-400">ORM</p>
                <p className="mt-1 font-medium">Drizzle ORM</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Demo checklist</h2>
                <p className="text-sm text-muted-foreground">
                  Show these features in your 2–5 minute video.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "Sign up and log in",
                "Create and edit a project",
                "Add a member by email",
                "Create and assign a task",
                "Update task status",
                "Show dashboard stats changing",
                "Compare Admin and Member permissions",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border bg-white p-4"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-red-100 bg-red-50/70 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-red-700">Danger zone</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-red-700/80">
            Account deletion is not enabled in this demo version. Project and
            task deletion are available to project admins from each project
            page.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge
              variant="destructive"
              className="h-7 rounded-full px-3 text-xs font-medium leading-none"
            >
              Protected account
            </Badge>
            <Badge
              variant="outline"
              className="h-7 rounded-full border-red-200 px-3 text-xs font-medium leading-none text-red-700"
            >
              Admins can delete projects
            </Badge>
          </div>
        </section>
      </div>
    </ProtectedLayout>
  );
}
