import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPasswordSearch = {
  email?: string;
  name?: string;
  expiresAt?: number;
};

export const Route = createFileRoute("/auth/resetpassword")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    email: typeof search.email === "string" ? search.email : undefined,
    name: typeof search.name === "string" ? search.name : undefined,
    expiresAt:
      typeof search.expiresAt === "number" ? search.expiresAt : undefined,
  }),
  beforeLoad: ({ search }) => {
    // Redirect if missing required params
    if (!search.email || !search.name || !search.expiresAt) {
      throw redirect({ to: "/auth/forgotpassword" });
    }

    // Redirect if expired
    if (Date.now() > search.expiresAt) {
      throw redirect({
        to: "/auth/forgotpassword",
        search: { error: "Reset link has expired. Please try again." },
      });
    }
  },
  component: ResetPassword,
});

function ResetPassword() {
  const { email, expiresAt, name } = Route.useSearch();

  return (
    <AuthTemplate>
      <ResetPasswordForm email={email!} name={name!} expiresAt={expiresAt!} />
    </AuthTemplate>
  );
}
