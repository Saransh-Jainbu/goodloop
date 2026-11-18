// /me: the signed-in user's registrations, with the option to cancel upcoming ones.
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cancelRegistration } from "@/features/registrations/actions";
import { getMyRegistrations } from "@/features/registrations/queries";
import { getCurrentUser } from "@/lib/session";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/me");

  const registrations = await getMyRegistrations();
  const now = new Date();
  const ended = (r: (typeof registrations)[number]) => (r.event.endsAt ?? r.event.startsAt) < now;
  const upcoming = registrations.filter((r) => !ended(r));
  const past = registrations.filter(ended);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">My registrations</h1>
        <p className="text-sm text-muted-foreground">Events you have registered interest in.</p>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">You haven&apos;t registered for anything yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">Find an opportunity near you and say you&apos;re in.</p>
          <Button asChild className="mt-4"><Link href="/events">Browse events</Link></Button>
        </div>
      ) : (
        <>
          <Section title={`Upcoming (${upcoming.length})`} empty="No upcoming events.">
            {upcoming.map((r) => (
              <Item key={r.id} r={r} cancellable />
            ))}
          </Section>
          {past.length > 0 && (
            <Section title={`Past (${past.length})`}>
              {past.map((r) => (
                <Item key={r.id} r={r} />
              ))}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({ title, empty, children }: { title: string; empty?: string; children: React.ReactNode[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children.length === 0 && empty ? <p className="text-sm text-muted-foreground">{empty}</p> : <ul className="grid gap-3">{children}</ul>}
    </section>
  );
}

function Item({ r, cancellable = false }: { r: Awaited<ReturnType<typeof getMyRegistrations>>[number]; cancellable?: boolean }) {
  const e = r.event;
  return (
    <li>
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Link href={`/events/${e.id}`} className="font-semibold hover:underline">{e.title}</Link>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
              {format(e.startsAt, "EEE d MMM yyyy, h:mm a")}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {e.address}
            </p>
            {e.status === "CANCELLED" && <p className="text-sm font-medium text-destructive">This event was cancelled.</p>}
          </div>
          {cancellable && (
            <form action={cancelRegistration.bind(null, e.id)}>
              <Button type="submit" variant="outline" size="sm">Cancel registration</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </li>
  );
}
