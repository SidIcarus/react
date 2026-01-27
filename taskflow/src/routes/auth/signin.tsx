import { createFileRoute } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { SigninForm } from "@/components/auth/SigninForm";

type SigninSearch = {
  redirect?: string;
  message?: string;
};

export const Route = createFileRoute("/auth/signin")({
  validateSearch: (search: Record<string, unknown>): SigninSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  component: Signin,
});

function Signin() {
  const { message } = Route.useSearch();

  return (
    <AuthTemplate>
      <SigninForm successMessage={message} />
    </AuthTemplate>
  );
}
