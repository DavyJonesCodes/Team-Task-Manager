import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be less than 80 characters."),
});

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const [updatedUser] = await db
    .update(user)
    .set({
      name: parsed.data.name,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
    });

  return NextResponse.json({ user: updatedUser });
}
