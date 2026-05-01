import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, CheckSquare, Crown, UsersRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { canManageProject, canViewProject } from "@/lib/permissions";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { EditProjectForm } from "@/components/projects/edit-project-form";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { TaskForm } from "@/components/forms/task-form";
import { AddMemberForm } from "@/components/team/add-member-form";
import { RemoveMemberButton } from "@/components/team/remove-member-button";
import { TaskCard } from "@/components/tasks/task-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const allowed = await canViewProject(session.user.id, projectId);

  if (!allowed) {
    notFound();
  }

  const canManage = await canManageProject(session.user.id, projectId);

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
      tasks: {
        with: {
          assignedTo: true,
          createdBy: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const completedTasks = project.tasks.filter((task) => task.status === "done").length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to projects
          </Link>
        </Button>

        <section className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {project.status}
                </Badge>

                {canManage ? (
                  <Badge className="rounded-full">
                    <Crown className="mr-1 h-3 w-3" />
                    Admin access
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-full">
                    Member access
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                {project.name}
              </h1>

              <p className="mt-3 max-w-3xl text-muted-foreground">
                {project.description || "No project description added yet."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canManage ? <EditProjectForm project={project} /> : null}
              {canManage ? <AddMemberForm projectId={project.id} /> : null}
              {canManage ? <TaskForm projectId={project.id} members={project.members} /> : null}
              {canManage ? <DeleteProjectButton projectId={project.id} /> : null}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <UsersRound className="mb-4 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Members</p>
            <p className="mt-2 text-3xl font-semibold">{project.members.length}</p>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <CheckSquare className="mb-4 h-6 w-6" />
            <p className="text-sm text-muted-foreground">Tasks</p>
            <p className="mt-2 text-3xl font-semibold">{totalTasks}</p>
          </div>

          <div className="rounded-3xl border bg-zinc-950 p-6 text-white shadow-xl shadow-black/10">
            <p className="text-sm text-zinc-400">Progress</p>
            <p className="mt-2 text-3xl font-semibold">{progress}%</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Members</h2>
            <div className="mt-4 space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-2xl border bg-white p-4"
                >
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === "admin" ? "default" : "outline"} className="rounded-full">
                      {member.role}
                    </Badge>

                    {canManage && member.user.id !== session.user.id ? (
                      <RemoveMemberButton
                        projectId={project.id}
                        memberId={member.id}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold">Tasks</h2>
                <p className="text-sm text-muted-foreground">
                  Create, assign, update, and delete project tasks.
                </p>
              </div>

              {canManage ? (
                <TaskForm projectId={project.id} members={project.members} />
              ) : null}
            </div>

            {project.tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed bg-white p-8 text-center">
                <h3 className="font-semibold">No tasks yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create the first task for this project.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} canManage={canManage} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </ProtectedLayout>
  );
}
