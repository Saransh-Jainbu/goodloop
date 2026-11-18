"use client";

// OWNER: Aditya. Button to decline/remove a registered volunteer from an event.
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { declineRegistration } from "./actions";

export function DeclineRegistrationButton({
  eventId,
  registrationId,
  volunteerName,
}: {
  eventId: string;
  registrationId: string;
  volunteerName?: string | null;
}) {
  return (
    <form
      action={declineRegistration.bind(null, eventId, registrationId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `Are you sure you want to remove ${
              volunteerName ?? "this volunteer"
            } from the registration roster?`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <UserX className="mr-1 h-3.5 w-3.5" />
        Decline
      </Button>
    </form>
  );
}
