// OWNER: Anousha.
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rounded-lg border p-10 text-center">
      <p className="font-medium">We couldn&apos;t find that opportunity.</p>
      <Button asChild className="mt-4">
        <Link href="/events">Back to events</Link>
      </Button>
    </div>
  );
}
