// OWNER: Anousha. /events: filterable list of opportunities.
import { Suspense } from "react";
import { EventList } from "@/features/discovery/EventList";
import { FilterBar } from "@/features/discovery/FilterBar";
import { parseFilters } from "@/features/discovery/filters";
import { getEvents } from "@/features/discovery/queries";
import { EventsMap } from "@/features/map/EventsMap";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const events = await getEvents(filters);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Events</h1>
      <Suspense>
        <FilterBar />
      </Suspense>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {events.length} {events.length === 1 ? "opportunity" : "opportunities"} found
      </p>
      <EventList events={events} />
      <EventsMap events={events} />
    </div>
  );
}
