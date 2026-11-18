// OWNER: Aditya. Page to edit an existing event.
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEvent } from "@/features/events/actions";
import { EventForm } from "@/features/events/EventForm";
import { getOrganiserEventById } from "@/features/events/queries";
import { requireApprovedOrganiser } from "@/lib/session";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireApprovedOrganiser();
  const { id } = await params;

  const event = await getOrganiserEventById(id, user.id);
  if (!event) notFound();

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
          <CardTitle as="h1" className="text-xl">Edit Opportunity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update the details for &ldquo;{event.title}&rdquo;.
          </p>
        </CardHeader>
        <CardContent>
          <EventForm
            event={event}
            action={updateEvent.bind(null, event.id)}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
