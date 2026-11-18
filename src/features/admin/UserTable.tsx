import { format } from "date-fns";
import type { getUsers } from "./queries";

type User = Awaited<ReturnType<typeof getUsers>>[number];

const roleStyle: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  ORGANISER: "bg-blue-100 text-blue-800",
  USER: "bg-muted text-muted-foreground",
};

export function UserTable({ users, query }: { users: User[]; query?: string }) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {query ? `No users match "${query}".` : "No users yet."}
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th scope="col" className="p-3">Name</th>
            <th scope="col" className="p-3">Email</th>
            <th scope="col" className="p-3">Role</th>
            <th scope="col" className="p-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.name ?? "-"}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${roleStyle[u.role]}`}>{u.role}</span>
                {u.role === "ORGANISER" && (
                  <span className="ml-2 text-xs text-muted-foreground">{u.organiserStatus.toLowerCase()}</span>
                )}
              </td>
              <td className="p-3 text-muted-foreground">{format(u.createdAt, "d MMM yyyy")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
