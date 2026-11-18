import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),
});

// bcrypt only uses the first 72 bytes, so cap the length.
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "At least 8 characters").max(72, "At most 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

export type ProfileState = { error?: string; success?: string; fieldErrors?: Record<string, string> } | undefined;
