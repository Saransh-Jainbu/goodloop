import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Do good, close to home.</h1>
      <p className="mt-4 text-muted-foreground">
        Discover local volunteering opportunities, or list your own and find the people to help.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button size="lg" asChild><Link href="/events">Browse events</Link></Button>
        <Button size="lg" variant="outline" asChild><Link href="/signup?as=organiser">I&apos;m an organiser</Link></Button>
      </div>
    </section>
  );
}
