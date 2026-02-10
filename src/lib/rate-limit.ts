import { kv } from "@vercel/kv";

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 stamp additions per minute

// In-memory fallback
const inMemoryRequestLog = new Map<string, number[]>();

export class RateLimitService {
  /**
   * Checks if an IP is rate limited using Vercel KV or in-memory fallback.
   * Returns true if rate limited, false otherwise.
   */
  static async isRateLimited(ip: string): Promise<boolean> {
    const now = Date.now();

    // Check if KV is configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const key = `rate_limit:${ip}`;

        // Lua script for atomic sliding window:
        // 1. Remove expired timestamps
        // 2. Count current timestamps
        // 3. If count < limit, add current timestamp & set expire
        // 4. Return count (or flag)
        const script = `
          local key = KEYS[1]
          local window = tonumber(ARGV[1])
          local limit = tonumber(ARGV[2])
          local now = tonumber(ARGV[3])

          redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
          local count = redis.call('ZCARD', key)

          if count < limit then
            redis.call('ZADD', key, now, now)
            redis.call('PEXPIRE', key, window)
            return 0 -- Allowed
          else
            return 1 -- Limited
          end
        `;

        const result = await kv.eval(script, [key], [RATE_LIMIT_WINDOW, RATE_LIMIT_MAX, now]);
        return result === 1;
      } catch (error) {
        console.error("RateLimitService: KV error, falling back to in-memory", error);
        // Fallback to in-memory if KV fails
      }
    } else {
      // Log warning only once per server instance start (or just log every time? better once)
      if (!global.hasLoggedRateLimitWarning) {
        console.warn("[RateLimit] Running in insecure in-memory mode. Set KV_* env vars for production.");
        global.hasLoggedRateLimitWarning = true;
      }
    }

    // In-memory fallback logic (same as original implementation)
    const timestamps = inMemoryRequestLog.get(ip) || [];
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

    if (valid.length >= RATE_LIMIT_MAX) {
      // Update the log with valid timestamps only (cleanup)
      inMemoryRequestLog.set(ip, valid);
      return true;
    }

    valid.push(now);
    inMemoryRequestLog.set(ip, valid);
    return false;
  }
}

// Global augmentation for the warning flag
declare global {
  var hasLoggedRateLimitWarning: boolean;
}
