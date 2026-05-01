import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { FolderKanban, ListTodo } from "lucide-react";

import { ui } from "@/lib/styles";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers, tasks } from "@/db/schema";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function TasksPage() {
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

  const allTasks =
    projectIds.length > 0
      ? await db.query.tasks.findMany({
          where: inArray(tasks.projectId, projectIds),
          with: {
            project: true,
            assignedTo: true,
            createdBy: true,
          },
          orderBy: desc(tasks.createdAt),
        })
      : [];

  const adminProjectIds = new Set(
    memberships
      .filter((membership) => membership.role === "admin")
      .map((membership) => membership.projectId)
  );

  const todoCount = allTasks.filter((task) => task.status === "todo").length;
  const inProgressCount = allTasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const doneCount = allTasks.filter((task) => task.status === "done").length;

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Task centre
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Tasks
            </h1>
            <p className="mt-2 text-muted-foreground">
              View and update tasks across all projects you belong to.
            </p>
          </div>

          <Button asChild className={ui.primaryPill}>
            <Link href="/projects">
              <FolderKanban className="mr-2 h-4 w-4" />
              Open projects
            </Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <ListTodo className="mb-4 h-6 w-6" />
            <p className="text-sm text-muted-foreground">All tasks</p>
            <p className="mt-2 text-3xl font-semibold">{allTasks.length}</p>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Todo</p>
            <p className="mt-2 text-3xl font-semibold">{todoCount}</p>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">In progress</p>
            <p className="mt-2 text-3xl font-semibold">{inProgressCount}</p>
          </div>

          <div className="rounded-3xl border bg-zinc-950 p-6 text-white shadow-xl shadow-black/10">
            <p className="text-sm text-zinc-400">Done</p>
            <p className="mt-2 text-3xl font-semibold">{doneCount}</p>
          </div>
        </section>

        <section className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">All tasks</h2>
            <p className="text-sm text-muted-foreground">
              Tasks are grouped in one place for easier tracking.
            </p>
          </div>

          {allTasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed bg-white p-10 text-center">
              <h3 className="font-semibold">No tasks yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Open a project and create your first task.
              </p>
              <Button asChild className="mt-6 rounded-full">
                <Link href="/projects">Go to projects</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {allTasks.map((task) => {
                const canManage = adminProjectIds.has(task.projectId);

                return (
                  <div
                    key={task.id}
                    className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <TaskStatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                          <Badge variant="outline" className="rounded-full">
                            {task.project.name}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold tracking-tight">
                          {task.title}
                        </h3>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                          {task.description || "No description added."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span>
                            Assigned to:{" "}
                            <span className="font-medium text-foreground">
                              {task.assignedTo?.name || "Unassigned"}
                            </span>
                          </span>

                          <span>
                            Due:{" "}
                            <span className="font-medium text-foreground">
                              {task.dueDate || "No due date"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <TaskStatusSelect
                          taskId={task.id}
                          currentStatus={task.status}
                        />

                        {canManage ? (
                          <DeleteTaskButton taskId={task.id} />
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </ProtectedLayout>
  );
}
