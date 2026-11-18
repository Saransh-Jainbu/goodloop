// OWNER: Anousha. Contract: getEvents(filters), getEventById(id).
// Signatures are fixed. Backed by local fake data until the full Event model
// (Aditya's event.prisma) lands; then swap the bodies for Prisma queries.
import type { Cause, Event } from "@/features/events/types";
import { FAKE_EVENTS } from "./fake-data";

export type EventFilters = { cause?: Cause; from?: string; to?: string; location?: string };

const startOfDay = (iso: string) => new Date(`${iso}T00:00:00`);
const endOfDay = (iso: string) => new Date(`${iso}T23:59:59.999`);

export async function getEvents(filters: EventFilters = {}): Promise<Event[]> {
  const { cause, from, to, location } = filters;
  const needle = location?.trim().toLowerCase();
  const fromDate = from ? startOfDay(from) : undefined;
  const toDate = to ? endOfDay(to) : undefined;

  return FAKE_EVENTS.filter((e) => {
    if (cause && e.cause !== cause) return false;
    if (fromDate && e.startsAt < fromDate) return false;
    if (toDate && e.startsAt > toDate) return false;
    if (needle && !e.address.toLowerCase().includes(needle)) return false;
    return true;
  }).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export async function getEventById(id: string): Promise<Event | null> {
  return FAKE_EVENTS.find((e) => e.id === id) ?? null;
}
