// OWNER: Aditya. Shared contract: everyone imports Event and CAUSES from here.
// Replace with fuller types (or Prisma-derived ones) in the first 2 days.
export const CAUSES = ["ENVIRONMENT", "EDUCATION", "HEALTH", "COMMUNITY", "ANIMALS", "OTHER"] as const;
export type Cause = (typeof CAUSES)[number];

export type Event = {
  id: string;
  title: string;
  description: string;
  cause: Cause;
  startsAt: Date;
  endsAt: Date | null;
  address: string;
  lat: number;
  lng: number;
  capacity: number | null;
  organiserId: string;
};
