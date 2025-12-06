import { RateLimiterMemory } from "rate-limiter-flexible";

// Login Rate Limiter: 5 attempts per minute per IP
export const loginRateLimiter = new RateLimiterMemory({
  points: 5, // 5 points
  duration: 60, // Per 60 seconds
});

// AI Scan Rate Limiter: 5 scans per hour per User ID
export const scanRateLimiter = new RateLimiterMemory({
  points: 5, // 5 points
  duration: 60 * 60, // Per 1 hour
});

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await limiter.consume(key);
    return { success: true };
  } catch (rejRes) {
    return {
      success: false,
      error: "Too many requests. Please try again later.",
    };
  }
}
