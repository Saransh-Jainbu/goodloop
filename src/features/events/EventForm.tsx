"use client";

// OWNER: Aditya. Event creation and editing form with sectioned layout and inline error UX.
import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarDays,
  FileText,
  Info,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  submitLabel = "Save Opportunity",
}: {
  event?: Partial<Event>;
  action: (state: EventActionState, formData: FormData) => Promise<EventActionState>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [location, setLocation] = useState<LatLng | null>(
    event?.lat !== undefined && event?.lng !== undefined
      ? { lat: event.lat, lng: event.lng }
      : null
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">{state.error}</p>
            {state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
              <p className="mt-1 text-xs opacity-90">
                Please check the highlighted fields below.
              </p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              1. Basic Information
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Provide a clear title and details about what volunteers will do.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-1">
              Event Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={event?.title ?? ""}
              placeholder="e.g. Community Tree Planting Drive"
              required
              className={state?.fieldErrors?.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state?.fieldErrors?.title && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {state.fieldErrors.title}
              </p>
            )}
          </div>

          {/* Cause */}
          <div className="space-y-2">
            <Label htmlFor="cause" className="flex items-center gap-1">
              Cause Category <span className="text-destructive">*</span>
            </Label>
            <select
              id="cause"
              name="cause"
              defaultValue={event?.cause ?? "COMMUNITY"}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                state?.fieldErrors?.cause ? "border-destructive" : ""
              }`}
            >
              {CAUSES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {state?.fieldErrors?.cause && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {state.fieldErrors.cause}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1">
              Description <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              name="description"
              defaultValue={event?.description ?? ""}
              rows={4}
              maxLength={5000}
              placeholder="Describe the opportunity, activities, requirements, and what volunteers should bring..."
              required
              className={`flex min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                state?.fieldErrors?.description ? "border-destructive" : ""
              }`}
            />
            {state?.fieldErrors?.description && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {state.fieldErrors.description}
              </p>
            )}
            <p className="text-right text-[11px] text-muted-foreground">
              Maximum 5,000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Date & Location */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              2. Date, Time & Location
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Set the event schedule and pinpoint the exact venue on the map.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startsAt" className="flex items-center gap-1">
                Starts At <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                defaultValue={toDateTimeLocalString(event?.startsAt)}
                required
                className={state?.fieldErrors?.startsAt ? "border-destructive" : ""}
              />
              {state?.fieldErrors?.startsAt && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {state.fieldErrors.startsAt}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endsAt">Ends At (Optional)</Label>
              <Input
                id="endsAt"
                name="endsAt"
                type="datetime-local"
                defaultValue={toDateTimeLocalString(event?.endsAt)}
                className={state?.fieldErrors?.endsAt ? "border-destructive" : ""}
              />
              {state?.fieldErrors?.endsAt && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {state.fieldErrors.endsAt}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1">
              Venue / Street Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              defaultValue={event?.address ?? ""}
              placeholder="e.g. Riverside Park, 10 Main Street, Manchester"
              maxLength={200}
              required
              className={state?.fieldErrors?.address ? "border-destructive" : ""}
            />
            {state?.fieldErrors?.address && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {state.fieldErrors.address}
              </p>
            )}
          </div>

          {/* Location Pin */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Pin Exact Location <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              {location
                ? `Selected Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                : "Click on the map below to place a pin for your venue."}
            </p>
            <div className="overflow-hidden rounded-lg border">
              <LocationPicker value={location ?? undefined} onChange={setLocation} />
            </div>
            <input type="hidden" name="lat" value={location?.lat ?? ""} />
            <input type="hidden" name="lng" value={location?.lng ?? ""} />
            {(state?.fieldErrors?.lat || state?.fieldErrors?.lng) && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {state.fieldErrors.lat ?? state.fieldErrors.lng}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Capacity & Visibility */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              3. Capacity & Visibility
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage attendee capacity and publishing status.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
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
              placeholder="e.g. 25 (leave blank for unlimited)"
              className={state?.fieldErrors?.capacity ? "border-destructive" : ""}
            />
            {state?.fieldErrors?.capacity ? (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {state.fieldErrors.capacity}
              </p>
            ) : (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                Volunteers won&apos;t be able to register once this limit is reached.
              </p>
            )}
          </div>

          {/* Status (when editing an existing event) */}
          {event?.id && (
            <div className="space-y-2">
              <Label htmlFor="status">Listing Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={event.status ?? "PUBLISHED"}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  state?.fieldErrors?.status ? "border-destructive" : ""
                }`}
              >
                <option value="PUBLISHED">Published (visible on discovery)</option>
                <option value="DRAFT">Draft (hidden from volunteers)</option>
                <option value="CANCELLED">Cancelled (marked as cancelled)</option>
              </select>
              {state?.fieldErrors?.status && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {state.fieldErrors.status}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/organiser">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
