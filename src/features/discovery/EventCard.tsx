// OWNER: Anousha. Card for one event in the list.
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/features/events/types";

export const causeLabel = (cause: string) => cause.charAt(0) + cause.slice(1).toLowerCase();

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {causeLabel(event.cause)}
          </span>
          <CardTitle className="pt-1">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            {format(event.startsAt, "EEE d MMM yyyy, h:mm a")}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            {event.address}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
