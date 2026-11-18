import Link from "next/link";
import { ArrowRight, CalendarDays, Check, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SilkShader } from "./SilkShader";
import { MiniMap } from "./MiniMap";

const sample = [
  { title: "Riverside clean-up", cause: "Environment", when: "Sat · 9:00 AM", where: "Riverside Park" },
  { title: "Food bank sorting", cause: "Community", when: "Sun · 11:00 AM", where: "Community Hall" },
  { title: "Reading buddies", cause: "Education", when: "Wed · 4:30 PM", where: "Public Library" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <SilkShader />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <div>
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> Volunteering, made local
          </span>
          <h1 className="mt-6 animate-fade-up text-5xl font-bold leading-[1.03] tracking-tight [animation-delay:120ms] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
            Do good,
            <br />
            <span className="animate-shimmer bg-gradient-to-r from-emerald-200 via-white to-emerald-200 bg-[length:200%_100%] bg-clip-text text-transparent">
              close to home.
            </span>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg text-white/90 [animation-delay:240ms] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            GoodLoop connects volunteers with local opportunities. Browse and filter what&apos;s happening near you,
            register your interest, or list your own event and see who&apos;s coming.
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:360ms]">
            <Button size="lg" className="group bg-white text-emerald-950 hover:bg-white/90" asChild>
              <Link href="/events">
                Browse events
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-black/30 text-white backdrop-blur-md hover:bg-black/45 hover:text-white"
              asChild
            >
              <Link href="/signup?as=organiser">I&apos;m an organiser</Link>
            </Button>
          </div>
          <ul className="mt-8 flex animate-fade-up flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 [animation-delay:480ms]">
            {["Free to join", "Organisers approved by admins", "Filter by date, cause and place"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-300" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Product preview (illustrative sample data) */}
        <div className="relative animate-fade-up [animation-delay:300ms]" aria-hidden>
          <div className="animate-float rounded-2xl border border-white/20 bg-black/45 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-2 px-2 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
              <span className="ml-3 rounded-md bg-white/10 px-3 py-0.5 text-[11px] text-white/60">/events</span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-white/40">Sample data</span>
            </div>
            <div className="flex flex-wrap gap-2 px-2 pb-3 text-xs">
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><CalendarDays className="h-3.5 w-3.5" /> This weekend</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/25 px-3 py-1 text-emerald-100"><SlidersHorizontal className="h-3.5 w-3.5" /> Environment</span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><MapPin className="h-3.5 w-3.5" /> Near me</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1.15fr_1fr]">
              <div className="space-y-2.5">
                {sample.map((e, i) => (
                  <div
                    key={e.title}
                    className={`rounded-xl border p-3 ${i === 0 ? "border-emerald-300/40 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{e.title}</p>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">{e.cause}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/65">{e.when} · {e.where}</p>
                    {i === 0 && (
                      <span className="mt-2.5 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-emerald-950">
                        I&apos;m interested
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <MiniMap dark className="min-h-[180px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
