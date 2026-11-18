"use server";

// Server Actions for registering interest in an event. Any signed-in user can register
// (except for their own event); cancelling simply deletes the registration.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const eventIdSchema = z.string().min(1).max(64);

function revalidateFor(eventId: string) {
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/me");
  revalidatePath("/organiser");
  revalidatePath(`/organiser/${eventId}/registrations`);
}

export async function registerInterest(eventId: string) {
  const parsed = eventIdSchema.safeParse(eventId);
  if (!parsed.success) return;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(`/events/${parsed.data}`)}`);

  // Only published events can be registered for, never your own, and not once it has ended.
  const event = await db.event.findFirst({
    where: { id: parsed.data, status: "PUBLISHED" },
    select: { id: true, organiserId: true, capacity: true, startsAt: true, endsAt: true },
  });
  if (!event || event.organiserId === user.id) return;
  if ((event.endsAt ?? event.startsAt) < new Date()) return;

  if (event.capacity !== null) {
    const taken = await db.registration.count({ where: { eventId: event.id } });
    if (taken >= event.capacity) return;
  }

  try {
    await db.registration.create({ data: { userId: user.id, eventId: event.id } });
  } catch (e) {
    // Already registered (unique user + event): nothing to do.
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;
  }
  revalidateFor(event.id);
}

export async function cancelRegistration(eventId: string) {
  const parsed = eventIdSchema.safeParse(eventId);
  if (!parsed.success) return;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Scoped to the current user, so nobody can cancel someone else's registration.
  await db.registration.deleteMany({ where: { userId: user.id, eventId: parsed.data } });
  revalidateFor(parsed.data);
}
