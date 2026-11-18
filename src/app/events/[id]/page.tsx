// OWNER: Anousha. /events/[id]: event detail.
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, MapPin, User } from "lucide-react";
import { causeLabel } from "@/features/discovery/EventCard";
import { getEventById } from "@/features/discovery/queries";
import { EventsMap } from "@/features/map/EventsMap";
import { RegisterButton } from "@/features/registrations/RegisterButton";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <article className="space-y-6">
      <Link href="/events" className="text-sm text-muted-foreground hover:underline">
        &larr; All events
      </Link>
      <header className="space-y-2">
        <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {causeLabel(event.cause)}
        </span>
        <h1 className="text-2xl font-semibold">{event.title}</h1>
      </header>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          {format(event.startsAt, "EEEE d MMMM yyyy, h:mm a")}
          {event.endsAt ? ` – ${format(event.endsAt, "h:mm a")}` : ""}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {event.address}
        </li>
        {/* TODO: show organiser name once the Event query includes it (needs Aditya's Event model). */}
        <li className="flex items-center gap-2">
          <User className="h-4 w-4 shrink-0" aria-hidden />
          Organiser: {event.organiserId}
        </li>
      </ul>
      <p className="whitespace-pre-line">{event.description}</p>
      <RegisterButton eventId={event.id} />
      <EventsMap events={[event]} />
    </article>
  );
}
