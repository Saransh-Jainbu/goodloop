"use client";
// OWNER: Anousha. Filter bar bound to URL search params (cause, from, to, location).
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAUSES } from "@/features/events/types";
import { causeLabel } from "./EventCard";

const KEYS = ["cause", "from", "to", "location"] as const;

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [location, setLocation] = useState(params.get("location") ?? "");

  // Keep the text box in sync when params change externally (Clear filters, back button).
  useEffect(() => setLocation(params.get("location") ?? ""), [params]);

  function update(key: (typeof KEYS)[number], value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `/events?${qs}` : "/events");
  }

  const hasFilters = KEYS.some((k) => params.get(k));

  return (
    <form
      className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        update("location", location.trim());
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="cause">Cause</Label>
        <select
          id="cause"
          value={params.get("cause") ?? ""}
          onChange={(e) => update("cause", e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All causes</option>
          {CAUSES.map((c) => (
            <option key={c} value={c}>
              {causeLabel(c)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="from">From</Label>
        <Input id="from" type="date" value={params.get("from") ?? ""} onChange={(e) => update("from", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="to">To</Label>
        <Input id="to" type="date" value={params.get("to") ?? ""} onChange={(e) => update("to", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Leeds"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={() => location.trim() !== (params.get("location") ?? "") && update("location", location.trim())}
        />
      </div>
      <Button type="button" variant="outline" disabled={!hasFilters} onClick={() => router.push("/events")}>
        Clear filters
      </Button>
    </form>
  );
}
