// OWNER: Saransh. FR5 admin panel: stats, approve/reject organisers, remove events, user list.
import { requireRole } from "@/lib/session";
import { getAllEvents, getOrganisers, getStats, getUsers } from "@/features/admin/queries";
import { OrganiserTable } from "@/features/admin/OrganiserTable";
import { EventTable } from "@/features/admin/EventTable";
import { UserTable } from "@/features/admin/UserTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole("ADMIN");
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 100);

  const [organisers, events, stats, users] = await Promise.all([
    getOrganisers(),
    getAllEvents(),
    getStats(),
    getUsers(q),
  ]);
  const pending = organisers.filter((o) => o.organiserStatus === "PENDING").length;

  const cards = [
    { label: "Volunteers", value: stats.users },
    { label: "Organisers", value: stats.organisers },
    { label: "Pending organisers", value: stats.pendingOrganisers, highlight: stats.pendingOrganisers > 0 },
    { label: "Events", value: stats.events },
    { label: "Registrations", value: stats.registrations },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <section aria-label="Platform stats" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} className={c.highlight ? "border-amber-300 bg-amber-50" : undefined}>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Organisers {pending > 0 && <span className="text-sm text-muted-foreground">({pending} pending)</span>}
        </h2>
        <OrganiserTable organisers={organisers} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Events</h2>
        <EventTable events={events} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Users</h2>
        <form method="get" className="flex max-w-md gap-2" role="search">
          <Input name="q" defaultValue={q ?? ""} placeholder="Search by name or email" aria-label="Search users" />
          <Button type="submit" variant="outline">Search</Button>
        </form>
        <UserTable users={users} query={q} />
      </section>
    </div>
  );
}
