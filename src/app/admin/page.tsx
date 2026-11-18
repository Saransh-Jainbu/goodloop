// OWNER: Saransh. FR5 admin panel: approve/reject organisers, remove events.
import { requireRole } from "@/lib/session";

export default async function AdminPage() {
  await requireRole("ADMIN");
  return <h1 className="text-2xl font-semibold">Admin</h1>;
}
