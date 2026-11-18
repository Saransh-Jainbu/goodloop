// OWNER: Anousha. Skeleton for the event detail page.
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading event">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-40 sm:h-52" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="order-last space-y-4 lg:order-none lg:col-span-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-72" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
