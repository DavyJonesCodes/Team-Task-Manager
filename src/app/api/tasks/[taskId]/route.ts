import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import {
  canManageTask,
  canUpdateTaskStatus,
  canViewTask,
} from "@/lib/permissions";
import { updateTaskSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canViewTask(session.user.id, taskId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      project: true,
      assignedTo: true,
      createdBy: true,
      comments: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { taskId } = await context.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const canManage = await canManageTask(session.user.id, taskId);
  const canUpdateStatus = await canUpdateTaskStatus(session.user.id, taskId);

  if (!canManage && !canUpdateStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData: Partial<typeof tasks.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (canManage) {
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined) {
      updateData.description = parsed.data.description || null;
    }
    if (parsed.data.priority !== undefined) {
      updateData.priority = parsed.data.priority;
    }
    if (parsed.data.assignedToId !== undefined) {
      updateData.assignedToId = parsed.data.assignedToId || null;
    }
    if (parsed.data.dueDate !== undefined) {
      updateData.dueDate = parsed.data.dueDate || null;
    }
  }

  if (parsed.data.status !== undefined) {
    updateData.status = parsed.data.status;
  }

  const [updatedTask] = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, taskId))
    .returning();

  return NextResponse.json({ task: updatedTask });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canManageTask(session.user.id, taskId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(tasks).where(eq(tasks.id, taskId));

  return NextResponse.json({ success: true });
}
