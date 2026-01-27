import { createFileRoute } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { SignupForm } from "@/components/auth/SignupForm";

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
});

function Signup() {
  return (
    <AuthTemplate>
      <SignupForm />
    </AuthTemplate>
  );
}
