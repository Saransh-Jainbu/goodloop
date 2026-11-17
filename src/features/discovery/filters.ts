// OWNER: Anousha. Parses /events search params into validated EventFilters.
import { z } from "zod";
import { CAUSES } from "@/features/events/types";
import type { EventFilters } from "./queries";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const schema = z.object({
  cause: z.enum(CAUSES).optional().catch(undefined),
  from: date.optional().catch(undefined),
  to: date.optional().catch(undefined),
  location: z.string().trim().max(100).optional().catch(undefined),
});

type RawParams = Record<string, string | string[] | undefined>;

export function parseFilters(params: RawParams): EventFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const parsed = schema.parse({
    cause: first(params.cause),
    from: first(params.from),
    to: first(params.to),
    location: first(params.location),
  });
  return {
    ...parsed,
    location: parsed.location || undefined,
  };
}
