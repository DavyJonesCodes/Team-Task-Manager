import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projectMembers, user } from "@/db/schema";
import { canManageProject } from "@/lib/permissions";

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

  const allowed = await canManageProject(session.user.id, projectId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const members = await db.query.projectMembers.findMany({
    where: eq(projectMembers.projectId, projectId),
    with: {
      user: true,
    },
  });

  return NextResponse.json({ members });
}

export async function POST(request: Request, context: RouteContext) {
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

  const email = String(body.email || "").trim().toLowerCase();
  const role = body.role === "admin" ? "admin" : "member";

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "No user found with that email. Ask them to sign up first." },
      { status: 404 }
    );
  }

  const existingMembership = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, existingUser.id)
    ),
  });

  if (existingMembership) {
    return NextResponse.json(
      { error: "This user is already a member of the project." },
      { status: 409 }
    );
  }

  const [member] = await db
    .insert(projectMembers)
    .values({
      projectId,
      userId: existingUser.id,
      role,
    })
    .returning();

  return NextResponse.json({ member }, { status: 201 });
}

export async function DELETE(request: Request, context: RouteContext) {
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

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");

  if (!memberId) {
    return NextResponse.json(
      { error: "memberId is required." },
      { status: 400 }
    );
  }

  const member = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.id, memberId),
      eq(projectMembers.projectId, projectId)
    ),
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  if (member.userId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot remove yourself from this project." },
      { status: 400 }
    );
  }

  await db.delete(projectMembers).where(eq(projectMembers.id, memberId));

  return NextResponse.json({ success: true });
}
