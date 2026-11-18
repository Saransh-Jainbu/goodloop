"use client";
// Contract: <EventsMap events={Event[]} />
// Leaflet needs the browser, so the real map is loaded with next/dynamic (ssr: false).
import dynamic from "next/dynamic";
import type { Event } from "@/features/events/types";

const Inner = dynamic(() => import("./EventsMapInner").then((m) => m.EventsMapInner), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-lg bg-muted sm:h-96" aria-busy="true" />,
});

export function EventsMap({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No events to show on the map.
      </div>
    );
  }
  return <Inner events={events} />;
}
