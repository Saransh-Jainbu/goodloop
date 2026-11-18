import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader><CardTitle>Log in</CardTitle></CardHeader>
      <CardContent><LoginForm callbackUrl={callbackUrl} /></CardContent>
    </Card>
  );
}
