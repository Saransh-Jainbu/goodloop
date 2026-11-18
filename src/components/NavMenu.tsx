"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

type NavUser = { name: string | null; email: string; role: "USER" | "ORGANISER" | "ADMIN" };
type NavLink = { href: string; label: string };

const roleLabel = { USER: "Volunteer", ORGANISER: "Organiser", ADMIN: "Admin" } as const;
const roleVariant = { USER: "secondary", ORGANISER: "default", ADMIN: "warning" } as const;

function initials(u: NavUser) {
  const src = (u.name ?? u.email).trim();
  const parts = src.split(/\s+/);
  return ((parts[0]?.[0] ?? "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function NavMenu({
  links,
  user,
  signOutAction,
}: {
  links: NavLink[];
  user: NavUser | null;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus when the page changes, on Escape, and on a click outside the user menu.
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setUserOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href: string) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive(href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <nav aria-label="Main" className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="GoodLoop home" className="rounded-lg transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative hidden md:block" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen((o) => !o)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border bg-background/70 py-1 pl-1 pr-2.5 shadow-sm transition-all hover:border-primary/40 hover:shadow"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(user)}
                </span>
                <span className="max-w-[8rem] truncate text-sm font-medium">{user.name ?? user.email}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", userOpen && "rotate-180")} />
              </button>
              {userOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 origin-top-right animate-menu-in rounded-xl border bg-card p-2 shadow-xl motion-reduce:animate-none"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user.name ?? "Your account"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <Badge variant={roleVariant[user.role]} className="mt-2">{roleLabel[user.role]}</Badge>
                  </div>
                  <div className="my-1 border-t" />
                  <Link
                    href="/me/profile"
                    role="menuitem"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <UserIcon className="h-4 w-4" /> Profile
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild><Link href="/login">Log in</Link></Button>
              <Button size="sm" asChild><Link href="/signup">Sign up</Link></Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? "mobile-menu" : undefined}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background/70 transition-colors hover:bg-accent md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="animate-menu-in border-t bg-background/95 backdrop-blur-md motion-reduce:animate-none md:hidden">
          <div className="container space-y-1 py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={cn("block", linkClass(l.href))}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t pt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-1">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {initials(user)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name ?? user.email}</p>
                      <Badge variant={roleVariant[user.role]}>{roleLabel[user.role]}</Badge>
                    </div>
                  </div>
                  <Link href="/me/profile" className={cn("block", linkClass("/me/profile"))}>Profile</Link>
                  <form action={signOutAction}>
                    <Button type="submit" variant="outline" className="w-full">Sign out</Button>
                  </form>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild><Link href="/login">Log in</Link></Button>
                  <Button className="flex-1" asChild><Link href="/signup">Sign up</Link></Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
