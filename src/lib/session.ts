import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/** Returns the signed-in user (fresh from DB) or null. */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return db.user.findUnique({ where: { id: session.user.id } });
}

/** Use in server components / actions. Redirects to /login if not allowed. */
export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== role) redirect("/");
  return user;
}

/** Organisers must be approved by an admin before creating listings. */
export async function requireApprovedOrganiser() {
  const user = await requireRole("ORGANISER");
  if (user.organiserStatus !== "APPROVED") redirect("/organiser?pending=1");
  return user;
}
