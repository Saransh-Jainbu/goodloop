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
