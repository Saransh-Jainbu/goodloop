"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { loginSchema, signupSchema } from "./schema";

export type FormState = { error?: string } | undefined;

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await signIn("credentials", {
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      redirectTo: (formData.get("callbackUrl") as string) || "/",
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Invalid email or password" };
    throw e; // redirects must propagate
  }
}

export async function signupAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, password, accountType } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  if (await db.user.findUnique({ where: { email } })) return { error: "Email already registered" };

  await db.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: accountType, // organisers start PENDING until an admin approves
      organiserStatus: accountType === "ORGANISER" ? "PENDING" : "NONE",
    },
  });

  await signIn("credentials", { email, password, redirectTo: accountType === "ORGANISER" ? "/organiser" : "/events" });
}
