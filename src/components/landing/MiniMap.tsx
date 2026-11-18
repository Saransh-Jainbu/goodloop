import { cn } from "@/lib/utils";

const pins = [
  { x: "28%", y: "30%", delay: "0s" },
  { x: "62%", y: "22%", delay: "0.6s" },
  { x: "48%", y: "58%", delay: "1.2s" },
  { x: "76%", y: "70%", delay: "0.3s" },
  { x: "20%", y: "74%", delay: "0.9s" },
];

/** Decorative stylised map (no real data). */
export function MiniMap({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-xl",
        dark ? "bg-emerald-950/60" : "bg-emerald-50",
        className,
      )}
    >
      <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g fill="none" strokeLinecap="round" className={dark ? "stroke-white/15" : "stroke-emerald-900/10"}>
          <path d="M-10 40 L210 70" strokeWidth="5" />
          <path d="M-10 110 L210 90" strokeWidth="4" />
          <path d="M60 -10 L90 170" strokeWidth="4" />
          <path d="M140 -10 L120 170" strokeWidth="5" />
          <path d="M-10 75 L210 130" strokeWidth="2" />
          <path d="M30 -10 L10 170" strokeWidth="2" />
        </g>
        <path
          d="M-10 140 C 40 110, 80 150, 130 120 S 190 100, 215 112"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className={dark ? "stroke-emerald-400/25" : "stroke-emerald-300/60"}
        />
      </svg>
      {pins.map((p, i) => (
        <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: p.x, top: p.y }}>
          <span
            className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60 motion-reduce:animate-none"
            style={{ animationDelay: p.delay }}
          />
          <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-md" />
        </span>
      ))}
    </div>
  );
}
