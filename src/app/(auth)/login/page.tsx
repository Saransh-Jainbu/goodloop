import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { LogoMark } from "@/components/Logo";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return (
    <div className="mx-auto max-w-md py-6 sm:py-12">
      <div className="mb-6 text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">Log in to find and manage volunteering opportunities.</p>
      </div>
      <Card className="shadow-lg shadow-primary/5">
        <CardContent className="p-6 sm:p-8"><LoginForm callbackUrl={callbackUrl} /></CardContent>
      </Card>
    </div>
  );
}
