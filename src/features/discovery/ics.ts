// OWNER: Anousha. Builds an iCalendar (.ics) file for one event.
import type { Event } from "@/features/events/types";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// RFC 5545: lines should be folded at 75 octets; fold by characters, which is safe and close enough.
const fold = (line: string) => line.match(/.{1,73}/gu)?.join("\r\n ") ?? line;

export function buildIcs(event: Event, url: string): string {
  const end = event.endsAt ?? new Date(event.startsAt.getTime() + 2 * 60 * 60 * 1000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GoodLoop//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@goodloop`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(event.startsAt)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(`${event.description}\n\n${url}`)}`,
    `LOCATION:${escape(event.address)}`,
    `GEO:${event.lat};${event.lng}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
