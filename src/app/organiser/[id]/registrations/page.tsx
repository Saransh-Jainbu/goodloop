// OWNER: Aditya. View volunteers registered for an event.
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, CalendarDays, Mail, MapPin, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getOrganiserEventById } from "@/features/events/queries";
import { getRegistrationsForEvent } from "@/features/registrations/queries";
import { requireApprovedOrganiser } from "@/lib/session";

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireApprovedOrganiser();
  const { id } = await params;

  const event = await getOrganiserEventById(id, user.id);
  if (!event) notFound();

  const registrations = await getRegistrationsForEvent(event.id);

  return (
    <div className="space-y-6">
      <Link
        href="/organiser"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {event.cause}
          </span>
          <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
          <p className="text-sm text-muted-foreground">
            Volunteer roster and registration details
          </p>
        </div>

        <Link href={`/organiser/${event.id}/edit`}>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Edit Event
          </button>
        </Link>
      </div>

      {/* Event Details Summary */}
      <Card>
        <CardContent className="grid gap-3 pt-6 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            <span>{format(event.startsAt, "EEE d MMM yyyy, h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{event.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              {registrations.length} registered
              {event.capacity ? ` / ${event.capacity} capacity` : " (unlimited)"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      <section aria-labelledby="registrations-heading" className="space-y-4">
        <h2 id="registrations-heading" className="text-lg font-semibold">
          Registered Volunteers ({registrations.length})
        </h2>

        {registrations.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Users className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-2 text-sm">No volunteers have registered for this opportunity yet.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Volunteer</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" aria-hidden />
                        <span>{reg.userName ?? "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                        <span>{reg.userEmail}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {format(reg.createdAt, "dd MMM yyyy, HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
