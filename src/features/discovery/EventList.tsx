// OWNER: Anousha. Grid of EventCards with an empty state.
import type { Event } from "@/features/events/types";
import { EventCard } from "./EventCard";

export function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="font-medium">No opportunities match your filters.</p>
        <p className="mt-1 text-sm text-muted-foreground">Try a different cause, date range or location.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <li key={e.id}>
          <EventCard event={e} />
        </li>
      ))}
    </ul>
  );
}
