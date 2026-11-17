// OWNER: Anousha. Local fake data shaped like the `Event` type.
// Used until the Event Prisma model (Aditya) has the full set of fields.
import type { Event } from "@/features/events/types";

const day = 24 * 60 * 60 * 1000;
const inDays = (n: number, hour = 10) => {
  const d = new Date(Date.now() + n * day);
  d.setHours(hour, 0, 0, 0);
  return d;
};

export const FAKE_EVENTS: Event[] = [
  {
    id: "fake-1",
    title: "Riverside Clean-up",
    description: "Help us clear litter along the river path. Gloves and bags provided.",
    cause: "ENVIRONMENT",
    startsAt: inDays(3),
    endsAt: inDays(3, 13),
    address: "Riverside Park, Manchester",
    lat: 53.4808,
    lng: -2.2426,
    capacity: 40,
    organiserId: "org-1",
  },
  {
    id: "fake-2",
    title: "Homework Club Helpers",
    description: "Support primary school children with reading and maths after school.",
    cause: "EDUCATION",
    startsAt: inDays(5, 16),
    endsAt: inDays(5, 18),
    address: "Hillside Primary School, Leeds",
    lat: 53.8008,
    lng: -1.5491,
    capacity: 12,
    organiserId: "org-2",
  },
  {
    id: "fake-3",
    title: "Community Food Bank Sorting",
    description: "Sort and pack donated food for local families.",
    cause: "COMMUNITY",
    startsAt: inDays(8, 9),
    endsAt: null,
    address: "Town Hall, Sheffield",
    lat: 53.3811,
    lng: -1.4701,
    capacity: null,
    organiserId: "org-3",
  },
  {
    id: "fake-4",
    title: "Dog Shelter Walk-a-thon",
    description: "Walk shelter dogs and help with kennel care for the day.",
    cause: "ANIMALS",
    startsAt: inDays(12, 11),
    endsAt: inDays(12, 15),
    address: "Paws Rescue Centre, Manchester",
    lat: 53.4631,
    lng: -2.2913,
    capacity: 20,
    organiserId: "org-1",
  },
  {
    id: "fake-5",
    title: "Health Check Day Support",
    description: "Assist nurses with registration and wayfinding at a free health check day.",
    cause: "HEALTH",
    startsAt: inDays(20, 9),
    endsAt: inDays(20, 16),
    address: "Central Library, Leeds",
    lat: 53.7997,
    lng: -1.5436,
    capacity: 15,
    organiserId: "org-2",
  },
];
