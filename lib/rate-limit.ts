/*
 * Basic sliding-window throttle. It lives in memory, so it is per server
 * instance: enough to stop casual abuse of outgoing email, not a distributed
 * limiter.
 */

const buckets = new Map<string, number[]>();

/** Shared by the contact form and the chatbot's booking tool (both send two emails). */
export const MAIL_RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

export function rateLimited(key: string, { max, windowMs }: { max: number; windowMs: number }): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
  return recent.length > max;
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Strips control characters except line breaks. */
export function stripControlChars(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : "";
}
