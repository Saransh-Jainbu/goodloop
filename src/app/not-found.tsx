import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted-foreground">It may have moved, or the link might be wrong.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link href="/events">Browse events</Link></Button>
        <Button variant="outline" asChild><Link href="/">Go home</Link></Button>
      </div>
    </div>
  );
}
