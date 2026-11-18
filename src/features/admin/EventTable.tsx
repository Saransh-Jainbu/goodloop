import Link from "next/link";
import { Button } from "@/components/ui/button";
import { removeEvent } from "./actions";
import type { getAllEvents } from "./queries";

type AdminEvent = Awaited<ReturnType<typeof getAllEvents>>[number];

export function EventTable({ events }: { events: AdminEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No events have been listed yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Cause</th>
            <th className="p-3">Organiser</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-3">
                <Link href={`/events/${e.id}`} className="text-primary hover:underline">{e.title}</Link>
              </td>
              <td className="p-3">{e.cause}</td>
              <td className="p-3">{e.organiser.name ?? e.organiser.email}</td>
              <td className="p-3">
                <form action={removeEvent.bind(null, e.id)} className="flex justify-end">
                  <Button size="sm" variant="destructive">Remove</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
