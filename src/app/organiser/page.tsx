// OWNER: Aditya. Organiser dashboard listing all events owned by current user.
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Lightbulb,
  Mail,
  MapPin,
  Plus,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteEventButton } from "@/features/events/DeleteEventButton";
import { DuplicateEventButton } from "@/features/events/DuplicateEventButton";
import { EventStatusButton } from "@/features/events/EventStatusButton";
import { getOrganiserEvents } from "@/features/events/queries";
import { getSpotsLeft } from "@/features/events/types";
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

      {/* 1. Account Rejected Screen */}
      {isRejected && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">
              Application Not Approved
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Thank you for your interest in leading volunteering opportunities on GoodLoop.
              At this time, your organiser application could not be approved based on our community
              verification criteria.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="mailto:admin@goodloop.test">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </Button>
              </a>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  Browse Volunteer Opportunities
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Account Pending Approval Screen */}
      {isPending && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/10">
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
            <div className="rounded-full bg-amber-100 p-3 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              <Clock className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">
              Organiser Application Under Review
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {params.pending === "1"
                ? "You must be approved by an administrator before creating or publishing listings."
                : "Thank you for registering to organise opportunities! To ensure trust and safety for all volunteers, our community team reviews all organiser accounts. Verification typically takes 1-2 business days."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/events">
                <Button size="sm" className="flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  Explore GoodLoop Events
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Dashboard Stats Cards (for approved organisers) */}
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

      {/* 4. Events Section */}
      {isApproved && (
        <section aria-labelledby="events-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="events-heading" className="text-lg font-semibold">
              My Events ({events.length})
            </h2>
          </div>

          {events.length === 0 ? (
            /* First-event Onboarding Hint */
            <Card className="border-dashed p-8">
              <div className="mx-auto max-w-lg text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Ready to list your first opportunity?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect with eager volunteers across your local community in just a few minutes.
                </p>

                <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                      1. Pick a Cause
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Tag with Environment, Community, or Animals so volunteers find you.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      2. Pin the Venue
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Click the map to place an exact pin so volunteers see distance.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Users className="h-3.5 w-3.5 text-green-600" />
                      3. Set Capacity
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Cap the team size or leave blank for drop-in sessions.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/organiser/new">
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Event
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => {
                const spotsLeft = getSpotsLeft(
                  event.capacity,
                  event._count.registrations
                );

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
                            {event.capacity !== null ? (
                              spotsLeft === 0 ? (
                                <span className="ml-1 font-medium text-destructive">
                                  (Full • 0 spots left)
                                </span>
                              ) : (
                                <span className="ml-1 text-muted-foreground">
                                  / {event.capacity} capacity ({spotsLeft} spots left)
                                </span>
                              )
                            ) : (
                              " (unlimited capacity)"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3">
                        <EventStatusButton
                          eventId={event.id}
                          currentStatus={event.status}
                        />
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
                        <DuplicateEventButton eventId={event.id} />
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
