import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers, projects } from "@/db/schema";
import { createProjectSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await db.query.projectMembers.findMany({
    where: eq(projectMembers.userId, session.user.id),
    with: {
      project: true,
    },
    orderBy: desc(projectMembers.createdAt),
  });

  return NextResponse.json({
    projects: memberships.map((membership) => ({
      ...membership.project,
      role: membership.role,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [project] = await db
    .insert(projects)
    .values({
      name: parsed.data.name,
      description: parsed.data.description || null,
      ownerId: session.user.id,
    })
    .returning();

  await db.insert(projectMembers).values({
    projectId: project.id,
    userId: session.user.id,
    role: "admin",
  });

  return NextResponse.json({ project }, { status: 201 });
}
