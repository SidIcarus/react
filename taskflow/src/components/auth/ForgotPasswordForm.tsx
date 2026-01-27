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

const RESET_TOKEN_EXPIRY_MINUTES = 15 * 60 * 1000;

interface ForgotPasswordFormProps extends React.ComponentProps<"form"> {
  errorMessage?: string;
}

export function ForgotPasswordForm({
  className,
  errorMessage,
  ...props
}: ForgotPasswordFormProps) {
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

      const expiresAt = Date.now() + RESET_TOKEN_EXPIRY_MINUTES;

      navigate({
        to: "/auth/resetpassword",
        search: { email: user.email, name: user.name, expiresAt },
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
        {(error || errorMessage) && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error || errorMessage}
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
