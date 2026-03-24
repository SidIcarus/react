import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { SigninForm } from "@/components/auth/SigninForm";
import { getInitialAuthState } from "@/contexts/auth/getInitialAuthState";

type SigninSearch = {
  redirect?: string;
  message?: string;
};

export const Route = createFileRoute("/auth/signin")({
  validateSearch: (search: Record<string, unknown>): SigninSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const { isAuthenticated } = getInitialAuthState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: SigninPage,
});

function SigninPage() {
  const { message } = Route.useSearch();

  return (
    <AuthTemplate>
      <SigninForm successMessage={message} />
    </AuthTemplate>
  );
}
