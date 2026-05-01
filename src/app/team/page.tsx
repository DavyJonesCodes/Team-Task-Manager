import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Crown, UsersRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers } from "@/db/schema";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { Badge } from "@/components/ui/badge";

export default async function TeamPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const memberships = await db.query.projectMembers.findMany({
    where: eq(projectMembers.userId, session.user.id),
    with: {
      project: {
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });

  const teamMap = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      projects: {
        name: string;
        role: "admin" | "member";
      }[];
    }
  >();

  for (const membership of memberships) {
    for (const member of membership.project.members) {
      const existing = teamMap.get(member.user.id);

      if (existing) {
        existing.projects.push({
          name: membership.project.name,
          role: member.role,
        });
      } else {
        teamMap.set(member.user.id, {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          projects: [
            {
              name: membership.project.name,
              role: member.role,
            },
          ],
        });
      }
    }
  }

  const teamMembers = Array.from(teamMap.values());

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-4 rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Team overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Team
            </h1>
            <p className="mt-2 text-muted-foreground">
              View members across all projects you can access. Add or remove
              members from individual project pages.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/10">
            {teamMembers.length} members
          </div>
        </section>

        {teamMembers.length === 0 ? (
          <section className="rounded-3xl border border-dashed bg-white/80 p-10 text-center shadow-sm">
            <UsersRound className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No team members yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a project and add members to see them here.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100">
                    <UsersRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{member.name}</h2>
                    <p className="truncate text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {member.projects.map((project) => (
                    <div
                      key={`${member.id}-${project.name}`}
                      className="flex items-center justify-between rounded-2xl border bg-white p-3"
                    >
                      <span className="truncate text-sm font-medium">
                        {project.name}
                      </span>

                      <Badge
                        variant={project.role === "admin" ? "default" : "outline"}
                        className="rounded-full"
                      >
                        {project.role === "admin" ? (
                          <Crown className="mr-1 h-3 w-3" />
                        ) : null}
                        {project.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </ProtectedLayout>
  );
}
