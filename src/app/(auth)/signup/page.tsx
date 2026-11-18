import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/features/auth/SignupForm";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const { as } = await searchParams;
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader><CardTitle>Create your account</CardTitle></CardHeader>
      <CardContent><SignupForm defaultType={as === "organiser" ? "ORGANISER" : "USER"} /></CardContent>
    </Card>
  );
}
