import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { canManageProject, canViewProject } from "@/lib/permissions";
import { createTaskSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required" },
      { status: 400 }
    );
  }

  const allowed = await canViewProject(session.user.id, projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const projectTasks = await db.query.tasks.findMany({
    where: eq(tasks.projectId, projectId),
    with: {
      assignedTo: true,
      createdBy: true,
    },
    orderBy: desc(tasks.createdAt),
  });

  return NextResponse.json({ tasks: projectTasks });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const allowed = await canManageProject(session.user.id, parsed.data.projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [task] = await db
    .insert(tasks)
    .values({
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      priority: parsed.data.priority,
      assignedToId: parsed.data.assignedToId || null,
      dueDate: parsed.data.dueDate || null,
      createdById: session.user.id,
    })
    .returning();

  return NextResponse.json({ task }, { status: 201 });
}
