"use client";
// OWNER: Samaksh. Contract: <RegisterButton eventId={string} />
import { Button } from "@/components/ui/button";

export function RegisterButton({ eventId }: { eventId: string }) {
  return <Button data-event-id={eventId}>Register interest</Button>;
}
