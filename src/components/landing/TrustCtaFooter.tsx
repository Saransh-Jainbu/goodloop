import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { SilkShader } from "./SilkShader";

const trust = [
  { icon: ShieldCheck, title: "Organisers are vetted", text: "Every organiser account is reviewed and approved by an admin before they can post." },
  { icon: Trash2, title: "Listings are moderated", text: "Admins can remove anything inappropriate, so the board stays useful and safe." },
  { icon: Lock, title: "Only owners can edit", text: "Organisers can change their own events only, and every action is checked on the server." },
];

export function Trust() {
  return (
    <section className="bg-emerald-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Built on trust</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Good intentions, protected.</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {trust.map((t, i) => (
            <Reveal key={t.title} delay={i * 120}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-7 transition-colors hover:bg-white/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-white/70">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <SilkShader />
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl">
          Your neighbourhood needs you.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Find your first opportunity today, or list an event and bring in the help you need.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="group bg-white text-emerald-950 hover:bg-white/90" asChild>
            <Link href="/signup">
              Create a free account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/40 bg-black/30 text-white backdrop-blur-md hover:bg-black/45 hover:text-white" asChild>
            <Link href="/events">Browse events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <p><span className="font-semibold text-primary">GoodLoop</span> · Volunteering, made local.</p>
        <nav className="flex gap-6">
          <Link href="/events" className="hover:text-foreground">Events</Link>
          <Link href="/login" className="hover:text-foreground">Log in</Link>
          <Link href="/signup" className="hover:text-foreground">Sign up</Link>
          <Link href="/signup?as=organiser" className="hover:text-foreground">Organise</Link>
        </nav>
      </div>
    </footer>
  );
}
