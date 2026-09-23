// GET /api/house — the kitchen counter surface (P-086, prompt-4 R12 · E77).
// Server-side ONLY house telemetry: aggregate counts of HOUSE events (never
// visitors — no per-request identities, no PII, no retention; the counters
// are process-local and reset on restart by design). No cache: the pulse is
// live. ZERO RUM rides this — nothing on the client references this route.
import { NextResponse } from "next/server";
import { house } from "@/lib/counters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { house: house.snapshot() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
