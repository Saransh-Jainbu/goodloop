"use client";

// OWNER: Aditya. Duplicate button for event cloning.
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { duplicateEvent } from "./actions";

export function DuplicateEventButton({ eventId }: { eventId: string }) {
  return (
    <form action={duplicateEvent.bind(null, eventId)}>
      <Button
        variant="outline"
        size="sm"
        type="submit"
        title="Duplicate this event as a draft"
        className="flex items-center gap-1.5"
      >
        <Copy className="h-3.5 w-3.5" />
        Duplicate
      </Button>
    </form>
  );
}
