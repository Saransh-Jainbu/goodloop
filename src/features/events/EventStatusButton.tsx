"use client";

// OWNER: Aditya. Quick action buttons to publish, unpublish, or cancel events.
import { Button } from "@/components/ui/button";
import { setEventStatus } from "./actions";
import type { EventStatus } from "./types";

export function EventStatusButton({
  eventId,
  currentStatus,
}: {
  eventId: string;
  currentStatus: EventStatus;
}) {
  if (currentStatus === "DRAFT") {
    return (
      <form action={setEventStatus.bind(null, eventId, "PUBLISHED")}>
        <Button
          variant="outline"
          size="sm"
          type="submit"
          className="text-green-700 hover:text-green-800 dark:text-green-400"
        >
          Publish
        </Button>
      </form>
    );
  }

  if (currentStatus === "PUBLISHED") {
    return (
      <div className="flex items-center gap-1.5">
        <form action={setEventStatus.bind(null, eventId, "DRAFT")}>
          <Button variant="outline" size="sm" type="submit">
            Unpublish
          </Button>
        </form>
        <form
          action={setEventStatus.bind(null, eventId, "CANCELLED")}
          onSubmit={(e) => {
            if (
              !confirm(
                "Are you sure you want to cancel this event? It will be marked as cancelled."
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <Button
            variant="outline"
            size="sm"
            type="submit"
            className="text-destructive hover:text-destructive"
          >
            Cancel
          </Button>
        </form>
      </div>
    );
  }

  // CANCELLED
  return (
    <form action={setEventStatus.bind(null, eventId, "DRAFT")}>
      <Button variant="outline" size="sm" type="submit">
        Restore as Draft
      </Button>
    </form>
  );
}
