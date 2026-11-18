// OWNER: Anousha. Previous/next links that keep the current filters (all state lives in the URL).
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      const value = Array.isArray(v) ? v[0] : v;
      if (value && k !== "page") qs.set(k, value);
    }
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `/events?${s}` : "/events";
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={href(page - 1)} rel="prev">
            <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
          </Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Button asChild variant="outline" size="sm">
          <Link href={href(page + 1)} rel="next">
            Next <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
