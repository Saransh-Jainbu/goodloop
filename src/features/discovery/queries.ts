// OWNER: Anousha. Contract: getEvents(filters), getEventById(id). Signatures are fixed.
// Public discovery only ever shows PUBLISHED events (drafts and cancelled events stay hidden).
// The extra filter fields (q, sort, page, pageSize) are optional, so existing callers are unaffected.
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { Cause, Event } from "@/features/events/types";

export type EventSort = "soonest" | "newest";
export type EventFilters = {
  cause?: Cause;
  from?: string;
  to?: string;
  location?: string;
  q?: string;
  sort?: EventSort;
  page?: number;
  pageSize?: number;
};

const startOfDay = (iso: string) => new Date(`${iso}T00:00:00`);
const endOfDay = (iso: string) => new Date(`${iso}T23:59:59.999`);

function buildWhere({ cause, from, to, location, q }: EventFilters): Prisma.EventWhereInput {
  const where: Prisma.EventWhereInput = { status: "PUBLISHED" };
  if (cause) where.cause = cause;
  if (from || to) {
    where.startsAt = {
      ...(from ? { gte: startOfDay(from) } : {}),
      ...(to ? { lte: endOfDay(to) } : {}),
    };
  }
  const place = location?.trim();
  if (place) where.address = { contains: place, mode: "insensitive" };
  const text = q?.trim();
  if (text) {
    where.OR = [
      { title: { contains: text, mode: "insensitive" } },
      { description: { contains: text, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function getEvents(filters: EventFilters = {}): Promise<Event[]> {
  const { sort = "soonest", page = 1, pageSize } = filters;
  return db.event.findMany({
    where: buildWhere(filters),
    orderBy: sort === "newest" ? { createdAt: "desc" } : { startsAt: "asc" },
    ...(pageSize ? { skip: (Math.max(1, page) - 1) * pageSize, take: pageSize } : {}),
  });
}

/** Total number of events matching the filters (ignores page/pageSize). */
export async function countEvents(filters: EventFilters = {}): Promise<number> {
  return db.event.count({ where: buildWhere(filters) });
}

export async function getEventById(id: string): Promise<Event | null> {
  return db.event.findFirst({ where: { id, status: "PUBLISHED" } });
}

/**
 * Everything the detail page needs. Only the organiser's public name is returned
 * (never their email), so it's safe to render next to client components.
 */
export async function getEventDetail(id: string) {
  const row = await db.event.findFirst({
    where: { id, status: "PUBLISHED" },
    include: { organiser: { select: { name: true } }, _count: { select: { registrations: true } } },
  });
  if (!row) return null;
  const { organiser, _count, ...event } = row;
  return { event: event as Event, organiserName: organiser.name, registrationCount: _count.registrations };
}
