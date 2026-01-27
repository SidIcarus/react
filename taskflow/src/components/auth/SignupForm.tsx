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

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false; // RFC 5321 max length

  const [local, domain] = email.split("@");

  if (!local || !domain) return false;
  if (local.length > 64) return false; // RFC 5321 local part max

  // Must have at least SLD.TLD (e.g., example.com)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  // TLD must be at least 2 characters
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  return emailRegex.test(email);
}

const validators = {
  name: (value: string) => (!value ? "Name is required" : null),
  email(value: string) {
    if (!value) return "Email is required";
    if (!isValidEmail(value)) return "Invalid email";
    return null;
  },
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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const nameId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate({ to: "/auth/signin" });
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Sign up failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    const nameError = validators.name(name);
    if (nameError) newErrors.name = nameError;

    const emailError = validators.email(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.password(password);
    if (passwordError) newErrors.password = passwordError;

    const confirmError = validators.confirmPassword(confirmPassword, password);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onNameBlur() {
    const error = validators.name(name);
    if (error) setErrors((prev) => ({ ...prev, name: error }));
  }

  function onNameChange(newName: string) {
    setName(newName);

    // clear error when typing
    if (errors.name && newName) {
      setErrors((prev) => {
        const { name: _, ...rest } = prev;
        return rest;
      });
    }
  }

  function onEmailBlur() {
    const error = validators.email(email);
    if (error) setErrors((prev) => ({ ...prev, email: error }));
  }

  function onEmailChange(newEmail: string) {
    setEmail(newEmail);

    // clear error when typing
    if (errors.email && newEmail) {
      setErrors((prev) => {
        const { email: _, ...rest } = prev;
        return rest;
      });
    }
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
          <h1 className="text-2xl font-bold">Sign up</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to signup for an account
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
            disabled={isSubmitting}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onNameBlur}
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
            disabled={isSubmitting}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={onEmailBlur}
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
              !!errors.name ||
              !!errors.email ||
              !!errors.password ||
              !!errors.confirmPassword ||
              !name ||
              !email ||
              !password ||
              !confirmPassword
            }
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
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
