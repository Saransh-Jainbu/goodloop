// OWNER: Aditya. Organiser dashboard listing all events owned by current user.
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteEvent } from "@/features/events/actions";
import { getOrganiserEvents } from "@/features/events/queries";
import { requireRole } from "@/lib/session";

export default async function OrganiserPage({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const user = await requireRole("ORGANISER");
  const params = await searchParams;
  const isPending = user.organiserStatus !== "APPROVED" || params.pending === "1";
  const events = isPending ? [] : await getOrganiserEvents(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organiser Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your volunteering opportunities and track volunteer registrations.
          </p>
        </div>

        {!isPending && (
          <Link href="/organiser/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Account Status Banner */}
      {isPending && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-200">
          <h2 className="font-semibold">Account Pending Approval</h2>
          <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-300">
            Your organiser account is currently pending review by an administrator.
            Once approved, you will be able to create listings and manage volunteer events.
          </p>
        </div>
      )}

      {/* Events List */}
      {!isPending && (
        <section aria-labelledby="events-heading" className="space-y-4">
          <h2 id="events-heading" className="text-lg font-semibold">
            My Events ({events.length})
          </h2>

          {events.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                You haven&apos;t created any events yet.
              </p>
              <Link href="/organiser/new" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  Create your first event
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id} className="transition-shadow hover:shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {event.cause}
                      </span>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/events/${event.id}`}
                          className="hover:underline"
                        >
                          {event.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        event.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {event.status}
                    </span>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
                        {format(event.startsAt, "EEE d MMM yyyy, h:mm a")}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">{event.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0" aria-hidden />
                        <span>
                          {event._count.registrations} registered
                          {event.capacity ? ` / ${event.capacity} capacity` : " (no limit)"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
                      <Link href={`/organiser/${event.id}/registrations`}>
                        <Button variant="outline" size="sm">
                          Registrations ({event._count.registrations})
                        </Button>
                      </Link>
                      <Link href={`/organiser/${event.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <form action={deleteEvent.bind(null, event.id)}>
                        <Button variant="destructive" size="sm" type="submit">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
