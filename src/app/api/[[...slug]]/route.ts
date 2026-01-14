import { Elysia } from 'elysia';
import { pingRoutes } from '~/server/api/ping';
import { adminRoutes } from '~/server/api/admin';
import { cronRoutes } from '~/server/api/cron';

const app = new Elysia({ prefix: '/api' })
  .onError(({ code, error }) => {
    console.error(`Elysia Error [${code}]:`, error);
    return new Response(JSON.stringify({ error: code, message: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  })
  .use(pingRoutes)
  .use(adminRoutes)
  .use(cronRoutes);

export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
