'use server';

import { db } from "~/server/db";
import { headers } from "next/headers";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/better-auth";

export async function getMonitors() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return [];

  return await db.monitor.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createMonitor(data: { name: string; interval: number; gracePeriod: number }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) throw new Error("Unauthorized");

  await db.monitor.create({
    data: {
      userId: session.user.id,
      name: data.name,
      interval: data.interval,
      gracePeriod: data.gracePeriod, // <--- Add this line
      status: "PENDING"
    }
  });

  revalidatePath("/dashboard");
}

export async function deleteMonitor(id: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) throw new Error("Unauthorized");

  await db.monitor.delete({
    where: { 
      id,
      userId: session.user.id 
    }
  });

  revalidatePath("/dashboard");
}