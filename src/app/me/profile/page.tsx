// /me/profile: edit your name and change your password.
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NameForm, PasswordForm } from "@/features/auth/ProfileForms";
import { getCurrentUser } from "@/lib/session";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/me/profile");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/me" className="text-sm text-muted-foreground hover:underline">&larr; My registrations</Link>
        <h1 className="mt-2 text-2xl font-semibold">Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle as="h2" className="text-lg">Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <NameForm name={user.name ?? ""} email={user.email} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle as="h2" className="text-lg">Change password</CardTitle>
          <CardDescription>Use at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
