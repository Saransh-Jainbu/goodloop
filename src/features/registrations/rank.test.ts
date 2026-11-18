import { describe, expect, it } from "vitest";
import type { Event } from "@/features/events/types";
import { rankEvents, scoreEvent, type RankUser } from "./rank";

const NOW = new Date("2026-06-01T09:00:00Z");
const day = 24 * 60 * 60 * 1000;

function ev(id: string, over: Partial<Event> = {}): Event {
  return {
    id,
    title: id,
    description: "test",
    cause: "COMMUNITY",
    startsAt: new Date(NOW.getTime() + 3 * day),
    endsAt: null,
    address: "Somewhere",
    lat: 28.61,
    lng: 77.2,
    capacity: null,
    organiserId: "org",
    ...over,
  };
}
const ids = (list: Event[]) => list.map((e) => e.id);
const inDays = (n: number) => new Date(NOW.getTime() + n * day);

describe("rankEvents", () => {
  it("with no user, orders soonest first", () => {
    const list = [ev("later", { startsAt: inDays(10) }), ev("soon", { startsAt: inDays(1) }), ev("mid", { startsAt: inDays(5) })];
    expect(ids(rankEvents(list, null, NOW))).toEqual(["soon", "mid", "later"]);
  });

  it("returns an empty list for no events", () => {
    expect(rankEvents([], { causeCounts: { HEALTH: 2 } }, NOW)).toEqual([]);
  });

  it("boosts causes the user has registered for before", () => {
    const user: RankUser = { causeCounts: { HEALTH: 3, ANIMALS: 1 } };
    const list = [
      ev("env", { cause: "ENVIRONMENT", startsAt: inDays(2) }),
      ev("health", { cause: "HEALTH", startsAt: inDays(4) }),
    ];
    expect(ids(rankEvents(list, user, NOW))).toEqual(["health", "env"]);
  });

  it("prefers a closer date when causes tie", () => {
    const user: RankUser = { causeCounts: { HEALTH: 1 } };
    const list = [ev("far", { cause: "HEALTH", startsAt: inDays(20) }), ev("near", { cause: "HEALTH", startsAt: inDays(2) })];
    expect(ids(rankEvents(list, user, NOW))).toEqual(["near", "far"]);
  });

  it("puts events the user is already registered for last", () => {
    const user: RankUser = { causeCounts: { COMMUNITY: 5 }, registeredEventIds: new Set(["mine"]) };
    const list = [ev("mine", { startsAt: inDays(1) }), ev("other", { startsAt: inDays(9) })];
    expect(ids(rankEvents(list, user, NOW))).toEqual(["other", "mine"]);
  });

  it("scores events that have already ended as 0 and ranks them after upcoming ones", () => {
    const past = ev("past", { startsAt: inDays(-3), endsAt: inDays(-3) });
    const upcoming = ev("up", { startsAt: inDays(30) });
    expect(scoreEvent(past, {}, NOW)).toBe(0);
    expect(ids(rankEvents([past, upcoming], {}, NOW))).toEqual(["up", "past"]);
  });

  it("uses distance when the user has a location", () => {
    const user: RankUser = { location: { lat: 28.6139, lng: 77.209 } }; // Delhi
    const list = [
      ev("mumbai", { lat: 19.076, lng: 72.8777, startsAt: inDays(3) }),
      ev("delhi", { lat: 28.62, lng: 77.21, startsAt: inDays(3) }),
    ];
    expect(ids(rankEvents(list, user, NOW))).toEqual(["delhi", "mumbai"]);
  });

  it("scores are within 0 and 1", () => {
    const user: RankUser = { causeCounts: { HEALTH: 4 }, location: { lat: 28.6, lng: 77.2 } };
    for (const e of [ev("a"), ev("b", { cause: "HEALTH", startsAt: NOW }), ev("c", { startsAt: inDays(400) })]) {
      const s = scoreEvent(e, user, NOW);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(1);
    }
  });

  it("is deterministic when everything ties (falls back to id)", () => {
    const same = inDays(3);
    const list = [ev("b", { startsAt: same }), ev("c", { startsAt: same }), ev("a", { startsAt: same })];
    expect(ids(rankEvents(list, {}, NOW))).toEqual(["a", "b", "c"]);
    expect(ids(rankEvents([...list].reverse(), {}, NOW))).toEqual(["a", "b", "c"]);
  });

  it("does not mutate its input", () => {
    const list = [ev("later", { startsAt: inDays(10) }), ev("soon", { startsAt: inDays(1) })];
    const copy = [...list];
    rankEvents(list, null, NOW);
    expect(list).toEqual(copy);
  });
});
