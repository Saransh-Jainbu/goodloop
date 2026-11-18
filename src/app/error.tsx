"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center" role="alert">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlert className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">An unexpected error happened. You can try again, or head back home.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild><Link href="/">Go home</Link></Button>
      </div>
    </div>
  );
}
