"use client";
// OWNER: Samaksh. Contract: <EventsMap events={Event[]} />
// Real version must be loaded with next/dynamic({ ssr: false }) by a client wrapper,
// and import "leaflet/dist/leaflet.css".
import type { Event } from "@/features/events/types";

export function EventsMap({ events }: { events: Event[] }) {
  return (
    <div className="flex h-80 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
      Map placeholder ({events.length} events)
    </div>
  );
}
