// OWNER: Aditya. Organiser dashboard listing all events owned by current user.
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  Plus,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteEventButton } from "@/features/events/DeleteEventButton";
import { getOrganiserEvents } from "@/features/events/queries";
import { requireRole } from "@/lib/session";

export default async function OrganiserPage({
  searchParams,
}: {
  searchParams: Promise<{ pending?: string }>;
}) {
  const user = await requireRole("ORGANISER");
  const params = await searchParams;

  const isApproved = user.organiserStatus === "APPROVED";
  const isRejected = user.organiserStatus === "REJECTED";
  const isPending = !isApproved && !isRejected;

  const events = isApproved ? await getOrganiserEvents(user.id) : [];

  const totalEvents = events.length;
  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length;
  const draftCount = events.filter((e) => e.status === "DRAFT").length;
  const totalRegistrations = events.reduce(
    (sum, e) => sum + e._count.registrations,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organiser Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your volunteering opportunities and track volunteer registrations.
          </p>
        </div>

        {isApproved && (
          <Link href="/organiser/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Account Rejected Banner */}
      {isRejected && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h2 className="font-semibold">Account Application Rejected</h2>
            <p className="mt-1 text-sm">
              Your organiser account has been reviewed and rejected by an administrator.
              You cannot list or manage events at this time.
            </p>
          </div>
        </div>
      )}

      {/* Account Pending Approval Banner */}
      {isPending && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-950/20 dark:text-yellow-200">
          <h2 className="font-semibold">Account Pending Approval</h2>
          <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-300">
            {params.pending === "1"
              ? "You must be approved by an administrator before creating or managing listings."
              : "Your organiser account is currently pending review by an administrator. Once approved, you will be able to create listings and manage volunteer events."}
          </p>
        </div>
      )}

      {/* Dashboard Stats Cards */}
      {isApproved && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">Opportunities listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCount}</div>
              <p className="text-xs text-muted-foreground">Live on discovery page</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registrations</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">Total signups across events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground">Not yet visible to public</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Events List */}
      {isApproved && (
        <section aria-labelledby="events-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="events-heading" className="text-lg font-semibold">
              My Events ({events.length})
            </h2>
          </div>

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
              {events.map((event) => {
                const spotsLeft =
                  event.capacity !== null
                    ? Math.max(0, event.capacity - event._count.registrations)
                    : null;

                return (
                  <Card
                    key={event.id}
                    className="transition-shadow hover:shadow-sm"
                  >
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

                      {/* Status Chip */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200 dark:border-green-800"
                            : event.status === "CANCELLED"
                              ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                              : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            event.status === "PUBLISHED"
                              ? "bg-green-600 dark:bg-green-400"
                              : event.status === "CANCELLED"
                                ? "bg-red-600 dark:bg-red-400"
                                : "bg-muted-foreground"
                          }`}
                        />
                        {event.status}
                      </span>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            className="h-4 w-4 shrink-0"
                            aria-hidden
                          />
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
                            {event.capacity
                              ? ` / ${event.capacity} capacity (${spotsLeft} left)`
                              : " (unlimited)"}
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
                        <DeleteEventButton eventId={event.id} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
