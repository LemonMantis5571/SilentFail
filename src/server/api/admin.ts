import { Elysia, t } from 'elysia';
import { adminRateLimit } from './rate-limit';
import { db } from '~/server/db';
import { createId } from "@paralleldrive/cuid2";

export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(adminRateLimit)
  .resolve(async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    
    const apiKey = authHeader.slice(7);
    const user = await db.user.findUnique({
      where: { apiKey }
    });
    
    if (!user) {
      throw new Error("Unauthorized");
    }
    
    return { user };
  })
  .get('/monitors', async ({ user }) => {
    return await db.monitor.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
  })
  .post('/monitors', async ({ user, body }) => {
    const { name, interval, useSmartGrace, gracePeriod, privateMonitor } = body;
    
    const monitor = await db.monitor.create({
      data: {
        userId: user.id,
        name,
        interval,
        gracePeriod,  
        useSmartGrace,
        secret: privateMonitor ? createId() : null, 
        status: "PENDING",
        key: createId(),
      }
    });
    
    return monitor;
  }, {
    body: t.Object({
      name: t.String(),
      interval: t.Number(),
      useSmartGrace: t.Boolean(),
      gracePeriod: t.Number(),
      privateMonitor: t.Boolean()
    })
  })
  .patch('/monitors/:id', async ({ user, params: { id }, body }) => {
    const { name, interval, useSmartGrace, gracePeriod, privateMonitor } = body;
    
    const monitor = await db.monitor.findUnique({
       where: { id, userId: user.id }
    });

    if (!monitor) {
      throw new Error("Monitor not found or unauthorized");
    }

    await db.monitor.update({
      where: { id },
      data: {
        name: name ?? undefined,
        interval: interval ?? undefined,
        gracePeriod: gracePeriod ?? undefined,
        useSmartGrace: useSmartGrace ?? undefined,
        secret: privateMonitor === undefined ? undefined : (privateMonitor ? (monitor.secret || createId()) : null)
      }
    });

    return { success: true };
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      interval: t.Optional(t.Number()),
      useSmartGrace: t.Optional(t.Boolean()),
      gracePeriod: t.Optional(t.Number()),
      privateMonitor: t.Optional(t.Boolean())
    })
  });
