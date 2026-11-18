import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FinalCta, Footer, Trust } from "@/components/landing/TrustCtaFooter";
import { CAUSES } from "@/features/events/types";

const causeLabel: Record<(typeof CAUSES)[number], string> = {
  ENVIRONMENT: "Environment",
  EDUCATION: "Education",
  HEALTH: "Health",
  COMMUNITY: "Community",
  ANIMALS: "Animals",
  OTHER: "And more",
};

export default function HomePage() {
  // Repeated so the marquee loops seamlessly with translateX(-50%).
  const marquee = [...CAUSES, ...CAUSES, ...CAUSES, ...CAUSES];

  // The root layout wraps pages in a centred container; this breaks out so sections run edge to edge.
  return (
    <div className="relative left-1/2 -mt-8 -mb-8 w-screen -translate-x-1/2">
      <Hero />

      <section aria-label="Causes" className="border-b bg-background py-6">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-3 motion-reduce:animate-none">
            {marquee.map((c, i) => (
              <span key={`${c}-${i}`} className="rounded-full border bg-card px-5 py-2 text-sm font-medium text-muted-foreground shadow-sm">
                {causeLabel[c]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Trust />
      <FinalCta />
      <Footer />
    </div>
  );
}
