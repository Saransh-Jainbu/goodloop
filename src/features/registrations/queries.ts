// Contract: getRegistrationsForEvent(eventId), getMyRegistrations().
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export type RegistrationWithUser = { id: string; userName: string | null; userEmail: string; createdAt: Date };

/** Volunteers registered for an event. Only the event's organiser (or an admin) gets results. */
export async function getRegistrationsForEvent(eventId: string): Promise<RegistrationWithUser[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const event = await db.event.findUnique({ where: { id: eventId }, select: { organiserId: true } });
  if (!event || (event.organiserId !== user.id && user.role !== "ADMIN")) return [];

  const rows = await db.registration.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });
  return rows.map((r) => ({ id: r.id, userName: r.user.name, userEmail: r.user.email, createdAt: r.createdAt }));
}

/** The signed-in user's registrations (with their events), soonest event first. */
export async function getMyRegistrations() {
  const user = await getCurrentUser();
  if (!user) return [];
  return db.registration.findMany({
    where: { userId: user.id },
    orderBy: { event: { startsAt: "asc" } },
    include: { event: true },
  });
}

/** Everything the RegisterButton needs to decide what to show. Null if the event isn't public. */
export async function getRegistrationState(eventId: string) {
  const event = await db.event.findFirst({
    where: { id: eventId, status: "PUBLISHED" },
    select: { organiserId: true, capacity: true, startsAt: true, endsAt: true },
  });
  if (!event) return null;

  const user = await getCurrentUser();
  const [taken, mine] = await Promise.all([
    db.registration.count({ where: { eventId } }),
    user ? db.registration.findUnique({ where: { userId_eventId: { userId: user.id, eventId } } }) : null,
  ]);

  return {
    signedIn: !!user,
    isOrganiser: user?.id === event.organiserId,
    registered: !!mine,
    taken,
    capacity: event.capacity,
    full: event.capacity !== null && taken >= event.capacity,
    ended: (event.endsAt ?? event.startsAt) < new Date(),
  };
}
