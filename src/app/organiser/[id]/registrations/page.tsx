// OWNER: Aditya. View volunteers registered for an event with CSV export and decline management.
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Mail,
  MapPin,
  Share2,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeclineRegistrationButton } from "@/features/events/DeclineRegistrationButton";
import { ExportCsvButton } from "@/features/events/ExportCsvButton";
import { getOrganiserEventById } from "@/features/events/queries";
import { getSpotsLeft } from "@/features/events/types";
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
  const spotsLeft = getSpotsLeft(event.capacity, registrations.length);

  return (
    <div className="space-y-6">
      <Link
        href="/organiser"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {event.cause}
          </span>
          <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
          <p className="text-sm text-muted-foreground">
            Volunteer roster and registration management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportCsvButton
            eventTitle={event.title}
            registrations={registrations}
          />
          <Link href={`/events/${event.id}`} target="_blank">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Public View
            </Button>
          </Link>
          <Link href={`/organiser/${event.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit Event
            </Button>
          </Link>
        </div>
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
              {event.capacity !== null ? (
                spotsLeft === 0 ? (
                  <span className="ml-1 font-semibold text-destructive">
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
        </CardContent>
      </Card>

      {/* Registrations List */}
      <section aria-labelledby="registrations-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="registrations-heading" className="text-lg font-semibold">
            Registered Volunteers ({registrations.length})
          </h2>
        </div>

        {registrations.length === 0 ? (
          <Card className="p-10 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-base font-semibold">No volunteers registered yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Volunteers who sign up for this opportunity will appear here in your roster.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href={`/events/${event.id}`} target="_blank">
                <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5" />
                  View Public Listing
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Volunteer</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Registered On</th>
                  <th className="p-3 text-right">Actions</th>
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
                    <td className="p-3 text-muted-foreground">
                      {format(reg.createdAt, "dd MMM yyyy, HH:mm")}
                    </td>
                    <td className="p-3 text-right">
                      <DeclineRegistrationButton
                        eventId={event.id}
                        registrationId={reg.id}
                        volunteerName={reg.userName}
                      />
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
