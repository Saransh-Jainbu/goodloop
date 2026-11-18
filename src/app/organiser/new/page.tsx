// OWNER: Aditya. Page to create a new event.
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEvent } from "@/features/events/actions";
import { EventForm } from "@/features/events/EventForm";
import { requireApprovedOrganiser } from "@/lib/session";

export default async function NewEventPage() {
  await requireApprovedOrganiser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/organiser"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New Opportunity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to list a new volunteering opportunity.
          </p>
        </CardHeader>
        <CardContent>
          <EventForm action={createEvent} submitLabel="Create Opportunity" />
        </CardContent>
      </Card>
    </div>
  );
}
