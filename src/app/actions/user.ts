"use server";

import { db } from "~/server/db";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

export async function generateApiKey() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const newKey = `sk_${createId()}${createId()}`; // Prefix sk_ for clarity, longer key

  await db.user.update({
    where: { id: session.user.id },
    data: { apiKey: newKey }
  });

  revalidatePath("/settings");
  return newKey;
}

export async function getApiKey() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { apiKey: true }
  });

  return user?.apiKey ?? null;
}

export async function deleteAccount() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Delete user from DB (Cascades should handle monitors/pings if set up, otherwise manual cleanup might be needed)
  // Assuming Prisma Cascade delete is configured on User relations
  await db.user.delete({
    where: { id: session.user.id }
  });

  return { success: true };
}