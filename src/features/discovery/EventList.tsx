// OWNER: Anousha. Grid of EventCards with an empty state.
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/features/events/types";
import { EventCard } from "./EventCard";

export function EventList({ events, filtered = false }: { events: Event[]; filtered?: boolean }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed p-10 text-center">
        <SearchX className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="font-medium">{filtered ? "No opportunities match your search." : "No opportunities listed yet."}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered ? "Try a different keyword, cause, date range or location." : "Check back soon: new events are added regularly."}
        </p>
        {filtered && (
          <Button asChild variant="outline" className="mt-4">
            <Link href="/events">Clear filters</Link>
          </Button>
        )}
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
