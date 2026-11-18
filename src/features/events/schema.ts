// OWNER: Aditya. Validation schema for event creation/updates.
import { z } from "zod";
import { CAUSES, EVENT_STATUSES } from "./types";

export const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),
    cause: z.enum(CAUSES, {
      errorMap: () => ({ message: "Please select a valid cause" }),
    }),
    startsAt: z.coerce.date({
      errorMap: () => ({ message: "Please provide a valid start date and time" }),
    }),
    endsAt: z
      .preprocess(
        (val) => (val === "" || val === null || val === undefined ? null : val),
        z.coerce.date().nullable().optional()
      ),
    address: z.string().trim().min(3, "Address is required"),
    lat: z.coerce
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    lng: z.coerce
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    capacity: z
      .preprocess(
        (val) => (val === "" || val === null || val === undefined ? null : val),
        z.coerce.number().int("Capacity must be a whole number").positive("Capacity must be greater than 0").nullable().optional()
      ),
    status: z.enum(EVENT_STATUSES).optional().default("PUBLISHED"),
  })
  .refine(
    (data) => {
      if (data.endsAt && data.startsAt) {
        return data.endsAt >= data.startsAt;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endsAt"],
    }
  );

export type EventInput = z.infer<typeof eventSchema>;

export type EventActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
} | undefined;
