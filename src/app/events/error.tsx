"use client";
// OWNER: Anousha.
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border p-10 text-center">
      <p className="font-medium">Something went wrong loading opportunities.</p>
      <Button className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
