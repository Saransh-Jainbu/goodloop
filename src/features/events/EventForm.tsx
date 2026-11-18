"use client";

// OWNER: Aditya. Event creation and editing form.
import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker, type LatLng } from "@/features/map/LocationPicker";
import { CAUSES, type Event } from "./types";
import type { EventActionState } from "./schema";

function toDateTimeLocalString(date?: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({
  event,
  action,
  submitLabel = "Save Event",
}: {
  event?: Partial<Event>;
  action: (state: EventActionState, formData: FormData) => Promise<EventActionState>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // Start with no default pin on new events; require organiser to select location
  const [location, setLocation] = useState<LatLng | null>(
    event?.lat !== undefined && event?.lng !== undefined
      ? { lat: event.lat, lng: event.lng }
      : null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={event?.title ?? ""}
          placeholder="e.g. Community Tree Planting"
          required
        />
        {state?.fieldErrors?.title && (
          <p className="text-xs text-destructive">{state.fieldErrors.title}</p>
        )}
      </div>

      {/* Cause */}
      <div className="space-y-2">
        <Label htmlFor="cause">Cause *</Label>
        <select
          id="cause"
          name="cause"
          defaultValue={event?.cause ?? "COMMUNITY"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {CAUSES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0) + c.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        {state?.fieldErrors?.cause && (
          <p className="text-xs text-destructive">{state.fieldErrors.cause}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={event?.description ?? ""}
          rows={4}
          maxLength={5000}
          placeholder="Describe the opportunity, what volunteers will do, and what to bring..."
          required
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state?.fieldErrors?.description && (
          <p className="text-xs text-destructive">{state.fieldErrors.description}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Starts At *</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocalString(event?.startsAt)}
            required
          />
          {state?.fieldErrors?.startsAt && (
            <p className="text-xs text-destructive">{state.fieldErrors.startsAt}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endsAt">Ends At (Optional)</Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toDateTimeLocalString(event?.endsAt)}
          />
          {state?.fieldErrors?.endsAt && (
            <p className="text-xs text-destructive">{state.fieldErrors.endsAt}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address / Venue *</Label>
        <Input
          id="address"
          name="address"
          defaultValue={event?.address ?? ""}
          placeholder="e.g. Central Library, 10 Main Street"
          maxLength={200}
          required
        />
        {state?.fieldErrors?.address && (
          <p className="text-xs text-destructive">{state.fieldErrors.address}</p>
        )}
      </div>

      {/* Map Coordinates */}
      <div className="space-y-2">
        <Label>Pin Location *</Label>
        <p className="text-xs text-muted-foreground">
          {location
            ? `Selected coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            : "Click on the map to set the event location pin"}
        </p>
        <LocationPicker value={location ?? undefined} onChange={setLocation} />
        <input type="hidden" name="lat" value={location?.lat ?? ""} />
        <input type="hidden" name="lng" value={location?.lng ?? ""} />
        {(state?.fieldErrors?.lat || state?.fieldErrors?.lng) && (
          <p className="text-xs text-destructive">
            {state.fieldErrors.lat ?? state.fieldErrors.lng}
          </p>
        )}
      </div>

      {/* Capacity */}
      <div className="space-y-2">
        <Label htmlFor="capacity">Volunteer Capacity (Optional)</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          max={100000}
          defaultValue={event?.capacity ?? ""}
          placeholder="Leave blank for unlimited"
        />
        {state?.fieldErrors?.capacity && (
          <p className="text-xs text-destructive">{state.fieldErrors.capacity}</p>
        )}
      </div>

      {/* Status (for existing events) */}
      {event?.id && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={event.status ?? "PUBLISHED"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="PUBLISHED">Published (visible to volunteers)</option>
            <option value="DRAFT">Draft (hidden from discovery)</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {state?.fieldErrors?.status && (
            <p className="text-xs text-destructive">{state.fieldErrors.status}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link href="/organiser">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
