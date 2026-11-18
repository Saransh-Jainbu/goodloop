// OWNER: Anousha. Skeleton for /events while the list loads.
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading events">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-40 sm:h-28" />
      <Skeleton className="h-4 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <Skeleton className="h-24 rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
