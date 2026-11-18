"use client";
// OWNER: Anousha. Error state for /events/[id].
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-lg border p-10 text-center">
      <TriangleAlert className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="font-medium">Something went wrong loading this opportunity.</p>
      <div className="mt-4 flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/events">Back to events</Link>
        </Button>
      </div>
    </div>
  );
}
