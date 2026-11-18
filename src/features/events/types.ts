// OWNER: Aditya. Shared contract: everyone imports Event and CAUSES from here.
export const CAUSES = ["ENVIRONMENT", "EDUCATION", "HEALTH", "COMMUNITY", "ANIMALS", "OTHER"] as const;
export type Cause = (typeof CAUSES)[number];

export const EVENT_STATUSES = ["DRAFT", "PUBLISHED", "CANCELLED"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

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
  status?: EventStatus;
  createdAt?: Date;
  organiser?: {
    id?: string;
    name: string | null;
    email: string;
  };
};
