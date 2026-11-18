// OWNER: Anousha. Contract: getEvents(filters), getEventById(id).
import type { Cause, Event } from "@/features/events/types";

export type EventFilters = { cause?: Cause; from?: string; to?: string; location?: string };

export async function getEvents(_filters: EventFilters = {}): Promise<Event[]> {
  return []; // TODO: Prisma query
}

export async function getEventById(_id: string): Promise<Event | null> {
  return null; // TODO: Prisma query
}
