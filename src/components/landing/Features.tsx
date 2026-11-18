import { CalendarDays, Check, Link2, MapPin, MousePointerClick, SlidersHorizontal, Users, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { MiniMap } from "./MiniMap";
import { CAUSES } from "@/features/events/types";

const causeLabel: Record<(typeof CAUSES)[number], string> = {
  ENVIRONMENT: "Environment",
  EDUCATION: "Education",
  HEALTH: "Health",
  COMMUNITY: "Community",
  ANIMALS: "Animals",
  OTHER: "Other",
};

const card =
  "group relative h-full overflow-hidden rounded-3xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10";

function Glow() {
  return (
    <div
      className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-transform duration-500 group-hover:scale-150"
      aria-hidden
    />
  );
}

export function Features() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Everything in one place</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            From &ldquo;I want to help&rdquo; to showing up.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Volunteers find the right opportunity quickly. Organisers see who&apos;s coming. Admins keep it all trustworthy.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {/* Browse & filter */}
          <Reveal className="lg:col-span-3">
            <div className={card}>
              <Glow />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-xl font-semibold">Browse and filter</h3>
              <p className="relative mt-2 text-muted-foreground">
                Narrow opportunities by date, cause and location. Filters live in the link, so any search can be shared.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2" aria-hidden>
                {CAUSES.map((c, i) => (
                  <span
                    key={c}
                    className={`rounded-full border px-3.5 py-1.5 text-sm ${i === 0 ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}
                  >
                    {causeLabel[c]}
                  </span>
                ))}
              </div>
              <div className="relative mt-4 flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2 text-xs text-muted-foreground" aria-hidden>
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">/events?cause=ENVIRONMENT&amp;from=2026-12-05&amp;location=Riverside</span>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal className="lg:col-span-3" delay={120}>
            <div className={card}>
              <Glow />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-xl font-semibold">See it on the map</h3>
              <p className="relative mt-2 text-muted-foreground">
                Every listing is pinned on an OpenStreetMap view, so you can pick what&apos;s actually close to you.
              </p>
              <MiniMap className="relative mt-6 h-44 border" />
            </div>
          </Reveal>

          {/* Register */}
          <Reveal className="lg:col-span-2">
            <div className={card}>
              <Glow />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-xl font-semibold">Register in one click</h3>
              <p className="relative mt-2 text-muted-foreground">
                Tell the organiser you&apos;re interested, and cancel any time from your registrations.
              </p>
              <div className="relative mt-6 flex items-center justify-between rounded-2xl border bg-background p-4" aria-hidden>
                <div>
                  <p className="text-sm font-semibold">Riverside clean-up</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3 w-3" /> Sat · 9:00 AM</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                  <Check className="h-3.5 w-3.5" /> Registered
                </span>
              </div>
            </div>
          </Reveal>

          {/* Organisers */}
          <Reveal className="lg:col-span-2" delay={120}>
            <div className={card}>
              <Glow />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-xl font-semibold">Organisers stay in control</h3>
              <p className="relative mt-2 text-muted-foreground">
                Create and update listings, then review exactly who registered interest.
              </p>
              <div className="relative mt-6 space-y-2" aria-hidden>
                {["Alex M.", "Priya S.", "Jordan K."].map((n, i) => (
                  <div key={n} className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {n[0]}
                    </span>
                    <span className="text-sm">{n}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{i === 0 ? "just now" : `${i * 2}h ago`}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Admin */}
          <Reveal className="lg:col-span-2" delay={240}>
            <div className={card}>
              <Glow />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-xl font-semibold">Reviewed by admins</h3>
              <p className="relative mt-2 text-muted-foreground">
                New organisers are approved before they can post, and inappropriate listings get removed.
              </p>
              <div className="relative mt-6 flex items-center justify-between rounded-2xl border bg-background p-4" aria-hidden>
                <div>
                  <p className="text-sm font-semibold">New organiser</p>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground"><X className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
