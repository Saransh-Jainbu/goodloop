// OWNER: Anousha. Contract: getEvents(filters), getEventById(id). Signatures are fixed.
// Public discovery only ever shows PUBLISHED events (drafts and cancelled events stay hidden).
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { Cause, Event } from "@/features/events/types";

export type EventFilters = { cause?: Cause; from?: string; to?: string; location?: string };

const startOfDay = (iso: string) => new Date(`${iso}T00:00:00`);
const endOfDay = (iso: string) => new Date(`${iso}T23:59:59.999`);

export async function getEvents(filters: EventFilters = {}): Promise<Event[]> {
  const { cause, from, to, location } = filters;
  const needle = location?.trim();

  const where: Prisma.EventWhereInput = { status: "PUBLISHED" };
  if (cause) where.cause = cause;
  if (from || to) {
    where.startsAt = {
      ...(from ? { gte: startOfDay(from) } : {}),
      ...(to ? { lte: endOfDay(to) } : {}),
    };
  }
  if (needle) where.address = { contains: needle, mode: "insensitive" };

  return db.event.findMany({ where, orderBy: { startsAt: "asc" } });
}

export async function getEventById(id: string): Promise<Event | null> {
  return db.event.findFirst({ where: { id, status: "PUBLISHED" } });
}
