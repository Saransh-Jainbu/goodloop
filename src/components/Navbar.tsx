import { auth, signOut } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { navLinks } from "@/config/nav";
import { NavMenu } from "@/components/NavMenu";

export async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;
  // Read from the database (not the JWT) so a renamed profile shows straight away.
  const user = session ? await getCurrentUser() : null;

  // Hide links the user can't open; the middleware still enforces access.
  const links = navLinks
    .filter((l) => {
      if (l.href === "/admin") return role === "ADMIN";
      if (l.href === "/organiser") return role === "ORGANISER";
      if (l.href === "/me") return !!session;
      return true;
    })
    .map(({ href, label }) => ({ href, label }));

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <NavMenu
      links={links}
      user={user ? { name: user.name, email: user.email, role: user.role } : null}
      signOutAction={signOutAction}
    />
  );
}
