// Unit tests for getEventPage. The database and session are mocked: no real DB access.
import { beforeEach, describe, expect, it, vi } from "vitest";

const DAY = 24 * 60 * 60 * 1000;
const mk = (id: string, cause: string, days: number) => ({
  id,
  cause,
  startsAt: new Date(Date.now() + days * DAY),
  endsAt: null,
  lat: 0,
  lng: 0,
});
const rows = [mk("a", "HEALTH", 1), mk("b", "ENVIRONMENT", 2), mk("c", "ENVIRONMENT", 3), mk("d", "HEALTH", 4)];

const findMany = vi.fn<(args?: unknown) => Promise<typeof rows>>();
vi.mock("@/lib/db", () => ({
  db: { event: { findMany: (args?: unknown) => findMany(args), count: async () => rows.length } },
}));
const getRankUser = vi.fn();
vi.mock("@/features/registrations/queries", () => ({ getRankUser: () => getRankUser() }));

import { RECOMMENDED_CAP, getEventPage } from "./queries";

const ids = (r: { events: { id: string }[] }) => r.events.map((e) => e.id);

beforeEach(() => {
  findMany.mockReset();
  findMany.mockResolvedValue(rows);
  getRankUser.mockReset();
});

describe("getEventPage with sort=recommended", () => {
  it("signed out: soonest order and needsLogin", async () => {
    getRankUser.mockResolvedValue(null);
    const r = await getEventPage({ sort: "recommended" }, 9);
    expect(ids(r)).toEqual(["a", "b", "c", "d"]);
    expect(r.needsLogin).toBe(true);
  });

  it("signed in: favourite cause first, already-registered last", async () => {
    getRankUser.mockResolvedValue({ causeCounts: { ENVIRONMENT: 3 }, registeredEventIds: new Set(["b"]) });
    const r = await getEventPage({ sort: "recommended" }, 9);
    expect(ids(r)).toEqual(["c", "a", "d", "b"]);
    expect(r.needsLogin).toBe(false);
  });

  it("paginates after ranking", async () => {
    getRankUser.mockResolvedValue({ causeCounts: { ENVIRONMENT: 3 }, registeredEventIds: new Set(["b"]) });
    const r = await getEventPage({ sort: "recommended", page: 2 }, 2);
    expect(ids(r)).toEqual(["d", "b"]);
    expect(r.pageCount).toBe(2);
  });

  it("caps how many events are loaded for ranking", async () => {
    getRankUser.mockResolvedValue(null);
    await getEventPage({ sort: "recommended" }, 9);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ take: RECOMMENDED_CAP, skip: 0 }));
  });
});

describe("getEventPage with other sorts", () => {
  it("clamps an out-of-range page and does not look up the user", async () => {
    const r = await getEventPage({ page: 99 }, 2);
    expect(r.page).toBe(2);
    expect(r.needsLogin).toBe(false);
    expect(getRankUser).not.toHaveBeenCalled();
  });
});
