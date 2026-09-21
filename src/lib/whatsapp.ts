// MIRADOR — WhatsApp deep links (§8.4: no SDK — deep links only)
import { whatsappNumber } from "./venue";

export function waHref(message: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}

/** Prefilled confirmation message (§8.4). */
export function confirmationMessage(
  locale: "en" | "ar",
  data: { name: string; partySize: number; date: string; time: string; id: string },
): string {
  const ref = data.id.slice(-6);
  if (locale === "ar") {
    return `مرحباً ميرادور — أؤكد حجزي: ${data.name}، ${data.partySize} ضيوف، ${data.date} الساعة ${data.time} (رقم ${ref}).`;
  }
  return `Hello MIRADOR — confirming my reservation: ${data.name}, ${data.partySize} guests, ${data.date} at ${data.time} (ref ${ref}).`;
}

/** General CTA message (§8.4). */
export function generalMessage(locale: "en" | "ar"): string {
  return locale === "ar"
    ? "مرحباً ميرادور — أودّ الاستفسار عن مائدة."
    : "Hello MIRADOR — I would like to ask about a table.";
}
