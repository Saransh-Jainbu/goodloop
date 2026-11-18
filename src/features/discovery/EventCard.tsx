// OWNER: Anousha. Card for one event in the list.
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/features/events/types";
import { CauseBadge, CauseTile } from "./cause";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
        <CauseTile cause={event.cause} className="h-24" />
        <CardHeader>
          <CauseBadge cause={event.cause} className="w-fit" />
          <CardTitle as="h2" className="pt-1 text-lg">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            {format(event.startsAt, "EEE d MMM yyyy, h:mm a")}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-1">{event.address}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
