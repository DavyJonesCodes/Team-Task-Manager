import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers, tasks } from "@/db/schema";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { PriorityBadge } from "@/components/tasks/priority-badge";

export default async function DashboardPage() {
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
    orderBy: desc(projectMembers.createdAt),
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
          orderBy: desc(tasks.createdAt),
        })
      : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalProjects = memberships.length;
  const totalTasks = userTasks.length;
  const inProgressTasks = userTasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const completedTasks = userTasks.filter((task) => task.status === "done").length;
  const overdueTasks = userTasks.filter((task) => {
    if (!task.dueDate || task.status === "done") return false;
    return new Date(task.dueDate) < today;
  }).length;

  const recentTasks = userTasks.slice(0, 5);

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Track projects, assigned tasks, status changes, and overdue work.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/10">
            Welcome, {session.user.name}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Projects"
            value={String(totalProjects)}
            description="Projects you belong to"
            icon={FolderKanban}
          />
          <StatCard
            title="Total tasks"
            value={String(totalTasks)}
            description="Across your projects"
            icon={ListTodo}
          />
          <StatCard
            title="In progress"
            value={String(inProgressTasks)}
            description="Tasks being worked on"
            icon={Clock3}
          />
          <StatCard
            title="Completed"
            value={String(completedTasks)}
            description="Finished tasks"
            icon={CheckCircle2}
          />
          <StatCard
            title="Overdue"
            value={String(overdueTasks)}
            description="Past due date"
            icon={AlertTriangle}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Recent tasks</h2>
              <p className="text-sm text-muted-foreground">
                Latest tasks from your projects.
              </p>
            </div>

            {recentTasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed bg-white p-8 text-center">
                <h3 className="font-semibold">No tasks yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create a project and add tasks to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-3 rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.project.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <TaskStatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border bg-zinc-950 p-6 text-white shadow-xl shadow-black/10">
            <h2 className="text-lg font-semibold">Progress summary</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Your dashboard now uses real project and task data from Neon.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-zinc-400">Completion rate</p>
                <p className="mt-1 text-2xl font-semibold">
                  {totalTasks === 0
                    ? "0%"
                    : `${Math.round((completedTasks / totalTasks) * 100)}%`}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-zinc-400">Overdue tasks</p>
                <p className="mt-1 text-2xl font-semibold">{overdueTasks}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedLayout>
  );
}
