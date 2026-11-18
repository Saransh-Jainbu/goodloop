import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { LogoMark } from "@/components/Logo";
import { SignupForm } from "@/features/auth/SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const { as } = await searchParams;
  return (
    <div className="mx-auto max-w-md py-6 sm:py-12">
      <div className="mb-6 text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-3xl font-bold">Create your account</h1>
        <p className="mt-1 text-muted-foreground">Join GoodLoop and start making a difference nearby.</p>
      </div>
      <Card className="shadow-lg shadow-primary/5">
        <CardContent className="p-6 sm:p-8">
          <SignupForm defaultType={as === "organiser" ? "ORGANISER" : "USER"} />
        </CardContent>
      </Card>
    </div>
  );
}
