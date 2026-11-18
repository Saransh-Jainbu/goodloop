// OWNER: Anousha. GET /events/[id]/ics: downloads a calendar file for a published event.
import { buildIcs } from "@/features/discovery/ics";
import { getEventById } from "@/features/discovery/queries";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return new Response("Event not found", { status: 404 });

  const url = new URL(`/events/${event.id}`, req.url).toString();
  const filename = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "event";

  return new Response(buildIcs(event, url), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.ics"`,
    },
  });
}
