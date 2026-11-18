// Contract: <RegisterButton eventId={string} />. A server component: it reads the user's
// state and renders the right control (login link, register, cancel, full, ended).
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cancelRegistration, registerInterest } from "./actions";
import { getRegistrationState } from "./queries";

export async function RegisterButton({ eventId }: { eventId: string }) {
  const s = await getRegistrationState(eventId);
  if (!s) return null;

  const spots =
    s.capacity !== null ? (
      <p className="text-sm text-muted-foreground">
        {s.taken} of {s.capacity} spots taken
      </p>
    ) : null;

  if (s.isOrganiser) {
    return <p className="text-sm text-muted-foreground">You are organising this event.</p>;
  }

  if (s.registered) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            <Check className="h-4 w-4" aria-hidden /> You&apos;re registered
          </span>
          <form action={cancelRegistration.bind(null, eventId)}>
            <Button type="submit" variant="outline" size="sm">Cancel registration</Button>
          </form>
        </div>
        {spots}
      </div>
    );
  }

  if (s.ended) return <p className="text-sm text-muted-foreground">This event has ended.</p>;

  if (!s.signedIn) {
    return (
      <div className="space-y-2">
        <Button asChild>
          <Link href={`/login?callbackUrl=${encodeURIComponent(`/events/${eventId}`)}`}>Log in to register interest</Link>
        </Button>
        {spots}
      </div>
    );
  }

  if (s.full) {
    return (
      <div className="space-y-2">
        <Button disabled>Event full</Button>
        {spots}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form action={registerInterest.bind(null, eventId)}>
        <Button type="submit">Register interest</Button>
      </form>
      {spots}
    </div>
  );
}
