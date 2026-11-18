// OWNER: Aditya. Queries for organiser area.
import { db } from "@/lib/db";

export async function getOrganiserEvents(organiserId: string) {
  return db.event.findMany({
    where: { organiserId },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { startsAt: "asc" },
  });
}

export async function getOrganiserEventById(id: string, organiserId: string) {
  return db.event.findFirst({
    where: { id, organiserId },
  });
}
