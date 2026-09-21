// MIRADOR — in-memory rate limiter (§8.4 normative semantics)
// Sliding 60s window per IP — timestamps array. The two POST routes share ONE
// limit (the 6th POST inside any 60s window → 429); GET /api/availability has
// its own 30-per-60s limit. Single-instance v1; NEVER a security boundary —
// the unique constraints are the booking-safety layer.
// Test isolation (sanctioned): E2E scripts set E2E_RATE_LIMIT=off — the limiter
// no-ops under this env flag, and the flag is ignored when NODE_ENV=production.

type Window = { hits: number[] };

const buckets = new Map<string, Window>();

const MAX_HITS = {
  write: 5, // 6th POST within 60s → 429
  read: 30, // availability
} as const;

export function rateLimitDisabled(): boolean {
  return process.env.E2E_RATE_LIMIT === "off" && process.env.NODE_ENV !== "production";
}

export type RateResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds
};

function check(kind: "write" | "read", key: string): RateResult {
  const now = Date.now();
  const windowMs = 60_000;
  const maxHits = kind === "write" ? MAX_HITS.write : MAX_HITS.read;
  let w = buckets.get(`${kind}:${key}`);
  if (!w) {
    w = { hits: [] };
    buckets.set(`${kind}:${key}`, w);
  }
  // slide: keep only hits inside the last 60s
  w.hits = w.hits.filter((t) => now - t < windowMs);
  if (w.hits.length >= maxHits) {
    const oldest = w.hits[0] ?? now;
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { ok: false, remaining: 0, retryAfter };
  }
  w.hits.push(now);
  return { ok: true, remaining: maxHits - w.hits.length, retryAfter: 0 };
}

/** First hop of x-forwarded-for, falling back to x-real-ip (proxy assumption documented in AGENTS.md). */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

export function limitWrite(ip: string): RateResult {
  if (rateLimitDisabled()) return { ok: true, remaining: MAX_HITS.write, retryAfter: 0 };
  return check("write", ip);
}

export function limitRead(ip: string): RateResult {
  if (rateLimitDisabled()) return { ok: true, remaining: MAX_HITS.read, retryAfter: 0 };
  return check("read", ip);
}
