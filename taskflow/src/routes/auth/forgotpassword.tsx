import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getInitialAuthState } from "@/contexts/auth/getInitialAuthState";

type ForgotPasswordSearch = {
  error?: string;
};

export const Route = createFileRoute("/auth/forgotpassword")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const { isAuthenticated } = getInitialAuthState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  validateSearch: (search: Record<string, unknown>): ForgotPasswordSearch => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const { error } = Route.useSearch();

  return (
    <AuthTemplate>
      <ForgotPasswordForm errorMessage={error} />
    </AuthTemplate>
  );
}
