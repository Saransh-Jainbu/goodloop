import { Reveal } from "./Reveal";

const tracks = [
  {
    label: "For volunteers",
    steps: [
      ["Find", "Browse listings and filter by date, cause and location."],
      ["Check the details", "Read what it involves and see exactly where it is on the map."],
      ["Register interest", "One click, and the organiser knows you're coming."],
    ],
  },
  {
    label: "For organisers",
    steps: [
      ["Sign up", "Create an organiser account and wait for a quick admin approval."],
      ["Post your event", "Add a title, description, date, location and cause."],
      ["See who's coming", "Review everyone who registered interest, and update the listing any time."],
    ],
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Simple for both sides.</h2>
        </Reveal>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          {tracks.map((t, ti) => (
            <Reveal key={t.label} delay={ti * 150}>
              <h3 className="text-lg font-semibold">{t.label}</h3>
              <ol className="relative mt-6 space-y-8 border-l-2 border-primary/20 pl-8">
                {t.steps.map(([title, text], i) => (
                  <li key={title} className="relative">
                    <span className="absolute -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-4 ring-muted/40">
                      {i + 1}
                    </span>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-muted-foreground">{text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
