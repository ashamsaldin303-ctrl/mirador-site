// MIRADOR — Zod validation schemas (§8.2 VERBATIM)
import { z } from "zod";

export const availabilityQuerySchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((v) => {
    const d = new Date(v.date + "T00:00:00Z");
    return !Number.isNaN(d.getTime());
  });

export const reservationSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,18}$/),
    partySize: z.number().int().min(1).max(12),
    slot: z.string().datetime(),
    locale: z.enum(["en", "ar"]),
  })
  .refine((v) => {
    // slot sanity: on the 30-min grid, not past, ≤60 days ahead
    const t = new Date(v.slot).getTime();
    const okGrid =
      new Date(v.slot).getUTCMinutes() % 30 === 0 && new Date(v.slot).getUTCSeconds() === 0;
    return okGrid && t > Date.now() && t < Date.now() + 60 * 24 * 3600 * 1000;
  });

export const inquirySchema = z.object({
  type: z.enum(["PRIVATE_DINING", "GENERAL"]),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,18}$/),
  preferredDate: z.string().datetime().optional(),
  partySize: z.number().int().min(1).max(60).optional(),
  message: z.string().trim().min(10).max(1000),
  locale: z.enum(["en", "ar"]),
  website: z.string().max(200).optional(), // honeypot — lenient in schema; HANDLER fakes 201 when non-empty
});

// Wire locale → Prisma enum values (SQLite strings: "EN" | "AR")
export function toDbLocale(locale: "en" | "ar"): "EN" | "AR" {
  return locale.toUpperCase() as "EN" | "AR";
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}
