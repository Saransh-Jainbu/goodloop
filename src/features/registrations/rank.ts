// Contract: rankEvents(events, user). Lightweight relevance ordering for the event list.
// Pure and deterministic (no database access), so it is easy to test. See getRankUser() in
// queries.ts for building the `user` argument from the signed-in user.
import type { Cause, Event } from "@/features/events/types";

export type RankUser = {
  /** How many events the user has registered for, per cause. */
  causeCounts?: Partial<Record<Cause, number>>;
  /** Events the user is already registered for (pushed to the end of the list). */
  registeredEventIds?: ReadonlySet<string>;
  /** Optional: prefer events close to this point. */
  location?: { lat: number; lng: number };
};

// Weights add up to 1 when a location is known. Without one, the other two are rescaled.
const W_CAUSE = 0.4;
const W_DATE = 0.4;
const W_DISTANCE = 0.2;
const DAY = 24 * 60 * 60 * 1000;

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Higher is more relevant. Events that have already ended score 0. */
export function scoreEvent(event: Event, user: RankUser, now: Date = new Date()): number {
  if ((event.endsAt ?? event.startsAt) < now) return 0;

  const counts = user.causeCounts ?? {};
  const max = Math.max(0, ...Object.values(counts).map((n) => n ?? 0));
  const cause = max > 0 ? (counts[event.cause] ?? 0) / max : 0;

  // Sooner is better: 1 today, 0.5 in a week, 0.25 in three weeks, and so on.
  const days = Math.max(0, (event.startsAt.getTime() - now.getTime()) / DAY);
  const date = 1 / (1 + days / 7);

  if (!user.location) return (cause * W_CAUSE + date * W_DATE) / (W_CAUSE + W_DATE);

  const near = 1 / (1 + distanceKm(user.location, { lat: event.lat, lng: event.lng }) / 10);
  return cause * W_CAUSE + date * W_DATE + near * W_DISTANCE;
}

/**
 * Orders events by relevance. Without a user it is simply soonest first.
 * Events the user is already registered for go last. Does not mutate its input.
 */
export function rankEvents(events: readonly Event[], user: RankUser | null, now: Date = new Date()): Event[] {
  const registered = user?.registeredEventIds;
  const scored = events.map((event) => ({
    event,
    registered: registered?.has(event.id) ?? false,
    score: user ? scoreEvent(event, user, now) : 0,
  }));

  return scored
    .sort(
      (a, b) =>
        Number(a.registered) - Number(b.registered) || // not-yet-registered first
        b.score - a.score || // most relevant first
        a.event.startsAt.getTime() - b.event.startsAt.getTime() || // then soonest
        a.event.id.localeCompare(b.event.id), // fully deterministic
    )
    .map((x) => x.event);
}
