import { createFileRoute } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

type ForgotPasswordSearch = {
  error?: string;
};

export const Route = createFileRoute("/auth/forgotpassword")({
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
