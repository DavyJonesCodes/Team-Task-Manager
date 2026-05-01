import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { projectMembers, projects, tasks } from "@/db/schema";

export async function getProjectMembership(userId: string, projectId: string) {
  const membership = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.userId, userId),
      eq(projectMembers.projectId, projectId)
    ),
  });

  return membership;
}

export async function canViewProject(userId: string, projectId: string) {
  const membership = await getProjectMembership(userId, projectId);
  return Boolean(membership);
}

export async function canManageProject(userId: string, projectId: string) {
  const membership = await getProjectMembership(userId, projectId);
  return membership?.role === "admin";
}

export async function isProjectOwner(userId: string, projectId: string) {
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.ownerId, userId)),
  });

  return Boolean(project);
}

export async function canViewTask(userId: string, taskId: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) return false;

  return canViewProject(userId, task.projectId);
}

export async function canManageTask(userId: string, taskId: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) return false;

  return canManageProject(userId, task.projectId);
}

export async function canUpdateTaskStatus(userId: string, taskId: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) return false;

  const isAdmin = await canManageProject(userId, task.projectId);

  if (isAdmin) return true;

  return task.assignedToId === userId;
}
