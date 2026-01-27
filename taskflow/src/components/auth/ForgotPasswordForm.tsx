import { useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const emailId = useId();

  const { forgetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await forgetPassword(email);
      navigate({
        to: "/auth/resetpassword",
        search: { email: user.email, name: user.name },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Link failed to send");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Request password reset</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and we'll send you a a reset link
          </p>
        </div>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor={emailId}>Email</FieldLabel>
          <Input
            id={emailId}
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </Field>
        <FieldSeparator>Remember your password?</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            <a href="/auth/signup" className="underline underline-offset-4">
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
