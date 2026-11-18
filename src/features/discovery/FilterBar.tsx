"use client";
// OWNER: Anousha. Search, filter and sort bar bound to URL search params
// (q, cause, from, to, location, sort). Changing anything resets pagination.
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAUSES } from "@/features/events/types";
import { causeLabel } from "./cause";

const FILTER_KEYS = ["q", "cause", "from", "to", "location", "sort"] as const;
type Key = (typeof FILTER_KEYS)[number];

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");

  // Keep the text boxes in sync when params change externally (Clear filters, back button).
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setLocation(params.get("location") ?? "");
  }, [params]);

  function update(changes: Partial<Record<Key, string>>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/events?${qs}` : "/events");
  }

  const commitText = () => {
    const changes: Partial<Record<Key, string>> = {};
    if (q.trim() !== (params.get("q") ?? "")) changes.q = q.trim();
    if (location.trim() !== (params.get("location") ?? "")) changes.location = location.trim();
    if (Object.keys(changes).length) update(changes);
  };

  const hasFilters = FILTER_KEYS.some((k) => params.get(k));

  return (
    <form
      role="search"
      className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        commitText();
      }}
    >
      <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
        <Label htmlFor="q">Search</Label>
        <Input id="q" type="search" placeholder="Title or description" value={q} onChange={(e) => setQ(e.target.value)} onBlur={commitText} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cause">Cause</Label>
        <select id="cause" value={params.get("cause") ?? ""} onChange={(e) => update({ cause: e.target.value })} className={selectClass}>
          <option value="">All causes</option>
          {CAUSES.map((c) => (
            <option key={c} value={c}>
              {causeLabel(c)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="e.g. Leeds" value={location} onChange={(e) => setLocation(e.target.value)} onBlur={commitText} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="from">From</Label>
        <Input id="from" type="date" value={params.get("from") ?? ""} onChange={(e) => update({ from: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="to">To</Label>
        <Input id="to" type="date" value={params.get("to") ?? ""} onChange={(e) => update({ to: e.target.value })} />
      </div>
      <div className="space-y-1.5 lg:col-span-2">
        <Label htmlFor="sort">Sort by</Label>
        <select id="sort" value={params.get("sort") ?? "soonest"} onChange={(e) => update({ sort: e.target.value === "soonest" ? "" : e.target.value })} className={selectClass}>
          <option value="soonest">Soonest first</option>
          <option value="newest">Newest listings</option>
          <option value="recommended">Recommended</option>
        </select>
      </div>
      <Button type="button" variant="outline" className="lg:col-start-6" disabled={!hasFilters} onClick={() => router.push("/events")}>
        Clear filters
      </Button>
    </form>
  );
}
