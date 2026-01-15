import { rateLimit } from 'elysia-rate-limit';

// Custom IP generator for Next.js proxy environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getClientIP = (request: any) => {
 
  const req = request.request ?? request;
  const forwarded = req.headers?.get?.('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'global';
  }
  const realIP = req.headers?.get?.('x-real-ip');
  if (realIP) {
    return realIP;
  }
  // Fallback to a default key (all requests share limit)
  return 'global';
};

export const pingRateLimit = rateLimit({
  duration: 60_000,  // 1 minute
  max: 100,          // 100 requests per minute
  generator: getClientIP,
  errorResponse: new Response('Rate limit exceeded. Try again later.', { status: 429 })
});

export const adminRateLimit = rateLimit({
  duration: 60_000,  // 1 minute  
  max: 30,           // 30 requests per minute
  generator: getClientIP,
  errorResponse: new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json' }
  })
});

