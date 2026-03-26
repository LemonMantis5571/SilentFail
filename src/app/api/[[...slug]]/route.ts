import { Elysia } from 'elysia';
import { pingRoutes } from '~/server/api/ping';
import { adminRoutes } from '~/server/api/admin';
import { cronRoutes } from '~/server/api/cron';
import { isHttpError } from '~/server/api/http-error';

const statusByCode = {
  NOT_FOUND: 404,
  VALIDATION: 400,
  PARSE: 400,
} as const;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Internal Server Error';
}

const app = new Elysia({ prefix: '/api' })
  .onError(({ code, error }) => {
    const status =
      isHttpError(error)
        ? error.status
        : statusByCode[code as keyof typeof statusByCode] ?? 500;
    const message = getErrorMessage(error);

    console.error(`Elysia Error [${code}]:`, error);
    return new Response(JSON.stringify({ error: code, message }), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  })
  .use(pingRoutes)
  .use(adminRoutes)
  .use(cronRoutes);

export const GET = app.handle;
export const HEAD = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
