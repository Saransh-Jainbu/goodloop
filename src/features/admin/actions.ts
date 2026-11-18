"use server";
// OWNER: Saransh. FR5 stubs.
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export async function setOrganiserStatus(userId: string, status: "APPROVED" | "REJECTED") {
  await requireRole("ADMIN");
  await db.user.update({ where: { id: userId }, data: { organiserStatus: status } });
  revalidatePath("/admin");
}

export async function removeEvent(eventId: string) {
  await requireRole("ADMIN");
  await db.event.delete({ where: { id: eventId } });
  revalidatePath("/admin");
  revalidatePath("/events");
}
