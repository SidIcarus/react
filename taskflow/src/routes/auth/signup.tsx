import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { SignupForm } from "@/components/auth/SignupForm";
import { getInitialAuthState } from "@/contexts/auth/getInitialAuthState";

export const Route = createFileRoute("/auth/signup")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const { isAuthenticated } = getInitialAuthState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: Signup,
});

function Signup() {
  return (
    <AuthTemplate>
      <SignupForm />
    </AuthTemplate>
  );
}
