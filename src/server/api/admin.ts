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
  .get('/stats', async ({ user }) => {
    const monitors = await db.monitor.findMany({
      where: { userId: user.id }
    });

    const total = monitors.length;
    const active = monitors.filter(m => m.status === 'UP').length;
    const down = monitors.filter(m => m.status === 'DOWN').length;

    return {
      total,
      active,
      down,
      monitors: {
        total,
        active,
        down
      }
    };
  }, {
    detail: {
      tags: ['Admin'],
      summary: 'Get system stats',
      description: 'Returns overview statistics of all monitors',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/monitors', async ({ user }) => {
    return await db.monitor.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
  }, {
    detail: {
      tags: ['Admin'],
      summary: 'Get all monitors',
      description: 'Returns all monitors owned by the authenticated user',
      security: [{ bearerAuth: [] }]
    }
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
    }),
    detail: {
      tags: ['Admin'],
      summary: 'Create a monitor',
      description: 'Creates a new heartbeat monitor with the specified configuration',
      security: [{ bearerAuth: [] }]
    }
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
        secret: privateMonitor === undefined ? undefined : (privateMonitor ? (monitor.secret ?? createId()) : null)
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
    }),
    detail: {
      tags: ['Admin'],
      summary: 'Update a monitor',
      description: 'Partially updates an existing monitor by ID',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/monitors/:id', async ({ user, params: { id } }) => {
    const monitor = await db.monitor.findUnique({
      where: { id, userId: user.id }
    });

    if (!monitor) {
      throw new Error("Monitor not found or unauthorized");
    }

    return monitor;
  }, {
    detail: {
      tags: ['Admin'],
      summary: 'Get a monitor',
      description: 'Returns details of a specific monitor',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/monitors/:id/pings', async ({ user, params: { id }, query }) => {
    const monitor = await db.monitor.findUnique({
      where: { id, userId: user.id }
    });

    if (!monitor) {
      throw new Error("Monitor not found or unauthorized");
    }

    const limit = query.limit ? parseInt(query.limit) : 50;
    const offset = query.offset ? parseInt(query.offset) : 0;

    const pings = await db.pingEvent.findMany({
      where: { monitorId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await db.pingEvent.count({
      where: { monitorId: id }
    });

    return { pings, total, limit, offset };
  }, {
    query: t.Object({
      limit: t.Optional(t.String()),
      offset: t.Optional(t.String())
    }),
    detail: {
      tags: ['Admin'],
      summary: 'Get ping history',
      description: 'Returns paginated ping history for a specific monitor',
      security: [{ bearerAuth: [] }]
    }
  })
  .get('/monitors/:id/downtimes', async ({ user, params: { id }, query }) => {
    const monitor = await db.monitor.findUnique({
      where: { id, userId: user.id }
    });

    if (!monitor) {
      throw new Error("Monitor not found or unauthorized");
    }

    const limit = query.limit ? parseInt(query.limit) : 50;
    const offset = query.offset ? parseInt(query.offset) : 0;

    const downtimes = await db.downtime.findMany({
      where: { monitorId: id },
      orderBy: { startedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await db.downtime.count({
      where: { monitorId: id }
    });

    return { downtimes, total, limit, offset };
  }, {
    query: t.Object({
      limit: t.Optional(t.String()),
      offset: t.Optional(t.String())
    }),
    detail: {
      tags: ['Admin'],
      summary: 'Get downtime history',
      description: 'Returns paginated downtime history for a specific monitor',
      security: [{ bearerAuth: [] }]
    }
  })
 
  .delete('/monitors/:id', async ({ user, params: { id } }) => {
    const monitor = await db.monitor.findUnique({
      where: { id, userId: user.id }
    });

    if (!monitor) {
      throw new Error("Monitor not found or unauthorized");
    }


    await db.pingEvent.deleteMany({ where: { monitorId: id } });
    await db.downtime.deleteMany({ where: { monitorId: id } });
    await db.monitor.delete({ where: { id } });

    return { success: true, message: "Monitor deleted" };
  }, {
    detail: {
      tags: ['Admin'],
      summary: 'Delete a monitor',
      description: 'Permanently deletes a monitor and all its associated data (pings, downtime records)',
      security: [{ bearerAuth: [] }]
    }
  })

  .post('/monitors/:id/regenerate-key', async ({ user, params: { id } }) => {
    const monitor = await db.monitor.findUnique({
      where: { id, userId: user.id }
    });

    if (!monitor) {
      throw new Error("Monitor not found or unauthorized");
    }

    const newKey = createId();
    
    await db.monitor.update({
      where: { id },
      data: { key: newKey }
    });

    return { success: true, key: newKey };
  }, {
    detail: {
      tags: ['Admin'],
      summary: 'Regenerate monitor key',
      description: 'Generates a new unique key for the monitor. The old key will no longer work.',
      security: [{ bearerAuth: [] }]
    }
  });
