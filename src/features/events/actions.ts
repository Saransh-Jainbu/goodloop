"use server";

// OWNER: Aditya. Server actions for event lifecycle.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireApprovedOrganiser } from "@/lib/session";
import { eventSchema, type EventActionState } from "./schema";

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const user = await requireApprovedOrganiser();

  const raw = Object.fromEntries(formData);
  const parsed = eventSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      error: "Please correct the errors in the form.",
      fieldErrors,
    };
  }

  try {
    await db.event.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        cause: parsed.data.cause,
        startsAt: parsed.data.startsAt,
        endsAt: parsed.data.endsAt ?? null,
        address: parsed.data.address,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        capacity: parsed.data.capacity ?? null,
        status: parsed.data.status,
        organiserId: user.id,
      },
    });
  } catch (err) {
    console.error("Failed to create event:", err);
    return { error: "Failed to create event. Please try again." };
  }

  revalidatePath("/organiser");
  revalidatePath("/events");
  redirect("/organiser");
}

export async function updateEvent(
  eventId: string,
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const user = await requireApprovedOrganiser();

  const existing = await db.event.findUnique({ where: { id: eventId } });
  if (!existing) {
    return { error: "Event not found" };
  }

  if (existing.organiserId !== user.id) {
    return { error: "You are not authorized to update this event." };
  }

  const raw = Object.fromEntries(formData);
  const parsed = eventSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      error: "Please correct the errors in the form.",
      fieldErrors,
    };
  }

  try {
    await db.event.update({
      where: { id: eventId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        cause: parsed.data.cause,
        startsAt: parsed.data.startsAt,
        endsAt: parsed.data.endsAt ?? null,
        address: parsed.data.address,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        capacity: parsed.data.capacity ?? null,
        status: parsed.data.status,
      },
    });
  } catch (err) {
    console.error("Failed to update event:", err);
    return { error: "Failed to update event. Please try again." };
  }

  revalidatePath("/organiser");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  redirect("/organiser");
}

export async function deleteEvent(eventId: string) {
  const user = await requireApprovedOrganiser();

  const existing = await db.event.findUnique({ where: { id: eventId } });
  if (!existing || existing.organiserId !== user.id) {
    throw new Error("Unauthorized: you can only delete your own events.");
  }

  await db.event.delete({ where: { id: eventId } });

  revalidatePath("/organiser");
  revalidatePath("/events");
  redirect("/organiser");
}
