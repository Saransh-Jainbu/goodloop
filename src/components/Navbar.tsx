import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { navLinks } from "@/config/nav";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  // Hide links the user can't open; the middleware still enforces access.
  const links = navLinks.filter((l) => {
    if (l.href === "/admin") return role === "ADMIN";
    if (l.href === "/organiser") return role === "ORGANISER";
    if (l.href === "/me") return !!session;
    return true;
  });

  return (
    <header className="border-b">
      <nav className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-primary">GoodLoop</Link>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>
        {session ? (
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <Button variant="outline" size="sm" type="submit">Sign out</Button>
          </form>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild><Link href="/login">Log in</Link></Button>
            <Button size="sm" asChild><Link href="/signup">Sign up</Link></Button>
          </div>
        )}
      </nav>
    </header>
  );
}
