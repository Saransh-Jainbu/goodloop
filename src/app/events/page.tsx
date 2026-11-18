// OWNER: Anousha. /events: searchable, filterable, paginated list of opportunities.
import { Suspense } from "react";
import { EventList } from "@/features/discovery/EventList";
import { FilterBar } from "@/features/discovery/FilterBar";
import { Pagination } from "@/features/discovery/Pagination";
import { PAGE_SIZE, parseFilters } from "@/features/discovery/filters";
import { getEventPage } from "@/features/discovery/queries";
import { EventsMap } from "@/features/map/EventsMap";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const raw = await searchParams;
  const filters = parseFilters(raw);

  const { events, total, page, pageCount } = await getEventPage(filters, PAGE_SIZE);

  const filtered = Object.keys(filters).some((k) => k !== "page" && filters[k as keyof typeof filters]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Events</h1>
      <Suspense>
        <FilterBar />
      </Suspense>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {total} {total === 1 ? "opportunity" : "opportunities"} found
      </p>
      <EventList events={events} filtered={filtered} />
      <Pagination page={page} pageCount={pageCount} searchParams={raw} />
      {events.length > 0 && <EventsMap events={events} />}
    </div>
  );
}
