# MIRADOR — API route table (frozen at T0.5, brief §8.1)

| METHOD | Path | Purpose | Auth | Success | Errors | Rate limit |
|---|---|---|---|---|---|---|
| GET | `/api/availability?date=YYYY-MM-DD` | slots + remaining for a Damascus-local date | none | 200 `{date, slots:[{time, remaining}]}` | 400 (bad date) · 429 | 30/min/IP (read-only bucket) |
| POST | `/api/reservations` | create reservation (transactional §6.3) | none | 201 `{id, tableNumber, slot, whatsappUrl}` | 400 · 409 SLOT_FULL · 409 DUPLICATE · 429 | 5/min/IP (shared POST bucket) |
| POST | `/api/inquiries` | persist private-dining/general inquiry | none | 201 `{id}` | 400 · 429 | 5/min/IP (shared POST bucket) |

## Frozen semantics (deviations/interpretations disclosed)

- **Rate limiter**: in-memory sliding 60s window per IP (timestamps array).
  The 6th POST inside any 60s window → 429 `{error:"RATE_LIMITED", retryAfter}`
  + `Retry-After` + `X-RateLimit-Remaining`. GET availability has its own
  30-per-60s bucket. IP = first hop of `x-forwarded-for`, falling back to
  `x-real-ip` (proxy assumption documented in AGENTS.md). `E2E_RATE_LIMIT=off`
  no-ops the limiter (ignored when `NODE_ENV=production`). Single-instance v1 —
  NEVER a security boundary; the unique constraints are the booking-safety layer.
- **Honeypot ruling** (§8.2): non-empty `website` short-circuits BEFORE
  persistence — normal 201 shape with a fake id, no row (F8-4).
- **Monday availability interpretation**: a Monday date answers all 10 slots at
  `remaining: 0` (sold-out rendering — §4.3 disabled grid); POST still rejects
  Monday slots with 400 (slot-day validation). Closed-day semantics per §6.2.
- **Past slots** on today's date answer `remaining: 0`; POST rejects past slots.
- **Wire→DB mapping**: `en|ar` → `EN|AR`; phone normalized (`replace(/[\s-]/g,"")`)
  before insert + duplicate check.
- **Validation errors**: 400 `{error:"VALIDATION", fields:{<field>:["<errorKey>"]}}` —
  field keys map to `content/<locale>.json` `errors.*`, rendered per-field inline.
- **P2002 mapping**: `[slot,tableNumber]` → 409 SLOT_FULL · `[phone,slot]` → 409 DUPLICATE.

Sandbox deviation (ASSUMPTIONS #2): SQLite datasource; the interactive
transaction + unique guards run verbatim (R4 booking safety intact).
