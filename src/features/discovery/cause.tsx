// OWNER: Anousha. One colour + icon per cause, reused on cards and the detail page.
// (Full class names are listed so Tailwind can see them.)
import { Leaf, GraduationCap, HeartPulse, Users, PawPrint, Sparkles, type LucideIcon } from "lucide-react";
import type { Cause } from "@/features/events/types";
import { cn } from "@/lib/utils";

type CauseMeta = { label: string; icon: LucideIcon; badge: string; tile: string };

export const CAUSE_META: Record<Cause, CauseMeta> = {
  ENVIRONMENT: { label: "Environment", icon: Leaf, badge: "bg-green-100 text-green-800", tile: "from-green-100 to-green-50 text-green-700" },
  EDUCATION: { label: "Education", icon: GraduationCap, badge: "bg-blue-100 text-blue-800", tile: "from-blue-100 to-blue-50 text-blue-700" },
  HEALTH: { label: "Health", icon: HeartPulse, badge: "bg-rose-100 text-rose-800", tile: "from-rose-100 to-rose-50 text-rose-700" },
  COMMUNITY: { label: "Community", icon: Users, badge: "bg-amber-100 text-amber-800", tile: "from-amber-100 to-amber-50 text-amber-700" },
  ANIMALS: { label: "Animals", icon: PawPrint, badge: "bg-orange-100 text-orange-800", tile: "from-orange-100 to-orange-50 text-orange-700" },
  OTHER: { label: "Other", icon: Sparkles, badge: "bg-slate-100 text-slate-800", tile: "from-slate-100 to-slate-50 text-slate-700" },
};

export const causeLabel = (cause: Cause) => CAUSE_META[cause].label;

export function CauseBadge({ cause, className }: { cause: Cause; className?: string }) {
  const { label, icon: Icon, badge } = CAUSE_META[cause];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", badge, className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}

/** Large tinted tile with the cause icon, used as the card/detail "image". */
export function CauseTile({ cause, className }: { cause: Cause; className?: string }) {
  const { icon: Icon, tile } = CAUSE_META[cause];
  return (
    <div aria-hidden className={cn("flex items-center justify-center bg-gradient-to-br", tile, className)}>
      <Icon className="h-1/3 w-1/3 opacity-70" strokeWidth={1.5} />
    </div>
  );
}
