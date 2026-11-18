// OWNER: Anousha. Parses /events search params into validated EventFilters.
import { z } from "zod";
import { CAUSES } from "@/features/events/types";
import type { EventFilters } from "./queries";

export const PAGE_SIZE = 9;

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const schema = z.object({
  cause: z.enum(CAUSES).optional().catch(undefined),
  from: date.optional().catch(undefined),
  to: date.optional().catch(undefined),
  location: z.string().trim().max(100).optional().catch(undefined),
  q: z.string().trim().max(100).optional().catch(undefined),
  sort: z.enum(["soonest", "newest"]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(1000).optional().catch(undefined),
});

type RawParams = Record<string, string | string[] | undefined>;

export function parseFilters(params: RawParams): EventFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const parsed = schema.parse({
    cause: first(params.cause),
    from: first(params.from),
    to: first(params.to),
    location: first(params.location),
    q: first(params.q),
    sort: first(params.sort),
    page: first(params.page),
  });
  return {
    ...parsed,
    location: parsed.location || undefined,
    q: parsed.q || undefined,
  };
}
