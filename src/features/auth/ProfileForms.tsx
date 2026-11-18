"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, updateProfile } from "./profile-actions";
import type { ProfileState } from "./profile-schema";

function Feedback({ state }: { state: ProfileState }) {
  if (state?.error) return <p role="alert" className="text-sm text-destructive">{state.error}</p>;
  if (state?.success) return <p role="status" className="text-sm text-primary">{state.success}</p>;
  return null;
}

function Field({
  id, label, error, ...props
}: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function NameForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field id="name" label="Name" defaultValue={name} required error={state?.fieldErrors?.name} autoComplete="name" />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled readOnly />
        <p className="text-xs text-muted-foreground">Your email can&apos;t be changed.</p>
      </div>
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="space-y-4" key={state?.success ? "done" : "form"}>
      <Field id="currentPassword" label="Current password" type="password" required autoComplete="current-password" error={state?.fieldErrors?.currentPassword} />
      <Field id="newPassword" label="New password" type="password" required autoComplete="new-password" error={state?.fieldErrors?.newPassword} />
      <Field id="confirmPassword" label="Confirm new password" type="password" required autoComplete="new-password" error={state?.fieldErrors?.confirmPassword} />
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>{pending ? "Updating…" : "Change password"}</Button>
    </form>
  );
}
