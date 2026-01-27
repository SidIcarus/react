import { Link, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

const validators = {
  password(value: string) {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return null;
  },
  confirmPassword(value: string, password: string) {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return null;
  },
};

interface ResetPasswordFormProps extends React.ComponentProps<"form"> {
  email: string;
  name: string;
}

export function ResetPasswordForm({
  email,
  name,
  className,
  ...props
}: ResetPasswordFormProps) {
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const nameId = useId();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await resetPassword(name, email, password);

      navigate({
        to: "/auth/signin",
        search: { message: "Password reset successfully. Please sign in" },
      });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    const passwordError = validators.password(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validators.confirmPassword(confirmPassword, password);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onPasswordBlur() {
    const error = validators.password(password);
    if (error) setErrors((prev) => ({ ...prev, password: error }));
  }

  function onPasswordChange(newPassword: string) {
    setPassword(newPassword);

    // clear error when typing
    if (errors.password && newPassword) {
      setErrors((prev) => {
        const { password: _, ...rest } = prev;
        return rest;
      });
    }

    if (errors.confirmPassword) {
      setErrors((prev) => {
        const { confirmPassword: _, ...rest } = prev;
        return rest;
      });
    }
  }

  function onConfirmPasswordBlur() {
    const error = validators.confirmPassword(confirmPassword, password);
    if (error) {
      setErrors((prev) => ({ ...prev, confirmPassword: error }));
    } else {
      setErrors((prev) => {
        const { confirmPassword: _, ...rest } = prev;
        return rest;
      });
    }
  }

  function onConfirmPasswordChange(newConfirmPassword: string) {
    setConfirmPassword(newConfirmPassword);

    // clear error when typing
    if (errors.confirmPassword && newConfirmPassword) {
      setErrors((prev) => {
        const { confirmPassword: _, ...rest } = prev;
        return rest;
      });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {errors.form && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {errors.form}
          </div>
        )}

        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below to reset it
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor={nameId}>Name</FieldLabel>
          <Input
            id={nameId}
            type="text"
            placeholder="Name McLastName"
            required
            value={name}
            disabled
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor={emailId}>Email</FieldLabel>
          <Input
            id={emailId}
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            disabled
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          </div>
          <Input
            id={passwordId}
            type="password"
            required
            value={password}
            disabled={isSubmitting}
            onChange={(e) => onPasswordChange(e.target.value)}
            onBlur={onPasswordBlur}
          />
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor={confirmPasswordId}>
              Confirm Password
            </FieldLabel>
          </div>
          <Input
            id={confirmPasswordId}
            type="password"
            required
            value={confirmPassword}
            disabled={isSubmitting}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            onBlur={onConfirmPasswordBlur}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword}</FieldError>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !!errors.password ||
              !!errors.confirmPassword ||
              !password ||
              !confirmPassword
            }
          >
            {isSubmitting ? "Resetting password..." : "Reset password"}
          </Button>
        </Field>
        <FieldSeparator>Have an account?</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            <Link to="/auth/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
