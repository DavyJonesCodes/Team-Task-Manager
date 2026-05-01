import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";

import { ui } from "@/lib/styles";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers } from "@/db/schema";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage() {
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

  const userProjects = memberships.map((membership) => ({
    ...membership.project,
    role: membership.role,
  }));

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Projects
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create projects, manage members, and organise tasks.
            </p>
          </div>

          <Button asChild className={ui.primaryPill}>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Link>
          </Button>
        </section>

        {userProjects.length === 0 ? (
          <section className="rounded-3xl border bg-white/80 p-10 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <h2 className="text-xl font-semibold">No projects yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create your first project to start assigning tasks and tracking team progress.
              </p>

              <Button asChild className={`${ui.primaryPill} mt-6`}>
                <Link href="/projects/new">Create your first project</Link>
              </Button>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {userProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        )}
      </div>
    </ProtectedLayout>
  );
}
