// OWNER: Saransh. Admin-only reads (always call from a page that did requireRole("ADMIN")).
import { db } from "@/lib/db";

export function getOrganisers() {
  return db.user.findMany({
    where: { role: "ORGANISER" },
    select: { id: true, name: true, email: true, organiserStatus: true, createdAt: true },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getAllEvents() {
  return db.event.findMany({
    select: { id: true, title: true, cause: true, createdAt: true, organiser: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStats() {
  const [users, organisers, pendingOrganisers, events, registrations] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.user.count({ where: { role: "ORGANISER" } }),
    db.user.count({ where: { role: "ORGANISER", organiserStatus: "PENDING" } }),
    db.event.count(),
    db.registration.count(),
  ]);
  return { users, organisers, pendingOrganisers, events, registrations };
}

/** Newest users first; optional search on name or email (case-insensitive). Capped to keep the page light. */
export function getUsers(q?: string) {
  const needle = q?.trim();
  return db.user.findMany({
    where: needle
      ? { OR: [{ name: { contains: needle, mode: "insensitive" } }, { email: { contains: needle, mode: "insensitive" } }] }
      : undefined,
    select: { id: true, name: true, email: true, role: true, organiserStatus: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
