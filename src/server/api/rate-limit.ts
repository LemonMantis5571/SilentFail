import { rateLimit } from 'elysia-rate-limit';

export const pingRateLimit = rateLimit({
  duration: 60_000,  // 1 minute
  max: 100,          // 100 requests per minute
  errorResponse: new Response('Rate limit exceeded. Try again later.', { status: 429 })
});

export const adminRateLimit = rateLimit({
  duration: 60_000,  // 1 minute  
  max: 30,           // 30 requests per minute
  errorResponse: new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json' }
  })
});
