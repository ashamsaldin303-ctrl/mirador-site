// MIRADOR — venue constants (§7.10 VERBATIM; fictional per A5, registered in ASSETS-REPLACE.md)
// The WhatsApp number resolves as process.env.WHATSAPP_NUMBER ?? VENUE.whatsappNumber —
// env overrides, the constant is the default: one source of truth in code.

export const VENUE = {
  nameEn: "MIRADOR",
  nameAr: "ميرادور",
  addressEn: "Level 6, Lighthouse Tower, Abu Rummaneh Street, Damascus, Syria",
  addressAr: "الطابق السادس، برج المنارة، شارع أبو رمانة، دمشق، سوريا",
  phone: "+963 11 341 7700", // tel:+963113417700
  whatsappNumber: "963955000111", // wa.me/963955000111
  email: "reservations@miradordamascus.com",
  hoursEn: "Tuesday – Sunday, 18:00 – 23:30 · kitchen last order 22:45 · closed Monday",
  hoursAr: "الثلاثاء – الأحد، 18:00 – 23:30 · آخر طلب للمطبخ 22:45 · مغلق يوم الاثنين",
  sypPerUsd: 12500,
  sypRounding: 500,
  tablesPerSlot: 12,
  slotMinutes: 30,
  bookingHorizonDays: 60,
} as const;

export const TABLES: readonly number[] = Array.from(
  { length: VENUE.tablesPerSlot },
  (_, i) => i + 1,
);

export function whatsappNumber(): string {
  return process.env.WHATSAPP_NUMBER ?? VENUE.whatsappNumber;
}

export function telHref(): string {
  return `tel:${VENUE.phone.replace(/[\s-]/g, "")}`;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
