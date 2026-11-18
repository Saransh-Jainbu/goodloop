"use client";

// OWNER: Aditya. Client button with delete confirmation prompt.
import { Button } from "@/components/ui/button";
import { deleteEvent } from "./actions";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  return (
    <form
      action={deleteEvent.bind(null, eventId)}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this event? This will also remove all registrations.")) {
          e.preventDefault();
        }
      }}
    >
      <Button variant="destructive" size="sm" type="submit">
        Delete
      </Button>
    </form>
  );
}
