// OWNER: Saransh. FR5 admin panel: approve/reject organisers, remove events.
import { requireRole } from "@/lib/session";
import { getAllEvents, getOrganisers } from "@/features/admin/queries";
import { OrganiserTable } from "@/features/admin/OrganiserTable";
import { EventTable } from "@/features/admin/EventTable";

export default async function AdminPage() {
  await requireRole("ADMIN");
  const [organisers, events] = await Promise.all([getOrganisers(), getAllEvents()]);
  const pending = organisers.filter((o) => o.organiserStatus === "PENDING").length;

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Admin</h1>

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
    </div>
  );
}
