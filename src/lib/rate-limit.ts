/**
 * A simple in-memory rate limiter.
 * Note: This works best in a single Node.js instance. In serverless Edge environments
 * or multi-instance deployments, a distributed store like Redis is recommended.
 * For our current needs, this provides basic DoS protection.
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetTime) {
    store.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  store.set(ip, record);

  return { success: true, limit, remaining: limit - record.count, reset: record.resetTime };
}
