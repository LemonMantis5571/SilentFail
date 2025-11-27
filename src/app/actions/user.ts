'use server';

import { db } from "~/server/db";
import { headers } from "next/headers";
import { auth } from "~/server/better-auth";


export async function deleteAccount() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) throw new Error("Unauthorized");

  await db.user.delete({
    where: { id: session.user.id }
  });

  // No redirect here. We let the client handle the hard refresh.
  return { success: true };
}