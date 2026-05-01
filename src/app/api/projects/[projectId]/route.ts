import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers, projects } from "@/db/schema";
import { canManageProject, canViewProject } from "@/lib/permissions";
import { updateProjectSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canViewProject(session.user.id, projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
      tasks: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { projectId } = await context.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canManageProject(session.user.id, projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [updatedProject] = await db
    .update(projects)
    .set({
      name: parsed.data.name,
      description: parsed.data.description || null,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))
    .returning();

  return NextResponse.json({ project: updatedProject });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canManageProject(session.user.id, projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(projects).where(eq(projects.id, projectId));

  return NextResponse.json({ success: true });
}
