import { useId } from "react";
import { cn } from "@/lib/utils";

/** GoodLoop mark: a loop (the "loop" of giving back) with a heart in the centre. */
export function LogoMark({ className }: { className?: string }) {
  const gid = `gl-g-${useId().replace(/:/g, "")}`; // unique per instance so ids never repeat on a page
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("h-8 w-8", className)}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gid})`} />
      <path
        d="M16 7.5a8.5 8.5 0 1 0 8.2 6.3"
        fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"
      />
      <path d="M22.6 8.4l1.9 5.2-5.2-.9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16 20.4s-3.6-2.2-3.6-4.7a2 2 0 0 1 3.6-1.2 2 2 0 0 1 3.6 1.2c0 2.5-3.6 4.7-3.6 4.7z"
        fill="#fff"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-heading text-lg font-bold tracking-tight", className)}>
      <LogoMark />
      <span>GoodLoop</span>
    </span>
  );
}
