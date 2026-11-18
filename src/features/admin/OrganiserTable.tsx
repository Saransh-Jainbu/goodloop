import { Button } from "@/components/ui/button";
import { setOrganiserStatus } from "./actions";
import type { getOrganisers } from "./queries";

type Organiser = Awaited<ReturnType<typeof getOrganisers>>[number];

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  NONE: "bg-muted text-muted-foreground",
};

export function OrganiserTable({ organisers }: { organisers: Organiser[] }) {
  if (organisers.length === 0) {
    return <p className="text-sm text-muted-foreground">No organiser accounts yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {organisers.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-3">{o.name ?? "-"}</td>
              <td className="p-3">{o.email}</td>
              <td className="p-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyle[o.organiserStatus]}`}>
                  {o.organiserStatus}
                </span>
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {o.organiserStatus !== "APPROVED" && (
                    <form action={setOrganiserStatus.bind(null, o.id, "APPROVED")}>
                      <Button size="sm">Approve</Button>
                    </form>
                  )}
                  {o.organiserStatus !== "REJECTED" && (
                    <form action={setOrganiserStatus.bind(null, o.id, "REJECTED")}>
                      <Button size="sm" variant="outline">Reject</Button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
