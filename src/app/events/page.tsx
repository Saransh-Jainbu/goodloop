// OWNER: Anousha. /events: searchable, filterable, paginated list of opportunities.
import Link from "next/link";
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

  const { events, total, page, pageCount, needsLogin } = await getEventPage(filters, PAGE_SIZE);

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
      {needsLogin && (
        <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
          <Link href="/login?callbackUrl=%2Fevents%3Fsort%3Drecommended" className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>{" "}
          to get recommendations based on your past volunteering. Showing soonest first for now.
        </p>
      )}
      <EventList events={events} filtered={filtered} />
      <Pagination page={page} pageCount={pageCount} searchParams={raw} />
      {events.length > 0 && <EventsMap events={events} />}
    </div>
  );
}
