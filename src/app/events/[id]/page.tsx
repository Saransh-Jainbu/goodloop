// OWNER: Anousha. /events/[id]: event detail (hero, details sidebar, organiser card).
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, CalendarPlus, Clock, MapPin, Ticket, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CauseBadge, CauseTile } from "@/features/discovery/cause";
import { CopyLinkButton } from "@/features/discovery/CopyLinkButton";
import { getEventDetail } from "@/features/discovery/queries";
import { getSpotsLeft } from "@/features/events/types";
import { EventsMap } from "@/features/map/EventsMap";
import { RegisterButton } from "@/features/registrations/RegisterButton";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getEventDetail(id);
  if (!detail) notFound();

  const { event, organiserName, registrationCount } = detail;
  const spotsLeft = getSpotsLeft(event.capacity, registrationCount);
  const sameDay = event.endsAt && format(event.endsAt, "yyyy-MM-dd") === format(event.startsAt, "yyyy-MM-dd");

  return (
    <article className="space-y-6">
      <Link href="/events" className="text-sm text-muted-foreground hover:underline">
        &larr; All events
      </Link>

      <header className="overflow-hidden rounded-lg border">
        <CauseTile cause={event.cause} className="h-32 sm:h-44" />
        <div className="space-y-2 p-5 sm:p-6">
          <CauseBadge cause={event.cause} />
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">{event.title}</h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column. On mobile it follows the sidebar so the register button is near the top. */}
        <div className="order-last space-y-6 lg:order-none lg:col-span-2">
          <section aria-labelledby="about">
            <h2 id="about" className="mb-2 text-lg font-semibold">
              About this opportunity
            </h2>
            <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
          </section>
          <section aria-labelledby="where">
            <h2 id="where" className="mb-2 text-lg font-semibold">
              Where
            </h2>
            <p className="mb-3 text-sm text-muted-foreground">{event.address}</p>
            <EventsMap events={[event]} />
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{format(event.startsAt, "EEEE d MMMM yyyy")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>
                    {format(event.startsAt, "h:mm a")}
                    {event.endsAt && (sameDay ? ` – ${format(event.endsAt, "h:mm a")}` : ` – ${format(event.endsAt, "d MMM, h:mm a")}`)}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>{event.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>
                    {spotsLeft === null
                      ? "Open to everyone"
                      : spotsLeft === 0
                        ? "No spots left"
                        : `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`}
                  </span>
                </li>
              </ul>
              <RegisterButton eventId={event.id} />
              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button asChild variant="outline" size="sm">
                  <a href={`/events/${event.id}/ics`}>
                    <CalendarPlus className="h-4 w-4" aria-hidden /> Add to calendar
                  </a>
                </Button>
                <CopyLinkButton />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Organised by</p>
                <p className="truncate font-medium">{organiserName ?? "GoodLoop organiser"}</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </article>
  );
}
