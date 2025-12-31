'use server';

import { db } from "~/server/db";
import { createId } from "@paralleldrive/cuid2";
import { headers } from "next/headers";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/better-auth";

export async function getMonitors() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) return [];

    return await db.monitor.findMany({
      where: { userId: session.user.id },
      include: {
        pings: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    return [];
  }
}


export type MonitorWithPings = Awaited<ReturnType<typeof getMonitors>>[number];

export async function createMonitor(data: { name: string; interval: number; gracePeriod: number, smartGrace: boolean | undefined, secret?: string }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) throw new Error("Unauthorized");

  await db.monitor.create({
    data: {
      userId: session.user.id,
      name: data.name,
      interval: data.interval,
      gracePeriod: data.gracePeriod,
      useSmartGrace: data.smartGrace,
      secret: data.secret || null,
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

export async function getMonitor(id: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return null;

  return await db.monitor.findUnique({
    where: {
      id,
      userId: session.user.id
    },
    include: {
      pings: {
        orderBy: { createdAt: 'desc' },
        take: 100
      },
      downtimes: {
        orderBy: { startedAt: 'desc' },
        take: 50 // Get recent downtime incidents
      }
    }
  });
}

export async function recordDowntime(monitorId: string, startedAt: Date) {

  return await db.downtime.create({
    data: {
      monitorId,
      startedAt
    }
  });
}

// New action to end downtime
export async function endDowntime(downtimeId: string, endedAt: Date) {
  const downtime = await db.downtime.findUnique({
    where: { id: downtimeId }
  });

  if (!downtime) return null;

  const duration = Math.floor((endedAt.getTime() - downtime.startedAt.getTime()) / (1000 * 60));

  return await db.downtime.update({
    where: { id: downtimeId },
    data: {
      endedAt,
      duration
    }
  });
}

export async function rotateMonitorKey(id: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) throw new Error("Unauthorized");

  // Verify ownership
  const monitor = await db.monitor.findUnique({
    where: { id, userId: session.user.id }
  });

  if (!monitor) throw new Error("Monitor not found");

  await db.monitor.update({
    where: { id },
    data: {
      key: createId() // Generate new CUID
    }
  });

  revalidatePath(`/monitors/${id}`);
  revalidatePath("/dashboard");
}

export async function updateMonitor(id: string, data: { name: string; interval: number; gracePeriod: number, smartGrace: boolean | undefined, secret?: string }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) throw new Error("Unauthorized");

  // Verify ownership
  const monitor = await db.monitor.findUnique({
    where: { id, userId: session.user.id }
  });

  if (!monitor) throw new Error("Monitor not found");

  await db.monitor.update({
    where: { id },
    data: {
      name: data.name,
      interval: data.interval,
      gracePeriod: data.gracePeriod,
      useSmartGrace: data.smartGrace,
      secret: data.secret,
    }
  });

  revalidatePath(`/monitors/${id}`);
  revalidatePath("/dashboard");
}