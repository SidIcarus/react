import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPasswordSearch = {
  email?: string;
  name?: string;
};

export const Route = createFileRoute("/auth/resetpassword")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    email: typeof search.email === "string" ? search.email : undefined,
    name: typeof search.name === "string" ? search.name : undefined,
  }),
  beforeLoad: ({ search }) => {
    // Redirect if missing required params
    if (!search.email || !search.name) {
      throw redirect({ to: "/auth/forgotpassword" });
    }
  },
  component: ResetPassword,
});

function ResetPassword() {
  const { email, name } = Route.useSearch();

  return (
    <AuthTemplate>
      <ResetPasswordForm email={email!} name={name!} />
    </AuthTemplate>
  );
}
